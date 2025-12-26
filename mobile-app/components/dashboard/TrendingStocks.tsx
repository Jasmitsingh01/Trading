"use client"

interface Stock {
    symbol: string
    name: string
    price: string
    change: string
}

interface TrendingStocksProps {
    stocks: Stock[]
    onSeeAll?: () => void
}

export function TrendingStocks({ stocks, onSeeAll }: TrendingStocksProps) {
    return (
        <div className="border border-white/10 rounded-lg p-4 bg-gradient-to-br from-slate-900/50 to-slate-800/30 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-white">Trending Stocks</h3>
                <button
                    onClick={onSeeAll}
                    className="px-2 py-1 bg-white/5 text-slate-300 rounded text-xs font-medium hover:bg-white/10 hover:text-white transition"
                >
                    See all
                </button>
            </div>
            <p className="text-xs text-slate-400 mb-3">Most discussed by the community</p>

            <div className="space-y-2">
                {stocks.map((stock, idx) => (
                    <div key={idx} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                        <div>
                            <div className="text-sm font-semibold text-white">{stock.symbol}</div>
                            <div className="text-xs text-slate-400">{stock.name}</div>
                        </div>
                        <div className="text-right">
                            <div className="text-sm font-medium text-slate-300">{stock.price}</div>
                            <div className={`text-xs font-medium ${stock.change.startsWith('+') ? 'text-emerald-400' : 'text-red-400'
                                }`}>
                                {stock.change}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
