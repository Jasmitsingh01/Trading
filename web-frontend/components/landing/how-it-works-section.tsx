// components/landing/how-it-works-section.tsx
'use client'

import { useState, useEffect } from 'react'
import { UserPlus, Wallet, TrendingUp, DollarSign, ArrowRight } from 'lucide-react'

const steps = [
    {
        icon: UserPlus,
        title: 'Create Your Account',
        description: 'Sign up in minutes with just your email. No credit card required to get started.',
        color: 'from-blue-500 to-cyan-500',
        step: '01'
    },
    {
        icon: Wallet,
        title: 'Fund Your Account',
        description: 'Deposit funds securely using multiple payment methods. Start with as little as $10.',
        color: 'from-purple-500 to-pink-500',
        step: '02'
    },
    {
        icon: TrendingUp,
        title: 'Start Trading',
        description: 'Access stocks, crypto, forex, and commodities. Execute trades with one click.',
        color: 'from-emerald-500 to-teal-500',
        step: '03'
    },
    {
        icon: DollarSign,
        title: 'Grow Your Wealth',
        description: 'Monitor your portfolio, track performance, and withdraw profits anytime.',
        color: 'from-orange-500 to-red-500',
        step: '04'
    }
]

export function HowItWorksSection() {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    return (
        <section className="py-24 bg-slate-900 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem]" />

            {/* Background Gradients */}
            <div className="absolute top-20 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-20 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px]" />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Section Header */}
                <div className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 backdrop-blur-sm mb-6">
                        <span className="text-sm font-medium text-purple-400">
                            Simple Process
                        </span>
                    </div>
                    <h2 className="text-5xl sm:text-6xl font-bold text-white mb-6">
                        Start Trading in
                        <span className="block bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text mt-2">
                            4 Easy Steps
                        </span>
                    </h2>
                    <p className="text-xl text-slate-400">
                        Join thousands of traders who started their journey with us. Get started in minutes.
                    </p>
                </div>

                {/* Steps Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
                    {steps.map((step, index) => {
                        const Icon = step.icon
                        return (
                            <div
                                key={index}
                                className={`relative transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                                style={{ transitionDelay: `${index * 150}ms` }}
                            >
                                {/* Connection Line */}
                                {index < steps.length - 1 && (
                                    <div className="hidden lg:block absolute top-20 -right-4 w-8 h-0.5 bg-gradient-to-r from-slate-700 to-transparent" />
                                )}

                                {/* Glow Effect */}
                                <div className={`absolute inset-0 bg-gradient-to-r ${step.color} opacity-0 group-hover:opacity-20 rounded-2xl blur-xl transition-opacity duration-500`} />

                                {/* Card */}
                                <div className="relative h-full bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-800 hover:border-blue-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl group">
                                    {/* Step Number */}
                                    <div className="absolute -top-4 -right-4 w-14 h-14 bg-gradient-to-br from-slate-800 to-slate-700 border border-slate-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-xl group-hover:scale-110 transition-transform">
                                        {step.step}
                                    </div>

                                    {/* Icon */}
                                    <div className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-xl flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                        <Icon className="w-8 h-8 text-white" />
                                    </div>

                                    {/* Content */}
                                    <h3 className="text-xl font-bold text-white mb-3">
                                        {step.title}
                                    </h3>
                                    <p className="text-slate-400 text-sm leading-relaxed">
                                        {step.description}
                                    </p>

                                    {/* Hover Arrow */}
                                    <div className="mt-4 flex items-center gap-2 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <span className={`bg-gradient-to-r ${step.color} text-transparent bg-clip-text`}>
                                            Learn more
                                        </span>
                                        <ArrowRight className="w-4 h-4 text-blue-400 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Bottom CTA */}
                <div className={`text-center mt-16 transition-all duration-1000 delay-600 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
                    <p className="text-slate-400 mb-6 text-lg">
                        Ready to get started?
                    </p>
                    <a
                        href="/auth/register"
                        className="inline-flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold text-lg rounded-2xl shadow-2xl shadow-blue-500/50 transition-all duration-300 hover:scale-105"
                    >
                        Create Free Account
                        <ArrowRight className="w-5 h-5" />
                    </a>
                </div>
            </div>
        </section>
    )
}
