"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { Props as ChartProps } from "react-apexcharts"

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false })

interface TradingChartProps {
    symbol?: string
    candleData?: any[]
    onTimeframeChange?: (timeframe: string) => void
}

export function TradingChart({ symbol = "AAPL", candleData = [], onTimeframeChange }: TradingChartProps) {
    const [activeTimeframe, setActiveTimeframe] = useState("1D")

    const handleTimeframeChange = (timeframe: string) => {
        setActiveTimeframe(timeframe)
        if (onTimeframeChange) {
            onTimeframeChange(timeframe)
        }
    }

    const chartOptions: ChartProps["options"] = {
        chart: {
            id: "trading-candlestick",
            toolbar: {
                show: true,
                tools: {
                    download: true,
                    zoom: true,
                    zoomin: true,
                    zoomout: true,
                    pan: true,
                    reset: true
                }
            },
            background: 'transparent',
            foreColor: '#9ca3af',
            animations: {
                enabled: true,
                dynamicAnimation: {
                    enabled: true,
                    speed: 350
                }
            }
        },
        xaxis: {
            type: 'datetime',
            labels: {
                style: { colors: "#64748b", fontSize: '10px' },
                datetimeFormatter: {
                    year: 'yyyy',
                    month: 'MMM \'yy',
                    day: 'dd MMM',
                    hour: 'HH:mm'
                }
            }
        },
        yaxis: {
            labels: {
                style: { colors: "#64748b", fontSize: '10px' },
                formatter: (val: number) => `$${val.toLocaleString()}`
            },
            opposite: true
        },
        grid: {
            borderColor: "#1e293b",
            strokeDashArray: 2
        },
        tooltip: {
            theme: "dark",
            x: { format: 'dd MMM HH:mm' }
        },
        plotOptions: {
            candlestick: {
                colors: {
                    upward: '#10B981',
                    downward: '#EF4444'
                }
            }
        }
    }

    const chartSeries = [{
        name: symbol,
        data: candleData.length > 0 ? candleData : [
            { x: new Date('2023-10-24T09:00:00').getTime(), y: [210, 212, 209, 211] },
            { x: new Date('2023-10-24T10:00:00').getTime(), y: [211, 215, 210, 214] },
            { x: new Date('2023-10-24T11:00:00').getTime(), y: [214, 218, 213, 217] },
            { x: new Date('2023-10-24T12:00:00').getTime(), y: [217, 219, 215, 216] },
            { x: new Date('2023-10-24T13:00:00').getTime(), y: [216, 220, 215, 219] },
            { x: new Date('2023-10-24T14:00:00').getTime(), y: [219, 221, 217, 218] },
            { x: new Date('2023-10-24T15:00:00').getTime(), y: [218, 217, 213, 214] },
            { x: new Date('2023-10-24T16:00:00').getTime(), y: [214, 216, 213, 215] },
        ]
    }]

    return (
        <div className="flex-1 p-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1">
                    {["1D", "5D", "1M", "6M", "YTD", "1Y", "5Y", "All"].map(period => (
                        <button
                            key={period}
                            onClick={() => handleTimeframeChange(period)}
                            className={`px-3 py-1.5 rounded text-xs font-medium transition ${activeTimeframe === period
                                ? 'bg-gray-700 text-white'
                                : 'text-gray-400 hover:text-white hover:bg-slate-950'
                                }`}
                        >
                            {period}
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-2">
                    <button className="px-3 py-1.5 bg-slate-950 hover:bg-gray-700 rounded text-xs text-gray-400">
                        Indicators
                    </button>
                    <button className="px-3 py-1.5 bg-slate-950 hover:bg-gray-700 rounded text-xs text-gray-400">
                        Compare
                    </button>
                </div>
            </div>

            <div className="bg-transparent border border-gray-800 rounded-lg p-4 mb-4">
                <Chart
                    options={chartOptions}
                    series={chartSeries}
                    type="candlestick"
                    height={380}
                />
            </div>

            <div className="flex border-b border-gray-800 mb-4">
                {["Overview", "News", "Fundamentals", "Order book"].map((tab, idx) => (
                    <button
                        key={tab}
                        className={`px-4 py-2.5 text-xs font-medium transition ${idx === 0
                            ? 'text-white border-b-2 border-emerald-500'
                            : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>
        </div>
    )
}
