// Input Validation Utilities

/**
 * Detect if input is an email or phone number
 */
export function detectInputType(input: string): 'email' | 'phone' | 'unknown' {
    const trimmed = input.trim()

    // Check for email pattern
    if (isValidEmail(trimmed)) {
        return 'email'
    }

    // Check for phone number pattern
    if (isValidPhone(trimmed)) {
        return 'phone'
    }

    return 'unknown'
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

/**
 * Validate phone number format (international)
 * Accepts: +1234567890, 1234567890, (123) 456-7890, etc.
 */
export function isValidPhone(phone: string): boolean {
    // Remove all non-digit characters except +
    const cleaned = phone.replace(/[^\d+]/g, '')

    // Check if it's a valid length (10-15 digits, optionally starting with +)
    const phoneRegex = /^\+?\d{10,15}$/
    return phoneRegex.test(cleaned)
}

/**
 * Sanitize phone number to E.164 format
 * Example: (123) 456-7890 -> +11234567890
 */
export function sanitizePhone(phone: string): string {
    // Remove all non-digit characters except +
    let cleaned = phone.replace(/[^\d+]/g, '')

    // If doesn't start with +, assume US number and add +1
    if (!cleaned.startsWith('+')) {
        // If it's 10 digits, assume US
        if (cleaned.length === 10) {
            cleaned = '+1' + cleaned
        } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
            cleaned = '+' + cleaned
        } else {
            // For other countries, just add +
            cleaned = '+' + cleaned
        }
    }

    return cleaned
}

/**
 * Format phone number for display
 * Example: +11234567890 -> +1 (123) 456-7890
 */
export function formatPhoneDisplay(phone: string): string {
    const cleaned = phone.replace(/[^\d+]/g, '')

    // US number format
    if (cleaned.startsWith('+1') && cleaned.length === 12) {
        return `+1 (${cleaned.slice(2, 5)}) ${cleaned.slice(5, 8)}-${cleaned.slice(8)}`
    }

    // International format (just add spaces)
    if (cleaned.startsWith('+')) {
        const countryCode = cleaned.slice(0, cleaned.length - 10)
        const number = cleaned.slice(-10)
        return `${countryCode} ${number.slice(0, 3)} ${number.slice(3, 6)} ${number.slice(6)}`
    }

    return phone
}

/**
 * Validate OTP code (6 digits)
 */
export function isValidOTP(otp: string): boolean {
    return /^\d{6}$/.test(otp)
}
