import bcrypt from 'bcrypt';
import User from '../models/user.model.ts';
import AccountBalance from '../models/accountBalance.model.ts';
import Transaction from '../models/transaction.model.ts';
import Notification from '../models/notification.model.ts';
import Watchlist from '../models/watchlist.model.ts';
import Portfolio from '../models/portfolio.model.ts';
import OTP from '../models/otp.model.ts';
import Order from '../models/order.model.ts';
import Position from '../models/position.model.ts';
import { GraphQLError } from 'graphql';

// Helper to get user from context
const getAuthUser = (context: any) => {
    if (!context.user) {
        throw new GraphQLError('Unauthorized', {
            extensions: { code: 'UNAUTHENTICATED' }
        });
    }
    // Support both 'id' and 'userId' in JWT payload
    const userId = context.user.userId || context.user.id;
    if (!userId) {
        throw new GraphQLError('User ID not found in token', {
            extensions: { code: 'INVALID_TOKEN' }
        });
    }
    return { ...context.user, id: userId };
};

// Helper to generate OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

export const resolvers = {
    Query: {
        // Auth
        me: async (_: any, __: any, context: any) => {
            // Check if user is authenticated from context
            if (!context.user) {
                throw new Error('Not authenticated');
            }

            const user = await User.findById(context.user.userId)
                .select('-password -twoFactorSecret')
                .populate('Account_Balance')
                .populate('portfolio');

            if (!user) {
                throw new Error('User not found');
            }

            return user;
        },

        // Dashboard
        dashboard: async (_: any, __: any, context: any) => {
            const authUser = getAuthUser(context);
            const userId = authUser.id;

            if (!userId) {
                throw new GraphQLError('User ID not found in token', {
                    extensions: { code: 'INVALID_TOKEN' }
                });
            }

            // Get Account Balance
            let balance = await AccountBalance.findOne({ userId });
            if (!balance) {
                balance = new AccountBalance({
                    userId,
                    availableBalance: 0,
                    totalBalance: 0,
                    lockedBalance: 0,
                    totalDeposited: 0,
                    totalWithdrawn: 0,
                    totalProfit: 0,
                    totalLoss: 0,
                    currency: 'USD',
                    totalInvested: 0,
                    unrealizedPnL: 0,
                    realizedPnL: 0,
                    bonusBalance: 0,
                    referralEarnings: 0
                });
                await balance.save();
            }

            // Get Recent Activities
            const recentActivities = await Transaction.find({ userId })
                .sort({ createdAt: -1 })
                .limit(5);

            // Get Notifications
            const notifications = await Notification.find({ userId })
                .sort({ createdAt: -1 })
                .limit(5);

            // Get Watchlist
            const watchlist = await Watchlist.findOne({ userId });

            // Calculate Pending Actions
            const user = await User.findById(userId);
            let pendingActions = 0;
            if (user && !user.isVerified) pendingActions++;

            // Calculate balance change percentage
            let changePercentage = "+0%";
            if (balance.totalBalance > 0 && balance.totalProfit !== undefined) {
                const percentChange = (balance.totalProfit / balance.totalBalance) * 100;
                changePercentage = `${percentChange >= 0 ? '+' : ''}${percentChange.toFixed(1)}%`;
            }

            // Get all transactions for chart data
            const allTransactions = await Transaction.find({ userId }).sort({ createdAt: 1 });

            let portfolioPerformance: number[] = [];
            let depositActivity: number[] = [];

            if (allTransactions.length > 0) {
                // Group transactions by month for the last 12 months
                const monthlyData: { [key: string]: { portfolio: number, deposits: number } } = {};

                allTransactions.forEach(transaction => {
                    const monthKey = new Date(transaction.createdAt).toISOString().slice(0, 7); // YYYY-MM

                    if (!monthlyData[monthKey]) {
                        monthlyData[monthKey] = { portfolio: 0, deposits: 0 };
                    }

                    // Aggregate portfolio value (running total)
                    if (transaction.type === 'deposit' || transaction.type === 'withdrawal') {
                        monthlyData[monthKey].portfolio += transaction.amount;
                    }

                    // Track deposits separately
                    if (transaction.type === 'deposit') {
                        monthlyData[monthKey].deposits += transaction.amount;
                    }
                });

                // Convert to arrays (last 12 months)
                const months = Object.keys(monthlyData).sort().slice(-12);
                portfolioPerformance = months.map(month => monthlyData[month].portfolio);
                depositActivity = months.map(month => monthlyData[month].deposits);
            }

            return {
                balance: {
                    total: balance.totalBalance,
                    change: changePercentage,
                    recentDeposits: balance.totalDeposited
                },
                activities: recentActivities,
                notifications,
                watchlist: watchlist?.assets || [],
                pendingActions,
                charts: {
                    portfolioPerformance,
                    depositActivity
                }
            };
        },

        // User
        userProfile: async (_: any, __: any, context: any) => {
            if (!context.user) {
                throw new Error('Not authenticated');
            }

            const user = await User.findById(context.user.userId)
                .select('-password -twoFactorSecret');

            if (!user) {
                throw new Error('User not found');
            }

            return user;
        },

        userBalance: async (_: any, __: any, context: any) => {
            if (!context.user) {
                throw new Error('Not authenticated');
            }

            const balance = await AccountBalance.findOne({ userId: context.user.userId });

            if (!balance) {
                throw new Error('Balance not found');
            }

            return balance;
        },

        userPortfolio: async (_: any, __: any, context: any) => {
            if (!context.user) {
                throw new Error('Not authenticated');
            }

            const portfolio = await Portfolio.findOne({ userId: context.user.userId });

            if (!portfolio) {
                throw new Error('Portfolio not found');
            }

            return portfolio;
        },

        // Transactions
        transactions: async (_: any, args: any, context: any) => {
            const authUser = getAuthUser(context);
            const { page = 1, limit = 10, type, status } = args;

            const query: any = { userId: authUser.id };
            if (type) query.type = type;
            if (status) query.status = status;

            const skip = (page - 1) * limit;
            const transactions = await Transaction.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);

            const totalItems = await Transaction.countDocuments(query);
            const totalPages = Math.ceil(totalItems / limit);

            return {
                transactions,
                pagination: {
                    page,
                    limit,
                    totalPages,
                    totalItems,
                    hasNext: page < totalPages,
                    hasPrevious: page > 1
                }
            };
        },

        transaction: async (_: any, args: any, context: any) => {
            const authUser = getAuthUser(context);
            const transaction = await Transaction.findOne({
                _id: args.id,
                userId: authUser.id
            });

            if (!transaction) {
                throw new GraphQLError('Transaction not found', {
                    extensions: { code: 'NOT_FOUND' }
                });
            }
            return transaction;
        },

        // Notifications
        notifications: async (_: any, args: any, context: any) => {
            const authUser = getAuthUser(context);
            const { page = 1, limit = 20, isRead } = args;

            const query: any = { userId: authUser.id };
            if (isRead !== undefined) query.isRead = isRead;

            const skip = (page - 1) * limit;
            const notifications = await Notification.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);

            const totalItems = await Notification.countDocuments(query);
            const totalPages = Math.ceil(totalItems / limit);

            return {
                notifications,
                pagination: {
                    page,
                    limit,
                    totalPages,
                    totalItems,
                    hasNext: page < totalPages,
                    hasPrevious: page > 1
                }
            };
        },

        // Watchlist
        watchlist: async (_: any, __: any, context: any) => {
            const authUser = getAuthUser(context);
            let watchlist = await Watchlist.findOne({ userId: authUser.id });

            if (!watchlist) {
                watchlist = new Watchlist({ userId: authUser.id, assets: [] });
                await watchlist.save();
            }
            return watchlist;
        },

        // Orders
        orders: async (_: any, args: any, context: any) => {
            const authUser = getAuthUser(context);
            const { status } = args;

            const query: any = { userId: authUser.id };
            if (status) query.status = status;

            const orders = await Order.find(query).sort({ createdAt: -1 });
            return orders;
        },

        order: async (_: any, args: any, context: any) => {
            const authUser = getAuthUser(context);
            const order = await Order.findOne({
                _id: args.id,
                userId: authUser.id
            });

            if (!order) {
                throw new GraphQLError('Order not found', {
                    extensions: { code: 'NOT_FOUND' }
                });
            }
            return order;
        },

        // Positions
        positions: async (_: any, __: any, context: any) => {
            const authUser = getAuthUser(context);
            const positions = await Position.find({ userId: authUser.id }).sort({ openedAt: -1 });
            return positions;
        },

        position: async (_: any, args: any, context: any) => {
            const authUser = getAuthUser(context);
            const position = await Position.findOne({
                symbol: args.symbol,
                userId: authUser.id
            });

            if (!position) {
                throw new GraphQLError('Position not found', {
                    extensions: { code: 'NOT_FOUND' }
                });
            }
            return position;
        },

    },

    Mutation: {
        // Auth
        register: async (_: any, args: any, context: any) => {
            const { fullname, email, password, mobileNumber, Address, city, state, country, pincode } = args.input;

            const existingUser = await User.findOne({ email });
            if (existingUser) {
                throw new GraphQLError('Email already exists', {
                    extensions: { code: 'CONFLICT' }
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = new User({
                fullname,
                email,
                password: hashedPassword,
                mobileNumber,
                Address,
                city,
                state,
                country,
                pincode
            });

            await newUser.save();

            const token = await context.app.jwt.sign({
                id: newUser._id,
                email: newUser.email,
                role: newUser.role
            });

            return {
                success: true,
                message: 'User registered successfully',
                token,
                user: newUser
            };
        },

        login: async (_: any, args: any, context: any) => {
            const { email, password } = args.input;

            const user = await User.findOne({ email });
            if (!user) {
                throw new GraphQLError('Invalid credentials', {
                    extensions: { code: 'UNAUTHENTICATED' }
                });
            }

            const isMatch = await bcrypt.compare(password, user.password as string);
            if (!isMatch) {
                throw new GraphQLError('Invalid credentials', {
                    extensions: { code: 'UNAUTHENTICATED' }
                });
            }

            const token = await context.app.jwt.sign({
                id: user._id,
                email: user.email,
                role: user.role
            });

            return {
                success: true,
                message: 'Login successful',
                token,
                user
            };
        },

        logout: async (_: any, __: any, context: any) => {
            if (!context.user) {
                throw new Error('Not authenticated');
            }

            // Clear the auth cookie
            context.reply.clearCookie('auth_token');

            return {
                success: true,
                message: 'Logged out successfully'
            };
        },

        // OTP
        sendOTP: async (_: any, args: any) => {
            const { identifier } = args;

            const otp = generateOTP();
            const hashedOTP = await bcrypt.hash(otp, 10);

            // Store OTP in database
            await OTP.findOneAndUpdate(
                { identifier },
                {
                    identifier,
                    type: identifier.includes('@') ? 'email' : 'phone',
                    code: hashedOTP,
                    attempts: 0,
                    isVerified: false,
                    expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
                },
                { upsert: true, new: true }
            );

            // In production, send OTP via email/SMS
            console.log(`OTP for ${identifier}: ${otp}`);

            return {
                success: true,
                message: 'OTP sent successfully'
            };
        },

        verifyOTP: async (_: any, args: any, context: any) => {
            const { identifier, code } = args;

            const otpRecord = await OTP.findOne({ identifier });

            if (!otpRecord) {
                throw new GraphQLError('OTP not found', {
                    extensions: { code: 'NOT_FOUND' }
                });
            }

            if (otpRecord.expiresAt < new Date()) {
                throw new GraphQLError('OTP expired', {
                    extensions: { code: 'EXPIRED' }
                });
            }

            if (otpRecord.attempts >= 3) {
                throw new GraphQLError('Too many attempts', {
                    extensions: { code: 'TOO_MANY_ATTEMPTS' }
                });
            }

            const isValid = await bcrypt.compare(code, otpRecord.code);

            if (!isValid) {
                otpRecord.attempts += 1;
                await otpRecord.save();
                throw new GraphQLError('Invalid OTP', {
                    extensions: { code: 'INVALID_OTP' }
                });
            }

            // Mark as verified
            otpRecord.isVerified = true;
            await otpRecord.save();

            // Find or create user
            let user = await User.findOne({
                $or: [{ email: identifier }, { mobileNumber: identifier }]
            });

            if (!user) {
                // Create new user for OTP login
                user = new User({
                    fullname: 'User',
                    email: identifier.includes('@') ? identifier : undefined,
                    mobileNumber: !identifier.includes('@') ? identifier : undefined,
                    Address: 'Not provided',
                    city: 'Not provided',
                    state: 'Not provided',
                    country: 'Not provided',
                    pincode: '000000'
                });
                await user.save();
            }

            const token = await context.app.jwt.sign({
                id: user._id,
                email: user.email,
                role: user.role
            });

            return {
                success: true,
                message: 'OTP verified successfully',
                token,
                user
            };
        },

        // User
        updateProfile: async (_: any, args: any, context: any) => {
            const authUser = getAuthUser(context);
            const updates = args.input;

            const user = await User.findByIdAndUpdate(authUser.id, updates, { new: true })
                .select('-password -twoFactorSecret');

            if (!user) {
                throw new GraphQLError('User not found', {
                    extensions: { code: 'NOT_FOUND' }
                });
            }

            return user;
        },

        // Transactions
        createDeposit: async (_: any, args: any, context: any) => {
            const authUser = getAuthUser(context);
            const { amount, currency, paymentMethod, bankDetails, proofDocument } = args.input;

            const balance = await AccountBalance.findOne({ userId: authUser.id });
            const balanceBefore = balance?.totalBalance || 0;

            const transaction = new Transaction({
                userId: authUser.id,
                type: 'deposit',
                amount,
                currency,
                paymentMethod,
                bankDetails,
                proofDocument,
                status: 'pending',
                balanceBefore,
                balanceAfter: balanceBefore
            });

            await transaction.save();

            // Create notification
            await Notification.create({
                userId: authUser.id,
                type: 'general',
                title: 'Deposit Request Submitted',
                message: `Your deposit request of ${currency} ${amount} has been submitted and is pending verification.`,
                priority: 'medium',
                actionRequired: false
            });

            return transaction;
        },

        createWithdrawal: async (_: any, args: any, context: any) => {
            const authUser = getAuthUser(context);
            const { amount, currency, paymentMethod, bankDetails } = args.input;

            const balance = await AccountBalance.findOne({ userId: authUser.id });

            if (!balance || balance.availableBalance < amount) {
                throw new GraphQLError('Insufficient balance', {
                    extensions: { code: 'INSUFFICIENT_BALANCE' }
                });
            }

            const balanceBefore = balance.totalBalance;

            const transaction = new Transaction({
                userId: authUser.id,
                type: 'withdrawal',
                amount,
                currency,
                paymentMethod,
                bankDetails,
                status: 'pending',
                balanceBefore,
                balanceAfter: balanceBefore - amount
            });

            await transaction.save();

            // Lock the withdrawal amount
            balance.lockedBalance += amount;
            balance.availableBalance -= amount;
            await balance.save();

            // Create notification
            await Notification.create({
                userId: authUser.id,
                type: 'general',
                title: 'Withdrawal Request Submitted',
                message: `Your withdrawal request of ${currency} ${amount} has been submitted and is being processed.`,
                priority: 'medium',
                actionRequired: false
            });

            return transaction;
        },

        // Notifications
        markNotificationAsRead: async (_: any, args: any, context: any) => {
            const authUser = getAuthUser(context);

            const notification = await Notification.findOneAndUpdate(
                { _id: args.id, userId: authUser.id },
                { isRead: true },
                { new: true }
            );

            if (!notification) {
                throw new GraphQLError('Notification not found', {
                    extensions: { code: 'NOT_FOUND' }
                });
            }

            return notification;
        },

        markAllNotificationsAsRead: async (_: any, __: any, context: any) => {
            const authUser = getAuthUser(context);

            await Notification.updateMany(
                { userId: authUser.id, isRead: false },
                { isRead: true }
            );

            return {
                success: true,
                message: 'All notifications marked as read'
            };
        },

        deleteNotification: async (_: any, args: any, context: any) => {
            const authUser = getAuthUser(context);

            const notification = await Notification.findOneAndDelete({
                _id: args.id,
                userId: authUser.id
            });

            if (!notification) {
                throw new GraphQLError('Notification not found', {
                    extensions: { code: 'NOT_FOUND' }
                });
            }

            return {
                success: true,
                message: 'Notification deleted'
            };
        },

        // Watchlist
        addToWatchlist: async (_: any, args: any, context: any) => {
            const authUser = getAuthUser(context);
            const { symbol, assetType, alertPrice, notes } = args.input;

            let watchlist = await Watchlist.findOne({ userId: authUser.id });

            if (!watchlist) {
                watchlist = new Watchlist({ userId: authUser.id, assets: [] });
            }

            const exists = watchlist.assets.some((asset: any) => asset.symbol === symbol);
            if (exists) {
                throw new GraphQLError('Asset already in watchlist', {
                    extensions: { code: 'CONFLICT' }
                });
            }

            watchlist.assets.push({
                symbol,
                assetType,
                alertPrice,
                notes,
                addedAt: new Date()
            } as any);

            await watchlist.save();
            return watchlist;
        },

        removeFromWatchlist: async (_: any, args: any, context: any) => {
            const authUser = getAuthUser(context);

            const watchlist = await Watchlist.findOne({ userId: authUser.id });

            if (!watchlist) {
                throw new GraphQLError('Watchlist not found', {
                    extensions: { code: 'NOT_FOUND' }
                });
            }

            watchlist.assets = watchlist.assets.filter((asset: any) => asset.symbol !== args.symbol);
            await watchlist.save();

            return watchlist;
        },

        updateWatchlistItem: async (_: any, args: any, context: any) => {
            const authUser = getAuthUser(context);
            const { symbol, input } = args;

            const watchlist = await Watchlist.findOne({ userId: authUser.id });

            if (!watchlist) {
                throw new GraphQLError('Watchlist not found', {
                    extensions: { code: 'NOT_FOUND' }
                });
            }

            const asset = watchlist.assets.find((a: any) => a.symbol === symbol);
            if (!asset) {
                throw new GraphQLError('Asset not found in watchlist', {
                    extensions: { code: 'NOT_FOUND' }
                });
            }

            if (input.alertPrice !== undefined) (asset as any).alertPrice = input.alertPrice;
            if (input.notes !== undefined) (asset as any).notes = input.notes;

            await watchlist.save();
            return watchlist;
        },

        // Orders
        createOrder: async (_: any, args: any, context: any) => {
            const authUser = getAuthUser(context);
            const { symbol, assetType, orderType, side, quantity, price, stopPrice, timeInForce, notes } = args.input;

            // Validate order
            if (orderType === 'limit' && !price) {
                throw new GraphQLError('Price is required for limit orders', {
                    extensions: { code: 'VALIDATION_ERROR' }
                });
            }

            if ((orderType === 'stop' || orderType === 'stop_limit') && !stopPrice) {
                throw new GraphQLError('Stop price is required for stop orders', {
                    extensions: { code: 'VALIDATION_ERROR' }
                });
            }

            // Create order
            const order = new Order({
                userId: authUser.id,
                symbol: symbol.toUpperCase(),
                assetType,
                orderType,
                side,
                quantity,
                price,
                stopPrice,
                status: orderType === 'market' ? 'working' : 'pending',
                filledQuantity: 0,
                timeInForce: timeInForce || 'day',
                notes
            });

            await order.save();

            // Create notification
            await Notification.create({
                userId: authUser.id,
                type: 'general',
                title: 'Order Created',
                message: `Your ${side} order for ${quantity} ${symbol} has been placed.`,
                priority: 'medium',
                actionRequired: false
            });

            return order;
        },

        cancelOrder: async (_: any, args: any, context: any) => {
            const authUser = getAuthUser(context);

            const order = await Order.findOne({
                _id: args.id,
                userId: authUser.id
            });

            if (!order) {
                throw new GraphQLError('Order not found', {
                    extensions: { code: 'NOT_FOUND' }
                });
            }

            if (order.status === 'filled' || order.status === 'cancelled') {
                throw new GraphQLError('Cannot cancel this order', {
                    extensions: { code: 'INVALID_OPERATION' }
                });
            }

            order.status = 'cancelled';
            await order.save();

            // Create notification
            await Notification.create({
                userId: authUser.id,
                type: 'general',
                title: 'Order Cancelled',
                message: `Your ${order.side} order for ${order.quantity} ${order.symbol} has been cancelled.`,
                priority: 'low',
                actionRequired: false
            });

            return order;
        }
    }
};
