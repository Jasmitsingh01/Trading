// app/why-choose-us/page.tsx
'use client'

import { useState, useEffect } from 'react'
import Header from "@/components/ui/header"
import { Footer } from "@/components/landing/footer"
import { TrendingUp, Shield, Zap, BarChart3, Award, Users, DollarSign, Clock, CheckCircle, Globe } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const reasons = [
    {
        icon: DollarSign,
        title: 'Zero Commission Trading',
        description: 'Trade stocks, ETFs, and crypto without paying any commissions. Keep more of your profits.',
        benefits: ['No trading fees', 'No hidden charges', 'No account minimums']
    },
    {
        icon: Zap,
        title: 'Lightning-Fast Execution',
        description: 'Sub-10ms order execution with 99.9% uptime. Never miss a trading opportunity.',
        benefits: ['Real-time order execution', 'Advanced order types', 'Institutional-grade infrastructure']
    },
    {
        icon: Shield,
        title: 'Bank-Level Security',
        description: 'Your funds and data are protected by military-grade encryption and multi-layer security.',
        benefits: ['256-bit SSL encryption', 'Two-factor authentication', 'Cold storage for crypto']
    },
    {
        icon: BarChart3,
        title: 'Advanced Trading Tools',
        description: 'Professional charting tools, technical indicators, and AI-powered market insights.',
        benefits: ['100+ technical indicators', 'Customizable charts', 'Market analysis tools']
    },
    {
        icon: Globe,
        title: 'Global Market Access',
        description: 'Trade stocks, crypto, forex, and commodities from markets around the world.',
        benefits: ['50+ global exchanges', '10,000+ tradeable assets', '24/7 crypto trading']
    },
    {
        icon: Users,
        title: '24/7 Customer Support',
        description: 'Get help whenever you need it with our dedicated support team and resources.',
        benefits: ['Live chat support', 'Phone & email support', 'Comprehensive help center']
    }
]

const comparisons = [
    { feature: 'Commission-Free Trading', us: true, competitors: false },
    { feature: 'Real-Time Market Data', us: true, competitors: 'Paid' },
    { feature: 'Advanced Charting Tools', us: true, competitors: 'Limited' },
    { feature: 'Crypto Trading', us: true, competitors: false },
    { feature: 'Fractional Shares', us: true, competitors: false },
    { feature: '24/7 Support', us: true, competitors: 'Business hours' },
    { feature: 'Mobile App', us: true, competitors: true },
    { feature: 'Paper Trading', us: true, competitors: false }
]

export default function WhyChooseUsPage() {
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
                            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6">
                                Why Traders and Investors
                                <span className="block bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text mt-2">
                                    Choose XBT Broker
                                </span>
                            </h1>
                            <p className="text-xl text-slate-400 leading-relaxed">
                                Join 150,000+ traders who trust TradePro for their trading needs
                            </p>
                        </div>
                    </div>
                </section>

                {/* Reasons Section */}
                <section className="py-24 relative">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {reasons.map((reason, index) => {
                                const Icon = reason.icon
                                return (
                                    <div
                                        key={index}
                                        className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-800 hover:border-blue-500/50 transition-all duration-300 hover:scale-105"
                                    >
                                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                                            <Icon className="w-8 h-8 text-white" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-white mb-3">
                                            {reason.title}
                                        </h3>
                                        <p className="text-slate-400 mb-4 leading-relaxed">
                                            {reason.description}
                                        </p>
                                        <ul className="space-y-2">
                                            {reason.benefits.map((benefit, i) => (
                                                <li key={i} className="flex items-center gap-2 text-slate-300 text-sm">
                                                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                                                    {benefit}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </section>

                {/* Comparison Section */}
                <section className="py-24 bg-slate-900 relative">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                                How We Compare
                            </h2>
                            <p className="text-xl text-slate-400">See why TradePro stands out from the competition</p>
                        </div>

                        <div className="max-w-4xl mx-auto bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-slate-800">
                                            <th className="text-left p-6 text-white font-bold">Feature</th>
                                            <th className="text-center p-6 text-white font-bold">TradePro</th>
                                            <th className="text-center p-6 text-slate-400 font-bold">Competitors</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {comparisons.map((item, index) => (
                                            <tr key={index} className="border-b border-slate-800 last:border-0">
                                                <td className="p-6 text-slate-300">{item.feature}</td>
                                                <td className="p-6 text-center">
                                                    {typeof item.us === 'boolean' ? (
                                                        item.us ? (
                                                            <CheckCircle className="w-6 h-6 text-emerald-400 mx-auto" />
                                                        ) : (
                                                            <span className="text-slate-600">-</span>
                                                        )
                                                    ) : (
                                                        <span className="text-emerald-400 font-semibold">{item.us}</span>
                                                    )}
                                                </td>
                                                <td className="p-6 text-center">
                                                    {typeof item.competitors === 'boolean' ? (
                                                        item.competitors ? (
                                                            <CheckCircle className="w-6 h-6 text-slate-600 mx-auto" />
                                                        ) : (
                                                            <span className="text-red-400">✕</span>
                                                        )
                                                    ) : (
                                                        <span className="text-slate-400">{item.competitors}</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-24 relative">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-4xl mx-auto text-center">
                            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                                Ready to Experience the Difference?
                            </h2>
                            <p className="text-xl text-slate-400 mb-8">
                                Join thousands of traders who've made the switch to TradePro
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
