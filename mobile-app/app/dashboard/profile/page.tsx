// frontend/app/dashboard/profile/page.tsx
'use client'

import { useState, useEffect } from "react"
import { useRouter } from 'next/navigation'
import { User, Mail, Phone, MapPin, Calendar, Globe, Upload, Camera, Save, X, Loader2, CheckCircle, Edit2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { api } from "@/lib/api"

interface UserProfile {
    id: string
    fullname: string
    email: string
    phone?: string
    mobileNumber?: string
    Address?: string
    Address1?: string
    city?: string
    state?: string
    country?: string
    pincode?: string
    dateOfBirth?: string
    nationality?: string
    avatar?: string
    isVerified: boolean
    isKYCCompleted: boolean
    kycStatus?: string
}

export default function ProfilePage() {
    const router = useRouter()

    // Profile data
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)

    // Form state
    const [isEditing, setIsEditing] = useState(false)
    const [fullname, setFullname] = useState("")
    const [phone, setPhone] = useState("")
    const [Address, setAddress] = useState("")
    const [Address1, setAddress1] = useState("")
    const [city, setCity] = useState("")
    const [state, setState] = useState("")
    const [country, setCountry] = useState("")
    const [pincode, setPincode] = useState("")
    const [dateOfBirth, setDateOfBirth] = useState("")
    const [nationality, setNationality] = useState("")

    // Avatar upload
    const [avatar, setAvatar] = useState<File | null>(null)
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

    // Fetch profile on mount
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true)
                const response = await api.user.getProfile()

                if (response.userProfile) {
                    const userProfile = response.userProfile
                    setProfile(userProfile)

                    // Populate form fields
                    setFullname(userProfile.fullname || "")
                    setPhone(userProfile.phone || userProfile.mobileNumber || "")
                    setAddress(userProfile.Address || "")
                    setAddress1(userProfile.Address1 || "")
                    setCity(userProfile.city || "")
                    setState(userProfile.state || "")
                    setCountry(userProfile.country || "")
                    setPincode(userProfile.pincode || "")
                    setDateOfBirth(userProfile.dateOfBirth || "")
                    setNationality(userProfile.nationality || "")
                    setAvatarPreview(userProfile.avatar || null)
                }
            } catch (err: any) {
                console.error('Error fetching profile:', err)
                setError(err.message || 'Failed to load profile')
            } finally {
                setLoading(false)
            }
        }

        fetchProfile()
    }, [])

    // Handle avatar upload
    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setAvatar(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    // Handle save profile
    const handleSaveProfile = async () => {
        try {
            setSaving(true)
            setError(null)
            setSuccessMessage(null)

            const updateData: any = {
                fullname,
                phone,
                Address,
                Address1,
                city,
                state,
                country,
                pincode,
                dateOfBirth,
                nationality
            }

            await api.user.updateProfile(updateData)

            setSuccessMessage("Profile updated successfully!")
            setIsEditing(false)

            // Refresh profile
            const response = await api.user.getProfile()
            if (response.userProfile) {
                setProfile(response.userProfile)
            }

            // Clear success message after 3 seconds
            setTimeout(() => setSuccessMessage(null), 3000)
        } catch (err: any) {
            console.error('Error updating profile:', err)
            setError(err.message || 'Failed to update profile')
        } finally {
            setSaving(false)
        }
    }

    // Handle cancel editing
    const handleCancelEdit = () => {
        if (profile) {
            setFullname(profile.fullname || "")
            setPhone(profile.phone || profile.mobileNumber || "")
            setAddress(profile.Address || "")
            setAddress1(profile.Address1 || "")
            setCity(profile.city || "")
            setState(profile.state || "")
            setCountry(profile.country || "")
            setPincode(profile.pincode || "")
            setDateOfBirth(profile.dateOfBirth || "")
            setNationality(profile.nationality || "")
            setAvatarPreview(profile.avatar || null)
            setAvatar(null)
        }
        setIsEditing(false)
        setError(null)
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950 flex items-center justify-center">
                <div className="flex items-center gap-2 text-white">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span>Loading profile...</span>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950 text-white">
            <div className="max-w-5xl mx-auto p-6">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <h1 className="text-3xl font-bold text-white">Profile Settings</h1>
                            <p className="text-slate-400 mt-1">Manage your personal information and account details</p>
                        </div>
                        {!isEditing ? (
                            <Button
                                onClick={() => setIsEditing(true)}
                                className="bg-emerald-500 hover:bg-emerald-600 text-white"
                            >
                                <Edit2 className="w-4 h-4 mr-2" />
                                Edit Profile
                            </Button>
                        ) : (
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    onClick={handleCancelEdit}
                                    className="border-white/10 text-slate-400 hover:text-white"
                                >
                                    <X className="w-4 h-4 mr-2" />
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSaveProfile}
                                    disabled={saving}
                                    className="bg-emerald-500 hover:bg-emerald-600 text-white"
                                >
                                    {saving ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4 mr-2" />
                                            Save Changes
                                        </>
                                    )}
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Status Messages */}
                    {error && (
                        <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded flex items-center gap-2 text-red-400 text-sm">
                            <X className="w-4 h-4" />
                            {error}
                        </div>
                    )}

                    {successMessage && (
                        <div className="mt-4 p-3 bg-emerald-500/20 border border-emerald-500/50 rounded flex items-center gap-2 text-emerald-400 text-sm">
                            <CheckCircle className="w-4 h-4" />
                            {successMessage}
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Avatar & Status */}
                    <div className="space-y-6">
                        {/* Avatar Card */}
                        <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/30 backdrop-blur-sm border border-white/10">
                            <CardHeader>
                                <CardTitle className="text-white">Profile Picture</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col items-center space-y-4">
                                <div className="relative">
                                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-emerald-500/50 bg-slate-900">
                                        {avatarPreview ? (
                                            <img src={avatarPreview} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <User className="w-16 h-16 text-slate-600" />
                                            </div>
                                        )}
                                    </div>
                                    {isEditing && (
                                        <label className="absolute bottom-0 right-0 bg-emerald-500 p-2 rounded-full cursor-pointer hover:bg-emerald-600 transition">
                                            <Camera className="w-4 h-4 text-white" />
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleAvatarChange}
                                            />
                                        </label>
                                    )}
                                </div>
                                <div className="text-center">
                                    <h3 className="text-lg font-bold text-white">{profile?.fullname}</h3>
                                    <p className="text-sm text-slate-400">{profile?.email}</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Verification Status Card */}
                        <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/30 backdrop-blur-sm border border-white/10">
                            <CardHeader>
                                <CardTitle className="text-white">Verification Status</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-400">Email</span>
                                    {profile?.isVerified ? (
                                        <Badge className="bg-emerald-500/20 text-emerald-400">Verified</Badge>
                                    ) : (
                                        <Badge className="bg-amber-500/20 text-amber-400">Pending</Badge>
                                    )}
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-400">KYC Status</span>
                                    {profile?.isKYCCompleted ? (
                                        <Badge className="bg-emerald-500/20 text-emerald-400">Completed</Badge>
                                    ) : (
                                        <Badge className="bg-amber-500/20 text-amber-400">
                                            {profile?.kycStatus || 'Pending'}
                                        </Badge>
                                    )}
                                </div>
                                {!profile?.isKYCCompleted && (
                                    <Button
                                        onClick={() => router.push('/dashboard/verification')}
                                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white mt-4"
                                        size="sm"
                                    >
                                        Complete KYC
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Profile Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Personal Information */}
                        <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/30 backdrop-blur-sm border border-white/10">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <User className="w-5 h-5 text-emerald-500" />
                                    Personal Information
                                </CardTitle>
                                <CardDescription className="text-slate-400">
                                    Update your basic personal details
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-slate-300">Full Name</Label>
                                        <Input
                                            value={fullname}
                                            onChange={(e) => setFullname(e.target.value)}
                                            disabled={!isEditing}
                                            className="bg-slate-900/50 border-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                            placeholder="John Doe"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-slate-300">Email</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                                            <Input
                                                value={profile?.email}
                                                disabled
                                                className="bg-slate-900/50 border-white/10 text-slate-500 pl-10 cursor-not-allowed"
                                            />
                                        </div>
                                        <p className="text-xs text-slate-500">Email cannot be changed</p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-slate-300">Phone Number</Label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                                            <Input
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                disabled={!isEditing}
                                                className="bg-slate-900/50 border-white/10 text-white pl-10 disabled:opacity-50 disabled:cursor-not-allowed"
                                                placeholder="+1 555 000-0000"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-slate-300">Date of Birth</Label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                                            <Input
                                                type="date"
                                                value={dateOfBirth}
                                                onChange={(e) => setDateOfBirth(e.target.value)}
                                                disabled={!isEditing}
                                                className="bg-slate-900/50 border-white/10 text-white pl-10 disabled:opacity-50 disabled:cursor-not-allowed"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-slate-300">Nationality</Label>
                                        <div className="relative">
                                            <Globe className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                                            <Input
                                                value={nationality}
                                                onChange={(e) => setNationality(e.target.value)}
                                                disabled={!isEditing}
                                                className="bg-slate-900/50 border-white/10 text-white pl-10 disabled:opacity-50 disabled:cursor-not-allowed"
                                                placeholder="United States"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Address Information */}
                        <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/30 backdrop-blur-sm border border-white/10">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-emerald-500" />
                                    Address Information
                                </CardTitle>
                                <CardDescription className="text-slate-400">
                                    Update your residential address
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-slate-300">Address Line 1</Label>
                                    <Input
                                        value={Address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        disabled={!isEditing}
                                        className="bg-slate-900/50 border-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                        placeholder="123 Main Street"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-slate-300">Address Line 2 (Optional)</Label>
                                    <Input
                                        value={Address1}
                                        onChange={(e) => setAddress1(e.target.value)}
                                        disabled={!isEditing}
                                        className="bg-slate-900/50 border-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                        placeholder="Apartment, suite, etc."
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-slate-300">City</Label>
                                        <Input
                                            value={city}
                                            onChange={(e) => setCity(e.target.value)}
                                            disabled={!isEditing}
                                            className="bg-slate-900/50 border-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                            placeholder="New York"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-slate-300">State/Province</Label>
                                        <Input
                                            value={state}
                                            onChange={(e) => setState(e.target.value)}
                                            disabled={!isEditing}
                                            className="bg-slate-900/50 border-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                            placeholder="NY"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-slate-300">Country</Label>
                                        <Input
                                            value={country}
                                            onChange={(e) => setCountry(e.target.value)}
                                            disabled={!isEditing}
                                            className="bg-slate-900/50 border-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                            placeholder="United States"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-slate-300">Postal/ZIP Code</Label>
                                        <Input
                                            value={pincode}
                                            onChange={(e) => setPincode(e.target.value)}
                                            disabled={!isEditing}
                                            className="bg-slate-900/50 border-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                            placeholder="10001"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/30 backdrop-blur-sm border border-white/10">
                            <CardHeader>
                                <CardTitle className="text-white">Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <Button
                                    variant="outline"
                                    onClick={() => router.push('/dashboard/settings')}
                                    className="border-white/10 text-slate-300 hover:text-white hover:bg-white/5"
                                >
                                    Security Settings
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => router.push('/dashboard/wallet')}
                                    className="border-white/10 text-slate-300 hover:text-white hover:bg-white/5"
                                >
                                    Manage Bank Accounts
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
