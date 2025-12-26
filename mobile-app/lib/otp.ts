// OTP Generation and Management Utility

interface OTPStore {
    code: string
    identifier: string // email or phone
    expiresAt: number
    used: boolean
}

// In-memory store (use Redis in production)
const otpStore = new Map<string, OTPStore>()

/**
 * Generate a 6-digit OTP code
 */
export function generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString()
}

/**
 * Store OTP with expiration (10 minutes)
 */
export function storeOTP(identifier: string, code: string): void {
    const expiresAt = Date.now() + 10 * 60 * 1000 // 10 minutes
    otpStore.set(identifier.toLowerCase(), {
        code,
        identifier: identifier.toLowerCase(),
        expiresAt,
        used: false,
    })
}

/**
 * Verify OTP code
 */
export function verifyOTP(identifier: string, code: string): {
    valid: boolean
    error?: string
} {
    const stored = otpStore.get(identifier.toLowerCase())

    if (!stored) {
        return { valid: false, error: 'No OTP found for this identifier' }
    }

    if (stored.used) {
        return { valid: false, error: 'OTP has already been used' }
    }

    if (Date.now() > stored.expiresAt) {
        otpStore.delete(identifier.toLowerCase())
        return { valid: false, error: 'OTP has expired' }
    }

    if (stored.code !== code) {
        return { valid: false, error: 'Invalid OTP code' }
    }

    // Mark as used
    stored.used = true
    otpStore.set(identifier.toLowerCase(), stored)

    // Clean up after successful verification
    setTimeout(() => {
        otpStore.delete(identifier.toLowerCase())
    }, 1000)

    return { valid: true }
}

/**
 * Get remaining time for OTP
 */
export function getOTPExpiry(identifier: string): number | null {
    const stored = otpStore.get(identifier.toLowerCase())
    if (!stored) return null

    const remaining = stored.expiresAt - Date.now()
    return remaining > 0 ? remaining : null
}

/**
 * Clear expired OTPs (cleanup function)
 */
export function cleanupExpiredOTPs(): void {
    const now = Date.now()
    for (const [key, value] of otpStore.entries()) {
        if (now > value.expiresAt) {
            otpStore.delete(key)
        }
    }
}

// Run cleanup every minute
if (typeof window === 'undefined') {
    setInterval(cleanupExpiredOTPs, 60 * 1000)
}
