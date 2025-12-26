import Redis from 'ioredis'

// Initialize Redis client if URL is available
const redisUrl = process.env.REDIS_URL
let redis: Redis | null = null

if (redisUrl) {
    redis = new Redis(redisUrl)
}

export async function storeOTP(identifier: string, code: string): Promise<void> {
    if (!redis) {
        // Fallback to in-memory storage if Redis is not available
        // This is handled by the existing lib/otp.ts, but this function is for Redis specifically
        console.warn('Redis not configured. OTP not stored in Redis.')
        return
    }

    // Store OTP with 10-minute expiration (600 seconds)
    await redis.setex(`otp:${identifier}`, 600, JSON.stringify({ code, used: false }))
}

export async function verifyOTP(identifier: string, code: string): Promise<{ valid: boolean; error?: string }> {
    if (!redis) {
        console.warn('Redis not configured. Cannot verify OTP via Redis.')
        return { valid: false, error: 'System configuration error' }
    }

    const data = await redis.get(`otp:${identifier}`)

    if (!data) {
        return { valid: false, error: 'Invalid or expired OTP' }
    }

    const { code: storedCode, used } = JSON.parse(data)

    if (used) {
        return { valid: false, error: 'OTP already used' }
    }

    if (storedCode !== code) {
        return { valid: false, error: 'Invalid OTP' }
    }

    // Mark OTP as used (or delete it)
    // We mark it as used to prevent replay attacks within the expiration window
    // Alternatively, we could just delete it: await redis.del(`otp:${identifier}`)
    await redis.del(`otp:${identifier}`)

    return { valid: true }
}
