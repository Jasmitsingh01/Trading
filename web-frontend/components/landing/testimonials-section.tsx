'use client'

import { Star, Quote } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const testimonials = [
    {
        name: "Michael Chen",
        role: "Day Trader",
        avatar: "MC",
        rating: 5,
        content: "The platform's execution speed is incredible. I've been trading for 10 years and this is hands down the best platform I've used. The real-time data and analytics are game-changing."
    },
    {
        name: "Sarah Williams",
        role: "Investment Manager",
        avatar: "SW",
        rating: 5,
        content: "Professional-grade tools at competitive pricing. The mobile app is excellent for monitoring positions on the go. Customer support is responsive and knowledgeable."
    },
    {
        name: "David Rodriguez",
        role: "Forex Trader",
        avatar: "DR",
        rating: 5,
        content: "Best forex spreads in the industry. The platform is reliable, secure, and packed with features. I've recommended it to all my trading colleagues."
    },
    {
        name: "Emily Thompson",
        role: "Crypto Investor",
        avatar: "ET",
        rating: 5,
        content: "Seamless crypto trading experience. The platform makes it easy to diversify across traditional and digital assets. Security features give me peace of mind."
    },
    {
        name: "James Park",
        role: "Portfolio Manager",
        avatar: "JP",
        rating: 5,
        content: "Excellent platform for managing multiple accounts. The analytics and reporting tools are comprehensive. Integration with my accounting software was smooth."
    },
    {
        name: "Lisa Anderson",
        role: "Swing Trader",
        avatar: "LA",
        rating: 5,
        content: "The alert system is fantastic. I never miss an opportunity. The educational resources helped me improve my trading strategy significantly."
    }
]

export function TestimonialsSection() {
    return (
        <section id="testimonials" className="py-24 bg-gray-50">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-sm font-semibold text-emerald-600 uppercase tracking-wide">Testimonials</span>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-4 mb-6">
                        Trusted by Traders Worldwide
                    </h2>
                    <p className="text-lg text-gray-600">
                        Join thousands of satisfied traders who have transformed their trading experience
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {testimonials.map((testimonial, index) => (
                        <Card key={index} className="bg-white border-2 border-gray-100 hover:border-emerald-300 hover:shadow-xl transition-all">
                            <CardContent className="p-6 space-y-4">
                                <Quote className="h-8 w-8 text-emerald-200" />

                                <div className="flex gap-1">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} className="h-5 w-5 fill-emerald-500 text-emerald-500" />
                                    ))}
                                </div>

                                <p className="text-gray-700 leading-relaxed">
                                    "{testimonial.content}"
                                </p>

                                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                                    <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
                                        {testimonial.avatar}
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-900">{testimonial.name}</div>
                                        <div className="text-sm text-gray-600">{testimonial.role}</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Trust Badges */}
                <div className="mt-16 text-center">
                    <p className="text-sm text-gray-600 mb-6">Trusted and Regulated By</p>
                    <div className="flex flex-wrap justify-center items-center gap-8">
                        <div className="px-6 py-3 bg-white border-2 border-gray-200 rounded-xl font-bold text-gray-700">SEC</div>
                        <div className="px-6 py-3 bg-white border-2 border-gray-200 rounded-xl font-bold text-gray-700">FINRA</div>
                        <div className="px-6 py-3 bg-white border-2 border-gray-200 rounded-xl font-bold text-gray-700">FDIC</div>
                        <div className="px-6 py-3 bg-white border-2 border-gray-200 rounded-xl font-bold text-gray-700">FCA</div>
                    </div>
                </div>
            </div>
        </section>
    )
}
