// frontend/src/app/layout.tsx
'use client'

import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <meta name="theme-color" content="#10b981" />
        <title>BXTPRO - Trading Platform</title>
        <meta name="description" content="Advanced trading platform for crypto and forex" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            richColors
            expand={false}
            closeButton
          />
        </AuthProvider>
      </body>
    </html>
  )
}
