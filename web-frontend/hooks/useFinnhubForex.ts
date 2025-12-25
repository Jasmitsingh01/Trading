'use client'

import { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { ForexRatesResponse, ForexSymbol } from '../types/finnhub'
import { getFinnhubForexClient } from '../lib/finnhubForexClient'

interface UseFinnhubForexOptions {
  exchange?: string
  symbolsToSubscribe?: string | string[]
  autoConnect?: boolean
  autoSubscribe?: boolean
}

const useFinnhubForex = (options?: UseFinnhubForexOptions) => {
  const {
    exchange = 'oanda',
    symbolsToSubscribe,
    autoConnect = true,
    autoSubscribe = true
  } = options || {}

  const [forexRates, setForexRates] = useState<ForexRatesResponse>({})
  const [forexSymbols, setForexSymbols] = useState<ForexSymbol[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<'connected' | 'disconnected' | 'connecting' | 'error'>('disconnected')

  const client = useMemo(() => getFinnhubForexClient(), [])
  const messageHandlerRef = useRef<((message: any) => void) | null>(null)
  const statusHandlerRef = useRef<((status: any) => void) | null>(null)
  const subscribedSymbolsRef = useRef<Set<string>>(new Set())

  // Normalize symbolsToSubscribe to an array or null
  const targetSymbols = useMemo(() => {
    if (!symbolsToSubscribe) return null
    return Array.isArray(symbolsToSubscribe) ? symbolsToSubscribe : [symbolsToSubscribe]
  }, [symbolsToSubscribe])

  // Handler for WebSocket messages
  const handleMessage = useCallback((message: any) => {
    try {
      if (message.type === 'connected') {
        console.log('🎉 WebSocket handshake complete')
        return
      }

      if (message.type === 'trade' && message.data) {
        const trade = message.data
        const tradeSymbol = trade.s
        const price = trade.p
        const timestamp = trade.t

        console.log(`💹 Price update: ${tradeSymbol} = $${price}`)

        // If we have specific symbols to track, filter
        if (targetSymbols && !targetSymbols.includes(tradeSymbol)) {
          return
        }

        // Update forex rates with the new trade data
        setForexRates(prev => {
          const prevPrice = prev[tradeSymbol]?.price || price
          const change = price - prevPrice
          const percentChange = prevPrice !== 0 ? (change / prevPrice) * 100 : 0  // ✅ Calculate percentChange
          
          return {
            ...prev,
            [tradeSymbol]: {
              price,
              timestamp,
              change,
              percentChange  // ✅ Include it
            }
          }
        })
      } else if (message.type === 'subscribed') {
        console.log(`✅ Subscribed to ${message.symbol}`)
      } else if (message.type === 'unsubscribed') {
        console.log(`🔕 Unsubscribed from ${message.symbol}`)
      } else if (message.type === 'error') {
        console.error('❌ WebSocket error:', message.message)
        setError(message.message)
      }
    } catch (err) {
      console.error('❌ Error handling message:', err)
    }
  }, [targetSymbols])


  // Store handler reference
  useEffect(() => {
    messageHandlerRef.current = handleMessage
  }, [handleMessage])

  // Handler for connection status
  const handleStatus = useCallback((newStatus: 'connected' | 'disconnected' | 'connecting' | 'error') => {
    console.log(`📊 Connection status: ${newStatus}`)
    setStatus(newStatus)
  }, [])

  // Store status handler reference
  useEffect(() => {
    statusHandlerRef.current = handleStatus
  }, [handleStatus])

  // Fetch symbols from API
  const fetchSymbols = useCallback(async () => {
    try {
      console.log(`🌐 Fetching symbols for exchange: ${exchange}`)
      setLoading(true)
      setError(null)

      const symbols = await client.fetchSymbols(exchange)
      
      if (!symbols || symbols.length === 0) {
        throw new Error(`No symbols found for exchange: ${exchange}`)
      }

      console.log(`✅ Fetched ${symbols.length} symbols for ${exchange}`)
      setForexSymbols(symbols)
      
      return symbols
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch symbols'
      console.error('❌ Error fetching symbols:', errorMessage)
      setError(errorMessage)
      return []
    } finally {
      setLoading(false)
    }
  }, [exchange, client])

  // Subscribe to symbols
  const subscribeToSymbols = useCallback((symbols: string[]) => {
    if (!symbols || symbols.length === 0) {
      console.warn('⚠️ No symbols to subscribe to')
      return
    }

    console.log(`📡 Subscribing to ${symbols.length} symbols`)

    // Unsubscribe from old symbols not in new list
    subscribedSymbolsRef.current.forEach(oldSymbol => {
      if (!symbols.includes(oldSymbol) && messageHandlerRef.current) {
        console.log(`🔕 Unsubscribing from ${oldSymbol}`)
        client.unsubscribe(oldSymbol, messageHandlerRef.current)
        subscribedSymbolsRef.current.delete(oldSymbol)
      }
    })

    // Subscribe to new symbols
    symbols.forEach(symbol => {
      if (!subscribedSymbolsRef.current.has(symbol) && messageHandlerRef.current) {
        console.log(`📡 Subscribing to ${symbol}`)
        client.subscribe(symbol, messageHandlerRef.current)
        subscribedSymbolsRef.current.add(symbol)
      }
    })
  }, [client])

  // Unsubscribe from all symbols
  const unsubscribeFromAll = useCallback(() => {
    if (messageHandlerRef.current) {
      subscribedSymbolsRef.current.forEach(symbol => {
        console.log(`🔕 Unsubscribing from ${symbol}`)
        client.unsubscribe(symbol, messageHandlerRef.current!)
      })
    }
    subscribedSymbolsRef.current.clear()
  }, [client])

  // Initialize: Fetch symbols and subscribe
  useEffect(() => {
    let mounted = true

    const initialize = async () => {
      try {
        // Fetch symbols
        const symbols = await fetchSymbols()
        
        if (!mounted) return

        // Determine which symbols to subscribe to
        if (autoSubscribe) {
          let subscribeList: string[] = []

          if (targetSymbols && targetSymbols.length > 0) {
            // Subscribe to specific requested symbols
            subscribeList = targetSymbols
            console.log(`📋 Subscribing to requested symbols: ${subscribeList.join(', ')}`)
          } else if (symbols.length > 0) {
            // Subscribe to first 20 symbols for overview (reduced from 50 for better performance)
            subscribeList = symbols.slice(0, 20).map(s => s.symbol || s.displaySymbol || '')
            console.log(`📋 Subscribing to first ${subscribeList.length} symbols for overview`)
          }

          // Filter out empty strings
          subscribeList = subscribeList.filter(s => s && s.trim() !== '')

          if (subscribeList.length > 0) {
            subscribeToSymbols(subscribeList)
          }
        }
      } catch (err) {
        console.error('❌ Initialization error:', err)
      }
    }

    initialize()

    return () => {
      mounted = false
    }
  }, [fetchSymbols, targetSymbols, autoSubscribe, subscribeToSymbols])

  // Handle WebSocket connection
  useEffect(() => {
    if (!autoConnect) return

    // Register status handler
    if (statusHandlerRef.current) {
      client.onStatus(statusHandlerRef.current)
    }

    // Connect to WebSocket
    console.log('🔌 Connecting to WebSocket...')
    client.connect()

    return () => {
      // Cleanup status handler
      if (statusHandlerRef.current) {
        client.offStatus(statusHandlerRef.current)
      }
    }
  }, [client, autoConnect])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      console.log('🧹 Cleaning up useFinnhubForex hook')
      unsubscribeFromAll()
    }
  }, [unsubscribeFromAll])

  // Refetch symbols
  const refetch = useCallback(async () => {
    console.log('🔄 Refetching symbols...')
    const symbols = await fetchSymbols()
    
    if (autoSubscribe && symbols.length > 0) {
      let subscribeList: string[] = []
      
      if (targetSymbols && targetSymbols.length > 0) {
        subscribeList = targetSymbols
      } else {
        subscribeList = symbols.slice(0, 20).map(s => s.symbol || s.displaySymbol || '')
      }
      
      subscribeList = subscribeList.filter(s => s && s.trim() !== '')
      subscribeToSymbols(subscribeList)
    }
  }, [fetchSymbols, targetSymbols, autoSubscribe, subscribeToSymbols])

  // Get rate for specific symbol
  const getRate = useCallback((symbol: string) => {
    return forexRates[symbol] || null
  }, [forexRates])

  // Get all subscribed symbols
  const getSubscribedSymbols = useCallback(() => {
    return Array.from(subscribedSymbolsRef.current)
  }, [])

  // Manual subscribe function
  const subscribe = useCallback((symbol: string) => {
    if (messageHandlerRef.current) {
      console.log(`📡 Manually subscribing to ${symbol}`)
      client.subscribe(symbol, messageHandlerRef.current)
      subscribedSymbolsRef.current.add(symbol)
    }
  }, [client])

  // Manual unsubscribe function
  const unsubscribe = useCallback((symbol: string) => {
    if (messageHandlerRef.current) {
      console.log(`🔕 Manually unsubscribing from ${symbol}`)
      client.unsubscribe(symbol, messageHandlerRef.current)
      subscribedSymbolsRef.current.delete(symbol)
    }
  }, [client])

  return {
    // Data
    forexRates,
    forexSymbols,
    
    // State
    loading,
    error,
    status,
    isConnected: status === 'connected',
    isConnecting: status === 'connecting',
    
    // Methods
    refetch,
    getRate,
    subscribe,
    unsubscribe,
    getSubscribedSymbols,
    
    // Stats
    symbolCount: forexSymbols.length,
    rateCount: Object.keys(forexRates).length,
    subscribedCount: subscribedSymbolsRef.current.size
  }
}

export default useFinnhubForex
