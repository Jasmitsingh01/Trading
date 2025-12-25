import mongoose, { Schema } from 'mongoose';
import type { IKYCVerification } from '../Types/index.types.ts';

const KYCVerificationSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },

    // Personal information
    fullName: { type: String, required: true },
    dateOfBirth: { type: String, required: true },
    nationality: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    pincode: { type: String, required: true },
    phoneNumber: { type: String, required: true },

    // Documents
    documents: {
        identityFront: {
            url: { type: String, required: true },
            uploadedAt: { type: Date, default: Date.now },
            documentType: { type: String, enum: ['passport', 'drivers_license', 'national_id'], required: true },
            documentNumber: { type: String }
        },
        identityBack: {
            url: { type: String, required: true },
            uploadedAt: { type: Date, default: Date.now }
        },
        addressProof: {
            url: { type: String, required: true },
            uploadedAt: { type: Date, default: Date.now },
            documentType: { type: String, enum: ['utility_bill', 'bank_statement', 'rental_agreement'], required: true }
        },
        bankStatement: {
            url: { type: String, required: true },
            uploadedAt: { type: Date, default: Date.now }
        },
        selfieWithID: {
            url: { type: String, required: true },
            uploadedAt: { type: Date, default: Date.now }
        }
    },

    // Verification status
    status: { type: String, enum: ['not_started', 'pending', 'under_review', 'approved', 'rejected'], default: 'not_started' },

    // Verification checklist
    verificationChecklist: {
        identityClarity: { type: Boolean, default: false },
        addressProofRecent: { type: Boolean, default: false },
        bankStatementValid: { type: Boolean, default: false },
        selfieIdMatch: { type: Boolean, default: false },
        informationConsistent: { type: Boolean, default: false }
    },

    // Admin review
    reviewedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    reviewedAt: { type: Date },
    approvedAt: { type: Date },
    rejectionReason: { type: String },
    adminNotes: { type: String },

    submittedAt: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model<IKYCVerification>('KYCVerification', KYCVerificationSchema);
