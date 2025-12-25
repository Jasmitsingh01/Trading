// components/landing/features-section.tsx
'use client'

import { useState } from 'react'
import {
    TrendingUp,
    Shield,
    Zap,
    BarChart3,
    Globe,
    Lock,
    Smartphone,
    HeadphonesIcon,
    RefreshCw,
    Award,
    Target,
    Clock
} from 'lucide-react'

const features = [
    {
        icon: TrendingUp,
        title: 'Multi-Asset Trading',
        description: 'Trade stocks, crypto, forex, and commodities all from one unified platform.',
        color: 'from-blue-500 to-cyan-500',
        iconBg: 'bg-gradient-to-br from-blue-500 to-cyan-500'
    },
    {
        icon: Zap,
        title: 'Lightning Fast Execution',
        description: 'Execute trades in milliseconds with our high-performance matching engine.',
        color: 'from-yellow-500 to-orange-500',
        iconBg: 'bg-gradient-to-br from-yellow-500 to-orange-500'
    },
    {
        icon: Shield,
        title: 'Bank-Level Security',
        description: 'Your assets are protected with military-grade encryption and cold storage.',
        color: 'from-emerald-500 to-teal-500',
        iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-500'
    },
    {
        icon: BarChart3,
        title: 'Advanced Analytics',
        description: 'Real-time charts, technical indicators, and AI-powered market insights.',
        color: 'from-purple-500 to-pink-500',
        iconBg: 'bg-gradient-to-br from-purple-500 to-pink-500'
    },
    {
        icon: Globe,
        title: 'Global Markets',
        description: 'Access markets from around the world, 24/7 trading on select assets.',
        color: 'from-indigo-500 to-blue-500',
        iconBg: 'bg-gradient-to-br from-indigo-500 to-blue-500'
    },
    {
        icon: Smartphone,
        title: 'Mobile Trading',
        description: 'Trade on the go with our powerful mobile apps for iOS and Android.',
        color: 'from-rose-500 to-red-500',
        iconBg: 'bg-gradient-to-br from-rose-500 to-red-500'
    },
    {
        icon: Lock,
        title: 'Two-Factor Authentication',
        description: 'Enhanced account security with 2FA, biometric login, and IP whitelisting.',
        color: 'from-cyan-500 to-blue-500',
        iconBg: 'bg-gradient-to-br from-cyan-500 to-blue-500'
    },
    {
        icon: HeadphonesIcon,
        title: '24/7 Support',
        description: 'Get help anytime with our dedicated support team and comprehensive help center.',
        color: 'from-violet-500 to-purple-500',
        iconBg: 'bg-gradient-to-br from-violet-500 to-purple-500'
    },
    {
        icon: RefreshCw,
        title: 'Instant Deposits',
        description: 'Fund your account instantly with multiple payment methods and zero fees.',
        color: 'from-green-500 to-emerald-500',
        iconBg: 'bg-gradient-to-br from-green-500 to-emerald-500'
    }
]

const stats = [
    { icon: Award, value: '99.9%', label: 'Uptime', color: 'from-blue-400 to-cyan-400' },
    { icon: Target, value: '<10ms', label: 'Latency', color: 'from-purple-400 to-pink-400' },
    { icon: Clock, value: '24/7', label: 'Trading', color: 'from-emerald-400 to-teal-400' },
]

export function FeaturesSection() {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

    return (
        <section id="features" className="py-24 bg-slate-950 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem]" />

            {/* Background Gradients */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[128px]" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[128px]" />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 backdrop-blur-sm mb-6">
                        <span className="text-sm font-medium text-blue-400">
                            Powerful Features
                        </span>
                    </div>
                    <h2 className="text-5xl sm:text-6xl font-bold text-white mb-6">
                        Everything You Need to
                        <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text mt-2">
                            Trade Like a Pro
                        </span>
                    </h2>
                    <p className="text-xl text-slate-400">
                        Professional-grade tools and features designed for traders of all levels
                    </p>
                </div>

                {/* Stats Bar */}
                <div className="grid md:grid-cols-3 gap-6 mb-16 max-w-5xl mx-auto">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="relative group"
                        >
                            {/* Glow Effect */}
                            <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-20 rounded-2xl blur-xl transition-opacity duration-500`} />

                            <div className="relative bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-800 hover:border-blue-500/50 transition-all duration-300 hover:scale-105">
                                <div className="flex items-center gap-4">
                                    <div className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                                        <stat.icon className="h-7 w-7 text-white" />
                                    </div>
                                    <div>
                                        <div className={`text-4xl font-bold bg-gradient-to-r ${stat.color} text-transparent bg-clip-text`}>
                                            {stat.value}
                                        </div>
                                        <div className="text-sm text-slate-400">
                                            {stat.label}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => {
                        const Icon = feature.icon
                        return (
                            <div
                                key={index}
                                onMouseEnter={() => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                                className="group relative"
                            >
                                {/* Glow Effect */}
                                <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-20 rounded-2xl blur-xl transition-opacity duration-500`} />

                                {/* Card */}
                                <div className="relative h-full bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-800 hover:border-blue-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                                    {/* Icon */}
                                    <div className={`w-16 h-16 ${feature.iconBg} rounded-xl flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                        <Icon className="h-8 w-8 text-white" />
                                    </div>

                                    {/* Content */}
                                    <h3 className="text-xl font-bold text-white mb-3">
                                        {feature.title}
                                    </h3>
                                    <p className="text-slate-400 leading-relaxed">
                                        {feature.description}
                                    </p>

                                  
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
