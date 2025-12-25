"use client"

import { useState } from "react"
import { Upload, CheckCircle, AlertCircle, Camera, Phone, FileText, Home, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type VerificationStep = "identity" | "address" | "bank" | "selfie" | "phone" | "complete"
type VerificationStatus = "pending" | "in-progress" | "completed" | "rejected"

interface VerificationStepData {
    id: VerificationStep
    title: string
    description: string
    icon: any
    status: VerificationStatus
}

interface VerificationFlowProps {
    onComplete?: () => void
}

export function VerificationFlow({ onComplete }: VerificationFlowProps) {
    const [currentStep, setCurrentStep] = useState<VerificationStep>("identity")
    const [identityFront, setIdentityFront] = useState<File | null>(null)
    const [identityBack, setIdentityBack] = useState<File | null>(null)
    const [addressProof, setAddressProof] = useState<File | null>(null)
    const [bankProof, setBankProof] = useState<File | null>(null)
    const [selfieImage, setSelfieImage] = useState<File | null>(null)
    const [phoneNumber, setPhoneNumber] = useState("")
    const [otpCode, setOtpCode] = useState("")
    const [otpSent, setOtpSent] = useState(false)

    const [steps, setSteps] = useState<VerificationStepData[]>([
        {
            id: "identity",
            title: "Identity",
            description: "Upload your government-issued ID",
            icon: FileText,
            status: "in-progress"
        },
        {
            id: "address",
            title: "Address",
            description: "Upload proof of address",
            icon: Home,
            status: "pending"
        },
        {
            id: "bank",
            title: "Bank",
            description: "Upload bank statement",
            icon: CreditCard,
            status: "pending"
        },
        {
            id: "selfie",
            title: "Selfie",
            description: "Take a selfie for face match",
            icon: Camera,
            status: "pending"
        },
        {
            id: "phone",
            title: "Phone",
            description: "Verify your phone number",
            icon: Phone,
            status: "pending"
        }
    ])

    const updateStepStatus = (stepId: VerificationStep, status: VerificationStatus) => {
        setSteps(prev => prev.map(step =>
            step.id === stepId ? { ...step, status } : step
        ))
    }

    const handleFileUpload = (file: File | null, type: "identity-front" | "identity-back" | "address" | "bank" | "selfie") => {
        switch (type) {
            case "identity-front":
                setIdentityFront(file)
                break
            case "identity-back":
                setIdentityBack(file)
                break
            case "address":
                setAddressProof(file)
                break
            case "bank":
                setBankProof(file)
                break
            case "selfie":
                setSelfieImage(file)
                break
        }
    }

    const handleIdentitySubmit = () => {
        if (identityFront && identityBack) {
            updateStepStatus("identity", "completed")
            setCurrentStep("address")
            updateStepStatus("address", "in-progress")
        }
    }

    const handleAddressSubmit = () => {
        if (addressProof) {
            updateStepStatus("address", "completed")
            setCurrentStep("bank")
            updateStepStatus("bank", "in-progress")
        }
    }

    const handleBankSubmit = () => {
        if (bankProof) {
            updateStepStatus("bank", "completed")
            setCurrentStep("selfie")
            updateStepStatus("selfie", "in-progress")
        }
    }

    const handleSelfieSubmit = () => {
        if (selfieImage) {
            updateStepStatus("selfie", "completed")
            setCurrentStep("phone")
            updateStepStatus("phone", "in-progress")
        }
    }

    const handleSendOTP = () => {
        if (phoneNumber) {
            setOtpSent(true)
            alert(`OTP sent to ${phoneNumber}`)
        }
    }

    const handlePhoneSubmit = () => {
        if (otpCode.length === 6) {
            updateStepStatus("phone", "completed")
            setCurrentStep("complete")
            onComplete?.()
        }
    }

    const FileUploadBox = ({
        label,
        file,
        onFileChange,
        accept = "image/*,.pdf"
    }: {
        label: string
        file: File | null
        onFileChange: (file: File | null) => void
        accept?: string
    }) => (
        <div className="border-2 border-dashed border-white/20 rounded-lg p-6 hover:border-emerald-500/50 transition">
            <input
                type="file"
                accept={accept}
                onChange={(e) => onFileChange(e.target.files?.[0] || null)}
                className="hidden"
                id={label}
            />
            <label htmlFor={label} className="cursor-pointer block text-center">
                {file ? (
                    <div className="flex items-center justify-center gap-2 text-emerald-400">
                        <CheckCircle className="w-5 h-5" />
                        <span className="text-sm font-medium">{file.name}</span>
                    </div>
                ) : (
                    <div>
                        <Upload className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                        <p className="text-sm font-medium text-white mb-1">{label}</p>
                        <p className="text-xs text-slate-400">Click to upload or drag and drop</p>
                    </div>
                )}
            </label>
        </div>
    )

    return (
        <div className="max-w-4xl mx-auto">
            {/* Progress Steps */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    {steps.map((step, index) => (
                        <div key={step.id} className="flex items-center flex-1">
                            <div className="flex flex-col items-center flex-1">
                                <div className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center mb-2 transition",
                                    step.status === "completed" ? "bg-emerald-500 text-white" :
                                        step.status === "in-progress" ? "bg-emerald-500/20 text-emerald-400 border-2 border-emerald-500" :
                                            step.status === "rejected" ? "bg-red-500/20 text-red-400 border-2 border-red-500" :
                                                "bg-white/5 text-slate-400 border-2 border-white/10"
                                )}>
                                    {step.status === "completed" ? (
                                        <CheckCircle className="w-5 h-5" />
                                    ) : step.status === "rejected" ? (
                                        <AlertCircle className="w-5 h-5" />
                                    ) : (
                                        <step.icon className="w-5 h-5" />
                                    )}
                                </div>
                                <p className={cn(
                                    "text-xs font-medium text-center",
                                    step.status === "in-progress" ? "text-white" : "text-slate-400"
                                )}>
                                    {step.title}
                                </p>
                            </div>
                            {index < steps.length - 1 && (
                                <div className={cn(
                                    "h-0.5 flex-1 mx-2 transition",
                                    steps[index + 1].status === "completed" || steps[index + 1].status === "in-progress"
                                        ? "bg-emerald-500"
                                        : "bg-white/10"
                                )} />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Step Content */}
            <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/30 backdrop-blur-sm border border-white/10 rounded-lg p-6">
                {currentStep === "identity" && (
                    <div>
                        <h3 className="text-xl font-bold mb-2">Identity Verification</h3>
                        <p className="text-sm text-slate-400 mb-6">
                            Please upload clear photos of both sides of your government-issued ID (Passport, Driver's License, or National ID)
                        </p>
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <FileUploadBox
                                label="ID Front Side"
                                file={identityFront}
                                onFileChange={(file) => handleFileUpload(file, "identity-front")}
                            />
                            <FileUploadBox
                                label="ID Back Side"
                                file={identityBack}
                                onFileChange={(file) => handleFileUpload(file, "identity-back")}
                            />
                        </div>
                        <Button
                            onClick={handleIdentitySubmit}
                            disabled={!identityFront || !identityBack}
                            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
                        >
                            Continue to Address Verification
                        </Button>
                    </div>
                )}

                {currentStep === "address" && (
                    <div>
                        <h3 className="text-xl font-bold mb-2">Address Verification</h3>
                        <p className="text-sm text-slate-400 mb-6">
                            Upload a recent utility bill or government document showing your address (not older than 3 months)
                        </p>
                        <div className="mb-6">
                            <FileUploadBox
                                label="Proof of Address"
                                file={addressProof}
                                onFileChange={(file) => handleFileUpload(file, "address")}
                            />
                        </div>
                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                onClick={() => setCurrentStep("identity")}
                                className="flex-1"
                            >
                                Back
                            </Button>
                            <Button
                                onClick={handleAddressSubmit}
                                disabled={!addressProof}
                                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white"
                            >
                                Continue to Bank Verification
                            </Button>
                        </div>
                    </div>
                )}

                {currentStep === "bank" && (
                    <div>
                        <h3 className="text-xl font-bold mb-2">Bank Verification</h3>
                        <p className="text-sm text-slate-400 mb-6">
                            Upload a recent bank statement or bank account proof (not older than 3 months)
                        </p>
                        <div className="mb-6">
                            <FileUploadBox
                                label="Bank Statement"
                                file={bankProof}
                                onFileChange={(file) => handleFileUpload(file, "bank")}
                            />
                        </div>
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
                            <p className="text-xs text-blue-400">
                                <strong>Accepted documents:</strong> Bank statement, account verification letter, or cancelled cheque with your name and account details.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                onClick={() => setCurrentStep("address")}
                                className="flex-1"
                            >
                                Back
                            </Button>
                            <Button
                                onClick={handleBankSubmit}
                                disabled={!bankProof}
                                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white"
                            >
                                Continue to Selfie
                            </Button>
                        </div>
                    </div>
                )}

                {currentStep === "selfie" && (
                    <div>
                        <h3 className="text-xl font-bold mb-2">Selfie Verification</h3>
                        <p className="text-sm text-slate-400 mb-6">
                            Take a clear selfie holding your ID next to your face. Make sure your face is clearly visible and matches your ID photo.
                        </p>
                        <div className="mb-6">
                            <FileUploadBox
                                label="Upload Selfie with ID"
                                file={selfieImage}
                                onFileChange={(file) => handleFileUpload(file, "selfie")}
                                accept="image/*"
                            />
                        </div>
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
                            <p className="text-xs text-blue-400">
                                <strong>Tips:</strong> Ensure good lighting, remove glasses, and hold your ID clearly visible next to your face.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                onClick={() => setCurrentStep("bank")}
                                className="flex-1"
                            >
                                Back
                            </Button>
                            <Button
                                onClick={handleSelfieSubmit}
                                disabled={!selfieImage}
                                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white"
                            >
                                Continue to Phone Verification
                            </Button>
                        </div>
                    </div>
                )}

                {currentStep === "phone" && (
                    <div>
                        <h3 className="text-xl font-bold mb-2">Phone Verification</h3>
                        <p className="text-sm text-slate-400 mb-6">
                            Verify your phone number to secure your account
                        </p>
                        <div className="space-y-4 mb-6">
                            <div>
                                <label className="text-xs font-medium text-slate-300 block mb-2">Phone Number</label>
                                <div className="flex gap-2">
                                    <Input
                                        type="tel"
                                        placeholder="+1 (555) 000-0000"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        disabled={otpSent}
                                        className="flex-1 bg-slate-900 border-white/10 text-white"
                                    />
                                    <Button
                                        onClick={handleSendOTP}
                                        disabled={!phoneNumber || otpSent}
                                        className="bg-emerald-500 hover:bg-emerald-600 text-white"
                                    >
                                        {otpSent ? "Sent" : "Send OTP"}
                                    </Button>
                                </div>
                            </div>
                            {otpSent && (
                                <div>
                                    <label className="text-xs font-medium text-slate-300 block mb-2">Enter OTP Code</label>
                                    <Input
                                        type="text"
                                        placeholder="000000"
                                        maxLength={6}
                                        value={otpCode}
                                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                                        className="bg-slate-900 border-white/10 text-white text-center text-2xl tracking-widest"
                                    />
                                    <p className="text-xs text-slate-400 mt-2">
                                        Didn't receive the code? <button className="text-emerald-400 hover:underline">Resend</button>
                                    </p>
                                </div>
                            )}
                        </div>
                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                onClick={() => setCurrentStep("selfie")}
                                className="flex-1"
                            >
                                Back
                            </Button>
                            <Button
                                onClick={handlePhoneSubmit}
                                disabled={otpCode.length !== 6}
                                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white"
                            >
                                Complete Verification
                            </Button>
                        </div>
                    </div>
                )}

                {currentStep === "complete" && (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-10 h-10 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">Verification Complete!</h3>
                        <p className="text-slate-400 mb-6">
                            Your documents are being reviewed. You'll receive a notification within 24-48 hours.
                        </p>
                        <Button
                            onClick={onComplete}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white"
                        >
                            Return to Dashboard
                        </Button>
                    </div>
                )}
            </div>

            {/* Help Section */}
            {currentStep !== "complete" && (
                <div className="mt-6 text-center">
                    <p className="text-xs text-slate-400">
                        Need help? <button className="text-emerald-400 hover:underline">Contact Support</button>
                    </p>
                </div>
            )}
        </div>
    )
}
