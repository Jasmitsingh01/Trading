"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from 'next/navigation'
import { TrendingUp, TrendingDown, Star, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api"
import { useBinanceWebSocket } from "@/hooks/useBinanceWebSocket"
import useFinnhubForex from "@/hooks/useFinnhubForex"

interface WatchlistAsset {
    symbol: string
    assetType: string
    name?: string
    alertPrice?: number
    notes?: string
}

interface LivePriceData {
    price: string
    change: string
    changePercent: string
    isLive: boolean
}

interface WatchlistProps {
    onAdd?: () => void
}

export function Watchlist({ onAdd }: WatchlistProps) {
    const router = useRouter()
    const [watchlistAssets, setWatchlistAssets] = useState<WatchlistAsset[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Fetch watchlist from backend
    useEffect(() => {
        const fetchWatchlist = async () => {
            try {
                setLoading(true)
                const response = await api.watchlist.get()

                console.log('📊 Watchlist API Response:', response)

                if (response.watchlist && response.watchlist.assets) {
                    const assetsWithNames = response.watchlist.assets.map((asset: any) => {
                        let normalizedSymbol = asset.symbol.toUpperCase()

                        // Normalize crypto symbols
                        if (asset.assetType === 'crypto' || asset.assetType === 'cryptocurrency') {
                            if (!normalizedSymbol.endsWith('USDT')) {
                                normalizedSymbol = `${normalizedSymbol}USDT`
                            }
                        }

                        return {
                            symbol: normalizedSymbol,
                            assetType: asset.assetType === 'cryptocurrency' ? 'crypto' : asset.assetType,
                            name: normalizedSymbol.replace('USDT', '').replace('USD', ''),
                            alertPrice: asset.alertPrice,
                            notes: asset.notes
                        }
                    })

                    console.log('✅ Normalized Assets:', assetsWithNames)
                    setWatchlistAssets(assetsWithNames)
                }
            } catch (err: any) {
                console.error('❌ Error fetching watchlist:', err)
                setError(err.message || 'Failed to load watchlist')
            } finally {
                setLoading(false)
            }
        }

        fetchWatchlist()
    }, [])

    // Separate crypto and forex symbols
    const cryptoSymbols = useMemo(() =>
        watchlistAssets
            .filter(asset => asset.assetType === 'crypto')
            .map(asset => asset.symbol),
        [watchlistAssets]
    )

    const forexSymbols = useMemo(() =>
        watchlistAssets
            .filter(asset => asset.assetType === 'forex')
            .map(asset => asset.symbol),
        [watchlistAssets]
    )

    // Subscribe to crypto WebSocket
    const {
        allData: cryptoData,
        isConnected: cryptoConnected,
        error: cryptoError
    } = useBinanceWebSocket({
        symbols: cryptoSymbols,
        enabled: cryptoSymbols.length > 0
    })

    // Subscribe to forex WebSocket
    const {
        forexRates,
        isConnected: forexConnected,
        error: forexError
    } = useFinnhubForex({
        exchange: 'oanda',
        symbolsToSubscribe: forexSymbols,
        autoConnect: forexSymbols.length > 0,
        autoSubscribe: forexSymbols.length > 0
    })

    // Debug effect
    useEffect(() => {
        console.log('🔍 WATCHLIST DEBUG:')
        console.log('  1. Total Assets:', watchlistAssets.length)
        console.log('  2. Crypto Symbols:', cryptoSymbols)
        console.log('  3. Forex Symbols:', forexSymbols)
        console.log('  4. Crypto WebSocket Connected:', cryptoConnected)
        console.log('  5. Forex WebSocket Connected:', forexConnected)
        console.log('  6. Crypto Data Size:', cryptoData.size)
        console.log('  7. Forex Rates Count:', Object.keys(forexRates).length)
        console.log('  8. Crypto Error:', cryptoError)
        console.log('  9. Forex Error:', forexError)

        // Log each asset's data
        watchlistAssets.forEach(asset => {
            if (asset.assetType === 'crypto') {
                const data = cryptoData.get(asset.symbol)
                console.log(`  💰 CRYPTO ${asset.symbol}:`, data)
            } else if (asset.assetType === 'forex') {
                const data = forexRates[asset.symbol]
                console.log(`  💱 FOREX ${asset.symbol}:`, data)
            }
        })
    }, [watchlistAssets, cryptoSymbols, forexSymbols, cryptoConnected, forexConnected, cryptoData, forexRates, cryptoError, forexError])

    // Handle remove from watchlist
    const handleRemove = async (symbol: string) => {
        try {
            // Remove USDT suffix for API call
            const originalSymbol = symbol.replace('USDT', '')
            await api.watchlist.remove(originalSymbol)
            setWatchlistAssets(prev => prev.filter(asset => asset.symbol !== symbol))
        } catch (err: any) {
            console.error('Error removing from watchlist:', err)
            alert('Failed to remove from watchlist')
        }
    }

    // Get live price for a symbol
    const getLivePrice = (asset: WatchlistAsset): LivePriceData => {
        const defaultData: LivePriceData = {
            price: '0.00',
            change: '0.00',
            changePercent: '0.00',
            isLive: false
        }

        try {
            if (asset.assetType === 'crypto') {
                const data = cryptoData.get(asset.symbol)

                if (data && parseFloat(data.price) > 0) {
                    return {
                        price: data.price,
                        change: data.change,
                        changePercent: data.changePercent,
                        isLive: true
                    }
                }
            } else if (asset.assetType === 'forex') {
                const data = forexRates[asset.symbol]

                if (data && data.price > 0) {
                    return {
                        price: data.price.toString(),
                        change: data.change?.toString() || '0.00',
                        changePercent: data.percentChange?.toFixed(2) || '0.00',
                        isLive: true
                    }
                }
            }
        } catch (err) {
            console.error(`Error getting live price for ${asset.symbol}:`, err)
        }

        return defaultData
    }

    // Connection status indicator
    const getConnectionStatus = () => {
        const hasCrypto = cryptoSymbols.length > 0
        const hasForex = forexSymbols.length > 0

        if (hasCrypto && !cryptoConnected) return 'Connecting to Crypto...'
        if (hasForex && !forexConnected) return 'Connecting to Forex...'
        if (hasCrypto && cryptoConnected && hasForex && forexConnected) return 'All Connected'
        if (hasCrypto && cryptoConnected) return 'Crypto Connected'
        if (hasForex && forexConnected) return 'Forex Connected'
        return 'Connecting...'
    }

    const isAnyConnected = cryptoConnected || forexConnected

    if (loading) {
        return (
            <div className="bg-gradient-to-br from-slate-950 via-emerald-950/10 to-slate-950 border border-gray-800 rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-emerald-500" />
                        <h3 className="text-lg font-semibold">Watchlist</h3>
                    </div>
                    <Button
                        onClick={() => onAdd ? onAdd() : router.push('/dashboard/market')}
                        size="sm"
                        className="bg-emerald-600 hover:bg-emerald-700"
                    >
                        + Add
                    </Button>
                </div>
                <div className="flex items-center justify-center py-8 text-gray-500">
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Loading watchlist...
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="bg-gradient-to-br from-slate-950 via-emerald-950/10 to-slate-950 border border-gray-800 rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-emerald-500" />
                        <h3 className="text-lg font-semibold">Watchlist</h3>
                    </div>
                    <Button
                        onClick={() => onAdd ? onAdd() : router.push('/dashboard/market')}
                        size="sm"
                        className="bg-emerald-600 hover:bg-emerald-700"
                    >
                        + Add
                    </Button>
                </div>
                <div className="text-center py-8 text-red-500">
                    {error}
                </div>
            </div>
        )
    }

    return (
        <div className="bg-gradient-to-br from-slate-950 via-emerald-950/10 to-slate-950 border border-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-500" />
                    <h3 className="text-lg font-semibold">Watchlist</h3>
                    <span className="text-xs text-gray-500">({watchlistAssets.length})</span>

                    {/* Connection Status Indicator */}
                    {watchlistAssets.length > 0 && (
                        <span className="flex items-center gap-1 text-xs">
                            {isAnyConnected ? (
                                <>
                                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                                    <span className="text-emerald-500">Live</span>
                                </>
                            ) : (
                                <>
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                    <span className="text-yellow-500">{getConnectionStatus()}</span>
                                </>
                            )}
                        </span>
                    )}

                    {/* Error Indicators */}
                    {cryptoError && (
                        <span className="text-xs text-red-500" title={cryptoError.message}>
                            Crypto Error
                        </span>
                    )}
                    {forexError && (
                        <span className="text-xs text-red-500">
                            Forex Error
                        </span>
                    )}
                </div>
                <Button
                    onClick={() => onAdd ? onAdd() : router.push('/dashboard/market')}
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700"
                >
                    + Add
                </Button>
            </div>

            {watchlistAssets.length === 0 ? (
                <div className="text-center py-8">
                    <Star className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400 mb-2">No assets in your watchlist</p>
                    <p className="text-sm text-gray-600">Add assets to track their performance</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {watchlistAssets.map((asset) => {
                        const livePrice = getLivePrice(asset)
                        const isPositive = parseFloat(livePrice.changePercent) >= 0
                        const hasLiveData = livePrice.isLive

                        return (
                            <div
                                key={asset.symbol}
                                className="relative group p-4 rounded-lg border border-gray-800 hover:border-gray-700 bg-slate-900/50 transition-all cursor-pointer"
                                onClick={() => router.push(`/dashboard/trade?symbol=${asset.symbol}&type=${asset.assetType}`)}
                            >
                                <div className="flex items-start  gap-10">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-sm font-bold">{asset.symbol}</span>
                                            {hasLiveData && (
                                                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                                            )}
                                            <span className="text-xs px-1.5 py-0.5 rounded bg-gray-800 text-gray-400">
                                                {asset.assetType.toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="text-xs text-gray-500">{asset.name}</div>
                                    </div>

                                    <div className="text-right">
                                        <div className="text-sm font-semibold">
                                            ${parseFloat(livePrice.price).toFixed(asset.assetType === 'forex' ? 5 : 2)}
                                        </div>
                                        <div className={`text-xs flex items-center gap-1 justify-end ${isPositive ? 'text-emerald-400' : 'text-red-400'
                                            }`}>
                                            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                            <span>{isPositive ? '+' : ''}{parseFloat(livePrice.changePercent).toFixed(2)}%</span>
                                        </div>
                                        {!hasLiveData && (
                                            <div className="flex items-center gap-1 text-xs text-yellow-500 mt-1">
                                                <Loader2 className="w-3 h-3 animate-spin" />
                                                Connecting...
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Remove button (shows on hover) */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleRemove(asset.symbol)
                                    }}
                                    className="absolute border-2 border-red-500 top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500/20 hover:bg-red-500/30 p-1 rounded"
                                    title="Remove from watchlist"
                                >
                                    <X className="w-3 h-3 text-red-500" />
                                </button>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
