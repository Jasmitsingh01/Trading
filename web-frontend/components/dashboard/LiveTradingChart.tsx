'use client'

import React, { useEffect, useState, useMemo } from "react"
import dynamic from 'next/dynamic'
import type { ApexOptions } from "apexcharts"
import { useBinanceWebSocket } from "@/hooks/useBinanceWebSocket"
import useFinnhubForex from "@/hooks/useFinnhubForex"

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

interface LiveTradingChartProps {
  symbol: string
  assetType: 'stock' | 'crypto' | 'forex'
  height?: number
}

interface PricePoint {
  x: number
  y: number
}

export default function LiveTradingChart({ symbol, assetType, height = 400 }: LiveTradingChartProps) {
  const [priceHistory, setPriceHistory] = useState<PricePoint[]>([])
  const [currentPrice, setCurrentPrice] = useState<number>(0)
  const [high24h, setHigh24h] = useState<number>(0)
  const [low24h, setLow24h] = useState<number>(0)
  const [volume, setVolume] = useState<string>('0')
  const [change, setChange] = useState<string>('0')
  const [previousPrice, setPreviousPrice] = useState<number>(0)

  // Use WebSocket for crypto
  const cryptoData = useBinanceWebSocket({
    symbol: symbol.endsWith('USDT') ? symbol : `${symbol}USDT`,
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
      const newHigh = parseFloat(cryptoData.data.high)
      const newLow = parseFloat(cryptoData.data.low)
      const newVolume = cryptoData.data.volume
      const newChange = cryptoData.data.changePercent

      if (newPrice > 0) {
        setCurrentPrice(newPrice)
        setHigh24h(newHigh)
        setLow24h(newLow)
        setVolume(newVolume)
        setChange(newChange)

        const timestamp = Date.now()

        setPriceHistory(prev => {
          const newHistory = [...prev, { x: timestamp, y: newPrice }]

          // Keep last 100 points (adjustable based on needs)
          if (newHistory.length > 100) {
            return newHistory.slice(-100)
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

        // Calculate high/low from price history
        if (previousPrice === 0) {
          setPreviousPrice(newPrice)
          setHigh24h(newPrice)
          setLow24h(newPrice)
        } else {
          setHigh24h(prev => Math.max(prev, newPrice))
          setLow24h(prev => prev === 0 ? newPrice : Math.min(prev, newPrice))
        }

        setCurrentPrice(newPrice)
        setVolume('N/A')
        setChange(newChange)

        const timestamp = Date.now()

        setPriceHistory(prev => {
          const newHistory = [...prev, { x: timestamp, y: newPrice }]

          // Keep last 100 points (adjustable based on needs)
          if (newHistory.length > 100) {
            return newHistory.slice(-100)
          }

          return newHistory
        })

        setPreviousPrice(newPrice)
      }
    }
  }, [forexRates, symbol, assetType, previousPrice])

  const isConnected = assetType === 'crypto' ? cryptoData.isConnected : !forexLoading
  const hasError = assetType === 'crypto' ? cryptoData.error : forexError

  const options: ApexOptions = useMemo(() => ({
    chart: {
      id: "live-trading-chart",
      type: "line",
      animations: {
        enabled: true,
        easing: 'linear',
        dynamicAnimation: {
          speed: 500
        }
      } as any,
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true
        }
      },
      foreColor: "#94a3b8",
      background: "transparent",
      fontFamily: 'Inter, sans-serif',
      zoom: {
        enabled: true,
        type: 'x',
        autoScaleYaxis: true
      }
    },
    stroke: {
      curve: "smooth",
      width: 2,
      colors: [parseFloat(change) >= 0 ? '#10b981' : '#ef4444']
    },
    grid: {
      borderColor: "#334155",
      strokeDashArray: 3,
      padding: {
        left: 20,
        right: 20,
        top: 10,
        bottom: 10
      },
      xaxis: {
        lines: {
          show: true
        }
      },
      yaxis: {
        lines: {
          show: true
        }
      }
    },
    colors: [parseFloat(change) >= 0 ? '#10b981' : '#ef4444'],
    xaxis: {
      type: 'datetime',
      labels: {
        style: {
          colors: "#94a3b8",
          fontWeight: 500,
          fontSize: "11px"
        },
        datetimeFormatter: {
          year: 'yyyy',
          month: 'MMM \'yy',
          day: 'dd MMM',
          hour: 'HH:mm',
          minute: 'HH:mm:ss',
          second: 'HH:mm:ss'
        }
      },
      axisBorder: {
        show: true,
        color: '#334155'
      },
      axisTicks: {
        show: true,
        color: '#334155'
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: "#94a3b8",
          fontWeight: 600,
          fontSize: "11px"
        },
        formatter: (val: number) => {
          if (assetType === 'forex') {
            return val.toFixed(5)
          }
          return val >= 1000 ? `$${val.toLocaleString()}` : `$${val.toFixed(2)}`
        }
      },
      axisBorder: {
        show: true,
        color: '#334155'
      }
    },
    tooltip: {
      theme: "dark",
      style: {
        fontSize: "12px",
        fontFamily: "Inter, sans-serif"
      },
      x: {
        format: 'HH:mm:ss'
      },
      y: {
        formatter: (val: number) => {
          return val >= 1000 ? `$${val.toLocaleString()}` : `$${val.toFixed(2)}`
        }
      }
    },
    markers: {
      size: 0,
      hover: {
        size: 5,
        sizeOffset: 3
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'vertical',
        shadeIntensity: 0.2,
        opacityFrom: 0.5,
        opacityTo: 0.1,
        stops: [0, 100]
      }
    }
  }), [change, assetType])

  const series = useMemo(() => [{
    name: `${symbol} Price`,
    data: priceHistory
  }], [priceHistory, symbol])

  return (
    <div className="bg-slate-900/30 rounded-lg border border-white/10 p-6">
      {/* Header with connection status */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="font-bold text-xl text-white">{symbol}</h3>
            <div className={`flex items-center gap-1.5 text-xs ${isConnected ? 'text-emerald-400' : 'text-red-400'}`}>
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`}></div>
              <span className="font-medium">
                {isConnected ? 'Live' : 'Disconnected'}
              </span>
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-white">
              ${currentPrice.toLocaleString()}
            </span>
            <span className={`text-sm font-semibold ${parseFloat(change) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {parseFloat(change) >= 0 ? '+' : ''}{change}%
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-6 text-xs">
          <div>
            <div className="text-slate-400 mb-0.5">24h High</div>
            <div className="font-semibold text-white">
              ${high24h.toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-slate-400 mb-0.5">24h Low</div>
            <div className="font-semibold text-white">
              ${low24h.toLocaleString()}
            </div>
          </div>
          {volume !== '0' && (
            <div>
              <div className="text-slate-400 mb-0.5">24h Volume</div>
              <div className="font-semibold text-white">
                {parseFloat(volume).toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </div>
            </div>
          )}
        </div>
      </div>



      {/* Chart */}
      {priceHistory.length > 0 ? (
        <Chart
          options={options}
          series={series}
          type="area"
          height={height}
        />
      ) : (
        <div className="flex items-center justify-center" style={{ height }}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500 mx-auto mb-3"></div>
            <p className="text-slate-400 text-sm">Waiting for live data...</p>
            <p className="text-slate-500 text-xs mt-1">
              Connecting to {assetType === 'forex' ? 'Finnhub' : 'Binance'}
            </p>
          </div>
        </div>
      )}

      {/* Data points counter */}
      {priceHistory.length > 0 && (
        <div className="mt-3 text-xs text-slate-500 text-center">
          {priceHistory.length} data points • Updates in real-time
        </div>
      )}
    </div>
  )
}
