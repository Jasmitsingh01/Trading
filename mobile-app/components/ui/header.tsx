'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'

const companyMenuItems = [
  { icon: '👋', title: 'About Us', description: 'The story behind the xbtbroker success', href: '/about' },
  { icon: '🎯', title: 'Why Choose Us', description: 'Traders and investors choose xbtbroker', href: '/why-choose-us' },
  { icon: '🔒', title: 'Security of Funds', description: 'Your Funds Security is our Top Priority', href: '/security' },
  { icon: '📝', title: 'Registration', description: 'Our Registration', href: '/registration' },
  { icon: '📞', title: 'Contact Us', description: "Let's get in touch", href: '/contact' },
]

const tradingMenuItems = [
  { icon: '📊', title: 'Trading Platform', description: 'Advanced tools for professional traders', href: '/trading-platform' },
  { icon: '🌐', title: 'Markets', description: 'Explore global markets', href: '/markets' },
]

const toolsMenuItems = [
  { icon: '🛠️', title: 'Trading Tools', description: 'Professional trading utilities', href: '/trading-tools' },
]

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleDropdown = (menu: string) => {
    setOpenDropdown(openDropdown === menu ? null : menu)
  }

  const closeDropdown = () => {
    setOpenDropdown(null)
  }

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled
      ? 'bg-white shadow-md border-b border-gray-200'
      : 'bg-white/95 backdrop-blur-md border-b border-gray-100'
      }`}>
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="h-12 w-12 rounded-xl overflow-hidden shadow-sm group-hover:shadow-md transition-all">
              <Image
                src="/logo.jpeg"
                alt="BXTPRO Logo"
                width={48}
                height={48}
                className="h-full w-full object-cover"
              />
            </div>
            <span className="text-2xl font-bold text-gray-900">BXTPRO</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {/* Company Dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('company')}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all flex items-center gap-1"
              >
                Company
                <ChevronDown className={`h-4 w-4 transition-transform ${openDropdown === 'company' ? 'rotate-180' : ''}`} />
              </button>

              {openDropdown === 'company' && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={closeDropdown}
                  />
                  <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-200 py-3 animate-in fade-in slide-in-from-top-2 duration-200 z-20">
                    {companyMenuItems.map((item, index) => (
                      <Link
                        key={index}
                        href={item.href}
                        onClick={closeDropdown}
                        className="flex items-start gap-3 px-4 py-3 hover:bg-emerald-50 transition-colors group"
                      >
                        <div className="text-2xl mt-1">{item.icon}</div>
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
                            {item.title}
                          </div>
                          <div className="text-xs text-gray-600 mt-0.5">
                            {item.description}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Trading Dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('trading')}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all flex items-center gap-1"
              >
                Trading
                <ChevronDown className={`h-4 w-4 transition-transform ${openDropdown === 'trading' ? 'rotate-180' : ''}`} />
              </button>

              {openDropdown === 'trading' && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={closeDropdown}
                  />
                  <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-200 py-3 animate-in fade-in slide-in-from-top-2 duration-200 z-20">
                    {tradingMenuItems.map((item, index) => (
                      <Link
                        key={index}
                        href={item.href}
                        onClick={closeDropdown}
                        className="flex items-start gap-3 px-4 py-3 hover:bg-emerald-50 transition-colors group"
                      >
                        <div className="text-2xl mt-1">{item.icon}</div>
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
                            {item.title}
                          </div>
                          <div className="text-xs text-gray-600 mt-0.5">
                            {item.description}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Tools Dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('tools')}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all flex items-center gap-1"
              >
                Tools
                <ChevronDown className={`h-4 w-4 transition-transform ${openDropdown === 'tools' ? 'rotate-180' : ''}`} />
              </button>

              {openDropdown === 'tools' && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={closeDropdown}
                  />
                  <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-200 py-3 animate-in fade-in slide-in-from-top-2 duration-200 z-20">
                    {toolsMenuItems.map((item, index) => (
                      <Link
                        key={index}
                        href={item.href}
                        onClick={closeDropdown}
                        className="flex items-start gap-3 px-4 py-3 hover:bg-emerald-50 transition-colors group"
                      >
                        <div className="text-2xl mt-1">{item.icon}</div>
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
                            {item.title}
                          </div>
                          <div className="text-xs text-gray-600 mt-0.5">
                            {item.description}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Direct Links */}
            <Link href="#promotion" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all">
              Promotion
            </Link>
            <Link href="#partnership" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all">
              Partnership
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-3">
            <Link href="/auth/login">
              <Button
                variant="ghost"
                className="text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 font-medium"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/registration">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-sm hover:shadow-md transition-all">
                Open Account
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 space-y-2 animate-in fade-in slide-in-from-top-2 duration-300 border-t border-gray-100 pt-4 max-h-[70vh] overflow-y-auto">
            {/* Company Section */}
            <div className="space-y-2">
              <div className="px-4 py-2 text-xs font-bold text-gray-500 uppercase">Company</div>
              {companyMenuItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-sm font-medium">{item.title}</span>
                </Link>
              ))}
            </div>

            {/* Trading Section */}
            <div className="space-y-2 pt-4">
              <div className="px-4 py-2 text-xs font-bold text-gray-500 uppercase">Trading</div>
              {tradingMenuItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-sm font-medium">{item.title}</span>
                </Link>
              ))}
            </div>

            {/* Tools Section */}
            <div className="space-y-2 pt-4">
              <div className="px-4 py-2 text-xs font-bold text-gray-500 uppercase">Tools</div>
              {toolsMenuItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-sm font-medium">{item.title}</span>
                </Link>
              ))}
            </div>

            {/* Other Links */}
            <div className="space-y-2 pt-4">
              <Link
                href="#promotion"
                className="block px-4 py-2 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Promotion
              </Link>
              <Link
                href="#partnership"
                className="block px-4 py-2 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Partnership
              </Link>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 pt-4 border-t border-gray-100">
              <Link href="/auth/login">
                <Button variant="outline" className="w-full bg-white border-gray-300 text-gray-700 hover:bg-gray-50">
                  Sign In
                </Button>
              </Link>
              <Link href="/registration">
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                  Open Account
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
