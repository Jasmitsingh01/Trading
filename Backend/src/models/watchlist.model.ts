import mongoose, { Schema } from 'mongoose';
import type { IWatchlist } from '../Types/index.types.ts';

const WatchlistSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },

    assets: [{
        symbol: { type: String, required: true },
        assetType: { type: String, enum: ['cryptocurrency', 'stock', 'forex', 'commodity'], required: true },
        addedAt: { type: Date, default: Date.now },
        alertPrice: { type: Number },
        notes: { type: String }
    }],

}, { timestamps: true });

export default mongoose.model<IWatchlist>('Watchlist', WatchlistSchema);
