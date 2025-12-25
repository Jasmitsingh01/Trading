"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api"
import { useRouter } from "next/navigation"

interface TradingHeaderProps {
    symbol?: string
    price?: number
    change?: number
    changePercent?: number
}

export function TradingHeader({ 
    symbol = "BTCUSDT", 
    price = 0, 
    change = 0, 
    changePercent = 0 
}: TradingHeaderProps) {
    const isPositive = changePercent >= 0
    const router = useRouter()
    const [isAddingToWatchlist, setIsAddingToWatchlist] = useState(false)
    const [isInWatchlist, setIsInWatchlist] = useState(false)

    const handleAddToWatchlist = async () => {
        try {
            setIsAddingToWatchlist(true)

            // Determine asset type based on symbol
            let assetType = 'cryptocurrency'
            if (symbol.includes('USD') || symbol.includes('EUR') || symbol.includes('JPY')) {
                if (symbol.includes('BTC') || symbol.includes('ETH')) {
                    assetType = 'cryptocurrency'
                } else {
                    assetType = 'forex'
                }
            }

            // Add to watchlist via GraphQL (cookie-based auth)
            await api.watchlist.add({
                symbol: symbol,
                assetType: assetType,
                alertPrice: price > 0 ? price : undefined,
                notes: `Added from trading page at $${price.toFixed(2)}`
            })

            setIsInWatchlist(true)
            
            // Show success message
            alert(`${symbol} added to watchlist successfully!`)
            
        } catch (error: any) {
            if (error.message?.includes('already in watchlist')) {
                setIsInWatchlist(true)
                alert(`${symbol} is already in your watchlist`)
            } else if (error.message?.includes('Unauthorized')) {
                router.push('/login')
            } else {
                console.error('Error adding to watchlist:', error)
                alert('Failed to add to watchlist. Please try again.')
            }
        } finally {
            setIsAddingToWatchlist(false)
        }
    }

    return (
        <div className="bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950 border-b border-gray-800 px-6 py-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold">{symbol}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div>
                            <div className="text-3xl font-bold">${price.toFixed(2)}</div>
                            <div className={`text-xs font-medium ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                                {isPositive ? '+' : ''}{change.toFixed(2)} • {isPositive ? '+' : ''}{changePercent.toFixed(2)}%
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button 
                        variant="outline" 
                        className="bg-slate-950 hover:bg-gray-700 border-0 text-xs px-3 py-2"
                        onClick={handleAddToWatchlist}
                        disabled={isAddingToWatchlist || isInWatchlist}
                    >
                        {isAddingToWatchlist 
                            ? 'Adding...' 
                            : isInWatchlist 
                            ? '✓ In Watchlist' 
                            : 'Add to watchlist'
                        }
                    </Button>
                </div>
            </div>

            <div className="flex items-center gap-6 mt-3 text-xs text-gray-500">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                    <span>Live Data</span>
                </div>
            </div>
        </div>
    )
}
