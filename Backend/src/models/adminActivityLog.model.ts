import mongoose, { Schema } from 'mongoose';
import type { IAdminActivityLog } from '../Types/index.types.ts';

const AdminActivityLogSchema: Schema = new Schema({
    adminId: { type: Schema.Types.ObjectId, ref: 'User', required: true },

    // Action details
    action: { type: String, enum: ['user_verified', 'user_suspended', 'balance_added', 'balance_deducted', 'payment_approved', 'payment_rejected', 'kyc_approved', 'kyc_rejected', 'investment_modified', 'account_deleted', 'settings_changed'], required: true },

    targetUserId: { type: Schema.Types.ObjectId, ref: 'User' },

    // Details
    description: { type: String, required: true },
    metadata: { type: Schema.Types.Mixed }, // Flexible object

    // IP and device tracking
    ipAddress: { type: String },
    userAgent: { type: String },

    timestamp: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model<IAdminActivityLog>('AdminActivityLog', AdminActivityLogSchema);
