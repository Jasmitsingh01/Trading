// frontend/app/admin/transactions/page.tsx

'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, CheckCircle, XCircle, Loader2, AlertCircle, Calendar, Eye, Download, Image as ImageIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'
import { api } from '@/lib/api'
import { useRouter } from 'next/navigation'

interface Transaction {
    _id: string
    userId: {
        fullname: string
        email: string
    }
    type: string
    amount: number
    currency: string
    status: string
    paymentMethod?: string
    description?: string
    notes?: string
    proofDocument?: string // Screenshot/proof URL
    bankDetails?: {
        bankName?: string
        accountNumber?: string
        transactionId?: string
    }
    createdAt: string
}

export default function AdminTransactions() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [typeFilter, setTypeFilter] = useState('')
    const [statusFilter, setStatusFilter] = useState('')
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [error, setError] = useState<string | null>(null)

    // Modal states
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
    const [isImageModalOpen, setIsImageModalOpen] = useState(false)
    const [actionLoading, setActionLoading] = useState(false)
    const [newStatus, setNewStatus] = useState('')
    const [adminNotes, setAdminNotes] = useState('')

    useEffect(() => {
        fetchTransactions()
    }, [page, typeFilter, statusFilter])

    const fetchTransactions = async () => {
        try {
            setLoading(true)
            const response = await api.admin.getAllTransactions({
                page,
                limit: 20,
                type: typeFilter,
                status: statusFilter
            })

            if (response.success) {
                setTransactions(response.data.transactions)
                setTotalPages(response.data.pagination.totalPages)
            }
        } catch (err: any) {
            console.error('Error fetching transactions:', err)
            setError(err.message || 'Failed to load transactions')

            if (err.message?.includes('Unauthorized') || err.message?.includes('Forbidden')) {
                router.push('/auth/login')
            }
        } finally {
            setLoading(false)
        }
    }

    const handleUpdateStatus = async () => {
        if (!selectedTransaction || !newStatus) return

        try {
            setActionLoading(true)
            const response = await api.admin.updateTransactionStatus(
                selectedTransaction._id,
                newStatus,
                adminNotes
            )

            if (response.success) {
                alert('Transaction status updated successfully!')
                setIsUpdateModalOpen(false)
                setAdminNotes('')
                fetchTransactions()
            }
        } catch (err: any) {
            console.error('Error updating transaction:', err)
            alert(err.message || 'Failed to update transaction status')
        } finally {
            setActionLoading(false)
        }
    }

    const handleViewImage = (transaction: Transaction) => {
        setSelectedTransaction(transaction)
        setIsImageModalOpen(true)
    }

    const handleDownloadImage = async (url: string, transactionId: string) => {
        try {
            const response = await fetch(url)
            const blob = await response.blob()
            const downloadUrl = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = downloadUrl
            a.download = `transaction-${transactionId}-proof.jpg`
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(downloadUrl)
            document.body.removeChild(a)
        } catch (err) {
            console.error('Error downloading image:', err)
            alert('Failed to download image')
        }
    }

    const getStatusBadge = (status: string) => {
        const config: any = {
            completed: { color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400', label: 'Completed' },
            pending: { color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400', label: 'Pending' },
            processing: { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400', label: 'Processing' },
            failed: { color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400', label: 'Failed' },
            rejected: { color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400', label: 'Rejected' },
            cancelled: { color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400', label: 'Cancelled' }
        }

        const cfg = config[status] || config.pending

        return (
            <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${cfg.color}`}>
                {cfg.label}
            </span>
        )
    }

    const getTypeBadge = (type: string) => {
        const config: any = {
            deposit: { color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400', label: 'Deposit' },
            withdrawal: { color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400', label: 'Withdrawal' },
            investment: { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400', label: 'Investment' },
            profit: { color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400', label: 'Profit' },
            loss: { color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400', label: 'Loss' },
            fee: { color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400', label: 'Fee' }
        }

        const cfg = config[type] || config.deposit

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
                        Transactions Management
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Review and manage all platform transactions
                    </p>
                </div>

                {/* Filters */}
                <Card className="bg-white dark:bg-slate-900 border-gray-200 dark:border-gray-800 mb-6">
                    <CardContent className="pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {/* Type Filter */}
                            <select
                                value={typeFilter}
                                onChange={(e) => {
                                    setTypeFilter(e.target.value)
                                    setPage(1)
                                }}
                                className="px-4 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white text-sm"
                            >
                                <option value="">All Types</option>
                                <option value="deposit">Deposit</option>
                                <option value="withdrawal">Withdrawal</option>
                                <option value="investment">Investment</option>
                                <option value="profit">Profit</option>
                                <option value="loss">Loss</option>
                                <option value="fee">Fee</option>
                            </select>

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
                                <option value="pending">Pending</option>
                                <option value="processing">Processing</option>
                                <option value="completed">Completed</option>
                                <option value="failed">Failed</option>
                                <option value="rejected">Rejected</option>
                            </select>

                            {/* Results count */}
                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 md:col-span-2">
                                <Filter className="h-4 w-4 mr-2" />
                                Showing {transactions.length} transactions
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Transactions Table */}
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
                                            <th className="text-left py-3 px-4 text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">ID</th>
                                            <th className="text-left py-3 px-4 text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">User</th>
                                            <th className="text-center py-3 px-4 text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">Type</th>
                                            <th className="text-right py-3 px-4 text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">Amount</th>
                                            <th className="text-center py-3 px-4 text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">Status</th>
                                            <th className="text-center py-3 px-4 text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">Date</th>
                                            <th className="text-center py-3 px-4 text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">Proof</th>
                                            <th className="text-center py-3 px-4 text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {transactions.map((tx) => (
                                            <tr key={tx._id} className="border-t border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-slate-800/50">
                                                <td className="py-4 px-4">
                                                    <div className="text-xs font-mono text-gray-500 dark:text-gray-400">
                                                        {tx._id.slice(-8)}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                            {tx.userId?.fullname || 'Unknown'}
                                                        </div>
                                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                                            {tx.userId?.email || 'No email'}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4 text-center">
                                                    {getTypeBadge(tx.type)}
                                                </td>
                                                <td className="py-4 px-4 text-right">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                        ${tx.amount.toFixed(2)}
                                                    </div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                                        {tx.currency}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4 text-center">
                                                    {getStatusBadge(tx.status)}
                                                </td>
                                                <td className="py-4 px-4 text-center">
                                                    <div className="text-sm text-gray-900 dark:text-white">
                                                        {new Date(tx.createdAt).toLocaleDateString()}
                                                    </div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                                        {new Date(tx.createdAt).toLocaleTimeString()}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4 text-center">
                                                    {tx.proofDocument ? (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleViewImage(tx)}
                                                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    ) : (
                                                        <span className="text-xs text-gray-400 dark:text-gray-600">No proof</span>
                                                    )}
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => {
                                                                setSelectedTransaction(tx)
                                                                setNewStatus(tx.status)
                                                                setAdminNotes(tx.notes || '')
                                                                setIsUpdateModalOpen(true)
                                                            }}
                                                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                                            disabled={tx.status === 'completed'}
                                                        >
                                                            {tx.status === 'completed' ? 'Completed' : 'Update'}
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

            {/* Update Transaction Modal */}
            <Modal
                isOpen={isUpdateModalOpen}
                onClose={() => {
                    setIsUpdateModalOpen(false)
                    setAdminNotes('')
                }}
                title="Update Transaction Status"
            >
                <div className="space-y-4">
                    <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            Transaction ID: <strong>{selectedTransaction?._id.slice(-8)}</strong>
                            <br />
                            User: <strong>{selectedTransaction?.userId?.fullname}</strong>
                            <br />
                            Amount: <strong>${selectedTransaction?.amount.toFixed(2)}</strong>
                            <br />
                            {selectedTransaction?.bankDetails?.transactionId && (
                                <>
                                    Bank Txn ID: <strong>{selectedTransaction.bankDetails.transactionId}</strong>
                                    <br />
                                </>
                            )}
                        </p>

                        {selectedTransaction?.proofDocument && (
                            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded">
                                <p className="text-sm text-blue-800 dark:text-blue-400 mb-2">
                                    <ImageIcon className="h-4 w-4 inline mr-1" />
                                    Payment proof available
                                </p>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleViewImage(selectedTransaction)}
                                    className="text-blue-600 hover:text-blue-700"
                                >
                                    View Screenshot
                                </Button>
                            </div>
                        )}

                        <label className="text-xs font-medium text-gray-700 dark:text-gray-300 block mb-2">
                            New Status
                        </label>
                        <select
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                            className="w-full px-4 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white"
                        >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="completed">Completed</option>
                            <option value="failed">Failed</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-xs font-medium text-gray-700 dark:text-gray-300 block mb-2">
                            Admin Notes
                        </label>
                        <textarea
                            value={adminNotes}
                            onChange={(e) => setAdminNotes(e.target.value)}
                            placeholder="Add notes about this transaction..."
                            rows={3}
                            className="w-full px-4 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white"
                        />
                    </div>

                    {newStatus === 'completed' && (
                        <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded">
                            <p className="text-sm text-amber-800 dark:text-amber-400">
                                ⚠️ Completing this transaction will update the user's balance accordingly.
                            </p>
                        </div>
                    )}

                    <div className="flex justify-end gap-2 pt-4">
                        <Button
                            variant="ghost"
                            onClick={() => setIsUpdateModalOpen(false)}
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

            {/* Image View Modal */}
            <Modal
                isOpen={isImageModalOpen}
                onClose={() => setIsImageModalOpen(false)}
                title="Payment Proof"
            >
                <div className="space-y-4">
                    <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-4">
                        <div className="mb-3">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Transaction ID: <strong className="text-gray-900 dark:text-white">{selectedTransaction?._id.slice(-8)}</strong>
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                User: <strong className="text-gray-900 dark:text-white">{selectedTransaction?.userId?.fullname}</strong>
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Amount: <strong className="text-gray-900 dark:text-white">${selectedTransaction?.amount.toFixed(2)}</strong>
                            </p>
                            {selectedTransaction?.bankDetails?.transactionId && (
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Bank Txn ID: <strong className="text-gray-900 dark:text-white">{selectedTransaction.bankDetails.transactionId}</strong>
                                </p>
                            )}
                        </div>

                        {selectedTransaction?.proofDocument ? (
                            <div className="relative">
                                <img
                                    src={selectedTransaction.proofDocument}
                                    alt="Payment Proof"
                                    className="w-full h-auto rounded-lg border border-gray-200 dark:border-gray-700"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = '/placeholder-image.png';
                                    }}
                                />
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDownloadImage(selectedTransaction.proofDocument!, selectedTransaction._id)}
                                    className="mt-3 w-full"
                                >
                                    <Download className="h-4 w-4 mr-2" />
                                    Download Screenshot
                                </Button>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-64 bg-gray-100 dark:bg-slate-700 rounded-lg">
                                <p className="text-gray-400 dark:text-gray-500">No proof document available</p>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end pt-2">
                        <Button
                            variant="ghost"
                            onClick={() => setIsImageModalOpen(false)}
                        >
                            Close
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}
