'use client'

import Link from 'next/link'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

const benefits = [
    'No hidden fees or commissions',
    'Free real-time market data',
    'Advanced charting tools included',
    'Cancel anytime, no questions asked'
]

export function CTASection() {
    return (
        <section className="py-24 relative overflow-hidden">
            {/* Background matching login page */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5" />
            <div className="absolute top-20 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />

            <div className="relative z-10 container mx-auto px-6">
                <div className="max-w-4xl mx-auto">
                    {/* Main CTA Card */}
                    <div className="bg-card border-2 border-border rounded-3xl p-12 shadow-2xl backdrop-blur-xl animate-scale-in">
                        <div className="text-center space-y-8">
                            <h2 className="text-4xl sm:text-5xl font-bold">
                                <span className="bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
                                    Ready to Start Trading?
                                </span>
                            </h2>

                            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                                Join our platform today and get access to professional trading tools,
                                real-time analytics, and a supportive community of traders.
                            </p>

                            {/* Benefits List */}
                            <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto text-left">
                                {benefits.map((benefit, index) => (
                                    <div
                                        key={benefit}
                                        className="flex items-center gap-3 animate-slide-up"
                                        style={{ animationDelay: `${index * 100}ms` }}
                                    >
                                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                                        <span className="text-foreground">{benefit}</span>
                                    </div>
                                ))}
                            </div>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                                <Button
                                    asChild
                                    size="lg"
                                    className="h-12 px-10 text-base border-2 border-primary group"
                                >
                                    <Link href="/auth/register">
                                        Create Free Account
                                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </Button>
                                <Button
                                    asChild
                                    variant="outline"
                                    size="lg"
                                    className="h-12 px-10 text-base"
                                >
                                    <Link href="/auth/login">
                                        Sign In
                                    </Link>
                                </Button>
                            </div>

                            {/* Trust Badge */}
                            <p className="text-sm text-muted-foreground">
                                🔒 Secure & encrypted • 💳 No credit card required
                            </p>
                        </div>
                    </div>

                    {/* Bottom Text */}
                    <div className="mt-12 text-center animate-fade-in delay-500">
                        <p className="text-muted-foreground">
                            Have questions?{' '}
                            <Link href="/contact" className="text-primary font-semibold hover:underline">
                                Contact our support team
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}
