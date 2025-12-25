import { NextResponse } from 'next/server'
import { api } from '@/lib/api'

export async function POST(request: Request) {
    try {
        const { identifier } = await request.json()

        if (!identifier) {
            return NextResponse.json(
                { success: false, message: 'Identifier is required' },
                { status: 400 }
            )
        }

        // Call GraphQL backend to send OTP
        const result = await api.auth.sendOTP(identifier);

        if (result.sendOTP.success) {
            return NextResponse.json({ success: true })
        } else {
            return NextResponse.json(
                { success: false, message: result.sendOTP.message || 'Failed to send OTP' },
                { status: 500 }
            )
        }

    } catch (error: any) {
        console.error('Error sending OTP:', error)
        return NextResponse.json(
            { success: false, message: error.message || 'Internal server error' },
            { status: 500 }
        )
    }
}
