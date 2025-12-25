'use client'

import React, { useEffect, useState, useMemo } from "react"
import dynamic from 'next/dynamic'
import type { ApexOptions } from "apexcharts"

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

interface MiniLiveChartProps {
  priceHistory: { x: number; y: number }[]
  currentPrice: number
  change: string
  symbol: string
  height?: number
}

export default function MiniLiveChart({ 
  priceHistory, 
  currentPrice, 
  change, 
  symbol,
  height = 100 
}: MiniLiveChartProps) {
  const isPositive = parseFloat(change) >= 0

  const options: ApexOptions = useMemo(() => ({
    chart: {
      type: "line",
      sparkline: {
        enabled: true
      },
      animations: {
        enabled: true,
        easing: 'linear',
        dynamicAnimation: {
          speed: 500
        }
      }
    },
    stroke: {
      curve: "smooth",
      width: 2,
      colors: [isPositive ? '#10b981' : '#ef4444']
    },
    colors: [isPositive ? '#10b981' : '#ef4444'],
    tooltip: {
      enabled: true,
      theme: "dark",
      x: {
        format: 'HH:mm:ss'
      },
      y: {
        formatter: (val: number) => `$${val.toFixed(2)}`
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'vertical',
        opacityFrom: 0.4,
        opacityTo: 0.1,
        stops: [0, 100]
      }
    }
  }), [isPositive])

  const series = useMemo(() => [{
    name: symbol,
    data: priceHistory
  }], [priceHistory, symbol])

  if (priceHistory.length === 0) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <div className="w-4 h-4 border-2 border-slate-500 border-t-emerald-500 rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <Chart
      options={options}
      series={series}
      type="area"
      height={height}
    />
  )
}
