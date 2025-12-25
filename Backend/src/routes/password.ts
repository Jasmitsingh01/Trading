// backend/src/routes/password.ts

import type { FastifyInstance } from 'fastify';
import {
  forgotPasswordHandler,
  verifyResetOTPHandler,
  resetPasswordHandler,
  changePasswordHandler
} from '../controller/password.controller.ts';

export const registerPasswordRoutes = (fastify: FastifyInstance) => {
  // Forgot password - send OTP
  fastify.post('/api/password/forgot', forgotPasswordHandler);

  // Verify reset OTP
  fastify.post('/api/password/verify-otp', verifyResetOTPHandler);

  // Reset password with token
  fastify.post('/api/password/reset', resetPasswordHandler);

  // Change password (protected route)
  fastify.post('/api/password/change', {
    preHandler: [async (req, reply) => {
      try {
        await req.jwtVerify();
      } catch (err) {
        reply.code(401).send({ error: 'Unauthorized' });
      }
    }]
  }, changePasswordHandler);

  console.log('✅ Password routes registered');
};

export default registerPasswordRoutes;
