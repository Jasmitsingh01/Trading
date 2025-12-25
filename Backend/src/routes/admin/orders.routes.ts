// Backend/src/routes/admin/orders.routes.ts

import type { FastifyInstance } from 'fastify';
import {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  forceExecuteOrder,
  getOrderStatistics,
  bulkCancelOrders
} from '../../controller/admin.orders.controller';

// Admin auth middleware
const adminAuthMiddleware = async (req: any, reply: any) => {
  try {
    await req.jwtVerify();
    
    const User = (await import('../../models/user.model')).default;
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

export const registerAdminOrdersRoutes = (fastify: FastifyInstance) => {
  // Get all orders with filters
  fastify.get('/api/admin/orders', {
    preHandler: [adminAuthMiddleware]
  }, getAllOrders);

  // Get order statistics
  fastify.get('/api/admin/orders/stats', {
    preHandler: [adminAuthMiddleware]
  }, getOrderStatistics);

  // Get order by ID
  fastify.get('/api/admin/orders/:orderId', {
    preHandler: [adminAuthMiddleware]
  }, getOrderById);

  // Update order status (cancel/reject)
  fastify.patch('/api/admin/orders/:orderId/status', {
    preHandler: [adminAuthMiddleware]
  }, updateOrderStatus);

  // Force execute order
  fastify.post('/api/admin/orders/:orderId/execute', {
    preHandler: [adminAuthMiddleware]
  }, forceExecuteOrder);

  // Bulk cancel orders
  fastify.post('/api/admin/orders/bulk/cancel', {
    preHandler: [adminAuthMiddleware]
  }, bulkCancelOrders);

  console.log('✅ Admin orders routes registered');
};

export default registerAdminOrdersRoutes;
