// Backend/src/controller/admin.orders.controller.ts

import type { FastifyRequest, FastifyReply } from 'fastify';
import Order from '../models/order.model';
import User from '../models/user.model';
import Position from '../models/position.model';
import AccountBalance from '../models/accountBalance.model';
import AdminActivityLog from '../models/adminActivityLog.model';

/**
 * Get all orders with filters and pagination
 */
export const getAllOrders = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        const {
            page = 1,
            limit = 20,
            status,
            orderType,
            assetType,
            side,
            userId,
            symbol,
            startDate,
            endDate,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query as any;

        const query: any = {};

        // Apply filters
        if (status) query.status = status;
        if (orderType) query.orderType = orderType;
        if (assetType) query.assetType = assetType;
        if (side) query.side = side;
        if (userId) query.userId = userId;
        if (symbol) query.symbol = new RegExp(symbol, 'i');

        // Date range filter
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) query.createdAt.$lte = new Date(endDate);
        }

        const skip = (Number(page) - 1) * Number(limit);
        const sortOptions: any = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

        const [orders, total] = await Promise.all([
            Order.find(query)
                .populate('userId', 'fullname email mobileNumber')
                .sort(sortOptions)
                .skip(skip)
                .limit(Number(limit))
                .lean(),
            Order.countDocuments(query)
        ]);

        // Calculate statistics
        const stats = await Order.aggregate([
            { $match: query },
            {
                $group: {
                    _id: null,
                    totalOrders: { $sum: 1 },
                    totalVolume: { $sum: '$quantity' },
                    totalValue: {
                        $sum: {
                            $multiply: ['$quantity', { $ifNull: ['$price', 0] }]
                        }
                    },
                    avgOrderSize: { $avg: '$quantity' }
                }
            }
        ]);

        return reply.send({
            success: true,
            data: {
                orders,
                pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    totalPages: Math.ceil(total / Number(limit)),
                    totalItems: total,
                    hasNext: Number(page) * Number(limit) < total,
                    hasPrevious: Number(page) > 1
                },
                stats: stats[0] || {
                    totalOrders: 0,
                    totalVolume: 0,
                    totalValue: 0,
                    avgOrderSize: 0
                }
            }
        });
    } catch (error: any) {
        console.error('Error fetching orders:', error);
        return reply.code(500).send({
            success: false,
            message: error.message || 'Failed to fetch orders'
        });
    }
};

/**
 * Get order details by ID
 */
export const getOrderById = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        const { orderId } = req.params as any;

        const order = await Order.findById(orderId)
            .populate('userId', 'fullname email mobileNumber accountStatus')
            .lean();

        if (!order) {
            return reply.code(404).send({
                success: false,
                message: 'Order not found'
            });
        }

        // Get related orders for the same symbol
        const relatedOrders = await Order.find({
            userId: order.userId,
            symbol: order.symbol,
            _id: { $ne: orderId }
        })
            .sort({ createdAt: -1 })
            .limit(5)
            .lean();

        return reply.send({
            success: true,
            data: {
                order,
                relatedOrders
            }
        });
    } catch (error: any) {
        console.error('Error fetching order:', error);
        return reply.code(500).send({
            success: false,
            message: error.message || 'Failed to fetch order'
        });
    }
};

/**
 * Update order status (Cancel/Reject/Fail)
 */
export const updateOrderStatus = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        const { orderId } = req.params as any;
        const { status, reason } = req.body as any;
        const adminId = (req.user as any)?.userId;

        if (!['cancelled', 'rejected', 'failed'].includes(status)) {
            return reply.code(400).send({
                success: false,
                message: 'Invalid status. Only cancelled, rejected, or failed are allowed.'
            });
        }

        const order = await Order.findById(orderId);
        if (!order) {
            return reply.code(404).send({
                success: false,
                message: 'Order not found'
            });
        }

        if (order.status === 'filled' || order.status === 'cancelled') {
            return reply.code(400).send({
                success: false,
                message: 'Cannot update a filled or cancelled order'
            });
        }

        // If order was partially filled, need to handle position cleanup
        if (order.filledQuantity > 0 && status === 'cancelled') {
            const position = await Position.findOne({
                userId: order.userId,
                symbol: order.symbol
            });

            if (position) {
                const unfilledQty = order.quantity - order.filledQuantity;
                position.quantity -= unfilledQty;

                if (position.quantity <= 0) {
                    await position.deleteOne();
                } else {
                    await position.save();
                }
            }
        }

        order.status = status as any;
        order.notes = reason || order.notes;
        await order.save();

        // Log admin activity
        await AdminActivityLog.create({
            adminId,
            action: 'update_order_status',
            targetUserId: order.userId,
            targetType: 'Order',
            targetId: order._id,
            description: `Updated order status to ${status}`,
            metadata: { status, reason },
            ipAddress: req.ip
        });

        return reply.send({
            success: true,
            message: `Order ${status} successfully`,
            data: { order }
        });
    } catch (error: any) {
        console.error('Error updating order status:', error);
        return reply.code(500).send({
            success: false,
            message: error.message || 'Failed to update order status'
        });
    }
};

/**
 * Force execute order (Admin override)
 */
export const forceExecuteOrder = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        const { orderId } = req.params as any;
        const { fillPrice, fillQuantity } = req.body as any;
        const adminId = (req.user as any)?.userId;

        const order = await Order.findById(orderId);
        if (!order) {
            return reply.code(404).send({
                success: false,
                message: 'Order not found'
            });
        }

        if (order.status === 'filled' || order.status === 'cancelled') {
            return reply.code(400).send({
                success: false,
                message: 'Cannot execute a filled or cancelled order'
            });
        }

        const qtyToFill = fillQuantity || order.quantity;
        const executionPrice = fillPrice || order.price || 0;

        // Update order
        order.status = 'filled';
        order.filledQuantity = qtyToFill;
        order.averageFillPrice = executionPrice;
        order.notes = (order.notes || '') + '\n[Admin Force Fill]';
        await order.save();

        // Update or create position
        let position = await Position.findOne({
            userId: order.userId,
            symbol: order.symbol
        });

        const totalCost = qtyToFill * executionPrice;

        if (position) {
            const newTotalCost = position.totalCost + totalCost;
            const newQuantity = position.quantity + qtyToFill;

            position.averagePrice = newTotalCost / newQuantity;
            position.quantity = newQuantity;
            position.totalCost = newTotalCost;
            await position.save();
        } else {
            position = await Position.create({
                userId: order.userId,
                symbol: order.symbol,
                assetType: order.assetType,
                quantity: qtyToFill,
                averagePrice: executionPrice,
                side: order.side === 'buy' ? 'long' : 'short',
                totalCost: totalCost,
                openedAt: new Date()
            });
        }

        // Update account balance (deduct cost for buy orders)
        if (order.side === 'buy') {
            const balance = await AccountBalance.findOne({ userId: order.userId });
            if (balance && balance.lockedBalance >= totalCost) {
                balance.lockedBalance -= totalCost;
                await balance.save();
            }
        }

        // Log admin activity
        await AdminActivityLog.create({
            adminId,
            action: 'force_execute_order',
            targetUserId: order.userId,
            targetType: 'Order',
            targetId: order._id,
            description: `Force executed order at ${executionPrice}`,
            metadata: { fillPrice: executionPrice, fillQuantity: qtyToFill },
            ipAddress: req.ip
        });

        return reply.send({
            success: true,
            message: 'Order executed successfully',
            data: { order, position }
        });
    } catch (error: any) {
        console.error('Error executing order:', error);
        return reply.code(500).send({
            success: false,
            message: error.message || 'Failed to execute order'
        });
    }
};

/**
 * Get order statistics
 */
export const getOrderStatistics = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        const { startDate, endDate } = req.query as any;

        const matchStage: any = {};
        if (startDate || endDate) {
            matchStage.createdAt = {};
            if (startDate) matchStage.createdAt.$gte = new Date(startDate);
            if (endDate) matchStage.createdAt.$lte = new Date(endDate);
        }

        // Status breakdown
        const statusStats = await Order.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                    totalVolume: { $sum: '$quantity' },
                    totalValue: { $sum: { $multiply: ['$quantity', { $ifNull: ['$price', 0] }] } }
                }
            }
        ]);

        // Asset type breakdown
        const assetTypeStats = await Order.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: '$assetType',
                    count: { $sum: 1 },
                    totalVolume: { $sum: '$quantity' }
                }
            }
        ]);

        // Side breakdown
        const sideStats = await Order.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: '$side',
                    count: { $sum: 1 },
                    totalValue: { $sum: { $multiply: ['$quantity', { $ifNull: ['$price', 0] }] } }
                }
            }
        ]);

        // Top symbols
        const topSymbols = await Order.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: '$symbol',
                    count: { $sum: 1 },
                    totalVolume: { $sum: '$quantity' },
                    totalValue: { $sum: { $multiply: ['$quantity', { $ifNull: ['$price', 0] }] } }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);

        // Most active users
        const topUsers = await Order.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: '$userId',
                    orderCount: { $sum: 1 },
                    totalVolume: { $sum: '$quantity' }
                }
            },
            { $sort: { orderCount: -1 } },
            { $limit: 10 },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            { $unwind: '$user' },
            {
                $project: {
                    userId: '$_id',
                    fullname: '$user.fullname',
                    email: '$user.email',
                    orderCount: 1,
                    totalVolume: 1
                }
            }
        ]);

        return reply.send({
            success: true,
            data: {
                statusStats,
                assetTypeStats,
                sideStats,
                topSymbols,
                topUsers
            }
        });
    } catch (error: any) {
        console.error('Error fetching order statistics:', error);
        return reply.code(500).send({
            success: false,
            message: error.message || 'Failed to fetch order statistics'
        });
    }
};

/**
 * Bulk cancel orders
 */
export const bulkCancelOrders = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        const { orderIds, reason } = req.body as any;
        const adminId = (req.user as any)?.userId;

        if (!Array.isArray(orderIds) || orderIds.length === 0) {
            return reply.code(400).send({
                success: false,
                message: 'Order IDs array is required'
            });
        }

        const result = await Order.updateMany(
            {
                _id: { $in: orderIds },
                status: { $in: ['pending', 'working', 'partially_filled'] }
            },
            {
                $set: {
                    status: 'cancelled',
                    notes: reason || 'Bulk cancelled by admin'
                }
            }
        );

        // Log admin activity
        await AdminActivityLog.create({
            adminId,
            action: 'bulk_cancel_orders',
            targetType: 'Order',
            description: `Bulk cancelled ${result.modifiedCount} orders`,
            metadata: { orderIds, reason, cancelled: result.modifiedCount },
            ipAddress: req.ip
        });

        return reply.send({
            success: true,
            message: `${result.modifiedCount} orders cancelled`,
            data: { cancelled: result.modifiedCount }
        });
    } catch (error: any) {
        console.error('Error bulk cancelling orders:', error);
        return reply.code(500).send({
            success: false,
            message: error.message || 'Failed to bulk cancel orders'
        });
    }
};
