// app/about/page.tsx
'use client'

import { useState, useEffect } from 'react'
import Header from "@/components/ui/header"
import { Footer } from "@/components/landing/footer"
import { Users, Target, Award, TrendingUp, Shield, Globe, ArrowRight } from 'lucide-react'

const values = [
  {
    icon: Target,
    title: 'Our Mission',
    description: 'To democratize trading and make financial markets accessible to everyone, everywhere.',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Award,
    title: 'Our Vision',
    description: 'To become the world\'s most trusted and innovative trading platform.',
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: Users,
    title: 'Our Values',
    description: 'Transparency, innovation, security, and customer-centricity guide everything we do.',
    color: 'from-emerald-500 to-teal-500'
  }
]

const stats = [
  { value: '2020', label: 'Founded' },
  { value: '150K+', label: 'Active Users' },
  { value: '$2.5B+', label: 'Trading Volume' },
  { value: '50+', label: 'Countries' }
]

const team = [
  { name: 'John Anderson', role: 'CEO & Founder', avatar: 'JA', color: 'from-blue-500 to-cyan-500' },
  { name: 'Sarah Mitchell', role: 'CTO', avatar: 'SM', color: 'from-purple-500 to-pink-500' },
  { name: 'Michael Chen', role: 'CFO', avatar: 'MC', color: 'from-emerald-500 to-teal-500' },
  { name: 'Emily Rodriguez', role: 'Head of Product', avatar: 'ER', color: 'from-orange-500 to-red-500' }
]

export default function AboutPage() {
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
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[128px]" />

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className={`text-center max-w-4xl mx-auto transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 backdrop-blur-sm mb-6">
                <span className="text-sm font-medium text-blue-400">About TradePro</span>
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6">
                The Story Behind the
                <span className="block bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text mt-2">
                  XBT Broker Success
                </span>
              </h1>
              <p className="text-xl text-slate-400 leading-relaxed">
                Founded in 2020, TradePro has grown from a small startup to a leading global trading platform, 
                serving over 150,000 active traders across 50+ countries.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 relative">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="text-center p-6 bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800"
                >
                  <div className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text mb-2">
                    {stat.value}
                  </div>
                  <div className="text-slate-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-24 relative">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                Our Core Values
              </h2>
              <p className="text-xl text-slate-400">What drives us every day</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {values.map((value, index) => {
                const Icon = value.icon
                return (
                  <div
                    key={index}
                    className="relative group"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-r ${value.color} opacity-0 group-hover:opacity-20 rounded-2xl blur-xl transition-opacity duration-500`} />
                    <div className="relative h-full bg-slate-900/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-800 hover:border-blue-500/50 transition-all duration-300 hover:scale-105">
                      <div className={`w-16 h-16 bg-gradient-to-br ${value.color} rounded-xl flex items-center justify-center mb-6 shadow-lg`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-3">
                        {value.title}
                      </h3>
                      <p className="text-slate-400 leading-relaxed">
                        {value.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-24 bg-slate-900 relative">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                Meet Our Team
              </h2>
              <p className="text-xl text-slate-400">The people behind TradePro</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {team.map((member, index) => (
                <div
                  key={index}
                  className="text-center group"
                >
                  <div className="relative mb-4">
                    <div className={`w-32 h-32 mx-auto bg-gradient-to-br ${member.color} rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      {member.avatar}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">
                    {member.name}
                  </h3>
                  <p className="text-slate-400">{member.role}</p>
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
