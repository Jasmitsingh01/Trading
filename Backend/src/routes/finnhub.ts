// Backend/src/routes/finnhub.ts
import type { FastifyInstance } from 'fastify';
import { getFinnhubService } from '../services/finnhubWebSocket.service.js';

interface SubscribeMessage {
    type: 'subscribe' | 'unsubscribe';
    symbol: string;
}

export async function registerFinnhubWebSocketRoute(app: FastifyInstance) {
    // WebSocket endpoint for real-time data streaming
    app.register(async (fastify) => {
        fastify.get('/ws/finnhub', { websocket: true }, (socket: any, request: any) => {
            const finnhubService = getFinnhubService();

            if (!finnhubService) {
                console.error('❌ Finnhub service not initialized');
                socket.close(1011, 'Service unavailable');
                return;
            }

            const clientId = finnhubService.addClient(socket);
            console.log(`✅ WebSocket client connected: ${clientId}`);

            // Handle incoming messages
            socket.on('message', (messageData: Buffer) => {
                try {
                    const message = messageData.toString();
                    const data: SubscribeMessage = JSON.parse(message);
                    
                    console.log(`📨 Message from ${clientId}:`, data);
                    
                    if (data.type === 'subscribe' && data.symbol) {
                        console.log(`🔔 Subscribing ${clientId} to ${data.symbol}`);
                        finnhubService.subscribe(clientId, data.symbol);
                    } else if (data.type === 'unsubscribe' && data.symbol) {
                        console.log(`🔕 Unsubscribing ${clientId} from ${data.symbol}`);
                        finnhubService.unsubscribe(clientId, data.symbol);
                    } else {
                        socket.send(JSON.stringify({
                            type: 'error',
                            message: 'Invalid message format',
                            expected: {
                                subscribe: { type: 'subscribe', symbol: 'SYMBOL' },
                                unsubscribe: { type: 'unsubscribe', symbol: 'SYMBOL' }
                            }
                        }));
                    }
                } catch (error) {
                    console.error(`❌ Error parsing message from ${clientId}:`, error);
                    socket.send(JSON.stringify({
                        type: 'error',
                        message: 'Failed to parse message. Send valid JSON.'
                    }));
                }
            });

            socket.on('close', (code: number, reason: Buffer) => {
                console.log(`👋 Client ${clientId} disconnected - Code: ${code}`);
                finnhubService.removeClient(clientId);
            });

            socket.on('error', (error: Error) => {
                console.error(`⚠️ WebSocket error for ${clientId}:`, error.message);
            });
        });
    });

    // REST API: Get service status
    app.get('/api/finnhub/status', async (request, reply) => {
        const finnhubService = getFinnhubService();

        if (!finnhubService) {
            return reply.code(503).send({
                success: false,
                error: 'Finnhub service not initialized'
            });
        }

        const stats = finnhubService.getStats();
        const isHealthy = finnhubService.isHealthy();
        
        return {
            success: true,
            status: isHealthy ? 'healthy' : 'degraded',
            data: {
                finnhubConnected: stats.finnhubConnected,
                clientsConnected: stats.clientsConnected,
                subscribedSymbols: stats.subscribedSymbols,
                symbolCount: stats.subscribedSymbols.length,
                reconnectAttempts: stats.reconnectAttempts,
                uptime: stats.uptime,
                uptimeFormatted: `${Math.floor(stats.uptime / 1000)}s`,
                lastMessageAt: stats.lastMessageAt,
                lastMessageAgo: stats.lastMessageAt 
                    ? `${Math.floor((Date.now() - stats.lastMessageAt) / 1000)}s ago`
                    : 'Never',
                messagesReceived: stats.messagesReceived,
                healthy: isHealthy
            },
            timestamp: Date.now()
        };
    });

    // REST API: Get available forex symbols from Finnhub API
    app.get('/api/finnhub/forex/symbols', async (request, reply) => {
        const { exchange = 'oanda' } = request.query as { exchange?: string };
        const apiKey = process.env.FINNHUB_API_KEY;

        if (!apiKey) {
            return reply.code(500).send({
                success: false,
                error: 'API key not configured'
            });
        }

        try {
            console.log(`📡 Fetching forex symbols from exchange: ${exchange}`);
            
            const response = await fetch(
                `https://finnhub.io/api/v1/forex/symbol?exchange=${encodeURIComponent(exchange.toLowerCase())}&token=${apiKey}`
            );

            if (!response.ok) {
                throw new Error(`Finnhub API returned ${response.status}: ${response.statusText}`);
            }

            const symbols = await response.json();
            
            if (!Array.isArray(symbols)) {
                throw new Error('Invalid response format from Finnhub');
            }

            console.log(`✅ Fetched ${symbols.length} forex symbols from ${exchange}`);
            
            return {
                success: true,
                exchange: exchange.toLowerCase(),
                count: symbols.length,
                symbols: symbols,
                timestamp: Date.now()
            };
        } catch (error) {
            console.error('❌ Error fetching forex symbols:', error);
            return reply.code(500).send({
                success: false,
                error: 'Failed to fetch symbols from Finnhub',
                message: error instanceof Error ? error.message : 'Unknown error',
                exchange: exchange
            });
        }
    });

    // REST API: Get available exchanges
    app.get('/api/finnhub/forex/exchanges', async (request, reply) => {
        // These are the supported forex exchanges by Finnhub
        return {
            success: true,
            exchanges: [
                { code: 'oanda', name: 'OANDA' },
                { code: 'fxcm', name: 'FXCM' },
                { code: 'ic markets', name: 'IC Markets' }
            ],
            default: 'oanda',
            usage: 'Use ?exchange=oanda to specify exchange',
            timestamp: Date.now()
        };
    });

    // REST API: Get real-time quote for any symbol
    app.get('/api/finnhub/quote/:symbol', async (request, reply) => {
        const { symbol } = request.params as { symbol: string };
        const apiKey = process.env.FINNHUB_API_KEY;

        if (!apiKey) {
            return reply.code(500).send({
                success: false,
                error: 'API key not configured'
            });
        }

        if (!symbol || symbol.trim() === '') {
            return reply.code(400).send({
                success: false,
                error: 'Symbol parameter is required'
            });
        }

        try {
            console.log(`📊 Fetching quote for symbol: ${symbol}`);
            
            const response = await fetch(
                `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(symbol)}&token=${apiKey}`
            );

            if (!response.ok) {
                throw new Error(`Finnhub API returned ${response.status}`);
            }

            const quote = await response.json();
            
            if (quote.error) {
                return reply.code(400).send({
                    success: false,
                    error: quote.error,
                    symbol: symbol
                });
            }

            // Check if quote has valid data
            if (quote.c === 0 && quote.h === 0 && quote.l === 0) {
                return reply.code(404).send({
                    success: false,
                    error: 'No data available for this symbol',
                    symbol: symbol,
                    hint: 'Symbol might not exist or market is closed'
                });
            }

            console.log(`✅ Quote for ${symbol}: $${quote.c}`);

            return {
                success: true,
                symbol,
                data: {
                    current: quote.c,
                    change: quote.d,
                    percentChange: quote.dp,
                    high: quote.h,
                    low: quote.l,
                    open: quote.o,
                    previousClose: quote.pc,
                    timestamp: quote.t
                },
                timestamp: Date.now()
            };
        } catch (error) {
            console.error(`❌ Error fetching quote for ${symbol}:`, error);
            return reply.code(500).send({
                success: false,
                error: 'Failed to fetch quote',
                message: error instanceof Error ? error.message : 'Unknown error',
                symbol: symbol
            });
        }
    });

    // REST API: Search for symbols
    app.get('/api/finnhub/search', async (request, reply) => {
        const { q } = request.query as { q?: string };
        const apiKey = process.env.FINNHUB_API_KEY;

        if (!apiKey) {
            return reply.code(500).send({
                success: false,
                error: 'API key not configured'
            });
        }

        if (!q || q.trim() === '') {
            return reply.code(400).send({
                success: false,
                error: 'Search query parameter "q" is required',
                example: '/api/finnhub/search?q=EUR'
            });
        }

        try {
            console.log(`🔍 Searching for: ${q}`);
            
            const response = await fetch(
                `https://finnhub.io/api/v1/search?q=${encodeURIComponent(q)}&token=${apiKey}`
            );

            if (!response.ok) {
                throw new Error(`Finnhub API returned ${response.status}`);
            }

            const results = await response.json();
            
            console.log(`✅ Found ${results.count || 0} results for "${q}"`);

            return {
                success: true,
                query: q,
                count: results.count || 0,
                results: results.result || [],
                timestamp: Date.now()
            };
        } catch (error) {
            console.error('❌ Error searching symbols:', error);
            return reply.code(500).send({
                success: false,
                error: 'Failed to search symbols',
                message: error instanceof Error ? error.message : 'Unknown error',
                query: q
            });
        }
    });

    // REST API: Test API key and connection
    app.get('/api/finnhub/test', async (request, reply) => {
        const apiKey = process.env.FINNHUB_API_KEY;

        if (!apiKey || apiKey.trim() === '') {
            return reply.code(500).send({
                success: false,
                error: 'FINNHUB_API_KEY not configured',
                hint: 'Add FINNHUB_API_KEY to your .env file',
                help: 'Get a free API key at https://finnhub.io/register'
            });
        }

        try {
            console.log('🧪 Testing Finnhub connection...');
            
            // Test with AAPL stock quote
            const response = await fetch(
                `https://finnhub.io/api/v1/quote?symbol=AAPL&token=${apiKey}`
            );
            
            const data = await response.json();
            
            if (data.error) {
                return reply.code(401).send({
                    success: false,
                    error: 'Invalid API key',
                    message: data.error
                });
            }

            const finnhubService = getFinnhubService();
            const stats = finnhubService?.getStats();

            console.log('✅ Finnhub connection test passed');

            return {
                success: true,
                apiKey: {
                    configured: true,
                    valid: true,
                    length: apiKey.length,
                    masked: apiKey.substring(0, 4) + '...' + apiKey.substring(apiKey.length - 4)
                },
                restApi: {
                    working: true,
                    statusCode: response.status
                },
                websocketService: {
                    initialized: !!finnhubService,
                    connected: stats?.finnhubConnected || false,
                    clients: stats?.clientsConnected || 0,
                    symbols: stats?.subscribedSymbols || [],
                    symbolCount: stats?.subscribedSymbols?.length || 0
                },
                testQuote: {
                    symbol: 'AAPL',
                    price: data.c,
                    change: data.d,
                    percentChange: data.dp
                },
                timestamp: Date.now()
            };
        } catch (error) {
            console.error('❌ Finnhub connection test failed:', error);
            return reply.code(500).send({
                success: false,
                error: 'Connection test failed',
                message: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    });

    // REST API: Get currently subscribed symbols
    app.get('/api/finnhub/subscriptions', async (request, reply) => {
        const finnhubService = getFinnhubService();

        if (!finnhubService) {
            return reply.code(503).send({
                success: false,
                error: 'Finnhub service not initialized'
            });
        }

        const stats = finnhubService.getStats();

        return {
            success: true,
            count: stats.subscribedSymbols.length,
            symbols: stats.subscribedSymbols,
            clients: stats.clientsConnected,
            timestamp: Date.now()
        };
    });

    // REST API: Health check
    app.get('/api/finnhub/health', async (request, reply) => {
        const finnhubService = getFinnhubService();

        if (!finnhubService) {
            return reply.code(503).send({
                success: false,
                status: 'unhealthy',
                reason: 'Service not initialized',
                timestamp: Date.now()
            });
        }

        const stats = finnhubService.getStats();
        const isHealthy = finnhubService.isHealthy();

        return {
            success: true,
            status: isHealthy ? 'healthy' : 'degraded',
            checks: {
                finnhubConnected: stats.finnhubConnected,
                hasClients: stats.clientsConnected > 0,
                recentActivity: stats.lastMessageAt 
                    ? (Date.now() - stats.lastMessageAt < 120000) 
                    : false
            },
            metrics: {
                clients: stats.clientsConnected,
                symbols: stats.subscribedSymbols.length,
                messages: stats.messagesReceived,
                uptime: stats.uptime,
                lastMessage: stats.lastMessageAt
            },
            timestamp: Date.now()
        };
    });

    console.log('✅ Finnhub routes registered');
    console.log('📍 WebSocket: ws://localhost:8080/ws/finnhub');
    console.log('📍 REST API: /api/finnhub/*');
}
