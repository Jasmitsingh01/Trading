'use client'

import { useEffect, useState } from "react"
import { Star, TrendingUp, TrendingDown } from "lucide-react"
import { useBinanceWebSocket } from "@/hooks/useBinanceWebSocket"
import useFinnhubForex from "@/hooks/useFinnhubForex"
import MiniLiveChart from "./MiniLiveChart"

interface LiveWatchlistItemProps {
  symbol: string
  name: string
  assetType: 'stock' | 'crypto' | 'forex'
  onSelect?: () => void
  isSelected?: boolean
  showChart?: boolean
}

export default function LiveWatchlistItem({
  symbol,
  name,
  assetType,
  onSelect,
  isSelected,
  showChart = true
}: LiveWatchlistItemProps) {
  const [priceHistory, setPriceHistory] = useState<{ x: number; y: number }[]>([])
  const [currentPrice, setCurrentPrice] = useState<number>(0)
  const [change, setChange] = useState<string>('0')
  const [formattedPrice, setFormattedPrice] = useState<string>('$0.00')

  // Use WebSocket for crypto
  const cryptoSymbol = symbol.endsWith('USDT') ? symbol : `${symbol}USDT`

  const cryptoData = useBinanceWebSocket({
    symbol: cryptoSymbol,
    enabled: assetType === 'crypto'
  })

  // Use API for forex data
  const { forexRates, forexSymbols, loading: forexLoading, error: forexError } = useFinnhubForex({
    exchange: 'OANDA',
    symbolsToSubscribe: assetType === 'forex' ? symbol : []
  })

  // Update price history when new crypto data arrives
  useEffect(() => {
    if (assetType === 'crypto' && cryptoData.data) {
      const newPrice = parseFloat(cryptoData.data.price)
      const newChange = cryptoData.data.changePercent

      if (newPrice > 0) {
        setCurrentPrice(newPrice)
        setChange(newChange)
        setFormattedPrice(`$${newPrice.toFixed(2)}`)

        const timestamp = Date.now()

        setPriceHistory(prev => {
          const newHistory = [...prev, { x: timestamp, y: newPrice }]

          // Keep last 30 points for mini chart
          if (newHistory.length > 30) {
            return newHistory.slice(-30)
          }

          return newHistory
        })
      }
    }
  }, [cryptoData.data, assetType])

  // Update price history when new forex data arrives
  useEffect(() => {
    if (assetType === 'forex' && forexRates) {
      // Access rate directly using symbol as key
      const rate = forexRates[symbol]

      if (rate && rate.price > 0) {
        const newPrice = rate.price
        const newChange = rate.change.toString()

        setCurrentPrice(newPrice)
        setChange(newChange)
        setFormattedPrice(`$${newPrice.toFixed(5)}`)

        const timestamp = Date.now()

        setPriceHistory(prev => {
          const newHistory = [...prev, { x: timestamp, y: newPrice }]

          // Keep last 30 points for mini chart
          if (newHistory.length > 30) {
            return newHistory.slice(-30)
          }

          return newHistory
        })
      }
    }
  }, [forexRates, symbol, assetType])

  const isPositive = parseFloat(change) >= 0
  const isConnected = assetType === 'crypto' ? cryptoData.isConnected : !forexLoading

  return (
    <div
      onClick={onSelect}
      className={`px-4 py-3 border-b border-gray-800 hover:bg-slate-950/50 cursor-pointer transition ${isSelected ? 'bg-slate-950/70 border-l-2 border-l-emerald-500' : ''
        }`}
    >
      <div className="flex items-center justify-between mb-1">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <div className="font-semibold text-sm">{symbol}</div>
            {isConnected && (
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
            )}
          </div>
          <div className="text-xs text-gray-500">{name}</div>
        </div>
        <Star className="w-3.5 h-3.5 text-gray-600 hover:text-yellow-500" />
      </div>

      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-semibold">{formattedPrice}</div>
        <div className={`text-xs font-medium flex items-center gap-1 ${isPositive ? 'text-emerald-400' : 'text-red-400'
          }`}>
          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {isPositive ? '+' : ''}{change}%
        </div>
      </div>

      {showChart && priceHistory.length > 0 && (
        <div className="mt-1 -mx-2">
          <MiniLiveChart
            priceHistory={priceHistory}
            currentPrice={currentPrice}
            change={change}
            symbol={symbol}
            height={50}
          />
        </div>
      )}

      {showChart && priceHistory.length === 0 && (
        <div className="mt-1 h-[50px] flex items-center justify-center">
          <div className="text-xs text-slate-600">Loading...</div>
        </div>
      )}
    </div>
  )
}
