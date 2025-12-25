import WebSocket from 'ws';
import EventEmitter from 'events';

// Types
interface ForexTrade {
    s: string;      // symbol
    p: number;      // price
    t: number;      // timestamp (ms)
    v: number;      // volume
}

interface FinnhubMessage {
    type: 'ping' | 'trade' | 'error';
    data?: ForexTrade[];
    msg?: string;
}

interface ClientConnection {
    id: string;
    socket: WebSocket;
    subscribedSymbols: Set<string>;
    connectedAt: number;
}

interface ServiceStats {
    finnhubConnected: boolean;
    clientsConnected: number;
    subscribedSymbols: string[];
    reconnectAttempts: number;
    uptime: number;
    lastMessageAt: number | null;
    messagesReceived: number;
}

export class FinnhubWebSocketService extends EventEmitter {
    private finnhubWs: WebSocket | null = null;
    private clients: Map<string, ClientConnection> = new Map();
    private apiKey: string;
    private reconnectAttempts = 0;
    private maxReconnects = 10;
    private reconnectTimeout: NodeJS.Timeout | null = null;
    private pingInterval: NodeJS.Timeout | null = null;
    private subscribedSymbols: Map<string, number> = new Map(); // symbol -> subscriber count
    private latestPrices: Map<string, ForexTrade> = new Map();
    private startTime: number;
    private lastMessageAt: number | null = null;
    private messagesReceived = 0;
    private isConnecting = false;

    constructor(apiKey: string) {
        super();
        this.apiKey = apiKey;
        this.startTime = Date.now();
    }

    /**
     * Initialize and connect to Finnhub WebSocket
     */
    public async connect(): Promise<boolean> {
        if (this.isConnecting) {
            console.log('⏳ Connection already in progress...');
            return false;
        }

        if (this.finnhubWs?.readyState === WebSocket.OPEN) {
            console.log('✅ Already connected to Finnhub');
            return true;
        }

        this.isConnecting = true;
        
        try {
            await this.createConnection();
            return true;
        } catch (error) {
            console.error('❌ Failed to connect:', error);
            this.isConnecting = false;
            return false;
        }
    }

    /**
     * Create WebSocket connection to Finnhub
     */
    private createConnection(): Promise<void> {
        return new Promise((resolve, reject) => {
            const wsUrl = `wss://ws.finnhub.io?token=${this.apiKey}`;
            
            console.log('🔌 Connecting to Finnhub WebSocket...');
            this.finnhubWs = new WebSocket(wsUrl);

            const connectionTimeout = setTimeout(() => {
                if (this.finnhubWs?.readyState !== WebSocket.OPEN) {
                    console.error('⏰ Connection timeout');
                    this.finnhubWs?.terminate();
                    reject(new Error('Connection timeout'));
                }
            }, 10000); // 10 second timeout

            this.finnhubWs.on('open', () => {
                clearTimeout(connectionTimeout);
                console.log('✅ Connected to Finnhub WebSocket');
                this.isConnecting = false;
                this.reconnectAttempts = 0;
                this.setupPingInterval();
                
                // Re-subscribe to all symbols
                this.resubscribeAll();
                this.emit('connected');
                resolve();
            });

            this.finnhubWs.on('message', (data: WebSocket.Data) => {
                this.handleMessage(data);
            });

            this.finnhubWs.on('close', (code: number, reason: Buffer) => {
                clearTimeout(connectionTimeout);
                console.log(`🔴 Finnhub disconnected - Code: ${code}, Reason: ${reason.toString() || 'No reason'}`);
                this.isConnecting = false;
                this.cleanup();
                this.emit('disconnected', { code, reason: reason.toString() });
                this.scheduleReconnect();
            });

            this.finnhubWs.on('error', (error: Error) => {
                clearTimeout(connectionTimeout);
                console.error('⚠️ Finnhub WebSocket error:', error.message);
                this.isConnecting = false;
                this.emit('error', error);
                reject(error);
            });

            this.finnhubWs.on('ping', () => {
                console.log('🏓 Received ping from Finnhub');
            });

            this.finnhubWs.on('pong', () => {
                console.log('🏓 Received pong from Finnhub');
            });
        });
    }

    /**
     * Handle incoming messages from Finnhub
     */
    private handleMessage(data: WebSocket.Data): void {
        try {
            const message: FinnhubMessage = JSON.parse(data.toString());
            this.lastMessageAt = Date.now();
            this.messagesReceived++;

            if (message.type === 'ping') {
                console.log('🏓 Ping from Finnhub');
                return;
            }

            if (message.type === 'error') {
                console.error('❌ Finnhub error:', message.msg);
                this.emit('finnhub-error', message.msg);
                return;
            }

            if (message.type === 'trade' && message.data && message.data.length > 0) {
                message.data.forEach(trade => {
                    this.processTrade(trade);
                });
            }
        } catch (error) {
            console.error('❌ Error parsing message:', error);
        }
    }

    /**
     * Process individual trade data
     */
    private processTrade(trade: ForexTrade): void {
        // Store latest price
        this.latestPrices.set(trade.s, trade);

        // Emit event for logging/monitoring
        this.emit('trade', trade);

        // Broadcast to subscribed clients
        this.broadcastTrade(trade);

        console.log(`💹 ${trade.s} | Price: $${trade.p.toFixed(5)} | Vol: ${trade.v} | ${new Date(trade.t).toISOString()}`);
    }

    /**
     * Broadcast trade to all subscribed clients
     */
    private broadcastTrade(trade: ForexTrade): void {
        const message = JSON.stringify({
            type: 'trade',
            data: trade
        });

        let sentCount = 0;
        this.clients.forEach(client => {
            if (client.subscribedSymbols.has(trade.s) && client.socket.readyState === WebSocket.OPEN) {
                try {
                    client.socket.send(message);
                    sentCount++;
                } catch (error) {
                    console.error(`❌ Error sending to client ${client.id}:`, error);
                }
            }
        });

        if (sentCount > 0) {
            console.log(`📤 Broadcasted ${trade.s} to ${sentCount} client(s)`);
        }
    }

    /**
     * Add a new client connection
     */
    public addClient(socket: WebSocket): string {
        const clientId = this.generateClientId();
        
        const client: ClientConnection = {
            id: clientId,
            socket,
            subscribedSymbols: new Set(),
            connectedAt: Date.now()
        };

        this.clients.set(clientId, client);
        console.log(`👤 Client ${clientId} connected. Total: ${this.clients.size}`);

        // ⭐ CRITICAL: Send immediate welcome message to complete handshake
        try {
            if (socket.readyState === WebSocket.OPEN) {
                this.sendToClient(socket, {
                    type: 'connected',
                    clientId,
                    message: 'Connected to Finnhub WebSocket Service',
                    timestamp: Date.now(),
                    server: 'Trading Platform v1.0',
                    finnhubStatus: this.finnhubWs?.readyState === WebSocket.OPEN ? 'connected' : 'disconnected'
                });

                // Send latest prices if available
                if (this.latestPrices.size > 0) {
                    this.sendToClient(socket, {
                        type: 'snapshot',
                        count: this.latestPrices.size,
                        data: Array.from(this.latestPrices.values())
                    });
                }
            }
        } catch (error) {
            console.error('Error sending welcome message:', error);
        }

        this.emit('client-connected', clientId);
        return clientId;
    }

    /**
     * Remove a client connection
     */
    public removeClient(clientId: string): void {
        const client = this.clients.get(clientId);
        if (!client) return;

        // Unsubscribe from all symbols
        client.subscribedSymbols.forEach(symbol => {
            this.unsubscribe(clientId, symbol);
        });

        this.clients.delete(clientId);
        console.log(`👋 Client ${clientId} disconnected. Total: ${this.clients.size}`);
        this.emit('client-disconnected', clientId);
    }

    /**
     * Subscribe a client to a symbol
     */
    public subscribe(clientId: string, symbol: string): boolean {
        const client = this.clients.get(clientId);
        if (!client) {
            console.error(`❌ Client ${clientId} not found`);
            return false;
        }

        // Add to client's subscriptions
        client.subscribedSymbols.add(symbol);

        // Increment global subscription count
        const currentCount = this.subscribedSymbols.get(symbol) || 0;
        this.subscribedSymbols.set(symbol, currentCount + 1);

        // If first subscription to this symbol, subscribe to Finnhub
        if (currentCount === 0) {
            this.subscribeToFinnhub(symbol);
        }

        // Send latest price if available
        const latestPrice = this.latestPrices.get(symbol);
        if (latestPrice) {
            this.sendToClient(client.socket, {
                type: 'trade',
                data: latestPrice
            });
        }

        console.log(`📡 Client ${clientId} subscribed to ${symbol} (total subscribers: ${currentCount + 1})`);
        
        this.sendToClient(client.socket, {
            type: 'subscribed',
            symbol,
            timestamp: Date.now()
        });

        return true;
    }

    /**
     * Unsubscribe a client from a symbol
     */
    public unsubscribe(clientId: string, symbol: string): boolean {
        const client = this.clients.get(clientId);
        if (!client) return false;

        client.subscribedSymbols.delete(symbol);

        const currentCount = this.subscribedSymbols.get(symbol) || 0;
        const newCount = Math.max(0, currentCount - 1);

        if (newCount === 0) {
            this.subscribedSymbols.delete(symbol);
            this.unsubscribeFromFinnhub(symbol);
            this.latestPrices.delete(symbol);
        } else {
            this.subscribedSymbols.set(symbol, newCount);
        }

        console.log(`🔕 Client ${clientId} unsubscribed from ${symbol} (remaining: ${newCount})`);
        
        this.sendToClient(client.socket, {
            type: 'unsubscribed',
            symbol,
            timestamp: Date.now()
        });

        return true;
    }

    /**
     * Subscribe to symbol on Finnhub
     */
    private subscribeToFinnhub(symbol: string): void {
        if (this.finnhubWs?.readyState === WebSocket.OPEN) {
            this.finnhubWs.send(JSON.stringify({
                type: 'subscribe',
                symbol
            }));
            console.log(`📡 Subscribed to Finnhub: ${symbol}`);
        } else {
            console.warn(`⚠️ Cannot subscribe to ${symbol} - Finnhub not connected`);
        }
    }

    /**
     * Unsubscribe from symbol on Finnhub
     */
    private unsubscribeFromFinnhub(symbol: string): void {
        if (this.finnhubWs?.readyState === WebSocket.OPEN) {
            this.finnhubWs.send(JSON.stringify({
                type: 'unsubscribe',
                symbol
            }));
            console.log(`🔕 Unsubscribed from Finnhub: ${symbol}`);
        }
    }

    /**
     * Resubscribe to all active symbols (after reconnection)
     */
    private resubscribeAll(): void {
        const symbols = Array.from(this.subscribedSymbols.keys());
        if (symbols.length === 0) return;

        console.log(`🔄 Resubscribing to ${symbols.length} symbol(s)...`);
        symbols.forEach(symbol => {
            this.subscribeToFinnhub(symbol);
        });
    }

    /**
     * Setup ping interval to keep connection alive
     */
    private setupPingInterval(): void {
        if (this.pingInterval) {
            clearInterval(this.pingInterval);
        }

        this.pingInterval = setInterval(() => {
            if (this.finnhubWs?.readyState === WebSocket.OPEN) {
                this.finnhubWs.ping();
                console.log('🏓 Sent ping to Finnhub');
            }
        }, 30000); // Ping every 30 seconds
    }

    /**
     * Schedule reconnection attempt
     */
    private scheduleReconnect(): void {
        if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout);
        }

        if (this.reconnectAttempts >= this.maxReconnects) {
            console.error(`💥 Max reconnection attempts (${this.maxReconnects}) reached`);
            this.emit('max-reconnects-reached');
            return;
        }

        this.reconnectAttempts++;
        const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts - 1), 30000); // Exponential backoff, max 30s

        console.log(`🔄 Reconnecting in ${delay / 1000}s (attempt ${this.reconnectAttempts}/${this.maxReconnects})`);

        this.reconnectTimeout = setTimeout(async () => {
            await this.connect();
        }, delay);
    }

    /**
     * Cleanup on disconnect
     */
    private cleanup(): void {
        if (this.pingInterval) {
            clearInterval(this.pingInterval);
            this.pingInterval = null;
        }
    }

    /**
     * Send message to specific client
     */
    private sendToClient(socket: WebSocket, data: any): void {
        if (socket.readyState === WebSocket.OPEN) {
            try {
                socket.send(JSON.stringify(data));
            } catch (error) {
                console.error('❌ Error sending to client:', error);
            }
        }
    }

    /**
     * Generate unique client ID
     */
    private generateClientId(): string {
        return `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Get service statistics
     */
    public getStats(): ServiceStats {
        return {
            finnhubConnected: this.finnhubWs?.readyState === WebSocket.OPEN,
            clientsConnected: this.clients.size,
            subscribedSymbols: Array.from(this.subscribedSymbols.keys()),
            reconnectAttempts: this.reconnectAttempts,
            uptime: Date.now() - this.startTime,
            lastMessageAt: this.lastMessageAt,
            messagesReceived: this.messagesReceived
        };
    }

    /**
     * Get client information
     */
    public getClient(clientId: string): ClientConnection | undefined {
        return this.clients.get(clientId);
    }

    /**
     * Disconnect and cleanup all resources
     */
    public async disconnect(): Promise<void> {
        console.log('🛑 Shutting down Finnhub service...');

        // Clear timers
        if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout);
        }
        if (this.pingInterval) {
            clearInterval(this.pingInterval);
        }

        // Close all client connections
        this.clients.forEach(client => {
            try {
                this.sendToClient(client.socket, {
                    type: 'server-shutdown',
                    message: 'Server is shutting down',
                    timestamp: Date.now()
                });
                client.socket.close(1001, 'Server shutdown');
            } catch (error) {
                console.error(`Error closing client ${client.id}:`, error);
            }
        });
        this.clients.clear();

        // Close Finnhub connection
        if (this.finnhubWs) {
            this.finnhubWs.close(1000, 'Normal closure');
            this.finnhubWs = null;
        }

        console.log('✅ Finnhub service stopped');
    }

    /**
     * Check if service is healthy
     */
    public isHealthy(): boolean {
        const isConnected = this.finnhubWs?.readyState === WebSocket.OPEN;
        const recentActivity = this.lastMessageAt ? (Date.now() - this.lastMessageAt < 120000) : true; // 2 min
        return isConnected && recentActivity;
    }
}

// Singleton instance
let finnhubService: FinnhubWebSocketService | null = null;

export async function initializeFinnhubService(apiKey: string): Promise<FinnhubWebSocketService> {
    if (!finnhubService) {
        finnhubService = new FinnhubWebSocketService(apiKey);
        await finnhubService.connect();
    }
    return finnhubService;
}

export function getFinnhubService(): FinnhubWebSocketService | null {
    return finnhubService;
}

export async function shutdownFinnhubService(): Promise<void> {
    if (finnhubService) {
        await finnhubService.disconnect();
        finnhubService = null;
    }
}
