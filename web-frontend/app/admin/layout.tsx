// frontend/app/admin/layout.tsx

'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
    LayoutDashboard,
    Users,
    DollarSign,
    Settings,
    LogOut,
    Menu,
    X,
    Bell,
    TrendingUp
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'

const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Transactions', href: '/admin/transactions', icon: DollarSign },
    { name: 'Orders', href: '/admin/orders', icon: TrendingUp },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
]

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const router = useRouter()
    const { logout } = useAuth()
    const [sidebarOpen, setSidebarOpen] = useState(false)

    const handleSignOut = async () => {
        await logout()
        router.push('/auth/login')
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 font-sans selection:bg-primary/20">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 z-50 h-full w-72 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-800/50 transform transition-transform duration-300 ease-out shadow-2xl lg:shadow-none ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center justify-between p-8">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                <TrendingUp className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                                    TradingPro
                                </h1>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Admin Panel</p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
                            onClick={() => setSidebarOpen(false)}
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-6 space-y-2 py-6">
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 px-4">
                            Menu
                        </p>
                        {navigation.map((item) => {
                            const isActive = pathname === item.href
                            return (
                                <Link key={item.name} href={item.href}>
                                    <Button
                                        variant={isActive ? 'default' : 'ghost'}
                                        className={`w-full justify-start gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 ${isActive
                                                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25 translate-x-1'
                                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white hover:translate-x-1'
                                            }`}
                                    >
                                        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-white/5">
                                            <item.icon className="h-4 w-4" />
                                        </span>
                                        <span>{item.name}</span>
                                        {isActive && (
                                            <div className="ml-auto h-1.5 w-1.5 rounded-full bg-white/50" />
                                        )}
                                    </Button>
                                </Link>
                            )
                        })}
                    </nav>

                    {/* Sign Out */}
                    <div className="p-6 border-t border-gray-200/50 dark:border-gray-800/50 bg-gray-50/50 dark:bg-gray-900/50">
                        <Button
                            onClick={handleSignOut}
                            variant="ghost"
                            className="w-full justify-between text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 border-red-200 dark:border-red-900/30"
                        >
                            <span className="flex items-center gap-2">
                                <LogOut className="h-4 w-4" />
                                <span>Sign out</span>
                            </span>
                            <span className="text-[10px] text-gray-500 dark:text-gray-400">
                                v1.0.0
                            </span>
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="lg:pl-72 transition-all duration-300">
                {/* Top Bar */}
                <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 px-6 py-4">
                    <div className="flex items-center justify-between max-w-7xl mx-auto">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden -ml-2"
                            >
                                <Menu className="h-6 w-6" />
                            </Button>
                            <span className="font-bold text-lg text-gray-900 dark:text-white lg:hidden">
                                TradingPro
                            </span>
                        </div>

                        <div className="flex items-center gap-3">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full relative"
                            >
                                <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-900" />
                            </Button>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main>{children}</main>
            </div>
        </div>
    )
}
