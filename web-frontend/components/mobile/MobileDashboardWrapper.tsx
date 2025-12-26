'use client'

import { useEffect, useState } from 'react'
import { RefreshCw } from 'lucide-react'

interface MobileDashboardWrapperProps {
    children: React.ReactNode
    onRefresh?: () => Promise<void>
}

export function MobileDashboardWrapper({ children, onRefresh }: MobileDashboardWrapperProps) {
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [pullDistance, setPullDistance] = useState(0)
    const [startY, setStartY] = useState(0)
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleTouchStart = (e: React.TouchEvent) => {
        if (!isMobile || !onRefresh) return
        const touch = e.touches[0]
        setStartY(touch.clientY)
    }

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isMobile || !onRefresh || isRefreshing) return

        const touch = e.touches[0]
        const currentY = touch.clientY
        const distance = currentY - startY

        // Only allow pull down when at top of page
        const scrollTop = (e.currentTarget as HTMLElement).scrollTop
        if (scrollTop === 0 && distance > 0) {
            setPullDistance(Math.min(distance, 100))
        }
    }

    const handleTouchEnd = async () => {
        if (!isMobile || !onRefresh) return

        if (pullDistance > 80) {
            setIsRefreshing(true)

            try {
                await onRefresh()
            } catch (error) {
                console.error('Refresh failed:', error)
            } finally {
                setIsRefreshing(false)
            }
        }

        setPullDistance(0)
        setStartY(0)
    }

    if (!isMobile) {
        return <>{children}</>
    }

    return (
        <div
            className="mobile-dashboard scrollable h-full overflow-y-auto"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            {/* Pull to refresh indicator */}
            {onRefresh && (
                <div
                    className="flex justify-center items-center transition-all duration-200 ease-out"
                    style={{
                        height: pullDistance > 0 ? `${pullDistance}px` : '0px',
                        opacity: pullDistance / 100,
                    }}
                >
                    <RefreshCw
                        className={`text-emerald-500 ${isRefreshing ? 'animate-spin' : ''}`}
                        style={{
                            transform: `rotate(${pullDistance * 3.6}deg)`,
                        }}
                        size={24}
                    />
                </div>
            )}

            {/* Dashboard content */}
            <div className="dashboard-content">
                {children}
            </div>
        </div>
    )
}
