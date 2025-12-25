"use client"

import { Button } from "@/components/ui/button"

interface MarketItem {
    symbol: string
    category: string
    price: string
    change: string
    changePercent: string
    action: string
}

interface MarketTableProps {
    items: MarketItem[]
    onAction: (item: MarketItem) => void
}

export function MarketTable({ items, onAction }: MarketTableProps) {
    return (
        <div className="border border-white/10 rounded-lg overflow-hidden bg-gradient-to-br from-slate-900/50 to-slate-800/30 backdrop-blur-sm">
            <table className="w-full text-sm">
                <thead>
                    <tr className="bg-white/5 border-b border-white/10">
                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400">Symbol</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400">Last</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400">Chg</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400">Chg %</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, idx) => (
                        <tr key={idx} className="border-b border-white/5 hover:bg-white/5">
                            <td className="px-4 py-3">
                                <div className="font-semibold text-white">{item.symbol}</div>
                                <div className="text-xs text-slate-400">{item.category}</div>
                            </td>
                            <td className="px-4 py-3 font-medium text-slate-300">{item.price}</td>
                            <td className={`px-4 py-3 font-medium ${item.change.includes('-') ? 'text-red-400' : 'text-emerald-400'}`}>{item.change}</td>
                            <td className="px-4 py-3 text-slate-400">{item.changePercent}</td>
                            <td className="px-4 py-3">
                                <Button
                                    size="sm"
                                    className="bg-emerald-500 text-white hover:bg-emerald-500/90 h-7 text-xs"
                                    onClick={() => onAction(item)}
                                >
                                    {item.action}
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
