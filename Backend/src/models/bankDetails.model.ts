import mongoose, { Schema } from 'mongoose';
import type { IBankDetails } from '../Types/index.types.ts';

const BankDetailsSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    bankName: { type: String, required: true },
    accountHolderName: { type: String, required: true },
    accountNumber: { type: String, required: true },
    accountType: { type: String, enum: ['savings', 'current', 'checking'], required: true },
    ifscCode: { type: String },
    swiftCode: { type: String },
    routingNumber: { type: String },
    branchName: { type: String },
    branchAddress: { type: String },

    isPrimary: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    verifiedAt: { type: Date },
}, { timestamps: true });

export default mongoose.model<IBankDetails>('BankDetails', BankDetailsSchema);
