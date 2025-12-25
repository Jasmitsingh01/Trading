import app from "./src/app.js";
import connectDB from "./src/database/database.js";
import { initializeFinnhubService, shutdownFinnhubService } from "./src/services/finnhubWebSocket.service.js";
import { config } from "dotenv";

config();

let server: any = null;

async function startServer() {
    try {
        // Connect to database
        await connectDB();
        console.log('✅ Database connected');

        // Initialize Finnhub WebSocket service
        const finnhubApiKey = process.env.FINNHUB_API_KEY;
        
        if (!finnhubApiKey || finnhubApiKey.trim() === '') {
            console.warn('⚠️  WARNING: FINNHUB_API_KEY not configured');
            console.warn('📝 Add FINNHUB_API_KEY to your .env file');
            console.warn('🔗 Get API key at: https://finnhub.io/register');
        } else {
            console.log('🔌 Initializing Finnhub service...');
            const service = await initializeFinnhubService(finnhubApiKey);
            
            // Monitor service health
            service.on('connected', () => {
                console.log('✅ Finnhub WebSocket connected successfully');
            });
            
            service.on('disconnected', (info) => {
                console.warn(`⚠️  Finnhub disconnected: ${info.code} - ${info.reason}`);
            });
            
            service.on('error', (error) => {
                console.error('❌ Finnhub error:', error.message);
            });
            
            service.on('trade', (trade) => {
                // Optional: Log trades or store in database
            });
            
            // Check status after 2 seconds
            setTimeout(() => {
                const stats = service.getStats();
                console.log('📊 Finnhub Service Stats:', {
                    connected: stats.finnhubConnected,
                    clients: stats.clientsConnected,
                    symbols: stats.subscribedSymbols.length,
                    messages: stats.messagesReceived
                });
            }, 2000);
        }

        // Start Fastify server
        const port = parseInt(process.env.PORT || '8080');
        server = await app.listen({
            port,
            host: '0.0.0.0'
        });

        console.log('');
        console.log('🚀 Server started successfully!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`📍 HTTP:       http://localhost:${port}`);
        console.log(`📍 WebSocket:  ws://localhost:${port}/ws/finnhub`);
        console.log(`📍 GraphQL:    http://localhost:${port}/graphql`);
        console.log(`📍 Health:     http://localhost:${port}/health`);
        console.log(`📍 Status:     http://localhost:${port}/api/finnhub/status`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('');

    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

// Graceful shutdown
async function gracefulShutdown(signal: string) {
    console.log(`\n⚠️  ${signal} received. Starting graceful shutdown...`);
    
    try {
        // Close Fastify server
        if (server) {
            await server.close();
            console.log('✅ HTTP server closed');
        }

        // Shutdown Finnhub service
        await shutdownFinnhubService();
        
        console.log('✅ Graceful shutdown completed');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error during shutdown:', error);
        process.exit(1);
    }
}

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught errors
process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
    gracefulShutdown('UNCAUGHT_EXCEPTION');
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
    gracefulShutdown('UNHANDLED_REJECTION');
});

// Start the server
startServer();
