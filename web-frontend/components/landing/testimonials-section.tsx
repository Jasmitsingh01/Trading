// components/landing/testimonials-section.tsx
'use client'

import { useState, useEffect } from 'react'
import { Star, Quote } from 'lucide-react'

const testimonials = [
    {
        name: 'Sarah Johnson',
        role: 'Day Trader',
        avatar: 'SJ',
        rating: 5,
        content: 'The best trading platform I\'ve used. Fast execution, great charts, and excellent customer support. Made $50K in profits last quarter!',
        color: 'from-blue-500 to-cyan-500'
    },
    {
        name: 'Michael Chen',
        role: 'Crypto Investor',
        avatar: 'MC',
        rating: 5,
        content: 'Finally, a platform that combines stocks and crypto seamlessly. The real-time data and analytics tools are game-changers for my portfolio.',
        color: 'from-purple-500 to-pink-500'
    },
    {
        name: 'Emily Rodriguez',
        role: 'Swing Trader',
        avatar: 'ER',
        rating: 5,
        content: 'As a beginner, I appreciated the intuitive interface and educational resources. Now I\'m trading confidently and seeing consistent returns.',
        color: 'from-emerald-500 to-teal-500'
    },
    {
        name: 'David Kim',
        role: 'Portfolio Manager',
        avatar: 'DK',
        rating: 5,
        content: 'Professional-grade tools at a fraction of the cost. The mobile app is perfect for managing my portfolio on the go. Highly recommend!',
        color: 'from-orange-500 to-red-500'
    },
    {
        name: 'Jessica Taylor',
        role: 'Forex Trader',
        avatar: 'JT',
        rating: 5,
        content: 'The forex market coverage is exceptional. Low spreads, fast execution, and 24/7 support make this my go-to platform for currency trading.',
        color: 'from-indigo-500 to-purple-500'
    },
    {
        name: 'Robert Martinez',
        role: 'Long-term Investor',
        avatar: 'RM',
        rating: 5,
        content: 'Zero commissions and fractional shares let me diversify my portfolio without breaking the bank. Perfect for building wealth steadily.',
        color: 'from-rose-500 to-pink-500'
    }
]

export function TestimonialsSection() {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    return (
        <section className="py-24 bg-slate-900 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem]" />

            {/* Background Gradients */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] animate-pulse" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] animate-pulse delay-1000" />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Section Header */}
                <div className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 backdrop-blur-sm mb-6">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm font-medium text-yellow-400">
                            4.9/5 Average Rating
                        </span>
                    </div>
                    <h2 className="text-5xl sm:text-6xl font-bold text-white mb-6">
                        Loved by Traders
                        <span className="block bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text mt-2">
                            Around the World
                        </span>
                    </h2>
                    <p className="text-xl text-slate-400">
                        Don't just take our word for it. Here's what our users have to say.
                    </p>
                </div>

                {/* Testimonials Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className={`relative group transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                            style={{ transitionDelay: `${index * 100}ms` }}
                        >
                            {/* Glow Effect */}
                            <div className={`absolute inset-0 bg-gradient-to-r ${testimonial.color} opacity-0 group-hover:opacity-20 rounded-2xl blur-xl transition-opacity duration-500`} />

                            {/* Card */}
                            <div className="relative h-full bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-800 hover:border-blue-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                                {/* Quote Icon */}
                                <div className="absolute -top-3 -left-3 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                                    <Quote className="w-6 h-6 text-white" />
                                </div>

                                {/* Rating Stars */}
                                <div className="flex gap-1 mb-4 mt-2">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                                    ))}
                                </div>

                                {/* Content */}
                                <p className="text-slate-300 mb-6 leading-relaxed">
                                    "{testimonial.content}"
                                </p>

                                {/* Author */}
                                <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
                                    <div className={`w-14 h-14 bg-gradient-to-br ${testimonial.color} rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                                        {testimonial.avatar}
                                    </div>
                                    <div>
                                        <div className="font-bold text-white">
                                            {testimonial.name}
                                        </div>
                                        <div className="text-sm text-slate-400">
                                            {testimonial.role}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom Stats */}
                <div className={`grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-16 transition-all duration-1000 delay-700 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="text-center p-6 bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800">
                        <div className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 text-transparent bg-clip-text mb-2">150K+</div>
                        <div className="text-slate-400">Happy Traders</div>
                    </div>
                    <div className="text-center p-6 bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800">
                        <div className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text mb-2">4.9/5</div>
                        <div className="text-slate-400">Average Rating</div>
                    </div>
                    <div className="text-center p-6 bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800">
                        <div className="text-5xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 text-transparent bg-clip-text mb-2">98%</div>
                        <div className="text-slate-400">Satisfaction Rate</div>
                    </div>
                </div>
            </div>
        </section>
    )
}
