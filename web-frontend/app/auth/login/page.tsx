'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Mail, Lock, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { OTPVerification } from '@/components/auth/OTPVerification'
import { signIn } from 'next-auth/react'
import { detectInputType } from '@/lib/validators'
import type { VerificationStep } from '@/types/auth'
import { api } from '@/lib/api'

export default function LoginPage() {
    const [identifier, setIdentifier] = useState('')
    const [password, setPassword] = useState('')
    const [step, setStep] = useState<VerificationStep>('input')
    const [inputType, setInputType] = useState<'email' | 'phone'>('email')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [showPassword, setShowPassword] = useState(false)

    // Detect input type when identifier changes
    useEffect(() => {
        if (identifier.trim()) {
            const type = detectInputType(identifier)
            if (type === 'email') {
                setShowPassword(true)
                setInputType('email')
            } else if (type === 'phone') {
                setShowPassword(false)
                setInputType('phone')
            } else {
                setShowPassword(false)
            }
        } else {
            setShowPassword(false)
        }
    }, [identifier])

    const handlePasswordLogin = async () => {
        setError('')

        if (!identifier || !password) {
            setError('Please enter email and password')
            return
        }

        setIsLoading(true)

        try {
            // Backend sets auth cookie on successful login
             const result = await api.auth.login( identifier, password)

            if (result.success) {
                // Cookie is set - redirect to dashboard
                window.location.href = '/dashboard'
            } else {
                setError(result.message || 'Login failed')
                setIsLoading(false)
            }
        } catch (err: any) {
            setError(err.message || 'Login failed. Please try again.')
            setIsLoading(false)
        }
    }

    const handleSendOTP = async () => {
        setError('')

        const type = detectInputType(identifier)
        if (type === 'unknown') {
            setError('Please enter a valid email or phone number')
            return
        }

        setIsLoading(true)
        setInputType(type)

        try {
            const result = await api.auth.sendOTP(identifier)

            if (result.success) {
                setStep('verify')
            } else {
                setError(result.message || 'Failed to send OTP')
            }
        } catch (err: any) {
            setError(err.message || 'Failed to send OTP. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    const handleVerifyOTP = async (otp: string): Promise<boolean> => {
        try {
            // Backend sets auth cookie on successful OTP verification
            const result = await api.auth.verifyOTP(identifier, otp)

            if (result.success) {
                // Cookie is set - redirect to dashboard
                window.location.href = '/dashboard'
                return true
            }
            return false
        } catch (err) {
            return false
        }
    }

    const handleResendOTP = async () => {
        await handleSendOTP()
    }

    const handleGoogleSignIn = async () => {
        await signIn('google', { callbackUrl: '/dashboard' })
    }

    if (step === 'verify') {
        return (
            <div className="min-h-screen flex items-center justify-center p-8 relative overflow-hidden bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950">
                <div className="absolute top-20 left-20 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl animate-pulse delay-1000" />

                <div className="relative z-10 w-full max-w-md">
                    <OTPVerification
                        identifier={identifier}
                        type={inputType}
                        onVerify={handleVerifyOTP}
                        onBack={() => setStep('input')}
                        onResend={handleResendOTP}
                    />
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950">
            <div className="flex-1 flex items-center justify-center relative overflow-hidden p-6">
                <div className="absolute top-20 left-20 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl animate-pulse delay-1000" />

                <div className="relative w-full max-w-md z-10">
                    <Card className="shadow-2xl border border-white/10 bg-black/40 backdrop-blur-xl">
                        <CardHeader className="space-y-1 text-center">
                            <CardTitle className="text-3xl font-bold text-white">
                                Welcome Back
                            </CardTitle>
                            <CardDescription className="text-slate-400 text-base">
                                Sign in to access your trading dashboard
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Google Sign In */}
                            <Button
                                onClick={handleGoogleSignIn}
                                variant="outline"
                                className="w-full h-11 text-base hover:scale-[1.02] transition-transform bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white"
                                type="button"
                            >
                                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                Continue with Google
                            </Button>

                            <div className="relative">
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-transparent px-2 text-slate-500">
                                        Or continue with {showPassword ? 'email' : 'email/phone'}
                                    </span>
                                </div>
                            </div>

                            {/* Email/Phone Input */}
                            <div className="space-y-2">
                                <Label htmlFor="identifier" className="text-slate-300">Email or Phone Number</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                                    <Input
                                        id="identifier"
                                        type="text"
                                        placeholder="name@example.com or +1234567890"
                                        value={identifier}
                                        onChange={(e) => setIdentifier(e.target.value)}
                                        className="pl-10 h-11 bg-slate-900/50 border-white/10 text-white placeholder:text-slate-600 focus:border-emerald-500/50 focus:ring-emerald-500/20"
                                    />
                                </div>
                            </div>

                            {/* Password Field (only for email) */}
                            {showPassword && (
                                <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="password" className="text-slate-300">Password</Label>
                                        <Link
                                            href="/auth/forgot-password"
                                            className="text-sm text-emerald-400 hover:text-emerald-300 hover:underline"
                                        >
                                            Forgot password?
                                        </Link>
                                    </div>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="pl-10 h-11 bg-slate-900/50 border-white/10 text-white placeholder:text-slate-600 focus:border-emerald-500/50 focus:ring-emerald-500/20"
                                            onKeyDown={(e) => e.key === 'Enter' && handlePasswordLogin()}
                                        />
                                    </div>
                                </div>
                            )}

                            {error && (
                                <p className="text-sm text-red-400 animate-shake bg-red-500/10 p-2 rounded border border-red-500/20 text-center">{error}</p>
                            )}

                            {/* Login Buttons */}
                            {showPassword ? (
                                <div className="space-y-2">
                                    <Button
                                        onClick={handlePasswordLogin}
                                        className="w-full h-11 bg-emerald-500 hover:bg-emerald-600 text-white text-base group"
                                        disabled={isLoading || !identifier || !password}
                                    >
                                        {isLoading ? (
                                            'Signing in...'
                                        ) : (
                                            <>
                                                Sign In with Password
                                                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </Button>
                                    <Button
                                        onClick={handleSendOTP}
                                        variant="outline"
                                        className="w-full h-11 text-base bg-transparent border-white/10 text-slate-300 hover:bg-white/5 hover:text-white"
                                        disabled={isLoading || !identifier}
                                    >
                                        Or use OTP instead
                                    </Button>
                                </div>
                            ) : (
                                <Button
                                    onClick={handleSendOTP}
                                    className="w-full h-11 bg-emerald-500 hover:bg-emerald-600 text-white text-base group"
                                    disabled={isLoading || !identifier}
                                >
                                    {isLoading ? (
                                        'Sending OTP...'
                                    ) : (
                                        <>
                                            Send OTP
                                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </Button>
                            )}

                            <p className="text-center text-sm text-slate-400">
                                Don't have an account?{' '}
                                <Link href="/auth/open-account" className="text-emerald-400 font-medium hover:text-emerald-300 hover:underline">
                                    Open Account
                                </Link>
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
