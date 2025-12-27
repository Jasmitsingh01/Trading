'use client'

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { ChevronRight, Activity } from "lucide-react"
import { Tabs } from "@/components/ui/tabs"
import { SearchInput } from "@/components/ui/search-input"
import { MarketTable } from "@/components/dashboard/MarketTable"
import { Modal } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { api } from "@/lib/api"
import { fetchAllCryptoData, type CryptoData } from "@/lib/binance"
import { useBinanceWebSocket } from "@/hooks/useBinanceWebSocket"
import useFinnhubForex from "@/hooks/useFinnhubForex"

export default function Markets() {
    const router = useRouter()
    const [activeTab, setActiveTab] = useState<"All" | "Crypto" | "Forex">("All")
    const [searchQuery, setSearchQuery] = useState("")
    const [isTradeModalOpen, setIsTradeModalOpen] = useState(false)
    const [selectedAsset, setSelectedAsset] = useState<any>(null)
    const [token, setToken] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(50)

    // Dynamic Data States
    const [marketOverview, setMarketOverview] = useState<any[]>([])
    const [majorIndices, setMajorIndices] = useState<any[]>([])
    const [topMovers, setTopMovers] = useState<any[]>([])

    // Symbol Lists
    const [cryptoSymbols, setCryptoSymbols] = useState<CryptoData[]>([])
    const [areSymbolsLoaded, setAreSymbolsLoaded] = useState(false)

    // Get top crypto symbols for WebSocket subscription
    const topCryptoSymbols = useMemo(() => {
        return cryptoSymbols.slice(0, 100).map(c => c.symbol)
    }, [cryptoSymbols])

    // Subscribe to real-time crypto prices
    const { allData: liveCryptoPrices, isConnected: isCryptoConnected } = useBinanceWebSocket({
        symbols: topCryptoSymbols,
        enabled: topCryptoSymbols.length > 0
    })

    // Subscribe to real-time forex prices
    const {
        forexRates: liveForexPrices,
        forexSymbols,
        loading: isLoadingForex,
        error: forexError,
        isConnected: isForexConnected,
        symbolCount: forexSymbolCount
    } = useFinnhubForex({
        exchange: 'oanda',
        autoConnect: true,
        autoSubscribe: true
    })

    // Handle Trade Click - Navigate to Trading Page
    const handleTradeClick = (symbol: string, assetType: string) => {
        localStorage.setItem('selectedSymbol', symbol)
        localStorage.setItem('selectedAssetType', assetType)
        router.push('/dashboard/trading')
    }

    // Get token from localStorage
    useEffect(() => {
        const storedToken = localStorage.getItem('authToken')
        setToken(storedToken)
    }, [])

    // Fetch Symbol Lists (Once)
    useEffect(() => {
        const fetchSymbols = async () => {
            if (areSymbolsLoaded) return

            try {
                console.log("📊 Fetching crypto symbols from Binance...")
                const crypto = await fetchAllCryptoData()
                console.log("✅ Crypto symbols received:", crypto?.length || 0)

                setCryptoSymbols(crypto)
                setAreSymbolsLoaded(true)
            } catch (err) {
                console.error("❌ Error fetching symbol lists:", err)
                setAreSymbolsLoaded(true)
            }
        }

        fetchSymbols()
    }, [areSymbolsLoaded])

    // Prepare crypto data
    const cryptoData = useMemo(() => {
        return cryptoSymbols.map((c: CryptoData) => {
            const liveData = liveCryptoPrices.get(c.symbol)

            return {
                symbol: c.symbol.replace('USDT', '/USDT'),
                category: c.baseAsset,
                price: liveData?.price || c.price,
                change: liveData?.change || c.change,
                changePercent: (liveData?.changePercent || c.changePercent) + "%",
                action: "Trade",
                pair: "Crypto",
                value: liveData?.price || c.price,
                type: 'crypto',
                rawSymbol: c.symbol
            }
        })
    }, [cryptoSymbols, liveCryptoPrices])

    // Prepare forex data
    const forexData = useMemo(() => {
        const data: any[] = []

        if (liveForexPrices && forexSymbols.length > 0) {
            forexSymbols.forEach((forexSymbol: any) => {
                const symbol = forexSymbol.symbol || forexSymbol.displaySymbol || forexSymbol
                const rate = liveForexPrices[symbol]

                if (rate) {
                    const prevPrice = rate.price - (rate.change || 0)
                    const changePercent = prevPrice !== 0 ? ((rate.change || 0) / prevPrice) * 100 : 0

                    data.push({
                        symbol: symbol,
                        category: forexSymbol.description || symbol,
                        price: rate.price.toFixed(5),
                        change: (rate.change || 0).toFixed(5),
                        changePercent: changePercent.toFixed(2) + "%",
                        action: "Trade",
                        pair: "Forex",
                        value: rate.price.toFixed(5),
                        type: 'forex',
                        rawSymbol: symbol
                    })
                }
            })
        }

        return data
    }, [liveForexPrices, forexSymbols])

    // Filter data based on active tab and search
    const filteredData = useMemo(() => {
        let data: any[] = []

        // Select data based on tab
        if (activeTab === "Crypto") {
            data = cryptoData
        } else if (activeTab === "Forex") {
            data = forexData
        } else {
            // "All" tab - combine both
            data = [...cryptoData, ...forexData]
        }

        // Apply search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase()
            data = data.filter(item =>
                item.symbol.toLowerCase().includes(query) ||
                item.category.toLowerCase().includes(query) ||
                item.pair.toLowerCase().includes(query)
            )
        }

        return data
    }, [activeTab, cryptoData, forexData, searchQuery])

    // Update market overview when filtered data changes
    useEffect(() => {
        setMarketOverview(filteredData)
        setIsLoading(false)
    }, [filteredData])

    // Calculate major indices (top 3 from current view)
    useEffect(() => {
        if (filteredData.length >= 3) {
            const topThree = filteredData.slice(0, 3).map((item: any) => ({
                name: item.category,
                value: parseFloat(item.price).toLocaleString('en-US', {
                    minimumFractionDigits: item.type === 'forex' ? 5 : 2,
                    maximumFractionDigits: item.type === 'forex' ? 5 : 2
                }),
                change: item.changePercent,
                isPositive: parseFloat(item.changePercent) >= 0
            }))
            setMajorIndices(topThree)
        }
    }, [filteredData])

    // Calculate top movers
    useEffect(() => {
        if (filteredData.length > 0) {
            const sortedByChange = [...filteredData].sort((a, b) =>
                parseFloat(b.changePercent) - parseFloat(a.changePercent)
            )

            setTopMovers([
                {
                    category: "Top Gainers",
                    movers: sortedByChange.slice(0, 5).map(m => ({
                        symbol: m.symbol,
                        name: m.category,
                        change: m.changePercent,
                        type: m.type
                    }))
                },
                {
                    category: "Top Losers",
                    movers: sortedByChange.slice(-5).reverse().map(m => ({
                        symbol: m.symbol,
                        name: m.category,
                        change: m.changePercent,
                        type: m.type
                    }))
                }
            ])
        }
    }, [filteredData])

    // Calculate dynamic Market Stats
    const calculateMarketStats = () => {
        const stats = {
            crypto: {
                count: cryptoData.length,
                connected: isCryptoConnected
            },
            forex: {
                count: forexData.length,
                connected: isForexConnected
            }
        }

        const currentData = activeTab === "Crypto" ? cryptoData :
            activeTab === "Forex" ? forexData :
                [...cryptoData, ...forexData]

        const totalAssets = currentData.length
        const volatility = majorIndices.length > 0
            ? Math.abs(parseFloat(majorIndices[0].change) || 0)
            : 0

        return {
            totalAssets: totalAssets.toLocaleString(),
            cryptoCount: stats.crypto.count,
            forexCount: stats.forex.count,
            volatility: volatility.toFixed(2) + "%",
            timeframe: "24h Change",
            cryptoStatus: stats.crypto.connected ? "Live" : "Connecting...",
            forexStatus: stats.forex.connected ? "Live" : "Connecting...",
            overallStatus: (activeTab === "Crypto" && stats.crypto.connected) ||
                (activeTab === "Forex" && stats.forex.connected) ||
                (activeTab === "All" && (stats.crypto.connected || stats.forex.connected))
                ? "Live" : "Connecting..."
        }
    }

    const marketStats = calculateMarketStats()

    // Watchlists
    const watchlists = useMemo(() => {
        const lists = []

        if (activeTab === "All" || activeTab === "Crypto") {
            lists.push({
                name: "Crypto Gainers",
                subtitle: "Best performing crypto 24h",
                count: `${topMovers[0]?.movers?.filter((m: any) => m.type === 'crypto').length || 0} symbols`,
                icon: "🚀"
            })
        }

        if (activeTab === "All" || activeTab === "Forex") {
            lists.push({
                name: "Forex Movers",
                subtitle: "Active forex pairs",
                count: `${topMovers[0]?.movers?.filter((m: any) => m.type === 'forex').length || 0} pairs`,
                icon: "💱"
            })
        }

        lists.push({
            name: "Top Volume",
            subtitle: "Highest trading volume",
            count: `${filteredData.slice(0, 10).length} assets`,
            icon: "📊"
        })

        return lists
    }, [topMovers, filteredData, activeTab])

    const handleTrade = (item: any) => {
        handleTradeClick(item.rawSymbol || item.symbol, item.type || 'crypto')
    }

    // Pagination logic
    const totalPages = Math.ceil(marketOverview.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const paginatedData = marketOverview.slice(startIndex, endIndex)

    // Reset to page 1 when tab or search changes
    useEffect(() => {
        setCurrentPage(1)
    }, [activeTab, searchQuery])

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleItemsPerPageChange = (value: number) => {
        setItemsPerPage(value)
        setCurrentPage(1)
    }

    // Tab configuration
    const tabs = [
        { label: "All", value: "All" as const },
        { label: `Crypto (${cryptoData.length})`, value: "Crypto" as const },
        { label: `Forex (${forexData.length})`, value: "Forex" as const }
    ]

    if (isLoading && !areSymbolsLoaded) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950 text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
                    <p className="text-slate-400 mb-4">Loading market data...</p>
                    <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-center gap-2">
                            {cryptoSymbols.length > 0 ? (
                                <>
                                    <span className="text-emerald-400">✅</span>
                                    <span className="text-slate-400">Loaded {cryptoSymbols.length} crypto symbols</span>
                                </>
                            ) : (
                                <>
                                    <div className="w-4 h-4 border-2 border-slate-600 border-t-emerald-500 rounded-full animate-spin"></div>
                                    <span className="text-slate-500">Loading crypto symbols...</span>
                                </>
                            )}
                        </div>
                        <div className="flex items-center justify-center gap-2">
                            {!isLoadingForex && forexSymbols.length > 0 ? (
                                <>
                                    <span className="text-emerald-400">✅</span>
                                    <span className="text-slate-400">Loaded {forexSymbols.length} forex symbols</span>
                                </>
                            ) : isLoadingForex ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-slate-600 border-t-blue-500 rounded-full animate-spin"></div>
                                    <span className="text-slate-500">Loading forex symbols...</span>
                                </>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950 text-white p-4 lg:p-6">
            <div className="max-w-[1400px] mx-auto">
                {/* Header */}
                <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl lg:text-2xl font-bold mb-1 text-white">
                            Markets
                        </h1>
                        <p className="text-xs lg:text-sm text-slate-400">
                            Live cryptocurrency & forex prices
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 lg:gap-3">
                        {isCryptoConnected && (
                            <div className="flex items-center gap-2 px-2 lg:px-3 py-1 lg:py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                                <div className="w-1.5 lg:w-2 h-1.5 lg:h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                <span className="text-[10px] lg:text-xs text-emerald-400 font-medium">
                                    Crypto Live
                                </span>
                            </div>
                        )}
                        {isForexConnected && (
                            <div className="flex items-center gap-2 px-2 lg:px-3 py-1 lg:py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                                <div className="w-1.5 lg:w-2 h-1.5 lg:h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                <span className="text-[10px] lg:text-xs text-blue-400 font-medium">
                                    Forex Live
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Main Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left Section - Market Overview & Top Movers */}
                    <div className="col-span-1 lg:col-span-8 flex flex-col space-y-8">
                        {/* Market Overview */}
                        <div className="bg-transparent rounded-lg">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                                <h2 className="text-lg font-bold text-white">Market overview</h2>
                                <div className="flex flex-wrap items-center gap-2 p-1 bg-slate-900/50 rounded-lg">
                                    {tabs.map((tab) => (
                                        <button
                                            key={tab.value}
                                            onClick={() => setActiveTab(tab.value)}
                                            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${activeTab === tab.value
                                                ? 'bg-emerald-500 text-white shadow-lg'
                                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                                                }`}
                                        >
                                            {tab.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Search Bar */}
                            <div className="mb-6">
                                <SearchInput
                                    placeholder={`Search ${activeTab === "All" ? "all assets" : activeTab.toLowerCase()}...`}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            {/* Market Overview Table */}
                            <div className="bg-transparent border border-white/5 rounded-lg overflow-hidden">
                                <div className="overflow-x-auto">
                                    <div className="min-w-[600px]">
                                        {paginatedData.length > 0 ? (
                                            <MarketTable items={paginatedData} onAction={handleTrade} />
                                        ) : (
                                            <div className="text-center py-12">
                                                <p className="text-slate-400">
                                                    {searchQuery ? `No results found for "${searchQuery}"` : "No data available"}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Pagination Controls */}
                                {marketOverview.length > 0 && (
                                    <div className="p-4 border-t border-white/5 bg-slate-950/20 flex flex-col md:flex-row items-center justify-between gap-4">
                                        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                                            <p className="text-[10px] lg:text-xs text-slate-400 whitespace-nowrap">
                                                Showing {startIndex + 1}-{Math.min(endIndex, marketOverview.length)} of {marketOverview.length}
                                            </p>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] lg:text-xs text-slate-400">Per page:</span>
                                                <select
                                                    value={itemsPerPage}
                                                    onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                                                    className="bg-slate-800 border border-white/10 rounded px-2 py-1 text-[10px] lg:text-xs text-white outline-none"
                                                >
                                                    <option value={10}>10</option>
                                                    <option value={25}>25</option>
                                                    <option value={50}>50</option>
                                                    <option value={100}>100</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => handlePageChange(currentPage - 1)}
                                                disabled={currentPage === 1}
                                                className="p-1 px-2 rounded text-[10px] lg:text-xs font-medium transition disabled:opacity-30 bg-white/5 text-slate-400"
                                            >
                                                Prev
                                            </button>

                                            <div className="flex items-center gap-1">
                                                {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                                                    let pageNum;
                                                    if (totalPages <= 3) {
                                                        pageNum = i + 1;
                                                    } else if (currentPage === 1) {
                                                        pageNum = i + 1;
                                                    } else if (currentPage === totalPages) {
                                                        pageNum = totalPages - 2 + i;
                                                    } else {
                                                        pageNum = currentPage - 1 + i;
                                                    }

                                                    return (
                                                        <button
                                                            key={pageNum}
                                                            onClick={() => handlePageChange(pageNum)}
                                                            className={`w-7 h-7 flex items-center justify-center rounded text-[10px] transition ${currentPage === pageNum
                                                                ? 'bg-emerald-500 text-white'
                                                                : 'bg-white/5 text-slate-400'
                                                                }`}
                                                        >
                                                            {pageNum}
                                                        </button>
                                                    );
                                                })}
                                            </div>

                                            <button
                                                onClick={() => handlePageChange(currentPage + 1)}
                                                disabled={currentPage === totalPages}
                                                className="p-1 px-2 rounded text-[10px] lg:text-xs font-medium transition disabled:opacity-30 bg-white/5 text-slate-400"
                                            >
                                                Next
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-2 mt-4 text-[10px] text-slate-500 italic">
                                <Activity className="w-3 h-3 text-emerald-500" />
                                <span>Real-time market data via binary WebSocket protocol. Prices update in micro-increments.</span>
                            </div>
                        </div>

                        {/* Top Movers by Asset */}
                        <div className="bg-transparent rounded-lg">
                            <div className="mb-6">
                                <h2 className="text-lg font-bold text-white mb-1">
                                    Top movers {activeTab !== "All" && `• ${activeTab}`}
                                </h2>
                                <p className="text-xs text-slate-400">Biggest price movements in the last 24h</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {topMovers.map((section, idx) => (
                                    <div key={idx} className="space-y-4">
                                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 px-1">{section.category}</h3>
                                        <div className="space-y-2">
                                            {section.movers.map((mover: any, moverIdx: number) => (
                                                <div
                                                    key={moverIdx}
                                                    className="group flex items-center justify-between p-3 border border-white/5 rounded-xl bg-slate-900/20 hover:bg-emerald-500/5 hover:border-emerald-500/20 transition-all cursor-pointer"
                                                    onClick={() => handleTradeClick(mover.symbol, mover.type)}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs group-hover:bg-emerald-500/10 transition-colors">
                                                            {mover.type === 'forex' ? 'FX' : mover.symbol.substring(0, 2).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-sm text-white group-hover:text-emerald-400 transition-colors">
                                                                {mover.symbol}
                                                            </div>
                                                            <div className="text-[10px] text-slate-500 truncate max-w-[100px]">{mover.name}</div>
                                                        </div>
                                                    </div>
                                                    <div className={`text-xs font-bold px-2 py-1 rounded-lg ${mover.change.includes('-')
                                                        ? 'text-red-400 bg-red-500/10'
                                                        : 'text-emerald-400 bg-emerald-500/10'
                                                        }`}>
                                                        {mover.change}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <div className="col-span-1 lg:col-span-4 flex flex-col space-y-6">
                        {/* Major Indices */}
                        <div className="bg-transparent rounded-lg border border-white/5 p-5">
                            <h2 className="text-lg font-bold text-white mb-4">Market leaders</h2>
                            <div className="space-y-4">
                                {majorIndices.length === 0 ? (
                                    Array.from({ length: 3 }).map((_, i) => (
                                        <div key={i} className="h-20 bg-slate-900/50 rounded-xl animate-pulse"></div>
                                    ))
                                ) : (
                                    majorIndices.map((index, idx) => (
                                        <div key={idx} className="p-4 border border-white/5 rounded-xl bg-slate-900/30 hover:border-emerald-500/20 transition-all cursor-pointer" onClick={() => handleTradeClick(index.name, activeTab.toLowerCase() === 'forex' ? 'forex' : 'crypto')}>
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="text-xs font-bold text-slate-400">{index.name}</span>
                                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${index.isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                                                    {index.change}
                                                </span>
                                            </div>
                                            <div className="text-xl font-bold text-white">${index.value}</div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Market Stats */}
                        <div className="bg-transparent rounded-lg border border-white/5 p-5">
                            <h2 className="text-lg font-bold mb-4 text-white">Platform activity</h2>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/40">
                                    <div className="text-xs text-slate-400">Total assets</div>
                                    <div className="text-sm font-bold text-white">{marketStats.totalAssets}</div>
                                </div>

                                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/40">
                                    <div className="text-xs text-slate-400">Crypto liquidity</div>
                                    <div className={`text-[10px] font-bold ${isCryptoConnected ? 'text-emerald-500' : 'text-slate-500'}`}>
                                        {marketStats.cryptoStatus}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/40">
                                    <div className="text-xs text-slate-400">Forex liquidity</div>
                                    <div className={`text-[10px] font-bold ${isForexConnected ? 'text-blue-500' : 'text-slate-500'}`}>
                                        {marketStats.forexStatus}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/40">
                                    <div className="text-xs text-slate-400">Avg volatility</div>
                                    <div className="text-sm font-bold text-emerald-400">{marketStats.volatility}</div>
                                </div>
                            </div>
                        </div>

                        {/* Watchlists */}
                        <div className="bg-transparent rounded-lg border border-white/5 p-5">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold text-white">Watchlists</h2>
                                <Button size="sm" variant="ghost" className="text-emerald-500 text-[10px] h-6">Edit</Button>
                            </div>

                            <div className="space-y-2">
                                {watchlists.map((list, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-all cursor-pointer border border-transparent hover:border-white/5 group">
                                        <div className="flex items-center gap-3">
                                            <div className="text-lg">{list.icon}</div>
                                            <div>
                                                <div className="font-bold text-xs text-white group-hover:text-emerald-400 transition-colors">{list.name}</div>
                                                <div className="text-[10px] text-slate-500">{list.subtitle}</div>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-3 h-3 text-slate-600" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Trade Modal */}
            <Modal
                isOpen={isTradeModalOpen}
                onClose={() => setIsTradeModalOpen(false)}
                title={`Quick Trade: ${selectedAsset?.symbol || ''}`}
            >
                <div className="space-y-6">
                    <div className="p-4 rounded-xl bg-slate-900/50 border border-white/5">
                        <div className="flex justify-between items-center text-xs text-slate-400 mb-2">
                            <span>Asset Price</span>
                            <span className="text-emerald-400 font-bold">${selectedAsset?.price}</span>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 ml-1">Order Amount</label>
                        <Input placeholder="0.00" className="bg-slate-950 border-white/10 text-white h-12 text-lg font-bold" />
                    </div>
                    <div className="flex gap-3">
                        <Button className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-12 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.2)]" onClick={() => {
                            alert(`Order placed successfully`);
                            setIsTradeModalOpen(false);
                        }}>Market Buy</Button>
                        <Button className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold h-12 rounded-xl" onClick={() => {
                            alert(`Order placed successfully`);
                            setIsTradeModalOpen(false);
                        }}>Market Sell</Button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}
