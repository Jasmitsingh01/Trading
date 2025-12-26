'use client'

import { usePathname, useRouter } from 'next/navigation'
import { Home, TrendingUp, Wallet, User, BarChart3 } from 'lucide-react'
import { hapticImpact } from '@/lib/capacitor'

export function MobileBottomNav() {
    const pathname = usePathname()
    const router = useRouter()

    const navItems = [
        { icon: Home, label: 'Home', path: '/dashboard' },
        { icon: BarChart3, label: 'Market', path: '/dashboard/market' },
        { icon: TrendingUp, label: 'Trading', path: '/dashboard/trading' },
        { icon: Wallet, label: 'Wallet', path: '/dashboard/wallet' },
        { icon: User, label: 'Profile', path: '/dashboard/profile' },
    ]

    const handleNavClick = async (path: string) => {
        await hapticImpact('light')
        router.push(path)
    }

    return (
        <nav className="mobile-nav fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 z-50">
            <div className="flex justify-around items-center px-2 py-2 pb-safe">
                {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.path || pathname?.startsWith(item.path + '/')

                    return (
                        <button
                            key={item.path}
                            onClick={() => handleNavClick(item.path)}
                            className={`flex flex-col items-center justify-center flex-1 py-2 px-3 rounded-lg transition-all duration-200 haptic-feedback ${isActive
                                    ? 'text-emerald-500'
                                    : 'text-slate-400 hover:text-slate-300'
                                }`}
                        >
                            <Icon
                                size={24}
                                className={`mb-1 ${isActive ? 'stroke-[2.5]' : 'stroke-[2]'}`}
                            />
                            <span className={`text-xs font-medium ${isActive ? 'font-semibold' : ''}`}>
                                {item.label}
                            </span>

                            {/* Active indicator */}
                            {isActive && (
                                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-emerald-500 rounded-b-full" />
                            )}
                        </button>
                    )
                })}
            </div>
        </nav>
    )
}
