// backend/src/routes/auth.ts

import type { FastifyInstance } from 'fastify';
import {
    sendOTPHandler,
    verifyOTPHandler,
    registerHandler,
    loginHandler,
    logoutHandler,  // ✅ Add this import
    getMeHandler
} from '../controller/auth.controller.ts';

export const registerAuthRoutes = (fastify: FastifyInstance) => {
    // Send OTP
    fastify.post('/api/auth/send-otp', sendOTPHandler);

    // Verify OTP
    fastify.post('/api/auth/verify-otp', verifyOTPHandler);

    // Register
    fastify.post('/api/auth/register', registerHandler);

    // Login
    fastify.post('/api/auth/login', loginHandler);

    // ✅ LOGOUT - Clear all cookies and tokens
    fastify.post('/api/auth/logout', logoutHandler);

    // Get current user (protected route)
    fastify.get('/api/auth/me', {
        preHandler: [async (req, reply) => {
            try {
                await req.jwtVerify();
            } catch (err) {
                reply.code(401).send({ error: 'Unauthorized' });
            }
        }]
    }, getMeHandler);

    // Auth documentation
    fastify.get('/api/auth/docs', async (req, res) => {
        return {
            title: 'Authentication API Documentation',
            description: 'Complete authentication system with OTP verification and KYC',
            endpoints: {
                '/api/auth/send-otp': {
                    method: 'POST',
                    description: 'Send OTP to email or phone',
                    body: {
                        email: 'string (optional)',
                        phone: 'string (optional)'
                    },
                    response: 'OTP sent confirmation'
                },
                '/api/auth/verify-otp': {
                    method: 'POST',
                    description: 'Verify OTP code',
                    body: {
                        email: 'string (optional)',
                        phone: 'string (optional)',
                        emailOtp: 'string (if verifying email)',
                        phoneOtp: 'string (if verifying phone)'
                    },
                    response: 'Verification token'
                },
                '/api/auth/register': {
                    method: 'POST',
                    description: 'Register new user with KYC documents',
                    contentType: 'multipart/form-data',
                    fields: {
                        fullname: 'string',
                        email: 'string',
                        password: 'string',
                        mobileNumber: 'string',
                        Address: 'string',
                        Address1: 'string (optional)',
                        city: 'string',
                        state: 'string',
                        country: 'string',
                        pincode: 'string',
                        verificationToken: 'string (from email OTP verification)',
                        phoneVerificationToken: 'string (from phone OTP verification)',
                        identityProofType: 'string (pan/aadhaar)',
                        addressProofType: 'string (electricity/driving_license/aadhaar)',
                        avatar: 'file',
                        IdentityFront: 'file',
                        IdentityBack: 'file (optional)',
                        AddressProof: 'file',
                        AddressProofBack: 'file (optional)',
                        BankProof: 'file',
                        SelfieWithID: 'file (optional)',
                        OtherProof: 'file (optional)'
                    },
                    response: 'User created with JWT token'
                },
                '/api/auth/login': {
                    method: 'POST',
                    description: 'Login with email and password',
                    body: {
                        email: 'string',
                        password: 'string'
                    },
                    response: 'JWT token and user data'
                },
                '/api/auth/logout': {  // ✅ Add logout documentation
                    method: 'POST',
                    description: 'Logout user and clear all cookies',
                    response: 'Success message'
                },
                '/api/auth/me': {
                    method: 'GET',
                    description: 'Get current user profile',
                    headers: {
                        Authorization: 'Bearer <token>'
                    },
                    response: 'User profile data'
                }
            },
            features: [
                'Email OTP verification',
                'Phone SMS OTP verification',
                'Password-based login',
                'Multi-step registration with KYC',
                'Cloudinary image upload for documents',
                'JWT authentication',
                'Cookie-based session management',
                'Secure logout with cookie clearing',  // ✅ Added
                'Account balance and portfolio creation'
            ],
            timestamp: new Date().toISOString()
        };
    });

    console.log('✅ Auth routes registered (including logout)');
};

export default registerAuthRoutes;
