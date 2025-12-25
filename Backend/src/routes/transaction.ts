// backend/src/routes/transaction.ts
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { authenticate } from '../middleware/auth.middleware';
import Transaction from '../models/transaction.model';
import UserBalance from '../models/accountBalance.model';
import Notification from '../models/notification.model';
import User from '../models/user.model';
import { uploadToCloudinary } from '../utility/cloudinary';

export async function registerTransactionRoutes(app: FastifyInstance) {
    // Create deposit with file upload
    app.post('/api/transactions/deposit', {
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

            // Get uploaded file
            const data = await request.file();

            if (!data) {
                return reply.status(400).send({
                    success: false,
                    message: 'No file uploaded'
                });
            }

            // Get form fields
            const fields: any = {};
            for await (const part of request.parts()) {
                if (part.type === 'field') {
                    fields[part.fieldname] = part.value;
                }
            }

            const { amount, currency, paymentMethod, transactionId, bankDetails } = fields;

            // Upload screenshot to Cloudinary
            const buffer = await data.toBuffer();
            const uploadResult = await uploadToCloudinary(buffer, 'payment-proofs');

            // Create transaction
            const transaction = await Transaction.create({
                userId,
                type: 'deposit',
                amount: parseFloat(amount),
                currency: currency || 'INR',
                status: 'pending',
                paymentMethod,
                bankDetails: {
                    ...JSON.parse(bankDetails || '{}'),
                    transactionId: transactionId || `TXN${Date.now()}`
                },
                proofDocument: uploadResult.secure_url,
                description: `UPI deposit of ₹${amount}`,
                balanceBefore: 0,
                balanceAfter: 0
            });

            // Create notification for admin
            await Notification.create({
                userId,
                title: 'New Deposit Request',
                message: `Deposit request of ₹${amount} submitted for verification`,
                type: 'deposit',
                priority: 'high',
                relatedEntityId: transaction._id,
                relatedEntityType: 'transaction'
            });

            // Create notification for user
            await Notification.create({
                userId,
                title: 'Deposit Submitted',
                message: `Your deposit request of ₹${amount} has been submitted and is pending verification.`,
                type: 'deposit',
                priority: 'medium',
                relatedEntityId: transaction._id,
                relatedEntityType: 'transaction'
            });

            return reply.send({
                success: true,
                message: 'Deposit request submitted successfully',
                data: transaction
            });

        } catch (error: any) {
            console.error('Deposit creation error:', error);
            return reply.status(500).send({
                success: false,
                message: error.message || 'Failed to create deposit'
            });
        }
    });

    // Get all transactions
    app.get('/api/transactions', {
        preHandler: [authenticate]
    }, async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const userId = (request as any).user?.userId;
            const { page = 1, limit = 10, type, status } = request.query as any;

            if (!userId) {
                return reply.status(401).send({
                    success: false,
                    message: 'Unauthorized'
                });
            }

            const query: any = { userId };
            if (type) query.type = type;
            if (status) query.status = status;

            const skip = (parseInt(page) - 1) * parseInt(limit);

            const [transactions, total] = await Promise.all([
                Transaction.find(query)
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(parseInt(limit)),
                Transaction.countDocuments(query)
            ]);

            return reply.send({
                success: true,
                data: {
                    transactions,
                    pagination: {
                        page: parseInt(page),
                        limit: parseInt(limit),
                        total,
                        pages: Math.ceil(total / parseInt(limit))
                    }
                }
            });
        } catch (error: any) {
            console.error('Get transactions error:', error);
            return reply.status(500).send({
                success: false,
                message: error.message || 'Failed to fetch transactions'
            });
        }
    });

    // Internal transfer between accounts
    app.post('/api/transactions/transfer', {
        preHandler: [authenticate]
    }, async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const userId = (request as any).user?.userId;
            const { fromAccount, toAccount, amount } = request.body as any;

            if (!userId) {
                return reply.status(401).send({
                    success: false,
                    message: 'Unauthorized'
                });
            }

            if (!amount || amount <= 0) {
                return reply.status(400).send({
                    success: false,
                    message: 'Invalid amount'
                });
            }

            // Get user balance
            const balance = await UserBalance.findOne({ userId });
            if (!balance) {
                return reply.status(404).send({
                    success: false,
                    message: 'User balance not found'
                });
            }

            // Create a transfer transaction record
            const transaction = await Transaction.create({
                userId,
                type: 'transfer',
                amount: parseFloat(amount),
                currency: balance.currency || 'INR',
                status: 'completed',
                description: `Internal transfer from ${fromAccount} to ${toAccount}`,
                balanceBefore: balance.totalBalance,
                balanceAfter: balance.totalBalance, // Total balance doesn't change on internal transfer
                notes: `Transfer from ${fromAccount} to ${toAccount}`
            });

            // Create notification
            await Notification.create({
                userId,
                title: 'Transfer Successful',
                message: `Successfully transferred ₹${amount} from ${fromAccount} to ${toAccount}`,
                type: 'general',
                priority: 'medium',
                relatedEntityId: transaction._id,
                relatedEntityType: 'transaction'
            });

            return reply.send({
                success: true,
                message: 'Transfer completed successfully',
                data: transaction
            });

        } catch (error: any) {
            console.error('Transfer creation error:', error);
            return reply.status(500).send({
                success: false,
                message: error.message || 'Failed to process transfer'
            });
        }
    });
}
