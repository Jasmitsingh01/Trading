// backend/src/app.ts
import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from '@fastify/jwt';
import cookie from '@fastify/cookie';
import multipart from '@fastify/multipart';
import websocket from '@fastify/websocket';
import mercurius from 'mercurius';
import { schema } from './graphql/schema.ts';
import { resolvers } from './graphql/resolvers.ts';
import { registerNewsRoutes } from './routes/news.ts';
import { registerAuthRoutes } from './routes/auth.ts';
import { registerFinnhubWebSocketRoute } from './routes/finnhub.ts';
import { registerOrderRoutes } from './routes/order.ts';
import { registerMarketRoutes } from './routes/market.ts';
import { registerBankRoutes } from './routes/bank.ts';
import { authenticate } from './middleware/auth.middleware.ts';
import { config } from "dotenv";
import { registerTransactionRoutes } from './routes/transaction.ts';
import { registerPasswordRoutes } from './routes/password.ts';
import { registerAdminRoutes } from './routes/admin.ts';  // ✅ Add this
import { registerAdminOrdersRoutes } from './routes/admin/orders.routes';
// Load environment variables FIRST
config();

const app = Fastify({
    logger: true,
    connectionTimeout: 0,
    keepAliveTimeout: 0
});

// Register plugins
await app.register(cors, {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // ✅ Added all methods
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept',
        'Origin',
        'Cookie'  // ✅ Important for cookie-based auth
    ],
    exposedHeaders: ['Set-Cookie'],
    maxAge: 86400, // 24 hours - cache preflight requests
    preflightContinue: false,
    optionsSuccessStatus: 204
});
await app.register(cookie, {
    secret: process.env.JWT_SECRET,
    parseOptions: {}
});

await app.register(jwt, {
    secret: process.env.JWT_SECRET as string,
    cookie: {
        cookieName: 'auth_token',
        signed: false
    }
});



await app.register(multipart, {
    attachFieldsToBody: true,
    limits: {
        fileSize: 1024 * 1024 * 50 // 50MB
    }
});

await app.register(websocket, {
    options: {
        maxPayload: 1048576,
        perMessageDeflate: false,
        clientTracking: true
    }
});

await app.register(registerAdminRoutes);  // ✅ Add this

// Decorate Fastify with authenticate method
app.decorate('authenticate', authenticate);

// Register GraphQL with Mercurius - FIXED CONTEXT
await app.register(mercurius, {
    schema,
    resolvers,
    graphiql: process.env.NODE_ENV === 'development',
    path: '/graphql',
    context: async (request, reply) => {
        let user = null;

        try {
            // Try to get token from cookie
            const token = request.cookies.auth_token;

            if (token) {
                try {
                    // Verify the token manually (don't use jwtVerify which expects headers)
                    const decoded = app.jwt.verify(token);
                    user = decoded;
                    console.log('✅ GraphQL context - User authenticated:', user);
                } catch (err) {
                    console.log('⚠️ GraphQL context - Invalid token in cookie');
                }
            } else {
                console.log('ℹ️ GraphQL context - No auth token in cookie');
            }
        } catch (err) {
            console.error('❌ GraphQL context error:', err);
        }

        return {
            app,
            request,
            reply,
            user
        };
    }
});

// Test endpoint
app.get('/test', async (request, reply) => {
    return { message: 'Test endpoint working', timestamp: new Date().toISOString() };
});

// Register REST API Routes
await registerAuthRoutes(app);
await registerOrderRoutes(app);
await registerNewsRoutes(app);
await registerFinnhubWebSocketRoute(app);
await registerMarketRoutes(app);
await registerBankRoutes(app);
await registerTransactionRoutes(app);
await registerPasswordRoutes(app);
await registerAdminOrdersRoutes(app);
// Handle preflight requests

// Health check endpoint
app.get('/health', async (request, reply) => {
    return {
        status: 'OK',
        timestamp: new Date().toISOString(),
        services: {
            database: 'connected',
            websocket: 'active',
            graphql: 'active',
            news: 'active'
        }
    };
});

// API documentation endpoint
app.get('/api/docs', async (request, reply) => {
    return {
        title: 'Trading Platform API Documentation',
        version: '1.0.0',
        endpoints: {
            graphql: '/graphql',
            websocket: 'ws://localhost:8080/ws/finnhub',
            news: '/api/news/docs',
            health: '/health',
            bank: '/api/bank-accounts',
            transaction: '/api/transaction'
        },
        timestamp: new Date().toISOString()
    };
});

// ✅ Add this after registering other plugins
app.addContentTypeParser('application/json', { parseAs: 'string' }, (req, body, done) => {
    try {
        // ✅ Handle empty body for DELETE requests
        if (!body || body === '') {
            done(null, {});
        } else {
            const json = JSON.parse(body as string);
            done(null, json);
        }
    } catch (err: any) {
        err.statusCode = 400;
        done(err, undefined);
    }
});

export default app;
