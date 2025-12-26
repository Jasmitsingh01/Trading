'use client'

import Link from 'next/link'
import { ArrowRight, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

const benefits = [
    'No minimum deposit required',
    'Zero commission on stock trades',
    'Advanced trading tools included',
    '24/7 customer support',
    'Bank-level security',
    'Mobile app access'
]

export function CTASection() {
    return (
        <section className="py-24 bg-gradient-to-br from-emerald-600 to-emerald-700 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-4xl mx-auto text-center space-y-8">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
                        Ready to Start Trading?
                    </h2>
                    <p className="text-xl text-emerald-50 max-w-2xl mx-auto">
                        Join thousands of traders who trust TradeVault for their investment needs. Open your free account today and start trading in minutes.
                    </p>

                    {/* Benefits Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 py-8">
                        {benefits.map((benefit, index) => (
                            <div key={index} className="flex items-center gap-2 text-white">
                                <CheckCircle className="h-5 w-5 text-emerald-200 flex-shrink-0" />
                                <span className="text-sm font-medium">{benefit}</span>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <Link href="/registration">
                            <Button size="lg" className="h-14 px-10 bg-white hover:bg-gray-100 text-emerald-600 text-base font-bold group shadow-xl">
                                Open Free Account
                                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                        <Link href="/auth/login">
                            <Button size="lg" variant="outline" className="h-14 px-10 bg-transparent border-2 border-white text-white hover:bg-white/10 text-base font-bold">
                                Sign In to Your Account
                            </Button>
                        </Link>
                    </div>

                    <p className="text-sm text-emerald-100 pt-4">
                        No credit card required • Free forever • Cancel anytime
                    </p>
                </div>
            </div>
        </section>
    )
}
