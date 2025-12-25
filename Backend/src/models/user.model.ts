import mongoose, { Schema } from 'mongoose';
import type { IUser } from '../Types/index.types.ts';

const UserSchema: Schema = new Schema({
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    password: { type: String },
    role: { type: String, enum: ['user', 'admin', 'moderator'], default: 'user' },
    accountStatus: { type: String, enum: ['active', 'inactive', 'suspended', 'under review', 'pending'], default: 'pending' },
    mobileNumber: { type: String, required: true },
    leverage_type: { type: String, enum: ['1:10', '1:20', '1:50', '1:100', '1:200', '1:500'], default: '1:100' },

    // Address Information
    Address: { type: String, required: true },
    Address1: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    pincode: { type: String, required: true },

    // Personal Information
    dateOfBirth: { type: String },
    nationality: { type: String },

    // References
    bank: { type: Schema.Types.ObjectId, ref: 'BankDetails' },
    avatar: { type: String },
    portfolio: { type: Schema.Types.ObjectId, ref: 'Portfolio' },
    Account_Balance: { type: Schema.Types.ObjectId, ref: 'AccountBalance' },

    // Document uploads
    documents: {
        AddressProof: { type: String },
        BankProof: { type: String },
        OtherProof: { type: String },
        IdentityFront: { type: String },
        IdentityBack: { type: String },
        SelfieWithID: { type: String }
    },

    // Verification status
    isVerified: { type: Boolean, default: false },
    isKYCCompleted: { type: Boolean, default: false },
    kycStatus: { type: String, enum: ['not_started', 'pending', 'under_review', 'approved', 'rejected'], default: 'not_started' },
    kycSubmittedAt: { type: Date },
    kycApprovedAt: { type: Date },
    kycRejectionReason: { type: String },
    passwordResetToken: { type: String },
    passwordResetExpires: { type: Date },
    // Security
    twoFactorEnabled: { type: Boolean, default: false },
    twoFactorSecret: { type: String },

    // Activity tracking
    lastActive: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);
