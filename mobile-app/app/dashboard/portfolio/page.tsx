'use client'

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { Modal } from "@/components/ui/modal"
import { Input } from "@/components/ui/input"
import { SummaryCard } from "@/components/dashboard/SummaryCard"
import { PositionsTable } from "@/components/dashboard/PositionsTable"
import { AllocationCard } from "@/components/dashboard/AllocationCard"
import { Props as ChartProps } from "react-apexcharts"
import { api } from "@/lib/api"

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

    // Group by asset type
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

export default function PortfolioDashboard() {
    const [activeTab, setActiveTab] = useState("All Assets")
    const [chartType, setChartType] = useState("1D")
    const [isDepositModalOpen, setIsDepositModalOpen] = useState(false)
    const [token, setToken] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    // Dynamic data from backend
    const [portfolio, setPortfolio] = useState<any>(null)
    const [balance, setBalance] = useState<any>(null)
    const [positions, setPositions] = useState<any[]>([])
    const [transactions, setTransactions] = useState<any[]>([])
    const [depositAmount, setDepositAmount] = useState("")
    const [paymentMethod, setPaymentMethod] = useState("bank_transfer")

    // Portfolio summary data (dynamic)
    const portfolioStats = {
        totalValue: balance ? `$${balance.totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "$0.00",
        cashUSD: balance ? `$${balance.availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "$0.00",
        totalPL: portfolio ? `$${portfolio.totalProfitLoss.toLocaleString('en-US', { minimumFractionDigits: 2 })} (${portfolio.profitLossPercentage.toFixed(2)}%)` : "$0 (0%)",
        btcLedger: balance ? `$${balance.totalInvested.toLocaleString('en-US', { minimumFractionDigits: 2 })} (${balance.totalInvested > 0 ? ((balance.totalProfit / balance.totalInvested) * 100).toFixed(2) : '0.00'}%)` : "$0 (0%)"
    }

    // Get token from localStorage
    useEffect(() => {
        const storedToken = localStorage.getItem('authToken') || localStorage.getItem('token')
        setToken(storedToken)
    }, [])

    // Fetch portfolio, balance, positions, and transactions
    useEffect(() => {
        const fetchData = async () => {
            if (!token) return

            setIsLoading(true)
            try {
                const [portfolioData, balanceData, positionsData, transactionsData] = await Promise.all([
                    api.user.getPortfolio().catch(() => null),
                    api.user.getBalance().catch(() => null),
                    api.positions.getAll().catch(() => ({ positions: [] })),
                    api.transactions.getAll({ page: 1, limit: 10 }).catch(() => ({ transactions: { transactions: [] } }))
                ])

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
            } catch (error) {
                console.error('Error fetching portfolio data:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [token])

    // Performance buttons (removed Stocks, keeping only crypto/forex)
    const performanceFilters = ["Assets", "Forex", "Crypto"]
    const chartButtons = ["All", "1D", "1W", "1M", "3M", "1Y", "5Y", "Max"]

    // Allocation data (calculate from positions)
    const allocations = calculateAllocations(positions, balance)

    // Risk & Insurance data (calculated from portfolio)
    const riskData = {
        avgDailyValue: portfolio && portfolio.profitLossPercentage ? `${Math.abs(portfolio.profitLossPercentage / 30).toFixed(2)}% daily volatility` : "N/A",
        lossInsurance: balance ? `$${(balance.totalBalance * 0.1).toFixed(2)} reserve` : "$0",
        available: "Insurance coverage coming soon",
        dividendYield: balance && balance.totalProfit ? `${((balance.totalProfit / balance.totalBalance) * 100).toFixed(2)}% return` : "0%",
        coverage: "Automated risk management active"
    }

    // Recent activity (from transactions)
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

    // Positions table data (formatted from backend)
    const formattedPositions = positions.map(pos => ({
        symbol: pos.symbol,
        name: pos.symbol,
        qty: pos.quantity.toString(),
        price: `$${pos.currentPrice?.toFixed(2) || pos.averagePrice.toFixed(2)}`,
        value: `$${pos.marketValue?.toFixed(2) || '0.00'}`,
        pl: pos.unrealizedPnL ? `$${pos.unrealizedPnL.toFixed(2)}` : '$0.00',
        roi: pos.unrealizedPnLPercent ? `${pos.unrealizedPnLPercent >= 0 ? '+' : ''}${pos.unrealizedPnLPercent.toFixed(2)}%` : '0%',
        action: pos.unrealizedPnLPercent ? `${pos.unrealizedPnLPercent >= 0 ? '+' : ''}${pos.unrealizedPnLPercent.toFixed(1)}%` : '0%'
    }))

    // Add cash position
    if (balance && balance.availableBalance > 0) {
        formattedPositions.push({
            symbol: "Cash",
            name: "Unallocated",
            qty: "-",
            price: "-",
            value: "-",
            pl: "-",
            roi: `$${balance.availableBalance.toFixed(2)}`,
            action: "0%"
        })
    }

    // Chart configuration
    const chartOptions: ChartProps["options"] = {
        chart: {
            id: "btc-chart",
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
            foreColor: '#9ca3af'
        },
        xaxis: {
            type: 'datetime',
            labels: {
                style: { colors: "#6b7280", fontSize: '10px' }
            },
            axisBorder: { color: '#374151' }
        },
        yaxis: {
            labels: {
                style: { colors: "#6b7280", fontSize: '10px' },
                formatter: (val: number) => `$${val.toLocaleString()}`
            },
            opposite: true
        },
        grid: {
            borderColor: "#374151",
            strokeDashArray: 2
        },
        stroke: {
            curve: 'smooth',
            width: 2
        },
        colors: ['#ef4444'],
        tooltip: {
            theme: "dark",
            x: { format: 'dd MMM HH:mm' }
        },
        annotations: {
            yaxis: [
                {
                    y: 67000,
                    borderColor: '#10b981',
                    label: {
                        borderColor: '#10b981',
                        style: { color: '#fff', background: '#10b981' },
                        text: 'BTC'
                    }
                },
                {
                    y: 45000,
                    borderColor: '#f59e0b',
                    label: {
                        borderColor: '#f59e0b',
                        style: { color: '#fff', background: '#f59e0b' },
                        text: 'ETH'
                    }
                }
            ]
        }
    }

    const chartSeries = [{
        name: 'BTC/USD',
        data: [
            [new Date('2023-10-01').getTime(), 67000],
            [new Date('2023-10-05').getTime(), 65000],
            [new Date('2023-10-10').getTime(), 58000],
            [new Date('2023-10-15').getTime(), 62000],
            [new Date('2023-10-20').getTime(), 55000],
            [new Date('2023-10-25').getTime(), 48000],
            [new Date('2023-11-01').getTime(), 52000],
            [new Date('2023-11-05').getTime(), 58000],
            [new Date('2023-11-10').getTime(), 54000],
            [new Date('2023-11-15').getTime(), 61000],
            [new Date('2023-11-20').getTime(), 58000],
            [new Date('2023-11-25').getTime(), 67000],
        ]
    }]

    // Handle deposit
    const handleDeposit = async () => {
        if (!token || !depositAmount) return

        try {
            await api.transactions.createDeposit({
                amount: parseFloat(depositAmount),
                currency: "USD",
                paymentMethod: paymentMethod as any,
                bankDetails: {}
            })

            alert("Deposit request submitted successfully!")
            setIsDepositModalOpen(false)
            setDepositAmount("")

            // Refresh data
            const balanceData = await api.user.getBalance()
            setBalance(balanceData?.userBalance)
        } catch (error: any) {
            alert(`Deposit failed: ${error.message}`)
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950 text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
                    <p className="text-slate-400">Loading portfolio data...</p>
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
                        <p className="text-sm text-slate-400">Overview of Bitcoin, across Stocks, Forex, and Crypto</p>
                    </div>
                    <Button className="bg-emerald-500 hover:bg-emerald-600 text-white" onClick={() => setIsDepositModalOpen(true)}>
                        Deposit Funds
                    </Button>
                </div>

                {/* Portfolio Summary Cards */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                    <SummaryCard label="Total Value" value={portfolioStats.totalValue} />
                    <SummaryCard label="Cash (USD)" value={portfolioStats.cashUSD} />
                    <SummaryCard label="Total P/L" value={portfolioStats.totalPL} valueColor="text-emerald-400" />
                    <SummaryCard label="BTC Ledger" value={portfolioStats.btcLedger} valueColor="text-emerald-400" />
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-12 gap-6">
                    {/* Left Column - Chart */}
                    <div className="col-span-8">
                        {/* Performance Section */}
                        <div className="bg-transparent rounded-lg border border-white/5 p-5 mb-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold text-white">Performance</h2>
                                <div className="flex items-center gap-2">
                                    {performanceFilters.map((filter) => (
                                        <button
                                            key={filter}
                                            className={`px-3 py-1.5 rounded text-xs font-medium transition ${filter === "All Assets"
                                                ? 'bg-emerald-500 text-white hover:bg-emerald-500/90'
                                                : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                                                }`}
                                        >
                                            {filter}
                                        </button>
                                    ))}
                                    <button className="px-3 py-1.5 rounded text-xs font-medium bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white">
                                        Crypto
                                    </button>
                                </div>
                            </div>

                            <div className="text-xs text-slate-400 mb-4">BTC converts to USD (2024)</div>

                            {/* Chart */}
                            <div className="bg-black/40 rounded-lg p-4 border border-white/5">
                                <Chart
                                    options={chartOptions}
                                    series={chartSeries}
                                    type="area"
                                    height={300}
                                />
                            </div>

                            {/* Chart Time Filters */}
                            <div className="flex items-center justify-between mt-4">
                                <div className="flex items-center gap-2">
                                    {chartButtons.map((btn) => (
                                        <button
                                            key={btn}
                                            onClick={() => setChartType(btn)}
                                            className={`px-3 py-1 rounded text-xs font-medium transition ${chartType === btn
                                                ? 'bg-emerald-500 text-white hover:bg-emerald-500/90'
                                                : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                                                }`}
                                        >
                                            {btn}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="flex items-center gap-1 text-xs">
                                        <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                                        <span className="text-slate-400">USD</span>
                                    </span>
                                    <span className="flex items-center gap-1 text-xs">
                                        <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                                        <span className="text-slate-400">BTC</span>
                                    </span>
                                </div>
                            </div>

                            <div className="text-xs text-slate-500 mt-2">
                                Source: CBOE, CME AG, Binance, Coinbit, TSXUSDF, CBOE, Crypto.co
                            </div>
                        </div>

                        {/* Positions Table */}
                        <PositionsTable positions={formattedPositions} />
                    </div>

                    {/* Right Column - Allocation & Risk */}
                    <div className="col-span-4">
                        {/* Allocation Section */}
                        <AllocationCard allocations={allocations} />

                        {/* Risk & Insurance Section */}
                        <div className="bg-transparent rounded-lg border border-white/5 p-5 mb-6">
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
                                    <div className="text-xs text-slate-400 mb-1">Dividend yield</div>
                                    <div className="text-sm font-semibold text-white">{riskData.dividendYield}</div>
                                    <div className="text-xs text-slate-500">{riskData.coverage}</div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity Section */}
                        <div className="bg-transparent rounded-lg border border-white/5 p-5">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold text-white">Recent activity</h2>
                                <button className="px-3 py-1 rounded bg-white/5 text-slate-400 text-xs font-medium hover:bg-white/10 hover:text-white">
                                    View all
                                </button>
                            </div>

                            <div className="space-y-3">
                                {recentActivity.map((activity, idx) => (
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
                                ))}
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
