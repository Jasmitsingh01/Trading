// frontend/app/admin/page.tsx

'use client'

import { useState, useEffect } from 'react'
import { Users, DollarSign, TrendingUp, Activity, AlertCircle, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { api } from '@/lib/api'
import { useRouter } from 'next/navigation'

interface DashboardStats {
  totalUsers: number
  activeUsers: number
  pendingKYC: number
  totalTransactions: number
  pendingTransactions: number
  totalVolume: number
  totalOrders: number
  activeOrders: number
  platformBalance: number
  monthlyRevenue: number
}

interface Transaction {
  _id: string
  userId: {
    fullname: string
    email: string
  }
  type: string
  amount: number
  status: string
  createdAt: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const response = await api.admin.getDashboardStats()

      if (response.success) {
        setStats(response.data.stats)
        setRecentTransactions(response.data.recentTransactions)
      }
    } catch (err: any) {
      console.error('Error fetching dashboard:', err)
      setError(err.message || 'Failed to load dashboard')
      
      if (err.message?.includes('Unauthorized') || err.message?.includes('Forbidden')) {
        router.push('/auth/login')
      }
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="flex items-center gap-2 text-gray-900 dark:text-white">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading dashboard...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="flex items-center gap-2 text-red-500">
          <AlertCircle className="w-6 h-6" />
          <span>{error}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Overview of platform activity and metrics
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Users */}
          <Card className="bg-white dark:bg-slate-900 border-gray-200 dark:border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Users
              </CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats?.totalUsers.toLocaleString()}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {stats?.activeUsers} active
              </p>
            </CardContent>
          </Card>

          {/* Platform Balance */}
          <Card className="bg-white dark:bg-slate-900 border-gray-200 dark:border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Platform Balance
              </CardTitle>
              <DollarSign className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                ${stats?.platformBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Total user funds
              </p>
            </CardContent>
          </Card>

          {/* Monthly Revenue */}
          <Card className="bg-white dark:bg-slate-900 border-gray-200 dark:border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Monthly Revenue
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                ${stats?.monthlyRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                This month
              </p>
            </CardContent>
          </Card>

          {/* Pending Actions */}
          <Card className="bg-white dark:bg-slate-900 border-gray-200 dark:border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Pending Actions
              </CardTitle>
              <Activity className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {(stats?.pendingKYC || 0) + (stats?.pendingTransactions || 0)}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {stats?.pendingKYC} KYC, {stats?.pendingTransactions} transactions
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card
            className="bg-white dark:bg-slate-900 border-gray-200 dark:border-gray-800 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => router.push('/admin/users')}
          >
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Manage Users</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">View and manage all users</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className="bg-white dark:bg-slate-900 border-gray-200 dark:border-gray-800 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => router.push('/admin/transactions')}
          >
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Transactions</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Review pending transactions</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className="bg-white dark:bg-slate-900 border-gray-200 dark:border-gray-800 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => router.push('/admin/settings')}
          >
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                  <Activity className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Settings</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Configure platform settings</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card className="bg-white dark:bg-slate-900 border-gray-200 dark:border-gray-800">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-800">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">User</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Type</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Amount</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Status</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.map((tx) => (
                    <tr key={tx._id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-slate-800">
                      <td className="py-3 px-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {tx.userId?.fullname || 'Unknown'}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {tx.userId?.email || 'No email'}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                          tx.type === 'deposit' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400' :
                          tx.type === 'withdrawal' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                          'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                        }`}>
                          {tx.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-medium text-gray-900 dark:text-white">
                        ${tx.amount.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                          tx.status === 'completed' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400' :
                          tx.status === 'pending' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400' :
                          'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right text-sm text-gray-600 dark:text-gray-400">
                        {new Date(tx.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
