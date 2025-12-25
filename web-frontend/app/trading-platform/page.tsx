// app/trading-platform/page.tsx
'use client'

import { useState, useEffect } from 'react'
import Header from "@/components/ui/header"
import { Footer } from "@/components/landing/footer"
import { BarChart3, TrendingUp, Zap, Layout, PieChart, Activity, Terminal, Smartphone } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const features = [
    {
        icon: BarChart3,
        title: 'Advanced Charting',
        description: '100+ technical indicators, drawing tools, and customizable chart layouts',
        color: 'from-blue-500 to-cyan-500'
    },
    {
        icon: TrendingUp,
        title: 'Real-Time Data',
        description: 'Live market data with sub-millisecond latency for instant decision making',
        color: 'from-purple-500 to-pink-500'
    },
    {
        icon: Zap,
        title: 'One-Click Trading',
        description: 'Execute trades instantly with our streamlined order entry system',
        color: 'from-emerald-500 to-teal-500'
    },
    {
        icon: Layout,
        title: 'Customizable Workspace',
        description: 'Create and save multiple workspace layouts for different trading strategies',
        color: 'from-orange-500 to-red-500'
    },
    {
        icon: PieChart,
        title: 'Portfolio Analytics',
        description: 'Track performance, analyze risk, and optimize your portfolio allocation',
        color: 'from-indigo-500 to-purple-500'
    },
    {
        icon: Activity,
        title: 'Market Scanner',
        description: 'Find trading opportunities with our powerful market screening tools',
        color: 'from-rose-500 to-pink-500'
    },
    {
        icon: Terminal,
        title: 'API Access',
        description: 'Automate your trading with our comprehensive REST and WebSocket APIs',
        color: 'from-cyan-500 to-blue-500'
    },
    {
        icon: Smartphone,
        title: 'Mobile Trading',
        description: 'Full-featured mobile apps for iOS and Android with biometric login',
        color: 'from-violet-500 to-purple-500'
    }
]

const platforms = [
    {
        name: 'Web Platform',
        description: 'Access your account from any browser, anywhere',
        features: ['No download required', 'Works on all devices', 'Cloud-based settings']
    },
    {
        name: 'Desktop App',
        description: 'Advanced trading for Windows, Mac, and Linux',
        features: ['High-performance', 'Advanced tools', 'Multiple monitors']
    },
    {
        name: 'Mobile Apps',
        description: 'Trade on the go with iOS and Android apps',
        features: ['Touch-optimized', 'Push notifications', 'Biometric login']
    }
]

export default function TradingPlatformPage() {
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
                                <BarChart3 className="w-4 h-4 text-blue-400" />
                                <span className="text-sm font-medium text-blue-400">Professional Trading Platform</span>
                            </div>
                            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6">
                                Advanced Tools for
                                <span className="block bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text mt-2">
                                    Professional Traders
                                </span>
                            </h1>
                            <p className="text-xl text-slate-400 leading-relaxed">
                                Everything you need to analyze markets, execute trades, and manage your portfolio
                            </p>
                        </div>
                    </div>
                </section>

                {/* Features Grid */}
                <section className="py-24 relative">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {features.map((feature, index) => {
                                const Icon = feature.icon
                                return (
                                    <div
                                        key={index}
                                        className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-800 hover:border-blue-500/50 transition-all duration-300 hover:scale-105"
                                    >
                                        <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                                            <Icon className="w-7 h-7 text-white" />
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-2">
                                            {feature.title}
                                        </h3>
                                        <p className="text-slate-400 text-sm">
                                            {feature.description}
                                        </p>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </section>

                {/* Platforms Section */}
                <section className="py-24 bg-slate-900 relative">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                                Trade Anywhere, Anytime
                            </h2>
                            <p className="text-xl text-slate-400">Choose the platform that works best for you</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                            {platforms.map((platform, index) => (
                                <div
                                    key={index}
                                    className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-800 hover:border-blue-500/50 transition-all duration-300 hover:scale-105"
                                >
                                    <h3 className="text-2xl font-bold text-white mb-3">
                                        {platform.name}
                                    </h3>
                                    <p className="text-slate-400 mb-6">
                                        {platform.description}
                                    </p>
                                    <ul className="space-y-3">
                                        {platform.features.map((feature, i) => (
                                            <li key={i} className="flex items-center gap-2 text-slate-300">
                                                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-24 relative">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-4xl mx-auto text-center">
                            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                                Ready to Start Trading?
                            </h2>
                            <p className="text-xl text-slate-400 mb-8">
                                Open your free account today and get instant access to our platform
                            </p>
                            <Link href="/auth/register">
                                <Button
                                    size="lg"
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-12 py-7 text-lg rounded-2xl shadow-2xl shadow-blue-500/50 transition-all duration-300 hover:scale-105"
                                >
                                    Get Started Free
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    )
}
