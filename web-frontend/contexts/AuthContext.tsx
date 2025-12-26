// frontend/src/contexts/AuthContext.tsx
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
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Storage keys
const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
  EXPIRES_AT: 'expiresAt',
} as const

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // ============================
  // Storage Helpers
  // ============================

  const getStorageItem = (key: string): string | null => {
    try {
      if (typeof window !== 'undefined') {
        return localStorage.getItem(key)
      }
      return null
    } catch (error) {
      console.error(`Error getting ${key}:`, error)
      return null
    }
  }

  const setStorageItem = (key: string, value: string): void => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(key, value)
      }
    } catch (error) {
      console.error(`Error setting ${key}:`, error)
    }
  }

  const removeStorageItem = (key: string): void => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(key)
      }
    } catch (error) {
      console.error(`Error removing ${key}:`, error)
    }
  }

  const clearAllStorage = (): void => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.clear()
        sessionStorage.clear()
      }
      console.log('✅ Storage cleared')
    } catch (error) {
      console.error('Error clearing storage:', error)
    }
  }

  // ============================
  // User Management
  // ============================

  const fetchUser = async (): Promise<void> => {
    try {
      setError(null)
      const token = getStorageItem(STORAGE_KEYS.AUTH_TOKEN)

      if (!token) {
        console.log('⚠️ No auth token found')
        setUser(null)
        setLoading(false)
        return
      }

      // Try to get user from API
      const response = await api.auth.getMe()

      if (response?.me) {
        setUser(response.me)

        // Update stored user data
        setStorageItem(STORAGE_KEYS.USER, JSON.stringify(response.me))

        console.log('✅ User loaded:', response.me.email)
      } else {
        // Token might be invalid
        console.warn('⚠️ Token invalid, clearing auth')
        await handleInvalidAuth()
      }
    } catch (err: any) {
      console.error('❌ Failed to fetch user:', err.message)
      setError(err.message)

      // If token is expired or invalid, clear auth
      if (err.message?.includes('token') || err.message?.includes('401')) {
        await handleInvalidAuth()
      } else {
        setUser(null)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleInvalidAuth = async (): Promise<void> => {
    setUser(null)
    clearAllStorage()

    // Only redirect if on protected route
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname
      if (
        currentPath.startsWith('/dashboard') ||
        currentPath.startsWith('/trading') ||
        currentPath.startsWith('/portfolio')
      ) {
        router.push('/auth/login')
      }
    }
  }

  // ============================
  // Authentication Actions
  // ============================

  const login = async (email: string, password: string): Promise<void> => {
    try {
      setLoading(true)
      setError(null)

      console.log('🔐 Attempting login for:', email)

      const response = await api.auth.login(email, password)

      if (response.success && response.data?.user) {
        const { user: userData, token, refreshToken, expiresAt } = response.data

        // Store authentication data
        if (token) {
          setStorageItem(STORAGE_KEYS.AUTH_TOKEN, token)
        }
        if (refreshToken) {
          setStorageItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken)
        }
        if (expiresAt) {
          setStorageItem(STORAGE_KEYS.EXPIRES_AT, expiresAt.toString())
        }

        // Store user data
        setStorageItem(STORAGE_KEYS.USER, JSON.stringify(userData))

        setUser(userData)

        console.log('✅ Login successful:', userData.email)

        // Redirect to dashboard
        router.push('/dashboard')
      } else {
        throw new Error(response.message || 'Login failed')
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Login failed. Please try again.'
      setError(errorMessage)
      console.error('❌ Login error:', errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const logout = async (): Promise<void> => {
    try {
      console.log('🚪 Logging out...')
      setLoading(true)

      // Call backend logout to invalidate session
      try {
        await api.auth.logout()
        console.log('✅ Backend logout successful')
      } catch (err) {
        console.warn('⚠️ Backend logout failed, continuing...', err)
      }

      // Clear user state
      setUser(null)
      setError(null)

      // Clear all storage
      clearAllStorage()

      console.log('✅ Logout complete')

      // Redirect to login
      router.push('/auth/login')
    } catch (err) {
      console.error('❌ Logout error:', err)

      // Force logout even on error
      setUser(null)
      clearAllStorage()
      router.push('/auth/login')
    } finally {
      setLoading(false)
    }
  }

  const refreshUser = async (): Promise<void> => {
    await fetchUser()
  }

  // ============================
  // Initial Load
  // ============================

  useEffect(() => {
    console.log('🔄 Initializing auth context...')
    fetchUser()
  }, [])

  // ============================
  // Token Refresh Timer
  // ============================

  useEffect(() => {
    if (!user) return

    const checkTokenExpiry = async () => {
      const expiresAt = getStorageItem(STORAGE_KEYS.EXPIRES_AT)
      if (!expiresAt) return

      const expiryTime = parseInt(expiresAt)
      const currentTime = Date.now()
      const timeUntilExpiry = expiryTime - currentTime

      // Refresh token 5 minutes before expiry
      if (timeUntilExpiry < 5 * 60 * 1000 && timeUntilExpiry > 0) {
        console.log('🔄 Token expiring soon, refreshing...')
        try {
          const refreshToken = getStorageItem(STORAGE_KEYS.REFRESH_TOKEN)
          if (refreshToken) {
            // Call your refresh token API here
            // const response = await api.auth.refreshToken(refreshToken)
            // Update tokens...
          }
        } catch (error) {
          console.error('Failed to refresh token:', error)
          await handleInvalidAuth()
        }
      }
    }

    // Check token expiry every minute
    const interval = setInterval(checkTokenExpiry, 60 * 1000)

    return () => clearInterval(interval)
  }, [user])

  // ============================
  // Context Value
  // ============================

  const value: AuthContextType = {
    user,
    loading,
    error,
    login,
    logout,
    refreshUser,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function useRequireAuth(): void {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login')
    }
  }, [isAuthenticated, loading, router])
}

export function useRequireGuest(): void {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, loading, router])
}
