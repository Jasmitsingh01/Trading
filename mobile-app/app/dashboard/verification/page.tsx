'use client'

import { useRouter } from "next/navigation"
import { VerificationFlow } from "@/components/dashboard/VerificationFlow"

export default function VerificationPage() {
    const router = useRouter()

    const handleComplete = () => {
        // Redirect to dashboard after completion
        router.push('/dashboard')
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950 text-white">
            <div className="max-w-6xl mx-auto p-6">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold mb-2">Account Verification</h1>
                    <p className="text-slate-400">
                        Complete your KYC verification to unlock full trading features
                    </p>
                </div>

                {/* Verification Flow */}
                <VerificationFlow onComplete={handleComplete} />
            </div>
        </div>
    )
}
