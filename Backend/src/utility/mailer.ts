import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const isDevelopment = process.env.NODE_ENV === 'development';
const hasSmtpConfig = process.env.SMTP_USER && process.env.SMTP_PASS;

let transporter: nodemailer.Transporter;

// Initialize transporter
if (!isDevelopment || hasSmtpConfig) {
  // Production or configured development
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // Verify SMTP connection on startup
  transporter.verify((error, success) => {
    if (error) {
      console.error('❌ SMTP connection failed:', error);
    } else {
      console.log('✅ SMTP server is ready to send emails');
    }
  });
} else {
  // Development mode without SMTP config
  console.log('⚠️  SMTP not configured. Using Ethereal Email for development.');
  console.log('📧 To use real email, configure SMTP_USER and SMTP_PASS in .env');

  // Create test account
  nodemailer.createTestAccount().then((testAccount) => {
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.log('✅ Ethereal test account created:', testAccount.user);
  }).catch((err) => {
    console.error('❌ Failed to create Ethereal test account:', err);
    // Fallback to mock
    transporter = {
      sendMail: async (mailOptions: any) => {
        console.log('📧 [MOCK EMAIL] Would send email to:', mailOptions.to);
        console.log('Subject:', mailOptions.subject);
        console.log('Content:', mailOptions.text);
        return { messageId: 'mock-' + Date.now() };
      },
    } as any;
  });
}

export const sendEmail = async (to: string, subject: string, text: string, html?: string) => {
  try {
    if (!transporter) {
      console.log('📧 [MOCK EMAIL] Sending to:', to);
      console.log('Subject:', subject);
      console.log('Text:', text);
      return { messageId: 'mock-' + Date.now() };
    }

    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || '"BXTPRO" <noreply@BXTPRO.com>',
      to,
      subject,
      text,
      html: html || text,
    });

    // Log real result
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log('📧 Email sent! Preview URL:', previewUrl);
    } else {
      console.log('✅ Email sent successfully to:', to);
      console.log('Message ID:', info.messageId);
    }

    return info;
  } catch (error: any) {
    console.error('❌ Error sending email:', error);
    if (isDevelopment) {
      console.log('📧 [DEV MODE] Email would have been sent to:', to);
      console.log('Subject:', subject);
      console.log('Text:', text);
      return { messageId: 'dev-mock-' + Date.now() };
    }
    throw error;
  }
};

export const sendEmailOTP = async (email: string, otp: string, fullname?: string) => {
  const subject = 'Your BXTPRO Verification Code';
  const text = `Your verification code is: ${otp}. This code will expire in 10 minutes.`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .otp-box { background: white; border: 2px dashed #667eea; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
        .otp-code { font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 8px; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 10px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>BXTPRO</h1>
          <p>Email Verification</p>
        </div>
        <div class="content">
          <h2>Hello ${fullname || 'there'}!</h2>
          <p>Thank you for registering with BXTPRO. To complete your registration, please use the verification code below:</p>
          
          <div class="otp-box">
            <p style="margin: 0; color: #666; font-size: 14px;">Your Verification Code</p>
            <div class="otp-code">${otp}</div>
          </div>
          
          <div class="warning">
            <strong>⚠️ Security Notice:</strong>
            <ul style="margin: 10px 0;">
              <li>This code will expire in <strong>10 minutes</strong></li>
              <li>Never share this code with anyone</li>
              <li>BXTPRO will never ask for this code via phone or email</li>
            </ul>
          </div>
          
          <p>If you didn't request this code, please ignore this email or contact our support team.</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} BXTPRO. All rights reserved.</p>
          <p>This is an automated message, please do not reply.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  console.log(`📧 Sending OTP email to ${email} with code: ${otp}`);
  return sendEmail(email, subject, text, html);
};

export const sendPasswordResetEmail = async (email: string, otp: string, name: string) => {
  const subject = 'Password Reset OTP - BXTPRO';
  const text = `Your password reset OTP is: ${otp}. This code will expire in 10 minutes.`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .otp-box { background: white; border: 2px dashed #10b981; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
        .otp-code { font-size: 32px; font-weight: bold; color: #10b981; letter-spacing: 8px; }
        .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px; margin: 20px 0; }
        .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Password Reset Request</h1>
        </div>
        <div class="content">
          <p>Hi ${name},</p>
          <p>We received a request to reset your password. Use the OTP below to proceed:</p>
          
          <div class="otp-box">
            <div class="otp-code">${otp}</div>
            <p style="margin: 10px 0 0 0; color: #6b7280;">Valid for 10 minutes</p>
          </div>
          
          <div class="warning">
            <strong>⚠️ Security Notice:</strong> If you didn't request this password reset, please ignore this email and ensure your account is secure.
          </div>
          
          <p>For security reasons, this OTP will expire in 10 minutes.</p>
          
          <div class="footer">
            <p>© 2025 BXTPRO. All rights reserved.</p>
            <p>This is an automated email. Please do not reply.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  console.log(`📧 Sending password reset OTP to ${email} with code: ${otp}`);
  return sendEmail(email, subject, text, html);
};
