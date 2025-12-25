'use client'

import Link from 'next/link'
import { ArrowRight, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function HeroSection() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
            {/* Animated Background - matching login page */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5" />
            <div className="absolute top-20 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />

            {/* Content */}
            <div className="relative z-10 container mx-auto px-6">
                <div className="max-w-4xl mx-auto text-center space-y-8">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-primary/20 bg-card/50 backdrop-blur-sm animate-fade-in">
                        <TrendingUp className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">Professional Trading Platform</span>
                    </div>

                    {/* Main Heading with gradient text - matching login page */}
                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight animate-slide-up delay-100">
                        <span className="bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
                            Trade Smarter
                        </span>
                        <br />
                        <span className="text-foreground">
                            with Advanced Analytics
                        </span>
                    </h1>

                    {/* Subheading */}
                    <p className="text-xl sm:text-2xl text-muted-foreground max-w-2xl mx-auto animate-slide-up delay-200">
                        Experience professional-grade trading tools with real-time data,
                        advanced charting, and intelligent automation.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up delay-300">
                        <Button
                            asChild
                            size="lg"
                            className="h-12 px-8 text-base border-2 border-primary group"
                        >
                            <Link href="/auth/register">
                                Get Started Free
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            size="lg"
                            className="h-12 px-8 text-base"
                        >
                            <Link href="/auth/login">
                                Sign In
                            </Link>
                        </Button>
                    </div>

                    {/* Stats Preview */}
                    <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-12 animate-fade-in delay-500">
                        <div className="text-center">
                            <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                                99.9%
                            </div>
                            <div className="text-muted-foreground text-sm mt-2">Uptime</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                                50K+
                            </div>
                            <div className="text-muted-foreground text-sm mt-2">Active Traders</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                                $5B+
                            </div>
                            <div className="text-muted-foreground text-sm mt-2">Volume Traded</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                <div className="w-6 h-10 rounded-full border-2 border-primary/30 flex items-start justify-center p-2">
                    <div className="w-1 h-3 bg-primary/50 rounded-full" />
                </div>
            </div>
        </section>
    )
}
