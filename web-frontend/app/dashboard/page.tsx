'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Modal } from "@/components/ui/modal"
import { StatCard } from "@/components/ui/StatCard"
import { RecentActivityTable } from "@/components/dashboard/RecentActivityTable"
import { Watchlist } from "@/components/dashboard/Watchlist"
import { Notifications } from "@/components/dashboard/Notifications"
import { ChartCard } from "@/components/dashboard/ChartCard"
import { MobileDashboardWrapper } from "@/components/mobile/MobileDashboardWrapper"
import { CreditCard, TrendingUp, Bell, RefreshCcw } from "lucide-react"
import { api } from "@/lib/api"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"


export default function DashboardPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [isKYCModalOpen, setIsKYCModalOpen] = useState(false)
  const [isWatchlistModalOpen, setIsWatchlistModalOpen] = useState(false)
  const [newWatchlistSymbol, setNewWatchlistSymbol] = useState("")
  const [newWatchlistType, setNewWatchlistType] = useState<"cryptocurrency" | "stock" | "forex" | "commodity">("cryptocurrency")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  // Dynamic data from API
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [userBalance, setUserBalance] = useState<any>(null)
  const [liveWatchlist, setLiveWatchlist] = useState<any[]>([])

  // Chart period states
  const [portfolioPeriod, setPortfolioPeriod] = useState<'1M' | '3M' | '1Y'>('1M')
  const [depositPeriod, setDepositPeriod] = useState<'1M' | '3M' | '1Y'>('1M')

  // Fetch all dashboard data
  useEffect(() => {
    if (!user) return

    const fetchDashboardData = async () => {
      try {
        setIsLoading(true)

        // Fetch dashboard, balance, and watchlist in parallel
        const [dashboardResult, balanceResult, watchlistResult] = await Promise.all([
          api.dashboard.getData().catch(err => {
            console.error('Dashboard error:', err)
            return { dashboard: null }
          }),
          api.user.getBalance().catch(err => {
            console.error('Balance error:', err)
            return null
          }),
          api.market.getWatchlistQuotes().catch(err => {
            console.error('Watchlist error:', err)
            return { success: false, data: [] }
          })
        ])

        console.log('📊 Dashboard Data:', dashboardResult)
        console.log('💰 Balance Data:', balanceResult)
        console.log('👀 Watchlist Data:', watchlistResult)

        setDashboardData(dashboardResult.dashboard)
        setUserBalance(balanceResult?.userBalance || balanceResult)

        const quotes = Array.isArray(watchlistResult) ? watchlistResult : (watchlistResult.data || [])
        setLiveWatchlist(quotes)

        setError("")
      } catch (err: any) {
        console.error('Error fetching dashboard data:', err)
        setError(err.message || 'Failed to load dashboard data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [user])

  const handleSearch = async (query: string) => {
    setNewWatchlistSymbol(query)
    if (!query || query.length < 2) {
      setSearchResults([])
      return
    }

    try {
      setIsSearching(true)
      const results = await api.market.search(query)
      setSearchResults(results)
    } catch (err) {
      console.error("Search error:", err)
    } finally {
      setIsSearching(false)
    }
  }

  const handleAddWatchlist = async () => {
    if (!newWatchlistSymbol) return

    try {
      await api.watchlist.add({
        symbol: newWatchlistSymbol.toUpperCase(),
        assetType: newWatchlistType,
        alertPrice: undefined,
        notes: ""
      })

      // Refresh watchlist only
      const watchlistResult = await api.market.getWatchlistQuotes().catch(err => ({ success: false, data: [] }))
      const quotes = Array.isArray(watchlistResult) ? watchlistResult : (watchlistResult.data || [])
      setLiveWatchlist(quotes)

      setNewWatchlistSymbol("")
      setIsWatchlistModalOpen(false)
    } catch (err: any) {
      console.error('Error adding to watchlist:', err)
      alert(err.message || 'Failed to add to watchlist')
    }
  }

  const handleRefresh = async () => {
    if (!user) return

    try {
      setIsLoading(true)
      const [dashboardResult, balanceResult, watchlistResult] = await Promise.all([
        api.dashboard.getData().catch(err => ({ dashboard: null })),
        api.user.getBalance().catch(err => null),
        api.market.getWatchlistQuotes().catch(err => ({ success: false, data: [] }))
      ])

      setDashboardData(dashboardResult.dashboard)
      setUserBalance(balanceResult?.userBalance || balanceResult)

      const quotes = Array.isArray(watchlistResult) ? watchlistResult : (watchlistResult.data || [])
      setLiveWatchlist(quotes)
    } catch (err: any) {
      console.error('Error refreshing data:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Generate dynamic labels based on period
  const getChartLabels = (period: '1M' | '3M' | '1Y') => {
    const now = new Date()
    const labels: string[] = []

    if (period === '1M') {
      for (let i = 4; i >= 0; i--) {
        const date = new Date(now)
        date.setDate(date.getDate() - (i * 7))
        labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }))
      }
    } else if (period === '3M') {
      for (let i = 2; i >= 0; i--) {
        const date = new Date(now)
        date.setMonth(date.getMonth() - i)
        labels.push(date.toLocaleDateString('en-US', { month: 'short' }))
      }
    } else {
      for (let i = 11; i >= 0; i--) {
        const date = new Date(now)
        date.setMonth(date.getMonth() - i)
        labels.push(date.toLocaleDateString('en-US', { month: 'short' }))
      }
    }

    return labels
  }

  const getChartData = (fullData: number[], period: '1M' | '3M' | '1Y') => {
    if (period === '1M') return fullData.slice(-5)
    else if (period === '3M') return fullData.slice(-3)
    else return fullData.slice(-12)
  }

  if (isLoading && !dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error && !dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-xl mb-4">{error}</p>
          <Button onClick={handleRefresh} className="bg-emerald-500 hover:bg-emerald-600">
            Retry
          </Button>
        </div>
      </div>
    )
  }

  // Calculate dynamic balance values
  const totalBalance = userBalance?.totalBalance || dashboardData?.balance?.total || 0
  const availableBalance = userBalance?.availableBalance || totalBalance
  const totalDeposited = userBalance?.totalDeposited || dashboardData?.balance?.recentDeposits || 0
  const totalProfit = userBalance?.totalProfit || 0
  const totalInvested = userBalance?.totalInvested || 1 // Avoid division by zero

  // Calculate percentage change
  const balanceChange = totalProfit && totalInvested
    ? ((totalProfit / totalInvested) * 100).toFixed(2)
    : "0.00"
  const balanceChangeStr = `${parseFloat(balanceChange) >= 0 ? '+' : ''}${balanceChange}%`
  const isPositiveChange = parseFloat(balanceChange) >= 0

  // Extract other data
  const activities = dashboardData?.activities || []
  const notifications = dashboardData?.notifications || []
  const watchlist = dashboardData?.watchlist || []
  const pendingActions = dashboardData?.pendingActions || 0
  const charts = dashboardData?.charts || { portfolioPerformance: [], depositActivity: [] }

  const hasPortfolioData = charts.portfolioPerformance && charts.portfolioPerformance.length > 0
  const hasDepositData = charts.depositActivity && charts.depositActivity.length > 0

  const portfolioLabels = getChartLabels(portfolioPeriod)
  const depositLabels = getChartLabels(depositPeriod)

  const portfolioData = hasPortfolioData ? getChartData(charts.portfolioPerformance, portfolioPeriod) : []
  const depositData = hasDepositData ? getChartData(charts.depositActivity, depositPeriod) : []

  const lineChartSeries = [{ name: "Portfolio Value", data: portfolioData }]
  const barChartSeries = [{ name: "Deposits", data: depositData }]

  const lineChartOptions = {
    chart: {
      id: "line-chart",
      toolbar: { show: false },
      zoom: { enabled: false },
      background: 'transparent',
      sparkline: { enabled: false }
    },
    xaxis: {
      categories: portfolioLabels,
      labels: { style: { colors: "#94a3b8", fontSize: '12px' } },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: {
      labels: { style: { colors: "#94a3b8", fontSize: '12px' } }
    },
    stroke: { curve: "smooth" as const, width: 3 },
    colors: ["#10B981"],
    grid: { borderColor: "#1e293b", strokeDashArray: 4 },
    tooltip: { theme: "dark", y: { formatter: (val: number) => `$${val}` } },
    dataLabels: { enabled: false },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'vertical',
        shadeIntensity: 0.5,
        gradientToColors: ['#10B981'],
        inverseColors: false,
        opacityFrom: 0.7,
        opacityTo: 0.3,
      }
    }
  }

  const barChartOptions = {
    chart: {
      id: "bar-chart",
      toolbar: { show: false },
      zoom: { enabled: false },
      background: 'transparent'
    },
    xaxis: {
      categories: depositLabels,
      labels: { style: { colors: "#94a3b8", fontSize: '12px' } },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: {
      labels: { style: { colors: "#94a3b8", fontSize: '12px' } }
    },
    colors: ["#3B82F6"],
    grid: { borderColor: "#1e293b", strokeDashArray: 4 },
    tooltip: { theme: "dark", y: { formatter: (val: number) => `$${val}` } },
    plotOptions: {
      bar: {
        borderRadius: 8,
        columnWidth: '60%',
      }
    },
    dataLabels: { enabled: false },
  }

  const verificationPending = notifications.some((n: any) => n.message?.toLowerCase().includes("verification") && !n.isDone)

  const formattedActivities = activities.map((activity: any) => ({
    date: new Date(activity.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    type: activity.type.toUpperCase(),
    asset: activity.currency || 'USD',
    amount: `$${activity.amount.toFixed(2)}`,
    status: activity.status.charAt(0).toUpperCase() + activity.status.slice(1)
  }))

  const formattedNotifications = notifications.map((notif: any) => ({
    id: notif.id,
    message: notif.message,
    done: notif.isDone
  }))

  const sourceWatchlist = liveWatchlist.length > 0 ? liveWatchlist : watchlist

  const formattedWatchlist = sourceWatchlist.map((item: any) => {
    const price = typeof item.price === 'number' ? item.price : 0
    const changePercent = typeof item.changePercent === 'number' ? item.changePercent : 0

    return {
      symbol: item.symbol,
      name: item.name || item.symbol,
      price: `$${price.toFixed(2)}`,
      change: `${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(2)}%`
    }
  })

  return (
    <MobileDashboardWrapper onRefresh={handleRefresh}>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Welcome Header with Stats */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <h2 className="text-3xl font-bold text-white mb-1">Welcome back, {user?.fullname || 'Trader'} 👋</h2>
                <p className="text-slate-400 text-sm">Here's what's happening with your portfolio today</p>
              </div>
              <div className="flex items-center gap-2 mt-4 md:mt-0">
                <span className="text-xs text-slate-500">Last updated: {new Date().toLocaleTimeString()}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-slate-400 hover:text-white"
                  onClick={handleRefresh}
                  disabled={isLoading}
                >
                  <RefreshCcw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </div>

            {/* Enhanced Stats Cards - ALL DYNAMIC */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard
                label="Total Balance"
                value={`$${totalBalance.toFixed(2)}`}
                change={balanceChangeStr}
                isPositive={isPositiveChange}
                subtext="vs last month"
                icon={TrendingUp}
                color="emerald"
              />
              <StatCard
                label="Recent Deposits"
                value={`$${totalDeposited.toFixed(2)}`}
                subtext={`${activities.filter((a: any) => a.type === 'deposit').length} transactions this week`}
                icon={CreditCard}
                color="blue"
              />
              <StatCard
                label="Pending Actions"
                value={pendingActions.toString()}
                icon={Bell}
                color="amber"
                action={verificationPending && (
                  <Button
                    size="sm"
                    className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 w-full"
                    onClick={() => setIsKYCModalOpen(true)}
                  >
                    Complete KYC
                  </Button>
                )}
              />
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Sidebar - Notifications & Watchlist */}
            <div className="lg:col-span-4 space-y-6">
              <Notifications notifications={formattedNotifications} actionRequired={verificationPending} />
              <Watchlist onAdd={() => router.push('/dashboard/market')} />
            </div>

            {/* Right Content - Charts & Activity */}
            <div className="lg:col-span-8 space-y-6">
              {/* Charts Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ChartCard
                  title="Portfolio Performance"
                  options={lineChartOptions}
                  series={lineChartSeries}
                  type="area"
                  actions={
                    <>
                      <button
                        onClick={() => setPortfolioPeriod('1M')}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${portfolioPeriod === '1M' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400 hover:bg-white/5'
                          }`}
                      >
                        1M
                      </button>
                      <button
                        onClick={() => setPortfolioPeriod('3M')}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${portfolioPeriod === '3M' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400 hover:bg-white/5'
                          }`}
                      >
                        3M
                      </button>
                      <button
                        onClick={() => setPortfolioPeriod('1Y')}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${portfolioPeriod === '1Y' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400 hover:bg-white/5'
                          }`}
                      >
                        1Y
                      </button>
                    </>
                  }
                />
                <ChartCard
                  title="Deposit Activity"
                  options={barChartOptions}
                  series={barChartSeries}
                  type="bar"
                  actions={
                    <>
                      <button
                        onClick={() => setDepositPeriod('1M')}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${depositPeriod === '1M' ? 'bg-blue-500/20 text-blue-400' : 'text-slate-400 hover:bg-white/5'
                          }`}
                      >
                        1M
                      </button>
                      <button
                        onClick={() => setDepositPeriod('3M')}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${depositPeriod === '3M' ? 'bg-blue-500/20 text-blue-400' : 'text-slate-400 hover:bg-white/5'
                          }`}
                      >
                        3M
                      </button>
                      <button
                        onClick={() => setDepositPeriod('1Y')}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${depositPeriod === '1Y' ? 'bg-blue-500/20 text-blue-400' : 'text-slate-400 hover:bg-white/5'
                          }`}
                      >
                        1Y
                      </button>
                    </>
                  }
                />
              </div>

              {/* Activity Table */}
              <RecentActivityTable activities={formattedActivities} onViewAll={() => window.location.href = '/dashboard/wallet'} />
            </div>
          </div>
        </div>

        {/* Modals */}
        <Modal
          isOpen={isKYCModalOpen}
          onClose={() => setIsKYCModalOpen(false)}
          title="Complete KYC Verification"
        >
          <div className="space-y-4">
            <p className="text-sm text-slate-400">
              To unlock full trading features and higher limits, please complete our secure verification process.
            </p>
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-emerald-400 mb-2">What you'll need:</h4>
              <ul className="text-xs text-slate-300 space-y-1">
                <li>• Government-issued ID (Passport, Driver's License, or National ID)</li>
                <li>• Proof of address (Utility bill or bank statement)</li>
                <li>• A clear selfie with your ID</li>
                <li>• Phone number for verification</li>
              </ul>
            </div>
            <p className="text-xs text-slate-400">
              The verification process typically takes 5-10 minutes. Your documents will be reviewed within 24-48 hours.
            </p>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="ghost" onClick={() => setIsKYCModalOpen(false)}>Later</Button>
              <Link href="/dashboard/verification">
                <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
                  Start Verification
                </Button>
              </Link>
            </div>
          </div>
        </Modal>

        <Modal
          isOpen={isWatchlistModalOpen}
          onClose={() => setIsWatchlistModalOpen(false)}
          title="Add to Watchlist"
        >
          <div className="space-y-4">
            <div className="space-y-2 relative">
              <label className="text-xs font-medium text-slate-300">Asset Symbol</label>
              <Input
                placeholder="Search e.g. BTC, Apple, Gold"
                value={newWatchlistSymbol}
                onChange={(e) => handleSearch(e.target.value)}
                className="bg-slate-900 border-white/10 text-white"
              />

              {/* Search Results Dropdown */}
              {(searchResults.length > 0 || isSearching) && newWatchlistSymbol.length >= 2 && (
                <div className="absolute z-10 w-full mt-1 bg-slate-800 border border-white/10 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {isSearching ? (
                    <div className="p-3 text-center text-slate-400 text-xs">Searching...</div>
                  ) : (
                    searchResults.map((result: any) => (
                      <div
                        key={result.symbol}
                        className="p-2 hover:bg-slate-700 cursor-pointer flex justify-between items-center transition-colors"
                        onClick={() => {
                          setNewWatchlistSymbol(result.symbol)
                          if (result.type?.includes('Crypto')) setNewWatchlistType('cryptocurrency')
                          else if (result.type?.includes('Stock')) setNewWatchlistType('stock')
                          else if (result.type?.includes('Forex')) setNewWatchlistType('forex')
                          setSearchResults([])
                        }}
                      >
                        <div>
                          <div className="font-bold text-white text-sm">{result.displaySymbol || result.symbol}</div>
                          <div className="text-slate-400 text-xs">{result.description}</div>
                        </div>
                        <div className="text-slate-500 text-xs bg-slate-900 px-2 py-1 rounded border border-white/5">
                          {result.type}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-300">Asset Type</label>
              <select
                value={newWatchlistType}
                onChange={(e) => setNewWatchlistType(e.target.value as any)}
                className="w-full bg-slate-900 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              >
                <option value="cryptocurrency">Cryptocurrency</option>
                <option value="stock">Stock</option>
                <option value="forex">Forex</option>
                <option value="commodity">Commodity</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="ghost" onClick={() => setIsWatchlistModalOpen(false)}>Cancel</Button>
              <Button className="bg-emerald-500 hover:bg-emerald-600 text-white" onClick={handleAddWatchlist}>Add Asset</Button>
            </div>
          </div>
        </Modal>
      </div>
    </MobileDashboardWrapper>
  )
}
