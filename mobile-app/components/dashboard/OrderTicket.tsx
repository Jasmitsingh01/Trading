"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api"
import { useAuth } from "@/contexts/AuthContext"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

interface OrderTicketProps {
    symbol?: string
    currentPrice?: number
    assetType?: string
}

export function OrderTicket({ symbol = "BTCUSDT", currentPrice = 0, assetType = "crypto" }: OrderTicketProps) {
    const { user } = useAuth() // Get user from AuthContext instead of localStorage
    const [activeOrderTab, setActiveOrderTab] = useState("Buy")
    const [orderType, setOrderType] = useState("Market")
    const [quantity, setQuantity] = useState("1")
    const [price, setPrice] = useState("")
    const [stopPrice, setStopPrice] = useState("")
    const [timeInForce, setTimeInForce] = useState("GTC")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [availableBalance, setAvailableBalance] = useState<number>(0)

    // Sync price if it's market order or price is empty
    useEffect(() => {
        if (orderType === "Market" || !price) {
            setPrice(currentPrice.toString())
        }
    }, [currentPrice, orderType])

    // Load available balance - NO TOKEN NEEDED
    useEffect(() => {
        if (!user) return // Wait for user to be loaded

        const fetchBalance = async () => {
            try {
                const res = await api.user.getBalance() // No token!
                if (res?.userBalance) {
                    setAvailableBalance(res.userBalance.availableBalance)
                } else if (res?.availableBalance) {
                    setAvailableBalance(res.availableBalance)
                }
            } catch (err) {
                console.error("Error fetching balance:", err)
            }
        }
        fetchBalance()
    }, [user])

    const calculateTotal = () => {
        const q = parseFloat(quantity)
        const p = orderType === "Market" ? currentPrice : parseFloat(price)
        if (isNaN(q) || isNaN(p)) return "0.00"
        return (q * p).toFixed(2)
    }

    const handleSubmit = async () => {
        if (!user) {
            toast.error("Please login to place an order")
            return
        }

        if (!quantity || parseFloat(quantity) <= 0) {
            toast.error("Please enter a valid quantity")
            return
        }

        setIsSubmitting(true)
        try {
            const orderData = {
                symbol,
                assetType: assetType === 'crypto' ? 'cryptocurrency' : assetType,
                orderType: orderType.toLowerCase(),
                side: activeOrderTab.toLowerCase(),
                quantity: parseFloat(quantity),
                price: orderType === "Market" ? currentPrice : parseFloat(price),
                stopPrice: (orderType === "Stop" || orderType === "Stop-Limit") ? parseFloat(stopPrice) : undefined,
                timeInForce: timeInForce.toLowerCase(),
            }

            console.log('📤 Placing order:', orderData)

            // No token needed - cookies handle auth!
            const response = await api.orders.createRest(orderData)

            console.log('✅ Order response:', response)

            if (response.success || response.data) {
                toast.success(`Order placed: ${activeOrderTab} ${quantity} ${symbol}`)
                // Trigger refresh
                if (typeof window !== 'undefined') {
                    window.dispatchEvent(new CustomEvent('order-placed'))
                }

                // Reset form
                setQuantity("1")
                setPrice(currentPrice.toString())
                setStopPrice("")
                setOrderType("Market")
            } else {
                toast.error(response.message || "Failed to place order")
            }
        } catch (error: any) {
            console.error("Order error:", error)
            toast.error(error.message || "An error occurred")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="w-80 bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950 border-l border-gray-800 p-6 flex flex-col h-full overflow-y-auto">
            <h2 className="text-lg font-bold mb-4">Order ticket</h2>

            {/* Buy/Sell Tabs */}
            <div className="flex mb-4 bg-slate-950 rounded-lg p-1">
                <button
                    onClick={() => setActiveOrderTab("Buy")}
                    className={`flex-1 py-2 rounded-md text-sm font-semibold transition ${activeOrderTab === "Buy"
                        ? 'bg-emerald-600 text-white'
                        : 'text-gray-400'
                        }`}
                >
                    Buy
                </button>
                <button
                    onClick={() => setActiveOrderTab("Sell")}
                    className={`flex-1 py-2 rounded-md text-sm font-semibold transition ${activeOrderTab === "Sell"
                        ? 'bg-red-600 text-white'
                        : 'text-gray-400'
                        }`}
                >
                    Sell
                </button>
            </div>

            {/* Symbol Display */}
            <div className="mb-4">
                <label className="text-xs text-gray-400 block mb-2">Symbol</label>
                <div className="bg-slate-950 border border-gray-700 rounded px-3 py-2.5 text-sm font-medium">
                    {symbol} - {assetType.toUpperCase()}
                </div>
            </div>

            {/* Order Type */}
            <div className="mb-4">
                <label className="text-xs text-gray-400 block mb-2">Order type</label>
                <select
                    value={orderType}
                    onChange={(e) => setOrderType(e.target.value)}
                    className="w-full bg-slate-950 border border-gray-700 rounded px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gray-600"
                >
                    <option>Market</option>
                    <option>Limit</option>
                    <option>Stop</option>
                    <option>Stop-Limit</option>
                </select>
            </div>

            {/* Quantity */}
            <div className="mb-4">
                <label className="text-xs text-gray-400 block mb-2">Quantity</label>
                <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full bg-slate-950 border border-gray-700 rounded px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gray-600"
                    placeholder="0.00"
                />
            </div>

            {/* Price (if not market) */}
            {orderType !== "Market" && (
                <div className="mb-4 animate-in fade-in slide-in-from-top-2 duration-200">
                    <label className="text-xs text-gray-400 block mb-2">Limit Price</label>
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full bg-slate-950 border border-gray-700 rounded px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gray-600"
                        placeholder="0.00"
                    />
                </div>
            )}

            {/* Stop Price */}
            {(orderType === "Stop" || orderType === "Stop-Limit") && (
                <div className="mb-4 animate-in fade-in slide-in-from-top-2 duration-200">
                    <label className="text-xs text-gray-400 block mb-2">Stop Price</label>
                    <input
                        type="number"
                        value={stopPrice}
                        onChange={(e) => setStopPrice(e.target.value)}
                        className="w-full bg-slate-950 border border-gray-700 rounded px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gray-600"
                        placeholder="0.00"
                    />
                </div>
            )}

            {/* Time in force */}
            <div className="mb-4">
                <label className="text-xs text-gray-400 block mb-2">Time in force</label>
                <select
                    value={timeInForce}
                    onChange={(e) => setTimeInForce(e.target.value)}
                    className="w-full bg-slate-950 border border-gray-700 rounded px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gray-600"
                >
                    <option>GTC</option>
                    <option>DAY</option>
                    <option>IOC</option>
                    <option>FOK</option>
                </select>
            </div>

            {/* Estimated Cost */}
            <div className="bg-slate-950 border border-gray-700 rounded-lg p-4 mb-4">
                <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Current Price</span>
                    <span className="font-medium">${currentPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm pt-2 border-t border-gray-700">
                    <span className="text-gray-400 font-medium">Estimated cost</span>
                    <span className="font-bold text-lg">${calculateTotal()}</span>
                </div>
            </div>

            {/* Submit Button */}
            <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !user}
                className={`w-full py-6 rounded-lg font-bold text-white transition-all transform active:scale-95 ${activeOrderTab === "Buy"
                    ? 'bg-emerald-600 hover:bg-emerald-700 shadow-[0_0_20px_rgba(16,185,129,0.2)]'
                    : 'bg-red-600 hover:bg-red-700 shadow-[0_0_20px_rgba(220,38,38,0.2)]'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
                {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : !user ? (
                    'Please login'
                ) : (
                    `Submit ${activeOrderTab.toLowerCase()} order`
                )}
            </Button>

            {/* Reset Button */}
            <Button
                variant="outline"
                className="w-full mt-3 py-6 rounded-lg font-semibold bg-transparent border border-gray-700 text-gray-400 hover:bg-slate-900 hover:text-white transition"
                onClick={() => {
                    setQuantity("1")
                    setPrice(currentPrice.toString())
                    setStopPrice("")
                    setOrderType("Market")
                }}
            >
                Reset
            </Button>

            {/* Balance Info */}
            <div className="mt-auto pt-6 border-t border-gray-800">
                <div className="flex justify-between text-xs mb-2">
                    <span className="text-gray-400">Available cash</span>
                    <span className="font-medium text-emerald-400">${availableBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Buying power</span>
                    <span className="font-medium">${(availableBalance * 2).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
            </div>
        </div>
    )
}
