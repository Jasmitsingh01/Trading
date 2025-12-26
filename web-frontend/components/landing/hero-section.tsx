'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, ChevronLeft, ChevronRight, TrendingUp, Bell, Shield, BarChart3, Smartphone, Apple, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'

const carouselSlides = [
    {
        title: "Professional Trading Platform for Global Markets",
        subtitle: "Trade Smarter, Not Harder",
        description: "Access real-time market data, advanced analytics, and institutional-grade trading tools designed for serious traders.",
        stats: [
            { value: "$2.5B+", label: "Trading Volume" },
            { value: "50K+", label: "Active Traders" },
            { value: "150+", label: "Global Markets" }
        ],
        mockup: {
            type: 'trading',
            messages: [
                { type: 'received', text: 'Your AAPL stock alert: Price reached $178.45 (+2.34%)', time: '2:30 PM' },
                { type: 'sent', text: 'Execute buy order for 10 shares', time: '2:31 PM' },
                { type: 'received', text: 'Order executed successfully! ✅\n10 shares @ $178.45\nTotal: $1,784.50', time: '2:31 PM' },
                { type: 'typing', text: 'Analyzing market trends...', time: '' }
            ]
        }
    },
    {
        title: "Smart Alerts & Notifications",
        subtitle: "Never Miss a Trading Opportunity",
        description: "Get instant notifications for price movements, technical signals, and market news that matter to your portfolio.",
        showAppDownload: true,
        stats: [
            { value: "4.8★", label: "App Rating" },
            { value: "100K+", label: "Downloads" },
            { value: "iOS & Android", label: "Platforms" }
        ],
        mockup: {
            type: 'alerts',
            messages: [
                { type: 'received', text: '🔔 Price Alert: Bitcoin reached $43,256 (+3.42%)', time: '1:15 PM' },
                { type: 'received', text: '📊 Technical Signal: TSLA crossed above 50-day MA', time: '1:18 PM' },
                { type: 'sent', text: 'Show me the chart', time: '1:19 PM' },
                { type: 'received', text: 'Opening chart analysis... 📈', time: '1:19 PM' }
            ]
        }
    },
    {
        title: "Enterprise Security & Compliance",
        subtitle: "Your Security is Our Priority",
        description: "Bank-level encryption, multi-factor authentication, and full regulatory compliance to keep your investments safe.",
        stats: [
            { value: "256-bit", label: "SSL Encryption" },
            { value: "SEC", label: "Registered" },
            { value: "FDIC", label: "Insured" }
        ],
        mockup: {
            type: 'security',
            messages: [
                { type: 'received', text: '🔐 Security Alert: New login detected from Delhi, India', time: '3:45 PM' },
                { type: 'sent', text: 'Yes, that\'s me', time: '3:45 PM' },
                { type: 'received', text: 'Login approved ✓\n2FA: Enabled\nDevice: Trusted', time: '3:46 PM' },
                { type: 'received', text: 'Your account is 100% secure 🛡️', time: '3:46 PM' }
            ]
        }
    },
    {
        title: "AI-Powered Trading Insights",
        subtitle: "Data-Driven Trading Decisions",
        description: "Leverage AI predictions, sentiment analysis, and real-time market intelligence to stay ahead of the curve.",
        stats: [
            { value: "100+", label: "Indicators" },
            { value: "AI-Powered", label: "Predictions" },
            { value: "Real-Time", label: "Market Data" }
        ],
        mockup: {
            type: 'ai',
            messages: [
                { type: 'sent', text: 'What\'s the market sentiment for NVDA?', time: '4:12 PM' },
                { type: 'received', text: '🤖 AI Analysis:\n\nNVDA Sentiment: Bullish 📈\nConfidence: 87%\nKey Drivers: Earnings beat, AI demand', time: '4:12 PM' },
                { type: 'sent', text: 'Should I buy now?', time: '4:13 PM' },
                { type: 'typing', text: 'Analyzing entry points...', time: '' }
            ]
        }
    }
]

export function HeroSection() {
    const [currentSlide, setCurrentSlide] = useState(0)
    const [isPaused, setIsPaused] = useState(false)
    const [isTransitioning, setIsTransitioning] = useState(false)

    useEffect(() => {
        if (isPaused) return

        const timer = setInterval(() => {
            setIsTransitioning(true)
            setTimeout(() => {
                setCurrentSlide((prev) => (prev + 1) % carouselSlides.length)
                setIsTransitioning(false)
            }, 300)
        }, 7000)

        return () => clearInterval(timer)
    }, [isPaused])

    const nextSlide = () => {
        setIsTransitioning(true)
        setTimeout(() => {
            setCurrentSlide((prev) => (prev + 1) % carouselSlides.length)
            setIsTransitioning(false)
        }, 300)
    }

    const prevSlide = () => {
        setIsTransitioning(true)
        setTimeout(() => {
            setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length)
            setIsTransitioning(false)
        }, 300)
    }

    const slide = carouselSlides[currentSlide]

    return (
        <section className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden bg-gradient-to-b from-emerald-50/30 to-white">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-200/20 rounded-full blur-3xl" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div
                    className="grid lg:grid-cols-2 gap-12 items-center"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    {/* Content */}
                    <div className={`space-y-8 transition-all duration-500 ${isTransitioning ? 'opacity-0 translate-x-[-20px]' : 'opacity-100 translate-x-0'}`}>
                        <div className="inline-block">
                            <span className="px-4 py-2 bg-emerald-100 rounded-full text-emerald-700 text-sm font-semibold border border-emerald-200">
                                {slide.subtitle}
                            </span>
                        </div>

                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                            {slide.title}
                        </h1>

                        <p className="text-xl text-gray-600 max-w-xl leading-relaxed">
                            {slide.description}
                        </p>

                        {/* App Download Buttons */}
                        {slide.showAppDownload ? (
                            <div className="space-y-6">
                                <p className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Download Our App</p>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Link href="#" className="inline-block group">
                                        <div className="flex items-center gap-3 px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-xl transition-all shadow-md hover:shadow-lg group-hover:scale-105">
                                            <Apple className="h-8 w-8" />
                                            <div className="text-left">
                                                <div className="text-xs font-medium">Download on the</div>
                                                <div className="text-lg font-bold">App Store</div>
                                            </div>
                                        </div>
                                    </Link>
                                    <Link href="#" className="inline-block group">
                                        <div className="flex items-center gap-3 px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-xl transition-all shadow-md hover:shadow-lg group-hover:scale-105">
                                            <Play className="h-8 w-8" />
                                            <div className="text-left">
                                                <div className="text-xs font-medium">Get it on</div>
                                                <div className="text-lg font-bold">Google Play</div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link href="/registration">
                                    <Button size="lg" className="h-14 px-8 bg-emerald-600 hover:bg-emerald-700 text-white text-base font-semibold group shadow-md hover:shadow-lg transition-all">
                                        Open Free Account
                                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                                <Link href="#features">
                                    <Button size="lg" variant="outline" className="h-14 px-8 bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 text-base font-semibold">
                                        Explore Platform
                                    </Button>
                                </Link>
                            </div>
                        )}

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-200">
                            {slide.stats.map((stat, index) => (
                                <div key={index} className="transform hover:scale-105 transition-transform">
                                    <div className="text-3xl md:text-4xl font-bold text-emerald-600">{stat.value}</div>
                                    <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Mobile Mockup */}
                    <div className={`relative transition-all duration-500 ${isTransitioning ? 'opacity-0 translate-x-[20px]' : 'opacity-100 translate-x-0'}`}>
                        {/* Phone Frame */}
                        <div className="relative mx-auto max-w-[400px]">
                            {/* Phone Container with gradient background */}
                            <div className="relative  bg-black rounded-[3rem] p-3 shadow-2xl">
                                {/* Phone Screen */}
                                <div className="bg-gray-900 rounded-[2.5rem] overflow-hidden shadow-inner">
                                    {/* Status Bar */}
                                    <div className="bg-gray-900 px-6 py-3 flex items-center justify-between text-white text-xs">
                                        <span className="font-semibold">9:41</span>
                                        <div className="flex items-center gap-1">
                                            <div className="w-4 h-3 border border-white rounded-sm relative">
                                                <div className="absolute inset-0.5 bg-white rounded-sm" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* App Header */}
                                    <div className="bg-emerald-600 px-6 py-4 text-white">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-bold text-lg">BXTPRO</h3>
                                            <div className="flex gap-3">
                                                <Bell className="w-5 h-5" />
                                                <BarChart3 className="w-5 h-5" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Chat Messages */}
                                    {/* Trading App Screen */}
                                    <div className="bg-gray-50 min-h-[500px] relative overflow-hidden">
                                        {/* Slide 1: Trading Dashboard */}
                                        {currentSlide === 0 && (
                                            <div className="p-4 space-y-4 animate-in fade-in duration-500">
                                                {/* Portfolio Summary */}
                                                <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl p-4 text-white shadow-lg">
                                                    <div className="text-xs opacity-80 mb-1">Portfolio Value</div>
                                                    <div className="text-3xl font-bold mb-2">$47,382.50</div>
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <TrendingUp className="w-4 h-4" />
                                                        <span className="font-semibold">+$2,340.25 (5.2%)</span>
                                                        <span className="opacity-80">Today</span>
                                                    </div>
                                                </div>

                                                {/* Quick Stats */}
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div className="bg-white rounded-xl p-3 shadow-sm">
                                                        <div className="text-xs text-gray-500 mb-1">Day's Gain</div>
                                                        <div className="text-lg font-bold text-emerald-600">+$1,234</div>
                                                    </div>
                                                    <div className="bg-white rounded-xl p-3 shadow-sm">
                                                        <div className="text-xs text-gray-500 mb-1">Total Gain</div>
                                                        <div className="text-lg font-bold text-emerald-600">+$8,450</div>
                                                    </div>
                                                </div>

                                                {/* Holdings */}
                                                <div className="bg-white rounded-xl p-4 shadow-sm">
                                                    <h3 className="text-sm font-bold text-gray-900 mb-3">Top Holdings</h3>
                                                    <div className="space-y-3">
                                                        {[
                                                            { symbol: 'AAPL', name: 'Apple Inc.', shares: '25', value: '$4,461', change: '+2.34%', positive: true },
                                                            { symbol: 'TSLA', name: 'Tesla Inc.', shares: '15', value: '$3,642', change: '+5.67%', positive: true },
                                                            { symbol: 'NVDA', name: 'NVIDIA', shares: '12', value: '$5,942', change: '+3.21%', positive: true }
                                                        ].map((stock, i) => (
                                                            <div key={i} className="flex items-center justify-between">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                                                                        <span className="text-xs font-bold text-emerald-700">{stock.symbol.slice(0, 2)}</span>
                                                                    </div>
                                                                    <div>
                                                                        <div className="text-sm font-semibold text-gray-900">{stock.symbol}</div>
                                                                        <div className="text-xs text-gray-500">{stock.shares} shares</div>
                                                                    </div>
                                                                </div>
                                                                <div className="text-right">
                                                                    <div className="text-sm font-semibold text-gray-900">{stock.value}</div>
                                                                    <div className={`text-xs font-semibold ${stock.positive ? 'text-emerald-600' : 'text-red-600'}`}>
                                                                        {stock.change}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Slide 2: Price Alerts & Notifications */}
                                        {currentSlide === 1 && (
                                            <div className="p-4 space-y-3 animate-in fade-in duration-500">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h3 className="text-sm font-bold text-gray-900">Alerts & Notifications</h3>
                                                    <span className="text-xs text-emerald-600 font-semibold">3 New</span>
                                                </div>

                                                {/* Alert Cards */}
                                                {[
                                                    {
                                                        icon: '📈',
                                                        title: 'Price Target Hit',
                                                        subtitle: 'Bitcoin reached $43,256',
                                                        time: '2 min ago',
                                                        change: '+3.42%',
                                                        positive: true
                                                    },
                                                    {
                                                        icon: '⚡',
                                                        title: 'Technical Signal',
                                                        subtitle: 'TSLA crossed 50-day MA',
                                                        time: '15 min ago',
                                                        change: '+5.67%',
                                                        positive: true
                                                    },
                                                    {
                                                        icon: '📊',
                                                        title: 'Earnings Alert',
                                                        subtitle: 'AAPL reports tomorrow',
                                                        time: '1 hour ago',
                                                        change: 'Before Market',
                                                        positive: true
                                                    },
                                                    {
                                                        icon: '🔔',
                                                        title: 'Market News',
                                                        subtitle: 'Fed announces rate decision',
                                                        time: '2 hours ago',
                                                        change: 'High Impact',
                                                        positive: false
                                                    }
                                                ].map((alert, i) => (
                                                    <div key={i} className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-emerald-500">
                                                        <div className="flex items-start justify-between mb-2">
                                                            <div className="flex items-start gap-3">
                                                                <span className="text-2xl">{alert.icon}</span>
                                                                <div>
                                                                    <div className="text-sm font-semibold text-gray-900">{alert.title}</div>
                                                                    <div className="text-xs text-gray-600 mt-0.5">{alert.subtitle}</div>
                                                                </div>
                                                            </div>
                                                            <span className={`text-xs font-semibold px-2 py-1 rounded ${alert.positive ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'
                                                                }`}>
                                                                {alert.change}
                                                            </span>
                                                        </div>
                                                        <div className="text-xs text-gray-400 mt-2">{alert.time}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Slide 3: Security Dashboard */}
                                        {currentSlide === 2 && (
                                            <div className="p-4 space-y-4 animate-in fade-in duration-500">
                                                {/* Security Status */}
                                                <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl p-4 text-white shadow-lg">
                                                    <div className="flex items-center gap-3 mb-3">
                                                        <Shield className="w-8 h-8" />
                                                        <div>
                                                            <div className="font-bold text-lg">Account Secure</div>
                                                            <div className="text-xs opacity-80">All security checks passed</div>
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-3 gap-2 mt-4">
                                                        {[
                                                            { label: '2FA', status: 'Active' },
                                                            { label: 'Biometric', status: 'Active' },
                                                            { label: 'Encryption', status: '256-bit' }
                                                        ].map((item, i) => (
                                                            <div key={i} className="bg-white/20 rounded-lg p-2 text-center">
                                                                <div className="text-xs opacity-80">{item.label}</div>
                                                                <div className="text-xs font-bold mt-1">{item.status}</div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Security Features */}
                                                <div className="bg-white rounded-xl p-4 shadow-sm">
                                                    <h3 className="text-sm font-bold text-gray-900 mb-3">Security Features</h3>
                                                    <div className="space-y-3">
                                                        {[
                                                            { icon: '🔐', title: 'Two-Factor Authentication', status: 'Enabled', color: 'emerald' },
                                                            { icon: '👤', title: 'Biometric Login', status: 'Face ID Active', color: 'emerald' },
                                                            { icon: '🛡️', title: 'Device Management', status: '2 Trusted Devices', color: 'emerald' },
                                                            { icon: '📱', title: 'Login Notifications', status: 'Push & Email', color: 'emerald' }
                                                        ].map((feature, i) => (
                                                            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                                <div className="flex items-center gap-3">
                                                                    <span className="text-xl">{feature.icon}</span>
                                                                    <div>
                                                                        <div className="text-sm font-semibold text-gray-900">{feature.title}</div>
                                                                        <div className="text-xs text-gray-600">{feature.status}</div>
                                                                    </div>
                                                                </div>
                                                                <div className={`w-2 h-2 rounded-full bg-${feature.color}-500`} />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Recent Activity */}
                                                <div className="bg-white rounded-xl p-4 shadow-sm">
                                                    <h3 className="text-sm font-bold text-gray-900 mb-3">Recent Security Activity</h3>
                                                    <div className="space-y-2 text-xs">
                                                        <div className="flex justify-between py-2 border-b border-gray-100">
                                                            <span className="text-gray-600">Login from Delhi, India</span>
                                                            <span className="text-emerald-600 font-semibold">✓ Verified</span>
                                                        </div>
                                                        <div className="flex justify-between py-2 border-b border-gray-100">
                                                            <span className="text-gray-600">Password changed</span>
                                                            <span className="text-gray-500">2 days ago</span>
                                                        </div>
                                                        <div className="flex justify-between py-2">
                                                            <span className="text-gray-600">New device added</span>
                                                            <span className="text-gray-500">5 days ago</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Slide 4: AI Trading Insights */}
                                        {currentSlide === 3 && (
                                            <div className="p-4 space-y-4 animate-in fade-in duration-500">
                                                {/* AI Header */}
                                                <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl p-4 text-white shadow-lg">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                                            <BarChart3 className="w-6 h-6" />
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-lg">AI Market Intelligence</div>
                                                            <div className="text-xs opacity-80">Powered by machine learning</div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* AI Predictions */}
                                                <div className="bg-white rounded-xl p-4 shadow-sm">
                                                    <h3 className="text-sm font-bold text-gray-900 mb-3">Today's Predictions</h3>
                                                    <div className="space-y-3">
                                                        {[
                                                            { symbol: 'NVDA', prediction: 'Bullish', confidence: 87, target: '$520', current: '$495' },
                                                            { symbol: 'AAPL', prediction: 'Neutral', confidence: 65, target: '$182', current: '$178' },
                                                            { symbol: 'TSLA', prediction: 'Bullish', confidence: 78, target: '$260', current: '$243' }
                                                        ].map((stock, i) => (
                                                            <div key={i} className="p-3 bg-gray-50 rounded-lg">
                                                                <div className="flex items-center justify-between mb-2">
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="font-bold text-gray-900">{stock.symbol}</span>
                                                                        <span className={`text-xs px-2 py-0.5 rounded ${stock.prediction === 'Bullish'
                                                                            ? 'bg-emerald-100 text-emerald-700'
                                                                            : 'bg-gray-200 text-gray-700'
                                                                            }`}>
                                                                            {stock.prediction}
                                                                        </span>
                                                                    </div>
                                                                    <span className="text-xs font-semibold text-purple-600">{stock.confidence}% confidence</span>
                                                                </div>
                                                                <div className="flex items-center justify-between text-xs">
                                                                    <div>
                                                                        <span className="text-gray-500">Current: </span>
                                                                        <span className="font-semibold text-gray-900">{stock.current}</span>
                                                                    </div>
                                                                    <div>
                                                                        <span className="text-gray-500">Target: </span>
                                                                        <span className="font-semibold text-emerald-600">{stock.target}</span>
                                                                    </div>
                                                                </div>
                                                                {/* Progress Bar */}
                                                                <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                                                    <div
                                                                        className="h-full bg-purple-600 rounded-full"
                                                                        style={{ width: `${stock.confidence}%` }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Market Sentiment */}
                                                <div className="bg-white rounded-xl p-4 shadow-sm">
                                                    <h3 className="text-sm font-bold text-gray-900 mb-3">Market Sentiment</h3>
                                                    <div className="space-y-3">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-sm text-gray-700">Overall Market</span>
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '68%' }} />
                                                                </div>
                                                                <span className="text-xs font-semibold text-emerald-600">68% Bullish</span>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-sm text-gray-700">Tech Sector</span>
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '82%' }} />
                                                                </div>
                                                                <span className="text-xs font-semibold text-emerald-600">82% Bullish</span>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-sm text-gray-700">Crypto Market</span>
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '74%' }} />
                                                                </div>
                                                                <span className="text-xs font-semibold text-emerald-600">74% Bullish</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>


                                    {/* Input Bar */}
                                    <div className="bg-white px-4 py-3 flex items-center gap-3 border-t border-gray-200">
                                        <div className="flex-1 bg-gray-100 rounded-full px-4 py-2">
                                            <p className="text-sm text-gray-500">Type a message...</p>
                                        </div>
                                        <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
                                            <TrendingUp className="w-5 h-5 text-white" />
                                        </div>
                                    </div>
                                </div>

                                {/* Phone Notch */}
                                <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-full z-10" />
                            </div>

                            {/* Decorative Glow Effects */}
                            <div className="absolute -top-4 -right-4 w-32 h-32 bg-emerald-400/30 rounded-full blur-3xl pointer-events-none" />
                            <div className="absolute -bottom-4 -left-4 w-40 h-40 bg-blue-400/30 rounded-full blur-3xl pointer-events-none" />
                        </div>
                    </div>
                </div>

                {/* Carousel Controls */}
                <div className="flex items-center justify-center gap-6 mt-16">
                    <button
                        onClick={prevSlide}
                        className="h-12 w-12 rounded-full bg-white hover:bg-emerald-50 border-2 border-gray-200 hover:border-emerald-300 flex items-center justify-center text-gray-700 hover:text-emerald-600 transition-all shadow-sm hover:shadow-md"
                        aria-label="Previous slide"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>

                    <div className="flex gap-2">
                        {carouselSlides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    setIsTransitioning(true)
                                    setTimeout(() => {
                                        setCurrentSlide(index)
                                        setIsTransitioning(false)
                                    }, 300)
                                }}
                                className={`h-2.5 rounded-full transition-all ${index === currentSlide
                                    ? 'w-8 bg-emerald-600'
                                    : 'w-2.5 bg-gray-300 hover:bg-emerald-400'
                                    }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>

                    <button
                        onClick={nextSlide}
                        className="h-12 w-12 rounded-full bg-white hover:bg-emerald-50 border-2 border-gray-200 hover:border-emerald-300 flex items-center justify-center text-gray-700 hover:text-emerald-600 transition-all shadow-sm hover:shadow-md"
                        aria-label="Next slide"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </section>
    )
}
