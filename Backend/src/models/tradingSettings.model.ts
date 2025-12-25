import mongoose, { Schema } from 'mongoose';
import type { ITradingSettings } from '../Types/index.types.ts';

const TradingSettingsSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },

    // Default settings
    defaultLeverage: { type: Number, default: 10 },
    defaultStopLoss: { type: Number, default: 5 }, // Percentage
    defaultTakeProfit: { type: Number, default: 10 }, // Percentage

    // Risk management
    maxPositionSize: { type: Number, default: 1000 },
    maxDailyLoss: { type: Number, default: 500 },
    allowedAssetTypes: [{ type: String, enum: ['cryptocurrency', 'stock', 'forex', 'commodity'] }],

    // Notifications preferences
    emailNotifications: { type: Boolean, default: true },
    smsNotifications: { type: Boolean, default: false },
    pushNotifications: { type: Boolean, default: true },

    priceAlerts: { type: Boolean, default: true },
    tradeAlerts: { type: Boolean, default: true },
    newsAlerts: { type: Boolean, default: false },

    // Auto-trading (if applicable)
    autoTradingEnabled: { type: Boolean, default: false },
    autoWithdrawalEnabled: { type: Boolean, default: false },
    autoWithdrawalThreshold: { type: Number },

}, { timestamps: true });

export default mongoose.model<ITradingSettings>('TradingSettings', TradingSettingsSchema);
