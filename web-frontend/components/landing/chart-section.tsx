// components/landing/chart-section.tsx
'use client'

import { useState } from 'react'
import { TrendingUp, TrendingDown, BarChart3, Wallet, Target, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const marketData = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: '$178.45', change: '+2.34%', positive: true, volume: '52.3M' },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: '$242.84', change: '+5.67%', positive: true, volume: '98.7M' },
  { symbol: 'BTC/USD', name: 'Bitcoin', price: '$43,256.00', change: '+3.42%', positive: true, volume: '$28.4B' },
  { symbol: 'ETH/USD', name: 'Ethereum', price: '$2,287.50', change: '-1.23%', positive: false, volume: '$12.8B' },
  { symbol: 'EUR/USD', name: 'Euro/Dollar', price: '1.0876', change: '+0.45%', positive: true, volume: '$142B' },
  { symbol: 'GLD', name: 'Gold', price: '$2,034.20', change: '+0.89%', positive: true, volume: '8.9M' }
]

const benefits = [
  {
    icon: Wallet,
    title: 'Zero Commission',
    description: 'Trade without worrying about high fees eating into your profits'
  },
  {
    icon: Target,
    title: 'Fractional Shares',
    description: 'Invest in expensive stocks with as little as $1'
  },
  {
    icon: Zap,
    title: 'Instant Execution',
    description: 'Your orders execute at lightning speed'
  }
]

export function ChartSection() {
  const [activeTab, setActiveTab] = useState('stocks')

  return (
    <section className="py-24 bg-slate-950 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem]" />

      {/* Background Gradients */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-blue-500/20 rounded-full blur-[128px]" />
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-purple-500/20 rounded-full blur-[128px]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 backdrop-blur-sm mb-6">
                <BarChart3 className="h-4 w-4 text-purple-400" />
                <span className="text-sm font-medium text-purple-400">
                  Live Market Data
                </span>
              </div>
              <h2 className="text-5xl sm:text-6xl font-bold text-white mb-6">
                Real-Time Market
                <span className="block bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text mt-2">
                  Intelligence
                </span>
              </h2>
              <p className="text-xl text-slate-400 leading-relaxed">
                Stay ahead of the market with real-time data, advanced charting tools, and AI-powered insights that help you make informed decisions.
              </p>
            </div>

            {/* Benefits */}
            <div className="space-y-4">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon
                return (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-5 rounded-2xl bg-slate-900/50 backdrop-blur-sm border border-slate-800 hover:border-blue-500/50 transition-all duration-300 hover:scale-105 group"
                  >
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-2 text-lg">
                        {benefit.title}
                      </h4>
                      <p className="text-sm text-slate-400">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>

            <Link href="/auth/register">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-10 py-7 text-lg rounded-2xl shadow-2xl shadow-blue-500/50 transition-all duration-300 hover:scale-105"
              >
                Start Trading Now
                <TrendingUp className="ml-2 h-6 w-6" />
              </Button>
            </Link>
          </div>

          {/* Right Content - Market Data */}
          <div className="space-y-6">
            {/* Market Tabs */}
            <div className="flex gap-2 p-1 bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800">
              {['stocks', 'crypto', 'forex'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 px-6 py-4 rounded-xl font-medium capitalize transition-all duration-300 ${activeTab === tab
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'text-slate-400 hover:text-white'
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Market Data Cards */}
            <div className="space-y-3">
              {marketData.map((data, index) => (
                <div
                  key={index}
                  className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-5 border border-slate-800 hover:border-blue-500/50 transition-all duration-300 hover:scale-105 group cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        {data.symbol.slice(0, 2)}
                      </div>
                      <div>
                        <div className="font-bold text-white text-lg">
                          {data.symbol}
                        </div>
                        <div className="text-sm text-slate-400">
                          {data.name}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-bold text-white text-xl">
                        {data.price}
                      </div>
                      <div className={`flex items-center justify-end gap-1 text-sm font-medium ${data.positive
                          ? 'text-emerald-400'
                          : 'text-red-400'
                        }`}>
                        {data.positive ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <TrendingDown className="h-4 w-4" />
                        )}
                        {data.change}
                      </div>
                    </div>
                  </div>

                  {/* Mini Chart */}
                  <div className="h-16 flex items-end justify-between gap-1">
                    {Array.from({ length: 20 }).map((_, i) => {
                      const height = Math.random() * 100
                      return (
                        <div
                          key={i}
                          className={`flex-1 rounded-t transition-all duration-300 ${data.positive
                              ? 'bg-gradient-to-t from-emerald-500 to-emerald-400'
                              : 'bg-gradient-to-t from-red-500 to-red-400'
                            } opacity-60 group-hover:opacity-100`}
                          style={{ height: `${height}%` }}
                        />
                      )
                    })}
                  </div>

                  <div className="mt-3 text-xs text-slate-500">
                    Volume: {data.volume}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
