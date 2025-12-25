// components/landing/cta-section.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
    ArrowRight,
    CheckCircle2,
    Shield,
    TrendingUp,
    Users,
    Star,
    Sparkles,
    Clock,
    Award
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const benefits = [
    { icon: CheckCircle2, text: 'No hidden fees or commissions', color: 'text-emerald-400' },
    { icon: TrendingUp, text: 'Free real-time market data', color: 'text-blue-400' },
    { icon: Award, text: 'Advanced charting tools included', color: 'text-purple-400' },
    { icon: Shield, text: 'Bank-level security & encryption', color: 'text-cyan-400' }
]

const stats = [
    { icon: Users, value: '150K+', label: 'Active Traders' },
    { icon: TrendingUp, value: '$2.5B+', label: 'Trading Volume' },
    { icon: Star, value: '4.9/5', label: 'User Rating' }
]

export function CTASection() {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    return (
        <section className="py-24 lg:py-32 relative overflow-hidden bg-slate-950">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Gradient Orbs */}
                <div className="absolute top-1/4 -left-20 w-80 h-80 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 rounded-full blur-[128px] animate-pulse" />
                <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-gradient-to-l from-purple-500/30 to-pink-500/30 rounded-full blur-[128px] animate-pulse delay-1000" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 rounded-full blur-[128px] animate-pulse delay-500" />
            </div>

            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem]" />

            <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    {/* Main Content */}
                    <div className="space-y-12">
                        {/* Header Section */}
                        <div className={`text-center space-y-6 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                            {/* Floating Badge */}
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 backdrop-blur-sm">
                                <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
                                <span className="text-sm font-semibold bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
                                    Limited Time Offer - Join Now
                                </span>
                            </div>

                            {/* Main Heading */}
                            <div className="space-y-4">
                                <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
                                    <span className="block text-white mb-2">
                                        Ready to Start
                                    </span>
                                    <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
                                        Your Trading Journey?
                                    </span>
                                </h2>
                                <p className="text-xl sm:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
                                    Join thousands of successful traders and get access to professional-grade tools,
                                    <span className="text-white font-semibold"> real-time market data</span>, and expert insights—all in one powerful platform.
                                </p>
                            </div>
                        </div>

                        {/* Main CTA Card */}
                        <div className={`relative transition-all duration-1000 delay-200 ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                            {/* Glow Effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-pink-500/30 rounded-3xl blur-3xl" />

                            {/* Card */}
                            <div className="relative bg-slate-900/70 backdrop-blur-xl rounded-3xl border-2 border-slate-800 overflow-hidden shadow-2xl">
                                {/* Top Gradient Bar */}
                                <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

                                <div className="p-8 sm:p-12 lg:p-16 space-y-10">
                                    {/* Benefits Grid */}
                                    <div className="grid sm:grid-cols-2 gap-6">
                                        {benefits.map((benefit, index) => {
                                            const Icon = benefit.icon
                                            return (
                                                <div
                                                    key={index}
                                                    className={`flex items-start gap-4 p-6 rounded-2xl bg-slate-800/50 backdrop-blur-sm border border-slate-700 hover:border-blue-500/50 transition-all duration-300 hover:scale-105 group`}
                                                >
                                                    <div className={`w-12 h-12 rounded-xl ${index === 0 ? 'bg-gradient-to-br from-emerald-500 to-teal-500' :
                                                            index === 1 ? 'bg-gradient-to-br from-blue-500 to-cyan-500' :
                                                                index === 2 ? 'bg-gradient-to-br from-purple-500 to-pink-500' :
                                                                    'bg-gradient-to-br from-cyan-500 to-blue-500'
                                                        } flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                                        <Icon className="w-6 h-6 text-white" />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-white leading-relaxed">
                                                            {benefit.text}
                                                        </p>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>

                                    {/* CTA Buttons */}
                                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                        <Button
                                            asChild
                                            size="lg"
                                            className="group h-16 px-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-2xl shadow-2xl shadow-blue-500/50 hover:shadow-blue-500/70 transition-all duration-300 hover:scale-105"
                                        >
                                            <Link href="/auth/register" className="flex items-center gap-2">
                                                Create Free Account
                                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                            </Link>
                                        </Button>
                                        <Button
                                            asChild
                                            variant="outline"
                                            size="lg"
                                            className="h-16 px-12 text-lg font-semibold bg-slate-800/50 backdrop-blur-sm border-2 border-slate-700 hover:border-blue-500/50 text-white rounded-2xl transition-all duration-300 hover:scale-105"
                                        >
                                            <Link href="/auth/login">
                                                Sign In
                                            </Link>
                                        </Button>
                                    </div>

                                    {/* Trust Indicators */}
                                    <div className="flex flex-wrap items-center justify-center gap-6 pt-6 border-t border-slate-800">
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <Shield className="w-5 h-5 text-emerald-400" />
                                            <span className="text-sm font-medium">Bank-Level Security</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <Clock className="w-5 h-5 text-blue-400" />
                                            <span className="text-sm font-medium">24/7 Support</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <Award className="w-5 h-5 text-purple-400" />
                                            <span className="text-sm font-medium">No Credit Card Required</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stats Section */}
                        <div className={`grid md:grid-cols-3 gap-6 transition-all duration-1000 delay-400 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                            {stats.map((stat, index) => {
                                const Icon = stat.icon
                                return (
                                    <div
                                        key={index}
                                        className="group relative bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-800 hover:border-blue-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                                    >
                                        {/* Hover Glow */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                        <div className="relative flex items-center gap-4">
                                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                                <Icon className="w-8 h-8 text-white" />
                                            </div>
                                            <div>
                                                <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
                                                    {stat.value}
                                                </div>
                                                <div className="text-sm text-slate-400">
                                                    {stat.label}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        {/* Bottom Text */}
                        <div className={`text-center transition-all duration-1000 delay-600 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
                            <p className="text-slate-400 text-lg">
                                Have questions?{' '}
                                <Link
                                    href="/contact"
                                    className="font-semibold text-blue-400 hover:text-purple-400 transition-colors underline decoration-2 underline-offset-4"
                                >
                                    Contact our support team
                                </Link>
                                {' '}— we're here to help 24/7
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
