// backend/src/routes/bank.ts
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { authenticate } from '../middleware/auth.middleware.ts';
import BankDetails from '../models/bankDetails.model.ts';
import Notification from '../models/notification.model.ts';
import mongoose from 'mongoose';

export async function registerBankRoutes(app: FastifyInstance) {
      const getUserId = (user: any): string => {
        const userId = user?.id || user?.userId || user?.sub;
        if (!userId) {
            throw new Error('User ID not found in token');
        }
        return userId.toString();
    };
    // Get all bank accounts for the user
    app.get('/api/bank-accounts', {
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

            const accounts = await BankDetails.find({ userId })
                .sort({ isPrimary: -1, createdAt: -1 }); // Primary first, then by date

            return reply.send({
                success: true,
                data: accounts
            });
        } catch (error: any) {
            console.error('Error fetching bank accounts:', error);
            return reply.status(500).send({
                success: false,
                message: error.message || 'Failed to fetch bank accounts'
            });
        }
    });

    // Add a new bank account
    app.post('/api/bank-accounts', {
        preHandler: [authenticate]
    }, async (request: FastifyRequest, reply: FastifyReply) => {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const userId = (request as any).user?.userId;
            const body = request.body as any;

            if (!userId) {
                await session.abortTransaction();
                return reply.status(401).send({
                    success: false,
                    message: 'Unauthorized'
                });
            }

            // Validate required fields
            if (!body.bankName || !body.accountHolderName || !body.accountNumber || !body.ifscCode) {
                await session.abortTransaction();
                return reply.status(400).send({
                    success: false,
                    message: 'Please provide all required fields'
                });
            }

            // Check if account number already exists for this user
            const existingAccount = await BankDetails.findOne({
                userId,
                accountNumber: body.accountNumber
            }).session(session);

            if (existingAccount) {
                await session.abortTransaction();
                return reply.status(400).send({
                    success: false,
                    message: 'This bank account is already added'
                });
            }

            // Check if this should be the primary account (if it's the first one)
            const count = await BankDetails.countDocuments({ userId }).session(session);
            const isPrimary = count === 0;

            // Create bank account
            const bankAccount = await BankDetails.create([{
                userId,
                bankName: body.bankName,
                accountHolderName: body.accountHolderName,
                accountNumber: body.accountNumber,
                accountType: body.accountType || 'savings',
                ifscCode: body.ifscCode?.toUpperCase(),
                swiftCode: body.swiftCode,
                routingNumber: body.routingNumber,
                branchName: body.branchName,
                branchAddress: body.branchAddress,
                isPrimary: isPrimary,
                isVerified: false // Admin will verify
            }], { session });

            // Create notification
            await Notification.create([{
                userId,
                type: 'general',
                title: 'Bank Account Added',
                message: `Your bank account ${body.bankName} ****${body.accountNumber.slice(-4)} has been added and is pending verification.`,
                priority: 'medium',
                actionRequired: false
            }], { session });

            await session.commitTransaction();

            return reply.send({
                success: true,
                message: 'Bank account added successfully. Awaiting admin verification.',
                data: bankAccount[0]
            });
        } catch (error: any) {
            await session.abortTransaction();
            console.error('Error adding bank account:', error);
            return reply.status(500).send({
                success: false,
                message: error.message || 'Failed to add bank account'
            });
        } finally {
            session.endSession();
        }
    });

    // Update bank account (for marking as primary)
    app.patch('/api/bank-accounts/:id', {
        preHandler: [authenticate]
    }, async (request: FastifyRequest, reply: FastifyReply) => {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const userId = (request as any).user?.userId;
            const { id } = request.params as any;
            const { isPrimary } = request.body as any;

            if (!userId) {
                await session.abortTransaction();
                return reply.status(401).send({
                    success: false,
                    message: 'Unauthorized'
                });
            }

            // Find the account
            const account = await BankDetails.findOne({
                _id: id,
                userId
            }).session(session);

            if (!account) {
                await session.abortTransaction();
                return reply.status(404).send({
                    success: false,
                    message: 'Bank account not found'
                });
            }

            // If setting as primary, unset other primary accounts
            if (isPrimary === true) {
                await BankDetails.updateMany(
                    { userId, _id: { $ne: id } },
                    { isPrimary: false }
                ).session(session);

                account.isPrimary = true;
                await account.save({ session });
            }

            await session.commitTransaction();

            return reply.send({
                success: true,
                message: 'Bank account updated successfully',
                data: account
            });
        } catch (error: any) {
            await session.abortTransaction();
            console.error('Error updating bank account:', error);
            return reply.status(500).send({
                success: false,
                message: error.message || 'Failed to update bank account'
            });
        } finally {
            session.endSession();
        }
    });

    // Delete bank account
   app.delete('/api/bank-accounts/:id', {
        preHandler: [authenticate]
    }, async (request, reply) => {
        try {
            const userId = getUserId(request.user);
            const { id } = request.params as any;

            console.log(`🗑️ DELETE request for bank account: ${id}, user: ${userId}`);

            // Find account
            const account = await BankDetails.findOne({ _id: id, userId });

            if (!account) {
                console.log('❌ Bank account not found:', { id, userId });
                
                // Debug: Check if account exists at all
                const anyAccount = await BankDetails.findById(id);
                if (anyAccount) {
                    console.log('⚠️ Account exists but belongs to different user:', anyAccount.userId);
                }

                return reply.code(404).send({
                    success: false,
                    message: 'Bank account not found'
                });
            }

            console.log('✅ Bank account found:', {
                id: account._id,
                bankName: account.bankName,
                isPrimary: account.isPrimary
            });

            // Don't allow deletion of primary account if there are other accounts
            if (account.isPrimary) {
                const otherAccounts = await BankDetails.countDocuments({
                    userId,
                    _id: { $ne: id }
                });

                if (otherAccounts > 0) {
                    return reply.code(400).send({
                        success: false,
                        message: 'Cannot delete primary bank account. Set another account as primary first.'
                    });
                }
            }

            // Delete the account
            await BankDetails.findByIdAndDelete(id);

            console.log(`✅ Bank account deleted successfully: ${id}`);

            return reply.send({
                success: true,
                message: 'Bank account deleted successfully'
            });
        } catch (error: any) {
            console.error('❌ Error deleting bank account:', error);
            return reply.code(500).send({
                success: false,
                message: error.message || 'Failed to delete bank account'
            });
        }
    });
    // Get single bank account details
    app.get('/api/bank-accounts/:id', {
        preHandler: [authenticate]
    }, async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const userId = (request as any).user?.userId;
            const { id } = request.params as any;

            if (!userId) {
                return reply.status(401).send({
                    success: false,
                    message: 'Unauthorized'
                });
            }

            const account = await BankDetails.findOne({
                _id: id,
                userId
            });

            if (!account) {
                return reply.status(404).send({
                    success: false,
                    message: 'Bank account not found'
                });
            }

            return reply.send({
                success: true,
                data: account
            });
        } catch (error: any) {
            console.error('Error fetching bank account:', error);
            return reply.status(500).send({
                success: false,
                message: error.message || 'Failed to fetch bank account'
            });
        }
    });

    // ==========================
    // ADMIN ROUTES
    // ==========================

    // Get all pending bank accounts (Admin only)
    app.get('/api/admin/bank-accounts/pending', {
        preHandler: [authenticate] // Add admin role check middleware
    }, async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const user = (request as any).user;

            // Check if user is admin
            if (user?.role !== 'admin') {
                return reply.status(403).send({
                    success: false,
                    message: 'Access denied. Admin only.'
                });
            }

            const pendingAccounts = await BankDetails.find({ isVerified: false })
                .populate('userId', 'fullname email mobileNumber')
                .sort({ createdAt: -1 });

            return reply.send({
                success: true,
                data: pendingAccounts
            });
        } catch (error: any) {
            console.error('Error fetching pending accounts:', error);
            return reply.status(500).send({
                success: false,
                message: error.message || 'Failed to fetch pending accounts'
            });
        }
    });

    // Verify bank account (Admin only)
    app.post('/api/admin/bank-accounts/:id/verify', {
        preHandler: [authenticate]
    }, async (request: FastifyRequest, reply: FastifyReply) => {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const user = (request as any).user;
            const { id } = request.params as any;

            // Check if user is admin
            if (user?.role !== 'admin') {
                await session.abortTransaction();
                return reply.status(403).send({
                    success: false,
                    message: 'Access denied. Admin only.'
                });
            }

            const account = await BankDetails.findById(id)
                .populate('userId', 'fullname email')
                .session(session);

            if (!account) {
                await session.abortTransaction();
                return reply.status(404).send({
                    success: false,
                    message: 'Bank account not found'
                });
            }

            if (account.isVerified) {
                await session.abortTransaction();
                return reply.status(400).send({
                    success: false,
                    message: 'Bank account already verified'
                });
            }

            // Verify the account
            account.isVerified = true;
            account.verifiedAt = new Date();
            await account.save({ session });

            // Notify user
            await Notification.create([{
                userId: account.userId,
                type: 'general',
                title: 'Bank Account Verified',
                message: `Your bank account ${account.bankName} ****${account.accountNumber.slice(-4)} has been verified successfully. You can now request withdrawals.`,
                priority: 'high',
                actionRequired: false
            }], { session });

            await session.commitTransaction();

            return reply.send({
                success: true,
                message: 'Bank account verified successfully',
                data: account
            });
        } catch (error: any) {
            await session.abortTransaction();
            console.error('Error verifying bank account:', error);
            return reply.status(500).send({
                success: false,
                message: error.message || 'Failed to verify bank account'
            });
        } finally {
            session.endSession();
        }
    });

    // Reject bank account (Admin only)
    app.post('/api/admin/bank-accounts/:id/reject', {
        preHandler: [authenticate]
    }, async (request: FastifyRequest, reply: FastifyReply) => {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const user = (request as any).user;
            const { id } = request.params as any;
            const { reason } = request.body as any;

            // Check if user is admin
            if (user?.role !== 'admin') {
                await session.abortTransaction();
                return reply.status(403).send({
                    success: false,
                    message: 'Access denied. Admin only.'
                });
            }

            const account = await BankDetails.findById(id)
                .populate('userId', 'fullname email')
                .session(session);

            if (!account) {
                await session.abortTransaction();
                return reply.status(404).send({
                    success: false,
                    message: 'Bank account not found'
                });
            }

            // Notify user
            await Notification.create([{
                userId: account.userId,
                type: 'general',
                title: 'Bank Account Rejected',
                message: `Your bank account ${account.bankName} ****${account.accountNumber.slice(-4)} was rejected. Reason: ${reason || 'Invalid details'}`,
                priority: 'high',
                actionRequired: true
            }], { session });

            // Delete the rejected account
            await BankDetails.deleteOne({ _id: id }).session(session);

            await session.commitTransaction();

            return reply.send({
                success: true,
                message: 'Bank account rejected and deleted'
            });
        } catch (error: any) {
            await session.abortTransaction();
            console.error('Error rejecting bank account:', error);
            return reply.status(500).send({
                success: false,
                message: error.message || 'Failed to reject bank account'
            });
        } finally {
            session.endSession();
        }
    });

    // Get all bank accounts for all users (Admin only)
    app.get('/api/admin/bank-accounts', {
        preHandler: [authenticate]
    }, async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const user = (request as any).user;

            // Check if user is admin
            if (user?.role !== 'admin') {
                return reply.status(403).send({
                    success: false,
                    message: 'Access denied. Admin only.'
                });
            }

            const accounts = await BankDetails.find()
                .populate('userId', 'fullname email mobileNumber')
                .sort({ createdAt: -1 });

            return reply.send({
                success: true,
                data: accounts
            });
        } catch (error: any) {
            console.error('Error fetching all accounts:', error);
            return reply.status(500).send({
                success: false,
                message: error.message || 'Failed to fetch accounts'
            });
        }
    });
}
