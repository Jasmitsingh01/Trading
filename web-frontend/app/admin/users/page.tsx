// frontend/app/admin/users/page.tsx

'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, Eye, CheckCircle, XCircle, Loader2, AlertCircle, Ban } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'
import { api } from '@/lib/api'
import { useRouter } from 'next/navigation'

interface User {
    _id: string
    fullname: string
    email: string
    mobileNumber: string
    accountStatus: string
    kycStatus: string
    isVerified: boolean
    createdAt: string
    Account_Balance?: {
        totalBalance: number
    }
}

export default function AdminUsers() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [users, setUsers] = useState<User[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('')
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [error, setError] = useState<string | null>(null)

    // Modal states
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false)
    const [isKYCModalOpen, setIsKYCModalOpen] = useState(false)
    const [actionLoading, setActionLoading] = useState(false)
    const [statusReason, setStatusReason] = useState('')
    const [newStatus, setNewStatus] = useState('')
    const [newKYCStatus, setNewKYCStatus] = useState('')

    useEffect(() => {
        fetchUsers()
    }, [page, searchTerm, statusFilter])

    const fetchUsers = async () => {
        try {
            setLoading(true)
            const response = await api.admin.getAllUsers({
                page,
                limit: 20,
                search: searchTerm,
                status: statusFilter
            })

            if (response.success) {
                setUsers(response.data.users)
                setTotalPages(response.data.pagination.totalPages)
            }
        } catch (err: any) {
            console.error('Error fetching users:', err)
            setError(err.message || 'Failed to load users')

            if (err.message?.includes('Unauthorized') || err.message?.includes('Forbidden')) {
                router.push('/auth/login')
            }
        } finally {
            setLoading(false)
        }
    }

    const handleUpdateStatus = async () => {
        if (!selectedUser || !newStatus) return

        try {
            setActionLoading(true)
            const response = await api.admin.updateUserStatus(
                selectedUser._id,
                newStatus,
                statusReason
            )

            if (response.success) {
                alert('User status updated successfully!')
                setIsStatusModalOpen(false)
                setStatusReason('')
                fetchUsers()
            }
        } catch (err: any) {
            console.error('Error updating status:', err)
            alert(err.message || 'Failed to update user status')
        } finally {
            setActionLoading(false)
        }
    }

    const handleUpdateKYC = async () => {
        if (!selectedUser || !newKYCStatus) return

        try {
            setActionLoading(true)
            const response = await api.admin.updateKYCStatus(
                selectedUser._id,
                newKYCStatus,
                statusReason
            )

            if (response.success) {
                alert('KYC status updated successfully!')
                setIsKYCModalOpen(false)
                setStatusReason('')
                fetchUsers()
            }
        } catch (err: any) {
            console.error('Error updating KYC:', err)
            alert(err.message || 'Failed to update KYC status')
        } finally {
            setActionLoading(false)
        }
    }

    const getStatusBadge = (status: string) => {
        const config: any = {
            active: { color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400', label: 'Active' },
            pending: { color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400', label: 'Pending' },
            suspended: { color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400', label: 'Suspended' },
            inactive: { color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400', label: 'Inactive' }
        }

        const cfg = config[status] || config.pending

        return (
            <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${cfg.color}`}>
                {cfg.label}
            </span>
        )
    }

    const getKYCBadge = (status: string) => {
        const config: any = {
            approved: { color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400', label: 'Approved' },
            pending: { color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400', label: 'Pending' },
            rejected: { color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400', label: 'Rejected' },
            'not-started': { color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400', label: 'Not Started' }
        }

        const cfg = config[status] || config.pending

        return (
            <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${cfg.color}`}>
                {cfg.label}
            </span>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
            <div className="p-6 lg:p-8 max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Users Management
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Manage user accounts, KYC verification, and account status
                    </p>
                </div>

                {/* Filters */}
                <Card className="bg-white dark:bg-slate-900 border-gray-200 dark:border-gray-800 mb-6">
                    <CardContent className="pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    type="text"
                                    placeholder="Search by name, email, phone..."
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value)
                                        setPage(1)
                                    }}
                                    className="pl-10 bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-gray-700"
                                />
                            </div>

                            {/* Status Filter */}
                            <select
                                value={statusFilter}
                                onChange={(e) => {
                                    setStatusFilter(e.target.value)
                                    setPage(1)
                                }}
                                className="px-4 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white text-sm"
                            >
                                <option value="">All Status</option>
                                <option value="active">Active</option>
                                <option value="pending">Pending</option>
                                <option value="suspended">Suspended</option>
                                <option value="inactive">Inactive</option>
                            </select>

                            {/* Results count */}
                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                <Filter className="h-4 w-4 mr-2" />
                                Showing {users.length} users
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Users Table */}
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                    </div>
                ) : error ? (
                    <div className="flex items-center justify-center py-12 text-red-500">
                        <AlertCircle className="w-6 h-6 mr-2" />
                        {error}
                    </div>
                ) : (
                    <Card className="bg-white dark:bg-slate-900 border-gray-200 dark:border-gray-800">
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 dark:bg-slate-800">
                                        <tr>
                                            <th className="text-left py-3 px-4 text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">User</th>
                                            <th className="text-left py-3 px-4 text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">Contact</th>
                                            <th className="text-center py-3 px-4 text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">Status</th>
                                            <th className="text-center py-3 px-4 text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">KYC</th>
                                            <th className="text-right py-3 px-4 text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">Balance</th>
                                            <th className="text-center py-3 px-4 text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((user) => (
                                            <tr key={user._id} className="border-t border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-slate-800/50">
                                                <td className="py-4 px-4">
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                            {user.fullname}
                                                        </div>
                                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                                            Joined {new Date(user.createdAt).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="text-sm text-gray-900 dark:text-white">
                                                        {user.email}
                                                    </div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                                        {user.mobileNumber}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4 text-center">
                                                    {getStatusBadge(user.accountStatus)}
                                                </td>
                                                <td className="py-4 px-4 text-center">
                                                    {getKYCBadge(user.kycStatus)}
                                                </td>
                                                <td className="py-4 px-4 text-right">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                        ${user.Account_Balance?.totalBalance?.toFixed(2) || '0.00'}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => router.push(`/admin/users/${user._id}`)}
                                                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => {
                                                                setSelectedUser(user)
                                                                setNewKYCStatus(user.kycStatus)
                                                                setIsKYCModalOpen(true)
                                                            }}
                                                            className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                                                        >
                                                            <CheckCircle className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => {
                                                                setSelectedUser(user)
                                                                setNewStatus(user.accountStatus)
                                                                setIsStatusModalOpen(true)
                                                            }}
                                                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                        >
                                                            <Ban className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-800">
                                    <Button
                                        variant="outline"
                                        onClick={() => setPage(page - 1)}
                                        disabled={page === 1}
                                        className="text-gray-900 dark:text-white"
                                    >
                                        Previous
                                    </Button>
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        Page {page} of {totalPages}
                                    </span>
                                    <Button
                                        variant="outline"
                                        onClick={() => setPage(page + 1)}
                                        disabled={page === totalPages}
                                        className="text-gray-900 dark:text-white"
                                    >
                                        Next
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>

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
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            Update status for <strong>{selectedUser?.fullname}</strong>
                        </p>

                        <label className="text-xs font-medium text-gray-700 dark:text-gray-300 block mb-2">
                            New Status
                        </label>
                        <select
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
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
                            onChange={(e) => setStatusReason(e.target.value)}
                            placeholder="Enter reason for status change..."
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
                            disabled={actionLoading || !newStatus}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white"
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

            {/* Update KYC Modal */}
            <Modal
                isOpen={isKYCModalOpen}
                onClose={() => {
                    setIsKYCModalOpen(false)
                    setStatusReason('')
                }}
                title="Update KYC Status"
            >
                <div className="space-y-4">
                    <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            Update KYC status for <strong>{selectedUser?.fullname}</strong>
                        </p>

                        <label className="text-xs font-medium text-gray-700 dark:text-gray-300 block mb-2">
                            New KYC Status
                        </label>
                        <select
                            value={newKYCStatus}
                            onChange={(e) => setNewKYCStatus(e.target.value)}
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
                            value={statusReason}
                            onChange={(e) => setStatusReason(e.target.value)}
                            placeholder="Enter reason for KYC decision..."
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
                            disabled={actionLoading || !newKYCStatus}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white"
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
        </div>
    )
}
