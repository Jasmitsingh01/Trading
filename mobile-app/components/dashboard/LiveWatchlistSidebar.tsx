'use client'

import { useState } from "react"
import { Search, BarChart3 } from "lucide-react"
import LiveWatchlistItem from "./LiveWatchlistItem"

interface WatchlistAsset {
  symbol: string
  name: string
  assetType: 'crypto' | 'forex'
}

interface LiveWatchlistSidebarProps {
  assets: WatchlistAsset[]
  onSymbolSelect?: (symbol: string, assetType: string) => void
  selectedSymbol?: string
  showCharts?: boolean
}

export default function LiveWatchlistSidebar({ 
  assets, 
  onSymbolSelect, 
  selectedSymbol,
  showCharts = true 
}: LiveWatchlistSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [showLiveCharts, setShowLiveCharts] = useState(showCharts)
  const [activeTab, setActiveTab] = useState<'all' | 'crypto' | 'forex'>('all')

  // Filter assets based on search and active tab
  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         asset.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTab = activeTab === 'all' || asset.assetType === activeTab
    return matchesSearch && matchesTab
  })

  return (
    <div className="w-80 bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950 border-r border-gray-800 flex flex-col">
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-400">Live Markets</h2>
          <button
            onClick={() => setShowLiveCharts(!showLiveCharts)}
            className={`p-1.5 rounded transition ${
              showLiveCharts ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-gray-400'
            }`}
            title={showLiveCharts ? 'Hide charts' : 'Show charts'}
          >
            <BarChart3 className="w-4 h-4" />
          </button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search symbols..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#161b22] border border-gray-700 rounded px-9 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      <div className="flex border-b border-gray-800 text-xs">
        <button 
          onClick={() => setActiveTab('all')}
          className={`flex-1 py-2.5 transition ${
            activeTab === 'all' 
              ? 'text-white bg-slate-950 font-medium' 
              : 'text-gray-400 hover:text-white hover:bg-slate-950/50'
          }`}
        >
          All
        </button>
        <button 
          onClick={() => setActiveTab('crypto')}
          className={`flex-1 py-2.5 transition ${
            activeTab === 'crypto' 
              ? 'text-white bg-slate-950 font-medium' 
              : 'text-gray-400 hover:text-white hover:bg-slate-950/50'
          }`}
        >
          Crypto
        </button>
        <button 
          onClick={() => setActiveTab('forex')}
          className={`flex-1 py-2.5 transition ${
            activeTab === 'forex' 
              ? 'text-white bg-slate-950 font-medium' 
              : 'text-gray-400 hover:text-white hover:bg-slate-950/50'
          }`}
        >
          Forex
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredAssets.length > 0 ? (
          filteredAssets.map((asset) => (
            <LiveWatchlistItem
              key={asset.symbol}
              symbol={asset.symbol}
              name={asset.name}
              assetType={asset.assetType}
              onSelect={() => onSymbolSelect?.(asset.symbol, asset.assetType)}
              isSelected={asset.symbol === selectedSymbol}
              showChart={showLiveCharts}
            />
          ))
        ) : (
          <div className="p-6 text-center">
            <p className="text-sm text-gray-500">No assets found</p>
          </div>
        )}
      </div>

      <div className="p-3 border-t border-gray-800 bg-slate-950/50">
        <div className="text-xs text-slate-400 text-center">
          <span className="inline-flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
            Live WebSocket Data
          </span>
        </div>
      </div>
    </div>
  )
}
