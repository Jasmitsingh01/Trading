import admin from 'firebase-admin';
import dotenv from 'dotenv';
dotenv.config();

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
    try {
        // Option 1: Using environment variables for the service account
        if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId: process.env.FIREBASE_PROJECT_ID,
                    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
                }),
            });
            console.log('Firebase Admin Initialized with Environment Variables');
        } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
            // Option 2: Using service account key file path
            admin.initializeApp({
                credential: admin.credential.applicationDefault(),
            });
            console.log('Firebase Admin Initialized with Application Default Credentials');
        } else {
            console.warn('Firebase Admin not initialized - missing credentials');
        }
    } catch (error) {
        console.error('Firebase Admin Initialization Failed:', error);
    }
}

/**
 * Send OTP via SMS
 * 
 * IMPORTANT: Firebase doesn't send SMS from the backend!
 * Firebase phone authentication works client-side only.
 * 
 * For backend SMS sending, you need:
 * 1. Twilio (recommended) - https://www.twilio.com/
 * 2. AWS SNS
 * 3. MessageBird
 * 4. Vonage (Nexmo)
 * 
 * For now, this displays the OTP in console for development.
 */
export const sendPhoneOTP = async (phoneNumber: string, otp: string): Promise<boolean> => {
    try {
        const message = `Your BXTPRO verification code is: ${otp}. Valid for 10 minutes.`;

        // Development mode - Display OTP prominently in console
        console.log('\n' + '='.repeat(60));
        console.log('📱 PHONE OTP VERIFICATION');
        console.log('='.repeat(60));
        console.log(`📞 Phone Number: ${phoneNumber}`);
        console.log(`🔐 OTP Code: ${otp}`);
        console.log(`💬 Message: ${message}`);
        console.log('='.repeat(60) + '\n');

        // TODO: For production, integrate with an SMS provider:

        // Example 1: Twilio (Most Popular)
        // const twilio = require('twilio');
        // const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
        // await client.messages.create({
        //     body: message,
        //     to: phoneNumber,
        //     from: process.env.TWILIO_PHONE_NUMBER
        // });

        // Example 2: AWS SNS
        // const AWS = require('aws-sdk');
        // const sns = new AWS.SNS({ region: 'us-east-1' });
        // await sns.publish({
        //     Message: message,
        //     PhoneNumber: phoneNumber
        // }).promise();

        // Example 3: MessageBird
        // const messagebird = require('messagebird')(process.env.MESSAGEBIRD_API_KEY);
        // await messagebird.messages.create({
        //     originator: 'BXTPRO',
        //     recipients: [phoneNumber],
        //     body: message
        // });

        return true;
    } catch (error) {
        console.error('❌ Error sending phone OTP:', error);
        throw new Error('Failed to send phone OTP');
    }
};

/**
 * Verify a Firebase ID token (if using Firebase Auth on frontend)
 * This can be used as an alternative verification method
 */
export const verifyFirebaseToken = async (idToken: string) => {
    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        return {
            uid: decodedToken.uid,
            phoneNumber: decodedToken.phone_number,
            email: decodedToken.email,
        };
    } catch (error) {
        console.error('Error verifying Firebase token:', error);
        throw new Error('Invalid Firebase token');
    }
};

/**
 * Create a custom token for a user
 */
export const createCustomToken = async (uid: string, additionalClaims?: object) => {
    try {
        return await admin.auth().createCustomToken(uid, additionalClaims);
    } catch (error) {
        console.error('Error creating custom token:', error);
        throw new Error('Failed to create custom token');
    }
};

export default admin;
