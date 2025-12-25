// backend/src/middleware/auth.middleware.ts
import type { FastifyRequest, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const authenticate = async (req: FastifyRequest, res: FastifyReply) => {
    try {
        // Get token from cookie
        const token = req.cookies.auth_token;

        console.log('🔐 Auth Middleware - Checking cookie:', token ? 'EXISTS' : 'MISSING');

        if (!token) {
            return res.status(401).send({
                success: false,
                message: 'No authentication token found. Please login.'
            });
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, JWT_SECRET) as any;
            console.log('✅ Token verified:', decoded);

            // Attach user to request
            (req as any).user = {
                userId: decoded.userId || decoded.id,
                email: decoded.email,
                role: decoded.role
            };

            console.log('✅ User attached to request:', (req as any).user);
        } catch (jwtError) {
            console.error('❌ JWT verification failed:', jwtError);
            return res.status(401).send({
                success: false,
                message: 'Invalid or expired token. Please login again.'
            });
        }
    } catch (error) {
        console.error('❌ Auth middleware error:', error);
        return res.status(401).send({
            success: false,
            message: 'Authentication failed'
        });
    }
};

export const authMiddleware = authenticate;
