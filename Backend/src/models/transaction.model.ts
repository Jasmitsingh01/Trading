import mongoose, { Schema } from 'mongoose';
import type { ITransaction } from '../Types/index.types.ts';

const TransactionSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },

    // Transaction details
    type: { type: String, enum: ['deposit', 'withdrawal', 'investment', 'profit', 'loss', 'fee', 'bonus', 'refund', 'transfer'], required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },

    // Status
    status: { type: String, enum: ['pending', 'processing', 'completed', 'failed', 'cancelled', 'rejected'], default: 'pending' },

    // Payment method
    paymentMethod: { type: String, enum: ['bank_transfer', 'credit_card', 'debit_card', 'upi', 'crypto', 'paypal'] },

    // Related entities
    relatedInvestmentId: { type: Schema.Types.ObjectId, ref: 'Investment' },
    relatedPaymentId: { type: Schema.Types.ObjectId, ref: 'PaymentVerification' },

    // Bank/Payment details
    bankDetails: {
        bankName: { type: String },
        accountNumber: { type: String },
        transactionId: { type: String }
    },

    // Proof documents
    proofDocument: { type: String },

    // Processing details
    description: { type: String },
    notes: { type: String },
    processedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    processedAt: { type: Date },
    rejectionReason: { type: String },

    // Balance impact
    balanceBefore: { type: Number },
    balanceAfter: { type: Number },

}, { timestamps: true });

export default mongoose.model<ITransaction>('Transaction', TransactionSchema);
