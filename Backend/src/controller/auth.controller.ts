// backend/src/controllers/auth.controller.ts
import type { FastifyRequest, FastifyReply } from 'fastify';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.ts';
import AccountBalance from '../models/accountBalance.model.ts';
import Portfolio from '../models/portfolio.model.ts';
import { sendOTP, verifyOTP as verifyOTPUtil } from '../utility/otp.ts';
import { uploadAvatar, uploadKYCDocument } from '../utility/cloudinary.ts';
import RequestHandler from '../utility/requestHandler.ts';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'productions',
  sameSite: 'none' as const,
  path: '/',
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
};

/**
 * Send OTP to email or phone
 */
export const sendOTPHandler = RequestHandler(async (req: FastifyRequest<{
  Body: { email?: string; phone?: string }
}>, res: FastifyReply) => {
  const { email, phone } = req.body;

  if (!email && !phone) {
    throw new Error('Email or phone number is required');
  }

  const identifier = email || phone!;
  const type = email ? 'email' : 'phone';

  await sendOTP(identifier, type);

  return {
    success: true,
    message: `OTP sent to ${type}`,
    data: { identifier, type }
  };
});

/**
 * Verify OTP and set verification cookie
 */
export const verifyOTPHandler = RequestHandler(async (req: FastifyRequest<{
  Body: { email?: string; phone?: string; emailOtp?: string; phoneOtp?: string }
}>, res: FastifyReply) => {
  const { email, phone, emailOtp, phoneOtp } = req.body;

  let identifier: string;
  let code: string;
  let type: 'email' | 'phone';

  if (email && emailOtp) {
    identifier = email;
    code = emailOtp;
    type = 'email';
  } else if (phone && phoneOtp) {
    identifier = phone;
    code = phoneOtp;
    type = 'phone';
  } else {
    throw new Error('Invalid verification request');
  }

  const isValid = await verifyOTPUtil(identifier, code, type);

  if (!isValid) {
    throw new Error('Invalid OTP');
  }

  // Generate verification token
  const verificationToken = jwt.sign(
    { identifier, type, verified: true },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  // Set verification token in HTTP-only cookie
  const cookieName = type === 'email' ? 'email_verification' : 'phone_verification';
  res.setCookie(cookieName, verificationToken, {
    ...COOKIE_OPTIONS,
    maxAge: 60 * 60 * 1000 // 1 hour
  });

  return {
    success: true,
    message: 'OTP verified successfully',
    data: { verified: true }
  };
});

/**
 * Register new user (reads verification tokens from cookies)
 */
export const registerHandler = RequestHandler(async (req: FastifyRequest, res: FastifyReply) => {
  // Get verification tokens from cookies
  const emailVerificationToken = req.cookies.email_verification;
  const phoneVerificationToken = req.cookies.phone_verification;

  if (!emailVerificationToken || !phoneVerificationToken) {
    throw new Error('Verification required. Please verify your email and phone.');
  }

  // Parse form fields
  const fields: any = {};
  const files: any = {};

  // Process all parts
  for await (const part of req.parts()) {
    if (part.type === 'file') {
      const buffer = await part.toBuffer();
      files[part.fieldname] = buffer;
    } else {
      fields[part.fieldname] = (part as any).value;
    }
  }

  const {
    fullname,
    email,
    password,
    mobileNumber,
    Address,
    Address1,
    city,
    state,
    country,
    pincode,
    identityProofType,
    addressProofType
  } = fields;

  // Validate required fields
  if (!fullname || !email || !password || !mobileNumber || !Address || !city || !state || !country || !pincode) {
    throw new Error('Missing required fields');
  }

  // Verify tokens from cookies
  try {
    const emailPayload = jwt.verify(emailVerificationToken, JWT_SECRET) as any;
    const phonePayload = jwt.verify(phoneVerificationToken, JWT_SECRET) as any;

    // Verify that the tokens match the submitted data
    if (emailPayload.identifier !== email) {
      throw new Error('Email verification mismatch');
    }
    if (phonePayload.identifier !== mobileNumber) {
      throw new Error('Phone verification mismatch');
    }
  } catch (error) {
    throw new Error('Invalid or expired verification tokens');
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Upload avatar to Cloudinary
  let avatarUrl = '';
  if (files.avatar) {
    avatarUrl = await uploadAvatar(files.avatar, email);
  }

  // Create user
  const user = await User.create({
    fullname,
    email,
    password: hashedPassword,
    mobileNumber,
    Address,
    Address1,
    city,
    state,
    country,
    pincode,
    avatar: avatarUrl,
    isVerified: true, // Already verified via OTP
    accountStatus: 'pending',
    kycStatus: 'pending'
  });

  // Upload KYC documents to Cloudinary
  const documentUrls: any = {};

  if (files.IdentityFront) {
    documentUrls.IdentityFront = await uploadKYCDocument(files.IdentityFront, user._id.toString(), 'identity_front');
  }
  if (files.IdentityBack) {
    documentUrls.IdentityBack = await uploadKYCDocument(files.IdentityBack, user._id.toString(), 'identity_back');
  }
  if (files.AddressProof) {
    documentUrls.AddressProof = await uploadKYCDocument(files.AddressProof, user._id.toString(), 'address_proof');
  }
  if (files.AddressProofBack) {
    documentUrls.AddressProofBack = await uploadKYCDocument(files.AddressProofBack, user._id.toString(), 'address_proof_back');
  }
  if (files.BankProof) {
    documentUrls.BankProof = await uploadKYCDocument(files.BankProof, user._id.toString(), 'bank_proof');
  }
  if (files.SelfieWithID) {
    documentUrls.SelfieWithID = await uploadKYCDocument(files.SelfieWithID, user._id.toString(), 'selfie_with_id');
  }
  if (files.OtherProof) {
    documentUrls.OtherProof = await uploadKYCDocument(files.OtherProof, user._id.toString(), 'other_proof');
  }

  // Update user with document URLs
  user.documents = documentUrls;
  user.kycSubmittedAt = new Date();
  await user.save();

  // Create account balance
  const accountBalance = new AccountBalance({
    userId: user._id,
    availableBalance: 0,
    totalBalance: 0,
    lockedBalance: 0,
    currency: 'USD'
  });
  await accountBalance.save();

  // Create portfolio
  const portfolio = new Portfolio({
    userId: user._id,
    totalValue: 0,
    totalInvested: 0,
    totalProfitLoss: 0,
    profitLossPercentage: 0
  });
  await portfolio.save();

  // Link account balance and portfolio to user
  user.Account_Balance = accountBalance._id as any;
  user.portfolio = portfolio._id as any;
  await user.save();

  // Generate JWT token
  const token = jwt.sign(
    { userId: user._id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  // Set auth token in HTTP-only cookie
  res.setCookie('auth_token', token, COOKIE_OPTIONS);

  // Clear verification cookies
  res.clearCookie('email_verification');
  res.clearCookie('phone_verification');

  return {
    success: true,
    message: 'User registered successfully',
    data: {
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        role: user.role,
        accountStatus: user.accountStatus,
        kycStatus: user.kycStatus
      }
    }
  };
});

/**
 * Login user and set auth cookie
 */
export const loginHandler = RequestHandler(async (req: FastifyRequest<{
  Body: { email: string; password: string }
}>, res: FastifyReply) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  // Find user
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Invalid email or password');
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password || '');
  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  // Check account status
  if (user.accountStatus === 'suspended') {
    throw new Error('Your account has been suspended. Please contact support.');
  }

  // Update last active
  user.lastActive = new Date();
  await user.save();

  // Generate JWT token
  const token = jwt.sign(
    { userId: user._id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  // Set auth token in HTTP-only cookie
  res.setCookie('auth_token', token, COOKIE_OPTIONS);

  return {
    success: true,
    message: 'Login successful',
    data: {
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        role: user.role,
        accountStatus: user.accountStatus,
        kycStatus: user.kycStatus,
        avatar: user.avatar
      }
    }
  };
});

/**
 * Logout user and clear auth cookie
 */
export const logoutHandler = RequestHandler(async (req: FastifyRequest, res: FastifyReply) => {
  res.clearCookie('auth_token');
  res.clearCookie('email_verification');
  res.clearCookie('phone_verification');

  return {
    success: true,
    message: 'Logout successful'
  };
});

/**
 * Get current user (from cookie)
 */
export const getMeHandler = RequestHandler(async (req: FastifyRequest, res: FastifyReply) => {
  // @ts-ignore - user is added by auth middleware
  const userId = req.user?.userId;

  if (!userId) {
    throw new Error('Unauthorized');
  }

  const user = await User.findById(userId)
    .select('-password -twoFactorSecret')
    .populate('Account_Balance')
    .populate('portfolio');

  if (!user) {
    throw new Error('User not found');
  }

  return {
    success: true,
    data: user
  };
});

export default {
  sendOTPHandler,
  verifyOTPHandler,
  registerHandler,
  loginHandler,
  logoutHandler,
  getMeHandler
};
