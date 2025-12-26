// frontend/app/auth/forgot-password/page.tsx

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { api } from '@/lib/api'

import {useRequireGuest} from '@/contexts/AuthContext'

type Step = 'email' | 'otp' | 'password' | 'success'

export default function ForgotPasswordPage() {
  useRequireGuest()
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [resetToken, setResetToken] = useState('')
  const [step, setStep] = useState<Step>('email')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSendOTP = async () => {
    setError('')
    if (!email) {
      setError('Please enter your email')
      return
    }

    setIsLoading(true)
    try {
      const result = await api.password.forgotPassword(email)
      if (result.success) {
        setStep('otp')
      } else {
        setError(result.message || 'Failed to send OTP')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOTP = async () => {
    setError('')
    if (!otp || otp.length !== 6) {
      setError('Please enter the 6-digit OTP')
      return
    }

    setIsLoading(true)
    try {
      const result = await api.password.verifyResetOTP(email, otp)
      if (result.success && result.data?.resetToken) {
        setResetToken(result.data.resetToken)
        setStep('password')
      } else {
        setError('Invalid OTP')
      }
    } catch (err: any) {
      setError(err.message || 'Invalid or expired OTP')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async () => {
    setError('')
    
    if (!newPassword || newPassword.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setIsLoading(true)
    try {
      const result = await api.password.resetPassword(resetToken, newPassword)
      if (result.success) {
        setStep('success')
      } else {
        setError(result.message || 'Failed to reset password')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to reset password')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950">
      <div className="flex-1 flex items-center justify-center relative overflow-hidden p-6">
        {/* Background Effects */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl animate-pulse delay-1000" />

        <div className="relative w-full max-w-md z-10">
          <Card className="shadow-2xl border border-white/10 bg-black/40 backdrop-blur-xl">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-3xl font-bold text-white">
                {step === 'email' && 'Reset Password'}
                {step === 'otp' && 'Verify OTP'}
                {step === 'password' && 'New Password'}
                {step === 'success' && 'Success!'}
              </CardTitle>
              <CardDescription className="text-slate-400 text-base">
                {step === 'email' && 'Enter your email to receive a reset code'}
                {step === 'otp' && 'Enter the 6-digit code sent to your email'}
                {step === 'password' && 'Create a new secure password'}
                {step === 'success' && 'Your password has been reset'}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {error && (
                <p className="text-sm text-red-400 bg-red-500/10 p-2 rounded border border-red-500/20 text-center">
                  {error}
                </p>
              )}

              {/* Step 1: Email */}
              {step === 'email' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-300">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 h-11 bg-slate-900/50 border-white/10 text-white"
                        onKeyDown={(e) => e.key === 'Enter' && handleSendOTP()}
                      />
                    </div>
                  </div>

                  <Button
                    onClick={handleSendOTP}
                    disabled={isLoading || !email}
                    className="w-full h-11 bg-emerald-500 hover:bg-emerald-600 text-white"
                  >
                    {isLoading ? 'Sending...' : 'Send Reset Code'}
                  </Button>

                  <Link href="/auth/login">
                    <Button variant="ghost" className="w-full text-slate-400 hover:text-white">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to Login
                    </Button>
                  </Link>
                </div>
              )}

              {/* Step 2: OTP Verification */}
              {step === 'otp' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-slate-300">Enter OTP</Label>
                    <Input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="000000"
                      maxLength={6}
                      className="text-center text-2xl tracking-widest bg-slate-900/50 border-white/10 text-white"
                      onKeyDown={(e) => e.key === 'Enter' && handleVerifyOTP()}
                    />
                    <p className="text-xs text-slate-500 text-center">
                      Code sent to {email}
                    </p>
                  </div>

                  <Button
                    onClick={handleVerifyOTP}
                    disabled={isLoading || otp.length !== 6}
                    className="w-full h-11 bg-emerald-500 hover:bg-emerald-600 text-white"
                  >
                    {isLoading ? 'Verifying...' : 'Verify OTP'}
                  </Button>

                  <Button
                    onClick={handleSendOTP}
                    variant="ghost"
                    disabled={isLoading}
                    className="w-full text-slate-400 hover:text-white"
                  >
                    Resend Code
                  </Button>
                </div>
              )}

              {/* Step 3: New Password */}
              {step === 'password' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-slate-300">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="bg-slate-900/50 border-white/10 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-slate-300">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="bg-slate-900/50 border-white/10 text-white"
                      onKeyDown={(e) => e.key === 'Enter' && handleResetPassword()}
                    />
                  </div>

                  <Button
                    onClick={handleResetPassword}
                    disabled={isLoading || !newPassword || !confirmPassword}
                    className="w-full h-11 bg-emerald-500 hover:bg-emerald-600 text-white"
                  >
                    {isLoading ? 'Resetting...' : 'Reset Password'}
                  </Button>
                </div>
              )}

              {/* Step 4: Success */}
              {step === 'success' && (
                <div className="space-y-4 text-center">
                  <div className="flex justify-center">
                    <div className="h-16 w-16 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <CheckCircle className="h-8 w-8 text-emerald-500" />
                    </div>
                  </div>
                  <p className="text-slate-300">
                    Your password has been reset successfully. You can now login with your new password.
                  </p>

                  <Link href="/auth/login">
                    <Button className="w-full h-11 bg-emerald-500 hover:bg-emerald-600 text-white">
                      Go to Login
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
