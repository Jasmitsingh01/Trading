'use client'

import { TrendingUp, Shield, Zap, BarChart3, Globe, Bell, Smartphone, Lock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const features = [
    {
        icon: <TrendingUp className="h-7 w-7" />,
        title: "Real-Time Market Data",
        description: "Access live prices, charts, and institutional-grade market data with millisecond precision."
    },
    {
        icon: <BarChart3 className="h-7 w-7" />,
        title: "Advanced Analytics",
        description: "Professional charting tools, technical indicators, and AI-powered market insights."
    },
    {
        icon: <Shield className="h-7 w-7" />,
        title: "Bank-Level Security",
        description: "256-bit encryption, multi-factor authentication, and cold storage for maximum security."
    },
    {
        icon: <Globe className="h-7 w-7" />,
        title: "Global Markets",
        description: "Trade stocks, forex, crypto, and commodities across 150+ markets worldwide."
    },
    {
        icon: <Zap className="h-7 w-7" />,
        title: "Lightning Execution",
        description: "Ultra-fast order execution with direct market access and minimal slippage."
    },
    {
        icon: <Bell className="h-7 w-7" />,
        title: "Smart Alerts",
        description: "Customizable price alerts, news notifications, and portfolio updates in real-time."
    },
    {
        icon: <Smartphone className="h-7 w-7" />,
        title: "Mobile Trading",
        description: "Full-featured iOS and Android apps with seamless cross-device synchronization."
    },
    {
        icon: <Lock className="h-7 w-7" />,
        title: "Regulatory Compliance",
        description: "Fully licensed and regulated by SEC, FINRA, and international authorities."
    }
]

export function FeaturesSection() {
    return (
        <section id="features" className="py-24 bg-white">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-sm font-semibold text-emerald-600 uppercase tracking-wide">Features</span>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-4 mb-6">
                        Enterprise-Grade Trading Platform
                    </h2>
                    <p className="text-lg text-gray-600">
                        Professional tools and infrastructure trusted by thousands of traders worldwide
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <Card
                            key={index}
                            className="bg-white border-2 border-gray-100 hover:border-emerald-300 hover:shadow-xl transition-all duration-300 group cursor-pointer"
                        >
                            <CardContent className="p-6 space-y-4">
                                <div className="h-14 w-14 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                                    {feature.icon}
                                </div>
                                <h3 className="text-lg font-bold text-gray-900">{feature.title}</h3>
                                <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
