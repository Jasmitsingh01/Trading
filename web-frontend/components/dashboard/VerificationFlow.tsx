"use client"

import { useState } from "react"
import { Upload, CheckCircle, AlertCircle, Camera as CameraIcon, Phone, FileText, Home, CreditCard, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { CameraService, CapturedImage } from "@/lib/camera"
import { isNativePlatform } from "@/lib/capacitor"
import { toast } from "sonner"

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

interface CapturedDocument {
    file: File | null
    preview: string | null
    capturedImage: CapturedImage | null
}

export function VerificationFlow({ onComplete }: VerificationFlowProps) {
    const [currentStep, setCurrentStep] = useState<VerificationStep>("identity")
    const [identityFront, setIdentityFront] = useState<CapturedDocument>({ file: null, preview: null, capturedImage: null })
    const [identityBack, setIdentityBack] = useState<CapturedDocument>({ file: null, preview: null, capturedImage: null })
    const [addressProof, setAddressProof] = useState<CapturedDocument>({ file: null, preview: null, capturedImage: null })
    const [bankProof, setBankProof] = useState<CapturedDocument>({ file: null, preview: null, capturedImage: null })
    const [selfieImage, setSelfieImage] = useState<CapturedDocument>({ file: null, preview: null, capturedImage: null })
    const [phoneNumber, setPhoneNumber] = useState("")
    const [otpCode, setOtpCode] = useState("")
    const [otpSent, setOtpSent] = useState(false)
    const [uploading, setUploading] = useState(false)

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
            icon: CameraIcon,
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

    // Camera capture handler
    const handleCameraCapture = async (
        setter: React.Dispatch<React.SetStateAction<CapturedDocument>>,
        documentType: string
    ) => {
        try {
            // Check permissions
            const hasPermission = await CameraService.checkPermissions()
            if (!hasPermission) {
                const granted = await CameraService.requestPermissions()
                if (!granted) {
                    toast.error('Camera permission is required')
                    return
                }
            }

            setUploading(true)

            // Capture image
            const capturedImage = await CameraService.pickImage(85)
            
            // Convert to File for compatibility
            const blob = await fetch(capturedImage.dataUrl).then(r => r.blob())
            const file = new File([blob], capturedImage.fileName, { type: `image/${capturedImage.format}` })

            setter({
                file,
                preview: capturedImage.dataUrl,
                capturedImage
            })

            toast.success(`${documentType} captured successfully`)
        } catch (error: any) {
            console.error('Camera capture error:', error)
            toast.error(error.message || 'Failed to capture image')
        } finally {
            setUploading(false)
        }
    }

    // File upload handler (fallback for web)
    const handleFileUpload = async (
        file: File | null,
        setter: React.Dispatch<React.SetStateAction<CapturedDocument>>
    ) => {
        if (!file) return

        try {
            const reader = new FileReader()
            reader.onloadend = () => {
                setter({
                    file,
                    preview: reader.result as string,
                    capturedImage: null
                })
            }
            reader.readAsDataURL(file)
        } catch (error) {
            console.error('File upload error:', error)
            toast.error('Failed to upload file')
        }
    }

    const handleIdentitySubmit = () => {
        if (identityFront.file && identityBack.file) {
            updateStepStatus("identity", "completed")
            setCurrentStep("address")
            updateStepStatus("address", "in-progress")
        }
    }

    const handleAddressSubmit = () => {
        if (addressProof.file) {
            updateStepStatus("address", "completed")
            setCurrentStep("bank")
            updateStepStatus("bank", "in-progress")
        }
    }

    const handleBankSubmit = () => {
        if (bankProof.file) {
            updateStepStatus("bank", "completed")
            setCurrentStep("selfie")
            updateStepStatus("selfie", "in-progress")
        }
    }

    const handleSelfieSubmit = () => {
        if (selfieImage.file) {
            updateStepStatus("selfie", "completed")
            setCurrentStep("phone")
            updateStepStatus("phone", "in-progress")
        }
    }

    const handleSendOTP = () => {
        if (phoneNumber) {
            setOtpSent(true)
            toast.success(`OTP sent to ${phoneNumber}`)
        }
    }

    const handlePhoneSubmit = () => {
        if (otpCode.length === 6) {
            updateStepStatus("phone", "completed")
            setCurrentStep("complete")
            onComplete?.()
        }
    }

    const CameraUploadBox = ({
        label,
        document,
        onCapture,
        onFileUpload,
        description
    }: {
        label: string
        document: CapturedDocument
        onCapture: () => void
        onFileUpload: (file: File | null) => void
        description?: string
    }) => (
        <div className="border-2 border-dashed border-white/20 rounded-lg overflow-hidden hover:border-emerald-500/50 transition">
            {document.preview ? (
                // Preview uploaded/captured image
                <div className="relative group">
                    <img
                        src={document.preview}
                        alt={label}
                        className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                        <Button
                            size="sm"
                            onClick={onCapture}
                            className="bg-emerald-500 hover:bg-emerald-600"
                            disabled={uploading}
                        >
                            <CameraIcon className="w-4 h-4 mr-1" />
                            Retake
                        </Button>
                    </div>
                    <div className="absolute top-2 right-2 bg-emerald-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Uploaded
                    </div>
                </div>
            ) : (
                // Upload options
                <div className="p-6">
                    <div className="text-center mb-4">
                        <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-3">
                            <ImageIcon className="w-6 h-6 text-slate-400" />
                        </div>
                        <p className="text-sm font-medium text-white mb-1">{label}</p>
                        {description && (
                            <p className="text-xs text-slate-400">{description}</p>
                        )}
                    </div>

                    {isNativePlatform() ? (
                        // Mobile: Show camera button
                        <Button
                            onClick={onCapture}
                            disabled={uploading}
                            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
                        >
                            {uploading ? (
                                <>
                                    <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <CameraIcon className="w-4 h-4 mr-2" />
                                    Capture Photo
                                </>
                            )}
                        </Button>
                    ) : (
                        // Web: Show file input and camera button
                        <div className="space-y-2">
                            <Button
                                onClick={onCapture}
                                disabled={uploading}
                                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
                            >
                                <CameraIcon className="w-4 h-4 mr-2" />
                                Take Photo
                            </Button>
                            <div className="relative">
                                <input
                                    type="file"
                                    accept="image/*,.pdf"
                                    onChange={(e) => onFileUpload(e.target.files?.[0] || null)}
                                    className="hidden"
                                    id={`file-${label}`}
                                />
                                <label htmlFor={`file-${label}`}>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full"
                                        asChild
                                    >
                                        <span>
                                            <Upload className="w-4 h-4 mr-2" />
                                            Upload File
                                        </span>
                                    </Button>
                                </label>
                            </div>
                        </div>
                    )}
                </div>
            )}
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
                            Take clear photos of both sides of your government-issued ID (Passport, Driver's License, or National ID)
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <CameraUploadBox
                                label="ID Front Side"
                                document={identityFront}
                                onCapture={() => handleCameraCapture(setIdentityFront, "ID Front")}
                                onFileUpload={(file) => handleFileUpload(file, setIdentityFront)}
                                description="Clear photo of front side"
                            />
                            <CameraUploadBox
                                label="ID Back Side"
                                document={identityBack}
                                onCapture={() => handleCameraCapture(setIdentityBack, "ID Back")}
                                onFileUpload={(file) => handleFileUpload(file, setIdentityBack)}
                                description="Clear photo of back side"
                            />
                        </div>
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
                            <p className="text-xs text-blue-400">
                                <strong>Tips:</strong> Ensure good lighting, keep document flat, capture all edges clearly, and avoid glare.
                            </p>
                        </div>
                        <Button
                            onClick={handleIdentitySubmit}
                            disabled={!identityFront.file || !identityBack.file}
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
                            Capture or upload a recent utility bill or government document showing your address (not older than 3 months)
                        </p>
                        <div className="mb-6">
                            <CameraUploadBox
                                label="Proof of Address"
                                document={addressProof}
                                onCapture={() => handleCameraCapture(setAddressProof, "Address Proof")}
                                onFileUpload={(file) => handleFileUpload(file, setAddressProof)}
                                description="Utility bill, bank statement, or tax document"
                            />
                        </div>
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
                            <p className="text-xs text-blue-400">
                                <strong>Accepted documents:</strong> Utility bill, bank statement, government letter, or tax document with your current address.
                            </p>
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
                                disabled={!addressProof.file}
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
                            Capture or upload a recent bank statement or bank account proof (not older than 3 months)
                        </p>
                        <div className="mb-6">
                            <CameraUploadBox
                                label="Bank Statement"
                                document={bankProof}
                                onCapture={() => handleCameraCapture(setBankProof, "Bank Statement")}
                                onFileUpload={(file) => handleFileUpload(file, setBankProof)}
                                description="Bank statement or account proof"
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
                                disabled={!bankProof.file}
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
                        <div className="mb-6 max-w-md mx-auto">
                            <CameraUploadBox
                                label="Selfie with ID"
                                document={selfieImage}
                                onCapture={() => handleCameraCapture(setSelfieImage, "Selfie")}
                                onFileUpload={(file) => handleFileUpload(file, setSelfieImage)}
                                description="Hold your ID next to your face"
                            />
                        </div>
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
                            <p className="text-xs text-blue-400">
                                <strong>Tips:</strong> Ensure good lighting, remove glasses and hat, look straight at camera, and hold your ID clearly visible next to your face.
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
                                disabled={!selfieImage.file}
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
