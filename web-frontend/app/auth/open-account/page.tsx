'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, Upload, CheckCircle, User, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { api } from '@/lib/api'
import { useRequireGuest } from '@/contexts/AuthContext'

type Step = 'personal' | 'verify' | 'address' | 'documents' | 'avatar'

export default function OpenAccountPage() {
    useRequireGuest()
    // Personal Info
    const [fullname, setFullname] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [countryCode, setCountryCode] = useState('+91')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)

    // Verification (NO TOKEN STATE - cookies handle this)
    const [emailOtp, setEmailOtp] = useState('')
    const [phoneOtp, setPhoneOtp] = useState('')
    const [emailVerified, setEmailVerified] = useState(false)
    const [phoneVerified, setPhoneVerified] = useState(false)

    // Address
    const [address, setAddress] = useState('')
    const [address1, setAddress1] = useState('')
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [country, setCountry] = useState('')
    const [pincode, setPincode] = useState('')

    // Documents
    const [identityProofType, setIdentityProofType] = useState<'pan' | 'aadhaar'>('pan')
    const [identityFront, setIdentityFront] = useState<File | null>(null)
    const [identityBack, setIdentityBack] = useState<File | null>(null)

    const [addressProofType, setAddressProofType] = useState<'electricity' | 'driving_license' | 'aadhaar'>('electricity')
    const [addressProofFront, setAddressProofFront] = useState<File | null>(null)
    const [addressProofBack, setAddressProofBack] = useState<File | null>(null)

    const [bankProof, setBankProof] = useState<File | null>(null)
    const [selfie, setSelfie] = useState<File | null>(null)
    const [otherProof, setOtherProof] = useState<File | null>(null)

    // Avatar
    const [avatar, setAvatar] = useState<File | null>(null)
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

    // UI State
    const [step, setStep] = useState<Step>('personal')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSendOTP = async () => {
        if (!fullname || !email || !phone || !password) {
            setError('Please fill in all fields')
            return
        }

        setIsLoading(true)
        setError('')

        try {
            // Send email OTP via backend
            await api.auth.sendOTP(email)

            // Send phone OTP via backend
            const fullPhoneNumber = `${countryCode}${phone}`
            await api.auth.sendOTP(fullPhoneNumber)

            setStep('verify')
        } catch (err: any) {
            setError(err.message || 'Failed to send OTPs')
        } finally {
            setIsLoading(false)
        }
    }

    const handleVerifyEmail = async () => {
        if (!emailOtp) {
            setError('Please enter email OTP')
            return
        }
        try {
            // Backend sets cookie on successful verification
            const result = await api.auth.verifyOTP(email, emailOtp)

            if (result.success) {
                setEmailVerified(true)
                setError('')
                return true
            }

            setError('Invalid email OTP')
            return false
        } catch (err: any) {
            setError(err.message || 'Failed to verify email OTP')
            return false
        }
    }

    const handleVerifyPhone = async () => {
        if (!phoneOtp) {
            setError('Please enter phone OTP')
            return
        }
        try {
            const fullPhoneNumber = `${countryCode}${phone}`
            // Backend sets cookie on successful verification
            const result = await api.auth.verifyOTP(fullPhoneNumber, phoneOtp)

            if (result.success) {
                setPhoneVerified(true)
                setError('')
                return true
            }

            setError('Invalid phone OTP')
            return false
        } catch (err: any) {
            setError(err.message || 'Failed to verify phone OTP')
            return false
        }
    }

    const handleAddressSubmit = () => {
        if (!address || !city || !state || !country || !pincode) {
            setError('Please fill in all address fields')
            return
        }
        setStep('documents')
    }

    const handleDocumentsSubmit = () => {
        // Check identity proof
        if (!identityFront) {
            setError('Please upload Identity Proof front image')
            return
        }
        if (identityProofType === 'aadhaar' && !identityBack) {
            setError('Please upload Aadhaar Card back image')
            return
        }

        // Check address proof
        if (!addressProofFront) {
            setError('Please upload Address Proof front image')
            return
        }
        if ((addressProofType === 'aadhaar' || addressProofType === 'driving_license') && !addressProofBack) {
            setError('Please upload Address Proof back image')
            return
        }

        // Check other required documents
        if (!bankProof) {
            setError('Please upload Bank Proof')
            return
        }

        setStep('avatar')
    }

    const handleFinalSubmit = async () => {
        if (!avatar) {
            setError('Please upload a profile picture')
            return
        }
        setIsLoading(true)
        setError('')

        try {
            const formData = new FormData()
            formData.append('fullname', fullname)
            formData.append('email', email)
            formData.append('password', password)
            formData.append('mobileNumber', `${countryCode}${phone}`)

            formData.append('Address', address)
            formData.append('Address1', address1)
            formData.append('city', city)
            formData.append('state', state)
            formData.append('country', country)
            formData.append('pincode', pincode)

            // NO TOKENS - Backend reads verification cookies
            formData.append('identityProofType', identityProofType)
            formData.append('addressProofType', addressProofType)

            if (avatar) formData.append('avatar', avatar)
            if (identityFront) formData.append('IdentityFront', identityFront)
            if (identityBack) formData.append('IdentityBack', identityBack)
            if (addressProofFront) formData.append('AddressProof', addressProofFront)
            if (addressProofBack) formData.append('AddressProofBack', addressProofBack)
            if (bankProof) formData.append('BankProof', bankProof)
            if (selfie) formData.append('SelfieWithID', selfie)
            if (otherProof) formData.append('OtherProof', otherProof)

            // Backend sets auth cookie and redirects
            await api.auth.register(formData)

            // User is now logged in via cookie - redirect to dashboard
            window.location.href = '/dashboard'
        } catch (err: any) {
            setError(err.message || 'Registration failed')
        } finally {
            setIsLoading(false)
        }
    }

    const FileUpload = ({ label, file, setFile }: { label: string, file: File | null, setFile: (f: File | null) => void }) => (
        <div className="space-y-2">
            <Label className="text-slate-300">{label}</Label>
            <div className="border-2 border-dashed border-slate-700 rounded-lg p-4 hover:border-emerald-500/50 transition-colors cursor-pointer relative">
                <input
                    type="file"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    accept="image/*,.pdf"
                />
                <div className="flex items-center justify-center space-x-2 text-slate-400">
                    {file ? (
                        <>
                            <CheckCircle className="w-5 h-5 text-emerald-500" />
                            <span className="text-emerald-500">{file.name}</span>
                        </>
                    ) : (
                        <>
                            <Upload className="w-5 h-5" />
                            <span>Click to upload</span>
                        </>
                    )}
                </div>
            </div>
        </div>
    )

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950 py-4 lg:py-10">
            <div className="flex-1 flex items-center justify-center relative overflow-hidden p-4 lg:p-6">
                <div className="absolute top-20 left-20 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl animate-pulse delay-1000" />

                <div className="relative w-full max-w-2xl z-50">
                    <Card className="shadow-2xl border border-white/10 bg-black/40 backdrop-blur-xl">
                        <CardHeader className="space-y-1 text-center p-4 lg:p-6">
                            <CardTitle className="text-2xl lg:text-3xl font-bold text-white">
                                {step === 'personal' && 'Create Account'}
                                {step === 'verify' && 'Verify Contact Details'}
                                {step === 'address' && 'Address Details'}
                                {step === 'documents' && 'Upload Documents'}
                                {step === 'avatar' && 'Profile Picture'}
                            </CardTitle>
                            <CardDescription className="text-slate-400 text-sm lg:text-base">
                                Step {step === 'personal' ? 1 : step === 'verify' ? 2 : step === 'address' ? 3 : step === 'documents' ? 4 : 5} of 5
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6 p-4 lg:p-6">
                            {error && (
                                <p className="text-sm text-red-400 bg-red-500/10 p-2 rounded border border-red-500/20 text-center">{error}</p>
                            )}

                            {step === 'personal' && (
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="fullname" className="text-slate-300">Full Name</Label>
                                        <Input
                                            id="fullname"
                                            name="fullname"
                                            value={fullname}
                                            onChange={e => setFullname(e.target.value)}
                                            className="bg-slate-900/50 border-white/10 text-white focus:border-emerald-500/50 focus:ring-emerald-500/20"
                                            placeholder="Enter your full name"
                                            autoComplete="name"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="email" className="text-slate-300">Email</Label>
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                value={email}
                                                onChange={e => setEmail(e.target.value)}
                                                className="bg-slate-900/50 border-white/10 text-white focus:border-emerald-500/50 focus:ring-emerald-500/20"
                                                placeholder="Enter your email"
                                                autoComplete="email"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="phone" className="text-slate-300">Phone</Label>
                                            <div className="flex gap-2">
                                                <div className="relative w-24">
                                                    <select
                                                        value={countryCode}
                                                        onChange={(e) => setCountryCode(e.target.value)}
                                                        className="w-full h-10 bg-slate-900/50 border border-white/10 rounded-md text-white px-2 appearance-none focus:border-emerald-500/50 focus:ring-emerald-500/20 outline-none"
                                                    >
                                                        {['+1', '+44', '+91', '+61', '+81', '+86', '+49', '+33'].map(code => (
                                                            <option key={code} value={code} className="bg-slate-900 text-white">{code}</option>
                                                        ))}
                                                    </select>
                                                    <ChevronDown className="absolute right-2 top-3 h-4 w-4 text-slate-400 pointer-events-none" />
                                                </div>
                                                <Input
                                                    id="phone"
                                                    name="phone"
                                                    type="tel"
                                                    value={phone}
                                                    onChange={e => {
                                                        const val = e.target.value.replace(/[^0-9]/g, '');
                                                        setPhone(val);
                                                    }}
                                                    className="flex-1 bg-slate-900/50 border-white/10 text-white focus:border-emerald-500/50 focus:ring-emerald-500/20"
                                                    placeholder="Phone number"
                                                    autoComplete="tel"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="password" className="text-slate-300">Password</Label>
                                        <div className="relative">
                                            <Input
                                                id="password"
                                                name="password"
                                                type={showPassword ? "text" : "password"}
                                                value={password}
                                                onChange={e => setPassword(e.target.value)}
                                                className="bg-slate-900/50 border-white/10 text-white focus:border-emerald-500/50 focus:ring-emerald-500/20 pr-10"
                                                placeholder="Create a password"
                                                autoComplete="new-password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-3 text-slate-400 hover:text-white"
                                            >
                                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                    </div>
                                    <Button onClick={handleSendOTP} disabled={isLoading} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white">
                                        {isLoading ? 'Sending OTPs...' : 'Next'}
                                    </Button>
                                </div>
                            )}

                            {step === 'verify' && (
                                <div className="space-y-6">
                                    {/* Email Verification */}
                                    <div className="space-y-4">
                                        <Label className="text-slate-300">Verify Email ({email})</Label>
                                        {emailVerified ? (
                                            <div className="flex items-center text-emerald-500"><CheckCircle className="mr-2" /> Verified</div>
                                        ) : (
                                            <div className="space-y-2">
                                                <Input
                                                    type="text"
                                                    value={emailOtp}
                                                    onChange={e => setEmailOtp(e.target.value)}
                                                    placeholder="Enter 6-digit code"
                                                    className="bg-slate-900/50 border-white/10 text-white text-center text-xl lg:text-2xl tracking-widest"
                                                    maxLength={6}
                                                />
                                                <Button onClick={handleVerifyEmail} className="w-full bg-emerald-500 hover:bg-emerald-600">
                                                    Verify Email
                                                </Button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Phone Verification */}
                                    <div className="space-y-4">
                                        <Label className="text-slate-300">Verify Phone ({countryCode}{phone})</Label>
                                        {phoneVerified ? (
                                            <div className="flex items-center text-emerald-500"><CheckCircle className="mr-2" /> Verified</div>
                                        ) : (
                                            <div className="space-y-2">
                                                <Input
                                                    type="text"
                                                    value={phoneOtp}
                                                    onChange={e => setPhoneOtp(e.target.value)}
                                                    placeholder="Enter 6-digit code from SMS"
                                                    className="bg-slate-900/50 border-white/10 text-white text-center text-xl lg:text-2xl tracking-widest"
                                                    maxLength={6}
                                                />
                                                <Button onClick={handleVerifyPhone} className="w-full bg-emerald-500 hover:bg-emerald-600">
                                                    Verify Phone
                                                </Button>
                                            </div>
                                        )}
                                    </div>

                                    <Button
                                        onClick={() => setStep('address')}
                                        disabled={!emailVerified || !phoneVerified}
                                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white disabled:opacity-50"
                                    >
                                        Next
                                    </Button>
                                </div>
                            )}

                            {step === 'address' && (
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-slate-300">Address Line 1</Label>
                                        <Input value={address} onChange={e => setAddress(e.target.value)} className="bg-slate-900/50 border-white/10 text-white" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-slate-300">Address Line 2 (Optional)</Label>
                                        <Input value={address1} onChange={e => setAddress1(e.target.value)} className="bg-slate-900/50 border-white/10 text-white" />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-slate-300">City</Label>
                                            <Input value={city} onChange={e => setCity(e.target.value)} className="bg-slate-900/50 border-white/10 text-white" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-slate-300">State</Label>
                                            <Input value={state} onChange={e => setState(e.target.value)} className="bg-slate-900/50 border-white/10 text-white" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-slate-300">Country</Label>
                                            <Input value={country} onChange={e => setCountry(e.target.value)} className="bg-slate-900/50 border-white/10 text-white" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-slate-300">Pincode</Label>
                                            <Input value={pincode} onChange={e => setPincode(e.target.value)} className="bg-slate-900/50 border-white/10 text-white" />
                                        </div>
                                    </div>
                                    <Button onClick={handleAddressSubmit} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white">
                                        Next
                                    </Button>
                                </div>
                            )}

                            {step === 'documents' && (
                                <div className="space-y-6">
                                    {/* Identity Proof Section */}
                                    <div className="space-y-3">
                                        <Label className="text-slate-300 text-base font-semibold">Identity Proof (PAN Card)</Label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <FileUpload
                                                label="Front"
                                                file={identityFront}
                                                setFile={setIdentityFront}
                                            />
                                            <FileUpload
                                                label="Back"
                                                file={identityBack}
                                                setFile={setIdentityBack}
                                            />
                                        </div>
                                    </div>

                                    {/* Address Proof Section */}
                                    <div className="space-y-3">
                                        <Label className="text-slate-300 text-base font-semibold">Address Proof (Aadhaar Card)</Label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <FileUpload
                                                label="Front"
                                                file={addressProofFront}
                                                setFile={setAddressProofFront}
                                            />
                                            <FileUpload
                                                label="Back"
                                                file={addressProofBack}
                                                setFile={setAddressProofBack}
                                            />
                                        </div>
                                    </div>

                                    {/* Other Documents */}
                                    <FileUpload label="Bank Proof" file={bankProof} setFile={setBankProof} />

                                    <Button onClick={handleDocumentsSubmit} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white">
                                        Next
                                    </Button>
                                </div>
                            )}

                            {step === 'avatar' && (
                                <div className="space-y-6 text-center">
                                    <div className="flex justify-center">
                                        <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-emerald-500 bg-slate-900">
                                            {avatarPreview ? (
                                                <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                                            ) : (
                                                <User className="w-full h-full p-6 text-slate-600" />
                                            )}
                                            <input
                                                type="file"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0]
                                                    if (file) {
                                                        setAvatar(file)
                                                        setAvatarPreview(URL.createObjectURL(file))
                                                    }
                                                }}
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                                accept="image/*"
                                            />
                                        </div>
                                    </div>
                                    <p className="text-slate-400">Click to upload your profile picture</p>
                                    <Button onClick={handleFinalSubmit} disabled={isLoading} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white">
                                        {isLoading ? 'Creating Account...' : 'Create Account'}
                                    </Button>
                                </div>
                            )}

                            <p className="text-center text-sm text-slate-400">
                                Already have an account?{' '}
                                <Link href="/auth/login" className="text-emerald-400 font-medium hover:text-emerald-300 hover:underline">
                                    Login
                                </Link>
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
