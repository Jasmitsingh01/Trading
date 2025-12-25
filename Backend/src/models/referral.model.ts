import mongoose, { Schema } from 'mongoose';
import type { IReferral } from '../Types/index.types.ts';

const ReferralSchema: Schema = new Schema({
    referrerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    referredUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true },

    // Referral details
    referralCode: { type: String, required: true },
    status: { type: String, enum: ['pending', 'active', 'completed'], default: 'pending' },

    // Rewards
    referrerReward: { type: Number, default: 0 },
    referredUserReward: { type: Number, default: 0 },
    rewardPaid: { type: Boolean, default: false },
    rewardPaidAt: { type: Date },

    // Conditions
    minimumDepositRequired: { type: Number, default: 0 },
    depositMet: { type: Boolean, default: false },
    depositMetAt: { type: Date },

}, { timestamps: true });

export default mongoose.model<IReferral>('Referral', ReferralSchema);
