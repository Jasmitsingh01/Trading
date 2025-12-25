'use client'

import { BarChart3, Shield, Zap, Globe, TrendingUp, Lock } from 'lucide-react'

const features = [
    {
        icon: BarChart3,
        title: 'Advanced Analytics',
        description: 'Real-time market data with professional-grade charting tools and technical indicators.',
        color: 'from-primary to-purple-600'
    },
    {
        icon: Zap,
        title: 'Lightning Fast',
        description: 'Execute trades in milliseconds with our optimized infrastructure and low-latency connections.',
        color: 'from-yellow-500 to-orange-500'
    },
    {
        icon: Shield,
        title: 'Bank-Level Security',
        description: 'Your assets are protected with military-grade encryption and multi-factor authentication.',
        color: 'from-green-500 to-emerald-500'
    },
    {
        icon: Globe,
        title: 'Global Markets',
        description: 'Access stocks, forex, crypto, and commodities from markets around the world.',
        color: 'from-blue-500 to-cyan-500'
    },
    {
        icon: TrendingUp,
        title: 'Smart Automation',
        description: 'Set up automated trading strategies with our intelligent algorithm builder.',
        color: 'from-purple-500 to-pink-500'
    },
    {
        icon: Lock,
        title: 'Regulatory Compliant',
        description: 'Fully licensed and regulated, ensuring your trades meet all legal requirements.',
        color: 'from-red-500 to-pink-500'
    }
]

export function FeaturesSection() {
    return (
        <section className="py-24 relative">
            <div className="container mx-auto px-6">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
                    <h2 className="text-4xl sm:text-5xl font-bold mb-4">
                        <span className="bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
                            Everything You Need
                        </span>
                        {' '}to Trade
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        Professional trading tools designed for both beginners and experienced traders
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {features.map((feature, index) => {
                        const Icon = feature.icon
                        return (
                            <div
                                key={feature.title}
                                className="group relative p-8 rounded-2xl bg-card border-2 border-border hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 animate-scale-in"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                {/* Icon with Gradient Background */}
                                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} p-3 mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                                    <Icon className="w-full h-full text-white" strokeWidth={2} />
                                </div>

                                {/* Content */}
                                <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
                                    {feature.title}
                                </h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    {feature.description}
                                </p>

                                {/* Hover Effect Border */}
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/0 to-purple-500/0 group-hover:from-primary/5 group-hover:to-purple-500/5 transition-all duration-300 pointer-events-none" />
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
