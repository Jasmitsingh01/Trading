// app/markets/page.tsx
'use client'

import { useState, useEffect } from 'react'
import Header from "@/components/ui/header"
import { Footer } from "@/components/landing/footer"
import { TrendingUp, TrendingDown, Bitcoin, DollarSign, Globe, Coins } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const marketCategories = [
    {
        icon: TrendingUp,
        title: 'Stocks & ETFs',
        description: 'Trade thousands of stocks and ETFs from major global exchanges',
        markets: ['NYSE', 'NASDAQ', 'LSE', 'TSE'],
        color: 'from-blue-500 to-cyan-500',
        stats: { assets: '10,000+', exchanges: '15+', countries: '30+' }
    },
    {
        icon: Bitcoin,
        title: 'Cryptocurrencies',
        description: 'Access 50+ cryptocurrencies with 24/7 trading and low fees',
        markets: ['Bitcoin', 'Ethereum', 'Solana', 'Cardano'],
        color: 'from-purple-500 to-pink-500',
        stats: { assets: '50+', trading: '24/7', fees: '0.1%' }
    },
    {
        icon: DollarSign,
        title: 'Forex',
        description: 'Trade major, minor, and exotic currency pairs with tight spreads',
        markets: ['EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD'],
        color: 'from-emerald-500 to-teal-500',
        stats: { pairs: '70+', leverage: 'Up to 1:100', spreads: 'From 0.1 pips' }
    },
    {
        icon: Coins,
        title: 'Commodities',
        description: 'Trade gold, silver, oil, and other commodities with competitive rates',
        markets: ['Gold', 'Silver', 'Crude Oil', 'Natural Gas'],
        color: 'from-orange-500 to-red-500',
        stats: { assets: '25+', leverage: 'Up to 1:20', hours: '23/5' }
    }
]

const topMovers = [
    { symbol: 'AAPL', name: 'Apple Inc.', price: '$178.45', change: '+2.34%', positive: true },
    { symbol: 'TSLA', name: 'Tesla Inc.', price: '$242.84', change: '+5.67%', positive: true },
    { symbol: 'MSFT', name: 'Microsoft', price: '$384.92', change: '+1.89%', positive: true },
    { symbol: 'BTC', name: 'Bitcoin', price: '$43,256.00', change: '+3.42%', positive: true },
    { symbol: 'ETH', name: 'Ethereum', price: '$2,287.50', change: '-1.23%', positive: false },
    { symbol: 'EUR/USD', name: 'Euro/Dollar', price: '1.0876', change: '+0.45%', positive: true }
]

const features = [
    'Real-time market data and news',
    'Advanced charting and analysis tools',
    'Market depth and order book',
    'Watchlists and price alerts',
    'Economic calendar',
    'Screeners and scanners'
]

export default function MarketsPage() {
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
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[128px]" />

                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className={`text-center max-w-4xl mx-auto transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 backdrop-blur-sm mb-6">
                                <Globe className="w-4 h-4 text-blue-400" />
                                <span className="text-sm font-medium text-blue-400">Global Markets</span>
                            </div>
                            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6">
                                Explore
                                <span className="block bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text mt-2">
                                    Global Markets
                                </span>
                            </h1>
                            <p className="text-xl text-slate-400 leading-relaxed">
                                Access stocks, crypto, forex, and commodities from around the world
                            </p>
                        </div>
                    </div>
                </section>

                {/* Market Categories */}
                <section className="py-24 relative">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                            {marketCategories.map((category, index) => {
                                const Icon = category.icon
                                return (
                                    <div
                                        key={index}
                                        className="relative group"
                                    >
                                        <div className={`absolute inset-0 bg-gradient-to-r ${category.color} opacity-0 group-hover:opacity-20 rounded-2xl blur-xl transition-opacity duration-500`} />
                                        <div className="relative bg-slate-900/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-800 hover:border-blue-500/50 transition-all duration-300 hover:scale-105">
                                            <div className={`w-16 h-16 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center mb-6 shadow-lg`}>
                                                <Icon className="w-8 h-8 text-white" />
                                            </div>

                                            <h3 className="text-3xl font-bold text-white mb-3">
                                                {category.title}
                                            </h3>
                                            <p className="text-slate-400 mb-6 leading-relaxed">
                                                {category.description}
                                            </p>

                                            {/* Stats */}
                                            <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-slate-800/50 rounded-xl">
                                                {Object.entries(category.stats).map(([key, value], i) => (
                                                    <div key={i} className="text-center">
                                                        <div className="text-lg font-bold text-white mb-1">{value}</div>
                                                        <div className="text-xs text-slate-400 capitalize">{key}</div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Popular Markets */}
                                            <div className="flex flex-wrap gap-2">
                                                {category.markets.map((market, i) => (
                                                    <span
                                                        key={i}
                                                        className="px-3 py-1 bg-slate-800 text-slate-300 rounded-lg text-sm font-medium"
                                                    >
                                                        {market}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </section>

                {/* Top Movers */}
                <section className="py-24 bg-slate-900 relative">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                                Today's Top Movers
                            </h2>
                            <p className="text-xl text-slate-400">Live market data updated in real-time</p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                            {topMovers.map((stock, index) => (
                                <div
                                    key={index}
                                    className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-800 hover:border-blue-500/50 transition-all duration-300 hover:scale-105 group cursor-pointer"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                                                {stock.symbol.slice(0, 2)}
                                            </div>
                                            <div>
                                                <div className="font-bold text-white">{stock.symbol}</div>
                                                <div className="text-sm text-slate-400">{stock.name}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="text-2xl font-bold text-white">
                                            {stock.price}
                                        </div>
                                        <div className={`flex items-center gap-1 font-semibold ${stock.positive ? 'text-emerald-400' : 'text-red-400'
                                            }`}>
                                            {stock.positive ? (
                                                <TrendingUp className="w-4 h-4" />
                                            ) : (
                                                <TrendingDown className="w-4 h-4" />
                                            )}
                                            {stock.change}
                                        </div>
                                    </div>

                                    {/* Mini Chart */}
                                    <div className="mt-4 h-12 flex items-end justify-between gap-1">
                                        {Array.from({ length: 15 }).map((_, i) => {
                                            const height = Math.random() * 100
                                            return (
                                                <div
                                                    key={i}
                                                    className={`flex-1 rounded-t transition-all duration-300 ${stock.positive
                                                            ? 'bg-gradient-to-t from-emerald-500 to-emerald-400'
                                                            : 'bg-gradient-to-t from-red-500 to-red-400'
                                                        } opacity-60 group-hover:opacity-100`}
                                                    style={{ height: `${height}%` }}
                                                />
                                            )
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-24 relative">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-4xl mx-auto">
                            <div className="text-center mb-12">
                                <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                                    Market Research Tools
                                </h2>
                                <p className="text-xl text-slate-400">Everything you need to stay informed</p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                {features.map((feature, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-4 p-6 bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800"
                                    >
                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <TrendingUp className="w-5 h-5 text-white" />
                                        </div>
                                        <span className="text-white font-semibold">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="text-center mt-12">
                                <Link href="/auth/register">
                                    <Button
                                        size="lg"
                                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-12 py-7 text-lg rounded-2xl shadow-2xl shadow-blue-500/50 transition-all duration-300 hover:scale-105"
                                    >
                                        Start Trading Now
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    )
}
