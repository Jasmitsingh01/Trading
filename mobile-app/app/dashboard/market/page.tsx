'use client'

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { ChevronRight } from "lucide-react"
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
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950 text-white p-6">
            <div className="max-w-[1400px] mx-auto">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold mb-1 text-white">
                            Markets
                        </h1>
                        <p className="text-sm text-slate-400">
                            Live cryptocurrency & forex prices
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        {isCryptoConnected && (
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                <span className="text-xs text-emerald-400 font-medium">
                                    Crypto Live ({cryptoData.length})
                                </span>
                            </div>
                        )}
                        {isForexConnected && (
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                <span className="text-xs text-blue-400 font-medium">
                                    Forex Live ({forexData.length})
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Main Grid Layout */}
                <div className="grid grid-cols-12 gap-6">
                    {/* Left Section - Market Overview & Top Movers */}
                    <div className="col-span-8">
                        {/* Market Overview */}
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold text-white">Market overview</h2>
                                <p className="text-sm text-slate-400">
                                    {activeTab === "All" ? "All assets" : 
                                     activeTab === "Crypto" ? "Cryptocurrency" : "Forex pairs"} • Real-time prices
                                </p>
                            </div>

                            {/* Tabs */}
                            <div className="flex items-center gap-2 mb-4 p-1 bg-slate-900/50 rounded-lg w-fit">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.value}
                                        onClick={() => setActiveTab(tab.value)}
                                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                                            activeTab === tab.value
                                                ? 'bg-emerald-500 text-white shadow-lg'
                                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                                        }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            {/* Search Bar */}
                            <div className="mb-4">
                                <SearchInput 
                                    placeholder={`Search ${activeTab === "All" ? "all assets" : activeTab.toLowerCase()}...`}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            {/* Market Overview Table */}
                            {paginatedData.length > 0 ? (
                                <MarketTable items={paginatedData} onAction={handleTrade} />
                            ) : (
                                <div className="text-center py-12 border border-white/10 rounded-lg">
                                    <p className="text-slate-400">
                                        {searchQuery ? `No results found for "${searchQuery}"` : "No data available"}
                                    </p>
                                </div>
                            )}

                            {/* Pagination Controls */}
                            {marketOverview.length > 0 && (
                                <div className="mt-6 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <p className="text-xs text-slate-400">
                                            Showing {startIndex + 1}-{Math.min(endIndex, marketOverview.length)} of {marketOverview.length} {activeTab === "All" ? "assets" : activeTab.toLowerCase()}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-slate-400">Per page:</span>
                                            <select
                                                value={itemsPerPage}
                                                onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                                                className="bg-slate-800 border border-white/10 rounded px-2 py-1 text-xs text-white"
                                            >
                                                <option value={10}>10</option>
                                                <option value={25}>25</option>
                                                <option value={50}>50</option>
                                                <option value={100}>100</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className="px-3 py-1 rounded text-xs font-medium transition disabled:opacity-50 disabled:cursor-not-allowed bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
                                        >
                                            Previous
                                        </button>

                                        <div className="flex items-center gap-1">
                                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                                let pageNum;
                                                if (totalPages <= 5) {
                                                    pageNum = i + 1;
                                                } else if (currentPage <= 3) {
                                                    pageNum = i + 1;
                                                } else if (currentPage >= totalPages - 2) {
                                                    pageNum = totalPages - 4 + i;
                                                } else {
                                                    pageNum = currentPage - 2 + i;
                                                }

                                                return (
                                                    <button
                                                        key={pageNum}
                                                        onClick={() => handlePageChange(pageNum)}
                                                        className={`px-3 py-1 rounded text-xs font-medium transition ${
                                                            currentPage === pageNum
                                                                ? 'bg-emerald-500 text-white'
                                                                : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
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
                                            className="px-3 py-1 rounded text-xs font-medium transition disabled:opacity-50 disabled:cursor-not-allowed bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            )}

                            <p className="text-xs text-slate-500 mt-3">
                                Real-time data from Binance (crypto) and Finnhub (forex). Prices update live via WebSocket.
                            </p>
                        </div>

                        {/* Top Movers by Asset */}
                        <div>
                            <h2 className="text-lg font-bold mb-4 text-white">
                                Top movers {activeTab !== "All" && `• ${activeTab}`}
                            </h2>
                            <p className="text-xs text-slate-400 mb-4">Biggest gainers and losers</p>

                            <div className="grid grid-cols-2 gap-6">
                                {topMovers.map((section, idx) => (
                                    <div key={idx}>
                                        <h3 className="text-sm font-bold mb-3 text-slate-300">{section.category}</h3>
                                        <div className="space-y-2">
                                            {section.movers.map((mover: any, moverIdx: number) => (
                                                <div 
                                                    key={moverIdx} 
                                                    className="flex items-center justify-between p-3 border border-white/10 rounded-lg bg-gradient-to-br from-slate-900/50 to-slate-800/30 backdrop-blur-sm hover:bg-white/5 cursor-pointer"
                                                    onClick={() => handleTradeClick(mover.symbol, mover.type)}
                                                >
                                                    <div>
                                                        <div className="font-semibold text-sm text-white flex items-center gap-2">
                                                            {mover.symbol}
                                                            <span className="text-xs px-1.5 py-0.5 rounded bg-white/5 text-slate-400">
                                                                {mover.type === 'forex' ? '💱' : '₿'}
                                                            </span>
                                                        </div>
                                                        <div className="text-xs text-slate-400">{mover.name}</div>
                                                    </div>
                                                    <div className={`text-xs font-medium px-2 py-1 rounded ${
                                                        mover.change.includes('-') 
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
                    <div className="col-span-4">
                        {/* Major Indices */}
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-3">
                                <h2 className="text-lg font-bold text-white">Top 3 {activeTab !== "All" ? activeTab : "Assets"}</h2>
                            </div>
                            <p className="text-xs text-slate-400 mb-4">Highest market activity</p>

                            <div className="space-y-3">
                                {majorIndices.length === 0 ? (
                                    [1, 2, 3].map((i) => (
                                        <div key={i} className="p-4 border border-white/10 rounded-lg bg-gradient-to-br from-slate-900/50 to-slate-800/30 backdrop-blur-sm animate-pulse">
                                            <div className="flex justify-between items-center mb-2">
                                                <div className="h-3 bg-slate-700 rounded w-24"></div>
                                                <div className="h-3 bg-slate-700 rounded w-12"></div>
                                            </div>
                                            <div className="h-8 bg-slate-700 rounded w-32"></div>
                                        </div>
                                    ))
                                ) : (
                                    majorIndices.map((index, idx) => (
                                        <div key={idx} className="p-4 border border-white/10 rounded-lg bg-gradient-to-br from-slate-900/50 to-slate-800/30 backdrop-blur-sm">
                                            <div className="flex justify-between items-center">
                                                <div className="text-xs text-slate-400 mb-1">{index.name}</div>
                                                <div className={`text-xs font-medium ${index.isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                                                    {index.change}
                                                </div>
                                            </div>
                                            <div className="text-2xl font-bold text-white">${index.value}</div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Market Stats */}
                        <div className="mb-6 p-4 border border-white/10 rounded-lg bg-gradient-to-br from-slate-900/50 to-slate-800/30 backdrop-blur-sm">
                            <h2 className="text-lg font-bold mb-4 text-white">Market stats</h2>

                            <div className="space-y-4">
                                <div>
                                    <div className="text-xs text-slate-400 mb-1">
                                        Total {activeTab === "All" ? "Assets" : activeTab}
                                    </div>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-xl font-bold text-white">{marketStats.totalAssets}</span>
                                        <span className="text-sm text-slate-400">
                                            {activeTab === "Forex" ? "pairs" : "symbols"}
                                        </span>
                                    </div>
                                </div>

                                {activeTab === "All" && (
                                    <>
                                        <div>
                                            <div className="text-xs text-slate-400 mb-1">Cryptocurrencies</div>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-xl font-bold text-emerald-400">{marketStats.cryptoCount}</span>
                                                <span className="text-xs text-slate-400">{marketStats.cryptoStatus}</span>
                                            </div>
                                        </div>

                                        <div>
                                            <div className="text-xs text-slate-400 mb-1">Forex Pairs</div>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-xl font-bold text-blue-400">{marketStats.forexCount}</span>
                                                <span className="text-xs text-slate-400">{marketStats.forexStatus}</span>
                                            </div>
                                        </div>
                                    </>
                                )}

                                <div>
                                    <div className="text-xs text-slate-400 mb-1">Average Volatility</div>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-xl font-bold text-white">{marketStats.volatility}</span>
                                    </div>
                                </div>

                                <div>
                                    <div className="text-xs text-slate-400 mb-1">Market Status</div>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-xl font-bold ${
                                            marketStats.overallStatus === "Live" ? 'text-emerald-400' : 'text-yellow-400'
                                        }`}>
                                            {marketStats.overallStatus}
                                        </span>
                                        {marketStats.overallStatus === "Live" && (
                                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Watchlists */}
                        <div className="p-4 border border-white/10 rounded-lg bg-gradient-to-br from-slate-900/50 to-slate-800/30 backdrop-blur-sm">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold text-white">Watchlists</h2>
                                <Button size="sm" className="bg-emerald-500 text-white hover:bg-emerald-500/90 h-7 text-xs">
                                    Manage
                                </Button>
                            </div>

                            <div className="space-y-3">
                                {watchlists.map((list, idx) => (
                                    <div key={idx} className="p-3 border border-white/10 rounded-lg hover:bg-white/5 cursor-pointer transition">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="text-lg">{list.icon}</span>
                                                <div>
                                                    <div className="font-semibold text-sm mb-1 text-white">{list.name}</div>
                                                    <div className="text-xs text-slate-400">{list.subtitle}</div>
                                                </div>
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-slate-400" />
                                        </div>
                                        <div className="text-xs text-slate-400 mt-2">{list.count}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4">
                                <button className="text-xs text-emerald-400 hover:underline">
                                    Create custom watchlist
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Trade Modal */}
            <Modal
                isOpen={isTradeModalOpen}
                onClose={() => setIsTradeModalOpen(false)}
                title={`Trade ${selectedAsset?.symbol || ''}`}
            >
                <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm text-slate-400">
                        <span>Current Price</span>
                        <span className="text-white font-bold">${selectedAsset?.price}</span>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-slate-300">Amount</label>
                        <Input placeholder="Enter amount..." className="bg-slate-900 border-white/10 text-white" />
                    </div>
                    <div className="flex gap-2 mt-4">
                        <Button className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white" onClick={() => {
                            alert(`Buy order placed for ${selectedAsset?.symbol}`);
                            setIsTradeModalOpen(false);
                        }}>Buy</Button>
                        <Button className="flex-1 bg-red-500 hover:bg-red-600 text-white" onClick={() => {
                            alert(`Sell order placed for ${selectedAsset?.symbol}`);
                            setIsTradeModalOpen(false);
                        }}>Sell</Button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}
