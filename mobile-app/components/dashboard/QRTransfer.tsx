// frontend/src/components/dashboard/QRTransfer.tsx
'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Upload, Check, AlertCircle } from 'lucide-react'
import { api } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'

interface QRTransferProps {
    onDepositComplete?: () => void | Promise<void>;
}

export function QRTransfer({ onDepositComplete }: QRTransferProps) {
    const { user } = useAuth()
    const [amount, setAmount] = useState('')
    const [screenshot, setScreenshot] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [isUploading, setIsUploading] = useState(false)
    const [transactionId, setTransactionId] = useState('')

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error('File size must be less than 5MB')
                return
            }

            if (!file.type.startsWith('image/')) {
                toast.error('Please upload an image file')
                return
            }

            setScreenshot(file)
            setPreviewUrl(URL.createObjectURL(file))
        }
    }

    const handleSubmit = async () => {
        if (!user) {
            toast.error('Please login to make a deposit')
            return
        }

        if (!amount || parseFloat(amount) <= 0) {
            toast.error('Please enter a valid amount')
            return
        }

        if (!screenshot) {
            toast.error('Please upload payment screenshot')
            return
        }

        if (!transactionId.trim()) {
            toast.error('Please enter transaction ID')
            return
        }

        try {
            setIsUploading(true)

            // Create FormData for file upload
            const formData = new FormData()
            formData.append('amount', amount)
            formData.append('currency', 'INR')
            formData.append('paymentMethod', 'upi')
            formData.append('transactionId', transactionId)
            formData.append('proofDocument', screenshot)
            formData.append('bankDetails', JSON.stringify({
                upiId: 'Inderpal.773@upi',
                method: 'UPI'
            }))

            // Upload deposit request
            const result = await api.transactions.createDepositWithFile(formData)

            toast.success('Payment submitted successfully! Admin will verify soon.')

            // Reset form
            setAmount('')
            setTransactionId('')
            setScreenshot(null)
            setPreviewUrl(null)

            // Refresh dashboard
            if (onDepositComplete) {
                await onDepositComplete();
            } else {
                setTimeout(() => {
                    window.location.reload()
                }, 1500)
            }

        } catch (error: any) {
            console.error('Upload error:', error)
            toast.error(error.message || 'Failed to submit payment')
        } finally {
            setIsUploading(false)
        }
    }

    return (
        <div className="bg-transparent backdrop-blur-sm border border-white/10 rounded-lg p-6">
            <h3 className="text-sm font-bold mb-4 text-white">UPI Payment - Quick Deposit</h3>

            <div className="grid grid-cols-2 gap-6">
                {/* Left Side - QR Code */}
                <div className="space-y-4">
                    <div className="bg-white p-4 rounded-lg">
                        <Image
                            src="/QRCode.jpg"
                            alt="UPI QR Code"
                            width={200}
                            height={200}
                            className="w-full h-auto"
                        />
                    </div>
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3">
                        <p className="text-xs font-semibold text-emerald-400 mb-1">UPI ID</p>
                        <p className="text-sm font-mono text-white">Inderpal.773@upi</p>
                    </div>
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                        <p className="text-xs font-semibold text-blue-400 mb-1">Bank Details</p>
                        <div className="space-y-1 text-xs text-slate-300">
                            <p><span className="text-slate-500">Bank:</span> SBI</p>
                            <p><span className="text-slate-500">A/C:</span> 44620349829</p>
                            <p><span className="text-slate-500">IFSC:</span> SBIN0011548</p>
                            <p><span className="text-slate-500">Name:</span> INDRAPAL</p>
                        </div>
                    </div>
                </div>

                {/* Right Side - Payment Form */}
                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-medium text-slate-300 block mb-2">
                            Amount (INR)
                        </label>
                        <Input
                            type="number"
                            placeholder="Enter amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="bg-slate-900 border-white/10 text-white"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-medium text-slate-300 block mb-2">
                            Transaction ID / UTR Number
                        </label>
                        <Input
                            type="text"
                            placeholder="Enter transaction ID"
                            value={transactionId}
                            onChange={(e) => setTransactionId(e.target.value)}
                            className="bg-slate-900 border-white/10 text-white"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-medium text-slate-300 block mb-2">
                            Upload Payment Screenshot
                        </label>
                        <div className="border-2 border-dashed border-white/10 rounded-lg p-4 text-center hover:border-emerald-500/50 transition cursor-pointer"
                            onClick={() => document.getElementById('screenshot-input')?.click()}
                        >
                            {previewUrl ? (
                                <div className="relative">
                                    <img src={previewUrl} alt="Screenshot preview" className="max-h-32 mx-auto rounded" />
                                    <div className="absolute top-2 right-2 bg-emerald-500 rounded-full p-1">
                                        <Check className="w-4 h-4 text-white" />
                                    </div>
                                </div>
                            ) : (
                                <div className="py-4">
                                    <Upload className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                                    <p className="text-xs text-slate-400">Click to upload screenshot</p>
                                    <p className="text-xs text-slate-500 mt-1">Max size: 5MB</p>
                                </div>
                            )}
                        </div>
                        <input
                            id="screenshot-input"
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="hidden"
                        />
                    </div>

                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 flex gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                        <div className="text-xs text-amber-300">
                            <p className="font-semibold mb-1">Important:</p>
                            <p>After payment, upload screenshot for verification. Funds will be added within 5-10 minutes after admin approval.</p>
                        </div>
                    </div>

                    <Button
                        onClick={handleSubmit}
                        disabled={isUploading || !amount || !screenshot || !transactionId}
                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isUploading ? (
                            <span className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Submitting...
                            </span>
                        ) : (
                            'Submit Payment Proof'
                        )}
                    </Button>
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-xs text-slate-400">
                    💡 <span className="font-semibold">How it works:</span> Scan QR code → Pay amount → Take screenshot → Upload here → Admin verifies → Funds added to wallet
                </p>
            </div>
        </div>
    )
}
