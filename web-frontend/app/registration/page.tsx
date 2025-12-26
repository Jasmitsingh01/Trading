'use client'

import { useState, useEffect } from 'react'
import Header from "@/components/ui/header"
import { Footer } from "@/components/landing/footer"
import { FileText, CheckCircle, ArrowRight, Upload, User, Mail, Phone, MapPin, Shield, Clock, Award, CreditCard, Smartphone, Globe, AlertCircle, HelpCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const steps = [
  {
    number: '01',
    title: 'Create Account',
    description: 'Enter your basic information',
    icon: User,
    details: ['Full name', 'Email address', 'Password', 'Phone number'],
    time: '2 minutes'
  },
  {
    number: '02',
    title: 'Verify Identity',
    description: 'Upload required documents',
    icon: Shield,
    details: ['Government ID', 'Proof of address', 'Selfie verification', 'Tax information'],
    time: '5 minutes'
  },
  {
    number: '03',
    title: 'Fund Account',
    description: 'Make your first deposit',
    icon: CreditCard,
    details: ['Bank transfer', 'Credit/debit card', 'Crypto deposit', 'Wire transfer'],
    time: '1 minute'
  },
  {
    number: '04',
    title: 'Start Trading',
    description: 'Access all platform features',
    icon: Award,
    details: ['Advanced tools', 'Real-time data', 'Mobile access', 'Expert support'],
    time: 'Instant'
  }
]

const requirements = [
  {
    icon: User,
    title: 'Personal Information',
    items: ['Full legal name', 'Date of birth (18+)', 'Nationality', 'Residential address']
  },
  {
    icon: FileText,
    title: 'Identity Verification',
    items: ['Valid government ID', 'Passport or driver\'s license', 'National ID card', 'High-quality photo/scan']
  },
  {
    icon: MapPin,
    title: 'Proof of Address',
    items: ['Utility bill (max 3 months old)', 'Bank statement', 'Rental agreement', 'Government correspondence']
  },
  {
    icon: Mail,
    title: 'Contact Details',
    items: ['Active email address', 'Valid phone number', 'SMS verification capability', 'Email verification']
  }
]

const benefits = [
  { icon: CheckCircle, text: 'Instant account activation', description: 'Start trading immediately after verification' },
  { icon: Shield, text: 'Bank-level security', description: 'Your data protected with 256-bit encryption' },
  { icon: CreditCard, text: 'No minimum deposit', description: 'Open account with zero balance required' },
  { icon: Globe, text: 'Access 150+ markets', description: 'Trade stocks, crypto, forex, and more' },
  { icon: Smartphone, text: 'Mobile & desktop apps', description: 'Trade anywhere with our apps' },
  { icon: Clock, text: '24/7 customer support', description: 'Get help whenever you need it' }
]

const faqs = [
  {
    question: 'How long does registration take?',
    answer: 'The registration process typically takes 5-10 minutes. Identity verification is usually completed within 24 hours, but can be instant in many cases.'
  },
  {
    question: 'What documents do I need?',
    answer: 'You\'ll need a government-issued ID (passport, driver\'s license, or national ID) and proof of address (utility bill, bank statement, or rental agreement) dated within the last 3 months.'
  },
  {
    question: 'Is there a minimum deposit?',
    answer: 'No, there is no minimum deposit required to open an account. However, some trading instruments may have minimum trade sizes.'
  },
  {
    question: 'Which countries are supported?',
    answer: 'We support traders from 150+ countries worldwide. Check our supported countries list or contact our team to confirm if your country is eligible.'
  },
  {
    question: 'Is my personal information secure?',
    answer: 'Yes, we use bank-level 256-bit SSL encryption and comply with GDPR, CCPA, and other data protection regulations. Your information is never shared with third parties.'
  },
  {
    question: 'Can I have multiple accounts?',
    answer: 'Each individual is allowed one personal trading account. However, you can open additional professional or corporate accounts with proper documentation.'
  }
]

const features = [
  { icon: Shield, title: 'Secure Process', description: 'End-to-end encrypted registration' },
  { icon: Clock, title: 'Fast Approval', description: 'Most accounts verified in under 24 hours' },
  { icon: Award, title: 'Fully Regulated', description: 'SEC, FINRA, and international compliance' },
  { icon: Globe, title: 'Global Access', description: 'Available in 150+ countries' }
]

const accountTypes = [
  {
    name: 'Individual Account',
    description: 'Perfect for personal trading and investing',
    features: ['Full platform access', 'No minimum deposit', 'Mobile & web trading', '24/7 support'],
    recommended: true
  },
  {
    name: 'Professional Account',
    description: 'Advanced tools for experienced traders',
    features: ['Higher leverage', 'API access', 'Priority support', 'Advanced analytics'],
    recommended: false
  },
  {
    name: 'Corporate Account',
    description: 'For businesses and institutional clients',
    features: ['Multi-user access', 'Custom solutions', 'Dedicated account manager', 'Volume discounts'],
    recommended: false
  }
]

export default function RegistrationPage() {
  const [mounted, setMounted] = useState(false)
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

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
                <Clock className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-medium text-emerald-700">Account Ready in Minutes</span>
              </div>
              <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Start Your Trading Journey
                <span className="block text-emerald-600 mt-2">
                  Simple Registration Process
                </span>
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto mb-8">
                Open your TradeVault account in just 4 easy steps. Fast, secure, and fully compliant with global regulations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth/open-account">
                  <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-10">
                    Start Registration
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/auth/login">
                  <Button size="lg" variant="outline" className="border-gray-300 text-gray-700 hover:text-gray-900 hover:bg-gray-50 font-medium px-10">
                    Already have an account?
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Bar */}
        <section className="py-12 bg-emerald-600">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <div key={index} className="text-center text-white">
                    <Icon className="w-8 h-8 mx-auto mb-2" />
                    <div className="font-bold text-sm mb-1">{feature.title}</div>
                    <div className="text-xs opacity-90">{feature.description}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Steps Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-sm font-semibold text-emerald-600 uppercase tracking-wider">How It Works</span>
              <h2 className="text-4xl font-bold text-gray-900 mt-3 mb-4">
                4 Simple Steps to Start Trading
              </h2>
              <p className="text-lg text-gray-600">Complete registration in under 10 minutes</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
              {steps.map((step, index) => {
                const Icon = step.icon
                return (
                  <div key={index} className="relative">
                    {/* Connection Line */}
                    {index < steps.length - 1 && (
                      <div className="hidden lg:block absolute top-12 -right-4 w-8 h-0.5 bg-emerald-300 z-0" />
                    )}

                    <div className="bg-white p-6 border-2 border-gray-200 hover:border-emerald-400 transition-all relative z-10">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-emerald-600 flex items-center justify-center">
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-4xl font-bold text-gray-200">{step.number}</div>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {step.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4">
                        {step.description}
                      </p>
                      <div className="flex items-center gap-2 text-emerald-600 text-sm font-semibold mb-4">
                        <Clock className="w-4 h-4" />
                        <span>{step.time}</span>
                      </div>
                      <ul className="space-y-1">
                        {step.details.map((detail, i) => (
                          <li key={i} className="flex items-start gap-2 text-gray-600 text-xs">
                            <CheckCircle className="w-3 h-3 text-emerald-600 flex-shrink-0 mt-0.5" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Requirements Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-sm font-semibold text-emerald-600 uppercase tracking-wider">What You Need</span>
              <h2 className="text-4xl font-bold text-gray-900 mt-3 mb-4">
                Required Documents
              </h2>
              <p className="text-lg text-gray-600">Have these ready to complete your registration quickly</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {requirements.map((req, index) => {
                const Icon = req.icon
                return (
                  <div key={index} className="bg-gray-50 border-2 border-gray-200 p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-emerald-100 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-emerald-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">{req.title}</h3>
                    </div>
                    <ul className="space-y-2">
                      {req.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-gray-700 text-sm">
                          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Account Types */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-sm font-semibold text-emerald-600 uppercase tracking-wider">Choose Your Account</span>
              <h2 className="text-4xl font-bold text-gray-900 mt-3 mb-4">
                Account Types
              </h2>
              <p className="text-lg text-gray-600">Select the account that best fits your needs</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {accountTypes.map((account, index) => (
                <div key={index} className={`bg-white border-2 p-8 relative ${account.recommended ? 'border-emerald-400' : 'border-gray-200'}`}>
                  {account.recommended && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-emerald-600 text-white text-xs font-bold px-3 py-1">RECOMMENDED</span>
                    </div>
                  )}
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{account.name}</h3>
                  <p className="text-gray-600 mb-6">{account.description}</p>
                  <ul className="space-y-3">
                    {account.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-700 text-sm">
                        <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-sm font-semibold text-emerald-600 uppercase tracking-wider">Member Benefits</span>
              <h2 className="text-4xl font-bold text-gray-900 mt-3 mb-4">
                What You Get After Registration
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon
                return (
                  <div key={index} className="bg-gray-50 border-2 border-gray-200 p-6 hover:border-emerald-300 transition-all">
                    <Icon className="w-10 h-10 text-emerald-600 mb-4" />
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{benefit.text}</h3>
                    <p className="text-sm text-gray-600">{benefit.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-sm font-semibold text-emerald-600 uppercase tracking-wider">Have Questions?</span>
              <h2 className="text-4xl font-bold text-gray-900 mt-3 mb-4">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="max-w-3xl mx-auto space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white border-2 border-gray-200">
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-bold text-gray-900">{faq.question}</span>
                    <HelpCircle className={`w-5 h-5 text-emerald-600 transition-transform ${expandedFaq === index ? 'rotate-180' : ''}`} />
                  </button>
                  {expandedFaq === index && (
                    <div className="px-6 pb-6">
                      <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gray-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                Ready to Get Started?
              </h2>
              <p className="text-lg text-gray-300 mb-8">
                Join 150,000+ traders who trust TradeVault. Create your account today.
              </p>
              <Link href="/auth/login">
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-12">
                  Open Your Free Account
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <p className="mt-6 text-gray-400 text-sm">
                No minimum deposit • Instant activation • Full platform access
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
