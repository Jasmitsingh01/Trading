// app/contact/page.tsx
'use client'

import { useState, useEffect } from 'react'
import Header from "@/components/ui/header"
import { Footer } from "@/components/landing/footer"
import { Mail, Phone, MapPin, Clock, Send, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

const contactMethods = [
    {
        icon: Mail,
        title: 'Email Us',
        description: 'Our team will respond within 24 hours',
        contact: 'support@tradepro.com',
        color: 'from-blue-500 to-cyan-500'
    },
    {
        icon: Phone,
        title: 'Call Us',
        description: 'Available Monday to Friday, 9AM - 6PM',
        contact: '+1 (555) 123-4567',
        color: 'from-purple-500 to-pink-500'
    },
    {
        icon: MessageCircle,
        title: 'Live Chat',
        description: 'Chat with our support team 24/7',
        contact: 'Start a conversation',
        color: 'from-emerald-500 to-teal-500'
    },
    {
        icon: MapPin,
        title: 'Visit Us',
        description: 'Our headquarters',
        contact: '123 Trading Street, New York, NY 10001',
        color: 'from-orange-500 to-red-500'
    }
]

const faqs = [
    {
        question: 'What are your support hours?',
        answer: 'Our support team is available 24/7 via live chat and email. Phone support is available Monday to Friday, 9AM - 6PM EST.'
    },
    {
        question: 'How quickly will I get a response?',
        answer: 'Live chat responses are typically instant. Email inquiries are answered within 24 hours. Phone calls are answered immediately during business hours.'
    },
    {
        question: 'Do you offer support in other languages?',
        answer: 'Yes! We offer support in English, Spanish, French, German, Chinese, and Japanese.'
    }
]

export default function ContactPage() {
    const [mounted, setMounted] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    })

    useEffect(() => {
        setMounted(true)
    }, [])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Handle form submission
        console.log('Form submitted:', formData)
    }

    return (
        <>
            <Header />
            <main className="min-h-screen bg-slate-950">
                {/* Hero Section */}
                <section className="relative pt-32 pb-20 overflow-hidden">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem]" />
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[128px]" />

                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className={`text-center max-w-4xl mx-auto transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 backdrop-blur-sm mb-6">
                                <MessageCircle className="w-4 h-4 text-blue-400" />
                                <span className="text-sm font-medium text-blue-400">24/7 Support Available</span>
                            </div>
                            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6">
                                Contact Us
                                <span className="block bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text mt-2">
                                    Let's Get in Touch
                                </span>
                            </h1>
                            <p className="text-xl text-slate-400 leading-relaxed">
                                Have questions? We're here to help 24/7
                            </p>
                        </div>
                    </div>
                </section>

                {/* Contact Methods */}
                <section className="py-24 relative">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                            {contactMethods.map((method, index) => {
                                const Icon = method.icon
                                return (
                                    <div
                                        key={index}
                                        className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-800 hover:border-blue-500/50 transition-all duration-300 hover:scale-105 text-center"
                                    >
                                        <div className={`w-16 h-16 bg-gradient-to-br ${method.color} rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                                            <Icon className="w-8 h-8 text-white" />
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-2">
                                            {method.title}
                                        </h3>
                                        <p className="text-slate-400 text-sm mb-3">
                                            {method.description}
                                        </p>
                                        <p className="text-blue-400 font-semibold">
                                            {method.contact}
                                        </p>
                                    </div>
                                )
                            })}
                        </div>

                        {/* Contact Form */}
                        <div className="max-w-4xl mx-auto">
                            <div className="grid lg:grid-cols-2 gap-12">
                                {/* Form */}
                                <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-800">
                                    <h2 className="text-3xl font-bold text-white mb-6">Send us a Message</h2>
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div>
                                            <label className="block text-slate-300 mb-2 font-medium">Name</label>
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors"
                                                placeholder="Your full name"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-slate-300 mb-2 font-medium">Email</label>
                                            <input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors"
                                                placeholder="your.email@example.com"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-slate-300 mb-2 font-medium">Subject</label>
                                            <input
                                                type="text"
                                                value={formData.subject}
                                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                                className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors"
                                                placeholder="How can we help?"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-slate-300 mb-2 font-medium">Message</label>
                                            <textarea
                                                value={formData.message}
                                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                                rows={5}
                                                className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors resize-none"
                                                placeholder="Tell us more about your inquiry..."
                                                required
                                            />
                                        </div>
                                        <Button
                                            type="submit"
                                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white py-4 rounded-xl shadow-lg transition-all duration-300 hover:scale-105"
                                        >
                                            <Send className="w-5 h-5 mr-2" />
                                            Send Message
                                        </Button>
                                    </form>
                                </div>

                                {/* FAQ */}
                                <div>
                                    <h2 className="text-3xl font-bold text-white mb-6">Quick Answers</h2>
                                    <div className="space-y-4">
                                        {faqs.map((faq, index) => (
                                            <div
                                                key={index}
                                                className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-800"
                                            >
                                                <h3 className="text-lg font-bold text-white mb-2">
                                                    {faq.question}
                                                </h3>
                                                <p className="text-slate-400">
                                                    {faq.answer}
                                                </p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-8 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-6">
                                        <div className="flex items-start gap-4">
                                            <Clock className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
                                            <div>
                                                <h3 className="text-lg font-bold text-white mb-2">
                                                    Support Hours
                                                </h3>
                                                <p className="text-slate-300">
                                                    Live Chat: 24/7<br />
                                                    Phone: Mon-Fri, 9AM - 6PM EST<br />
                                                    Email: Responses within 24 hours
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    )
}
