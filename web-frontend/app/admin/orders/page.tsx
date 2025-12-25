// frontend/app/admin/orders/page.tsx

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
    Search, 
    Filter, 
    TrendingUp, 
    TrendingDown, 
    Loader2, 
    AlertCircle, 
    Eye,
    XCircle,
    CheckCircle,
    PlayCircle,
    BarChart3,
    Download,
    RefreshCw
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'
import { api } from '@/lib/api'

interface Order {
    _id: string
    userId: {
        _id: string
        fullname: string
        email: string
    }
    symbol: string
    assetType: string
    orderType: string
    side: string
    quantity: number
    price: number
    stopPrice?: number
    status: string
    filledQuantity: number
    averageFillPrice?: number
    timeInForce: string
    createdAt: string
    notes?: string
}

interface OrderStats {
    totalOrders: number
    totalVolume: number
    totalValue: number
    avgOrderSize: number
}

export default function AdminOrders() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [orders, setOrders] = useState<Order[]>([])
    const [stats, setStats] = useState<OrderStats | null>(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('')
    const [sideFilter, setSideFilter] = useState('')
    const [assetTypeFilter, setAssetTypeFilter] = useState('')
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [error, setError] = useState<string | null>(null)

    // Modal states
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
    const [isViewModalOpen, setIsViewModalOpen] = useState(false)
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)
    const [isExecuteModalOpen, setIsExecuteModalOpen] = useState(false)
    const [actionLoading, setActionLoading] = useState(false)
    const [cancelReason, setCancelReason] = useState('')
    const [executionPrice, setExecutionPrice] = useState('')
    const [executionQuantity, setExecutionQuantity] = useState('')

    useEffect(() => {
        fetchOrders()
    }, [page, statusFilter, sideFilter, assetTypeFilter, searchTerm])

    const fetchOrders = async () => {
        try {
            setLoading(true)
            const response = await api.admin.getAllOrders({
                page,
                limit: 20,
                status: statusFilter,
                side: sideFilter,
                assetType: assetTypeFilter,
                symbol: searchTerm
            })

            if (response.success) {
                setOrders(response.data.orders)
                setStats(response.data.stats)
                setTotalPages(response.data.pagination.totalPages)
            }
        } catch (err: any) {
            console.error('Error fetching orders:', err)
            setError(err.message || 'Failed to load orders')

            if (err.message?.includes('Unauthorized') || err.message?.includes('Forbidden')) {
                router.push('/auth/login')
            }
        } finally {
            setLoading(false)
        }
    }

    const handleCancelOrder = async () => {
        if (!selectedOrder) return

        try {
            setActionLoading(true)
            const response = await api.admin.updateOrderStatus(
                selectedOrder._id,
                'cancelled',
                cancelReason
            )

            if (response.success) {
                alert('Order cancelled successfully!')
                setIsCancelModalOpen(false)
                setCancelReason('')
                fetchOrders()
            }
        } catch (err: any) {
            console.error('Error cancelling order:', err)
            alert(err.message || 'Failed to cancel order')
        } finally {
            setActionLoading(false)
        }
    }

    const handleExecuteOrder = async () => {
        if (!selectedOrder) return

        try {
            setActionLoading(true)
            const response = await api.admin.forceExecuteOrder(
                selectedOrder._id,
                parseFloat(executionPrice) || undefined,
                parseFloat(executionQuantity) || undefined
            )

            if (response.success) {
                alert('Order executed successfully!')
                setIsExecuteModalOpen(false)
                setExecutionPrice('')
                setExecutionQuantity('')
                fetchOrders()
            }
        } catch (err: any) {
            console.error('Error executing order:', err)
            alert(err.message || 'Failed to execute order')
        } finally {
            setActionLoading(false)
        }
    }

    const getStatusBadge = (status: string) => {
        const config: any = {
            pending: { color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400', label: 'Pending' },
            open: { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400', label: 'Open' },
            filled: { color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400', label: 'Filled' },
            partially_filled: { color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400', label: 'Partial' },
            cancelled: { color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400', label: 'Cancelled' },
            rejected: { color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400', label: 'Rejected' },
            failed: { color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400', label: 'Failed' }
        }

        const cfg = config[status] || config.pending

        return (
            <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${cfg.color}`}>
                {cfg.label}
            </span>
        )
    }

    const getSideBadge = (side: string) => {
        return side === 'buy' ? (
            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400">
                <TrendingUp className="h-3 w-3 mr-1" />
                Buy
            </span>
        ) : (
            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
                <TrendingDown className="h-3 w-3 mr-1" />
                Sell
            </span>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
            <div className="p-6 lg:p-8 max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Orders Management
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Monitor and manage all trading orders on the platform
                    </p>
                </div>

                {/* Statistics Cards */}
                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <Card className="bg-white dark:bg-slate-900 border-gray-200 dark:border-gray-800">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Orders</p>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                            {stats.totalOrders.toLocaleString()}
                                        </p>
                                    </div>
                                    <BarChart3 className="h-8 w-8 text-blue-500" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-white dark:bg-slate-900 border-gray-200 dark:border-gray-800">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Volume</p>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                            {stats.totalVolume.toLocaleString()}
                                        </p>
                                    </div>
                                    <TrendingUp className="h-8 w-8 text-emerald-500" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-white dark:bg-slate-900 border-gray-200 dark:border-gray-800">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Value</p>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                            ${stats.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </p>
                                    </div>
                                    <Download className="h-8 w-8 text-purple-500" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-white dark:bg-slate-900 border-gray-200 dark:border-gray-800">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Avg Order Size</p>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                            {stats.avgOrderSize.toFixed(2)}
                                        </p>
                                    </div>
                                    <BarChart3 className="h-8 w-8 text-amber-500" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Filters */}
                <Card className="bg-white dark:bg-slate-900 border-gray-200 dark:border-gray-800 mb-6">
                    <CardContent className="pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                            {/* Search */}
                            <div className="relative md:col-span-2">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    type="text"
                                    placeholder="Search by symbol..."
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
                                <option value="pending">Pending</option>
                                <option value="open">Open</option>
                                <option value="filled">Filled</option>
                                <option value="partially_filled">Partial</option>
                                <option value="cancelled">Cancelled</option>
                                <option value="rejected">Rejected</option>
                            </select>

                            {/* Side Filter */}
                            <select
                                value={sideFilter}
                                onChange={(e) => {
                                    setSideFilter(e.target.value)
                                    setPage(1)
                                }}
                                className="px-4 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white text-sm"
                            >
                                <option value="">All Sides</option>
                                <option value="buy">Buy</option>
                                <option value="sell">Sell</option>
                            </select>

                            {/* Asset Type Filter */}
                            <select
                                value={assetTypeFilter}
                                onChange={(e) => {
                                    setAssetTypeFilter(e.target.value)
                                    setPage(1)
                                }}
                                className="px-4 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white text-sm"
                            >
                                <option value="">All Assets</option>
                                <option value="stock">Stock</option>
                                <option value="crypto">Crypto</option>
                                <option value="forex">Forex</option>
                            </select>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                <Filter className="h-4 w-4 mr-2" />
                                Showing {orders.length} orders
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={fetchOrders}
                                className="text-gray-900 dark:text-white"
                            >
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Refresh
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Orders Table */}
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
                                            <th className="text-left py-3 px-4 text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">Order ID</th>
                                            <th className="text-left py-3 px-4 text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">User</th>
                                            <th className="text-left py-3 px-4 text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">Symbol</th>
                                            <th className="text-center py-3 px-4 text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">Side</th>
                                            <th className="text-right py-3 px-4 text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">Quantity</th>
                                            <th className="text-right py-3 px-4 text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">Price</th>
                                            <th className="text-center py-3 px-4 text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">Status</th>
                                            <th className="text-center py-3 px-4 text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">Date</th>
                                            <th className="text-center py-3 px-4 text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map((order) => (
                                            <tr key={order._id} className="border-t border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-slate-800/50">
                                                <td className="py-4 px-4">
                                                    <div className="text-xs font-mono text-gray-500 dark:text-gray-400">
                                                        {order._id.slice(-8)}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                            {order.userId?.fullname || 'Unknown'}
                                                        </div>
                                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                                            {order.userId?.email || 'No email'}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                            {order.symbol}
                                                        </div>
                                                        <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                                                            {order.assetType}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4 text-center">
                                                    {getSideBadge(order.side)}
                                                </td>
                                                <td className="py-4 px-4 text-right">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {order.quantity.toLocaleString()}
                                                    </div>
                                                    {order.filledQuantity > 0 && (
                                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                                            Filled: {order.filledQuantity}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="py-4 px-4 text-right">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                        ${order.price.toFixed(2)}
                                                    </div>
                                                    {order.averageFillPrice && (
                                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                                            Avg: ${order.averageFillPrice.toFixed(2)}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="py-4 px-4 text-center">
                                                    {getStatusBadge(order.status)}
                                                </td>
                                                <td className="py-4 px-4 text-center">
                                                    <div className="text-sm text-gray-900 dark:text-white">
                                                        {new Date(order.createdAt).toLocaleDateString()}
                                                    </div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                                        {new Date(order.createdAt).toLocaleTimeString()}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => {
                                                                setSelectedOrder(order)
                                                                setIsViewModalOpen(true)
                                                            }}
                                                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                        {!['filled', 'cancelled', 'rejected'].includes(order.status) && (
                                                            <>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => {
                                                                        setSelectedOrder(order)
                                                                        setExecutionPrice(order.price.toString())
                                                                        setExecutionQuantity(order.quantity.toString())
                                                                        setIsExecuteModalOpen(true)
                                                                    }}
                                                                    className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                                                                >
                                                                    <PlayCircle className="h-4 w-4" />
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => {
                                                                        setSelectedOrder(order)
                                                                        setIsCancelModalOpen(true)
                                                                    }}
                                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                                >
                                                                    <XCircle className="h-4 w-4" />
                                                                </Button>
                                                            </>
                                                        )}
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

            {/* View Order Modal */}
            <Modal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                title="Order Details"
            >
                {selectedOrder && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Order ID</p>
                                <p className="text-sm font-medium text-gray-900 dark:text-white font-mono">
                                    {selectedOrder._id}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Status</p>
                                {getStatusBadge(selectedOrder.status)}
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Symbol</p>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {selectedOrder.symbol}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Asset Type</p>
                                <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                                    {selectedOrder.assetType}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Side</p>
                                {getSideBadge(selectedOrder.side)}
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Order Type</p>
                                <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                                    {selectedOrder.orderType}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Quantity</p>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {selectedOrder.quantity.toLocaleString()}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Filled Quantity</p>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {selectedOrder.filledQuantity.toLocaleString()}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Price</p>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    ${selectedOrder.price.toFixed(2)}
                                </p>
                            </div>
                            {selectedOrder.averageFillPrice && (
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Avg Fill Price</p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        ${selectedOrder.averageFillPrice.toFixed(2)}
                                    </p>
                                </div>
                            )}
                            {selectedOrder.stopPrice && (
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Stop Price</p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        ${selectedOrder.stopPrice.toFixed(2)}
                                    </p>
                                </div>
                            )}
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Time in Force</p>
                                <p className="text-sm font-medium text-gray-900 dark:text-white uppercase">
                                    {selectedOrder.timeInForce}
                                </p>
                            </div>
                        </div>

                        {selectedOrder.notes && (
                            <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Notes</p>
                                <p className="text-sm text-gray-900 dark:text-white">
                                    {selectedOrder.notes}
                                </p>
                            </div>
                        )}

                        <div className="flex justify-end pt-4">
                            <Button
                                variant="ghost"
                                onClick={() => setIsViewModalOpen(false)}
                            >
                                Close
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Cancel Order Modal */}
            <Modal
                isOpen={isCancelModalOpen}
                onClose={() => {
                    setIsCancelModalOpen(false)
                    setCancelReason('')
                }}
                title="Cancel Order"
            >
                <div className="space-y-4">
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
                        <p className="text-sm text-red-800 dark:text-red-400">
                            ⚠️ Are you sure you want to cancel this order?
                        </p>
                    </div>

                    {selectedOrder && (
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                Order: <strong className="text-gray-900 dark:text-white">{selectedOrder.symbol}</strong>
                                <br />
                                Quantity: <strong className="text-gray-900 dark:text-white">{selectedOrder.quantity}</strong>
                                <br />
                                Price: <strong className="text-gray-900 dark:text-white">${selectedOrder.price.toFixed(2)}</strong>
                            </p>
                        </div>
                    )}

                    <div>
                        <label className="text-xs font-medium text-gray-700 dark:text-gray-300 block mb-2">
                            Cancellation Reason (Optional)
                        </label>
                        <textarea
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                            placeholder="Enter reason for cancellation..."
                            rows={3}
                            className="w-full px-4 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white"
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button
                            variant="ghost"
                            onClick={() => setIsCancelModalOpen(false)}
                            disabled={actionLoading}
                        >
                            No, Keep It
                        </Button>
                        <Button
                            onClick={handleCancelOrder}
                            disabled={actionLoading}
                            className="bg-red-500 hover:bg-red-600 text-white"
                        >
                            {actionLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Cancelling...
                                </>
                            ) : 'Yes, Cancel Order'}
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Execute Order Modal */}
            <Modal
                isOpen={isExecuteModalOpen}
                onClose={() => {
                    setIsExecuteModalOpen(false)
                    setExecutionPrice('')
                    setExecutionQuantity('')
                }}
                title="Force Execute Order"
            >
                <div className="space-y-4">
                    <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded">
                        <p className="text-sm text-amber-800 dark:text-amber-400">
                            ⚠️ This will manually execute the order. Use with caution!
                        </p>
                    </div>

                    {selectedOrder && (
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                Order: <strong className="text-gray-900 dark:text-white">{selectedOrder.symbol}</strong>
                            </p>

                            <div className="space-y-3">
                                <div>
                                    <label className="text-xs font-medium text-gray-700 dark:text-gray-300 block mb-2">
                                        Execution Price ($)
                                    </label>
                                    <Input
                                        type="number"
                                        value={executionPrice}
                                        onChange={(e) => setExecutionPrice(e.target.value)}
                                        placeholder="Enter execution price"
                                        step="0.01"
                                        className="bg-gray-50 dark:bg-slate-800"
                                    />
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        Leave empty to use order price
                                    </p>
                                </div>

                                <div>
                                    <label className="text-xs font-medium text-gray-700 dark:text-gray-300 block mb-2">
                                        Execution Quantity
                                    </label>
                                    <Input
                                        type="number"
                                        value={executionQuantity}
                                        onChange={(e) => setExecutionQuantity(e.target.value)}
                                        placeholder="Enter quantity to fill"
                                        step="1"
                                        className="bg-gray-50 dark:bg-slate-800"
                                    />
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        Leave empty to fill entire order
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end gap-2 pt-4">
                        <Button
                            variant="ghost"
                            onClick={() => setIsExecuteModalOpen(false)}
                            disabled={actionLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleExecuteOrder}
                            disabled={actionLoading}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white"
                        >
                            {actionLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Executing...
                                </>
                            ) : 'Execute Order'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}
