import twilio from 'twilio';
import dotenv from 'dotenv';
dotenv.config();

// Twilio configuration
const accountSid = process.env.TWILIO_ACCOUNT_SID || '';
const authToken = process.env.TWILIO_AUTH_TOKEN || '';

// Initialize Twilio client
const twilioClient = accountSid && authToken
    ? twilio(accountSid, authToken)
    : null;

/**
 * Send OTP via SMS using Twilio Messaging Service
 */
export const sendPhoneOTP = async (phoneNumber: string, otp: string): Promise<boolean> => {
    try {
        const message = `Your BXTPRO verification code is: ${otp}. Valid for 10 minutes.`;

        if (twilioClient && process.env.TWILIO_MESSAGING_SERVICE_SID) {
            // Production: Send actual SMS via Twilio Messaging Service
            const result = await twilioClient.messages.create({
                messagingServiceSid: process.env.TWILIO_MESSAGING_SERVICE_SID,
                body: message,
                to: phoneNumber
            });
            console.log(`✅ SMS sent to ${phoneNumber} via Twilio - SID: ${result.sid}`);
        } else {
            // Development: Log to console
            console.log('\n' + '='.repeat(60));
            console.log('📱 PHONE OTP (Development Mode)');
            console.log('='.repeat(60));
            console.log(`📞 Phone Number: ${phoneNumber}`);
            console.log(`🔐 OTP Code: ${otp}`);
            console.log(`💬 Message: ${message}`);
            console.log('⚠️  Configure Twilio Messaging Service to send real SMS');
            console.log('='.repeat(60) + '\n');
        }

        return true;
    } catch (error) {
        console.error('❌ Error sending phone OTP:', error);
        throw new Error('Failed to send phone OTP');
    }
};
