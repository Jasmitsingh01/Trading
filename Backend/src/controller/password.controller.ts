// backend/src/controllers/password.controller.ts

import type { FastifyRequest, FastifyReply } from 'fastify';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/user.model.ts';
import { sendPasswordResetEmail } from '../utility/mailer.ts';
import RequestHandler from '../utility/requestHandler.ts';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

/**
 * Send password reset email with OTP
 */
export const forgotPasswordHandler = RequestHandler(async (req: FastifyRequest<{
    Body: { email: string }
}>, res: FastifyReply) => {
    const { email } = req.body;

    if (!email) {
        throw new Error('Email is required');
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
        // Don't reveal if user exists
        return {
            success: true,
            message: 'If your email is registered, you will receive a password reset link'
        };
    }

    // Generate reset token (6 digit OTP)
    const resetOTP = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash the OTP before storing
    const hashedToken = crypto.createHash('sha256').update(resetOTP).digest('hex');

    // Set token and expiry (10 minutes)
    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    // Send email with OTP
    try {
        await sendPasswordResetEmail(email, resetOTP, user.fullname);
        console.log(`✅ Password reset OTP sent to: ${email}`);
    } catch (error) {
        console.error('❌ Failed to send reset email:', error);
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();
        throw new Error('Failed to send reset email. Please try again.');
    }

    return {
        success: true,
        message: 'Password reset OTP sent to your email'
    };
});

/**
 * Verify reset OTP and return temp token
 */
export const verifyResetOTPHandler = RequestHandler(async (req: FastifyRequest<{
    Body: { email: string; otp: string }
}>, res: FastifyReply) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        throw new Error('Email and OTP are required');
    }

    // Hash the provided OTP
    const hashedToken = crypto.createHash('sha256').update(otp).digest('hex');

    // Find user with valid token
    const user = await User.findOne({
        email,
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: new Date() }
    });

    if (!user) {
        throw new Error('Invalid or expired OTP');
    }

    // Generate temporary reset token (valid for 10 minutes)
    const resetToken = jwt.sign(
        { userId: user._id, purpose: 'password-reset' },
        JWT_SECRET,
        { expiresIn: '10m' }
    );

    return {
        success: true,
        message: 'OTP verified successfully',
        data: { resetToken }
    };
});

/**
 * Reset password with token
 */
export const resetPasswordHandler = RequestHandler(async (req: FastifyRequest<{
    Body: { resetToken: string; newPassword: string }
}>, res: FastifyReply) => {
    const { resetToken, newPassword } = req.body;

    if (!resetToken || !newPassword) {
        throw new Error('Reset token and new password are required');
    }

    if (newPassword.length < 8) {
        throw new Error('Password must be at least 8 characters long');
    }

    // Verify reset token
    let decoded: any;
    try {
        decoded = jwt.verify(resetToken, JWT_SECRET);
        if (decoded.purpose !== 'password-reset') {
            throw new Error('Invalid token');
        }
    } catch (error) {
        throw new Error('Invalid or expired reset token');
    }

    // Find user
    const user = await User.findById(decoded.userId);
    if (!user) {
        throw new Error('User not found');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and clear reset fields
    user.password = hashedPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    console.log(`✅ Password reset successful for: ${user.email}`);

    return {
        success: true,
        message: 'Password reset successfully. You can now login with your new password.'
    };
});

/**
 * Change password (for logged-in users)
 */
export const changePasswordHandler = RequestHandler(async (req: FastifyRequest<{
    Body: { currentPassword: string; newPassword: string }
}>, res: FastifyReply) => {
    // @ts-ignore - user is added by auth middleware
    const userId = req.user?.userId;

    if (!userId) {
        throw new Error('Unauthorized');
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        throw new Error('Current password and new password are required');
    }

    if (newPassword.length < 8) {
        throw new Error('New password must be at least 8 characters long');
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password || '');
    if (!isPasswordValid) {
        throw new Error('Current password is incorrect');
    }

    // Check if new password is same as old
    const isSamePassword = await bcrypt.compare(newPassword, user.password || '');
    if (isSamePassword) {
        throw new Error('New password must be different from current password');
    }

    // Hash and save new password
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    console.log(`✅ Password changed for user: ${user.email}`);

    return {
        success: true,
        message: 'Password changed successfully'
    };
});

export default {
    forgotPasswordHandler,
    verifyResetOTPHandler,
    resetPasswordHandler,
    changePasswordHandler
};
