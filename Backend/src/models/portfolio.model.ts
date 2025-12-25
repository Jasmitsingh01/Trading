import mongoose, { Schema } from 'mongoose';
import type { IPortfolio } from '../Types/index.types.ts';

const PortfolioSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },

    // Portfolio summary
    totalValue: { type: Number, default: 0 },
    totalInvested: { type: Number, default: 0 },
    totalProfitLoss: { type: Number, default: 0 },
    profitLossPercentage: { type: Number, default: 0 },

    // Holdings
    holdings: [{ type: Schema.Types.ObjectId, ref: 'Investment' }],
    activePositions: { type: Number, default: 0 },
    closedPositions: { type: Number, default: 0 },

    // Performance metrics
    bestPerformingAsset: {
        symbol: { type: String },
        profitPercentage: { type: Number }
    },
    worstPerformingAsset: {
        symbol: { type: String },
        lossPercentage: { type: Number }
    },

    // Diversification
    assetAllocation: {
        cryptocurrency: { type: Number, default: 0 },
        stocks: { type: Number, default: 0 },
        forex: { type: Number, default: 0 },
        commodities: { type: Number, default: 0 }
    },

    lastUpdated: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model<IPortfolio>('Portfolio', PortfolioSchema);
