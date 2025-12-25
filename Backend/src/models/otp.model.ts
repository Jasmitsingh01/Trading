import mongoose, { Schema, Document } from 'mongoose';

export interface IOtp extends Document {
    identifier: string; // email or phone
    code: string;
    type: 'email' | 'phone';
    attempts: number;
    isVerified: boolean;
    expiresAt: Date;
}

const OtpSchema: Schema = new Schema({
    identifier: { type: String, required: true },
    code: { type: String, required: true },
    type: { type: String, enum: ['email', 'phone'], required: true },
    attempts: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false },
    expiresAt: { type: Date, required: true, index: { expires: 0 } } // Auto-delete after expiry
}, { timestamps: true });

export default mongoose.model<IOtp>('Otp', OtpSchema);
