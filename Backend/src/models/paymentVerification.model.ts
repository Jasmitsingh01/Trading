import mongoose, { Schema } from 'mongoose';
import type { IPaymentVerification } from '../Types/index.types.ts';

const PaymentVerificationSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    transactionId: { type: Schema.Types.ObjectId, ref: 'Transaction', required: true },

    // Payment details
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    paymentMethod: { type: String, enum: ['bank_transfer', 'credit_card', 'debit_card', 'upi', 'crypto', 'paypal'], required: true },

    // Bank details
    bankDetails: {
        bankName: { type: String, required: true },
        accountHolderName: { type: String, required: true },
        accountNumber: { type: String, required: true },
        routingNumber: { type: String },
        ifscCode: { type: String },
        transactionId: { type: String, required: true },
        transactionDate: { type: Date, required: true }
    },

    // Proof documents
    proofDocument: { type: String, required: true },

    // Verification
    status: { type: String, enum: ['pending', 'under_review', 'verified', 'rejected'], default: 'pending' },
    verificationChecklist: {
        receiptClarity: { type: Boolean, default: false },
        amountMatch: { type: Boolean, default: false },
        bankDetailsMatch: { type: Boolean, default: false },
        transactionRecent: { type: Boolean, default: false },
        fraudCheckPassed: { type: Boolean, default: false }
    },

    // Admin actions
    reviewedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    reviewedAt: { type: Date },
    rejectionReason: { type: String },
    adminNotes: { type: String },

    submittedAt: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model<IPaymentVerification>('PaymentVerification', PaymentVerificationSchema);
