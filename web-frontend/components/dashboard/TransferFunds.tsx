// frontend/src/components/dashboard/TransferFunds.tsx
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { api } from '@/lib/api'
import { toast } from 'sonner'

interface TransferFundsProps {
    onTransferComplete?: () => void
}

export function TransferFunds({ onTransferComplete }: TransferFundsProps) {
    const [selectedMethod, setSelectedMethod] = useState('Bank transfer')
    const [amount, setAmount] = useState('')
    const [fromAccount, setFromAccount] = useState('Savings account')
    const [toAccount, setToAccount] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [showAddBank, setShowAddBank] = useState(false)
    
    // Bank accounts list
    const [bankAccounts, setBankAccounts] = useState<any[]>([])
    const [selectedBankId, setSelectedBankId] = useState('')

    // Add bank form
    const [bankForm, setBankForm] = useState({
        bankName: '',
        accountHolderName: '',
        accountNumber: '',
        confirmAccountNumber: '',
        accountType: 'savings',
        ifscCode: ''
    })

    const methods = ['Bank transfer']
    
    const accountOptions = ['Trading account', 'Savings account']

    // Fetch bank accounts on mount
    useEffect(() => {
        fetchBankAccounts()
    }, [])

    const fetchBankAccounts = async () => {
        try {
            const result = await api.bank.getAccounts()
            setBankAccounts(result.data || [])
            
            // Set primary account as default
            const primaryAccount = result.data?.find((acc: any) => acc.isPrimary)
            if (primaryAccount) {
                setSelectedBankId(primaryAccount._id)
                setToAccount(`${primaryAccount.bankName} ****${primaryAccount.accountNumber.slice(-4)}`)
            }
        } catch (error) {
            console.error('Error fetching bank accounts:', error)
        }
    }

    const handleAddBankAccount = async () => {
        if (bankForm.accountNumber !== bankForm.confirmAccountNumber) {
            toast.error('Account numbers do not match')
            return
        }

        try {
            setIsLoading(true)
            await api.bank.addAccount(bankForm)
            toast.success('Bank account added successfully')
            
            // Refresh bank accounts
            await fetchBankAccounts()
            setShowAddBank(false)
            
            // Reset form
            setBankForm({
                bankName: '',
                accountHolderName: '',
                accountNumber: '',
                confirmAccountNumber: '',
                accountType: 'savings',
                ifscCode: ''
            })
        } catch (error: any) {
            toast.error(error.message || 'Failed to add bank account')
        } finally {
            setIsLoading(false)
        }
    }

    const handleWithdrawal = async () => {
        if (!amount || parseFloat(amount) <= 0) {
            toast.error('Please enter a valid amount')
            return
        }

        if (!selectedBankId) {
            toast.error('Please select a bank account')
            return
        }

        try {
            setIsLoading(true)

            const result = await api.transactions.createWithdrawal({
                amount: parseFloat(amount),
                currency: 'INR',
                paymentMethod: 'bank_transfer',
                bankId: selectedBankId
            })

            toast.success('Withdrawal request submitted for admin approval')
            setAmount('')

            if (onTransferComplete) {
                onTransferComplete()
            }

        } catch (error: any) {
            console.error('Withdrawal error:', error)
            toast.error(error.message || 'Withdrawal failed')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="bg-transparent border border-white/10 rounded-lg p-6">
            <h2 className="text-lg font-bold mb-2 text-white">Transfer funds</h2>
            <p className="text-xs text-slate-400 mb-4">
                Withdraw funds to your verified bank account
            </p>

            {/* Transfer Method Buttons */}
            <div className="flex items-center gap-2 mb-6">
                {methods.map((method) => (
                    <button
                        key={method}
                        onClick={() => setSelectedMethod(method)}
                        className={`px-4 py-2 rounded text-sm font-medium transition ${
                            selectedMethod === method
                                ? 'bg-emerald-500 text-white hover:bg-emerald-500/90'
                                : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                        }`}
                    >
                        {method}
                    </button>
                ))}
            </div>

            {/* Bank Transfer Form */}
            {selectedMethod === 'Bank transfer' && (
                <>
                    {!showAddBank ? (
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs text-slate-400 block mb-2">
                                    Amount to withdraw (₹)
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                                        ₹
                                    </span>
                                    <Input
                                        type="number"
                                        placeholder="0.00"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className="pl-8 bg-transparent border-white/10 text-white focus-visible:ring-emerald-500/50"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-slate-400 block mb-2">
                                        From account
                                    </label>
                                    <select
                                        value={fromAccount}
                                        onChange={(e) => setFromAccount(e.target.value)}
                                        className="w-full bg-slate-900/50 border border-white/10 rounded-md px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                    >
                                        {accountOptions.map((option) => (
                                            <option key={option} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="text-xs text-slate-400 block mb-2">
                                        To bank account
                                    </label>
                                    <select
                                        value={selectedBankId}
                                        onChange={(e) => {
                                            setSelectedBankId(e.target.value)
                                            const account = bankAccounts.find(acc => acc._id === e.target.value)
                                            if (account) {
                                                setToAccount(`${account.bankName} ****${account.accountNumber.slice(-4)}`)
                                            }
                                        }}
                                        className="w-full bg-slate-900/50 border border-white/10 rounded-md px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                    >
                                        {bankAccounts.length === 0 ? (
                                            <option value="">No bank accounts</option>
                                        ) : (
                                            bankAccounts.map((account) => (
                                                <option key={account._id} value={account._id}>
                                                    {account.bankName} ****{account.accountNumber.slice(-4)}
                                                    {account.isPrimary && ' (Primary)'}
                                                    {!account.isVerified && ' - Pending Verification'}
                                                </option>
                                            ))
                                        )}
                                    </select>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    onClick={handleWithdrawal}
                                    disabled={isLoading || !amount || bankAccounts.length === 0}
                                    className="flex-1 bg-emerald-500 text-white hover:bg-emerald-500/90 disabled:opacity-50"
                                >
                                    {isLoading ? 'Processing...' : 'Request Withdrawal'}
                                </Button>

                                <Button
                                    onClick={() => setShowAddBank(true)}
                                    variant="outline"
                                    className="border-white/10 text-white hover:bg-white/10"
                                >
                                    + Add Bank
                                </Button>
                            </div>

                            {bankAccounts.length === 0 && (
                                <p className="text-xs text-amber-400 text-center">
                                    Please add a bank account first
                                </p>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-white">Add Bank Account</h3>
                            
                            <div>
                                <label className="text-xs text-slate-400 block mb-2">Bank Name</label>
                                <Input
                                    placeholder="State Bank of India"
                                    value={bankForm.bankName}
                                    onChange={(e) => setBankForm({...bankForm, bankName: e.target.value})}
                                    className="bg-slate-900/50 border-white/10 text-white"
                                />
                            </div>

                            <div>
                                <label className="text-xs text-slate-400 block mb-2">Account Holder Name</label>
                                <Input
                                    placeholder="Full name as per bank"
                                    value={bankForm.accountHolderName}
                                    onChange={(e) => setBankForm({...bankForm, accountHolderName: e.target.value})}
                                    className="bg-slate-900/50 border-white/10 text-white"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-slate-400 block mb-2">Account Number</label>
                                    <Input
                                        type="text"
                                        placeholder="Account number"
                                        value={bankForm.accountNumber}
                                        onChange={(e) => setBankForm({...bankForm, accountNumber: e.target.value})}
                                        className="bg-slate-900/50 border-white/10 text-white"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs text-slate-400 block mb-2">Confirm Account Number</label>
                                    <Input
                                        type="text"
                                        placeholder="Re-enter account number"
                                        value={bankForm.confirmAccountNumber}
                                        onChange={(e) => setBankForm({...bankForm, confirmAccountNumber: e.target.value})}
                                        className="bg-slate-900/50 border-white/10 text-white"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-slate-400 block mb-2">Account Type</label>
                                    <select
                                        value={bankForm.accountType}
                                        onChange={(e) => setBankForm({...bankForm, accountType: e.target.value})}
                                        className="w-full bg-slate-900/50 border border-white/10 rounded-md px-3 py-2.5 text-sm text-white focus:outline-none"
                                    >
                                        <option value="savings">Savings</option>
                                        <option value="current">Current</option>
                                        <option value="checking">Checking</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-xs text-slate-400 block mb-2">IFSC Code</label>
                                    <Input
                                        placeholder="SBIN0011548"
                                        value={bankForm.ifscCode}
                                        onChange={(e) => setBankForm({...bankForm, ifscCode: e.target.value.toUpperCase()})}
                                        className="bg-slate-900/50 border-white/10 text-white"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    onClick={handleAddBankAccount}
                                    disabled={isLoading}
                                    className="flex-1 bg-emerald-500 text-white hover:bg-emerald-500/90"
                                >
                                    {isLoading ? 'Adding...' : 'Add Bank Account'}
                                </Button>

                                <Button
                                    onClick={() => setShowAddBank(false)}
                                    variant="outline"
                                    className="border-white/10 text-white hover:bg-white/10"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    )}
                </>
            )}

            {selectedMethod === 'Crypto' && (
                <div className="text-center py-8 text-slate-400 text-sm">
                    Crypto transfer coming soon
                </div>
            )}

            {selectedMethod === 'External transfer' && (
                <div className="text-center py-8 text-slate-400 text-sm">
                    External transfer coming soon
                </div>
            )}
        </div>
    )
}
