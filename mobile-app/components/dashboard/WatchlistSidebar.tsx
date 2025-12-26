"use client"

import { Search, Star, TrendingUp, TrendingDown } from "lucide-react"

interface WatchlistItem {
    symbol: string
    name: string
    price: string
    change: string
    positive: boolean
}

interface WatchlistSidebarProps {
    watchlist: WatchlistItem[]
    onSymbolSelect?: (symbol: string) => void
    selectedSymbol?: string
}

export function WatchlistSidebar({ watchlist, onSymbolSelect, selectedSymbol }: WatchlistSidebarProps) {
    return (
        <div className="w-64 bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950 border-r border-gray-800 flex flex-col">
            <div className="p-4 border-b border-gray-800">
                <h2 className="text-sm font-semibold text-gray-400 mb-3">Markets</h2>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search symbols, companies..."
                        className="w-full bg-[#161b22] border border-gray-700 rounded px-9 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-gray-600"
                    />
                </div>
            </div>

            <div className="flex border-b border-gray-800 text-xs">
                <button className="flex-1 py-2.5 text-gray-400 hover:text-white hover:bg-slate-950/50 transition">Watchlist</button>
                <button className="flex-1 py-2.5 text-white bg-slate-950 font-medium">Favorites</button>
                <button className="flex-1 py-2.5 text-gray-400 hover:text-white hover:bg-slate-950/50 transition">News</button>
            </div>

            <div className="flex-1 overflow-y-auto">
                {watchlist.map((stock, idx) => (
                    <div
                        key={idx}
                        onClick={() => onSymbolSelect?.(stock.symbol)}
                        className={`px-4 py-3 border-b border-gray-800 hover:bg-slate-950/50 cursor-pointer transition ${stock.symbol === selectedSymbol ? 'bg-slate-950/70 border-l-2 border-l-emerald-500' : ''
                            }`}
                    >
                        <div className="flex items-center justify-between mb-1">
                            <div>
                                <div className="font-semibold text-sm">{stock.symbol}</div>
                                <div className="text-xs text-gray-500">{stock.name}</div>
                            </div>
                            <Star className="w-3.5 h-3.5 text-gray-600 hover:text-yellow-500" />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="text-sm font-semibold">{stock.price}</div>
                            <div className={`text-xs font-medium flex items-center gap-1 ${stock.positive ? 'text-emerald-400' : 'text-red-400'}`}>
                                {stock.positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                {stock.change}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
