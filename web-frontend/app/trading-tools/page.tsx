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
    Layers,
    Zap,
    Shield,
    CheckCircle,
    ArrowRight,
    Clock,
    Users,
    Trophy,
    Brain
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const tools = [
    {
        icon: BarChart3,
        title: 'Advanced Charting',
        description: 'Professional charting tools with 100+ technical indicators, drawing tools, and multiple timeframes for deep market analysis.',
        features: ['TradingView integration', '100+ indicators', 'Multi-timeframe analysis', 'Custom templates'],
        category: 'Analysis',
        popular: true
    },
    {
        icon: Calculator,
        title: 'Trading Calculator',
        description: 'Calculate position sizes, profit/loss, pip values, margin requirements, and risk-to-reward ratios instantly.',
        features: ['Position sizing', 'P&L calculator', 'Pip calculator', 'Margin calculator'],
        category: 'Analysis',
        popular: true
    },
    {
        icon: Bell,
        title: 'Smart Alerts',
        description: 'Set custom price alerts and technical indicator alerts with multi-channel notifications.',
        features: ['Price alerts', 'Technical alerts', 'SMS & email', 'Push notifications'],
        category: 'Automation',
        popular: true
    },
    {
        icon: Target,
        title: 'Market Scanner',
        description: 'Scan thousands of assets in real-time to find trading opportunities based on custom criteria.',
        features: ['Custom filters', 'Pre-built strategies', 'Real-time scanning', 'Alert integration'],
        category: 'Analysis',
        popular: false
    },
    {
        icon: LineChart,
        title: 'Economic Calendar',
        description: 'Track major economic events, news releases, and earnings reports that impact market movements.',
        features: ['Global events', 'Impact indicators', 'Historical data', 'Custom filters'],
        category: 'Research',
        popular: false
    },
    {
        icon: PieChart,
        title: 'Portfolio Analyzer',
        description: 'Comprehensive portfolio analysis with performance metrics, risk assessment, and asset allocation.',
        features: ['Performance tracking', 'Risk metrics', 'Diversification', 'Tax reports'],
        category: 'Analysis',
        popular: true
    },
    {
        icon: Brain,
        title: 'AI Trading Signals',
        description: 'Machine learning-powered trading signals based on technical analysis, sentiment, and market patterns.',
        features: ['AI predictions', 'Sentiment analysis', 'Pattern recognition', 'Signal accuracy metrics'],
        category: 'Automation',
        popular: true
    },
    {
        icon: Sliders,
        title: 'Risk Management Suite',
        description: 'Advanced risk management tools including automated stop-loss, take-profit, and trailing stops.',
        features: ['Auto stop-loss', 'Take profit orders', 'Trailing stops', 'Position limits'],
        category: 'Risk',
        popular: true
    },
    {
        icon: Crosshair,
        title: 'Market Depth (Level 2)',
        description: 'View order book depth with real-time buy/sell pressure and volume analysis.',
        features: ['Level 2 quotes', 'Order flow', 'Bid/ask spread', 'Volume profiling'],
        category: 'Analysis',
        popular: false
    },
    {
        icon: Layers,
        title: 'Multi-Asset Dashboard',
        description: 'Monitor and trade multiple assets simultaneously from a unified interface with synchronized charts.',
        features: ['Multi-window layout', 'Synced charts', 'Quick switching', 'Custom watchlists'],
        category: 'Analysis',
        popular: false
    },
    {
        icon: TrendingUp,
        title: 'Strategy Backtester',
        description: 'Test trading strategies on years of historical data with detailed performance analytics.',
        features: ['Historical testing', 'Strategy builder', 'Performance reports', 'Parameter optimization'],
        category: 'Automation',
        popular: false
    },
    {
        icon: Zap,
        title: 'Automated Trading Bot',
        description: 'Create and deploy automated trading strategies with our no-code bot builder.',
        features: ['Visual strategy builder', 'No coding required', '24/7 execution', 'Performance tracking'],
        category: 'Automation',
        popular: true
    }
]

const categories = [
    { name: 'Analysis Tools', count: 15, icon: BarChart3 },
    { name: 'Risk Management', count: 8, icon: Shield },
    { name: 'Automation', count: 5, icon: Zap },
    { name: 'Research', count: 12, icon: LineChart }
]

const benefits = [
    {
        icon: CheckCircle,
        title: 'All Tools Included',
        description: 'Every professional tool available with your account at no extra cost'
    },
    {
        icon: Clock,
        title: 'Real-Time Data',
        description: 'All tools powered by real-time market data with sub-10ms latency'
    },
    {
        icon: Users,
        title: 'Expert Support',
        description: '24/7 support team to help you master every tool and feature'
    },
    {
        icon: Trophy,
        title: 'Pro-Grade Quality',
        description: 'Institutional-quality tools used by professional traders worldwide'
    }
]

const useCases = [
    {
        title: 'Day Trading',
        description: 'Fast execution tools, real-time scanners, and Level 2 data for intraday opportunities',
        tools: ['Advanced Charts', 'Market Scanner', 'Smart Alerts', 'Level 2 Data']
    },
    {
        title: 'Swing Trading',
        description: 'Technical analysis tools, economic calendar, and portfolio tracking for multi-day trades',
        tools: ['Technical Indicators', 'Economic Calendar', 'Portfolio Analyzer', 'Price Alerts']
    },
    {
        title: 'Algorithmic Trading',
        description: 'Backtesting, automation, and API access for systematic strategy execution',
        tools: ['Backtesting Engine', 'Trading Bots', 'API Access', 'Performance Analytics']
    },
    {
        title: 'Long-Term Investing',
        description: 'Fundamental analysis, portfolio allocation, and dividend tracking for buy-and-hold',
        tools: ['Portfolio Analyzer', 'Research Tools', 'Tax Reports', 'Dividend Calendar']
    }
]

const stats = [
    { value: '40+', label: 'Trading Tools' },
    { value: '100+', label: 'Indicators' },
    { value: '24/7', label: 'Monitoring' },
    { value: '150K+', label: 'Active Users' }
]

export default function TradingToolsPage() {
    const [mounted, setMounted] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState<string>('All')

    useEffect(() => {
        setMounted(true)
    }, [])

    const filteredTools = selectedCategory === 'All'
        ? tools
        : tools.filter(tool => tool.category === selectedCategory)

    return (
        <>
            <Header />
            <main className="min-h-screen bg-white">
                {/* Hero Section */}
                <section className="relative pt-32 pb-20 bg-gradient-to-b from-gray-50 to-white">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className={`text-center max-w-4xl mx-auto transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-md bg-emerald-50 border border-emerald-200 mb-6">
                                <Settings className="w-4 h-4 text-emerald-600" />
                                <span className="text-sm font-medium text-emerald-700">40+ Professional Tools</span>
                            </div>
                            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                                Professional Trading Tools
                                <span className="block text-emerald-600 mt-2">
                                    For Every Strategy
                                </span>
                            </h1>
                            <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto mb-8">
                                Access institutional-grade trading tools designed to enhance your analysis, automate strategies, and manage risk like a professional trader.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link href="/auth/login">
                                    <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-10">
                                        Get Free Access
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </Link>
                                <Link href="/trading-platform">
                                    <Button size="lg" variant="outline" className="border-gray-300 text-gray-700 hover:text-gray-900 hover:bg-gray-50 font-medium px-10">
                                        View Platform
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
                            {stats.map((stat, index) => (
                                <div key={index}>
                                    <div className="text-4xl font-bold mb-1">{stat.value}</div>
                                    <div className="text-sm opacity-90">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Categories */}
                <section className="py-16 bg-white border-b border-gray-200">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
                            {categories.map((category, index) => {
                                const Icon = category.icon
                                return (
                                    <div
                                        key={index}
                                        className="text-center p-6 bg-gray-50 border-2 border-gray-200 hover:border-emerald-400 transition-all cursor-pointer"
                                        onClick={() => setSelectedCategory(category.name.split(' ')[0])}
                                    >
                                        <Icon className="w-8 h-8 text-emerald-600 mx-auto mb-3" />
                                        <div className="text-3xl font-bold text-emerald-600 mb-1">
                                            {category.count}
                                        </div>
                                        <div className="text-sm text-gray-700 font-medium">{category.name}</div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </section>

                {/* Filter Tabs */}
                <section className="py-8 bg-gray-50 sticky top-0 z-40 border-b border-gray-200">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-center gap-3 flex-wrap">
                            {['All', 'Analysis', 'Automation', 'Risk', 'Research'].map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`px-6 py-2 font-semibold transition-all text-sm ${selectedCategory === category
                                        ? 'bg-emerald-600 text-white'
                                        : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-emerald-300'
                                        }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Tools Grid */}
                <section className="py-20 bg-gray-50">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                            {filteredTools.map((tool, index) => {
                                const Icon = tool.icon
                                return (
                                    <div
                                        key={index}
                                        className="bg-white border-2 border-gray-200 hover:border-emerald-400 transition-all p-8 group relative"
                                    >
                                        {tool.popular && (
                                            <div className="absolute top-4 right-4">
                                                <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-1">
                                                    POPULAR
                                                </span>
                                            </div>
                                        )}

                                        <div className="w-14 h-14 bg-emerald-100 group-hover:bg-emerald-600 flex items-center justify-center mb-6 transition-colors">
                                            <Icon className="w-7 h-7 text-emerald-600 group-hover:text-white transition-colors" />
                                        </div>

                                        <h3 className="text-xl font-bold text-gray-900 mb-3">
                                            {tool.title}
                                        </h3>
                                        <p className="text-gray-600 mb-6 leading-relaxed text-sm">
                                            {tool.description}
                                        </p>

                                        <ul className="space-y-2">
                                            {tool.features.map((feature, i) => (
                                                <li key={i} className="flex items-start gap-2 text-gray-700 text-sm">
                                                    <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                                                    <span>{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </section>

                {/* Benefits Section */}
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <span className="text-sm font-semibold text-emerald-600 uppercase tracking-wider">Why Choose Our Tools</span>
                            <h2 className="text-4xl font-bold text-gray-900 mt-3 mb-4">
                                Built for Professional Traders
                            </h2>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
                            {benefits.map((benefit, index) => {
                                const Icon = benefit.icon
                                return (
                                    <div key={index} className="text-center">
                                        <div className="w-16 h-16 bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                                            <Icon className="w-8 h-8 text-emerald-600" />
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-2">{benefit.title}</h3>
                                        <p className="text-sm text-gray-600">{benefit.description}</p>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </section>

                {/* Use Cases */}
                <section className="py-20 bg-gray-50">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <span className="text-sm font-semibold text-emerald-600 uppercase tracking-wider">Trading Styles</span>
                            <h2 className="text-4xl font-bold text-gray-900 mt-3 mb-4">
                                Tools for Every Strategy
                            </h2>
                            <p className="text-lg text-gray-600">Optimized toolsets for different trading approaches</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                            {useCases.map((useCase, index) => (
                                <div key={index} className="bg-white border-2 border-gray-200 p-8">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{useCase.title}</h3>
                                    <p className="text-gray-600 mb-6">{useCase.description}</p>
                                    <div className="space-y-2">
                                        <div className="text-sm font-semibold text-gray-900 mb-3">Recommended Tools:</div>
                                        {useCase.tools.map((tool, i) => (
                                            <div key={i} className="flex items-center gap-2 text-gray-700 text-sm">
                                                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                                                <span>{tool}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Feature Highlight */}
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-6xl mx-auto">
                            <div className="grid lg:grid-cols-2 gap-12 items-center">
                                <div>
                                    <span className="text-sm font-semibold text-emerald-600 uppercase tracking-wider">Platform Integration</span>
                                    <h2 className="text-4xl font-bold text-gray-900 mt-3 mb-6">
                                        Seamlessly Integrated Tools
                                    </h2>
                                    <p className="text-gray-600 mb-6 leading-relaxed">
                                        All tools are fully integrated into our trading platform, allowing you to switch between analysis, execution, and monitoring without missing a beat.
                                    </p>
                                    <ul className="space-y-3">
                                        <li className="flex items-start gap-3">
                                            <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                                            <span className="text-gray-700">One-click access from any screen</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                                            <span className="text-gray-700">Synchronized across all devices</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                                            <span className="text-gray-700">Real-time data updates</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                                            <span className="text-gray-700">Customizable layouts and workspaces</span>
                                        </li>
                                    </ul>
                                </div>
                                <div className="bg-gradient-to-br from-emerald-100 to-teal-50 p-4 border-2 border-emerald-200">
                                    <img
                                        src="/api/placeholder/600/400"
                                        alt="Platform Integration"
                                        className="w-full h-auto"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 bg-gray-900">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-4xl mx-auto text-center">
                            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                                Access All Tools for Free
                            </h2>
                            <p className="text-lg text-gray-300 mb-8">
                                Every professional trading tool is included with your free BXTPRO account
                            </p>
                            <Link href="/auth/login">
                                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-12">
                                    Start Trading Now
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <p className="mt-6 text-gray-400 text-sm">
                                No credit card required • Full access to all tools • Cancel anytime
                            </p>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    )
}
