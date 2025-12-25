import mongoose, { Schema } from 'mongoose';
import type { IInvestment } from '../Types/index.types.ts';

const InvestmentSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    portfolioId: { type: Schema.Types.ObjectId, ref: 'Portfolio', required: true },

    // Asset details
    assetType: { type: String, enum: ['cryptocurrency', 'stock', 'forex', 'commodity', 'index'], required: true },
    assetSymbol: { type: String, required: true },
    assetName: { type: String, required: true },

    // Trade details
    tradeType: { type: String, enum: ['buy', 'sell', 'long', 'short'], required: true },
    quantity: { type: Number, required: true },
    entryPrice: { type: Number, required: true },
    currentPrice: { type: Number, required: true },
    exitPrice: { type: Number },

    // Position sizing
    investedAmount: { type: Number, required: true },
    leverage: { type: Number, default: 1 },
    leveragedAmount: { type: Number, required: true },

    // P&L calculations
    profitLoss: { type: Number, default: 0 },
    profitLossPercentage: { type: Number, default: 0 },
    unrealizedPnL: { type: Number, default: 0 },
    realizedPnL: { type: Number },

    // Risk management
    stopLoss: { type: Number },
    takeProfit: { type: Number },
    trailingStop: { type: Number },

    // Status tracking
    status: { type: String, enum: ['active', 'closed', 'pending', 'cancelled', 'liquidated'], default: 'active' },
    openedAt: { type: Date, default: Date.now },
    closedAt: { type: Date },

    // Transaction details
    openOrderId: { type: String },
    closeOrderId: { type: String },
    fees: { type: Number, default: 0 },

    // Metadata
    notes: { type: String },
    tags: [{ type: String }],

}, { timestamps: true });

export default mongoose.model<IInvestment>('Investment', InvestmentSchema);
