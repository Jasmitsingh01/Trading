'use client'

import { useRef, useState, KeyboardEvent, ClipboardEvent, ChangeEvent } from 'react'
import { Input } from '@/components/ui/input'

interface OTPInputProps {
    length?: number
    onComplete: (otp: string) => void
    disabled?: boolean
}

export function OTPInput({ length = 6, onComplete, disabled = false }: OTPInputProps) {
    const [otp, setOtp] = useState<string[]>(Array(length).fill(''))
    const inputRefs = useRef<(HTMLInputElement | null)[]>([])

    const handleChange = (index: number, value: string) => {
        if (disabled) return

        // Only allow digits
        const digit = value.replace(/[^0-9]/g, '')

        if (digit.length > 1) {
            // Handle paste
            handlePaste(digit)
            return
        }

        const newOtp = [...otp]
        newOtp[index] = digit
        setOtp(newOtp)

        // Move to next input if digit entered
        if (digit && index < length - 1) {
            inputRefs.current[index + 1]?.focus()
        }

        // Check if complete
        if (newOtp.every(d => d !== '')) {
            onComplete(newOtp.join(''))
        }
    }

    const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
        if (disabled) return

        if (e.key === 'Backspace') {
            if (!otp[index] && index > 0) {
                // Move to previous input if current is empty
                inputRefs.current[index - 1]?.focus()
            } else {
                // Clear current input
                const newOtp = [...otp]
                newOtp[index] = ''
                setOtp(newOtp)
            }
        } else if (e.key === 'ArrowLeft' && index > 0) {
            inputRefs.current[index - 1]?.focus()
        } else if (e.key === 'ArrowRight' && index < length - 1) {
            inputRefs.current[index + 1]?.focus()
        }
    }

    const handlePaste = (pastedData: string) => {
        if (disabled) return

        const digits = pastedData.replace(/[^0-9]/g, '').slice(0, length)
        const newOtp = Array(length).fill('')

        for (let i = 0; i < digits.length; i++) {
            newOtp[i] = digits[i]
        }

        setOtp(newOtp)

        // Focus last filled input or first empty
        const lastIndex = Math.min(digits.length, length - 1)
        inputRefs.current[lastIndex]?.focus()

        // Check if complete
        if (newOtp.every(d => d !== '')) {
            onComplete(newOtp.join(''))
        }
    }

    const handlePasteEvent = (e: ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault()
        const pastedData = e.clipboardData.getData('text')
        handlePaste(pastedData)
    }

    return (
        <div className="flex gap-2 justify-center">
            {otp.map((digit, index) => (
                <Input
                    key={index}
                    ref={(el) => {
                        inputRefs.current[index] = el
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(index, e.target.value)}
                    onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => handleKeyDown(index, e)}
                    onPaste={handlePasteEvent}
                    disabled={disabled}
                    className="w-12 h-14 text-center text-2xl font-bold"
                    autoFocus={index === 0}
                />
            ))}
        </div>
    )
}
