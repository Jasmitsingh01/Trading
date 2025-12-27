'use client'

import { useState, useEffect, useRef } from "react"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { Modal } from "@/components/ui/modal"
import { Input } from "@/components/ui/input"
import { SummaryCard } from "@/components/dashboard/SummaryCard"
import { PositionsTable } from "@/components/dashboard/PositionsTable"
import { AllocationCard } from "@/components/dashboard/AllocationCard"
import { Props as ChartProps } from "react-apexcharts"
import { api } from "@/lib/api"
import { useCryptoPrices } from "@/hooks/useBinanceWebSocket"
import useFinnhubForex from "@/hooks/useFinnhubForex"

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false })

// Helper function to calculate allocations from positions
function calculateAllocations(positions: any[], balance: any) {
    if (!positions || positions.length === 0 || !balance) {
        return [
            { name: "Cash / USDT", percent: "100%", value: balance ? `$${balance.availableBalance.toFixed(2)}` : "$0.00" }
        ]
    }

    const totalValue = balance.totalBalance
    const allocations: any[] = []

    const cryptoPositions = positions.filter(p => p.assetType === 'crypto' || p.assetType === 'cryptocurrency')
    const forexPositions = positions.filter(p => p.assetType === 'forex')

    const cryptoValue = cryptoPositions.reduce((sum, p) => sum + (p.marketValue || 0), 0)
    const forexValue = forexPositions.reduce((sum, p) => sum + (p.marketValue || 0), 0)
    const cashValue = balance.availableBalance

    if (cryptoValue > 0) {
        allocations.push({
            name: "Crypto",
            percent: `${((cryptoValue / totalValue) * 100).toFixed(1)}%`,
            value: `$${cryptoValue.toFixed(2)}`
        })
    }

    if (forexValue > 0) {
        allocations.push({
            name: "Forex",
            percent: `${((forexValue / totalValue) * 100).toFixed(1)}%`,
            value: `$${forexValue.toFixed(2)}`
        })
    }

    if (cashValue > 0) {
        allocations.push({
            name: "Cash / USDT",
            percent: `${((cashValue / totalValue) * 100).toFixed(1)}%`,
            value: `$${cashValue.toFixed(2)}`
        })
    }

    return allocations
}

// Helper to get timeframe in seconds for API
function getTimeframeInSeconds(timeframe: string): { from: number; to: number; resolution: string; seconds: number } {
    const now = Math.floor(Date.now() / 1000)
    const timeframes: Record<string, { seconds: number; resolution: string }> = {
        '1D': { seconds: 86400, resolution: '5' },
        '1W': { seconds: 604800, resolution: '15' },
        '1M': { seconds: 2592000, resolution: '60' },
        '3M': { seconds: 7776000, resolution: '240' },
        '1Y': { seconds: 31536000, resolution: 'D' },
        '5Y': { seconds: 157680000, resolution: 'W' },
        'Max': { seconds: 315360000, resolution: 'M' },
        'All': { seconds: 2592000, resolution: '60' }
    }

    const config = timeframes[timeframe] || timeframes['1M']
    return {
        from: now - config.seconds,
        to: now,
        resolution: config.resolution,
        seconds: config.seconds
    }
}

export default function PortfolioDashboard() {
    const [activeTab, setActiveTab] = useState("All Assets")
    const [chartType, setChartType] = useState("1D")
    const [isDepositModalOpen, setIsDepositModalOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [authError, setAuthError] = useState<string | null>(null)
    const [isChartLoading, setIsChartLoading] = useState(false)

    // Chart data state
    const [chartData, setChartData] = useState<any[]>([])
    const chartRef = useRef<any>(null)

    // Dynamic data from backend
    const [portfolio, setPortfolio] = useState<any>(null)
    const [balance, setBalance] = useState<any>(null)
    const [positions, setPositions] = useState<any[]>([])
    const [transactions, setTransactions] = useState<any[]>([])
    const [depositAmount, setDepositAmount] = useState("")
    const [paymentMethod, setPaymentMethod] = useState("bank_transfer")

    // Live price states
    const [livePrices, setLivePrices] = useState<Map<string, any>>(new Map())

    // Extract crypto symbols from positions
    const cryptoSymbols = positions
        .filter(p => p.assetType === 'crypto' || p.assetType === 'cryptocurrency')
        .map(p => p.symbol.toUpperCase())

    // Extract forex symbols from positions
    const forexSymbols = positions
        .filter(p => p.assetType === 'forex')
        .map(p => p.symbol)

    // Subscribe to crypto WebSocket for live prices
    const { allData: cryptoData, isConnected: cryptoConnected } = useCryptoPrices(
        cryptoSymbols,
        cryptoSymbols.length > 0 && isAuthenticated
    )

    // Subscribe to forex WebSocket for live prices
    const {
        forexRates,
        isConnected: forexConnected
    } = useFinnhubForex({
        symbolsToSubscribe: forexSymbols,
        autoConnect: forexSymbols.length > 0 && isAuthenticated,
        autoSubscribe: forexSymbols.length > 0 && isAuthenticated
    })

    // Update live prices when WebSocket data changes
    useEffect(() => {
        const updatedPrices = new Map<string, any>()

        // Add crypto prices
        cryptoData.forEach((data, symbol) => {
            updatedPrices.set(symbol, {
                price: parseFloat(data.price),
                change: parseFloat(data.changePercent),
                high: parseFloat(data.high),
                low: parseFloat(data.low),
                volume: parseFloat(data.volume),
                type: 'crypto'
            })
        })

        // Add forex prices
        Object.entries(forexRates).forEach(([symbol, data]: [string, any]) => {
            updatedPrices.set(symbol, {
                price: data.price,
                change: data.percentChange || 0,
                timestamp: data.timestamp,
                type: 'forex'
            })
        })

        setLivePrices(updatedPrices)
    }, [cryptoData, forexRates])

    // Calculate portfolio stats with live prices
    const calculateLiveStats = () => {
        if (!positions || !balance) return null

        let totalValue = balance.availableBalance
        let totalPnL = 0
        let totalInvested = 0

        positions.forEach(pos => {
            const livePrice = livePrices.get(pos.symbol)
            const currentPrice = livePrice?.price || pos.currentPrice || pos.averagePrice
            const marketValue = currentPrice * pos.quantity

            totalValue += marketValue
            totalInvested += pos.averagePrice * pos.quantity
            totalPnL += marketValue - (pos.averagePrice * pos.quantity)
        })

        const pnlPercent = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0

        return {
            totalValue,
            totalPnL,
            pnlPercent,
            totalInvested
        }
    }

    const liveStats = calculateLiveStats()

    // Portfolio summary data (with live updates)
    const portfolioStats = {
        totalValue: liveStats ? `$${liveStats.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "$0.00",
        cashUSD: balance ? `$${balance.availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "$0.00",
        totalPL: liveStats ? `$${liveStats.totalPnL.toLocaleString('en-US', { minimumFractionDigits: 2 })} (${liveStats.pnlPercent.toFixed(2)}%)` : "$0 (0%)",
        btcLedger: liveStats ? `$${liveStats.totalInvested.toLocaleString('en-US', { minimumFractionDigits: 2 })} (${liveStats.totalInvested > 0 ? ((liveStats.totalPnL / liveStats.totalInvested) * 100).toFixed(2) : '0.00'}%)` : "$0 (0%)"
    }

    // Fetch chart data based on timeframe
    const fetchChartData = async (timeframe: string) => {
        try {
            setIsChartLoading(true)
            console.log(`📊 Fetching chart data for ${timeframe}...`)

            const { from, to, resolution } = getTimeframeInSeconds(timeframe)


        } catch (error) {
            console.error('❌ Error fetching chart data:', error)
            setChartData(generateFallbackData(timeframe))
        } finally {
            setIsChartLoading(false)
        }
    }

    // Generate fallback data
    const generateFallbackData = (timeframe: string) => {
        const now = Date.now()
        const points: [number, number][] = []
        const { seconds } = getTimeframeInSeconds(timeframe)
        const numPoints = Math.min(50, Math.floor(seconds / 3600))
        const interval = seconds * 1000 / numPoints

        let price = 67000
        for (let i = 0; i < numPoints; i++) {
            const timestamp = now - ((numPoints - i) * interval)
            price = price + (Math.random() - 0.5) * 2000
            price = Math.max(45000, Math.min(70000, price))
            points.push([timestamp, Math.round(price)])
        }

        return points
    }

    // Check authentication and fetch initial data
    useEffect(() => {
        const initializeData = async () => {
            try {
                setIsLoading(true)
                console.log('🔐 Checking authentication...')

                const meData = await api.auth.getMe()

                if (meData?.me) {
                    console.log('✅ User authenticated:', meData.me.email)
                    setIsAuthenticated(true)
                    setAuthError(null)

                    console.log('📊 Fetching portfolio data...')
                    const [portfolioData, balanceData, positionsData, transactionsData] = await Promise.all([
                        api.user.getPortfolio().catch((err) => {
                            console.error('❌ Portfolio fetch error:', err)
                            return null
                        }),
                        api.user.getBalance().catch((err) => {
                            console.error('❌ Balance fetch error:', err)
                            return null
                        }),
                        api.positions.getAll().catch((err) => {
                            console.error('❌ Positions fetch error:', err)
                            return { positions: [] }
                        }),
                        api.transactions.getAll({ page: 1, limit: 10 }).catch((err) => {
                            console.error('❌ Transactions fetch error:', err)
                            return { transactions: { transactions: [] } }
                        })
                    ])

                    console.log('✅ Data fetched successfully')
                    console.log('📈 Positions:', positionsData?.positions)

                    setPortfolio(portfolioData?.userPortfolio || {
                        totalValue: 0,
                        totalInvested: 0,
                        totalProfitLoss: 0,
                        profitLossPercentage: 0,
                        activePositions: 0,
                        closedPositions: 0
                    })

                    setBalance(balanceData?.userBalance || {
                        totalBalance: 0,
                        availableBalance: 0,
                        totalInvested: 0,
                        totalProfit: 0,
                        totalLoss: 0
                    })

                    setPositions(positionsData?.positions || [])
                    setTransactions(transactionsData?.transactions?.transactions || [])

                    // Fetch initial chart data
                    await fetchChartData('1D')
                } else {
                    throw new Error('No user data returned')
                }
            } catch (error: any) {
                console.error('❌ Authentication or data fetch failed:', error)
                setIsAuthenticated(false)
                setAuthError(error.message || 'Authentication failed')
            } finally {
                setIsLoading(false)
            }
        }

        initializeData()
    }, [])

    // Update chart when timeframe changes
    useEffect(() => {
        if (isAuthenticated && !isLoading) {
            fetchChartData(chartType)
        }
    }, [chartType])

    // Performance buttons
    const performanceFilters = ["Assets", "Forex", "Crypto"]
    const chartButtons = ["All", "1D", "1W", "1M", "3M", "1Y", "5Y", "Max"]

    // Allocation data
    const allocations = calculateAllocations(positions, balance)

    // Risk & Insurance data
    const riskData = {
        avgDailyValue: liveStats && liveStats.pnlPercent ? `${Math.abs(liveStats.pnlPercent / 30).toFixed(2)}% daily volatility` : "N/A",
        lossInsurance: balance ? `$${(balance.totalBalance * 0.1).toFixed(2)} reserve` : "$0",
        available: "Insurance coverage coming soon",
        dividendYield: liveStats && liveStats.totalValue > 0 ? `${((liveStats.totalPnL / liveStats.totalValue) * 100).toFixed(2)}% return` : "0%",
        coverage: "Automated risk management active"
    }

    // Recent activity
    const recentActivity = transactions.slice(0, 6).map(tx => {
        const date = new Date(tx.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        let action = `${tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}: $${tx.amount.toFixed(2)}`

        return {
            date: tx.status === 'pending' ? 'Pending' : date,
            action,
            value: tx.type === 'deposit' || tx.type === 'profit' ? `+$${tx.amount.toFixed(2)}` : tx.type === 'withdrawal' || tx.type === 'loss' ? `-$${tx.amount.toFixed(2)}` : undefined,
            status: tx.status === 'pending' ? 'Pending' : undefined
        }
    })

    // Positions table data with LIVE prices
    const formattedPositions = positions.map(pos => {
        const livePrice = livePrices.get(pos.symbol)
        const currentPrice = livePrice?.price || pos.currentPrice || pos.averagePrice
        const marketValue = currentPrice * pos.quantity
        const unrealizedPnL = marketValue - (pos.averagePrice * pos.quantity)
        const unrealizedPnLPercent = pos.averagePrice > 0 ? (unrealizedPnL / (pos.averagePrice * pos.quantity)) * 100 : 0
        const priceChange = livePrice?.change || 0

        return {
            symbol: pos.symbol,
            name: pos.symbol,
            qty: pos.quantity.toString(),
            price: `$${currentPrice.toFixed(2)}`,
            value: `$${marketValue.toFixed(2)}`,
            pl: `$${unrealizedPnL.toFixed(2)}`,
            roi: `${unrealizedPnLPercent >= 0 ? '+' : ''}${unrealizedPnLPercent.toFixed(2)}%`,
            action: `${priceChange >= 0 ? '+' : ''}${priceChange.toFixed(1)}%`,
            isLive: !!livePrice,
            assetType: pos.assetType
        }
    })

    if (balance && balance.availableBalance > 0) {
        formattedPositions.push({
            symbol: "Cash",
            name: "Unallocated",
            qty: "-",
            price: "-",
            value: "-",
            pl: "-",
            roi: `$${balance.availableBalance.toFixed(2)}`,
            action: "0%",
            isLive: false,
            assetType: 'cash'
        })
    }

    // Dynamic chart configuration
    const chartOptions: ChartProps["options"] = {
        chart: {
            id: "portfolio-chart",
            type: 'area',
            toolbar: {
                show: true,
                tools: {
                    download: false,
                    zoom: true,
                    zoomin: true,
                    zoomout: true,
                    pan: true,
                    reset: true
                }
            },
            background: '#1a1a1a',
            foreColor: '#9ca3af',
            animations: {
                enabled: true,
                speed: 800,
                animateGradually: {
                    enabled: true,
                    delay: 150
                },
                dynamicAnimation: {
                    enabled: true,
                    speed: 350
                }
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth',
            width: 2
        },
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.7,
                opacityTo: 0.2,
                stops: [0, 90, 100]
            }
        },
        xaxis: {
            type: 'datetime',
            labels: {
                style: { colors: "#6b7280", fontSize: '10px' },
                datetimeUTC: false
            },
            axisBorder: { color: '#374151' }
        },
        yaxis: {
            labels: {
                style: { colors: "#6b7280", fontSize: '10px' },
                formatter: (val: number) => `$${val.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
            },
            opposite: true
        },
        grid: {
            borderColor: "#374151",
            strokeDashArray: 2
        },
        colors: ['#10b981'],
        tooltip: {
            theme: "dark",
            x: {
                format: chartType === '1D' ? 'HH:mm' : chartType === '1W' ? 'dd MMM HH:mm' : 'dd MMM yyyy'
            },
            y: {
                formatter: (val: number) => `$${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
            }
        },
        noData: {
            text: 'Loading chart data...',
            align: 'center',
            verticalAlign: 'middle',
            style: {
                color: '#9ca3af',
                fontSize: '14px'
            }
        }
    }

    const chartSeries = [{
        name: 'Portfolio Value',
        data: chartData
    }]

    // Handle deposit
    const handleDeposit = async () => {
        if (!isAuthenticated || !depositAmount) return

        try {
            console.log('💰 Processing deposit...')
            await api.transactions.createDeposit({
                amount: parseFloat(depositAmount),
                currency: "USD",
                paymentMethod: paymentMethod as any,
                bankDetails: {}
            })

            console.log('✅ Deposit request submitted')
            alert("Deposit request submitted successfully!")
            setIsDepositModalOpen(false)
            setDepositAmount("")

            const balanceData = await api.user.getBalance()
            setBalance(balanceData?.userBalance)

            const transactionsData = await api.transactions.getAll({ page: 1, limit: 10 })
            setTransactions(transactionsData?.transactions?.transactions || [])
        } catch (error: any) {
            console.error('❌ Deposit failed:', error)
            alert(`Deposit failed: ${error.message}`)
        }
    }

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950 text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
                    <p className="text-slate-400">Loading portfolio data...</p>
                    <p className="text-xs text-slate-500 mt-2">Authenticating and fetching your data</p>
                </div>
            </div>
        )
    }

    // Not authenticated state
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950 text-white flex items-center justify-center">
                <div className="text-center max-w-md mx-auto p-6">
                    <div className="mb-6">
                        <svg className="w-16 h-16 mx-auto text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <h2 className="text-2xl font-bold mb-2">Authentication Required</h2>
                        <p className="text-slate-400 mb-2">Please log in to view your portfolio</p>
                        {authError && (
                            <p className="text-sm text-red-400 bg-red-400/10 px-4 py-2 rounded-lg mt-4">
                                Error: {authError}
                            </p>
                        )}
                    </div>
                    <div className="flex gap-3 justify-center">
                        <Button
                            className="bg-emerald-500 hover:bg-emerald-600 text-white"
                            onClick={() => window.location.href = '/login'}
                        >
                            Go to Login
                        </Button>
                        <Button
                            variant="outline"
                            className="border-slate-600 text-slate-300 hover:bg-slate-800"
                            onClick={() => window.location.href = '/register'}
                        >
                            Register
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950 text-white p-6">
            <div className="max-w-[1600px] mx-auto">
                {/* Header */}
                <div className="mb-6 flex justify-between items-end">
                    <div>
                        <h1 className="text-2xl font-bold mb-1 text-white">Portfolio</h1>
                        <p className="text-sm text-slate-400">
                            Live tracking of your positions
                            {(cryptoConnected || forexConnected) && (
                                <span className="ml-2 inline-flex items-center">
                                    <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse mr-1"></span>
                                    <span className="text-emerald-400 text-xs">Live</span>
                                </span>
                            )}
                        </p>
                    </div>
                    <Button className="bg-emerald-500 hover:bg-emerald-600 text-white" onClick={() => window.location.href = '/dashboard/wallet'}>
                        Deposit Funds
                    </Button>
                </div>

                {/* Portfolio Summary Cards - NOW WITH LIVE DATA */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <SummaryCard label="Total Value" value={portfolioStats.totalValue} />
                    <SummaryCard label="Cash (USD)" value={portfolioStats.cashUSD} />
                    <SummaryCard
                        label="Total P/L"
                        value={portfolioStats.totalPL}
                        valueColor={liveStats && liveStats.totalPnL >= 0 ? "text-emerald-400" : "text-red-400"}
                    />
                    <SummaryCard label="Total Invested" value={portfolioStats.btcLedger} valueColor="text-emerald-400" />
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left Column - Chart & Positions */}
                    <div className="col-span-1 lg:col-span-8 space-y-6">
                        {/* Positions Table with LIVE PRICES */}
                        <div className="bg-transparent rounded-lg border border-white/5 p-4 lg:p-5 overflow-hidden">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                                <h2 className="text-lg font-bold text-white">Your Positions</h2>
                                <div className="flex items-center gap-2 text-[10px] lg:text-xs text-slate-400">
                                    {cryptoConnected && (
                                        <span className="flex items-center">
                                            <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse mr-1"></span>
                                            Crypto Live
                                        </span>
                                    )}
                                    {forexConnected && (
                                        <span className="flex items-center ml-2">
                                            <span className="h-2 w-2 bg-blue-500 rounded-full animate-pulse mr-1"></span>
                                            Forex Live
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="overflow-x-auto -mx-4 lg:mx-0">
                                <div className="min-w-[600px] px-4 lg:px-0">
                                    <PositionsTable positions={formattedPositions} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Allocation & Risk */}
                    <div className="col-span-1 lg:col-span-4 space-y-6">
                        {/* Allocation Section */}

                        {/* Risk & Insurance Section */}
                        <div className="bg-transparent rounded-lg border border-white/5 p-4 lg:p-5">
                            <h2 className="text-lg font-bold mb-4 text-white">Risk & Insurance</h2>

                            <div className="space-y-4">
                                <div>
                                    <div className="text-xs text-slate-400 mb-1">Avg. Daily portfolio volatility</div>
                                    <div className="text-sm font-semibold text-white">{riskData.avgDailyValue}</div>
                                </div>

                                <div>
                                    <div className="text-xs text-slate-400 mb-1">Loss insurance</div>
                                    <div className="text-sm font-semibold text-white">{riskData.lossInsurance}</div>
                                    <div className="text-xs text-slate-500">{riskData.available}</div>
                                </div>

                                <div>
                                    <div className="text-xs text-slate-400 mb-1">Portfolio Return</div>
                                    <div className="text-sm font-semibold text-white">{riskData.dividendYield}</div>
                                    <div className="text-xs text-slate-500">{riskData.coverage}</div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity Section */}
                        <div className="bg-transparent rounded-lg border border-white/5 p-4 lg:p-5">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold text-white">Recent activity</h2>
                                <button className="px-3 py-1 rounded bg-white/5 text-slate-400 text-xs font-medium hover:bg-white/10 hover:text-white">
                                    View all
                                </button>
                            </div>

                            <div className="space-y-3">
                                {recentActivity.length > 0 ? (
                                    recentActivity.map((activity, idx) => (
                                        <div key={idx} className="flex items-start justify-between pb-3 border-b border-white/5 last:border-0">
                                            <div className="flex-1">
                                                <div className="text-xs text-slate-400 mb-1">{activity.date}</div>
                                                <div className="text-sm text-slate-300">{activity.action}</div>
                                                {activity.status && (
                                                    <span className="inline-block mt-1 px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded">
                                                        {activity.status}
                                                    </span>
                                                )}
                                            </div>
                                            {activity.value && (
                                                <div className={`text-sm font-semibold ${activity.value.includes('+') ? 'text-emerald-400' : 'text-red-400'
                                                    }`}>
                                                    {activity.value}
                                                </div>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8">
                                        <p className="text-slate-500 text-sm">No recent activity</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Deposit Modal */}
            <Modal
                isOpen={isDepositModalOpen}
                onClose={() => setIsDepositModalOpen(false)}
                title="Deposit Funds"
            >
                <div className="space-y-4">
                    <p className="text-sm text-slate-400">Add funds to your portfolio securely.</p>
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-slate-300">Amount (USD)</label>
                        <Input
                            type="number"
                            placeholder="0.00"
                            value={depositAmount}
                            onChange={(e) => setDepositAmount(e.target.value)}
                            className="bg-slate-900 border-white/10 text-white"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-slate-300">Payment Method</label>
                        <select
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="w-full bg-slate-900 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                        >
                            <option value="bank_transfer">Bank Transfer</option>
                            <option value="credit_card">Credit Card</option>
                            <option value="debit_card">Debit Card</option>
                            <option value="crypto">Crypto Deposit</option>
                        </select>
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                        <Button variant="ghost" onClick={() => setIsDepositModalOpen(false)}>Cancel</Button>
                        <Button
                            className="bg-emerald-500 hover:bg-emerald-600 text-white"
                            onClick={handleDeposit}
                            disabled={!depositAmount || parseFloat(depositAmount) <= 0}
                        >
                            Proceed to Payment
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}
