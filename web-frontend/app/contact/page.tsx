'use client'

import { useState, useEffect } from 'react'
import Header from "@/components/ui/header"
import { Footer } from "@/components/landing/footer"
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, Headphones, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'

const contactMethods = [
    {
        icon: Mail,
        title: 'Email Us',
        description: 'Response within 24 hours',
        contact: 'support@tradevault.com',
        action: 'mailto:support@tradevault.com'
    },
    {
        icon: Phone,
        title: 'Call Us',
        description: 'Mon-Fri, 9AM - 6PM EST',
        contact: '+1 (800) 123-4567',
        action: 'tel:+18001234567'
    },
    {
        icon: MessageCircle,
        title: 'Live Chat',
        description: 'Available 24/7',
        contact: 'Start Chat',
        action: '#chat'
    },
    {
        icon: MapPin,
        title: 'Visit Us',
        description: 'Headquarters',
        contact: '123 Trading St, New York, NY 10001',
        action: '#'
    }
]

const offices = [
    {
        city: 'New York',
        address: '123 Trading Street, NY 10001',
        phone: '+1 (800) 123-4567',
        email: 'ny@tradevault.com'
    },
    {
        city: 'London',
        address: '456 Finance Ave, London EC2N',
        phone: '+44 20 1234 5678',
        email: 'london@tradevault.com'
    },
    {
        city: 'Singapore',
        address: '789 Market Road, Singapore 018956',
        phone: '+65 6123 4567',
        email: 'sg@tradevault.com'
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
        answer: 'Yes! We offer support in English, Spanish, French, German, Chinese, Japanese, and 10+ other languages.'
    },
    {
        question: 'Can I schedule a call with your team?',
        answer: 'Absolutely! You can schedule a call with our support team or sales representatives through our booking system or by contacting us directly.'
    }
]

export default function ContactPage() {
    const [mounted, setMounted] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    })
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 2000))

        console.log('Form submitted:', formData)
        setIsSubmitting(false)

        // Reset form
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
        alert('Thank you! We\'ll get back to you within 24 hours.')
    }

    return (
        <>
            <Header />
            <main className="min-h-screen bg-white">
                {/* Hero Section */}
                <section className="relative pt-32 pb-20 bg-gradient-to-b from-gray-50 to-white">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className={`text-center max-w-4xl mx-auto transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-md bg-emerald-50 border border-emerald-200 mb-6">
                                <Headphones className="w-4 h-4 text-emerald-600" />
                                <span className="text-sm font-medium text-emerald-700">24/7 Support Available</span>
                            </div>
                            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6">
                                Get in Touch
                            </h1>
                            <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
                                Have questions about our platform? Our dedicated support team is here to help you succeed.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Contact Methods */}
                <section className="py-16 bg-white border-b border-gray-200">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                            {contactMethods.map((method, index) => {
                                const Icon = method.icon
                                return (
                                    <a
                                        key={index}
                                        href={method.action}
                                        className="bg-white p-6 border-2 border-gray-200 hover:border-emerald-400 transition-all group text-center"
                                    >
                                        <div className="w-14 h-14 bg-emerald-100 group-hover:bg-emerald-600 flex items-center justify-center mx-auto mb-4 transition-colors">
                                            <Icon className="w-7 h-7 text-emerald-600 group-hover:text-white transition-colors" />
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                                            {method.title}
                                        </h3>
                                        <p className="text-sm text-gray-600 mb-3">
                                            {method.description}
                                        </p>
                                        <p className="text-emerald-600 font-semibold text-sm">
                                            {method.contact}
                                        </p>
                                    </a>
                                )
                            })}
                        </div>
                    </div>
                </section>

                {/* Contact Form and Info */}
                <section className="py-20 bg-gray-50">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-6xl mx-auto">
                            <div className="grid lg:grid-cols-5 gap-12">
                                {/* Form */}
                                <div className="lg:col-span-3">
                                    <div className="bg-white border-2 border-gray-200 p-8">
                                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Send us a Message</h2>
                                        <p className="text-gray-600 mb-8">Fill out the form below and we'll get back to you within 24 hours.</p>

                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-900 mb-2">Full Name *</label>
                                                    <input
                                                        type="text"
                                                        value={formData.name}
                                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                        className="w-full px-4 py-3 border-2 border-gray-300 focus:border-emerald-500 focus:outline-none transition-colors text-gray-900"
                                                        placeholder="John Smith"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-900 mb-2">Email Address *</label>
                                                    <input
                                                        type="email"
                                                        value={formData.email}
                                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                        className="w-full px-4 py-3 border-2 border-gray-300 focus:border-emerald-500 focus:outline-none transition-colors text-gray-900"
                                                        placeholder="john@example.com"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-900 mb-2">Phone Number</label>
                                                    <input
                                                        type="tel"
                                                        value={formData.phone}
                                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                        className="w-full px-4 py-3 border-2 border-gray-300 focus:border-emerald-500 focus:outline-none transition-colors text-gray-900"
                                                        placeholder="+1 (555) 123-4567"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-900 mb-2">Subject *</label>
                                                    <select
                                                        value={formData.subject}
                                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                                        className="w-full px-4 py-3 border-2 border-gray-300 focus:border-emerald-500 focus:outline-none transition-colors text-gray-900"
                                                        required
                                                    >
                                                        <option value="">Select a topic</option>
                                                        <option value="general">General Inquiry</option>
                                                        <option value="support">Technical Support</option>
                                                        <option value="account">Account Issues</option>
                                                        <option value="partnership">Partnership Opportunities</option>
                                                        <option value="feedback">Feedback</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-900 mb-2">Message *</label>
                                                <textarea
                                                    value={formData.message}
                                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                                    rows={6}
                                                    className="w-full px-4 py-3 border-2 border-gray-300 focus:border-emerald-500 focus:outline-none transition-colors resize-none text-gray-900"
                                                    placeholder="Tell us how we can help you..."
                                                    required
                                                />
                                            </div>

                                            <Button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 font-semibold disabled:opacity-50"
                                            >
                                                {isSubmitting ? (
                                                    'Sending...'
                                                ) : (
                                                    <>
                                                        <Send className="w-5 h-5 mr-2" />
                                                        Send Message
                                                    </>
                                                )}
                                            </Button>
                                        </form>
                                    </div>
                                </div>

                                {/* Sidebar Info */}
                                <div className="lg:col-span-2 space-y-6">
                                    {/* Quick Answers */}
                                    <div className="bg-white border-2 border-gray-200 p-6">
                                        <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Answers</h3>
                                        <div className="space-y-4">
                                            {faqs.slice(0, 2).map((faq, index) => (
                                                <div key={index} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                                                    <h4 className="font-semibold text-gray-900 mb-2 text-sm">
                                                        {faq.question}
                                                    </h4>
                                                    <p className="text-sm text-gray-600">
                                                        {faq.answer}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Support Hours */}
                                    <div className="bg-emerald-50 border-2 border-emerald-200 p-6">
                                        <div className="flex items-start gap-3 mb-4">
                                            <Clock className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900 mb-2">
                                                    Support Hours
                                                </h3>
                                                <div className="space-y-2 text-sm text-gray-700">
                                                    <p><strong>Live Chat:</strong> 24/7</p>
                                                    <p><strong>Phone:</strong> Mon-Fri, 9AM - 6PM EST</p>
                                                    <p><strong>Email:</strong> 24 hour response time</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Languages */}
                                    <div className="bg-white border-2 border-gray-200 p-6">
                                        <div className="flex items-start gap-3">
                                            <Globe className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900 mb-2">
                                                    Multilingual Support
                                                </h3>
                                                <p className="text-sm text-gray-600">
                                                    We offer support in 15+ languages including English, Spanish, French, German, Chinese, and Japanese.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Global Offices */}
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <span className="text-sm font-semibold text-emerald-600 uppercase tracking-wider">Global Presence</span>
                            <h2 className="text-4xl font-bold text-gray-900 mt-3 mb-4">
                                Our Offices Worldwide
                            </h2>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Visit us at any of our global locations</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                            {offices.map((office, index) => (
                                <div key={index} className="bg-gray-50 border-2 border-gray-200 p-6 hover:border-emerald-300 transition-all">
                                    <MapPin className="w-8 h-8 text-emerald-600 mb-4" />
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">{office.city}</h3>
                                    <div className="space-y-2 text-sm text-gray-600">
                                        <p>{office.address}</p>
                                        <p className="font-semibold text-gray-900">{office.phone}</p>
                                        <p className="text-emerald-600">{office.email}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FAQs */}
                <section className="py-20 bg-gray-50">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <span className="text-sm font-semibold text-emerald-600 uppercase tracking-wider">FAQs</span>
                            <h2 className="text-4xl font-bold text-gray-900 mt-3 mb-4">
                                Frequently Asked Questions
                            </h2>
                        </div>

                        <div className="max-w-3xl mx-auto space-y-4">
                            {faqs.map((faq, index) => (
                                <div key={index} className="bg-white border-2 border-gray-200 p-6">
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                                        {faq.question}
                                    </h3>
                                    <p className="text-gray-600">
                                        {faq.answer}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    )
}
