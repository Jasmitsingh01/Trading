import { NextResponse } from 'next/server'
import { api } from '@/lib/api'

export async function POST(request: Request) {
    try {
        const { identifier, code } = await request.json()

        if (!identifier || !code) {
            return NextResponse.json(
                { success: false, message: 'Identifier and code are required' },
                { status: 400 }
            )
        }

        // Call GraphQL backend to verify OTP
        const result = await api.auth.verifyOTP(identifier, code);

        if (result.verifyOTP.success) {
            // Return success with token
            return NextResponse.json({
                success: true,
                token: result.verifyOTP.token,
                user: result.verifyOTP.user
            })
        } else {
            return NextResponse.json(
                { success: false, message: result.verifyOTP.message || 'Invalid OTP' },
                { status: 400 }
            )
        }

    } catch (error: any) {
        console.error('Error verifying OTP:', error)
        return NextResponse.json(
            { success: false, message: error.message || 'Internal server error' },
            { status: 500 }
        )
    }
}
