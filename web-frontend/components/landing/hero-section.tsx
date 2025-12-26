'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, ChevronLeft, ChevronRight, TrendingUp, Bell, Shield, BarChart3, Apple, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'

// Platform detection utility
function detectPlatform() {
    if (typeof window === 'undefined') return null
    
    const userAgent = window.navigator.userAgent.toLowerCase()
    const isIOS = /iphone|ipad|ipod/.test(userAgent)
    const isAndroid = /android/.test(userAgent)
    
    return {
        isIOS,
        isAndroid,
        isMobile: isIOS || isAndroid
    }
}

const carouselSlides = [
    {
        title: "Professional Trading Platform for Global Markets",
        subtitle: "Trade Smarter, Not Harder",
        description: "Access real-time market data, advanced analytics, and institutional-grade trading tools designed for serious traders.",
        stats: [
            { value: "$2.5B+", label: "Trading Volume" },
            { value: "50K+", label: "Active Traders" },
            { value: "150+", label: "Global Markets" }
        ]
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
        ]
    },
    {
        title: "Enterprise Security & Compliance",
        subtitle: "Your Security is Our Priority",
        description: "Bank-level encryption, multi-factor authentication, and full regulatory compliance to keep your investments safe.",
        stats: [
            { value: "256-bit", label: "SSL Encryption" },
            { value: "SEC", label: "Registered" },
            { value: "FDIC", label: "Insured" }
        ]
    },
    {
        title: "AI-Powered Trading Insights",
        subtitle: "Data-Driven Trading Decisions",
        description: "Leverage AI predictions, sentiment analysis, and real-time market intelligence to stay ahead of the curve.",
        stats: [
            { value: "100+", label: "Indicators" },
            { value: "AI-Powered", label: "Predictions" },
            { value: "Real-Time", label: "Market Data" }
        ]
    }
]

export function HeroSection() {
    const [currentSlide, setCurrentSlide] = useState(0)
    const [isPaused, setIsPaused] = useState(false)
    const [isTransitioning, setIsTransitioning] = useState(false)
    const [platform, setPlatform] = useState<{ isIOS: boolean; isAndroid: boolean; isMobile: boolean } | null>(null)

    // Detect platform on mount
    useEffect(() => {
        setPlatform(detectPlatform())
    }, [])

    // Auto-slide carousel
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

    // Handle app download based on platform
    const handleAppDownload = () => {
        if (platform?.isIOS) {
            // Replace with your actual App Store URL
            window.location.href = 'https://apps.apple.com/app/your-app-id'
        } else if (platform?.isAndroid) {
            // Replace with your Play Store URL or direct APK download
            window.location.href = 'https://play.google.com/store/apps/details?id=com.trading.app'
            // For direct APK: window.location.href = '/api/download/android'
        }
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

                        {/* Dynamic Download Buttons */}
                        {slide.showAppDownload && platform ? (
                            <div className="space-y-6">
                                {platform.isMobile ? (
                                    /* Single Smart Download Button for Mobile */
                                    <button 
                                        onClick={handleAppDownload}
                                        className="w-full sm:w-auto group"
                                    >
                                        <div className="flex items-center justify-center gap-4 px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-xl transition-all shadow-lg hover:shadow-xl group-hover:scale-105">
                                            {platform.isIOS ? (
                                                <>
                                                    <Apple className="h-12 w-12" />
                                                    <div className="text-left">
                                                        <div className="text-sm font-medium opacity-90">Download for</div>
                                                        <div className="text-2xl font-bold">iPhone</div>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <Play className="h-12 w-12" />
                                                    <div className="text-left">
                                                        <div className="text-sm font-medium opacity-90">Download for</div>
                                                        <div className="text-2xl font-bold">Android</div>
                                                    </div>
                                                </>
                                            )}
                                            <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </button>
                                ) : (
                                    /* Both Buttons for Desktop */
                                    <>
                                        <p className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Download Our App</p>
                                        <div className="flex flex-col sm:flex-row gap-4">
                                            <a 
                                                href="https://apps.apple.com/app/your-app-id" 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="inline-block group"
                                            >
                                                <div className="flex items-center gap-3 px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-xl transition-all shadow-md hover:shadow-lg group-hover:scale-105">
                                                    <Apple className="h-8 w-8" />
                                                    <div className="text-left">
                                                        <div className="text-xs font-medium">Download on the</div>
                                                        <div className="text-lg font-bold">App Store</div>
                                                    </div>
                                                </div>
                                            </a>
                                            <a 
                                                href="https://play.google.com/store/apps/details?id=com.trading.app" 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="inline-block group"
                                            >
                                                <div className="flex items-center gap-3 px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-xl transition-all shadow-md hover:shadow-lg group-hover:scale-105">
                                                    <Play className="h-8 w-8" />
                                                    <div className="text-left">
                                                        <div className="text-xs font-medium">Get it on</div>
                                                        <div className="text-lg font-bold">Google Play</div>
                                                    </div>
                                                </div>
                                            </a>
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            /* Default CTAs for non-download slides */
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
                        <div className="relative mx-auto max-w-[400px]">
                            <div className="relative bg-black rounded-[3rem] p-3 shadow-2xl">
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

                                    {/* Trading App Screen */}
                                    <div className="bg-gray-50 min-h-[500px] relative overflow-hidden">
                                        {/* Slide 1: Trading Dashboard */}
                                        {currentSlide === 0 && (
                                            <div className="p-4 space-y-4 animate-in fade-in duration-500">
                                                <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl p-4 text-white shadow-lg">
                                                    <div className="text-xs opacity-80 mb-1">Portfolio Value</div>
                                                    <div className="text-3xl font-bold mb-2">$47,382.50</div>
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <TrendingUp className="w-4 h-4" />
                                                        <span className="font-semibold">+$2,340.25 (5.2%)</span>
                                                        <span className="opacity-80">Today</span>
                                                    </div>
                                                </div>

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

                                                <div className="bg-white rounded-xl p-4 shadow-sm">
                                                    <h3 className="text-sm font-bold text-gray-900 mb-3">Top Holdings</h3>
                                                    <div className="space-y-3">
                                                        {[
                                                            { symbol: 'AAPL', shares: '25', value: '$4,461', change: '+2.34%' },
                                                            { symbol: 'TSLA', shares: '15', value: '$3,642', change: '+5.67%' },
                                                            { symbol: 'NVDA', shares: '12', value: '$5,942', change: '+3.21%' }
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
                                                                    <div className="text-xs font-semibold text-emerald-600">{stock.change}</div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Slide 2: Alerts */}
                                        {currentSlide === 1 && (
                                            <div className="p-4 space-y-3 animate-in fade-in duration-500">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h3 className="text-sm font-bold text-gray-900">Alerts & Notifications</h3>
                                                    <span className="text-xs text-emerald-600 font-semibold">3 New</span>
                                                </div>
                                                {[
                                                    { icon: '📈', title: 'Price Target Hit', subtitle: 'Bitcoin reached $43,256', time: '2 min ago', change: '+3.42%' },
                                                    { icon: '⚡', title: 'Technical Signal', subtitle: 'TSLA crossed 50-day MA', time: '15 min ago', change: '+5.67%' },
                                                    { icon: '📊', title: 'Earnings Alert', subtitle: 'AAPL reports tomorrow', time: '1 hour ago', change: 'Before Market' },
                                                    { icon: '🔔', title: 'Market News', subtitle: 'Fed announces rate decision', time: '2 hours ago', change: 'High Impact' }
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
                                                            <span className="text-xs font-semibold px-2 py-1 rounded bg-emerald-100 text-emerald-700">
                                                                {alert.change}
                                                            </span>
                                                        </div>
                                                        <div className="text-xs text-gray-400 mt-2">{alert.time}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Slide 3: Security */}
                                        {currentSlide === 2 && (
                                            <div className="p-4 space-y-4 animate-in fade-in duration-500">
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

                                                <div className="bg-white rounded-xl p-4 shadow-sm">
                                                    <h3 className="text-sm font-bold text-gray-900 mb-3">Security Features</h3>
                                                    <div className="space-y-3">
                                                        {[
                                                            { icon: '🔐', title: 'Two-Factor Authentication', status: 'Enabled' },
                                                            { icon: '👤', title: 'Biometric Login', status: 'Face ID Active' },
                                                            { icon: '🛡️', title: 'Device Management', status: '2 Trusted Devices' },
                                                            { icon: '📱', title: 'Login Notifications', status: 'Push & Email' }
                                                        ].map((feature, i) => (
                                                            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                                <div className="flex items-center gap-3">
                                                                    <span className="text-xl">{feature.icon}</span>
                                                                    <div>
                                                                        <div className="text-sm font-semibold text-gray-900">{feature.title}</div>
                                                                        <div className="text-xs text-gray-600">{feature.status}</div>
                                                                    </div>
                                                                </div>
                                                                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Slide 4: AI Insights */}
                                        {currentSlide === 3 && (
                                            <div className="p-4 space-y-4 animate-in fade-in duration-500">
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
                                                                        <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-700">
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
                                                                <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                                                    <div className="h-full bg-purple-600 rounded-full" style={{ width: `${stock.confidence}%` }} />
                                                                </div>
                                                            </div>
                                                        ))}
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
                                className={`h-2.5 rounded-full transition-all ${
                                    index === currentSlide
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
