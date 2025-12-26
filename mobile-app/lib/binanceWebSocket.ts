
export interface CryptoStreamData {
    symbol: string;
    price: string;
    change: string;
    changePercent: string;
    high: string;
    low: string;
    volume: string;
    timestamp: number;
}

interface BinanceTickerMessage {
    e: string;      // Event type
    E: number;      // Event time
    s: string;      // Symbol
    p: string;      // Price change
    P: string;      // Price change percent
    w: string;      // Weighted average price
    x: string;      // First trade(F)-1 price (first trade before the 24hr rolling window)
    c: string;      // Last price
    Q: string;      // Last quantity
    b: string;      // Best bid price
    B: string;      // Best bid quantity
    a: string;      // Best ask price
    A: string;      // Best ask quantity
    o: string;      // Open price
    h: string;      // High price
    l: string;      // Low price
    v: string;      
    q: string;      
    O: number;      
    C: number;      
    F: number;      
    L: number;      
    n: number;      
}

type MessageHandler = (data: CryptoStreamData) => void;
type ErrorHandler = (error: Error) => void;
type StatusHandler = (status: 'connected' | 'disconnected' | 'error') => void;

export class BinanceWebSocketClient {
    private connections: Map<string, WebSocket> = new Map();
    private messageHandlers: Map<string, Set<MessageHandler>> = new Map();
    private errorHandlers: Set<ErrorHandler> = new Set();
    private statusHandlers: Set<StatusHandler> = new Set();
    private reconnectAttempts: Map<string, number> = new Map();
    private maxReconnectAttempts = 5;
    private reconnectDelay = 3000; 
    private baseUrl = 'wss://stream.binance.com:9443/ws';

    public subscribe(symbol: string, handler: MessageHandler): void {
        const symbolLower = symbol.toLowerCase();
        const streamName = `${symbolLower}@ticker`;

        // Add handler
        if (!this.messageHandlers.has(symbol)) {
            this.messageHandlers.set(symbol, new Set());
        }
        this.messageHandlers.get(symbol)!.add(handler);

        // Create WebSocket connection if it doesn't exist
        if (!this.connections.has(symbol)) {
            this.createConnection(symbol, streamName);
        }

        console.log(`📊 Subscribed to ${symbol}`);
    }

    public unsubscribe(symbol: string, handler?: MessageHandler): void {
        if (handler) {
            const handlers = this.messageHandlers.get(symbol);
            if (handlers) {
                handlers.delete(handler);
                
                // If no more handlers, close connection
                if (handlers.size === 0) {
                    this.closeConnection(symbol);
                }
            }
        } else {
            // Remove all handlers and close connection
            this.messageHandlers.delete(symbol);
            this.closeConnection(symbol);
        }

        console.log(`❌ Unsubscribed from ${symbol}`);
    }

    public subscribeMultiple(symbols: string[], handler: MessageHandler): void {
        symbols.forEach(symbol => this.subscribe(symbol, handler));
    }

    
    public unsubscribeAll(): void {
        this.connections.forEach((ws, symbol) => {
            this.closeConnection(symbol);
        });
        this.messageHandlers.clear();
        console.log('🔌 Unsubscribed from all symbols');
    }

    public onError(handler: ErrorHandler): void {
        this.errorHandlers.add(handler);
    }

    public onStatus(handler: StatusHandler): void {
        this.statusHandlers.add(handler);
    }

    
    private createConnection(symbol: string, streamName: string): void {
        try {
            const url = `${this.baseUrl}/${streamName}`;
            const ws = new WebSocket(url);

            ws.onopen = () => {
                console.log(`✅ Connected to Binance stream: ${symbol}`);
                this.reconnectAttempts.set(symbol, 0);
                this.notifyStatus('connected');
            };

            ws.onmessage = (event) => {
                try {
                    const message: BinanceTickerMessage = JSON.parse(event.data);
                    
                    // Transform to our format
                    const data: CryptoStreamData = {
                        symbol: message.s,
                        price: message.c,
                        change: message.p,
                        changePercent: message.P,
                        high: message.h,
                        low: message.l,
                        volume: message.v,
                        timestamp: message.C
                    };

                    // Notify all handlers for this symbol
                    const handlers = this.messageHandlers.get(symbol);
                    if (handlers) {
                        handlers.forEach(handler => {
                            try {
                                handler(data);
                            } catch (error) {
                                console.error('Error in message handler:', error);
                            }
                        });
                    }
                } catch (error) {
                    console.error('Error parsing WebSocket message:', error);
                    this.notifyError(new Error('Failed to parse message'));
                }
            };

            ws.onerror = (error) => {
                console.error(`❌ WebSocket error for ${symbol}:`, error);
                this.notifyError(new Error(`WebSocket error for ${symbol}`));
                this.notifyStatus('error');
            };

            ws.onclose = () => {
                console.log(`🔌 Disconnected from ${symbol}`);
                this.connections.delete(symbol);
                this.notifyStatus('disconnected');

                const handlers = this.messageHandlers.get(symbol);
                if (handlers && handlers.size > 0) {
                    this.attemptReconnect(symbol, streamName);
                }
            };

            this.connections.set(symbol, ws);
        } catch (error) {
            console.error(`Error creating WebSocket connection for ${symbol}:`, error);
            this.notifyError(error instanceof Error ? error : new Error('Connection failed'));
        }
    }


    private closeConnection(symbol: string): void {
        const ws = this.connections.get(symbol);
        if (ws) {
            ws.close();
            this.connections.delete(symbol);
            console.log(`🔌 Closed connection for ${symbol}`);
        }
    }

    private attemptReconnect(symbol: string, streamName: string): void {
        const attempts = this.reconnectAttempts.get(symbol) || 0;

        if (attempts < this.maxReconnectAttempts) {
            const delay = this.reconnectDelay * Math.pow(2, attempts); // Exponential backoff
            
            console.log(`🔄 Reconnecting to ${symbol} in ${delay}ms (attempt ${attempts + 1}/${this.maxReconnectAttempts})`);
            
            setTimeout(() => {
                this.reconnectAttempts.set(symbol, attempts + 1);
                this.createConnection(symbol, streamName);
            }, delay);
        } else {
            console.error(`❌ Max reconnection attempts reached for ${symbol}`);
            this.notifyError(new Error(`Failed to reconnect to ${symbol}`));
        }
    }

    /**
     * Notify error handlers
     */
    private notifyError(error: Error): void {
        this.errorHandlers.forEach(handler => {
            try {
                handler(error);
            } catch (err) {
                console.error('Error in error handler:', err);
            }
        });
    }

    /**
     * Notify status handlers
     */
    private notifyStatus(status: 'connected' | 'disconnected' | 'error'): void {
        this.statusHandlers.forEach(handler => {
            try {
                handler(status);
            } catch (err) {
                console.error('Error in status handler:', err);
            }
        });
    }

    /**
     * Get current connection status
     */
    public getConnectionStatus(symbol: string): 'connected' | 'disconnected' {
        const ws = this.connections.get(symbol);
        return ws && ws.readyState === WebSocket.OPEN ? 'connected' : 'disconnected';
    }

    /**
     * Get all active subscriptions
     */
    public getActiveSubscriptions(): string[] {
        return Array.from(this.messageHandlers.keys());
    }

    /**
     * Clean up all connections
     */
    public destroy(): void {
        this.unsubscribeAll();
        this.errorHandlers.clear();
        this.statusHandlers.clear();
        this.reconnectAttempts.clear();
        console.log('🧹 BinanceWebSocketClient destroyed');
    }
}

// Singleton instance
let binanceWSClient: BinanceWebSocketClient | null = null;

/**
 * Get or create singleton instance
 */
export function getBinanceWebSocket(): BinanceWebSocketClient {
    if (!binanceWSClient) {
        binanceWSClient = new BinanceWebSocketClient();
    }
    return binanceWSClient;
}

/**
 * Destroy singleton instance
 */
export function destroyBinanceWebSocket(): void {
    if (binanceWSClient) {
        binanceWSClient.destroy();
        binanceWSClient = null;
    }
}

export default {
    getBinanceWebSocket,
    destroyBinanceWebSocket,
    BinanceWebSocketClient
};
