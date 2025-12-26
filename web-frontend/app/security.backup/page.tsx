'use client'

import { useState, useEffect } from 'react'
import Header from "@/components/ui/header"
import { Footer } from "@/components/landing/footer"
import { Shield, Lock, Eye, Server, AlertTriangle, CheckCircle, Fingerprint, Key, Database, FileCheck, UserCheck, Smartphone, Globe, AlertCircle, Award, Building } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const securityFeatures = [
    {
        icon: Lock,
        title: '256-Bit SSL Encryption',
        description: 'Military-grade encryption protects all data transmitted between your device and our servers, ensuring complete privacy.',
        benefits: ['End-to-end encryption', 'TLS 1.3 protocol', 'Perfect forward secrecy']
    },
    {
        icon: Fingerprint,
        title: 'Multi-Factor Authentication',
        description: 'Multiple authentication layers including 2FA, biometric login, hardware keys, and email verification.',
        benefits: ['SMS & app-based 2FA', 'Biometric authentication', 'Hardware key support']
    },
    {
        icon: Server,
        title: 'Cold Storage Security',
        description: '95% of digital assets stored offline in geographically distributed, military-grade cold storage facilities.',
        benefits: ['Multi-signature wallets', 'Geographic distribution', 'Hardware security modules']
    },
    {
        icon: Eye,
        title: '24/7 Security Monitoring',
        description: 'Advanced AI-powered systems monitor all activity continuously, detecting and preventing threats in real-time.',
        benefits: ['Real-time threat detection', 'Automated response systems', 'Security operations center']
    },
    {
        icon: Database,
        title: 'Segregated Accounts',
        description: 'Client funds held separately in tier-1 bank accounts, completely isolated from company operations.',
        benefits: ['FDIC insured deposits', 'Tier-1 bank custody', 'Daily reconciliation']
    },
    {
        icon: FileCheck,
        title: 'Regular Security Audits',
        description: 'Independent third-party security audits conducted quarterly to ensure highest security standards.',
        benefits: ['Penetration testing', 'Code reviews', 'Vulnerability assessments']
    }
]

const dataProtection = [
    {
        icon: Shield,
        title: 'Data Privacy',
        description: 'Your personal information is protected under strict privacy policies and never shared without consent.',
        points: ['GDPR & CCPA compliant', 'Zero data selling', 'Encrypted storage']
    },
    {
        icon: UserCheck,
        title: 'Identity Verification',
        description: 'KYC/AML procedures protect against fraud while keeping your identity secure and verified.',
        points: ['Secure document upload', 'Encrypted verification', 'Identity protection']
    },
    {
        icon: Database,
        title: 'Backup & Recovery',
        description: 'Multiple redundant backups ensure your data is never lost, with 99.99% uptime guarantee.',
        points: ['Automated backups', 'Geographic redundancy', 'Disaster recovery plan']
    }
]

const certifications = [
    { title: 'ISO 27001 Certified', description: 'Information security management' },
    { title: 'SOC 2 Type II', description: 'Audited security controls' },
    { title: 'PCI DSS Level 1', description: 'Payment card industry compliance' },
    { title: 'FINRA Registered', description: 'Financial regulatory authority' },
    { title: 'SEC Regulated', description: 'Securities and exchange commission' },
    { title: 'GDPR Compliant', description: 'European data protection' }
]

const securityLayers = [
    {
        layer: 'Application Layer',
        features: ['Web application firewall', 'DDoS protection', 'Input validation', 'Session management']
    },
    {
        layer: 'Network Layer',
        features: ['Intrusion detection system', 'Virtual private network', 'Network segmentation', 'Traffic filtering']
    },
    {
        layer: 'Infrastructure Layer',
        features: ['Physical security', 'Access controls', 'Environmental monitoring', 'Redundant systems']
    },
    {
        layer: 'Data Layer',
        features: ['Encryption at rest', 'Encryption in transit', 'Data masking', 'Secure key management']
    }
]

const bestPractices = [
    {
        title: 'Enable Two-Factor Authentication',
        description: 'Add an extra layer of security by requiring a second verification method when logging in.',
        icon: Fingerprint
    },
    {
        title: 'Use Strong Passwords',
        description: 'Create unique, complex passwords with at least 12 characters including numbers and symbols.',
        icon: Key
    },
    {
        title: 'Verify Communications',
        description: 'Always verify emails and messages claiming to be from BXTPRO through official channels.',
        icon: AlertCircle
    },
    {
        title: 'Monitor Account Activity',
        description: 'Regularly review your account activity and set up alerts for unusual transactions.',
        icon: Eye
    },
    {
        title: 'Secure Your Devices',
        description: 'Keep your devices updated with the latest security patches and use antivirus software.',
        icon: Smartphone
    },
    {
        title: 'Use Secure Networks',
        description: 'Avoid public Wi-Fi for trading. Use VPN when accessing your account from public networks.',
        icon: Globe
    }
]

const insuranceInfo = [
    { provider: 'FDIC Insurance', amount: '$250,000', description: 'Per depositor, per bank' },
    { provider: 'SIPC Protection', amount: '$500,000', description: 'Securities investor protection' },
    { provider: 'Excess SIPC', amount: '$150M', description: 'Additional coverage through Lloyd\'s' }
]

export default function SecurityPage() {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    return (
        <>
            <Header />
            <main className="min-h-screen bg-white">
                {/* Hero Section */}
                <section className="relative pt-32 pb-20 bg-gradient-to-b from-gray-50 to-white">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className={`text-center max-w-4xl mx-auto transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-md bg-emerald-50 border border-emerald-200 mb-6">
                                <Shield className="w-4 h-4 text-emerald-600" />
                                <span className="text-sm font-medium text-emerald-700">Bank-Level Security</span>
                            </div>
                            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                                Your Security is
                                <span className="block text-emerald-600 mt-2">
                                    Our Priority
                                </span>
                            </h1>
                            <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
                                We employ multiple layers of institutional-grade security to protect your funds, data, and personal information with the highest standards in the industry.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Trust Bar */}
                <section className="py-12 bg-emerald-600">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-wrap justify-center items-center gap-8 text-white">
                            <div className="flex items-center gap-2">
                                <Shield className="w-5 h-5" />
                                <span className="font-semibold">256-Bit Encryption</span>
                            </div>
                            <div className="hidden sm:block w-px h-6 bg-white/30" />
                            <div className="flex items-center gap-2">
                                <Award className="w-5 h-5" />
                                <span className="font-semibold">ISO 27001 Certified</span>
                            </div>
                            <div className="hidden sm:block w-px h-6 bg-white/30" />
                            <div className="flex items-center gap-2">
                                <Building className="w-5 h-5" />
                                <span className="font-semibold">FDIC Insured</span>
                            </div>
                            <div className="hidden sm:block w-px h-6 bg-white/30" />
                            <div className="flex items-center gap-2">
                                <Eye className="w-5 h-5" />
                                <span className="font-semibold">24/7 Monitoring</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Security Features */}
                <section className="py-20 bg-gray-50">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <span className="text-sm font-semibold text-emerald-600 uppercase tracking-wider">Security Features</span>
                            <h2 className="text-4xl font-bold text-gray-900 mt-3 mb-4">
                                Multi-Layered Protection
                            </h2>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Enterprise-grade security infrastructure protecting your assets</p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                            {securityFeatures.map((feature, index) => {
                                const Icon = feature.icon
                                return (
                                    <div
                                        key={index}
                                        className="bg-white p-8 border-2 border-gray-200 hover:border-emerald-400 transition-all group"
                                    >
                                        <div className="w-14 h-14 bg-emerald-100 group-hover:bg-emerald-600 flex items-center justify-center mb-6 transition-colors">
                                            <Icon className="w-7 h-7 text-emerald-600 group-hover:text-white transition-colors" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-3">
                                            {feature.title}
                                        </h3>
                                        <p className="text-gray-600 mb-4 leading-relaxed text-sm">
                                            {feature.description}
                                        </p>
                                        <ul className="space-y-2">
                                            {feature.benefits.map((benefit, i) => (
                                                <li key={i} className="flex items-start gap-2 text-gray-700 text-sm">
                                                    <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                                                    <span>{benefit}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </section>

                {/* Security Layers */}
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <span className="text-sm font-semibold text-emerald-600 uppercase tracking-wider">Defense In Depth</span>
                            <h2 className="text-4xl font-bold text-gray-900 mt-3 mb-4">
                                Four Layers of Security
                            </h2>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Comprehensive protection at every level</p>
                        </div>

                        <div className="max-w-5xl mx-auto space-y-6">
                            {securityLayers.map((layer, index) => (
                                <div key={index} className="bg-gray-50 border-2 border-gray-200 p-8">
                                    <div className="flex items-start gap-6">
                                        <div className="flex-shrink-0">
                                            <div className="w-12 h-12 bg-emerald-600 flex items-center justify-center text-white font-bold text-xl">
                                                {index + 1}
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-2xl font-bold text-gray-900 mb-4">{layer.layer}</h3>
                                            <div className="grid md:grid-cols-2 gap-3">
                                                {layer.features.map((feature, i) => (
                                                    <div key={i} className="flex items-center gap-2">
                                                        <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                                                        <span className="text-gray-700 text-sm">{feature}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Data Protection */}
                <section className="py-20 bg-gray-50">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <span className="text-sm font-semibold text-emerald-600 uppercase tracking-wider">Data Protection</span>
                            <h2 className="text-4xl font-bold text-gray-900 mt-3 mb-4">
                                Your Privacy Matters
                            </h2>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                            {dataProtection.map((item, index) => {
                                const Icon = item.icon
                                return (
                                    <div key={index} className="bg-white border-2 border-gray-200 p-8">
                                        <Icon className="w-10 h-10 text-emerald-600 mb-4" />
                                        <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                                        <p className="text-gray-600 mb-4 text-sm">{item.description}</p>
                                        <ul className="space-y-2">
                                            {item.points.map((point, i) => (
                                                <li key={i} className="flex items-start gap-2 text-gray-700 text-sm">
                                                    <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                                                    <span>{point}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </section>

                {/* Insurance Protection */}
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <span className="text-sm font-semibold text-emerald-600 uppercase tracking-wider">Financial Protection</span>
                            <h2 className="text-4xl font-bold text-gray-900 mt-3 mb-4">
                                Your Funds Are Insured
                            </h2>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Multiple layers of insurance protection</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                            {insuranceInfo.map((insurance, index) => (
                                <div key={index} className="bg-emerald-50 border-2 border-emerald-200 p-8 text-center">
                                    <Shield className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">{insurance.provider}</h3>
                                    <div className="text-4xl font-bold text-emerald-600 mb-2">{insurance.amount}</div>
                                    <p className="text-sm text-gray-600">{insurance.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Certifications */}
                <section className="py-20 bg-gray-50">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <span className="text-sm font-semibold text-emerald-600 uppercase tracking-wider">Compliance & Certifications</span>
                            <h2 className="text-4xl font-bold text-gray-900 mt-3 mb-4">
                                Industry Standards & Compliance
                            </h2>
                            <p className="text-lg text-gray-600">Certified by leading regulatory authorities</p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                            {certifications.map((cert, index) => (
                                <div
                                    key={index}
                                    className="bg-white border-2 border-gray-200 p-6"
                                >
                                    <div className="flex items-start gap-3">
                                        <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
                                        <div>
                                            <h3 className="font-bold text-gray-900 mb-1">{cert.title}</h3>
                                            <p className="text-sm text-gray-600">{cert.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Best Practices */}
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-6xl mx-auto">
                            <div className="bg-orange-50 border-2 border-orange-200 p-8 mb-12">
                                <div className="flex items-start gap-4">
                                    <AlertTriangle className="w-8 h-8 text-orange-600 flex-shrink-0" />
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                            Security Best Practices
                                        </h2>
                                        <p className="text-gray-700">
                                            While we provide world-class security, protecting your account is a shared responsibility. Follow these best practices to keep your account secure.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {bestPractices.map((practice, index) => {
                                    const Icon = practice.icon
                                    return (
                                        <div key={index} className="bg-gray-50 border-2 border-gray-200 p-6">
                                            <Icon className="w-8 h-8 text-emerald-600 mb-4" />
                                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                                                {practice.title}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                {practice.description}
                                            </p>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 bg-gray-900">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-4xl mx-auto text-center">
                            <Shield className="w-16 h-16 text-emerald-500 mx-auto mb-6" />
                            <h2 className="text-4xl font-bold text-white mb-6">
                                Trade with Confidence
                            </h2>
                            <p className="text-lg text-gray-300 mb-8">
                                Your security is our commitment. Start trading on a platform built with security at its core.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link href="/registration">
                                    <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-10">
                                        Open Secure Account
                                    </Button>
                                </Link>
                                <Link href="/contact">
                                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 font-medium px-10">
                                        Contact Security Team
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    )
}
