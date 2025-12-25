'use client'

import { ReactNode } from 'react'

interface AuthLayoutProps {
    children: ReactNode
    title: string
    subtitle: string
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
    return (
        <div className="min-h-screen flex">
            {/* Left Side - Form */}
            <div className="flex-1 flex items-center justify-center p-8 relative overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5" />
                <div className="absolute top-20 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />

                {/* Form Container */}
                <div className="relative w-full max-w-md">
                    <div className="glass-card p-8 rounded-2xl shadow-2xl border border-white/20">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                                {title}
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                {subtitle}
                            </p>
                        </div>

                        {/* Content */}
                        {children}
                    </div>

                    {/* Footer */}
                    <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
                        Protected by enterprise-grade security
                    </p>
                </div>
            </div>

            {/* Right Side - Visual */}
            <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary via-purple-600 to-pink-600 relative overflow-hidden">
                {/* Animated Shapes */}
                <div className="absolute inset-0">
                    <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-2xl animate-float" />
                    <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-white/10 rounded-full blur-2xl animate-float delay-2000" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" />
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center justify-center text-white p-12">
                    <div className="max-w-lg text-center">
                        <h2 className="text-4xl font-bold mb-6">
                            Welcome to Trading Platform
                        </h2>
                        <p className="text-xl text-white/90 mb-8">
                            Manage your trading operations with powerful analytics and real-time insights.
                        </p>
                        <div className="grid grid-cols-3 gap-6 mt-12">
                            {[
                                { label: 'Active Traders', value: '10K+' },
                                { label: 'Daily Volume', value: '$50M+' },
                                { label: 'Uptime', value: '99.9%' },
                            ].map((stat) => (
                                <div key={stat.label} className="glass-card p-4 rounded-xl">
                                    <div className="text-2xl font-bold">{stat.value}</div>
                                    <div className="text-sm text-white/80">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
