'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

export function ChartSection() {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const chartOptions: ApexCharts.ApexOptions = {
        chart: {
            type: 'area',
            height: 400,
            toolbar: {
                show: false
            },
            zoom: {
                enabled: false
            },
            background: 'transparent'
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth',
            width: 3
        },
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.7,
                opacityTo: 0.2,
                stops: [0, 90, 100]
            }
        },
        colors: ['#a855f7', '#ec4899'],
        xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            labels: {
                style: {
                    colors: '#94a3b8'
                }
            }
        },
        yaxis: {
            labels: {
                style: {
                    colors: '#94a3b8'
                },
                formatter: (value) => `$${value.toFixed(0)}`
            }
        },
        grid: {
            borderColor: '#334155',
            strokeDashArray: 4
        },
        tooltip: {
            theme: 'dark',
            y: {
                formatter: (value) => `$${value.toFixed(2)}`
            }
        },
        legend: {
            show: true,
            labels: {
                colors: '#94a3b8'
            }
        }
    }

    const series = [
        {
            name: 'Portfolio Value',
            data: [30000, 35000, 32000, 38000, 42000, 45000, 48000, 52000, 49000, 55000, 58000, 62000]
        },
        {
            name: 'Market Average',
            data: [28000, 30000, 31000, 33000, 35000, 37000, 39000, 41000, 43000, 45000, 47000, 49000]
        }
    ]

    if (!mounted) {
        return (
            <section className="py-24 bg-gradient-to-b from-background to-muted/20">
                <div className="container mx-auto px-6">
                    <div className="h-[400px] flex items-center justify-center">
                        <div className="text-muted-foreground">Loading chart...</div>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className="py-24 bg-gradient-to-b from-background to-muted/20">
            <div className="container mx-auto px-6">
                <div className="max-w-6xl mx-auto">
                    {/* Section Header */}
                    <div className="text-center mb-12 animate-fade-in">
                        <h2 className="text-4xl sm:text-5xl font-bold mb-4">
                            <span className="bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
                                Track Your Performance
                            </span>
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            Real-time analytics and insights to help you make better trading decisions
                        </p>
                    </div>

                    {/* Chart Card */}
                    <div className="bg-card border-2 border-border rounded-2xl p-8 shadow-2xl animate-scale-in delay-200">
                        <Chart
                            options={chartOptions}
                            series={series}
                            type="area"
                            height={400}
                        />
                    </div>

                    {/* Stats Below Chart */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
                        {[
                            { label: 'Total Return', value: '+106.7%', color: 'text-green-500' },
                            { label: 'Win Rate', value: '73.2%', color: 'text-blue-500' },
                            { label: 'Avg. Profit', value: '$1,247', color: 'text-purple-500' },
                            { label: 'Trades', value: '1,234', color: 'text-pink-500' }
                        ].map((stat, index) => (
                            <div
                                key={stat.label}
                                className="bg-card border border-border rounded-xl p-6 text-center animate-slide-up"
                                style={{ animationDelay: `${400 + index * 100}ms` }}
                            >
                                <div className={`text-2xl font-bold ${stat.color} mb-2`}>
                                    {stat.value}
                                </div>
                                <div className="text-sm text-muted-foreground">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
