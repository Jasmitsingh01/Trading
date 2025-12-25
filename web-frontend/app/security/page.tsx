// app/security/page.tsx
'use client'

import { useState, useEffect } from 'react'
import Header from "@/components/ui/header"
import { Footer } from "@/components/landing/footer"
import { Shield, Lock, Eye, Server, AlertTriangle, CheckCircle, Fingerprint, Key } from 'lucide-react'

const securityFeatures = [
    {
        icon: Lock,
        title: '256-Bit SSL Encryption',
        description: 'All data transmitted between you and our servers is encrypted using bank-level 256-bit SSL encryption.',
        color: 'from-blue-500 to-cyan-500'
    },
    {
        icon: Fingerprint,
        title: 'Two-Factor Authentication',
        description: 'Add an extra layer of security with 2FA, biometric login, and hardware key support.',
        color: 'from-purple-500 to-pink-500'
    },
    {
        icon: Server,
        title: 'Cold Storage',
        description: '95% of crypto assets are stored offline in secure, geographically distributed cold storage.',
        color: 'from-emerald-500 to-teal-500'
    },
    {
        icon: Eye,
        title: '24/7 Monitoring',
        description: 'Our security team monitors all systems around the clock to detect and prevent threats.',
        color: 'from-orange-500 to-red-500'
    },
    {
        icon: Key,
        title: 'Segregated Accounts',
        description: 'Your funds are held in segregated accounts with tier-1 banks and custodians.',
        color: 'from-indigo-500 to-purple-500'
    },
    {
        icon: Shield,
        title: 'Insurance Protection',
        description: 'Your deposits are protected by FDIC insurance up to $250,000.',
        color: 'from-rose-500 to-pink-500'
    }
]

const certifications = [
    'ISO 27001 Certified',
    'SOC 2 Type II Compliant',
    'PCI DSS Level 1',
    'FINRA Registered',
    'SEC Regulated',
    'GDPR Compliant'
]

export default function SecurityPage() {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    return (
        <>
            <Header />
            <main className="min-h-screen bg-slate-950">
                {/* Hero Section */}
                <section className="relative pt-32 pb-20 overflow-hidden">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem]" />
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-[128px]" />

                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className={`text-center max-w-4xl mx-auto transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-sm mb-6">
                                <Shield className="w-4 h-4 text-emerald-400" />
                                <span className="text-sm font-medium text-emerald-400">Bank-Level Security</span>
                            </div>
                            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6">
                                Your Funds Security is
                                <span className="block bg-gradient-to-r from-emerald-400 to-teal-400 text-transparent bg-clip-text mt-2">
                                    Our Top Priority
                                </span>
                            </h1>
                            <p className="text-xl text-slate-400 leading-relaxed">
                                We employ multiple layers of security to protect your funds and personal information
                            </p>
                        </div>
                    </div>
                </section>

                {/* Security Features */}
                <section className="py-24 relative">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {securityFeatures.map((feature, index) => {
                                const Icon = feature.icon
                                return (
                                    <div
                                        key={index}
                                        className="relative group"
                                    >
                                        <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-20 rounded-2xl blur-xl transition-opacity duration-500`} />
                                        <div className="relative h-full bg-slate-900/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-800 hover:border-emerald-500/50 transition-all duration-300 hover:scale-105">
                                            <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-6 shadow-lg`}>
                                                <Icon className="w-8 h-8 text-white" />
                                            </div>
                                            <h3 className="text-2xl font-bold text-white mb-3">
                                                {feature.title}
                                            </h3>
                                            <p className="text-slate-400 leading-relaxed">
                                                {feature.description}
                                            </p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </section>

                {/* Certifications */}
                <section className="py-24 bg-slate-900 relative">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                                Industry Certifications
                            </h2>
                            <p className="text-xl text-slate-400">Trusted and certified by leading authorities</p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
                            {certifications.map((cert, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-3 p-6 bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800"
                                >
                                    <CheckCircle className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                                    <span className="text-white font-semibold">{cert}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Best Practices */}
                <section className="py-24 relative">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-4xl mx-auto bg-slate-900/50 backdrop-blur-sm rounded-3xl p-12 border border-slate-800">
                            <div className="flex items-start gap-6 mb-8">
                                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <AlertTriangle className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-bold text-white mb-4">
                                        Security Best Practices
                                    </h2>
                                    <p className="text-slate-400 mb-6">
                                        While we do everything to keep your account secure, here's how you can help:
                                    </p>
                                </div>
                            </div>

                            <ul className="space-y-4">
                                {[
                                    'Enable two-factor authentication (2FA) on your account',
                                    'Use a strong, unique password and update it regularly',
                                    'Never share your password or 2FA codes with anyone',
                                    'Be wary of phishing emails and only access TradePro through official channels',
                                    'Keep your email account secure as it\'s linked to your trading account',
                                    'Review your account activity regularly and report suspicious transactions'
                                ].map((practice, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                                        <span className="text-slate-300">{practice}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    )
}
