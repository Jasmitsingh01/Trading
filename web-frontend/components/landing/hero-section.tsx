// components/landing/hero-section.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, TrendingUp, Shield, Zap, BarChart3, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function HeroSection() {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-950">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[128px] animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[128px] animate-pulse delay-1000" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[128px] animate-pulse delay-500" />
            </div>

            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem]" />

            {/* Radial Gradient Overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#020617_100%)]" />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-20">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <div className="text-center lg:text-left space-y-8">
                        {/* Animated Badge */}
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 backdrop-blur-sm transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                            </span>
                            <span className="text-sm font-medium text-blue-400">
                                Trusted by 150,000+ Traders Worldwide
                            </span>
                        </div>

                        {/* Main Heading */}
                        <div className={`space-y-6 transition-all duration-1000 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                            <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight">
                                <span className="block text-white mb-2">
                                    Trade Smarter,
                                </span>
                                <span className="block">
                                    <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 text-transparent bg-clip-text animate-gradient">
                                        Invest Better
                                    </span>
                                </span>
                            </h1>
                            <p className="text-xl sm:text-2xl text-slate-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                                Access stocks, crypto, forex, and commodities all in one powerful platform.
                                <span className="text-white font-semibold"> Start trading with zero commission.</span>
                            </p>
                        </div>

                        {/* CTA Buttons */}
                        <div className={`flex flex-col sm:flex-row gap-4 justify-center lg:justify-start transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                            <Link href="/auth/register">
                                <Button
                                    size="lg"
                                    className="group relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-10 py-7 text-lg rounded-2xl shadow-2xl shadow-blue-500/50 hover:shadow-blue-500/70 transition-all duration-300 hover:scale-105 border border-blue-400/20"
                                >
                                    <span className="relative z-10 flex items-center gap-2">
                                        Get Started Free
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity" />
                                </Button>
                            </Link>
                            <Link href="#features">
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="relative bg-slate-900/50 backdrop-blur-sm border-2 border-slate-700 hover:border-blue-500 text-white px-10 py-7 text-lg rounded-2xl transition-all duration-300 hover:scale-105 hover:bg-slate-800/50"
                                >
                                    Explore Features
                                </Button>
                            </Link>
                        </div>

                        {/* Trust Indicators */}
                        <div className={`grid grid-cols-3 gap-6 pt-8 transition-all duration-1000 delay-500 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
                            <div className="text-center lg:text-left">
                                <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 text-transparent bg-clip-text">$2.5B+</div>
                                <div className="text-sm text-slate-400">Trading Volume</div>
                            </div>
                            <div className="text-center lg:text-left">
                                <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">150K+</div>
                                <div className="text-sm text-slate-400">Active Users</div>
                            </div>
                            <div className="text-center lg:text-left">
                                <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 text-transparent bg-clip-text">99.9%</div>
                                <div className="text-sm text-slate-400">Uptime</div>
                            </div>
                        </div>
                    </div>

                    {/* Right Content - Dashboard Preview */}
                    <div className={`relative transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                        <div className="relative">
                            {/* Glow Effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-3xl blur-3xl" />

                            {/* Dashboard Card */}
                            <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-800 overflow-hidden">
                                {/* Header */}
                                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="text-blue-100 text-sm font-medium">Portfolio Value</div>
                                            <div className="text-white text-4xl font-bold">$124,563.00</div>
                                        </div>
                                        <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20">
                                            <div className="flex items-center gap-2 text-white">
                                                <TrendingUp className="h-6 w-6" />
                                                <span className="text-xl font-semibold">+12.5%</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Chart Area */}
                                <div className="p-6 space-y-4">
                                    {/* Mini Chart */}
                                    <div className="h-40 bg-slate-800/50 rounded-2xl flex items-end justify-around p-4 gap-1">
                                        {[40, 70, 45, 80, 60, 90, 75, 95, 85, 100, 70, 85].map((height, i) => (
                                            <div
                                                key={i}
                                                className="relative flex-1 group"
                                            >
                                                <div
                                                    className="bg-gradient-to-t from-blue-500 to-purple-500 rounded-t-lg transition-all duration-500 group-hover:from-blue-400 group-hover:to-purple-400"
                                                    style={{
                                                        height: `${height}%`,
                                                        animationDelay: `${i * 100}ms`
                                                    }}
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    {/* Holdings */}
                                    <div className="space-y-3">
                                        {[
                                            { symbol: 'AAPL', name: 'Apple Inc.', value: '$45,320', change: '+5.2%', positive: true },
                                            { symbol: 'BTC', name: 'Bitcoin', value: '$38,450', change: '+8.7%', positive: true },
                                            { symbol: 'EUR/USD', name: 'Euro/Dollar', value: '$22,180', change: '-2.1%', positive: false }
                                        ].map((holding, i) => (
                                            <div
                                                key={i}
                                                className="flex items-center justify-between p-4 bg-slate-800/50 backdrop-blur-sm rounded-xl hover:bg-slate-700/50 transition-all duration-300 border border-slate-700/50 hover:border-blue-500/50 group"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition-transform">
                                                        {holding.symbol.slice(0, 2)}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-white text-sm">
                                                            {holding.symbol}
                                                        </div>
                                                        <div className="text-xs text-slate-400">
                                                            {holding.name}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-semibold text-white text-sm">
                                                        {holding.value}
                                                    </div>
                                                    <div className={`text-xs font-medium ${holding.positive ? 'text-emerald-400' : 'text-red-400'}`}>
                                                        {holding.change}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Floating Cards */}
                            <div className="absolute -left-6 top-1/4 hidden lg:block animate-float">
                                <div className="bg-slate-900/90 backdrop-blur-xl rounded-2xl shadow-2xl p-4 border border-slate-800">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                                            <Shield className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <div className="text-xs text-slate-400">Security</div>
                                            <div className="font-bold text-white">Bank-Level</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute -right-6 bottom-1/4 hidden lg:block animate-float-delayed">
                                <div className="bg-slate-900/90 backdrop-blur-xl rounded-2xl shadow-2xl p-4 border border-slate-800">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                                            <Zap className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <div className="text-xs text-slate-400">Speed</div>
                                            <div className="font-bold text-white">Lightning Fast</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                <div className="w-6 h-10 border-2 border-slate-600 rounded-full flex justify-center p-2">
                    <div className="w-1 h-3 bg-slate-600 rounded-full animate-pulse" />
                </div>
            </div>
        </section>
    )
}
