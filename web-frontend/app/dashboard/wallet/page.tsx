'use client'

import { useState, useEffect } from "react"
import { WalletOverview } from "@/components/dashboard/WalletOverview"
import { TransferFunds } from "@/components/dashboard/TransferFunds"
import { QRTransfer } from "@/components/dashboard/QRTransfer"
import { WalletActivity } from "@/components/dashboard/WalletActivity"
import { Modal } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { api } from "@/lib/api"

export default function Wallet() {
    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    // Form states
    const [withdrawAmount, setWithdrawAmount] = useState("")
    const [paymentMethod, setPaymentMethod] = useState("upi")

    // Dynamic data
    const [balance, setBalance] = useState<any>(null)
    const [transactions, setTransactions] = useState<any[]>([])
    const [userProfile, setUserProfile] = useState<any>(null)

    // Fetch data on mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true)

                // Fetch balance
                const balanceResult = await api.user.getBalance()
                setBalance(balanceResult.userBalance)

                // Fetch transactions
                const transactionsResult = await api.transactions.getAll({ page: 1, limit: 10 })
                setTransactions(transactionsResult.transactions?.transactions || transactionsResult.data?.transactions || [])

                // Fetch user profile
                const profileResult = await api.user.getProfile()
                setUserProfile(profileResult.userProfile)

            } catch (err: any) {
                console.error('Error fetching wallet data:', err)
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [])

    // Refresh data function
    const refreshData = async () => {
        try {
            const [balanceResult, transactionsResult] = await Promise.all([
                api.user.getBalance(),
                api.transactions.getAll({ page: 1, limit: 10 })
            ])
            
            setBalance(balanceResult.userBalance)
            setTransactions(transactionsResult.transactions?.transactions || transactionsResult.data?.transactions || [])
        } catch (err: any) {
            console.error('Error refreshing data:', err)
        }
    }

    const handleWithdraw = async () => {
        if (!withdrawAmount) {
            alert("Please enter an amount")
            return
        }

        try {
            await api.transactions.createWithdrawal({
                amount: parseFloat(withdrawAmount),
                currency: balance?.currency || 'INR',
                paymentMethod: paymentMethod as any,
                bankDetails: {
                    bankName: userProfile?.bankDetails?.bankName || "SBI",
                    accountNumber: userProfile?.bankDetails?.accountNumber || "44620349829"
                }
            })

            alert("Withdrawal request submitted successfully!")
            setIsWithdrawModalOpen(false)
            setWithdrawAmount("")

            // Refresh data
            await refreshData()
        } catch (err: any) {
            console.error('Withdrawal error:', err)
            alert(err.message || "Failed to create withdrawal request")
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950 flex items-center justify-center">
                <div className="text-white text-xl">Loading wallet...</div>
            </div>
        )
    }

    // Wallet data
    const walletData = {
        totalBalance: `₹${balance?.totalBalance?.toFixed(2) || '0.00'}`,
        available: `₹${balance?.availableBalance?.toFixed(2) || '0.00'}`,
        currency: balance?.currency || 'INR',
        accountHolder: userProfile?.fullname || "User",
        pl: `${balance?.totalProfit >= 0 ? '+' : ''}₹${balance?.totalProfit?.toFixed(2) || '0.00'}`
    }

    // Format transactions
    const formattedTransactions = Array.isArray(transactions) ? transactions.map((t: any) => ({
        type: t.type?.charAt(0).toUpperCase() + t.type?.slice(1) || 'Transaction',
        date: new Date(t.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        amount: `${t.type === 'deposit' ? '+' : '-'}₹${t.amount?.toFixed(2) || '0.00'}`,
        status: t.status || 'pending'
    })) : []

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950 text-white">
            <div className="max-w-[1200px] mx-auto p-6">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                        <h1 className="text-2xl font-bold text-white">Wallet</h1>
                      
                    </div>
                    <p className="text-sm text-slate-400">Manage your wallet and transactions</p>
                </div>

                {/* Main Content */}
                <div className="space-y-6">
                    {/* Wallet Overview */}
                    <WalletOverview data={walletData} />

                    {/* Transfer Funds */}
                    <TransferFunds onTransferComplete={refreshData} />

                    {/* QR Code Payment */}
                    <QRTransfer onDepositComplete={refreshData} />

                    {/* Recent Activity */}
                    <WalletActivity transactions={formattedTransactions} />
                </div>
            </div>

            {/* Withdraw Modal */}
            <Modal
                isOpen={isWithdrawModalOpen}
                onClose={() => setIsWithdrawModalOpen(false)}
                title="Withdraw Funds"
            >
                <div className="space-y-4">
                    <p className="text-sm text-slate-400">Withdraw funds to your linked bank account or UPI.</p>
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-slate-300">Amount (INR)</label>
                        <Input
                            placeholder="0.00"
                            className="bg-slate-900 border-white/10 text-white"
                            value={withdrawAmount}
                            onChange={(e) => setWithdrawAmount(e.target.value)}
                            type="number"
                        />
                        <p className="text-xs text-slate-500">Available: {walletData.available}</p>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-slate-300">Payment Method</label>
                        <select
                            className="w-full bg-slate-900 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        >
                            <option value="upi">UPI Transfer</option>
                            <option value="bank_transfer">Bank Transfer</option>
                        </select>
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                        <Button variant="ghost" onClick={() => setIsWithdrawModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            className="bg-emerald-500 hover:bg-emerald-600 text-white"
                            onClick={handleWithdraw}
                            disabled={!withdrawAmount || parseFloat(withdrawAmount) <= 0}
                        >
                            Confirm Withdrawal
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}
