// app/trading-tools/page.tsx
'use client'

import { useState, useEffect } from 'react'
import Header from "@/components/ui/header"
import { Footer } from "@/components/landing/footer"
import {
    Settings,
    BarChart3,
    TrendingUp,
    Calculator,
    Bell,
    Target,
    LineChart,
    PieChart,
    Activity,
    Sliders,
    Crosshair,
    Layers
} from 'lucide-react'

const tools = [
    {
        icon: BarChart3,
        title: 'Advanced Charting',
        description: 'Professional charting tools with 100+ technical indicators, drawing tools, and multiple timeframes',
        features: ['Candlestick, bar, line charts', 'Multiple chart layouts', 'Custom indicators', 'Pattern recognition'],
        color: 'from-blue-500 to-cyan-500'
    },
    {
        icon: Calculator,
        title: 'Trading Calculator',
        description: 'Calculate position sizes, profit/loss, pip values, and risk-to-reward ratios instantly',
        features: ['Position size calculator', 'Pip calculator', 'Margin calculator', 'Profit/loss calculator'],
        color: 'from-purple-500 to-pink-500'
    },
    {
        icon: Bell,
        title: 'Price Alerts',
        description: 'Set custom price alerts and get notified via email, SMS, or push notifications',
        features: ['Real-time notifications', 'Multiple alert types', 'Unlimited alerts', 'Sound notifications'],
        color: 'from-emerald-500 to-teal-500'
    },
    {
        icon: Target,
        title: 'Market Scanner',
        description: 'Scan thousands of assets to find trading opportunities based on your criteria',
        features: ['Custom filters', 'Pre-built strategies', 'Real-time scanning', 'Backtesting'],
        color: 'from-orange-500 to-red-500'
    },
    {
        icon: LineChart,
        title: 'Economic Calendar',
        description: 'Stay updated with major economic events and news that move markets',
        features: ['Global events', 'Impact indicators', 'Historical data', 'Custom filters'],
        color: 'from-indigo-500 to-purple-500'
    },
    {
        icon: PieChart,
        title: 'Portfolio Analyzer',
        description: 'Analyze your portfolio performance, risk, and asset allocation',
        features: ['Performance metrics', 'Risk analysis', 'Diversification', 'Tax reports'],
        color: 'from-rose-500 to-pink-500'
    },
    {
        icon: Activity,
        title: 'Trading Signals',
        description: 'AI-powered trading signals based on technical analysis and market sentiment',
        features: ['Buy/sell signals', 'AI predictions', 'Sentiment analysis', 'Signal accuracy'],
        color: 'from-cyan-500 to-blue-500'
    },
    {
        icon: Sliders,
        title: 'Risk Management',
        description: 'Advanced risk management tools including stop-loss, take-profit, and trailing stops',
        features: ['Auto stop-loss', 'Take profit orders', 'Trailing stops', 'Risk limits'],
        color: 'from-violet-500 to-purple-500'
    },
    {
        icon: Crosshair,
        title: 'Market Depth',
        description: 'View order book depth and see real-time buy/sell pressure in the market',
        features: ['Level 2 data', 'Order flow', 'Bid/ask spread', 'Volume analysis'],
        color: 'from-green-500 to-emerald-500'
    },
    {
        icon: Layers,
        title: 'Multi-Asset Trading',
        description: 'Trade multiple assets simultaneously from a single interface',
        features: ['Multi-window', 'Sync charts', 'Quick switch', 'Watchlists'],
        color: 'from-amber-500 to-orange-500'
    },
    {
        icon: TrendingUp,
        title: 'Backtesting Engine',
        description: 'Test your trading strategies on historical data before risking real money',
        features: ['Historical data', 'Strategy builder', 'Performance reports', 'Optimization'],
        color: 'from-teal-500 to-cyan-500'
    },
    {
        icon: Settings,
        title: 'Trading Bot',
        description: 'Automate your trading strategies with our powerful bot framework',
        features: ['Strategy automation', 'No coding required', '24/7 execution', 'Performance tracking'],
        color: 'from-fuchsia-500 to-pink-500'
    }
]

const categories = [
    { name: 'Analysis Tools', count: 15 },
    { name: 'Risk Management', count: 8 },
    { name: 'Automation', count: 5 },
    { name: 'Research', count: 12 }
]

export default function TradingToolsPage() {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    return (
        <>
            <Header />
            <main className="min-h-screen bg-slate-950">
                {/* Hero Section */}
                <section className="relative pt-32 pb-20 overflow-hidden">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem]" />
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[128px]" />

                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className={`text-center max-w-4xl mx-auto transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 backdrop-blur-sm mb-6">
                                <Settings className="w-4 h-4 text-blue-400" />
                                <span className="text-sm font-medium text-blue-400">Professional Trading Utilities</span>
                            </div>
                            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6">
                                Professional
                                <span className="block bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text mt-2">
                                    Trading Utilities
                                </span>
                            </h1>
                            <p className="text-xl text-slate-400 leading-relaxed">
                                Access powerful tools designed to enhance your trading performance
                            </p>
                        </div>
                    </div>
                </section>

                {/* Categories */}
                <section className="py-16 relative">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
                            {categories.map((category, index) => (
                                <div
                                    key={index}
                                    className="text-center p-6 bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800 hover:border-blue-500/50 transition-all duration-300 hover:scale-105"
                                >
                                    <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text mb-2">
                                        {category.count}
                                    </div>
                                    <div className="text-slate-400">{category.name}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Tools Grid */}
                <section className="py-24 relative">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {tools.map((tool, index) => {
                                const Icon = tool.icon
                                return (
                                    <div
                                        key={index}
                                        className="relative group"
                                    >
                                        <div className={`absolute inset-0 bg-gradient-to-r ${tool.color} opacity-0 group-hover:opacity-20 rounded-2xl blur-xl transition-opacity duration-500`} />
                                        <div className="relative h-full bg-slate-900/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-800 hover:border-blue-500/50 transition-all duration-300 hover:scale-105">
                                            <div className={`w-16 h-16 bg-gradient-to-br ${tool.color} rounded-xl flex items-center justify-center mb-6 shadow-lg`}>
                                                <Icon className="w-8 h-8 text-white" />
                                            </div>

                                            <h3 className="text-2xl font-bold text-white mb-3">
                                                {tool.title}
                                            </h3>
                                            <p className="text-slate-400 mb-6 leading-relaxed">
                                                {tool.description}
                                            </p>

                                            <ul className="space-y-2">
                                                {tool.features.map((feature, i) => (
                                                    <li key={i} className="flex items-center gap-2 text-slate-300 text-sm">
                                                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full flex-shrink-0" />
                                                        {feature}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-24 bg-slate-900 relative">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-4xl mx-auto text-center">
                            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                                Access All Tools for Free
                            </h2>
                            <p className="text-xl text-slate-400 mb-8">
                                Every trading tool is included with your free account
                            </p>
                            <a href="/auth/register">
                                <button className="px-12 py-7 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-lg font-semibold rounded-2xl shadow-2xl shadow-blue-500/50 transition-all duration-300 hover:scale-105">
                                    Get Started Free
                                </button>
                            </a>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    )
}
