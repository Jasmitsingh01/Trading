"use client"

import { ChevronRight, Plus } from "lucide-react"

interface GiftCard {
    name: string
    balance: string
    expiry: string
}

interface GiftCardsProps {
    cards: GiftCard[]
}

export function GiftCards({ cards }: GiftCardsProps) {
    return (
        <div className="bg-transparent border border-white/10 rounded-lg p-5">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-white">Gift cards</h3>
                <button className="text-xs text-emerald-400 hover:underline">View all</button>
            </div>
            <p className="text-xs text-slate-400 mb-4">Your available gift cards</p>

            <div className="space-y-3">
                {cards.map((card, idx) => (
                    <div key={idx} className="p-3 border border-white/10 rounded hover:bg-white/5 cursor-pointer transition">
                        <div className="flex items-center justify-between mb-1">
                            <div className="text-sm font-medium text-white">{card.name}</div>
                            <ChevronRight className="w-4 h-4 text-slate-400" />
                        </div>
                        <div className="text-xs text-slate-400">{card.expiry}</div>
                        <div className="text-sm font-semibold mt-1 text-emerald-400">{card.balance}</div>
                    </div>
                ))}
            </div>

            <button className="w-full mt-3 px-3 py-2 bg-white/5 text-slate-300 rounded text-xs font-medium hover:bg-white/10 hover:text-white transition flex items-center justify-center gap-1">
                <Plus className="w-3.5 h-3.5" />
                Add new card
            </button>
        </div>
    )
}
