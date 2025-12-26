'use client'

import Link from 'next/link'
import { TrendingUp, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gray-50 text-gray-700 border-t border-gray-200">
      <div className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-sm">
                <TrendingUp className="h-6 w-6 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-2xl font-bold text-gray-900">TradeVault</span>
            </div>
            <p className="text-gray-600 mb-6 max-w-sm leading-relaxed">
              Professional trading platform trusted by thousands of traders worldwide. Trade stocks, forex, crypto, and more with confidence.
            </p>
       
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-gray-900 font-bold mb-4">Platform</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="#features" className="text-gray-600 hover:text-emerald-600 transition-colors">Features</Link></li>
              <li><Link href="#markets" className="text-gray-600 hover:text-emerald-600 transition-colors">Markets</Link></li>
              <li><Link href="/dashboard" className="text-gray-600 hover:text-emerald-600 transition-colors">Dashboard</Link></li>
              <li><Link href="/trading-platform" className="text-gray-600 hover:text-emerald-600 transition-colors">Trading Platform</Link></li>
              <li><Link href="/api" className="text-gray-600 hover:text-emerald-600 transition-colors">API</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-gray-900 font-bold mb-4">Company</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/about" className="text-gray-600 hover:text-emerald-600 transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-gray-600 hover:text-emerald-600 transition-colors">Contact</Link></li>
              <li><Link href="/why-choose-us" className="text-gray-600 hover:text-emerald-600 transition-colors">Why Choose Us</Link></li>
              <li><Link href="/markets" className="text-gray-600 hover:text-emerald-600 transition-colors">Markets</Link></li>
              <li><Link href="/security" className="text-gray-600 hover:text-emerald-600 transition-colors">Security</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-gray-900 font-bold mb-4">Legal</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="#" className="text-gray-600 hover:text-emerald-600 transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-emerald-600 transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-emerald-600 transition-colors">Cookie Policy</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-emerald-600 transition-colors">Disclaimer</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-emerald-600 transition-colors">Licenses</Link></li>
            </ul>
          </div>
        </div>

        

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-300 text-center text-sm text-gray-600">
          <p className="font-medium text-gray-900">© 2025 TradeVault. All rights reserved.</p>
          <p className="mt-2 text-gray-500">
            Trading involves risk. Only invest what you can afford to lose. TradeVault is registered with SEC and member of FINRA/SIPC.
          </p>
        </div>
      </div>
    </footer>
  )
}
