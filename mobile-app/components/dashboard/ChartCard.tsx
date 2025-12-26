"use client"

import dynamic from "next/dynamic"
import { Props as ChartProps } from "react-apexcharts"

// Dynamically import Chart with SSR disabled
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false })

interface ChartCardProps {
    title: string
    options: ChartProps["options"]
    series: ChartProps["series"]
    type: ChartProps["type"]
    height?: number
    actions?: React.ReactNode
}

export function ChartCard({ title, options, series, type, height = 250, actions }: ChartCardProps) {
    // Check if series has any data
    const hasData = series && series.length > 0 &&
        typeof series[0] === 'object' &&
        'data' in series[0] &&
        Array.isArray(series[0].data) &&
        series[0].data.length > 0

    return (
        <div className="border border-white/5 rounded-2xl p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white">{title}</h3>
                {actions && (
                    <div className="flex gap-1">
                        {actions}
                    </div>
                )}
            </div>
            {hasData ? (
                <Chart options={options} series={series} type={type} height={height} />
            ) : (
                <div className="flex flex-col items-center justify-center" style={{ height: `${height}px` }}>
                    <div className="w-16 h-16 mb-4 rounded-full bg-slate-800/50 flex items-center justify-center">
                        <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    </div>
                    <p className="text-slate-400 text-sm mb-1">No data available</p>
                    <p className="text-slate-500 text-xs">Start trading to see your {title.toLowerCase()}</p>
                </div>
            )}
        </div>
    )
}
