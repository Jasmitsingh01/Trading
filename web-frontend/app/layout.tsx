// frontend/src/app/layout.tsx
'use client'

import { useEffect } from 'react'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { Toaster } from 'sonner'
import { initializeApp, isNativePlatform, getPlatform } from '@/lib/capacitor'

const inter = Inter({ subsets: ['latin'] })

// Note: metadata must be exported from a server component
// Move metadata to a separate file or handle differently for Capacitor

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    // Initialize Capacitor when app loads
    const init = async () => {
      await initializeApp()

      // Add mobile-specific classes to body
      if (isNativePlatform()) {
        document.body.classList.add('mobile-app')
        document.body.classList.add(`platform-${getPlatform()}`)
      }
    }

    init()

    // Prevent default touch behaviors on mobile
    if (isNativePlatform()) {
      document.addEventListener('touchmove', (e) => {
        // Prevent pull-to-refresh but allow scrolling
        if ((e.target as HTMLElement).closest('.scrollable')) {
          return
        }
      }, { passive: false })
    }

    return () => {
      // Cleanup listeners
    }
  }, [])

  return (
    <html lang="en" className={isNativePlatform() ? 'mobile-platform' : ''}>
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"
        />
        <meta name="theme-color" content="#10b981" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="mobile-web-app-capable" content="yes" />
        <title>TradeVault - Trading Platform</title>
        <meta name="description" content="Advanced trading platform for crypto and forex" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster
            position={isNativePlatform() ? "top-center" : "top-right"}
            richColors
            expand={false}
            closeButton
          />
        </AuthProvider>
      </body>
    </html>
  )
}
