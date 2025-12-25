// Authentication Types

export interface OTPRequest {
    identifier: string // email or phone
    type?: 'email' | 'phone'
}

export interface OTPResponse {
    success: boolean
    message: string
    type?: 'email' | 'phone'
    identifier?: string
}

export interface VerifyOTPRequest {
    identifier: string
    code: string
}

export interface VerifyOTPResponse {
    success: boolean
    message: string
    token?: string
}

export interface User {
    id: string
    email?: string
    phone?: string
    name?: string
    createdAt: Date
}

export type VerificationStep = 'input' | 'verify' | 'success'
