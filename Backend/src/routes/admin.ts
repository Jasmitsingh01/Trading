// backend/src/routes/admin.ts

import type { FastifyInstance } from 'fastify';
import {
  getDashboardStats,
  getAllUsers,
  getUserDetails,
  updateUserStatus,
  updateKYCStatus,
  getAllTransactions,
  updateTransactionStatus,
  getPlatformStats
} from '../controller/admin.controller.ts';

// Admin auth middleware
const adminAuthMiddleware = async (req: any, reply: any) => {
  try {
    await req.jwtVerify();
    
    // Check if user is admin
    const User = (await import('../models/user.model.ts')).default;
    const user = await User.findById(req.user.userId);
    
    if (!user || user.role !== 'admin') {
      reply.code(403).send({ 
        success: false, 
        message: 'Forbidden - Admin access only' 
      });
    }
  } catch (err) {
    reply.code(401).send({ 
      success: false, 
      message: 'Unauthorized' 
    });
  }
};

export const registerAdminRoutes = (fastify: FastifyInstance) => {
  // Dashboard stats
  fastify.get('/api/admin/dashboard', {
    preHandler: [adminAuthMiddleware]
  }, getDashboardStats);

  // Users management
  fastify.get('/api/admin/users', {
    preHandler: [adminAuthMiddleware]
  }, getAllUsers);

  fastify.get('/api/admin/users/:userId', {
    preHandler: [adminAuthMiddleware]
  }, getUserDetails);

  fastify.patch('/api/admin/users/:userId/status', {
    preHandler: [adminAuthMiddleware]
  }, updateUserStatus);

  fastify.patch('/api/admin/users/:userId/kyc', {
    preHandler: [adminAuthMiddleware]
  }, updateKYCStatus);

  // Transactions management
  fastify.get('/api/admin/transactions', {
    preHandler: [adminAuthMiddleware]
  }, getAllTransactions);

  fastify.patch('/api/admin/transactions/:transactionId/status', {
    preHandler: [adminAuthMiddleware]
  }, updateTransactionStatus);

  // Platform statistics
  fastify.get('/api/admin/stats', {
    preHandler: [adminAuthMiddleware]
  }, getPlatformStats);

  console.log('✅ Admin routes registered');
};

export default registerAdminRoutes;
