'use client'

import { useState, useEffect } from 'react'
import Header from "@/components/ui/header"
import { Footer } from "@/components/landing/footer"
import { TrendingUp, Shield, Zap, BarChart3, Award, Users, DollarSign, Clock, CheckCircle, Globe, Lock, Smartphone, HeadphonesIcon, TrendingDown, PieChart, FileText, Star } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const reasons = [
    {
        icon: DollarSign,
        title: 'Zero Commission Trading',
        description: 'Trade stocks, ETFs, and crypto without paying any commissions. Keep 100% of your profits with no hidden fees.',
        benefits: ['$0 commission on all trades', 'No account minimums', 'No withdrawal fees', 'No inactivity charges']
    },
    {
        icon: Zap,
        title: 'Lightning-Fast Execution',
        description: 'Sub-10ms order execution with 99.9% uptime guarantee. Never miss a trading opportunity with our infrastructure.',
        benefits: ['Real-time order execution', 'Advanced order types', 'Direct market access', 'Low latency trading']
    },
    {
        icon: Shield,
        title: 'Bank-Level Security',
        description: 'Your funds and data protected by military-grade encryption, multi-factor authentication, and cold storage.',
        benefits: ['256-bit SSL encryption', '2FA authentication', 'Cold storage for crypto', 'FDIC insured']
    },
    {
        icon: BarChart3,
        title: 'Advanced Trading Tools',
        description: 'Professional charting tools, 100+ technical indicators, and AI-powered market insights at your fingertips.',
        benefits: ['100+ technical indicators', 'Customizable charts', 'Market analysis tools', 'Trading signals']
    },
    {
        icon: Globe,
        title: 'Global Market Access',
        description: 'Trade stocks, crypto, forex, and commodities from 150+ markets worldwide, all from one platform.',
        benefits: ['150+ global markets', '10,000+ tradeable assets', '24/7 crypto trading', 'Multi-currency support']
    },
    {
        icon: HeadphonesIcon,
        title: '24/7 Expert Support',
        description: 'Get help whenever you need it with dedicated support team, live chat, and comprehensive resources.',
        benefits: ['24/7 live chat support', 'Phone & email support', 'Video tutorials', '15+ languages']
    }
]

const stats = [
    { value: '150K+', label: 'Active Traders', icon: Users },
    { value: '$2.5B+', label: 'Daily Volume', icon: TrendingUp },
    { value: '99.9%', label: 'Uptime', icon: Clock },
    { value: '150+', label: 'Markets', icon: Globe }
]

const comparisons = [
    { feature: 'Commission-Free Trading', us: true, competitors: false },
    { feature: 'Real-Time Market Data', us: true, competitors: 'Paid Add-on' },
    { feature: 'Advanced Charting Tools', us: 'Unlimited', competitors: 'Limited' },
    { feature: 'Crypto Trading', us: true, competitors: false },
    { feature: 'Fractional Shares', us: true, competitors: false },
    { feature: '24/7 Customer Support', us: true, competitors: 'Business Hours' },
    { feature: 'Mobile Trading App', us: true, competitors: true },
    { feature: 'Paper Trading', us: true, competitors: false },
    { feature: 'API Access', us: true, competitors: 'Paid' },
    { feature: 'Educational Resources', us: 'Free', competitors: 'Limited' }
]

const features = [
    {
        title: 'Institutional-Grade Infrastructure',
        description: 'Built on the same technology used by professional trading firms, our platform handles millions of trades daily with zero downtime.',
        icon: Award,
        image: '/api/placeholder/600/400'
    },
    {
        title: 'Advanced Risk Management',
        description: 'Protect your portfolio with stop-loss orders, take-profit targets, and real-time risk analysis tools that help you trade smarter.',
        icon: Shield,
        image: '/api/placeholder/600/400'
    },
    {
        title: 'AI-Powered Insights',
        description: 'Leverage machine learning algorithms that analyze market trends, identify opportunities, and provide actionable trading signals.',
        icon: BarChart3,
        image: '/api/placeholder/600/400'
    }
]

const testimonials = [
    {
        name: 'Michael Chen',
        role: 'Day Trader',
        avatar: 'MC',
        quote: 'The execution speed is incredible. I\'ve tried 5 different platforms and TradeVault is hands down the fastest.',
        rating: 5
    },
    {
        name: 'Sarah Williams',
        role: 'Portfolio Manager',
        avatar: 'SW',
        quote: 'Zero commissions and professional tools? This platform has everything institutional traders need at retail prices.',
        rating: 5
    },
    {
        name: 'David Rodriguez',
        role: 'Crypto Investor',
        avatar: 'DR',
        quote: 'Being able to trade stocks and crypto in one place with bank-level security is a game changer.',
        rating: 5
    }
]

const trustBadges = [
    { label: 'SEC Registered', icon: Lock },
    { label: 'FINRA Member', icon: Shield },
    { label: 'FDIC Insured', icon: Award },
    { label: 'ISO Certified', icon: CheckCircle }
]

export default function WhyChooseUsPage() {
    const [mounted, setMounted] = useState(false)

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
                                <Award className="h-4 w-4 text-emerald-600" />
                                <span className="text-sm font-medium text-emerald-700">Trusted by 150,000+ Traders</span>
                            </div>
                            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                                Why Traders Choose
                                <span className="block text-emerald-600 mt-2">
                                    TradeVault
                                </span>
                            </h1>
                            <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
                                Experience the perfect combination of advanced technology, zero commissions, and institutional-grade security that's helping traders succeed worldwide.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Stats Bar */}
                <section className="py-16 bg-white border-y border-gray-200">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
                            {stats.map((stat, index) => {
                                const Icon = stat.icon
                                return (
                                    <div key={index} className="text-center">
                                        <Icon className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
                                        <div className="text-4xl font-bold text-gray-900 mb-1">
                                            {stat.value}
                                        </div>
                                        <div className="text-sm text-gray-600 font-medium uppercase tracking-wide">{stat.label}</div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </section>

                {/* Reasons Section */}
                <section className="py-20 bg-gray-50">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <span className="text-sm font-semibold text-emerald-600 uppercase tracking-wider">What Sets Us Apart</span>
                            <h2 className="text-4xl font-bold text-gray-900 mt-3 mb-4">
                                Built for Serious Traders
                            </h2>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Everything you need to trade with confidence</p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                            {reasons.map((reason, index) => {
                                const Icon = reason.icon
                                return (
                                    <div
                                        key={index}
                                        className="bg-white p-8 border-2 border-gray-200 hover:border-emerald-400 transition-all group"
                                    >
                                        <div className="w-14 h-14 bg-emerald-100 group-hover:bg-emerald-600 flex items-center justify-center mb-6 transition-colors">
                                            <Icon className="w-7 h-7 text-emerald-600 group-hover:text-white transition-colors" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-3">
                                            {reason.title}
                                        </h3>
                                        <p className="text-gray-600 mb-4 leading-relaxed text-sm">
                                            {reason.description}
                                        </p>
                                        <ul className="space-y-2">
                                            {reason.benefits.map((benefit, i) => (
                                                <li key={i} className="flex items-start gap-2 text-gray-700 text-sm">
                                                    <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                                                    <span>{benefit}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </section>

                {/* Features with Images */}
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <span className="text-sm font-semibold text-emerald-600 uppercase tracking-wider">Platform Features</span>
                            <h2 className="text-4xl font-bold text-gray-900 mt-3 mb-4">
                                Enterprise Technology, Retail Pricing
                            </h2>
                        </div>

                        <div className="max-w-6xl mx-auto space-y-20">
                            {features.map((feature, index) => {
                                const Icon = feature.icon
                                const isEven = index % 2 === 0
                                return (
                                    <div key={index} className={`grid lg:grid-cols-2 gap-12 items-center ${!isEven ? 'lg:flex-row-reverse' : ''}`}>
                                        <div className={isEven ? 'lg:order-1' : 'lg:order-2'}>
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-12 h-12 bg-emerald-100 flex items-center justify-center">
                                                    <Icon className="w-6 h-6 text-emerald-600" />
                                                </div>
                                                <h3 className="text-2xl font-bold text-gray-900">{feature.title}</h3>
                                            </div>
                                            <p className="text-gray-600 leading-relaxed text-lg">
                                                {feature.description}
                                            </p>
                                        </div>
                                        <div className={isEven ? 'lg:order-2' : 'lg:order-1'}>
                                            <div className="bg-gradient-to-br from-emerald-100 to-teal-50 p-4 border-2 border-emerald-200">
                                                <img
                                                    src={feature.image}
                                                    alt={feature.title}
                                                    className="w-full h-auto"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </section>

                {/* Comparison Section */}
                <section className="py-20 bg-gray-50">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <span className="text-sm font-semibold text-emerald-600 uppercase tracking-wider">Platform Comparison</span>
                            <h2 className="text-4xl font-bold text-gray-900 mt-3 mb-4">
                                See How We Compare
                            </h2>
                            <p className="text-lg text-gray-600">Industry-leading features at zero cost</p>
                        </div>

                        <div className="max-w-4xl mx-auto bg-white border-2 border-gray-200 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr className="border-b-2 border-gray-200">
                                            <th className="text-left p-6 text-gray-900 font-bold">Feature</th>
                                            <th className="text-center p-6">
                                                <div className="text-emerald-600 font-bold text-lg">TradeVault</div>
                                            </th>
                                            <th className="text-center p-6 text-gray-600 font-bold">Other Platforms</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {comparisons.map((item, index) => (
                                            <tr key={index} className="border-b border-gray-200 last:border-0 hover:bg-gray-50">
                                                <td className="p-6 text-gray-700 font-medium">{item.feature}</td>
                                                <td className="p-6 text-center">
                                                    {typeof item.us === 'boolean' ? (
                                                        item.us ? (
                                                            <CheckCircle className="w-6 h-6 text-emerald-600 mx-auto" />
                                                        ) : (
                                                            <span className="text-gray-400">-</span>
                                                        )
                                                    ) : (
                                                        <span className="text-emerald-600 font-semibold">{item.us}</span>
                                                    )}
                                                </td>
                                                <td className="p-6 text-center">
                                                    {typeof item.competitors === 'boolean' ? (
                                                        item.competitors ? (
                                                            <CheckCircle className="w-6 h-6 text-gray-400 mx-auto" />
                                                        ) : (
                                                            <span className="text-red-500 text-xl">✕</span>
                                                        )
                                                    ) : (
                                                        <span className="text-gray-500 text-sm">{item.competitors}</span>
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

                {/* Testimonials */}
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <span className="text-sm font-semibold text-emerald-600 uppercase tracking-wider">What Traders Say</span>
                            <h2 className="text-4xl font-bold text-gray-900 mt-3 mb-4">
                                Trusted by Professionals
                            </h2>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                            {testimonials.map((testimonial, index) => (
                                <div key={index} className="bg-gray-50 border-2 border-gray-200 p-8">
                                    <div className="flex gap-1 mb-4">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <Star key={i} className="w-5 h-5 fill-emerald-500 text-emerald-500" />
                                        ))}
                                    </div>
                                    <p className="text-gray-700 mb-6 leading-relaxed">"{testimonial.quote}"</p>
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-emerald-600 flex items-center justify-center text-white font-bold">
                                            {testimonial.avatar}
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-900">{testimonial.name}</div>
                                            <div className="text-sm text-gray-600">{testimonial.role}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Trust Badges */}
                <section className="py-16 bg-gray-50 border-y border-gray-200">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-8">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Regulated & Trusted</h3>
                        </div>
                        <div className="flex flex-wrap justify-center items-center gap-12">
                            {trustBadges.map((badge, index) => {
                                const Icon = badge.icon
                                return (
                                    <div key={index} className="flex items-center gap-2">
                                        <Icon className="w-6 h-6 text-emerald-600" />
                                        <span className="font-bold text-gray-900">{badge.label}</span>
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
                                Ready to Experience the Difference?
                            </h2>
                            <p className="text-lg text-gray-300 mb-8">
                                Join 150,000+ traders who've made the switch to TradeVault
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link href="/registration">
                                    <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-10">
                                        Start Trading Now
                                    </Button>
                                </Link>
                                <Link href="/contact">
                                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 font-medium px-10">
                                        Contact Sales
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
