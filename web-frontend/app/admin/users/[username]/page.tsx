// frontend/app/admin/users/[username]/page.tsx

'use client'

import React, { useState, useEffect, ChangeEvent, SyntheticEvent } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
    ArrowLeft,
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    DollarSign,
    TrendingUp,
    Activity,
    FileText,
    Shield,
    Ban,
    CheckCircle,
    Loader2,
    Download,
    Eye,
    CreditCard
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'
import { api } from '@/lib/api'

interface UserDetails {
    _id: string
    fullname: string
    email: string
    phone?: string
    mobileNumber: string
    accountStatus: string
    kycStatus: string
    isVerified: boolean
    isKYCCompleted: boolean
    role: string
    leverage_type: string

    // Address
    Address: string
    Address1?: string
    city: string
    state: string
    country: string
    pincode: string

    // Personal Info
    dateOfBirth?: string
    nationality?: string

    // Account Balance
    Account_Balance?: {
        totalBalance: number
        availableBalance: number
        lockedBalance: number
        totalDeposited: number
        totalWithdrawn: number
        totalProfit: number
        totalLoss: number
        currency: string
    }

    // Documents
    documents?: {
        AddressProof?: string
        BankProof?: string
        OtherProof?: string
        IdentityFront?: string
        IdentityBack?: string
        SelfieWithID?: string
    }

    // Timestamps
    createdAt: string
    lastActive?: string
    kycSubmittedAt?: string
    kycApprovedAt?: string
    kycRejectionReason?: string
}

interface Transaction {
    _id: string
    type: string
    amount: number
    currency: string
    status: string
    createdAt: string
    description?: string
}

export default function UserDetailPage() {
    const params = useParams()
    const router = useRouter()
    const username = params.username as string

    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState<UserDetails | null>(null)
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [error, setError] = useState<string | null>(null)

    // Modal states
    const [isAddBalanceModalOpen, setIsAddBalanceModalOpen] = useState(false)
    const [isKYCModalOpen, setIsKYCModalOpen] = useState(false)
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false)
    const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false)
    const [selectedDocument, setSelectedDocument] = useState<string | null>(null)
    const [actionLoading, setActionLoading] = useState(false)

    // Form states
    const [balanceAmount, setBalanceAmount] = useState('')
    const [balanceNote, setBalanceNote] = useState('')
    const [kycStatus, setKycStatus] = useState('')
    const [kycReason, setKycReason] = useState('')
    const [accountStatus, setAccountStatus] = useState('')
    const [statusReason, setStatusReason] = useState('')

    useEffect(() => {
        if (username) {
            fetchUserDetails()
        }
    }, [username])

    const fetchUserDetails = async () => {
        try {
            setLoading(true)

            // First, get all users and find by username
            const usersResponse = await api.admin.getAllUsers({
                page: 1,
                limit: 100,
                search: decodeURIComponent(username)
            })

            if (usersResponse.success && usersResponse.data.users.length > 0) {
                // Find user by email username match
                const foundUser = usersResponse.data.users.find((u: any) =>
                    u.email.split('@')[0].toLowerCase() === decodeURIComponent(username).toLowerCase()
                )

                if (!foundUser) {
                    setError('User not found')
                    return
                }

                // Get full user details
                const detailResponse = await api.admin.getUserDetails(foundUser._id)

                if (detailResponse.success) {
                    setUser(detailResponse.data.user)
                    setTransactions(detailResponse.data.transactions || [])
                    setKycStatus(detailResponse.data.user.kycStatus)
                    setAccountStatus(detailResponse.data.user.accountStatus)
                }
            } else {
                setError('User not found')
            }
        } catch (err: any) {
            console.error('Error fetching user details:', err)
            setError(err.message || 'Failed to load user details')
        } finally {
            setLoading(false)
        }
    }

    const handleAddBalance = async () => {
        if (!user || !balanceAmount || parseFloat(balanceAmount) <= 0) {
            alert('Please enter a valid amount')
            return
        }

        try {
            setActionLoading(true)
            const response = await api.admin.addBalance(
                user._id,
                parseFloat(balanceAmount),
                balanceNote
            )

            if (response.success) {
                alert('Balance added successfully!')
                setIsAddBalanceModalOpen(false)
                setBalanceAmount('')
                setBalanceNote('')
                fetchUserDetails()
            }
        } catch (err: any) {
            console.error('Error adding balance:', err)
            alert(err.message || 'Failed to add balance')
        } finally {
            setActionLoading(false)
        }
    }

    const handleUpdateKYC = async () => {
        if (!user || !kycStatus) return

        try {
            setActionLoading(true)
            const response = await api.admin.updateKYCStatus(
                user._id,
                kycStatus,
                kycReason
            )

            if (response.success) {
                alert('KYC status updated successfully!')
                setIsKYCModalOpen(false)
                setKycReason('')
                fetchUserDetails()
            }
        } catch (err: any) {
            console.error('Error updating KYC:', err)
            alert(err.message || 'Failed to update KYC status')
        } finally {
            setActionLoading(false)
        }
    }

    const handleUpdateStatus = async () => {
        if (!user || !accountStatus) return

        try {
            setActionLoading(true)
            const response = await api.admin.updateUserStatus(
                user._id,
                accountStatus,
                statusReason
            )

            if (response.success) {
                alert('Account status updated successfully!')
                setIsStatusModalOpen(false)
                setStatusReason('')
                fetchUserDetails()
            }
        } catch (err: any) {
            console.error('Error updating status:', err)
            alert(err.message || 'Failed to update account status')
        } finally {
            setActionLoading(false)
        }
    }

    const viewDocument = (url: string) => {
        setSelectedDocument(url)
        setIsDocumentModalOpen(true)
    }

    const getStatusBadge = (status: string) => {
        const config: any = {
            active: { color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400', label: 'Active' },
            pending: { color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400', label: 'Pending' },
            suspended: { color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400', label: 'Suspended' },
            inactive: { color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400', label: 'Inactive' },
            approved: { color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400', label: 'Approved' },
            rejected: { color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400', label: 'Rejected' },
            not_started: { color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400', label: 'Not Started' }
        }

        const cfg = config[status] || config.pending

        return (
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${cfg.color}`}>
                {cfg.label}
            </span>
        )
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
        )
    }

    if (error || !user) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-500 mb-4">{error || 'User not found'}</p>
                    <Button onClick={() => router.push('/admin/users')}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Users
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
            <div className="p-6 lg:p-8 max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <Button
                        variant="ghost"
                        onClick={() => router.push('/admin/users')}
                        className="mb-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Users
                    </Button>

                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                {user.fullname}
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                User ID: {user._id.slice(-8)} • Joined {new Date(user.createdAt).toLocaleDateString()}
                            </p>
                        </div>

                        <div className="flex gap-2">
                            {getStatusBadge(user.accountStatus)}
                            {getStatusBadge(user.kycStatus)}
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
                    <Button
                        onClick={() => setIsAddBalanceModalOpen(true)}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white"
                    >
                        <DollarSign className="h-4 w-4 mr-2" />
                        Add Balance
                    </Button>
                    <Button
                        onClick={() => setIsKYCModalOpen(true)}
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                    >
                        <Shield className="h-4 w-4 mr-2" />
                        Update KYC
                    </Button>
                    <Button
                        onClick={() => setIsStatusModalOpen(true)}
                        className="bg-amber-500 hover:bg-amber-600 text-white"
                    >
                        <Activity className="h-4 w-4 mr-2" />
                        Update Status
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => {
                            if (user.accountStatus === 'suspended') {
                                handleUpdateStatus()
                            } else {
                                setAccountStatus('suspended')
                                setIsStatusModalOpen(true)
                            }
                        }}
                        className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20"
                    >
                        <Ban className="h-4 w-4 mr-2" />
                        {user.accountStatus === 'suspended' ? 'Unsuspend' : 'Suspend'}
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Account Balance */}
                        <Card className="bg-white dark:bg-slate-900 border-gray-200 dark:border-gray-800">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <DollarSign className="h-5 w-5 text-emerald-500" />
                                    Account Balance
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Balance</p>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                            ${user.Account_Balance?.totalBalance?.toFixed(2) || '0.00'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Available</p>
                                        <p className="text-xl font-semibold text-emerald-600 dark:text-emerald-400">
                                            ${user.Account_Balance?.availableBalance?.toFixed(2) || '0.00'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Deposited</p>
                                        <p className="text-xl font-semibold text-blue-600 dark:text-blue-400">
                                            ${user.Account_Balance?.totalDeposited?.toFixed(2) || '0.00'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Profit</p>
                                        <p className="text-xl font-semibold text-green-600 dark:text-green-400">
                                            ${user.Account_Balance?.totalProfit?.toFixed(2) || '0.00'}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Personal Information */}
                        <Card className="bg-white dark:bg-slate-900 border-gray-200 dark:border-gray-800">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <User className="h-5 w-5 text-blue-500" />
                                    Personal Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-start gap-3">
                                        <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">{user.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Mobile Number</p>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">{user.mobileNumber}</p>
                                        </div>
                                    </div>
                                    {user.dateOfBirth && (
                                        <div className="flex items-start gap-3">
                                            <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                                            <div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">Date of Birth</p>
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {new Date(user.dateOfBirth).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                    {user.nationality && (
                                        <div className="flex items-start gap-3">
                                            <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                                            <div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">Nationality</p>
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">{user.nationality}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Address Information */}
                        <Card className="bg-white dark:bg-slate-900 border-gray-200 dark:border-gray-800">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <MapPin className="h-5 w-5 text-purple-500" />
                                    Address Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <p className="text-sm text-gray-900 dark:text-white">{user.Address}</p>
                                    {user.Address1 && <p className="text-sm text-gray-900 dark:text-white">{user.Address1}</p>}
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {user.city}, {user.state} {user.pincode}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{user.country}</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* KYC Documents */}
                        {user.documents && (
                            <Card className="bg-white dark:bg-slate-900 border-gray-200 dark:border-gray-800">
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <FileText className="h-5 w-5 text-orange-500" />
                                        KYC Documents
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {user.documents.IdentityFront && (
                                            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Identity Front</p>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => viewDocument(user.documents!.IdentityFront!)}
                                                    className="w-full"
                                                >
                                                    <Eye className="h-3 w-3 mr-1" />
                                                    View
                                                </Button>
                                            </div>
                                        )}
                                        {user.documents.IdentityBack && (
                                            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Identity Back</p>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => viewDocument(user.documents!.IdentityBack!)}
                                                    className="w-full"
                                                >
                                                    <Eye className="h-3 w-3 mr-1" />
                                                    View
                                                </Button>
                                            </div>
                                        )}
                                        {user.documents.AddressProof && (
                                            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Address Proof</p>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => viewDocument(user.documents!.AddressProof!)}
                                                    className="w-full"
                                                >
                                                    <Eye className="h-3 w-3 mr-1" />
                                                    View
                                                </Button>
                                            </div>
                                        )}
                                        {user.documents.BankProof && (
                                            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Bank Proof</p>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => viewDocument(user.documents!.BankProof!)}
                                                    className="w-full"
                                                >
                                                    <Eye className="h-3 w-3 mr-1" />
                                                    View
                                                </Button>
                                            </div>
                                        )}
                                        {user.documents.SelfieWithID && (
                                            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Selfie with ID</p>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => viewDocument(user.documents!.SelfieWithID!)}
                                                    className="w-full"
                                                >
                                                    <Eye className="h-3 w-3 mr-1" />
                                                    View
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Recent Transactions */}
                        <Card className="bg-white dark:bg-slate-900 border-gray-200 dark:border-gray-800">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Activity className="h-5 w-5 text-green-500" />
                                    Recent Transactions
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {transactions.length > 0 ? (
                                    <div className="space-y-3">
                                        {transactions.slice(0, 10).map((tx) => (
                                            <div key={tx._id} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                                                        {tx.type}
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        {new Date(tx.createdAt).toLocaleString()}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className={`text-sm font-semibold ${tx.type === 'deposit' || tx.type === 'profit'
                                                        ? 'text-green-600 dark:text-green-400'
                                                        : 'text-red-600 dark:text-red-400'
                                                        }`}>
                                                        {tx.type === 'deposit' || tx.type === 'profit' ? '+' : '-'}
                                                        ${tx.amount.toFixed(2)}
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                                                        {tx.status}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                                        No transactions yet
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Account Details */}
                    <div className="space-y-6">
                        {/* Account Stats */}
                        <Card className="bg-white dark:bg-slate-900 border-gray-200 dark:border-gray-800">
                            <CardHeader>
                                <CardTitle className="text-lg">Account Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Account Status</p>
                                    {getStatusBadge(user.accountStatus)}
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">KYC Status</p>
                                    {getStatusBadge(user.kycStatus)}
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Verified</p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        {user.isVerified ? 'Yes' : 'No'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Role</p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                                        {user.role}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Leverage</p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        {user.leverage_type}
                                    </p>
                                </div>
                                {user.lastActive && (
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Last Active</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {new Date(user.lastActive).toLocaleString()}
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* KYC Timeline */}
                        {user.kycSubmittedAt && (
                            <Card className="bg-white dark:bg-slate-900 border-gray-200 dark:border-gray-800">
                                <CardHeader>
                                    <CardTitle className="text-lg">KYC Timeline</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {user.kycSubmittedAt && (
                                        <div className="flex items-start gap-2">
                                            <div className="mt-1 h-2 w-2 rounded-full bg-blue-500" />
                                            <div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">Submitted</p>
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {new Date(user.kycSubmittedAt).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                    {user.kycApprovedAt && (
                                        <div className="flex items-start gap-2">
                                            <div className="mt-1 h-2 w-2 rounded-full bg-green-500" />
                                            <div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">Approved</p>
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {new Date(user.kycApprovedAt).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                    {user.kycRejectionReason && (
                                        <div className="flex items-start gap-2">
                                            <div className="mt-1 h-2 w-2 rounded-full bg-red-500" />
                                            <div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">Rejection Reason</p>
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {user.kycRejectionReason}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>

            {/* Add Balance Modal */}
            <Modal
                isOpen={isAddBalanceModalOpen}
                onClose={() => {
                    setIsAddBalanceModalOpen(false)
                    setBalanceAmount('')
                    setBalanceNote('')
                }}
                title="Add Balance"
            >
                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-medium text-gray-700 dark:text-gray-300 block mb-2">
                            Amount ($)
                        </label>
                        <Input
                            type="number"
                            value={balanceAmount}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setBalanceAmount(e.target.value)}
                            placeholder="Enter amount"
                            min="0"
                            step="0.01"
                            className="bg-gray-50 dark:bg-slate-800"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-medium text-gray-700 dark:text-gray-300 block mb-2">
                            Note (Optional)
                        </label>
                        <textarea
                            value={balanceNote}
                            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setBalanceNote(e.target.value)}
                            placeholder="Add a note..."
                            rows={3}
                            className="w-full px-4 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white"
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button
                            variant="ghost"
                            onClick={() => setIsAddBalanceModalOpen(false)}
                            disabled={actionLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleAddBalance}
                            disabled={actionLoading || !balanceAmount || parseFloat(balanceAmount) <= 0}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white"
                        >
                            {actionLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Adding...
                                </>
                            ) : 'Add Balance'}
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Update KYC Modal */}
            <Modal
                isOpen={isKYCModalOpen}
                onClose={() => {
                    setIsKYCModalOpen(false)
                    setKycReason('')
                }}
                title="Update KYC Status"
            >
                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-medium text-gray-700 dark:text-gray-300 block mb-2">
                            KYC Status
                        </label>
                        <select
                            value={kycStatus}
                            onChange={(e: ChangeEvent<HTMLSelectElement>) => setKycStatus(e.target.value)}
                            className="w-full px-4 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white"
                        >
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-xs font-medium text-gray-700 dark:text-gray-300 block mb-2">
                            Reason (Optional)
                        </label>
                        <textarea
                            value={kycReason}
                            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setKycReason(e.target.value)}
                            placeholder="Enter reason..."
                            rows={3}
                            className="w-full px-4 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white"
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button
                            variant="ghost"
                            onClick={() => setIsKYCModalOpen(false)}
                            disabled={actionLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleUpdateKYC}
                            disabled={actionLoading || !kycStatus}
                            className="bg-blue-500 hover:bg-blue-600 text-white"
                        >
                            {actionLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Updating...
                                </>
                            ) : 'Update KYC'}
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Update Status Modal */}
            <Modal
                isOpen={isStatusModalOpen}
                onClose={() => {
                    setIsStatusModalOpen(false)
                    setStatusReason('')
                }}
                title="Update Account Status"
            >
                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-medium text-gray-700 dark:text-gray-300 block mb-2">
                            Account Status
                        </label>
                        <select
                            value={accountStatus}
                            onChange={(e: ChangeEvent<HTMLSelectElement>) => setAccountStatus(e.target.value)}
                            className="w-full px-4 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white"
                        >
                            <option value="active">Active</option>
                            <option value="suspended">Suspended</option>
                            <option value="inactive">Inactive</option>
                            <option value="pending">Pending</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-xs font-medium text-gray-700 dark:text-gray-300 block mb-2">
                            Reason (Optional)
                        </label>
                        <textarea
                            value={statusReason}
                            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setStatusReason(e.target.value)}
                            placeholder="Enter reason..."
                            rows={3}
                            className="w-full px-4 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white"
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button
                            variant="ghost"
                            onClick={() => setIsStatusModalOpen(false)}
                            disabled={actionLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleUpdateStatus}
                            disabled={actionLoading || !accountStatus}
                            className="bg-amber-500 hover:bg-amber-600 text-white"
                        >
                            {actionLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Updating...
                                </>
                            ) : 'Update Status'}
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Document View Modal */}
            <Modal
                isOpen={isDocumentModalOpen}
                onClose={() => {
                    setIsDocumentModalOpen(false)
                    setSelectedDocument(null)
                }}
                title="Document View"
            >
                <div className="space-y-4">
                    {selectedDocument && (
                        <div className="relative">
                            <img
                                src={selectedDocument}
                                alt="Document"
                                className="w-full h-auto rounded-lg border border-gray-200 dark:border-gray-700"
                                onError={(e: SyntheticEvent<HTMLImageElement, Event>) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = '/placeholder-image.png';
                                }}
                            />
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(selectedDocument, '_blank')}
                                className="mt-3 w-full"
                            >
                                <Download className="h-4 w-4 mr-2" />
                                Download
                            </Button>
                        </div>
                    )}

                    <div className="flex justify-end pt-2">
                        <Button
                            variant="ghost"
                            onClick={() => setIsDocumentModalOpen(false)}
                        >
                            Close
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}
