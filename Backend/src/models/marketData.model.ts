import mongoose, { Schema } from 'mongoose';
import type { IMarketData } from '../Types/index.types.ts';

const MarketDataSchema: Schema = new Schema({
    symbol: { type: String, required: true, unique: true },
    assetType: { type: String, enum: ['cryptocurrency', 'stock', 'forex', 'commodity'], required: true },

    // Price data
    currentPrice: { type: Number, required: true },
    openPrice: { type: Number, required: true },
    highPrice: { type: Number, required: true },
    lowPrice: { type: Number, required: true },
    closePrice: { type: Number, required: true },

    // Volume and market cap
    volume24h: { type: Number, required: true },
    marketCap: { type: Number },

    // Change metrics
    priceChange24h: { type: Number, required: true },
    priceChangePercentage24h: { type: Number, required: true },

    // Additional data
    circulatingSupply: { type: Number },
    totalSupply: { type: Number },

    lastUpdated: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model<IMarketData>('MarketData', MarketDataSchema);
