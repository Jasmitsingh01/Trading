import OtpModel from '../models/otp.model.ts';
import { sendEmailOTP } from './mailer.ts';
import { sendPhoneOTP } from './sms.ts';
import crypto from 'crypto';

/**
 * Generate a 6-digit OTP
 */
export const generateOTP = (): string => {
    return crypto.randomInt(100000, 999999).toString();
};

/**
 * Send OTP to email or phone
 */
export const sendOTP = async (identifier: string, type: 'email' | 'phone'): Promise<boolean> => {
    try {
        // Generate OTP
        const otp = generateOTP();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Delete any existing OTP for this identifier
        await OtpModel.deleteMany({ identifier, type });

        // Save new OTP to database
        await OtpModel.create({
            identifier,
            code: otp,
            type,
            expiresAt,
            attempts: 0,
            isVerified: false
        });

        // Send OTP via email or SMS
        if (type === 'email') {
            await sendEmailOTP(identifier, otp);
        } else {
            await sendPhoneOTP(identifier, otp);
        }

        console.log(`✅ OTP sent to ${type}: ${identifier}`);
        return true;
    } catch (error) {
        console.error(`❌ Error sending OTP to ${identifier}:`, error);
        throw new Error(`Failed to send OTP to ${type}`);
    }
};

/**
 * Verify OTP
 */
export const verifyOTP = async (identifier: string, code: string, type: 'email' | 'phone'): Promise<boolean> => {
    try {
        // Find OTP record
        const otpRecord = await OtpModel.findOne({
            identifier,
            type,
            isVerified: false
        }).sort({ createdAt: -1 });

        if (!otpRecord) {
            throw new Error('OTP not found or already verified');
        }

        // Check if expired
        if (new Date() > otpRecord.expiresAt) {
            await OtpModel.deleteOne({ _id: otpRecord._id });
            throw new Error('OTP has expired');
        }

        // Check attempts
        if (otpRecord.attempts >= 5) {
            await OtpModel.deleteOne({ _id: otpRecord._id });
            throw new Error('Too many failed attempts. Please request a new OTP');
        }

        // Verify code
        if (otpRecord.code !== code) {
            otpRecord.attempts += 1;
            await otpRecord.save();
            throw new Error('Invalid OTP code');
        }

        // Mark as verified
        otpRecord.isVerified = true;
        await otpRecord.save();

        console.log(`✅ OTP verified for ${type}: ${identifier}`);
        return true;
    } catch (error: any) {
        console.error(`❌ Error verifying OTP for ${identifier}:`, error.message);
        throw error;
    }
};

/**
 * Check if identifier has been verified
 */
export const isOTPVerified = async (identifier: string, type: 'email' | 'phone'): Promise<boolean> => {
    const verifiedOTP = await OtpModel.findOne({
        identifier,
        type,
        isVerified: true
    }).sort({ createdAt: -1 });

    return !!verifiedOTP;
};

/**
 * Clean up expired OTPs (optional - MongoDB TTL index handles this automatically)
 */
export const cleanupExpiredOTPs = async (): Promise<void> => {
    await OtpModel.deleteMany({
        expiresAt: { $lt: new Date() }
    });
    console.log('✅ Expired OTPs cleaned up');
};
