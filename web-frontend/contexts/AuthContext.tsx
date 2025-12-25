// frontend/contexts/AuthContext.tsx

'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'

interface User {
  id: string
  fullname: string
  email: string
  phone?: string
  role: string
  accountStatus: string
  isVerified: boolean
  isKYCCompleted: boolean
  kycStatus?: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const fetchUser = async () => {
    try {
      setError(null)
      const response = await api.auth.getMe()
      
      if (response?.me) {
        setUser(response.me)
      } else {
        setUser(null)
      }
    } catch (err: any) {
      console.error('❌ Failed to fetch user:', err.message)
      setError(err.message)
      setUser(null)
      
      // If we're on a protected route, redirect to login
      const currentPath = window.location.pathname
      if (currentPath.startsWith('/dashboard')) {
        router.push('/auth/login')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await api.auth.login(email, password)
      
      if (response.success && response.data?.user) {
        setUser(response.data.user)
        
        // Store user info in localStorage for persistence
        localStorage.setItem('user', JSON.stringify(response.data.user))
        
        router.push('/dashboard')
      } else {
        throw new Error('Login failed')
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Login failed'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      console.log('🚪 Logging out...')
      
      // Call logout API (this clears cookies on backend)
      try {
        await api.auth.logout()
        console.log('✅ Backend logout successful')
      } catch (err) {
        console.warn('⚠️ Backend logout failed, but continuing...', err)
        // Continue with logout even if API fails
      }
      
      // Clear user state
      setUser(null)
      setError(null)
      
      // Clear ALL localStorage items
      localStorage.removeItem('authToken')
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('auth_token')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('expiresAt')
      
      // Optional: Clear everything
      // localStorage.clear()
      
      // Clear sessionStorage
      sessionStorage.clear()
      
      console.log('✅ Client storage cleared')
      
      // Redirect to login with hard reload
      console.log('🔄 Redirecting to login...')
      window.location.href = '/auth/login'
      
    } catch (err) {
      console.error('❌ Logout error:', err)
      
      // Force logout anyway
      setUser(null)
      localStorage.clear()
      sessionStorage.clear()
      window.location.href = '/auth/login'
    }
  }

  const refreshUser = async () => {
    await fetchUser()
  }

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
