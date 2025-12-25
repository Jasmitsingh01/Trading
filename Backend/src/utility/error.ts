// utils/CustomErrors.ts

/**
 * Base custom error class
 */
export class AppError extends Error {
    public readonly statusCode: number;
    public readonly isOperational: boolean;
    public readonly code?: string;
    public readonly details?: any;

    constructor(
        message: string,
        statusCode: number = 500,
        isOperational: boolean = true,
        code?: string,
        details?: any
    ) {
        super(message);
        
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.code = code;
        this.details = details;

        // Maintains proper stack trace for where our error was thrown
        Error.captureStackTrace(this, this.constructor);
        
        // Set the prototype explicitly
        Object.setPrototypeOf(this, AppError.prototype);
    }
}

// ============================================
// Authentication Errors (401)
// ============================================

export class AuthenticationError extends AppError {
    constructor(message: string = 'Authentication failed', code?: string, details?: any) {
        super(message, 401, true, code || 'AUTH_ERROR', details);
        Object.setPrototypeOf(this, AuthenticationError.prototype);
    }
}

export class InvalidCredentialsError extends AuthenticationError {
    constructor(message: string = 'Invalid credentials') {
        super(message, 'INVALID_CREDENTIALS');
        Object.setPrototypeOf(this, InvalidCredentialsError.prototype);
    }
}

export class TokenExpiredError extends AuthenticationError {
    constructor(message: string = 'Token has expired') {
        super(message, 'TOKEN_EXPIRED');
        Object.setPrototypeOf(this, TokenExpiredError.prototype);
    }
}

export class InvalidTokenError extends AuthenticationError {
    constructor(message: string = 'Invalid token') {
        super(message, 'INVALID_TOKEN');
        Object.setPrototypeOf(this, InvalidTokenError.prototype);
    }
}

export class OTPExpiredError extends AuthenticationError {
    constructor(message: string = 'OTP has expired') {
        super(message, 'OTP_EXPIRED');
        Object.setPrototypeOf(this, OTPExpiredError.prototype);
    }
}

export class OTPInvalidError extends AuthenticationError {
    constructor(message: string = 'Invalid OTP') {
        super(message, 'OTP_INVALID');
        Object.setPrototypeOf(this, OTPInvalidError.prototype);
    }
}

export class OTPMaxAttemptsError extends AuthenticationError {
    constructor(message: string = 'Maximum OTP attempts exceeded') {
        super(message, 'OTP_MAX_ATTEMPTS');
        Object.setPrototypeOf(this, OTPMaxAttemptsError.prototype);
    }
}

// ============================================
// Authorization Errors (403)
// ============================================

export class AuthorizationError extends AppError {
    constructor(message: string = 'Access forbidden', code?: string, details?: any) {
        super(message, 403, true, code || 'FORBIDDEN', details);
        Object.setPrototypeOf(this, AuthorizationError.prototype);
    }
}

export class InsufficientPermissionsError extends AuthorizationError {
    constructor(message: string = 'Insufficient permissions') {
        super(message, 'INSUFFICIENT_PERMISSIONS');
        Object.setPrototypeOf(this, InsufficientPermissionsError.prototype);
    }
}

export class AccountSuspendedError extends AuthorizationError {
    constructor(message: string = 'Account has been suspended') {
        super(message, 'ACCOUNT_SUSPENDED');
        Object.setPrototypeOf(this, AccountSuspendedError.prototype);
    }
}

export class AccountNotVerifiedError extends AuthorizationError {
    constructor(message: string = 'Account not verified') {
        super(message, 'ACCOUNT_NOT_VERIFIED');
        Object.setPrototypeOf(this, AccountNotVerifiedError.prototype);
    }
}

export class KYCNotCompletedError extends AuthorizationError {
    constructor(message: string = 'KYC verification not completed') {
        super(message, 'KYC_NOT_COMPLETED');
        Object.setPrototypeOf(this, KYCNotCompletedError.prototype);
    }
}

// ============================================
// Validation Errors (400, 422)
// ============================================

export class ValidationError extends AppError {
    constructor(message: string = 'Validation failed', details?: any) {
        super(message, 422, true, 'VALIDATION_ERROR', details);
        Object.setPrototypeOf(this, ValidationError.prototype);
    }
}

export class BadRequestError extends AppError {
    constructor(message: string = 'Bad request', code?: string, details?: any) {
        super(message, 400, true, code || 'BAD_REQUEST', details);
        Object.setPrototypeOf(this, BadRequestError.prototype);
    }
}

export class InvalidEmailError extends ValidationError {
    constructor(message: string = 'Invalid email address') {
        super(message, { field: 'email' });
        Object.setPrototypeOf(this, InvalidEmailError.prototype);
    }
}

export class InvalidPhoneError extends ValidationError {
    constructor(message: string = 'Invalid phone number') {
        super(message, { field: 'phone' });
        Object.setPrototypeOf(this, InvalidPhoneError.prototype);
    }
}

export class InvalidPasswordError extends ValidationError {
    constructor(message: string = 'Invalid password format') {
        super(message, { field: 'password' });
        Object.setPrototypeOf(this, InvalidPasswordError.prototype);
    }
}

export class MissingParameterError extends BadRequestError {
    constructor(parameterName: string) {
        super(`Missing required parameter: ${parameterName}`, 'MISSING_PARAMETER', {
            parameter: parameterName
        });
        Object.setPrototypeOf(this, MissingParameterError.prototype);
    }
}

export class InvalidParameterError extends BadRequestError {
    constructor(parameterName: string, reason?: string) {
        super(
            `Invalid parameter: ${parameterName}${reason ? ` - ${reason}` : ''}`,
            'INVALID_PARAMETER',
            { parameter: parameterName, reason }
        );
        Object.setPrototypeOf(this, InvalidParameterError.prototype);
    }
}

// ============================================
// Resource Errors (404)
// ============================================

export class NotFoundError extends AppError {
    constructor(message: string = 'Resource not found', resource?: string) {
        super(message, 404, true, 'NOT_FOUND', resource ? { resource } : undefined);
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
}

export class UserNotFoundError extends NotFoundError {
    constructor(message: string = 'User not found') {
        super(message, 'user');
        Object.setPrototypeOf(this, UserNotFoundError.prototype);
    }
}

export class InvestmentNotFoundError extends NotFoundError {
    constructor(message: string = 'Investment not found') {
        super(message, 'investment');
        Object.setPrototypeOf(this, InvestmentNotFoundError.prototype);
    }
}

export class TransactionNotFoundError extends NotFoundError {
    constructor(message: string = 'Transaction not found') {
        super(message, 'transaction');
        Object.setPrototypeOf(this, TransactionNotFoundError.prototype);
    }
}

export class PaymentNotFoundError extends NotFoundError {
    constructor(message: string = 'Payment not found') {
        super(message, 'payment');
        Object.setPrototypeOf(this, PaymentNotFoundError.prototype);
    }
}

export class PortfolioNotFoundError extends NotFoundError {
    constructor(message: string = 'Portfolio not found') {
        super(message, 'portfolio');
        Object.setPrototypeOf(this, PortfolioNotFoundError.prototype);
    }
}

export class BankDetailsNotFoundError extends NotFoundError {
    constructor(message: string = 'Bank details not found') {
        super(message, 'bank_details');
        Object.setPrototypeOf(this, BankDetailsNotFoundError.prototype);
    }
}

// ============================================
// Conflict Errors (409)
// ============================================

export class ConflictError extends AppError {
    constructor(message: string = 'Resource conflict', code?: string, details?: any) {
        super(message, 409, true, code || 'CONFLICT', details);
        Object.setPrototypeOf(this, ConflictError.prototype);
    }
}

export class UserAlreadyExistsError extends ConflictError {
    constructor(message: string = 'User already exists', field?: string) {
        super(message, 'USER_EXISTS', field ? { field } : undefined);
        Object.setPrototypeOf(this, UserAlreadyExistsError.prototype);
    }
}

export class DuplicateEmailError extends UserAlreadyExistsError {
    constructor(message: string = 'Email already registered') {
        super(message, 'email');
        Object.setPrototypeOf(this, DuplicateEmailError.prototype);
    }
}

export class DuplicatePhoneError extends UserAlreadyExistsError {
    constructor(message: string = 'Phone number already registered') {
        super(message, 'phone');
        Object.setPrototypeOf(this, DuplicatePhoneError.prototype);
    }
}

export class ResourceAlreadyProcessedError extends ConflictError {
    constructor(resource: string, message?: string) {
        super(message || `${resource} already processed`, 'ALREADY_PROCESSED', { resource });
        Object.setPrototypeOf(this, ResourceAlreadyProcessedError.prototype);
    }
}

// ============================================
// Business Logic Errors (400, 422)
// ============================================

export class InsufficientBalanceError extends AppError {
    constructor(message: string = 'Insufficient balance', required?: number, available?: number) {
        super(message, 400, true, 'INSUFFICIENT_BALANCE', { required, available });
        Object.setPrototypeOf(this, InsufficientBalanceError.prototype);
    }
}

export class InvalidAmountError extends ValidationError {
    constructor(message: string = 'Invalid amount', min?: number, max?: number) {
        super(message, { min, max });
        Object.setPrototypeOf(this, InvalidAmountError.prototype);
    }
}

export class AmountTooLowError extends InvalidAmountError {
    constructor(minimum: number) {
        super(`Amount must be at least ${minimum}`, minimum);
        Object.setPrototypeOf(this, AmountTooLowError.prototype);
    }
}

export class AmountTooHighError extends InvalidAmountError {
    constructor(maximum: number) {
        super(`Amount cannot exceed ${maximum}`, undefined, maximum);
        Object.setPrototypeOf(this, AmountTooHighError.prototype);
    }
}

export class LeverageExceededError extends AppError {
    constructor(message: string = 'Leverage limit exceeded', maxLeverage?: number) {
        super(message, 400, true, 'LEVERAGE_EXCEEDED', { maxLeverage });
        Object.setPrototypeOf(this, LeverageExceededError.prototype);
    }
}

export class MarginCallError extends AppError {
    constructor(message: string = 'Margin call: insufficient funds') {
        super(message, 400, true, 'MARGIN_CALL');
        Object.setPrototypeOf(this, MarginCallError.prototype);
    }
}

export class PositionLiquidatedError extends AppError {
    constructor(message: string = 'Position liquidated') {
        super(message, 400, true, 'LIQUIDATED');
        Object.setPrototypeOf(this, PositionLiquidatedError.prototype);
    }
}

export class MarketClosedError extends AppError {
    constructor(message: string = 'Market is currently closed') {
        super(message, 400, true, 'MARKET_CLOSED');
        Object.setPrototypeOf(this, MarketClosedError.prototype);
    }
}

export class InvalidAssetError extends AppError {
    constructor(message: string = 'Invalid asset', assetSymbol?: string) {
        super(message, 400, true, 'INVALID_ASSET', { assetSymbol });
        Object.setPrototypeOf(this, InvalidAssetError.prototype);
    }
}

// ============================================
// File Upload Errors (400, 413)
// ============================================

export class FileUploadError extends AppError {
    constructor(message: string = 'File upload failed', code?: string, details?: any) {
        super(message, 400, true, code || 'FILE_UPLOAD_ERROR', details);
        Object.setPrototypeOf(this, FileUploadError.prototype);
    }
}

export class InvalidFileTypeError extends FileUploadError {
    constructor(allowedTypes?: string[]) {
        super(
            `Invalid file type${allowedTypes ? `. Allowed: ${allowedTypes.join(', ')}` : ''}`,
            'INVALID_FILE_TYPE',
            { allowedTypes }
        );
        Object.setPrototypeOf(this, InvalidFileTypeError.prototype);
    }
}

export class FileTooLargeError extends AppError {
    constructor(maxSize?: number) {
        super(
            `File size exceeds limit${maxSize ? ` of ${maxSize} bytes` : ''}`,
            413,
            true,
            'FILE_TOO_LARGE',
            { maxSize }
        );
        Object.setPrototypeOf(this, FileTooLargeError.prototype);
    }
}

export class FileCorruptedError extends FileUploadError {
    constructor(message: string = 'File is corrupted') {
        super(message, 'FILE_CORRUPTED');
        Object.setPrototypeOf(this, FileCorruptedError.prototype);
    }
}

// ============================================
// Rate Limiting Errors (429)
// ============================================

export class RateLimitError extends AppError {
    constructor(message: string = 'Too many requests', retryAfter?: number) {
        super(message, 429, true, 'RATE_LIMIT_EXCEEDED', { retryAfter });
        Object.setPrototypeOf(this, RateLimitError.prototype);
    }
}

export class TooManyLoginAttemptsError extends RateLimitError {
    constructor(retryAfter?: number) {
        super('Too many login attempts. Please try again later', retryAfter);
        Object.setPrototypeOf(this, TooManyLoginAttemptsError.prototype);
    }
}

export class TooManyOTPRequestsError extends RateLimitError {
    constructor(retryAfter?: number) {
        super('Too many OTP requests. Please try again later', retryAfter);
        Object.setPrototypeOf(this, TooManyOTPRequestsError.prototype);
    }
}

// ============================================
// Database Errors (500)
// ============================================

export class DatabaseError extends AppError {
    constructor(message: string = 'Database error', details?: any) {
        super(message, 500, false, 'DATABASE_ERROR', details);
        Object.setPrototypeOf(this, DatabaseError.prototype);
    }
}

export class DatabaseConnectionError extends DatabaseError {
    constructor(message: string = 'Database connection failed') {
        super(message);
        Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
    }
}

export class QueryExecutionError extends DatabaseError {
    constructor(message: string = 'Query execution failed', query?: string) {
        super(message, { query });
        Object.setPrototypeOf(this, QueryExecutionError.prototype);
    }
}

// ============================================
// External Service Errors (502, 503)
// ============================================

export class ExternalServiceError extends AppError {
    constructor(
        message: string = 'External service error',
        service?: string,
        statusCode: number = 502
    ) {
        super(message, statusCode, true, 'EXTERNAL_SERVICE_ERROR', { service });
        Object.setPrototypeOf(this, ExternalServiceError.prototype);
    }
}

export class PaymentGatewayError extends ExternalServiceError {
    constructor(message: string = 'Payment gateway error') {
        super(message, 'payment_gateway', 502);
        Object.setPrototypeOf(this, PaymentGatewayError.prototype);
    }
}

export class MarketDataProviderError extends ExternalServiceError {
    constructor(message: string = 'Market data provider error') {
        super(message, 'market_data_provider', 503);
        Object.setPrototypeOf(this, MarketDataProviderError.prototype);
    }
}

export class SMSServiceError extends ExternalServiceError {
    constructor(message: string = 'SMS service error') {
        super(message, 'sms_service', 503);
        Object.setPrototypeOf(this, SMSServiceError.prototype);
    }
}

export class EmailServiceError extends ExternalServiceError {
    constructor(message: string = 'Email service error') {
        super(message, 'email_service', 503);
        Object.setPrototypeOf(this, EmailServiceError.prototype);
    }
}

// ============================================
// Server Errors (500, 503)
// ============================================

export class InternalServerError extends AppError {
    constructor(message: string = 'Internal server error', details?: any) {
        super(message, 500, false, 'INTERNAL_SERVER_ERROR', details);
        Object.setPrototypeOf(this, InternalServerError.prototype);
    }
}

export class ServiceUnavailableError extends AppError {
    constructor(message: string = 'Service temporarily unavailable') {
        super(message, 503, true, 'SERVICE_UNAVAILABLE');
        Object.setPrototypeOf(this, ServiceUnavailableError.prototype);
    }
}

export class MaintenanceModeError extends ServiceUnavailableError {
    constructor(message: string = 'System under maintenance') {
        super(message);
        Object.setPrototypeOf(this, MaintenanceModeError.prototype);
    }
}

export class TimeoutError extends AppError {
    constructor(message: string = 'Request timeout') {
        super(message, 504, true, 'TIMEOUT');
        Object.setPrototypeOf(this, TimeoutError.prototype);
    }
}

// ============================================
// Helper Functions
// ============================================

/**
 * Check if error is operational (expected) or programming error
 */
export function isOperationalError(error: Error): boolean {
    if (error instanceof AppError) {
        return error.isOperational;
    }
    return false;
}

/**
 * Create error from database error
 */
export function createDatabaseError(error: any): AppError {
    // MongoDB duplicate key error
    if (error.code === 11000) {
        const field = Object.keys(error.keyPattern || {})[0];
        if (field === 'email') {
            return new DuplicateEmailError();
        }
        if (field === 'phone') {
            return new DuplicatePhoneError();
        }
        return new ConflictError('Duplicate entry', 'DUPLICATE_KEY', { field });
    }

    // MongoDB validation error
    if (error.name === 'ValidationError') {
        return new ValidationError('Validation failed', error.errors);
    }

    // MongoDB cast error (invalid ObjectId)
    if (error.name === 'CastError') {
        return new BadRequestError('Invalid ID format', 'INVALID_ID', { field: error.path });
    }

    return new DatabaseError('Database operation failed', error.message);
}

/**
 * Error factory for common scenarios
 */
export class ErrorFactory {
    static userNotFound(userId?: string): UserNotFoundError {
        return new UserNotFoundError(
            userId ? `User with ID ${userId} not found` : 'User not found'
        );
    }

    static invalidCredentials(): InvalidCredentialsError {
        return new InvalidCredentialsError();
    }

    static insufficientBalance(required: number, available: number): InsufficientBalanceError {
        return new InsufficientBalanceError(
            `Insufficient balance. Required: ${required}, Available: ${available}`,
            required,
            available
        );
    }

    static invalidAmount(min?: number, max?: number): InvalidAmountError {
        let message = 'Invalid amount';
        if (min && max) {
            message = `Amount must be between ${min} and ${max}`;
        } else if (min) {
            message = `Amount must be at least ${min}`;
        } else if (max) {
            message = `Amount cannot exceed ${max}`;
        }
        return new InvalidAmountError(message, min, max);
    }

    static unauthorized(message: string = 'Unauthorized access'): AuthenticationError {
        return new AuthenticationError(message);
    }

    static forbidden(message: string = 'Access forbidden'): AuthorizationError {
        return new AuthorizationError(message);
    }

    static validation(field: string, message: string): ValidationError {
        return new ValidationError(message, { field });
    }

    static rateLimit(retryAfter: number): RateLimitError {
        return new RateLimitError('Too many requests', retryAfter);
    }
}
