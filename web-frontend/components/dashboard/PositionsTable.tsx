"use client"

interface Position {
    symbol: string
    name: string
    qty: string
    price: string
    value: string
    pl: string
    roi: string
    action: string
}

interface PositionsTableProps {
    positions: Position[]
}

export function PositionsTable({ positions }: PositionsTableProps) {
    return (
        <div className="bg-transparent rounded-lg border border-white/5 p-5">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white">Positions</h2>
                <button className="px-4 py-1.5 rounded bg-white/5 text-slate-400 text-xs font-medium hover:bg-white/10 hover:text-white">
                    Group by Asset class
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-xs">
                    <thead>
                        <tr className="border-b border-white/10 text-slate-400">
                            <th className="text-left py-3 px-3 font-semibold">Symbol</th>
                            <th className="text-left py-3 px-3 font-semibold">Name / type</th>
                            <th className="text-left py-3 px-3 font-semibold">Qty</th>
                            <th className="text-left py-3 px-3 font-semibold">Avg. price / Rebalance</th>
                            <th className="text-left py-3 px-3 font-semibold">Last / Delta</th>
                            <th className="text-left py-3 px-3 font-semibold">P/L (Real / Unreal)</th>
                            <th className="text-left py-3 px-3 font-semibold">Value / Trades</th>
                            <th className="text-left py-3 px-3 font-semibold">Action / Weight</th>
                        </tr>
                    </thead>
                    <tbody>
                        {positions.map((pos, idx) => (
                            <tr key={idx} className="border-b border-white/5 hover:bg-white/5">
                                <td className="py-3 px-3 font-semibold text-white">{pos.symbol}</td>
                                <td className="py-3 px-3 text-slate-400">{pos.name}</td>
                                <td className="py-3 px-3 text-slate-300">{pos.qty}</td>
                                <td className="py-3 px-3 text-slate-300">{pos.price}</td>
                                <td className="py-3 px-3 text-emerald-400">{pos.value}</td>
                                <td className="py-3 px-3 text-slate-300">{pos.pl}</td>
                                <td className="py-3 px-3 font-medium text-slate-300">{pos.roi}</td>
                                <td className={`py-3 px-3 font-medium ${pos.action.includes('-') ? 'text-red-400' :
                                    pos.action === '0%' || pos.action === '0.4%' ? 'text-slate-400' : 'text-emerald-400'
                                    }`}>
                                    {pos.action}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="text-xs text-slate-500 mt-3">
                By default, Positions by GGOS symbol | Portfolio data displayed in this table dates back to the 1950s to the current date, sources: www.company.com
            </div>
        </div>
    )
}
