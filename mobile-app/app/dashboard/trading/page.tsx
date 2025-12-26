'use client'

import { useEffect, useState, useMemo } from "react"
import { api } from "@/lib/api"
import { useAuth } from "@/contexts/AuthContext"
import LiveWatchlistSidebar from "@/components/dashboard/LiveWatchlistSidebar"
import { TradingHeader } from "@/components/dashboard/TradingHeader"
import TradingViewWidget from "@/components/dashboard/TradingViewWidget"
import LiveTradingChart from "@/components/dashboard/LiveTradingChart"
import { OrderTicket } from "@/components/dashboard/OrderTicket"
import { fetchAllCryptoData, type CryptoData } from "@/lib/binance"
import { useBinanceWebSocket } from "@/hooks/useBinanceWebSocket"
import useFinnhubForex from "@/hooks/useFinnhubForex"

export default function Trading() {
  const { user } = useAuth() // Get user from AuthContext
  const [selectedSymbol, setSelectedSymbol] = useState("BTCUSDT")
  const [selectedAssetType, setSelectedAssetType] = useState<'crypto' | 'forex'>('crypto')
  const [tradingViewSymbol, setTradingViewSymbol] = useState("BINANCE:BTCUSDT")
  const [isLoading, setIsLoading] = useState(true)
  const [openOrders, setOpenOrders] = useState<any[]>([])
  const [positions, setPositions] = useState<any[]>([])
  const [accountBalance, setAccountBalance] = useState<any>(null)
  const [chartMode, setChartMode] = useState<'tradingview' | 'live'>('live')
  
  // Fetch all crypto symbols
  const [cryptoSymbols, setCryptoSymbols] = useState<CryptoData[]>([])
  const [areSymbolsLoaded, setAreSymbolsLoaded] = useState(false)

  // Get top crypto symbols for WebSocket (top 50 most popular)
  const topCryptoSymbols = useMemo(() => {
    return cryptoSymbols.slice(0, 50).map(c => c.symbol)
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
    status: forexStatus,
    symbolCount: forexSymbolCount
  } = useFinnhubForex({
    exchange: 'oanda',
    symbolsToSubscribe: selectedAssetType === 'forex' ? [selectedSymbol] : undefined,
    autoConnect: true,
    autoSubscribe: true
  })

  // Combine crypto and forex into live assets with real-time data
  const liveAssets = useMemo(() => {
    const assets: Array<{ 
      symbol: string
      name: string
      assetType: 'crypto' | 'forex'
      price?: number
      change?: number
      changePercent?: number
    }> = []

    // Add top crypto assets with live prices
    cryptoSymbols.slice(0, 30).forEach(crypto => {
      const liveData = liveCryptoPrices.get(crypto.symbol)
      assets.push({
        symbol: crypto.symbol,
        name: crypto.baseAsset,
        assetType: 'crypto',
        price: liveData ? parseFloat(liveData.price) : undefined,
        change: liveData ? parseFloat(liveData.change) : undefined,
        changePercent: liveData ? parseFloat(liveData.changePercent) : undefined,
      })
    })

    // Add forex assets from fetched symbols
    if (forexSymbols.length > 0) {
      forexSymbols.slice(0, 30).forEach((forexSymbol: any) => {
        const symbol = forexSymbol.symbol || forexSymbol.displaySymbol || forexSymbol
        const liveRate = liveForexPrices?.[symbol]
        
        assets.push({
          symbol: symbol,
          name: forexSymbol.description || symbol,
          assetType: 'forex',
          price: liveRate?.price,
          change: liveRate?.change,
          changePercent: liveRate?.percentChange,
        })
      })
    }

    return assets
  }, [cryptoSymbols, forexSymbols, liveCryptoPrices, liveForexPrices])

  // Fetch all crypto and forex symbols on mount
  useEffect(() => {
    const fetchSymbols = async () => {
      if (areSymbolsLoaded) return

      try {
        console.log("📊 Fetching crypto symbols...")

        // Fetch crypto symbols
        const crypto = await fetchAllCryptoData().catch(err => {
          console.error("❌ Error fetching crypto symbols:", err)
          return []
        })

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

  // Check for selected symbol from localStorage (from market page)
  useEffect(() => {
    const storedSymbol = localStorage.getItem('selectedSymbol')
    const storedAssetType = localStorage.getItem('selectedAssetType') as 'crypto' | 'forex' | null

    if (storedSymbol && storedAssetType) {
      const cleanSymbol = storedSymbol.replace('/USDT', '').replace('USDT', '')
      setSelectedSymbol(cleanSymbol)
      setSelectedAssetType(storedAssetType)

      // Set TradingView symbol based on asset type
      let tvSymbol = ''
      if (storedAssetType === 'forex') {
        tvSymbol = cleanSymbol.includes(':') ? `FX_IDC:${cleanSymbol.split(':')[1].replace('_', '')}` : `FX:${cleanSymbol.replace('_', '')}`
      } else {
        const baseSymbol = cleanSymbol.replace('/USDT', '').replace('USDT', '')
        tvSymbol = `BINANCE:${baseSymbol}USDT`
      }
      setTradingViewSymbol(tvSymbol)

      // Clear stored values
      localStorage.removeItem('selectedSymbol')
      localStorage.removeItem('selectedAssetType')
    }
  }, [])

  // Get live quote for selected symbol
  const getLiveQuote = useMemo(() => {
    if (selectedAssetType === 'forex') {
      const rate = liveForexPrices?.[selectedSymbol]
      if (rate) {
        const prevPrice = rate.price - (rate.change || 0)
        return {
          price: rate.price || 0,
          change: rate.change || 0,
          changePercent: prevPrice ? ((rate.change || 0) / prevPrice) * 100 : 0,
          volume: 0,
        }
      }
    } else {
      const cryptoData = liveCryptoPrices.get(selectedSymbol)
      if (cryptoData) {
        return {
          price: parseFloat(cryptoData.price),
          change: parseFloat(cryptoData.change),
          changePercent: parseFloat(cryptoData.changePercent),
          volume: parseFloat(cryptoData.volume),
        }
      }
    }
    return null
  }, [selectedSymbol, selectedAssetType, liveCryptoPrices, liveForexPrices])

  // Fetch open orders - NO TOKEN NEEDED
  const fetchOpenOrders = async () => {
    if (!user) return

    try {
      const result = await api.orders.getAllRest() // No token!
      setOpenOrders(result.data || result.orders || [])
    } catch (err) {
      console.error('Error fetching orders:', err)
    }
  }

  // Fetch positions - NO TOKEN NEEDED
  const fetchPositions = async () => {
    if (!user) return

    try {
      const result = await api.positions.getAll() // No token!
      setPositions(result.positions || [])
    } catch (err) {
      console.error('Error fetching positions:', err)
    }
  }

  // Fetch account balance - NO TOKEN NEEDED
  const fetchAccountBalance = async () => {
    if (!user) return

    try {
      const result = await api.user.getBalance() // No token!
      setAccountBalance(result.userBalance || result)
    } catch (err) {
      console.error('Error fetching balance:', err)
    }
  }

  // Initial data load
  useEffect(() => {
    if (!user) return

    const loadData = async () => {
      setIsLoading(true)
      try {
        await Promise.all([
          fetchOpenOrders().catch(err => console.error('Orders error:', err)),
          fetchPositions().catch(err => console.error('Positions error:', err)),
          fetchAccountBalance().catch(err => console.error('Balance error:', err))
        ])
      } catch (err) {
        console.error('Error loading data:', err)
      } finally {
        setIsLoading(false)
      }
    }

    const timer = setTimeout(() => {
      loadData()
    }, 100)

    return () => clearTimeout(timer)
  }, [user])

  // Auto-refresh orders and positions every 10 seconds
  useEffect(() => {
    if (!user) return

    const interval = setInterval(async () => {
      try {
        await Promise.all([
          fetchOpenOrders(),
          fetchPositions()
        ])
      } catch (err) {
        console.error('Error refreshing data:', err)
      }
    }, 10000)

    return () => clearInterval(interval)
  }, [user])

  // Refresh data when an order is placed
  useEffect(() => {
    const handleOrderPlaced = () => {
      fetchOpenOrders()
      fetchAccountBalance()
      fetchPositions()
    }

    window.addEventListener('order-placed', handleOrderPlaced)
    return () => window.removeEventListener('order-placed', handleOrderPlaced)
  }, [user])

  // Format orders for display
  const formattedOrders = openOrders.map((order: any) => ({
    id: order.id,
    symbol: order.symbol,
    qty: `${order.quantity} ${order.orderType}`,
    price: order.price ? `$${order.price.toFixed(2)}` : 'Market',
    status: order.status.charAt(0).toUpperCase() + order.status.slice(1),
    filled: `${((order.filledQuantity / order.quantity) * 100).toFixed(0)}%`,
    type: order.timeInForce.toUpperCase()
  }))

  // Format positions for display
  const formattedPositions = positions.map((pos: any) => {
    const pl = pos.unrealizedPnL || 0
    const plPercent = pos.unrealizedPnLPercent || 0
    return {
      symbol: pos.symbol,
      qty: pos.quantity.toString(),
      avgPrice: `$${pos.averagePrice.toFixed(2)}`,
      last: pos.currentPrice ? `$${pos.currentPrice.toFixed(2)}` : 'N/A',
      pl: `${pl >= 0 ? '+' : ''}$${Math.abs(pl).toFixed(2)}`,
      plPercent: `${plPercent >= 0 ? '+' : ''}${plPercent.toFixed(2)}%`
    }
  })

  // Add cash position
  if (accountBalance) {
    formattedPositions.push({
      symbol: 'Cash',
      qty: '-',
      avgPrice: '-',
      last: '-',
      pl: '-',
      plPercent: `$${accountBalance.availableBalance.toFixed(2)}`
    })
  }

  const liveQuoteData = getLiveQuote

  const keyStats = [
    { label: "Current Price", value: `$${liveQuoteData?.price?.toFixed(selectedAssetType === 'forex' ? 5 : 2) || '0.00'}` },
    { label: "Change", value: `${(liveQuoteData?.changePercent ?? 0) >= 0 ? '+' : ''}${liveQuoteData?.changePercent?.toFixed(2) || '0.00'}%` },
    { label: "Volume", value: liveQuoteData?.volume?.toLocaleString() || 'N/A' },
  ]

  // Loading state
  if (isLoading || !areSymbolsLoaded) {
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
              ) : forexError ? (
                <>
                  <span className="text-red-400">❌</span>
                  <span className="text-red-400">Error loading forex: {forexError}</span>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950 text-white flex">
      <LiveWatchlistSidebar
        assets={liveAssets}
        onSymbolSelect={(symbol, assetType) => {
          console.log(`🎯 Selected: ${symbol} (${assetType})`)
          setSelectedSymbol(symbol)
          setSelectedAssetType(assetType as 'crypto' | 'forex')
          
          // Update TradingView symbol
          let tvSymbol = ''
          if (assetType === 'forex') {
            tvSymbol = symbol.includes(':') 
              ? `FX_IDC:${symbol.split(':')[1].replace('_', '')}` 
              : `FX:${symbol.replace('_', '')}`
          } else {
            tvSymbol = `BINANCE:${symbol}`
          }
          setTradingViewSymbol(tvSymbol)
        }}
        selectedSymbol={selectedSymbol}
        showCharts={true}
      />

      <div className="flex-1 flex flex-col bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950">
        <TradingHeader
          symbol={selectedSymbol}
          price={liveQuoteData?.price}
          change={liveQuoteData?.change}
          changePercent={liveQuoteData?.changePercent}
        />

        <div className="flex-1 flex">
          <div className="flex-1 flex flex-col">
            {/* Chart Mode Toggle & Status */}
            <div className="px-6 pt-6 pb-3 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-slate-400">Chart:</span>
                  <div className="flex items-center gap-2 bg-slate-900/50 rounded-lg p-1">
                    <button
                      onClick={() => setChartMode('live')}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                        chartMode === 'live'
                          ? 'bg-emerald-500 text-white shadow-lg'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Live WebSocket
                    </button>
                    <button
                      onClick={() => setChartMode('tradingview')}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                        chartMode === 'tradingview'
                          ? 'bg-emerald-500 text-white shadow-lg'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      TradingView
                    </button>
                  </div>
                </div>
              </div>

              {/* Connection Status */}
              <div className="flex items-center gap-3 text-xs">
                <div className={`flex items-center gap-2 ${isCryptoConnected ? 'text-emerald-400' : 'text-slate-500'}`}>
                  <span className={`w-2 h-2 rounded-full ${isCryptoConnected ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`}></span>
                  <span>Crypto {isCryptoConnected ? 'Live' : 'Offline'}</span>
                </div>
                
                <div className={`flex items-center gap-2 ${isForexConnected ? 'text-blue-400' : 'text-slate-500'}`}>
                  <span className={`w-2 h-2 rounded-full ${isForexConnected ? 'bg-blue-500 animate-pulse' : 'bg-slate-600'}`}></span>
                  <span>
                    Forex {isForexConnected ? `Live (${forexSymbolCount})` : forexStatus === 'connecting' ? 'Connecting...' : 'Offline'}
                  </span>
                </div>
              </div>
            </div>

            {/* Chart Display */}
            <div className="flex-1 px-6">
              {chartMode === 'live' ? (
                <LiveTradingChart
                  symbol={selectedSymbol}
                  assetType={selectedAssetType}
                  height={500}
                />
              ) : (
                <div className="h-full bg-slate-900/30 rounded-lg border border-white/10 overflow-hidden">
                  <TradingViewWidget
                    symbol={tradingViewSymbol}
                    interval="60"
                    theme="dark"
                    height="100%"
                  />
                </div>
              )}
            </div>

            <div className="px-6 pb-6">
              <div className="grid grid-cols-3 gap-4 mb-6">
                {keyStats.map((stat, idx) => (
                  <div key={idx} className="bg-transparent border border-gray-800 rounded-lg p-4">
                    <div className="text-xs text-gray-500 mb-1">{stat.label}</div>
                    <div className="text-lg font-semibold">{stat.value}</div>
                  </div>
                ))}
              </div>

              {/* Open Orders Table */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold">Open orders</h3>
                  <span className="text-xs text-gray-500">{formattedOrders.length} working</span>
                </div>
                <div className="bg-transparent border border-gray-800 rounded-lg overflow-hidden">
                  <table className="w-full text-xs">
                    <thead className="bg-slate-950/50">
                      <tr className="text-gray-400">
                        <th className="text-left px-4 py-2 font-medium">Symbol</th>
                        <th className="text-left px-4 py-2 font-medium">Qty</th>
                        <th className="text-left px-4 py-2 font-medium">Price</th>
                        <th className="text-left px-4 py-2 font-medium">Status</th>
                        <th className="text-left px-4 py-2 font-medium">Filled</th>
                        <th className="text-left px-4 py-2 font-medium">Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formattedOrders.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                            No open orders
                          </td>
                        </tr>
                      ) : (
                        formattedOrders.map((order, idx) => (
                          <tr key={idx} className="border-t border-gray-800 hover:bg-slate-950/30">
                            <td className="px-4 py-3 font-medium">{order.symbol}</td>
                            <td className="px-4 py-3 text-emerald-400">{order.qty}</td>
                            <td className="px-4 py-3">{order.price}</td>
                            <td className="px-4 py-3">
                              <span className="bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded text-xs">
                                {order.status}
                              </span>
                            </td>
                            <td className="px-4 py-3">{order.filled}</td>
                            <td className="px-4 py-3 text-gray-400">{order.type}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Positions Table */}
              <div>
                <h3 className="text-sm font-semibold mb-3">Positions</h3>
                <div className="bg-transparent border border-gray-800 rounded-lg overflow-hidden">
                  <table className="w-full text-xs">
                    <thead className="bg-slate-950/50">
                      <tr className="text-gray-400">
                        <th className="text-left px-4 py-2 font-medium">Symbol</th>
                        <th className="text-left px-4 py-2 font-medium">Qty</th>
                        <th className="text-left px-4 py-2 font-medium">Avg price</th>
                        <th className="text-left px-4 py-2 font-medium">Last</th>
                        <th className="text-left px-4 py-2 font-medium">P/L</th>
                        <th className="text-left px-4 py-2 font-medium">P/L (%/Profit)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formattedPositions.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                            No open positions
                          </td>
                        </tr>
                      ) : (
                        formattedPositions.map((pos, idx) => (
                          <tr key={idx} className="border-t border-gray-800 hover:bg-slate-950/30">
                            <td className="px-4 py-3 font-medium">{pos.symbol}</td>
                            <td className="px-4 py-3">{pos.qty}</td>
                            <td className="px-4 py-3">{pos.avgPrice}</td>
                            <td className="px-4 py-3">{pos.last}</td>
                            <td className={`px-4 py-3 font-medium ${
                              pos.pl.includes('+') ? 'text-emerald-400' : 
                              pos.pl === '-' ? 'text-gray-400' : 'text-red-400'
                            }`}>
                              {pos.pl}
                            </td>
                            <td className={`px-4 py-3 font-medium ${
                              pos.plPercent.includes('+') ? 'text-emerald-400' : 
                              pos.plPercent.includes('$') ? 'text-gray-400' : 'text-red-400'
                            }`}>
                              {pos.plPercent}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <OrderTicket
            symbol={selectedSymbol}
            currentPrice={liveQuoteData?.price || 0}
            assetType={selectedAssetType}
          />
        </div>
      </div>
    </div>
  )
}
