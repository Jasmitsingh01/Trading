'use client'

import { useState, useEffect } from 'react'
import Header from "@/components/ui/header"
import { Footer } from "@/components/landing/footer"
import { BarChart3, TrendingUp, Zap, Layout, PieChart, Activity, Terminal, Smartphone, Monitor, Download, CheckCircle, Settings, Bell, Lock, Globe, LineChart, ArrowRight, Play } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const features = [
    {
        icon: BarChart3,
        title: 'Advanced Charting',
        description: '100+ technical indicators, drawing tools, and customizable chart layouts for deep market analysis.',
        details: ['TradingView integration', 'Multi-timeframe analysis', '50+ chart types', 'Custom indicators']
    },
    {
        icon: TrendingUp,
        title: 'Real-Time Data',
        description: 'Live market data with sub-10ms latency for instant decision making and execution.',
        details: ['Level 2 market depth', 'Real-time quotes', 'News integration', 'Economic calendar']
    },
    {
        icon: Zap,
        title: 'One-Click Trading',
        description: 'Execute trades instantly with streamlined order entry and advanced order types.',
        details: ['Market orders', 'Limit & stop orders', 'OCO orders', 'Trailing stops']
    },
    {
        icon: Layout,
        title: 'Customizable Workspace',
        description: 'Create and save multiple workspace layouts for different trading strategies and markets.',
        details: ['Multiple layouts', 'Drag & drop widgets', 'Cloud sync', 'Dark/light themes']
    },
    {
        icon: PieChart,
        title: 'Portfolio Analytics',
        description: 'Track performance, analyze risk, and optimize your portfolio allocation with advanced metrics.',
        details: ['P&L tracking', 'Risk metrics', 'Performance reports', 'Tax reporting']
    },
    {
        icon: Activity,
        title: 'Market Scanner',
        description: 'Find trading opportunities with powerful screening tools and custom filters.',
        details: ['Custom filters', 'Volatility scanner', 'Volume alerts', 'Price alerts']
    },
    {
        icon: Terminal,
        title: 'API Access',
        description: 'Automate your trading with comprehensive REST and WebSocket APIs for algo trading.',
        details: ['REST API', 'WebSocket feeds', 'Historical data', 'Order management']
    },
    {
        icon: Bell,
        title: 'Smart Alerts',
        description: 'Get notified of market movements, order fills, and custom conditions via multiple channels.',
        details: ['Price alerts', 'Technical alerts', 'SMS notifications', 'Email alerts']
    }
]

const platforms = [
    {
        name: 'Web Platform',
        icon: Monitor,
        description: 'Access your account from any browser without downloads',
        features: ['No installation required', 'Cross-platform compatibility', 'Cloud-based settings', 'Automatic updates'],
        image: '/api/placeholder/600/400',
        badge: 'Most Popular'
    },

    {
        name: 'Mobile Apps',
        icon: Smartphone,
        description: 'Full-featured trading on iOS and Android',
        features: ['Touch-optimized interface', 'Push notifications', 'Biometric login', 'Trade on the go'],
        image: '/api/placeholder/600/400',
        badge: 'Most Popular'
    }
]

const tools = [
    {
        category: 'Charting Tools',
        items: ['TradingView charts', 'Custom indicators', 'Drawing tools', 'Pattern recognition', 'Multiple timeframes', 'Chart templates']
    },
    {
        category: 'Order Types',
        items: ['Market orders', 'Limit orders', 'Stop loss/Take profit', 'Trailing stops', 'OCO orders', 'Bracket orders']
    },
    {
        category: 'Analysis Tools',
        items: ['Technical indicators', 'Fundamental data', 'Economic calendar', 'News feed', 'Sentiment analysis', 'Market depth']
    },
    {
        category: 'Risk Management',
        items: ['Position sizing', 'Portfolio allocation', 'Risk metrics', 'Margin calculator', 'Profit/loss tracker', 'Account analytics']
    }
]

const stats = [
    { value: '<10ms', label: 'Order Execution' },
    { value: '100+', label: 'Technical Indicators' },
    { value: '99.9%', label: 'Platform Uptime' },
    { value: '24/7', label: 'Market Access' }
]

const comparisonFeatures = [
    { feature: 'Real-Time Data', basic: true, pro: true, enterprise: true },
    { feature: 'Advanced Charting', basic: 'Limited', pro: true, enterprise: true },
    { feature: 'API Access', basic: false, pro: true, enterprise: true },
    { feature: 'Priority Support', basic: false, pro: true, enterprise: true },
    { feature: 'Custom Indicators', basic: false, pro: true, enterprise: true },
    { feature: 'Multi-Monitor Setup', basic: false, pro: true, enterprise: true },
    { feature: 'Dedicated Account Manager', basic: false, pro: false, enterprise: true }
]

const testimonials = [
    {
        quote: 'The platform is incredibly fast and reliable. I\'ve been using it for day trading and haven\'t experienced any issues.',
        author: 'Michael T.',
        role: 'Day Trader',
        avatar: 'MT'
    },
    {
        quote: 'Best charting tools I\'ve used. The customization options are endless and the mobile app works flawlessly.',
        author: 'Sarah L.',
        role: 'Swing Trader',
        avatar: 'SL'
    },
    {
        quote: 'API documentation is excellent. Built my own algo trading system in just a few days.',
        author: 'David K.',
        role: 'Algo Trader',
        avatar: 'DK'
    }
]

export default function TradingPlatformPage() {
    const [mounted, setMounted] = useState(false)
    const [selectedPlatform, setSelectedPlatform] = useState(0)

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
                                <BarChart3 className="w-4 h-4 text-emerald-600" />
                                <span className="text-sm font-medium text-emerald-700">Professional Trading Platform</span>
                            </div>
                            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                                Trade Like a Pro
                                <span className="block text-emerald-600 mt-2">
                                    Advanced Tools for Every Trader
                                </span>
                            </h1>
                            <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto mb-8">
                                Experience institutional-grade trading technology with real-time data, advanced charting, and lightning-fast execution—all in one powerful platform.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link href="/auth/login">
                                    <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-10">
                                        Try Platform Free
                                        <ArrowRight className="ml-2 h-5 w-5" />
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

                {/* Features Grid */}
                <section className="py-20 bg-gray-50">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <span className="text-sm font-semibold text-emerald-600 uppercase tracking-wider">Platform Features</span>
                            <h2 className="text-4xl font-bold text-gray-900 mt-3 mb-4">
                                Everything You Need to Trade Successfully
                            </h2>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Professional-grade tools trusted by traders worldwide</p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                            {features.map((feature, index) => {
                                const Icon = feature.icon
                                return (
                                    <div
                                        key={index}
                                        className="bg-white p-6 border-2 border-gray-200 hover:border-emerald-400 transition-all group"
                                    >
                                        <div className="w-12 h-12 bg-emerald-100 group-hover:bg-emerald-600 flex items-center justify-center mb-4 transition-colors">
                                            <Icon className="w-6 h-6 text-emerald-600 group-hover:text-white transition-colors" />
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                                            {feature.title}
                                        </h3>
                                        <p className="text-gray-600 text-sm mb-4">
                                            {feature.description}
                                        </p>
                                        <ul className="space-y-1">
                                            {feature.details.map((detail, i) => (
                                                <li key={i} className="flex items-start gap-2 text-gray-600 text-xs">
                                                    <CheckCircle className="w-3 h-3 text-emerald-600 flex-shrink-0 mt-0.5" />
                                                    <span>{detail}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </section>

                {/* Platforms Section */}
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <span className="text-sm font-semibold text-emerald-600 uppercase tracking-wider">Available Platforms</span>
                            <h2 className="text-4xl font-bold text-gray-900 mt-3 mb-4">
                                Trade Anywhere, Anytime
                            </h2>
                            <p className="text-lg text-gray-600">Choose the platform that fits your trading style</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-12">
                            {platforms.map((platform, index) => {
                                const Icon = platform.icon
                                return (
                                    <div
                                        key={index}
                                        className={`border-2 p-8 cursor-pointer transition-all ${selectedPlatform === index ? 'border-emerald-400 bg-emerald-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                                        onClick={() => setSelectedPlatform(index)}
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <Icon className="w-10 h-10 text-emerald-600" />
                                            <span className="text-xs font-bold bg-emerald-100 text-emerald-700 px-2 py-1">
                                                {platform.badge}
                                            </span>
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                            {platform.name}
                                        </h3>
                                        <p className="text-gray-600 mb-4 text-sm">
                                            {platform.description}
                                        </p>
                                        <ul className="space-y-2">
                                            {platform.features.map((feature, i) => (
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

                        {/* Platform Preview */}
                        <div className="max-w-5xl mx-auto">
                            <div className="bg-gradient-to-br from-emerald-100 to-teal-50 p-4 border-2 border-emerald-200">
                                <img
                                    src={platforms[selectedPlatform].image}
                                    alt={platforms[selectedPlatform].name}
                                    className="w-full h-auto"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Tools Section */}
                <section className="py-20 bg-gray-50">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <span className="text-sm font-semibold text-emerald-600 uppercase tracking-wider">Trading Tools</span>
                            <h2 className="text-4xl font-bold text-gray-900 mt-3 mb-4">
                                Complete Trading Toolkit
                            </h2>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
                            {tools.map((tool, index) => (
                                <div key={index} className="bg-white border-2 border-gray-200 p-6">
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">{tool.category}</h3>
                                    <ul className="space-y-2">
                                        {tool.items.map((item, i) => (
                                            <li key={i} className="flex items-start gap-2 text-gray-700 text-sm">
                                                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Feature Comparison */}
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <span className="text-sm font-semibold text-emerald-600 uppercase tracking-wider">Platform Tiers</span>
                            <h2 className="text-4xl font-bold text-gray-900 mt-3 mb-4">
                                Choose Your Access Level
                            </h2>
                        </div>

                        <div className="max-w-4xl mx-auto bg-white border-2 border-gray-200 overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr className="border-b-2 border-gray-200">
                                        <th className="text-left p-6 text-gray-900 font-bold">Feature</th>
                                        <th className="text-center p-6 text-gray-900 font-bold">Basic</th>
                                        <th className="text-center p-6 text-emerald-600 font-bold">Pro</th>
                                        <th className="text-center p-6 text-gray-900 font-bold">Enterprise</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {comparisonFeatures.map((item, index) => (
                                        <tr key={index} className="border-b border-gray-200 last:border-0 hover:bg-gray-50">
                                            <td className="p-6 text-gray-700 font-medium">{item.feature}</td>
                                            <td className="p-6 text-center">
                                                {typeof item.basic === 'boolean' ? (
                                                    item.basic ? (
                                                        <CheckCircle className="w-5 h-5 text-emerald-600 mx-auto" />
                                                    ) : (
                                                        <span className="text-gray-400">-</span>
                                                    )
                                                ) : (
                                                    <span className="text-gray-500 text-sm">{item.basic}</span>
                                                )}
                                            </td>
                                            <td className="p-6 text-center bg-emerald-50">
                                                {typeof item.pro === 'boolean' ? (
                                                    item.pro ? (
                                                        <CheckCircle className="w-5 h-5 text-emerald-600 mx-auto" />
                                                    ) : (
                                                        <span className="text-gray-400">-</span>
                                                    )
                                                ) : (
                                                    <span className="text-gray-500 text-sm">{item.pro}</span>
                                                )}
                                            </td>
                                            <td className="p-6 text-center">
                                                {typeof item.enterprise === 'boolean' ? (
                                                    item.enterprise ? (
                                                        <CheckCircle className="w-5 h-5 text-emerald-600 mx-auto" />
                                                    ) : (
                                                        <span className="text-gray-400">-</span>
                                                    )
                                                ) : (
                                                    <span className="text-gray-500 text-sm">{item.enterprise}</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* Testimonials */}
                <section className="py-20 bg-gray-50">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <span className="text-sm font-semibold text-emerald-600 uppercase tracking-wider">What Traders Say</span>
                            <h2 className="text-4xl font-bold text-gray-900 mt-3 mb-4">
                                Trusted by Professionals
                            </h2>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                            {testimonials.map((testimonial, index) => (
                                <div key={index} className="bg-white border-2 border-gray-200 p-8">
                                    <p className="text-gray-700 mb-6 italic">"{testimonial.quote}"</p>
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-emerald-600 flex items-center justify-center text-white font-bold">
                                            {testimonial.avatar}
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-900">{testimonial.author}</div>
                                            <div className="text-sm text-gray-600">{testimonial.role}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 bg-gray-900">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-4xl mx-auto text-center">
                            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                                Ready to Experience the Platform?
                            </h2>
                            <p className="text-lg text-gray-300 mb-8">
                                Open your free account and get instant access to our professional trading platform
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link href="/auth/login">
                                    <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-10">
                                        Start Trading Now
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </Link>
                                <Link href="/contact">
                                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 font-medium px-10">
                                        Request Demo
                                    </Button>
                                </Link>
                            </div>
                            <p className="mt-6 text-gray-400 text-sm">
                                No credit card required • Full access • Cancel anytime
                            </p>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    )
}
