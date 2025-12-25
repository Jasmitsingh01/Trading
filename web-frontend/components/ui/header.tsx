// components/ui/header.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ChevronDown, Menu, X, Settings, BarChart3, Globe, Info, TrendingUp, FileText, Phone, Shield, Users, Target } from 'lucide-react'

const navigation = {
  company: [
    { name: 'About Us', href: '/about', icon: Info, description: 'The story behind the xbtbroker success' },
    { name: 'Why Choose Us', href: '/why-choose-us', icon: TrendingUp, description: 'Traders and investors choose xbtbroker' },
    { name: 'Security of Funds', href: '/security', icon: Shield, description: 'Your Funds Security is our Top Priority' },
    { name: 'Registration', href: '/registration', icon: FileText, description: 'Our Registration' },
    { name: 'Contact Us', href: '/contact', icon: Phone, description: 'Let\'s get in touch' }
  ],
  trading: [
    { name: 'Trading Platform', href: '/trading-platform', icon: BarChart3, description: 'Advanced tools for professional traders' },
    { name: 'Markets', href: '/markets', icon: Globe, description: 'Explore global markets' }
  ],
  tools: [
    { name: 'Trading Tools', href: '/trading-tools', icon: Settings, description: 'Professional trading utilities' }
  ]
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-900">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
              TradePro
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {/* Company Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setOpenDropdown('company')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button className="flex items-center gap-1 px-4 py-2 text-slate-300 hover:text-white transition-colors">
                Company
                <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === 'company' ? 'rotate-180' : ''}`} />
              </button>
              
              {openDropdown === 'company' && (
                <div className="absolute top-full left-0 w-80 mt-2 bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
                  <div className="p-2">
                    {navigation.company.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-800/50 transition-colors group"
                      >
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <item.icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                            {item.name}
                          </div>
                          <div className="text-xs text-slate-400">
                            {item.description}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Trading Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setOpenDropdown('trading')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button className="flex items-center gap-1 px-4 py-2 text-slate-300 hover:text-white transition-colors">
                Trading
                <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === 'trading' ? 'rotate-180' : ''}`} />
              </button>
              
              {openDropdown === 'trading' && (
                <div className="absolute top-full left-0 w-80 mt-2 bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
                  <div className="p-2">
                    {navigation.trading.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-800/50 transition-colors group"
                      >
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <item.icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                            {item.name}
                          </div>
                          <div className="text-xs text-slate-400">
                            {item.description}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Tools Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setOpenDropdown('tools')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button className="flex items-center gap-1 px-4 py-2 text-slate-300 hover:text-white transition-colors">
                Tools
                <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === 'tools' ? 'rotate-180' : ''}`} />
              </button>
              
              {openDropdown === 'tools' && (
                <div className="absolute top-full left-0 w-80 mt-2 bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
                  <div className="p-2">
                    {navigation.tools.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-800/50 transition-colors group"
                      >
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <item.icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                            {item.name}
                          </div>
                          <div className="text-xs text-slate-400">
                            {item.description}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link href="#pricing" className="px-4 py-2 text-slate-300 hover:text-white transition-colors">
              Promotion
            </Link>
            <Link href="/partnership" className="px-4 py-2 text-slate-300 hover:text-white transition-colors">
              Partnership
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Link href="/auth/login">
              <Button variant="ghost" className="text-slate-300 hover:text-white">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/open-account">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg">
                Open Account
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-slate-300 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-slate-900">
            <div className="space-y-1">
              {[...navigation.company, ...navigation.trading, ...navigation.tools].map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-900/50 rounded-xl transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 mt-4 border-t border-slate-900 space-y-2">
                <Link href="/auth/login" className="block">
                  <Button variant="ghost" className="w-full text-slate-300">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/open-account" className="block">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
                    Open Account
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
