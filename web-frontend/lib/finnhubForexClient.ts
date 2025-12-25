'use client'

import { ForexRatesResponse, ForexSymbol } from '../types/finnhub'

const BACKEND_WS_URL = process.env.NEXT_PUBLIC_BACKEND_WS_URL || 'ws://localhost:8080/ws/finnhub'
const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:8080/api'

type MessageHandler = (data: any) => void
type StatusHandler = (status: 'connected' | 'disconnected' | 'error' | 'connecting') => void

export class FinnhubForexClient {
    private ws: WebSocket | null = null
    private symbolsCache: Map<string, ForexSymbol[]> = new Map()
    private symbolsPromise: Map<string, Promise<ForexSymbol[]>> = new Map()
    private messageHandlers: Set<MessageHandler> = new Set()
    private statusHandlers: Set<StatusHandler> = new Set()
    private forexRates: ForexRatesResponse = {}
    private reconnectAttempts = 0
    private maxReconnects = 5
    private reconnectTimeout: NodeJS.Timeout | null = null
    private subscribedSymbols: Set<string> = new Set()
    private isConnecting = false

    /**
     * Fetch forex symbols with caching and proper error handling
     */
    public async fetchSymbols(exchange = 'oanda'): Promise<ForexSymbol[]> {
        const exch = exchange.toLowerCase()

        // Check cache first
        if (this.symbolsCache.has(exch)) {
            console.log(`✅ Using cached symbols for ${exch}`)
            return this.symbolsCache.get(exch)!
        }

        // Check if a request is already in progress
        if (this.symbolsPromise.has(exch)) {
            console.log(`⏳ Request already in progress for ${exch}, waiting...`)
            return this.symbolsPromise.get(exch)!
        }

        // Create a new request promise
        const promise = (async () => {
            try {
                console.log(`🌐 Fetching forex symbols for ${exch} from: ${BACKEND_API_URL}/finnhub/forex/symbols`)
                
                const response = await fetch(
                    `${BACKEND_API_URL}/finnhub/forex/symbols?exchange=${exch}`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        // Add timeout
                        signal: AbortSignal.timeout(10000) // 10 second timeout
                    }
                )

                if (!response.ok) {
                    const errorText = await response.text()
                    throw new Error(`HTTP ${response.status}: ${errorText}`)
                }

                const result = await response.json()
                console.log('📦 Raw API response:', result)

                // ⭐ FIX: Handle the correct response structure from your backend
                if (result.success && Array.isArray(result.symbols)) {
                    console.log(`✅ Successfully fetched ${result.count} symbols for ${exch}`)
                    this.symbolsCache.set(exch, result.symbols)
                    return result.symbols
                } else if (result.success && Array.isArray(result.data)) {
                    // Alternative structure
                    console.log(`✅ Successfully fetched ${result.count} symbols for ${exch}`)
                    this.symbolsCache.set(exch, result.data)
                    return result.data
                } else if (Array.isArray(result)) {
                    // Direct array response
                    console.log(`✅ Successfully fetched ${result.length} symbols for ${exch}`)
                    this.symbolsCache.set(exch, result)
                    return result
                } else {
                    console.error('❌ Unexpected response structure:', result)
                    throw new Error('Invalid response format from server')
                }
            } catch (err) {
                console.error(`❌ Error fetching forex symbols for ${exch}:`, err)
                if (err instanceof Error) {
                    console.error('Error details:', err.message)
                }
                throw err
            } finally {
                this.symbolsPromise.delete(exch)
            }
        })()

        this.symbolsPromise.set(exch, promise)
        return promise
    }

    /**
     * Get all available exchanges
     */
    public async getExchanges() {
        try {
            const response = await fetch(`${BACKEND_API_URL}/finnhub/forex/exchanges`)
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`)
            }
            const result = await response.json()
            return result.success ? result.exchanges : []
        } catch (error) {
            console.error('❌ Error fetching exchanges:', error)
            return []
        }
    }

    /**
     * Search for symbols
     */
    public async searchSymbols(query: string): Promise<any[]> {
        try {
            if (!query || query.trim() === '') {
                return []
            }

            const response = await fetch(
                `${BACKEND_API_URL}/finnhub/search?q=${encodeURIComponent(query)}`
            )
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`)
            }

            const result = await response.json()
            return result.success ? result.results : []
        } catch (error) {
            console.error('❌ Error searching symbols:', error)
            return []
        }
    }

    /**
     * Get quote for a specific symbol
     */
    public async getQuote(symbol: string) {
        try {
            const response = await fetch(
                `${BACKEND_API_URL}/finnhub/quote/${encodeURIComponent(symbol)}`
            )
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`)
            }

            const result = await response.json()
            return result.success ? result.data : null
        } catch (error) {
            console.error(`❌ Error fetching quote for ${symbol}:`, error)
            return null
        }
    }

    /**
     * Connect to backend WebSocket
     */
    public connect() {
        if (this.isConnecting) {
            console.log('⏳ Connection already in progress')
            return
        }

        if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
            console.log('✅ Already connected or connecting')
            return
        }

        this.isConnecting = true
        this.notifyStatus('connecting')

        console.log(`🔌 Connecting to Finnhub WebSocket: ${BACKEND_WS_URL}`)
        
        try {
            this.ws = new WebSocket(BACKEND_WS_URL)

            this.ws.onopen = () => {
                console.log('✅ Finnhub WebSocket connected')
                this.isConnecting = false
                this.reconnectAttempts = 0
                this.notifyStatus('connected')

                // Re-subscribe to existing symbols
                this.resubscribeAll()
            }

           this.ws.onmessage = (event) => {
    try {
        const message = JSON.parse(event.data)
        console.log('📨 WebSocket message:', message)

        if (message.type === 'connected') {
            console.log('🎉 WebSocket handshake complete:', message)
        } else if (message.type === 'trade' && message.data) {
            const trade = message.data
            const symbol = trade.s
            const price = trade.p
            const timestamp = trade.t

            // Update internal rates cache
            const prevPrice = this.forexRates[symbol]?.price || price
            const change = price - prevPrice
            const percentChange = prevPrice !== 0 ? (change / prevPrice) * 100 : 0  // ✅ Calculate percentChange

            this.forexRates[symbol] = {
                price,
                timestamp,
                change,
                percentChange  // ✅ Include percentChange
            }

            console.log(`💹 Price update: ${symbol} = $${price}`)

            // Notify all handlers
            this.messageHandlers.forEach(handler => {
                try {
                    handler(message)
                } catch (err) {
                    console.error('❌ Error in message handler:', err)
                }
            })
        } else if (message.type === 'subscribed') {
            console.log(`✅ Successfully subscribed to ${message.symbol}`)
        } else if (message.type === 'unsubscribed') {
            console.log(`🔕 Unsubscribed from ${message.symbol}`)
        } else if (message.type === 'error') {
            console.error('❌ Server error:', message.message)
        }
    } catch (error) {
        console.error('❌ Error parsing WebSocket message:', error, event.data)
    }
}


            this.ws.onclose = (event) => {
                console.log(`🔴 WebSocket closed - Code: ${event.code}, Reason: ${event.reason || 'None'}`)
                this.isConnecting = false
                this.ws = null
                this.notifyStatus('disconnected')
                this.attemptReconnect()
            }

            this.ws.onerror = (error) => {
                console.error('❌ WebSocket error:', error)
                this.isConnecting = false
                this.notifyStatus('error')
            }
        } catch (error) {
            console.error('❌ Failed to create WebSocket:', error)
            this.isConnecting = false
            this.notifyStatus('error')
        }
    }

    /**
     * Disconnect from WebSocket
     */
    public disconnect() {
        if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout)
            this.reconnectTimeout = null
        }

        if (this.ws) {
            console.log('🔌 Disconnecting WebSocket...')
            this.ws.close(1000, 'Client disconnect')
            this.ws = null
        }

        this.isConnecting = false
        this.notifyStatus('disconnected')
    }

    private attemptReconnect() {
        if (this.reconnectAttempts >= this.maxReconnects) {
            console.error(`❌ Max reconnection attempts (${this.maxReconnects}) reached`)
            return
        }

        this.reconnectAttempts++
        const delay = Math.min(2000 * this.reconnectAttempts, 30000)

        if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout)
        }

        console.log(`🔄 Reconnecting in ${delay / 1000}s (attempt ${this.reconnectAttempts}/${this.maxReconnects})...`)

        this.reconnectTimeout = setTimeout(() => {
            this.connect()
        }, delay)
    }

    private resubscribeAll() {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
            console.warn('⚠️ Cannot resubscribe - WebSocket not open')
            return
        }

        if (this.subscribedSymbols.size === 0) {
            console.log('ℹ️ No symbols to resubscribe')
            return
        }

        console.log(`🔄 Resubscribing to ${this.subscribedSymbols.size} symbols...`)
        this.subscribedSymbols.forEach(symbol => {
            console.log(`📡 Resubscribing to ${symbol}`)
            this.ws?.send(JSON.stringify({ type: 'subscribe', symbol }))
        })
    }

    /**
     * Subscribe to a symbol
     */
    public subscribe(symbol: string, handler: MessageHandler) {
        console.log(`📡 Subscribing to ${symbol}`)
        
        this.messageHandlers.add(handler)

        if (!this.subscribedSymbols.has(symbol)) {
            this.subscribedSymbols.add(symbol)
            
            if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                console.log(`📤 Sending subscribe message for ${symbol}`)
                this.ws.send(JSON.stringify({ type: 'subscribe', symbol }))
            } else {
                console.log(`⏳ WebSocket not ready, will subscribe to ${symbol} after connection`)
            }
        } else {
            console.log(`ℹ️ Already subscribed to ${symbol}`)
        }

        // Connect if not connected
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
            this.connect()
        }
    }

    /**
     * Unsubscribe from a symbol
     */
    public unsubscribe(symbol: string, handler?: MessageHandler) {
        if (handler) {
            this.messageHandlers.delete(handler)
        }

        if (this.subscribedSymbols.has(symbol)) {
            this.subscribedSymbols.delete(symbol)
            
            if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                console.log(`🔕 Unsubscribing from ${symbol}`)
                this.ws.send(JSON.stringify({ type: 'unsubscribe', symbol }))
            }
        }
    }

    /**
     * Register status change handler
     */
    public onStatus(handler: StatusHandler) {
        this.statusHandlers.add(handler)
    }

    /**
     * Unregister status change handler
     */
    public offStatus(handler: StatusHandler) {
        this.statusHandlers.delete(handler)
    }

    private notifyStatus(status: 'connected' | 'disconnected' | 'error' | 'connecting') {
        console.log(`📊 Status changed: ${status}`)
        this.statusHandlers.forEach(handler => {
            try {
                handler(status)
            } catch (err) {
                console.error('❌ Error in status handler:', err)
            }
        })
    }

    /**
     * Get current forex rates
     */
    public getRates() {
        return this.forexRates
    }

    /**
     * Get connection status
     */
    public getStatus(): 'connected' | 'disconnected' | 'connecting' {
        if (this.isConnecting) return 'connecting'
        if (this.ws?.readyState === WebSocket.OPEN) return 'connected'
        return 'disconnected'
    }

    /**
     * Get subscribed symbols
     */
    public getSubscribedSymbols(): string[] {
        return Array.from(this.subscribedSymbols)
    }

    /**
     * Clear cache
     */
    public clearCache() {
        console.log('🗑️ Clearing symbols cache')
        this.symbolsCache.clear()
        this.symbolsPromise.clear()
    }
}

// Singleton instance
let instance: FinnhubForexClient | null = null

export function getFinnhubForexClient(): FinnhubForexClient {
    if (!instance) {
        console.log('🚀 Creating new FinnhubForexClient singleton instance')
        instance = new FinnhubForexClient()
    }
    return instance
}

// Export for cleanup (useful in development/testing)
export function resetFinnhubForexClient() {
    if (instance) {
        instance.disconnect()
        instance = null
    }
}
