// frontend/src/components/mobile/MobileWrapper.tsx
'use client'

import { useEffect, useState } from 'react'
import { isNativePlatform, isIOS, isAndroid } from '@/lib/capacitor'
import { Network } from '@capacitor/network'

export function MobileWrapper({ children }: { children: React.ReactNode }) {
    const [isOnline, setIsOnline] = useState(true)

    useEffect(() => {
        if (!isNativePlatform()) return

        // Monitor network status
        const setupNetworkListener = async () => {
            const status = await Network.getStatus()
            setIsOnline(status.connected)

            Network.addListener('networkStatusChange', (status) => {
                setIsOnline(status.connected)
            })
        }

        setupNetworkListener()

        return () => {
            Network.removeAllListeners()
        }
    }, [])

    return (
        <>
            {!isOnline && isNativePlatform() && (
                <div className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white text-center py-2 text-sm">
                    No internet connection
                </div>
            )}
            {children}
        </>
    )
}
