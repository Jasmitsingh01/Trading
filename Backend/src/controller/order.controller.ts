import type { FastifyRequest, FastifyReply } from 'fastify';
import Order from '../models/order.model.ts';
import ResponseHandler from '../utility/responseHnadler.ts';
import mongoose from 'mongoose';

export class OrderController {
    static async createOrder(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { symbol, assetType, orderType, side, quantity, price, stopPrice, timeInForce, notes } = request.body as any;
            const user = request.user as any;

            if (!symbol || !assetType || !orderType || !side || !quantity) {
                return ResponseHandler.badRequest(reply, 'Missing required fields');
            }

            const newOrder = new Order({
                userId: user.id,
                symbol,
                assetType,
                orderType: orderType.toLowerCase(),
                side: side.toLowerCase(),
                quantity,
                price,
                stopPrice,
                timeInForce: (timeInForce || 'day').toLowerCase(),
                notes,
                status: 'pending'
            });

            // Simple logic: if it's a market order, mark it as filled immediately for demo
            if (newOrder.orderType === 'market') {
                newOrder.status = 'filled';
                newOrder.filledQuantity = quantity;
                newOrder.averageFillPrice = price; // In a real app, this would come from the execution engine
            }

            await newOrder.save();

            return ResponseHandler.success(reply, { order: newOrder }, 'Order created successfully');
        } catch (error: any) {
            console.error('Create Order Error:', error);
            return ResponseHandler.error(reply, error.message || 'Internal Server Error');
        }
    }

    static async getOrders(request: FastifyRequest, reply: FastifyReply) {
        try {
            const user = request.user as any;
            const { status } = request.query as any;

            const query: any = { userId: user.id };
            if (status) {
                query.status = status;
            }

            const orders = await Order.find(query).sort({ createdAt: -1 });

            return ResponseHandler.success(reply, { orders }, 'Orders fetched successfully');
        } catch (error: any) {
            console.error('Get Orders Error:', error);
            return ResponseHandler.error(reply, error.message || 'Internal Server Error');
        }
    }

    static async cancelOrder(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { id } = request.params as any;
            const user = request.user as any;

            const order = await Order.findOne({ _id: id, userId: user.id });

            if (!order) {
                return ResponseHandler.notFound(reply, 'Order not found');
            }

            if (['filled', 'cancelled', 'rejected'].includes(order.status)) {
                return ResponseHandler.badRequest(reply, `Order cannot be cancelled as it is already ${order.status}`);
            }

            order.status = 'cancelled';
            await order.save();

            return ResponseHandler.success(reply, { order }, 'Order cancelled successfully');
        } catch (error: any) {
            console.error('Cancel Order Error:', error);
            return ResponseHandler.error(reply, error.message || 'Internal Server Error');
        }
    }
}
