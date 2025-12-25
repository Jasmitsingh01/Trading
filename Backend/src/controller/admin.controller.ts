// backend/src/controllers/admin.controller.ts

import type { FastifyRequest, FastifyReply } from 'fastify';
import User from '../models/user.model.ts';
import Transaction from '../models/transaction.model.ts';
import Order from '../models/order.model.ts';
import AccountBalance from '../models/accountBalance.model.ts';
import Notification from '../models/notification.model.ts';
import RequestHandler from '../utility/requestHandler.ts';

/**
 * Get admin dashboard stats
 */
export const getDashboardStats = RequestHandler(async (req: FastifyRequest, res: FastifyReply) => {
  // @ts-ignore
  const userId = req.user?.userId;
  const user = await User.findById(userId);

  if (!user || user.role !== 'admin') {
    throw new Error('Unauthorized - Admin access only');
  }

  // Get total users
  const totalUsers = await User.countDocuments();
  const activeUsers = await User.countDocuments({ accountStatus: 'active' });
  const pendingKYC = await User.countDocuments({ kycStatus: 'pending' });

  // Get total transactions
  const totalTransactions = await Transaction.countDocuments();
  const pendingTransactions = await Transaction.countDocuments({ status: 'pending' });
  
  // Calculate total volume
  const volumeResult = await Transaction.aggregate([
    { $match: { status: 'completed' } },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);
  const totalVolume = volumeResult[0]?.total || 0;

  // Get recent transactions
  const recentTransactions = await Transaction.find()
    .populate('userId', 'fullname email')
    .sort({ createdAt: -1 })
    .limit(10);

  // Get total orders
  const totalOrders = await Order.countDocuments();
  const activeOrders = await Order.countDocuments({ status: { $in: ['pending', 'working'] } });

  // Calculate platform balance
  const balanceResult = await AccountBalance.aggregate([
    { $group: { _id: null, total: { $sum: '$totalBalance' } } }
  ]);
  const platformBalance = balanceResult[0]?.total || 0;

  // Get monthly revenue (completed deposits)
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthlyRevenueResult = await Transaction.aggregate([
    {
      $match: {
        type: 'deposit',
        status: 'completed',
        createdAt: { $gte: firstDayOfMonth }
      }
    },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);
  const monthlyRevenue = monthlyRevenueResult[0]?.total || 0;

  return {
    success: true,
    data: {
      stats: {
        totalUsers,
        activeUsers,
        pendingKYC,
        totalTransactions,
        pendingTransactions,
        totalVolume,
        totalOrders,
        activeOrders,
        platformBalance,
        monthlyRevenue
      },
      recentTransactions
    }
  };
});

/**
 * Get all users with pagination
 */
export const getAllUsers = RequestHandler(async (req: FastifyRequest<{
  Querystring: { page?: string; limit?: string; search?: string; status?: string }
}>, res: FastifyReply) => {
  // @ts-ignore
  const userId = req.user?.userId;
  const user = await User.findById(userId);

  if (!user || user.role !== 'admin') {
    throw new Error('Unauthorized - Admin access only');
  }

  const page = parseInt(req.query.page || '1');
  const limit = parseInt(req.query.limit || '20');
  const search = req.query.search || '';
  const status = req.query.status;

  const query: any = {};

  // Search filter
  if (search) {
    query.$or = [
      { fullname: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { mobileNumber: { $regex: search, $options: 'i' } }
    ];
  }

  // Status filter
  if (status) {
    query.accountStatus = status;
  }

  const skip = (page - 1) * limit;

  const users = await User.find(query)
    .select('-password -twoFactorSecret')
    .populate('Account_Balance')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalUsers = await User.countDocuments(query);
  const totalPages = Math.ceil(totalUsers / limit);

  return {
    success: true,
    data: {
      users,
      pagination: {
        page,
        limit,
        totalPages,
        totalUsers,
        hasNext: page < totalPages,
        hasPrevious: page > 1
      }
    }
  };
});

/**
 * Get user details by ID
 */
export const getUserDetails = RequestHandler(async (req: FastifyRequest<{
  Params: { userId: string }
}>, res: FastifyReply) => {
  // @ts-ignore
  const adminId = req.user?.userId;
  const admin = await User.findById(adminId);

  if (!admin || admin.role !== 'admin') {
    throw new Error('Unauthorized - Admin access only');
  }

  const user = await User.findById(req.params.userId)
    .select('-password -twoFactorSecret')
    .populate('Account_Balance')
    .populate('portfolio');

  if (!user) {
    throw new Error('User not found');
  }

  // Get user transactions
  const transactions = await Transaction.find({ userId: user._id })
    .sort({ createdAt: -1 })
    .limit(20);

  // Get user orders
  const orders = await Order.find({ userId: user._id })
    .sort({ createdAt: -1 })
    .limit(20);

  return {
    success: true,
    data: {
      user,
      transactions,
      orders
    }
  };
});

/**
 * Update user status
 */
export const updateUserStatus = RequestHandler(async (req: FastifyRequest<{
  Params: { userId: string };
  Body: { accountStatus: string; reason?: string }
}>, res: FastifyReply) => {
  // @ts-ignore
  const adminId = req.user?.userId;
  const admin = await User.findById(adminId);

  if (!admin || admin.role !== 'admin') {
    throw new Error('Unauthorized - Admin access only');
  }

  const { accountStatus, reason } = req.body;

  if (!['active', 'suspended', 'inactive'].includes(accountStatus)) {
    throw new Error('Invalid account status');
  }

  const user = await User.findByIdAndUpdate(
    req.params.userId,
    { accountStatus },
    { new: true }
  ).select('-password');

  if (!user) {
    throw new Error('User not found');
  }

  // Create notification for user
  await Notification.create({
    userId: user._id,
    type: accountStatus === 'suspended' ? 'accountsuspended' : 'general',
    title: `Account ${accountStatus}`,
    message: reason || `Your account has been ${accountStatus} by admin`,
    priority: 'high',
    actionRequired: accountStatus === 'suspended'
  });

  return {
    success: true,
    message: `User account ${accountStatus} successfully`,
    data: { user }
  };
});

/**
 * Update KYC status
 */
export const updateKYCStatus = RequestHandler(async (req: FastifyRequest<{
  Params: { userId: string };
  Body: { kycStatus: string; reason?: string }
}>, res: FastifyReply) => {
  // @ts-ignore
  const adminId = req.user?.userId;
  const admin = await User.findById(adminId);

  if (!admin || admin.role !== 'admin') {
    throw new Error('Unauthorized - Admin access only');
  }

  const { kycStatus, reason } = req.body;

  if (!['pending', 'approved', 'rejected'].includes(kycStatus)) {
    throw new Error('Invalid KYC status');
  }

  const user = await User.findByIdAndUpdate(
    req.params.userId,
    { 
      kycStatus,
      isKYCCompleted: kycStatus === 'approved',
      accountStatus: kycStatus === 'approved' ? 'active' : 'pending'
    },
    { new: true }
  ).select('-password');

  if (!user) {
    throw new Error('User not found');
  }

  // Create notification
  await Notification.create({
    userId: user._id,
    type: kycStatus === 'approved' ? 'kycapproved' : 'kycrejected',
    title: `KYC ${kycStatus}`,
    message: reason || `Your KYC verification has been ${kycStatus}`,
    priority: 'high'
  });

  return {
    success: true,
    message: `KYC status updated to ${kycStatus}`,
    data: { user }
  };
});

/**
 * Get all transactions with filters
 */
export const getAllTransactions = RequestHandler(async (req: FastifyRequest<{
  Querystring: { 
    page?: string; 
    limit?: string; 
    type?: string; 
    status?: string;
    startDate?: string;
    endDate?: string;
  }
}>, res: FastifyReply) => {
  // @ts-ignore
  const adminId = req.user?.userId;
  const admin = await User.findById(adminId);

  if (!admin || admin.role !== 'admin') {
    throw new Error('Unauthorized - Admin access only');
  }

  const page = parseInt(req.query.page || '1');
  const limit = parseInt(req.query.limit || '20');
  const type = req.query.type;
  const status = req.query.status;
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;

  const query: any = {};

  if (type) query.type = type;
  if (status) query.status = status;
  
  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }

  const skip = (page - 1) * limit;

  const transactions = await Transaction.find(query)
    .populate('userId', 'fullname email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalTransactions = await Transaction.countDocuments(query);
  const totalPages = Math.ceil(totalTransactions / limit);

  return {
    success: true,
    data: {
      transactions,
      pagination: {
        page,
        limit,
        totalPages,
        totalTransactions,
        hasNext: page < totalPages,
        hasPrevious: page > 1
      }
    }
  };
});

/**
 * Update transaction status
 */
export const updateTransactionStatus = RequestHandler(async (req: FastifyRequest<{
  Params: { transactionId: string };
  Body: { status: string; notes?: string }
}>, res: FastifyReply) => {
  // @ts-ignore
  const adminId = req.user?.userId;
  const admin = await User.findById(adminId);

  if (!admin || admin.role !== 'admin') {
    throw new Error('Unauthorized - Admin access only');
  }

  const { status, notes } = req.body;

  if (!['pending', 'processing', 'completed', 'failed', 'rejected'].includes(status)) {
    throw new Error('Invalid transaction status');
  }

  const transaction = await Transaction.findById(req.params.transactionId);
  if (!transaction) {
    throw new Error('Transaction not found');
  }

  const oldStatus = transaction.status;
  transaction.status = status as any;
  if (notes) transaction.notes = notes;

  // If completing a deposit, update user balance
  if (status === 'completed' && transaction.type === 'deposit' && oldStatus !== 'completed') {
    const balance = await AccountBalance.findOne({ userId: transaction.userId });
    if (balance) {
      balance.availableBalance += transaction.amount;
      balance.totalBalance += transaction.amount;
      balance.totalDeposited += transaction.amount;
      await balance.save();

      transaction.balanceAfter = balance.totalBalance;
    }
  }

  // If completing a withdrawal, deduct from locked balance
  if (status === 'completed' && transaction.type === 'withdrawal' && oldStatus !== 'completed') {
    const balance = await AccountBalance.findOne({ userId: transaction.userId });
    if (balance) {
      balance.lockedBalance -= transaction.amount;
      balance.totalBalance -= transaction.amount;
      balance.totalWithdrawn += transaction.amount;
      await balance.save();

      transaction.balanceAfter = balance.totalBalance;
    }
  }

  await transaction.save();

  // Create notification
  await Notification.create({
    userId: transaction.userId,
    type: status === 'completed' ? 'paymentapproved' : 'paymentrejected',
    title: `Transaction ${status}`,
    message: `Your ${transaction.type} of $${transaction.amount} has been ${status}`,
    priority: 'high'
  });

  return {
    success: true,
    message: `Transaction ${status} successfully`,
    data: { transaction }
  };
});

/**
 * Get platform statistics
 */
export const getPlatformStats = RequestHandler(async (req: FastifyRequest, res: FastifyReply) => {
  // @ts-ignore
  const userId = req.user?.userId;
  const user = await User.findById(userId);

  if (!user || user.role !== 'admin') {
    throw new Error('Unauthorized - Admin access only');
  }

  // User growth over last 12 months
  const userGrowth = await User.aggregate([
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
    { $limit: 12 }
  ]);

  // Revenue over last 12 months
  const revenue = await Transaction.aggregate([
    {
      $match: {
        type: 'deposit',
        status: 'completed'
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        },
        total: { $sum: '$amount' }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
    { $limit: 12 }
  ]);

  // Transaction types breakdown
  const transactionBreakdown = await Transaction.aggregate([
    { $group: { _id: '$type', count: { $sum: 1 }, total: { $sum: '$amount' } } }
  ]);

  return {
    success: true,
    data: {
      userGrowth,
      revenue,
      transactionBreakdown
    }
  };
});

export default {
  getDashboardStats,
  getAllUsers,
  getUserDetails,
  updateUserStatus,
  updateKYCStatus,
  getAllTransactions,
  updateTransactionStatus,
  getPlatformStats
};
