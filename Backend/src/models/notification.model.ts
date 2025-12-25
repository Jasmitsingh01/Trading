import mongoose, { Schema } from 'mongoose';
import type { INotification } from '../Types/index.types.ts';

const NotificationSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },

    // Notification details
    type: { type: String, enum: ['kyc_approved', 'kyc_rejected', 'payment_approved', 'payment_rejected', 'balance_added', 'investment_created', 'investment_closed', 'account_suspended', 'price_alert', 'margin_call', 'general', 'deposit', 'withdrawal'], required: true },

    title: { type: String, required: true },
    message: { type: String, required: true },

    // Status
    isRead: { type: Boolean, default: false },
    isDone: { type: Boolean, default: false },

    // Related entities
    relatedEntityId: { type: Schema.Types.ObjectId },
    relatedEntityType: { type: String, enum: ['transaction', 'investment', 'kyc', 'payment'] },

    // Priority
    priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },

    // Action required
    actionRequired: { type: Boolean, default: false },
    actionUrl: { type: String },
    actionLabel: { type: String },

}, { timestamps: true });

export default mongoose.model<INotification>('Notification', NotificationSchema);
