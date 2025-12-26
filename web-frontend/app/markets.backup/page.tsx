'use client'

import { useState, useEffect } from 'react'
import Header from "@/components/ui/header"
import { Footer } from "@/components/landing/footer"
import { TrendingUp, TrendingDown, Bitcoin, DollarSign, Globe, Coins, BarChart3, Clock, CheckCircle, ArrowRight, Search, Star, Activity, Building2, Zap } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const marketCategories = [
    {
        icon: TrendingUp,
        title: 'Stocks & ETFs',
        description: 'Trade thousands of stocks and ETFs from major global exchanges with real-time data and fractional shares.',
        markets: ['NYSE', 'NASDAQ', 'LSE', 'TSE', 'Euronext'],
        stats: { assets: '10,000+', exchanges: '15+', countries: '30+' },
        features: ['Fractional shares', 'Pre-market trading', 'After-hours trading', 'Dividend tracking']
    },
    {
        icon: Bitcoin,
        title: 'Cryptocurrencies',
        description: 'Access 50+ cryptocurrencies with 24/7 trading, instant execution, and secure cold storage.',
        markets: ['Bitcoin', 'Ethereum', 'Solana', 'Cardano', 'Ripple'],
        stats: { assets: '50+', trading: '24/7', fees: '0.1%' },
        features: ['Cold storage', 'Instant deposits', 'Staking rewards', 'Low fees']
    },
    {
        icon: DollarSign,
        title: 'Forex',
        description: 'Trade 70+ currency pairs including majors, minors, and exotics with ultra-tight spreads.',
        markets: ['EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD', 'USD/CHF'],
        stats: { pairs: '70+', leverage: 'Up to 1:100', spreads: 'From 0.1 pips' },
        features: ['Major pairs', 'Minor pairs', 'Exotic pairs', 'Micro lots']
    },
    {
        icon: Coins,
        title: 'Commodities',
        description: 'Trade precious metals, energy, and agricultural commodities with competitive leverage.',
        markets: ['Gold', 'Silver', 'Crude Oil', 'Natural Gas', 'Wheat'],
        stats: { assets: '25+', leverage: 'Up to 1:20', hours: '23/5' },
        features: ['Precious metals', 'Energy', 'Agriculture', 'CFD trading']
    },
    {
        icon: Building2,
        title: 'Indices',
        description: 'Trade major global indices including S&P 500, NASDAQ, FTSE, and more.',
        markets: ['S&P 500', 'NASDAQ', 'DAX', 'FTSE 100', 'Nikkei'],
        stats: { indices: '20+', leverage: 'Up to 1:20', spread: 'From 0.5' },
        features: ['Major indices', 'Mini contracts', 'Extended hours', 'Low margin']
    },
    {
        icon: Activity,
        title: 'Options & Futures',
        description: 'Advanced derivatives trading with options and futures on various underlying assets.',
        markets: ['Equity options', 'Index options', 'Commodity futures', 'FX futures'],
        stats: { contracts: '1,000+', leverage: 'Variable', expiry: 'Multiple dates' },
        features: ['Calls & puts', 'Spreads', 'Futures contracts', 'Options chains']
    }
]

const topMovers = [
    { symbol: 'AAPL', name: 'Apple Inc.', price: '$178.45', change: '+2.34%', volume: '52.4M', positive: true, category: 'Stock' },
    { symbol: 'TSLA', name: 'Tesla Inc.', price: '$242.84', change: '+5.67%', volume: '128.9M', positive: true, category: 'Stock' },
    { symbol: 'MSFT', name: 'Microsoft Corp.', price: '$384.92', change: '+1.89%', volume: '21.3M', positive: true, category: 'Stock' },
    { symbol: 'BTC/USD', name: 'Bitcoin', price: '$43,256.00', change: '+3.42%', volume: '$28.4B', positive: true, category: 'Crypto' },
    { symbol: 'ETH/USD', name: 'Ethereum', price: '$2,287.50', change: '-1.23%', volume: '$12.8B', positive: false, category: 'Crypto' },
    { symbol: 'EUR/USD', name: 'Euro/Dollar', price: '1.0876', change: '+0.45%', volume: 'High', positive: true, category: 'Forex' },
    { symbol: 'XAU/USD', name: 'Gold', price: '$2,048.30', change: '+0.82%', volume: 'Medium', positive: true, category: 'Commodity' },
    { symbol: 'SPX', name: 'S&P 500', price: '4,783.45', change: '+1.12%', volume: 'High', positive: true, category: 'Index' }
]

const features = [
    { icon: Clock, title: 'Real-Time Data', description: 'Live market data with sub-10ms latency' },
    { icon: BarChart3, title: 'Advanced Charts', description: '100+ technical indicators and drawing tools' },
    { icon: Activity, title: 'Market Depth', description: 'Level 2 quotes and order book analysis' },
    { icon: Star, title: 'Watchlists', description: 'Custom watchlists with price alerts' },
    { icon: Search, title: 'Market Scanner', description: 'Find opportunities with advanced screeners' },
    { icon: Zap, title: 'News & Analysis', description: 'Real-time news and expert market commentary' }
]

const popularAssets = {
    stocks: [
        { symbol: 'AAPL', name: 'Apple Inc.', price: '$178.45', change: '+2.34%' },
        { symbol: 'TSLA', name: 'Tesla Inc.', price: '$242.84', change: '+5.67%' },
        { symbol: 'NVDA', name: 'NVIDIA Corp.', price: '$495.22', change: '+3.21%' },
        { symbol: 'GOOGL', name: 'Alphabet Inc.', price: '$140.93', change: '+1.45%' }
    ],
    crypto: [
        { symbol: 'BTC', name: 'Bitcoin', price: '$43,256', change: '+3.42%' },
        { symbol: 'ETH', name: 'Ethereum', price: '$2,287', change: '-1.23%' },
        { symbol: 'SOL', name: 'Solana', price: '$98.42', change: '+7.89%' },
        { symbol: 'ADA', name: 'Cardano', price: '$0.52', change: '+2.15%' }
    ],
    forex: [
        { symbol: 'EUR/USD', name: 'Euro/Dollar', price: '1.0876', change: '+0.45%' },
        { symbol: 'GBP/USD', name: 'Pound/Dollar', price: '1.2734', change: '+0.32%' },
        { symbol: 'USD/JPY', name: 'Dollar/Yen', price: '143.52', change: '-0.18%' },
        { symbol: 'AUD/USD', name: 'Aussie/Dollar', price: '0.6789', change: '+0.56%' }
    ]
}

const exchanges = [
    { name: 'NYSE', location: 'New York', assets: '2,800+' },
    { name: 'NASDAQ', location: 'New York', assets: '3,300+' },
    { name: 'LSE', location: 'London', assets: '2,000+' },
    { name: 'TSE', location: 'Tokyo', assets: '3,700+' },
    { name: 'Euronext', location: 'Europe', assets: '1,300+' },
    { name: 'HKEX', location: 'Hong Kong', assets: '2,500+' }
]

export default function MarketsPage() {
    const [mounted, setMounted] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState<'stocks' | 'crypto' | 'forex'>('stocks')

    useEffect(() => {
        setMounted(true)
    }, [])

    return (
        <>
            <Header />
            <main className="min-h-screen bg-white">
                {/* Hero Section */}
                <section className="relative pt-32 pb-20 bg-gradient-to-b from-gray-50 to-white">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className={`text-center max-w-4xl mx-auto transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-md bg-emerald-50 border border-emerald-200 mb-6">
                                <Globe className="w-4 h-4 text-emerald-600" />
                                <span className="text-sm font-medium text-emerald-700">150+ Markets Worldwide</span>
                            </div>
                            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                                Trade Global Markets
                                <span className="block text-emerald-600 mt-2">
                                    All in One Platform
                                </span>
                            </h1>
                            <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto mb-8">
                                Access stocks, cryptocurrencies, forex, commodities, and more from around the world with real-time data and institutional-grade execution.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link href="/auth/login">
                                    <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-10">
                                        Start Trading
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </Link>
                                <Link href="/trading-platform">
                                    <Button size="lg" variant="outline" className="border-gray-300 text-gray-700 hover:text-gray-900 hover:bg-gray-50 font-medium px-10">
                                        Explore Platform
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats Bar */}
                <section className="py-12 bg-emerald-600">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto text-center text-white">
                            <div>
                                <div className="text-4xl font-bold mb-1">10,000+</div>
                                <div className="text-sm opacity-90">Tradeable Assets</div>
                            </div>
                            <div>
                                <div className="text-4xl font-bold mb-1">150+</div>
                                <div className="text-sm opacity-90">Global Markets</div>
                            </div>
                            <div>
                                <div className="text-4xl font-bold mb-1">24/7</div>
                                <div className="text-sm opacity-90">Crypto Trading</div>
                            </div>
                            <div>
                                <div className="text-4xl font-bold mb-1">$0</div>
                                <div className="text-sm opacity-90">Commission Fees</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Market Categories */}
                <section className="py-20 bg-gray-50">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <span className="text-sm font-semibold text-emerald-600 uppercase tracking-wider">Asset Classes</span>
                            <h2 className="text-4xl font-bold text-gray-900 mt-3 mb-4">
                                What Would You Like to Trade?
                            </h2>
                            <p className="text-lg text-gray-600">Access multiple asset classes from a single account</p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                            {marketCategories.map((category, index) => {
                                const Icon = category.icon
                                return (
                                    <div
                                        key={index}
                                        className="bg-white border-2 border-gray-200 hover:border-emerald-400 transition-all p-8 group"
                                    >
                                        <div className="w-14 h-14 bg-emerald-100 group-hover:bg-emerald-600 flex items-center justify-center mb-6 transition-colors">
                                            <Icon className="w-7 h-7 text-emerald-600 group-hover:text-white transition-colors" />
                                        </div>

                                        <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                            {category.title}
                                        </h3>
                                        <p className="text-gray-600 mb-6 leading-relaxed text-sm">
                                            {category.description}
                                        </p>

                                        {/* Stats */}
                                        <div className="grid grid-cols-3 gap-3 mb-6 p-4 bg-gray-50 border border-gray-200">
                                            {Object.entries(category.stats).map(([key, value], i) => (
                                                <div key={i} className="text-center">
                                                    <div className="text-lg font-bold text-emerald-600 mb-1">{value}</div>
                                                    <div className="text-xs text-gray-600 capitalize">{key}</div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Features */}
                                        <ul className="space-y-2 mb-6">
                                            {category.features.map((feature, i) => (
                                                <li key={i} className="flex items-start gap-2 text-gray-700 text-sm">
                                                    <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                                                    <span>{feature}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        {/* Popular Markets */}
                                        <div className="flex flex-wrap gap-2">
                                            {category.markets.map((market, i) => (
                                                <span
                                                    key={i}
                                                    className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium border border-gray-200"
                                                >
                                                    {market}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </section>

                {/* Top Movers */}
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <span className="text-sm font-semibold text-emerald-600 uppercase tracking-wider">Market Movers</span>
                            <h2 className="text-4xl font-bold text-gray-900 mt-3 mb-4">
                                Today's Top Performers
                            </h2>
                            <p className="text-lg text-gray-600">Live market data updated every second</p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                            {topMovers.map((asset, index) => (
                                <div
                                    key={index}
                                    className="bg-gray-50 border-2 border-gray-200 hover:border-emerald-300 transition-all p-6 group cursor-pointer"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <div className="font-bold text-gray-900 mb-1">{asset.symbol}</div>
                                            <div className="text-xs text-gray-600">{asset.name}</div>
                                        </div>
                                        <span className="text-xs font-semibold bg-emerald-100 text-emerald-700 px-2 py-1">
                                            {asset.category}
                                        </span>
                                    </div>

                                    <div className="mb-4">
                                        <div className="text-2xl font-bold text-gray-900 mb-1">
                                            {asset.price}
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className={`flex items-center gap-1 font-semibold text-sm ${asset.positive ? 'text-emerald-600' : 'text-red-600'}`}>
                                                {asset.positive ? (
                                                    <TrendingUp className="w-4 h-4" />
                                                ) : (
                                                    <TrendingDown className="w-4 h-4" />
                                                )}
                                                {asset.change}
                                            </div>
                                            <div className="text-xs text-gray-600">Vol: {asset.volume}</div>
                                        </div>
                                    </div>

                                    {/* Mini Chart */}
                                    <div className="h-12 flex items-end justify-between gap-0.5">
                                        {Array.from({ length: 20 }).map((_, i) => {
                                            const height = 20 + Math.random() * 80
                                            return (
                                                <div
                                                    key={i}
                                                    className={`flex-1 transition-all duration-300 ${asset.positive ? 'bg-emerald-400' : 'bg-red-400'} opacity-60 group-hover:opacity-100`}
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

                {/* Popular Assets */}
                <section className="py-20 bg-gray-50">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <span className="text-sm font-semibold text-emerald-600 uppercase tracking-wider">Popular Assets</span>
                            <h2 className="text-4xl font-bold text-gray-900 mt-3 mb-4">
                                Most Traded Markets
                            </h2>
                        </div>

                        <div className="max-w-5xl mx-auto">
                            {/* Category Tabs */}
                            <div className="flex justify-center gap-4 mb-8">
                                {(['stocks', 'crypto', 'forex'] as const).map((category) => (
                                    <button
                                        key={category}
                                        onClick={() => setSelectedCategory(category)}
                                        className={`px-6 py-3 font-semibold capitalize transition-all ${selectedCategory === category
                                                ? 'bg-emerald-600 text-white'
                                                : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-emerald-300'
                                            }`}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>

                            {/* Assets Grid */}
                            <div className="grid md:grid-cols-2 gap-4">
                                {popularAssets[selectedCategory].map((asset, index) => (
                                    <div key={index} className="bg-white border-2 border-gray-200 p-6 flex items-center justify-between hover:border-emerald-300 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
                                                {asset.symbol.slice(0, 2)}
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900">{asset.symbol}</div>
                                                <div className="text-sm text-gray-600">{asset.name}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-gray-900 mb-1">{asset.price}</div>
                                            <div className={`text-sm font-semibold ${asset.change.startsWith('+') ? 'text-emerald-600' : 'text-red-600'}`}>
                                                {asset.change}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Exchanges */}
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <span className="text-sm font-semibold text-emerald-600 uppercase tracking-wider">Global Access</span>
                            <h2 className="text-4xl font-bold text-gray-900 mt-3 mb-4">
                                Connected to Major Exchanges
                            </h2>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                            {exchanges.map((exchange, index) => (
                                <div key={index} className="bg-gray-50 border-2 border-gray-200 p-6 text-center">
                                    <Building2 className="w-10 h-10 text-emerald-600 mx-auto mb-4" />
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{exchange.name}</h3>
                                    <p className="text-sm text-gray-600 mb-2">{exchange.location}</p>
                                    <p className="text-emerald-600 font-semibold">{exchange.assets} assets</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-20 bg-gray-50">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <span className="text-sm font-semibold text-emerald-600 uppercase tracking-wider">Market Tools</span>
                            <h2 className="text-4xl font-bold text-gray-900 mt-3 mb-4">
                                Professional Research Tools
                            </h2>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                            {features.map((feature, index) => {
                                const Icon = feature.icon
                                return (
                                    <div key={index} className="bg-white border-2 border-gray-200 p-6">
                                        <Icon className="w-10 h-10 text-emerald-600 mb-4" />
                                        <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                                        <p className="text-sm text-gray-600">{feature.description}</p>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 bg-gray-900">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-4xl mx-auto text-center">
                            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                                Start Trading Global Markets Today
                            </h2>
                            <p className="text-lg text-gray-300 mb-8">
                                Open your free account and get instant access to 10,000+ assets across 150+ markets
                            </p>
                            <Link href="/auth/login">
                                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-12">
                                    Open Free Account
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <p className="mt-6 text-gray-400 text-sm">
                                No minimum deposit • Commission-free trading • Real-time data
                            </p>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    )
}
