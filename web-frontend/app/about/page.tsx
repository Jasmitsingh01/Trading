'use client'

import { useState, useEffect } from 'react'
import Header from "@/components/ui/header"
import { Footer } from "@/components/landing/footer"
import { Users, Target, Award, TrendingUp, Shield, Globe, ArrowRight, CheckCircle, Zap, Heart, Lightbulb, BarChart3, Clock, Trophy, Building2, Briefcase } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const values = [
  {
    icon: Target,
    title: 'Our Mission',
    description: 'To democratize trading and make financial markets accessible to everyone, everywhere with cutting-edge technology and transparent pricing.',
  },
  {
    icon: Award,
    title: 'Our Vision',
    description: 'To become the world\'s most trusted and innovative trading platform, empowering millions of traders globally.',
  },
  {
    icon: Users,
    title: 'Our Values',
    description: 'Transparency, innovation, security, and customer-centricity guide everything we do. Your success is our success.',
  }
]

const stats = [
  { value: '2020', label: 'Founded', icon: Trophy },
  { value: '150K+', label: 'Active Traders', icon: Users },
  { value: '$2.5B+', label: 'Daily Volume', icon: TrendingUp },
  { value: '150+', label: 'Markets', icon: Globe }
]

const milestones = [
  {
    year: '2020',
    title: 'Company Founded',
    description: 'TradeVault was established with a vision to revolutionize online trading.',
    icon: Lightbulb
  },
  {
    year: '2021',
    title: 'Reached 10K Users',
    description: 'Achieved our first major milestone with 10,000 active traders on the platform.',
    icon: Users
  },
  {
    year: '2022',
    title: 'Global Expansion',
    description: 'Expanded operations to 50+ countries and launched mobile applications.',
    icon: Globe
  },
  {
    year: '2023',
    title: 'Industry Recognition',
    description: 'Awarded "Best Trading Platform" by leading financial publications.',
    icon: Award
  },
  {
    year: '2024',
    title: 'Advanced AI Integration',
    description: 'Launched AI-powered trading analytics and market prediction tools.',
    icon: Zap
  },
  {
    year: '2025',
    title: '150K+ Active Traders',
    description: 'Reached 150,000 active traders with $2.5B+ in daily trading volume.',
    icon: Trophy
  }
]

const team = [
  { name: 'John Anderson', role: 'CEO & Founder', avatar: 'JA', bio: '15+ years in fintech' },
  { name: 'Sarah Mitchell', role: 'CTO', avatar: 'SM', bio: 'Former Google Engineer' },
  { name: 'Michael Chen', role: 'CFO', avatar: 'MC', bio: 'Ex-Goldman Sachs' },
  { name: 'Emily Rodriguez', role: 'Head of Product', avatar: 'ER', bio: 'Product innovation expert' },
  { name: 'David Kim', role: 'Head of Security', avatar: 'DK', bio: 'Cybersecurity specialist' },
  { name: 'Lisa Wang', role: 'Head of Customer Success', avatar: 'LW', bio: '10+ years in support' }
]

const achievements = [
  { icon: Award, title: 'Best Trading Platform 2024', organization: 'FinTech Awards' },
  { icon: Shield, title: 'Top Security Rated', organization: 'Cybersecurity Excellence' },
  { icon: Users, title: 'Highest User Satisfaction', organization: 'TrustPilot 4.8/5' },
  { icon: Globe, title: 'Global Expansion Leader', organization: 'International Finance' }
]

const whyChooseUs = [
  { icon: CheckCircle, title: 'Regulated & Licensed', description: 'Fully compliant with SEC, FINRA, and international regulations' },
  { icon: Shield, title: 'Bank-Level Security', description: '256-bit encryption and multi-factor authentication' },
  { icon: Zap, title: 'Lightning Fast Execution', description: 'Trade execution in under 10 milliseconds' },
  { icon: Heart, title: '24/7 Customer Support', description: 'Dedicated support team always ready to help' },
  { icon: BarChart3, title: 'Advanced Analytics', description: 'Professional-grade tools and real-time data' },
  { icon: Clock, title: 'Instant Withdrawals', description: 'Fast and secure withdrawal processing' }
]

export default function AboutPage() {
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
                <Building2 className="h-4 w-4 text-emerald-600" />
                <span className="text-sm font-medium text-emerald-700">About TradeVault</span>
              </div>
              <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Building the Future of
                <span className="block text-emerald-600 mt-2">
                  Digital Trading
                </span>
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed mb-8 max-w-3xl mx-auto">
                Founded in 2020, TradeVault has grown from a small startup to a leading global trading platform,
                serving over 150,000 active traders across 150+ markets worldwide with institutional-grade infrastructure.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/registration">
                  <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-8">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="border-gray-300 text-black hover:text-black hover:bg-gray-50 font-medium px-8">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-white border-y border-gray-200">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <div key={index} className="text-center">
                    <Icon className="h-6 w-6 text-emerald-600 mx-auto mb-3" />
                    <div className="text-4xl font-bold text-gray-900 mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600 font-medium uppercase tracking-wide">{stat.label}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-sm font-semibold text-emerald-600 uppercase tracking-wider">Our Foundation</span>
              <h2 className="text-4xl font-bold text-gray-900 mt-3 mb-4">
                What Drives Us Forward
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">The principles that guide our decisions and shape our culture</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {values.map((value, index) => {
                const Icon = value.icon
                return (
                  <div
                    key={index}
                    className="bg-white p-8 border border-gray-200 hover:border-emerald-300 transition-all group"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-emerald-100 flex items-center justify-center group-hover:bg-emerald-600 transition-colors">
                        <Icon className="w-6 h-6 text-emerald-600 group-hover:text-white transition-colors" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {value.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Journey/Timeline Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-sm font-semibold text-emerald-600 uppercase tracking-wider">Our Journey</span>
              <h2 className="text-4xl font-bold text-gray-900 mt-3 mb-4">
                Milestones & Achievements
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">From startup to industry leader</p>
            </div>

            <div className="max-w-5xl mx-auto">
              <div className="space-y-12">
                {milestones.map((milestone, index) => {
                  const Icon = milestone.icon
                  const isEven = index % 2 === 0
                  return (
                    <div key={index} className="relative">
                      {/* Timeline line */}
                      {index !== milestones.length - 1 && (
                        <div className="absolute left-8 top-20 w-0.5 h-full bg-gray-200 -ml-px" />
                      )}

                      <div className="flex gap-8">
                        <div className="flex-shrink-0">
                          <div className="w-16 h-16 bg-emerald-600 flex items-center justify-center relative z-10 shadow-sm">
                            <Icon className="h-7 w-7 text-white" />
                          </div>
                        </div>
                        <div className="flex-1 pt-2">
                          <div className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-bold mb-3">
                            {milestone.year}
                          </div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">{milestone.title}</h3>
                          <p className="text-gray-600 leading-relaxed">{milestone.description}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-sm font-semibold text-emerald-600 uppercase tracking-wider">Why Choose Us</span>
              <h2 className="text-4xl font-bold text-gray-900 mt-3 mb-4">
                Built for Professional Traders
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">Enterprise-grade infrastructure and tools</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {whyChooseUs.map((item, index) => {
                const Icon = item.icon
                return (
                  <div
                    key={index}
                    className="bg-white p-6 border border-gray-200 hover:border-emerald-300 transition-all group"
                  >
                    <Icon className="h-8 w-8 text-emerald-600 mb-4" />
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Achievements Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-sm font-semibold text-emerald-600 uppercase tracking-wider">Industry Recognition</span>
              <h2 className="text-4xl font-bold text-gray-900 mt-3 mb-4">
                Awards & Accolades
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">Recognized by leading financial institutions</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {achievements.map((achievement, index) => {
                const Icon = achievement.icon
                return (
                  <div
                    key={index}
                    className="text-center p-8 bg-gray-50 border border-gray-200 hover:border-emerald-300 transition-all"
                  >
                    <div className="w-14 h-14 bg-emerald-600 flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2 text-sm">{achievement.title}</h3>
                    <p className="text-xs text-gray-600 uppercase tracking-wide">{achievement.organization}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-sm font-semibold text-emerald-600 uppercase tracking-wider">Leadership Team</span>
              <h2 className="text-4xl font-bold text-gray-900 mt-3 mb-4">
                Meet Our Executive Team
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">Industry veterans with decades of combined experience</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {team.map((member, index) => (
                <div
                  key={index}
                  className="bg-white p-8 border border-gray-200 hover:border-emerald-300 transition-all group"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-20 h-20 bg-emerald-600 flex items-center justify-center text-white text-2xl font-bold">
                      {member.avatar}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {member.name}
                      </h3>
                      <p className="text-emerald-600 font-medium text-sm">{member.role}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 border-t border-gray-200 pt-4">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gray-900 relative overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                Ready to Start Trading?
              </h2>
              <p className="text-lg text-gray-300 mb-8">
                Join 150,000+ traders who trust TradeVault for their investments
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/registration">
                  <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-8">
                    Open Free Account
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 font-medium px-8">
                    Contact Sales
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
