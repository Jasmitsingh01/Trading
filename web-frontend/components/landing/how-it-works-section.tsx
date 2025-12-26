'use client'

import { UserPlus, CreditCard, TrendingUp, DollarSign } from 'lucide-react'

const steps = [
    {
        number: "01",
        icon: <UserPlus className="h-8 w-8" />,
        title: "Create Your Account",
        description: "Sign up in minutes with email verification. Complete KYC for full trading access and enhanced limits."
    },
    {
        number: "02",
        icon: <CreditCard className="h-8 w-8" />,
        title: "Fund Your Account",
        description: "Deposit via bank transfer, card, or crypto. Instant processing with no minimum deposit requirement."
    },
    {
        number: "03",
        icon: <TrendingUp className="h-8 w-8" />,
        title: "Start Trading",
        description: "Access global markets with our intuitive platform. Execute trades with professional-grade tools."
    },
    {
        number: "04",
        icon: <DollarSign className="h-8 w-8" />,
        title: "Grow Your Wealth",
        description: "Monitor performance with real-time analytics. Withdraw profits anytime with zero restrictions."
    }
]

export function HowItWorksSection() {
    return (
        <section id="how-it-works" className="py-24 bg-gray-50">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-sm font-semibold text-emerald-600 uppercase tracking-wide">How It Works</span>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-4 mb-6">
                        Start Trading in 4 Simple Steps
                    </h2>
                    <p className="text-lg text-gray-600">
                        From registration to your first trade in under 10 minutes
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {steps.map((step, index) => (
                        <div key={index} className="relative">
                            <div className="bg-white border-2 border-gray-100 rounded-2xl p-8 hover:border-emerald-300 hover:shadow-xl transition-all duration-300 h-full">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="text-5xl font-bold text-emerald-100">{step.number}</div>
                                    <div className="h-14 w-14 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-lg">
                                        {step.icon}
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{step.description}</p>
                            </div>
                            {index < steps.length - 1 && (
                                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-emerald-300 to-transparent z-10" />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
