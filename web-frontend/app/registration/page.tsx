// app/registration/page.tsx
'use client'

import { useState, useEffect } from 'react'
import Header from "@/components/ui/header"
import { Footer } from "@/components/landing/footer"
import { FileText, CheckCircle, ArrowRight, Upload, User, Mail, Phone, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'

const steps = [
  {
    number: '01',
    title: 'Personal Information',
    description: 'Provide your basic details',
    icon: User
  },
  {
    number: '02',
    title: 'Verification',
    description: 'Verify your identity',
    icon: CheckCircle
  },
  {
    number: '03',
    title: 'Account Setup',
    description: 'Configure your account',
    icon: FileText
  }
]

const requirements = [
  'Valid government-issued ID (passport, driver\'s license, or national ID)',
  'Proof of address (utility bill, bank statement, or rental agreement)',
  'Must be 18 years or older',
  'Valid email address and phone number',
  'Residential address in a supported country'
]

const benefits = [
  { icon: CheckCircle, text: 'Instant account activation', color: 'text-blue-400' },
  { icon: CheckCircle, text: 'No minimum deposit required', color: 'text-purple-400' },
  { icon: CheckCircle, text: 'Full access to all features', color: 'text-emerald-400' },
  { icon: CheckCircle, text: 'Priority customer support', color: 'text-orange-400' }
]

export default function RegistrationPage() {
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
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[128px]" />

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className={`text-center max-w-4xl mx-auto transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 backdrop-blur-sm mb-6">
                <FileText className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium text-blue-400">Quick & Easy Registration</span>
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6">
                Our Registration
                <span className="block bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text mt-2">
                  Process
                </span>
              </h1>
              <p className="text-xl text-slate-400 leading-relaxed">
                Create your account in minutes and start trading today
              </p>
            </div>
          </div>
        </section>

        {/* Steps Section */}
        <section className="py-24 relative">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {steps.map((step, index) => {
                const Icon = step.icon
                return (
                  <div key={index} className="relative">
                    {/* Connection Line */}
                    {index < steps.length - 1 && (
                      <div className="hidden md:block absolute top-16 -right-4 w-8 h-0.5 bg-gradient-to-r from-blue-500 to-transparent" />
                    )}

                    <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-800 hover:border-blue-500/50 transition-all duration-300 hover:scale-105">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        <div className="text-5xl font-bold text-slate-800">{step.number}</div>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-3">
                        {step.title}
                      </h3>
                      <p className="text-slate-400">
                        {step.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Requirements Section */}
        <section className="py-24 bg-slate-900 relative">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                  What You'll Need
                </h2>
                <p className="text-xl text-slate-400">Have these documents ready before you start</p>
              </div>

              <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-800">
                <ul className="space-y-4">
                  {requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-slate-300 text-lg">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-24 relative">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-12">
                What You Get After Registration
              </h2>

              <div className="grid md:grid-cols-2 gap-6 mb-12">
                {benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-6 bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800"
                  >
                    <benefit.icon className={`w-8 h-8 ${benefit.color} flex-shrink-0`} />
                    <span className="text-white text-lg font-semibold">{benefit.text}</span>
                  </div>
                ))}
              </div>

              <a href="/auth/register">
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-12 py-7 text-lg rounded-2xl shadow-2xl shadow-blue-500/50 transition-all duration-300 hover:scale-105"
                >
                  Start Registration Now
                  <ArrowRight className="ml-2 w-6 h-6" />
                </Button>
              </a>

              <p className="mt-6 text-slate-400">
                Already have an account?{' '}
                <a href="/auth/login" className="text-blue-400 hover:text-blue-300 font-semibold">
                  Sign in here
                </a>
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
