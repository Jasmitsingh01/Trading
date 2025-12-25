// backend/src/routes/order.ts
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { authenticate } from '../middleware/auth.middleware';
import { Order } from '../models/order.model';
import User from '../models/user.model';
import UserBalance from '../models/accountBalance.model';

export async function registerOrderRoutes(app: FastifyInstance) {
    // Create order - WITH VALIDATION
    app.post('/api/orders', {
        preHandler: [authenticate]
    }, async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const userId = (request as any).user?.userId;

            if (!userId) {
                return reply.status(401).send({
                    success: false,
                    message: 'Please login to place an order'
                });
            }

            const orderData = request.body as any;

            // 1. CHECK USER ACCOUNT STATUS & KYC VERIFICATION
            const user = await User.findById(userId);

            if (!user) {
                return reply.status(404).send({
                    success: false,
                    message: 'User not found'
                });
            }

            // Check if account is active
            if (user.accountStatus !== 'active') {
                return reply.status(403).send({
                    success: false,
                    message: `Your account is ${user.accountStatus}. Please contact support.`
                });
            }

            // Check if KYC is approved
            if (user.kycStatus !== 'approved') {
                return reply.status(403).send({
                    success: false,
                    message: `KYC verification required. Your KYC status is: ${user.kycStatus}. Please complete verification to start trading.`
                });
            }

            // 2. CHECK USER BALANCE
            let userBalance = await UserBalance.findOne({ userId });

            // Create balance record if doesn't exist
            if (!userBalance) {
                userBalance = await UserBalance.create({
                    userId,
                    totalBalance: 0,
                    availableBalance: 0,
                    totalDeposited: 0,
                    totalWithdrawn: 0,
                    totalInvested: 0,
                    totalProfit: 0
                });
            }

            // 3. CALCULATE ORDER COST
            const quantity = parseFloat(orderData.quantity);
            let orderCost = 0;

            if (orderData.orderType === 'market') {
                // For market orders, use current price (you should pass this from frontend)
                orderCost = quantity * (orderData.price || 0);
            } else if (orderData.orderType === 'limit') {
                // For limit orders, use limit price
                orderCost = quantity * (orderData.price || 0);
            } else if (orderData.orderType === 'stop' || orderData.orderType === 'stop-limit') {
                // For stop orders, use stop price
                orderCost = quantity * (orderData.stopPrice || orderData.price || 0);
            }

            // 4. VALIDATE SUFFICIENT BALANCE (only for BUY orders)
            if (orderData.side === 'buy') {
                if (userBalance.availableBalance < orderCost) {
                    return reply.status(400).send({
                        success: false,
                        message: `Insufficient balance. Required: $${orderCost.toFixed(2)}, Available: $${userBalance.availableBalance.toFixed(2)}`
                    });
                }

                // Reserve the balance (deduct from available)
                userBalance.availableBalance -= orderCost;
                userBalance.totalInvested += orderCost;
                await userBalance.save();
            }

            // 5. VALIDATE ORDER DATA
            if (!orderData.symbol || !orderData.assetType || !orderData.orderType || !orderData.side) {
                return reply.status(400).send({
                    success: false,
                    message: 'Missing required order fields'
                });
            }

            if (quantity <= 0) {
                return reply.status(400).send({
                    success: false,
                    message: 'Quantity must be greater than 0'
                });
            }

            // 6. CREATE THE ORDER
            const order = await Order.create({
                userId,
                symbol: orderData.symbol,
                assetType: orderData.assetType,
                orderType: orderData.orderType,
                side: orderData.side,
                quantity: quantity,
                price: orderData.price,
                stopPrice: orderData.stopPrice,
                timeInForce: orderData.timeInForce || 'gtc',
                status: 'pending',
                filledQuantity: 0
            });

            return reply.send({
                success: true,
                message: 'Order placed successfully',
                data: order
            });

        } catch (error: any) {
            console.error('Order creation error:', error);
            return reply.status(500).send({
                success: false,
                message: error.message || 'Failed to create order'
            });
        }
    });

    // Get all orders
    app.get('/api/orders', {
        preHandler: [authenticate]
    }, async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const userId = (request as any).user?.userId;

            if (!userId) {
                return reply.status(401).send({
                    success: false,
                    message: 'Unauthorized'
                });
            }

            const { status } = request.query as { status?: string };

            const query: any = { userId };
            if (status) {
                query.status = status;
            }

            const orders = await Order.find(query).sort({ createdAt: -1 });

            return reply.send({
                success: true,
                data: orders
            });
        } catch (error: any) {
            console.error('Get orders error:', error);
            return reply.status(500).send({
                success: false,
                message: error.message || 'Failed to fetch orders'
            });
        }
    });

    // Get single order
    app.get('/api/orders/:id', {
        preHandler: [authenticate]
    }, async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const userId = (request as any).user?.userId;
            const { id } = request.params as { id: string };

            if (!userId) {
                return reply.status(401).send({
                    success: false,
                    message: 'Unauthorized'
                });
            }

            const order = await Order.findOne({ _id: id, userId });

            if (!order) {
                return reply.status(404).send({
                    success: false,
                    message: 'Order not found'
                });
            }

            return reply.send({
                success: true,
                data: order
            });
        } catch (error: any) {
            console.error('Get order error:', error);
            return reply.status(500).send({
                success: false,
                message: error.message || 'Failed to fetch order'
            });
        }
    });

    // Cancel order
    app.patch('/api/orders/:id/cancel', {
        preHandler: [authenticate]
    }, async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const userId = (request as any).user?.userId;
            const { id } = request.params as { id: string };

            if (!userId) {
                return reply.status(401).send({
                    success: false,
                    message: 'Unauthorized'
                });
            }

            const order = await Order.findOne({ _id: id, userId });

            if (!order) {
                return reply.status(404).send({
                    success: false,
                    message: 'Order not found'
                });
            }

            if (order.status !== 'pending') {
                return reply.status(400).send({
                    success: false,
                    message: 'Only pending orders can be cancelled'
                });
            }

            // Refund balance if it was a buy order
            if (order.side === 'buy') {
                const userBalance = await UserBalance.findOne({ userId });
                if (userBalance) {
                    const orderCost = order.quantity * (order.price || 0);
                    userBalance.availableBalance += orderCost;
                    userBalance.totalInvested -= orderCost;
                    await userBalance.save();
                }
            }

            order.status = 'cancelled';
            await order.save();

            return reply.send({
                success: true,
                message: 'Order cancelled successfully',
                data: order
            });
        } catch (error: any) {
            console.error('Cancel order error:', error);
            return reply.status(500).send({
                success: false,
                message: error.message || 'Failed to cancel order'
            });
        }
    });

    // Delete order (admin only)
    app.delete('/api/orders/:id', {
        preHandler: [authenticate]
    }, async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const userId = (request as any).user?.userId;
            const userRole = (request as any).user?.role;
            const { id } = request.params as { id: string };

            if (!userId) {
                return reply.status(401).send({
                    success: false,
                    message: 'Unauthorized'
                });
            }

            // Only allow deletion for admin or order owner
            const order = await Order.findById(id);

            if (!order) {
                return reply.status(404).send({
                    success: false,
                    message: 'Order not found'
                });
            }

            if (order.userId.toString() !== userId && userRole !== 'admin') {
                return reply.status(403).send({
                    success: false,
                    message: 'You do not have permission to delete this order'
                });
            }

            await Order.findByIdAndDelete(id);

            return reply.send({
                success: true,
                message: 'Order deleted successfully'
            });
        } catch (error: any) {
            console.error('Delete order error:', error);
            return reply.status(500).send({
                success: false,
                message: error.message || 'Failed to delete order'
            });
        }
    });
}
