'use client'

import { TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const markets = [
  { name: 'S&P 500', symbol: 'SPX', price: '4,783.45', change: '+1.2%', isUp: true },
  { name: 'NASDAQ', symbol: 'IXIC', price: '15,011.35', change: '+0.8%', isUp: true },
  { name: 'Bitcoin', symbol: 'BTC/USD', price: '43,256.78', change: '-2.3%', isUp: false },
  { name: 'Ethereum', symbol: 'ETH/USD', price: '2,245.91', change: '+3.5%', isUp: true },
  { name: 'EUR/USD', symbol: 'EURUSD', price: '1.0945', change: '+0.4%', isUp: true },
  { name: 'Gold', symbol: 'XAU/USD', price: '2,045.30', change: '-0.7%', isUp: false },
]

const stats = [
  { label: 'Total Markets', value: '150+' },
  { label: 'Daily Volume', value: '$2.5B+' },
  { label: 'Active Traders', value: '50K+' },
  { label: 'Avg Response Time', value: '<10ms' },
]

export function ChartSection() {
  return (
    <section id="markets" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-sm font-semibold text-emerald-600 uppercase tracking-wide">Live Markets</span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-4 mb-6">
            Access Global Financial Markets
          </h2>
          <p className="text-lg text-gray-600">
            Trade stocks, forex, cryptocurrencies, and commodities with real-time data
          </p>
        </div>

        {/* Live Market Data */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {markets.map((market, index) => (
            <Card key={index} className="bg-white border-2 border-gray-100 hover:border-emerald-300 hover:shadow-lg transition-all">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{market.name}</h3>
                    <p className="text-sm text-gray-500">{market.symbol}</p>
                  </div>
                  {market.isUp ? (
                    <ArrowUpRight className="h-5 w-5 text-emerald-600" />
                  ) : (
                    <ArrowDownRight className="h-5 w-5 text-red-600" />
                  )}
                </div>
                <div className="flex items-end justify-between">
                  <div className="text-2xl font-bold text-gray-900">{market.price}</div>
                  <div className={`text-sm font-semibold ${market.isUp ? 'text-emerald-600' : 'text-red-600'}`}>
                    {market.change}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-8 border-2 border-emerald-200">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl font-bold text-emerald-600 mb-2">{stat.value}</div>
              <div className="text-sm text-gray-700 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
