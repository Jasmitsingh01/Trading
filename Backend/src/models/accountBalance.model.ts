import mongoose, { Schema } from 'mongoose';
import type { IAccountBalance } from '../Types/index.types.ts';

const AccountBalanceSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },

    // Balance information
    availableBalance: { type: Number, default: 0 },
    totalBalance: { type: Number, default: 0 },
    lockedBalance: { type: Number, default: 0 },
    totalDeposited: { type: Number, default: 0 },
    totalWithdrawn: { type: Number, default: 0 },
    totalProfit: { type: Number, default: 0 },
    totalLoss: { type: Number, default: 0 },

    // Currency
    currency: { type: String, enum: ['USD', 'EUR', 'GBP', 'INR'], default: 'USD' },

    // Calculated fields
    totalInvested: { type: Number, default: 0 },
    unrealizedPnL: { type: Number, default: 0 },
    realizedPnL: { type: Number, default: 0 },

    // Bonus and rewards
    bonusBalance: { type: Number, default: 0 },
    referralEarnings: { type: Number, default: 0 },

    lastUpdated: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model<IAccountBalance>('AccountBalance', AccountBalanceSchema);
