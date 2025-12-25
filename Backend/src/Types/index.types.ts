import mongoose from "mongoose";

// ============================================
// USER SCHEMA INTERFACE
// ============================================

export interface IUser extends mongoose.Document {
  fullname: string;
  email: string;
  phone?: string;
  password?: string; // Hashed password, optional for OTP-only auth
  role: 'user' | 'admin' | 'moderator';
  accountStatus: 'active' | 'inactive' | 'suspended' | 'under review' | 'pending';
  mobileNumber: string;
  leverage_type: '1:10' | '1:20' | '1:50' | '1:100' | '1:200' | '1:500';

  // Address Information
  Address: string;
  Address1?: string;
  city: string;
  state: string;
  country: string;
  pincode: string;

  // Personal Information
  dateOfBirth?: string;
  nationality?: string;

  // References to other collections
  bank: mongoose.Types.ObjectId; // Reference to BankDetails
  avatar: string; // URL to avatar image
  portfolio: mongoose.Types.ObjectId; // Reference to Portfolio
  Account_Balance: mongoose.Types.ObjectId; // Reference to AccountBalance

  // Document uploads
  documents: {
    AddressProof: string; // URL to document
    BankProof: string; // URL to document
    OtherProof?: string; // URL to document
    IdentityFront?: string;
    IdentityBack?: string;
    SelfieWithID?: string;
  };

  // Verification status
  isVerified: boolean;
  isKYCCompleted: boolean;
  kycStatus: 'not_started' | 'pending' | 'under_review' | 'approved' | 'rejected';
  kycSubmittedAt?: Date;
  kycApprovedAt?: Date;
  kycRejectionReason?: string;

  // Security
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  passwordResetToken: string | undefined;
  passwordResetExpires: Date | undefined;
  // Activity tracking
  lastActive: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// BANK DETAILS SCHEMA INTERFACE
// ============================================

export interface IBankDetails extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  bankName: string;
  accountHolderName: string;
  accountNumber: string; // Should be encrypted
  accountType: 'savings' | 'current' | 'checking';
  ifscCode?: string; // For Indian banks
  swiftCode?: string; // For international banks
  routingNumber?: string; // For US banks
  branchName?: string;
  branchAddress?: string;

  // Additional details
  isPrimary: boolean;
  isVerified: boolean;
  verifiedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// ACCOUNT BALANCE SCHEMA INTERFACE
// ============================================

export interface IAccountBalance extends mongoose.Document {
  userId: mongoose.Types.ObjectId;

  // Balance information
  availableBalance: number;
  totalBalance: number;
  lockedBalance: number; // In active trades
  totalDeposited: number;
  totalWithdrawn: number;
  totalProfit: number;
  totalLoss: number;

  // Currency
  currency: 'USD' | 'EUR' | 'GBP' | 'INR';

  // Calculated fields
  totalInvested: number;
  unrealizedPnL: number; // Profit/Loss from open positions
  realizedPnL: number; // Profit/Loss from closed positions

  // Bonus and rewards
  bonusBalance: number;
  referralEarnings: number;

  lastUpdated: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// PORTFOLIO SCHEMA INTERFACE
// ============================================

export interface IPortfolio extends mongoose.Document {
  userId: mongoose.Types.ObjectId;

  // Portfolio summary
  totalValue: number;
  totalInvested: number;
  totalProfitLoss: number;
  profitLossPercentage: number;

  // Holdings
  holdings: mongoose.Types.ObjectId[]; // Array of Investment references
  activePositions: number;
  closedPositions: number;

  // Performance metrics
  bestPerformingAsset?: {
    symbol: string;
    profitPercentage: number;
  };
  worstPerformingAsset?: {
    symbol: string;
    lossPercentage: number;
  };

  // Diversification
  assetAllocation: {
    cryptocurrency: number; // Percentage
    stocks: number;
    forex: number;
    commodities: number;
  };

  lastUpdated: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// INVESTMENT/POSITION SCHEMA INTERFACE
// ============================================

export interface IInvestment extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  portfolioId: mongoose.Types.ObjectId;

  // Asset details
  assetType: 'cryptocurrency' | 'stock' | 'forex' | 'commodity' | 'index';
  assetSymbol: string; // BTC, ETH, AAPL, EUR/USD, etc.
  assetName: string;

  // Trade details
  tradeType: 'buy' | 'sell' | 'long' | 'short';
  quantity: number;
  entryPrice: number;
  currentPrice: number;
  exitPrice?: number;

  // Position sizing
  investedAmount: number;
  leverage: number; // 1, 10, 20, 50, 100, etc.
  leveragedAmount: number; // investedAmount * leverage

  // P&L calculations
  profitLoss: number;
  profitLossPercentage: number;
  unrealizedPnL: number;
  realizedPnL?: number;

  // Risk management
  stopLoss?: number;
  takeProfit?: number;
  trailingStop?: number;

  // Status tracking
  status: 'active' | 'closed' | 'pending' | 'cancelled' | 'liquidated';
  openedAt: Date;
  closedAt?: Date;

  // Transaction details
  openOrderId?: string;
  closeOrderId?: string;
  fees: number;

  // Metadata
  notes?: string;
  tags?: string[];

  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// TRANSACTION SCHEMA INTERFACE
// ============================================

export interface ITransaction extends mongoose.Document {
  userId: mongoose.Types.ObjectId;

  // Transaction details
  type: 'deposit' | 'withdrawal' | 'investment' | 'profit' | 'loss' | 'fee' | 'bonus' | 'refund' | 'transfer';
  amount: number;
  currency: string;

  // Status
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'rejected';

  // Payment method (for deposits/withdrawals)
  paymentMethod?: 'bank_transfer' | 'credit_card' | 'debit_card' | 'upi' | 'crypto' | 'paypal';

  // Related entities
  relatedInvestmentId?: mongoose.Types.ObjectId;
  relatedPaymentId?: mongoose.Types.ObjectId;

  // Bank/Payment details
  bankDetails?: {
    bankName?: string;
    accountNumber?: string; // Last 4 digits only
    transactionId?: string;
  };

  // Proof documents
  proofDocument?: string; // URL to receipt/proof

  // Processing details
  description?: string;
  notes?: string;
  processedBy?: mongoose.Types.ObjectId; // Admin ID
  processedAt?: Date;
  rejectionReason?: string;

  // Balance impact
  balanceBefore?: number;
  balanceAfter?: number;

  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// PAYMENT VERIFICATION SCHEMA INTERFACE
// ============================================

export interface IPaymentVerification extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  transactionId: mongoose.Types.ObjectId;

  // Payment details
  amount: number;
  currency: string;
  paymentMethod: 'bank_transfer' | 'credit_card' | 'debit_card' | 'upi' | 'crypto' | 'paypal';

  // Bank details
  bankDetails: {
    bankName: string;
    accountHolderName: string;
    accountNumber: string; // Encrypted
    routingNumber?: string;
    ifscCode?: string;
    transactionId: string;
    transactionDate: Date;
  };

  // Proof documents
  proofDocument: string; // URL to uploaded receipt

  // Verification
  status: 'pending' | 'under_review' | 'verified' | 'rejected';
  verificationChecklist: {
    receiptClarity: boolean;
    amountMatch: boolean;
    bankDetailsMatch: boolean;
    transactionRecent: boolean;
    fraudCheckPassed: boolean;
  };

  // Admin actions
  reviewedBy?: mongoose.Types.ObjectId;
  reviewedAt?: Date;
  rejectionReason?: string;
  adminNotes?: string;

  submittedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// KYC VERIFICATION SCHEMA INTERFACE
// ============================================

export interface IKYCVerification extends mongoose.Document {
  userId: mongoose.Types.ObjectId;

  // Personal information
  fullName: string;
  dateOfBirth: string;
  nationality: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  phoneNumber: string;

  // Documents
  documents: {
    identityFront: {
      url: string;
      uploadedAt: Date;
      documentType: 'passport' | 'drivers_license' | 'national_id';
      documentNumber?: string;
    };
    identityBack: {
      url: string;
      uploadedAt: Date;
    };
    addressProof: {
      url: string;
      uploadedAt: Date;
      documentType: 'utility_bill' | 'bank_statement' | 'rental_agreement';
    };
    bankStatement: {
      url: string;
      uploadedAt: Date;
    };
    selfieWithID: {
      url: string;
      uploadedAt: Date;
    };
  };

  // Verification status
  status: 'not_started' | 'pending' | 'under_review' | 'approved' | 'rejected';

  // Verification checklist
  verificationChecklist: {
    identityClarity: boolean;
    addressProofRecent: boolean;
    bankStatementValid: boolean;
    selfieIdMatch: boolean;
    informationConsistent: boolean;
  };

  // Admin review
  reviewedBy?: mongoose.Types.ObjectId;
  reviewedAt?: Date;
  approvedAt?: Date;
  rejectionReason?: string;
  adminNotes?: string;

  // Timestamps
  submittedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// WATCHLIST SCHEMA INTERFACE
// ============================================

export interface IWatchlist extends mongoose.Document {
  userId: mongoose.Types.ObjectId;

  assets: Array<{
    symbol: string; // BTC, ETH, AAPL, etc.
    assetType: 'cryptocurrency' | 'stock' | 'forex' | 'commodity';
    addedAt: Date;
    alertPrice?: number;
    notes?: string;
  }>;

  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// NOTIFICATION SCHEMA INTERFACE
// ============================================

export interface INotification extends mongoose.Document {
  userId: mongoose.Types.ObjectId;

  // Notification details
  type: 'kyc_approved' | 'kyc_rejected' | 'payment_approved' | 'payment_rejected' |
  'balance_added' | 'investment_created' | 'investment_closed' |
  'account_suspended' | 'price_alert' | 'margin_call' | 'general' | 'deposit' | 'withdrawal';

  title: string;
  message: string;

  // Status
  isRead: boolean;
  isDone: boolean; // For actionable notifications

  // Related entities
  relatedEntityId?: mongoose.Types.ObjectId;
  relatedEntityType?: 'transaction' | 'investment' | 'kyc' | 'payment';

  // Priority
  priority: 'low' | 'medium' | 'high' | 'urgent';

  // Action required
  actionRequired: boolean;
  actionUrl?: string;
  actionLabel?: string;

  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// ADMIN ACTIVITY LOG SCHEMA INTERFACE
// ============================================

export interface IAdminActivityLog extends mongoose.Document {
  adminId: mongoose.Types.ObjectId;

  // Action details
  action: 'user_verified' | 'user_suspended' | 'balance_added' | 'balance_deducted' |
  'payment_approved' | 'payment_rejected' | 'kyc_approved' | 'kyc_rejected' |
  'investment_modified' | 'account_deleted' | 'settings_changed' |
  'update_order_status' | 'force_execute_order' | 'bulk_cancel_orders';

  targetUserId?: mongoose.Types.ObjectId;
  targetType?: string;
  targetId?: mongoose.Types.ObjectId;

  // Details
  description?: string;
  metadata?: {
    amount?: number;
    reason?: string;
    previousValue?: any;
    newValue?: any;
    [key: string]: any;
  };

  // IP and device tracking
  ipAddress?: string;
  userAgent?: string;

  timestamp: Date;
  createdAt: Date;
}

// ============================================
// MARKET DATA SCHEMA INTERFACE (for caching)
// ============================================

export interface IMarketData extends mongoose.Document {
  symbol: string;
  assetType: 'cryptocurrency' | 'stock' | 'forex' | 'commodity';

  // Price data
  currentPrice: number;
  openPrice: number;
  highPrice: number;
  lowPrice: number;
  closePrice: number;

  // Volume and market cap
  volume24h: number;
  marketCap?: number;

  // Change metrics
  priceChange24h: number;
  priceChangePercentage24h: number;

  // Additional data
  circulatingSupply?: number;
  totalSupply?: number;

  lastUpdated: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// TRADING SETTINGS SCHEMA INTERFACE
// ============================================

export interface ITradingSettings extends mongoose.Document {
  userId: mongoose.Types.ObjectId;

  // Default settings
  defaultLeverage: number;
  defaultStopLoss: number; // Percentage
  defaultTakeProfit: number; // Percentage

  // Risk management
  maxPositionSize: number;
  maxDailyLoss: number;
  allowedAssetTypes: Array<'cryptocurrency' | 'stock' | 'forex' | 'commodity'>;

  // Notifications preferences
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;

  priceAlerts: boolean;
  tradeAlerts: boolean;
  newsAlerts: boolean;

  // Auto-trading (if applicable)
  autoTradingEnabled: boolean;
  autoWithdrawalEnabled: boolean;
  autoWithdrawalThreshold?: number;

  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// REFERRAL SCHEMA INTERFACE
// ============================================

export interface IReferral extends mongoose.Document {
  referrerId: mongoose.Types.ObjectId; // User who referred
  referredUserId: mongoose.Types.ObjectId; // User who was referred

  // Referral details
  referralCode: string;
  status: 'pending' | 'active' | 'completed';

  // Rewards
  referrerReward: number;
  referredUserReward: number;
  rewardPaid: boolean;
  rewardPaidAt?: Date;

  // Conditions
  minimumDepositRequired: number;
  depositMet: boolean;
  depositMetAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// OTP SCHEMA INTERFACE (for temporary storage)
// ============================================

export interface IOTP extends mongoose.Document {
  identifier: string; // email or phone
  type: 'email' | 'phone';
  code: string; // Hashed OTP
  attempts: number;
  isVerified: boolean;
  expiresAt: Date;
  createdAt: Date;
}
