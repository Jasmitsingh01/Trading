'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { OTPInput } from './OTPInput'
import { ArrowLeft, RefreshCw } from 'lucide-react'

interface OTPVerificationProps {
    identifier: string
    type: 'email' | 'phone'
    onVerify: (otp: string) => Promise<boolean>
    onBack: () => void
    onResend: () => Promise<void>
}

export function OTPVerification({ identifier, type, onVerify, onBack, onResend }: OTPVerificationProps) {
    const [otp, setOtp] = useState('')
    const [isVerifying, setIsVerifying] = useState(false)
    const [error, setError] = useState('')
    const [canResend, setCanResend] = useState(false)
    const [countdown, setCountdown] = useState(60)

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
            return () => clearTimeout(timer)
        } else {
            setCanResend(true)
        }
    }, [countdown])

    const handleComplete = async (code: string) => {
        setOtp(code)
        setError('')
        setIsVerifying(true)

        try {
            const success = await onVerify(code)
            if (!success) {
                setError('Invalid or expired OTP. Please try again.')
                setOtp('')
            }
        } catch (err) {
            setError('Verification failed. Please try again.')
            setOtp('')
        } finally {
            setIsVerifying(false)
        }
    }

    const handleResend = async () => {
        if (!canResend) return

        setCanResend(false)
        setCountdown(60)
        setError('')

        try {
            await onResend()
        } catch (err) {
            setError('Failed to resend OTP. Please try again.')
        }
    }

    return (
        <Card className="w-full max-w-md">
            <CardHeader className="space-y-1">
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onBack}
                        className="h-8 w-8"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <CardTitle className="text-2xl">Enter Verification Code</CardTitle>
                </div>
                <CardDescription>
                    We've sent a 6-digit code to {type === 'email' ? 'your email' : 'your phone'}
                    <br />
                    <span className="font-medium text-foreground">{identifier}</span>
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <OTPInput
                        length={6}
                        onComplete={handleComplete}
                        disabled={isVerifying}
                    />
                    {error && (
                        <p className="text-sm text-destructive mt-2 text-center animate-shake">
                            {error}
                        </p>
                    )}
                </div>

                <div className="text-center space-y-2">
                    <p className="text-sm text-muted-foreground">
                        Didn't receive the code?
                    </p>
                    <Button
                        variant="ghost"
                        onClick={handleResend}
                        disabled={!canResend || isVerifying}
                        className="text-primary"
                    >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        {canResend ? 'Resend Code' : `Resend in ${countdown}s`}
                    </Button>
                </div>

                {isVerifying && (
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        <p className="text-sm text-muted-foreground mt-2">Verifying...</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
