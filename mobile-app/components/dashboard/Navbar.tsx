'use client'

import * as Avatar from '@radix-ui/react-avatar'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import {
  ChartLine,
  LayoutDashboard,
  Newspaper,
  PieChart,
  Settings,
  TrendingUp,
  LogOut,
  CreditCard,
  User,
} from 'lucide-react'
import { Button } from '../ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { api } from '@/lib/api'

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Trading', href: '/dashboard/trading', icon: TrendingUp },
  { label: 'Portfolio', href: '/dashboard/portfolio', icon: PieChart },
  { label: 'Market', href: '/dashboard/market', icon: ChartLine },
  { label: 'News', href: '/dashboard/news', icon: Newspaper },
  { label: 'Wallet', href: '/dashboard/wallet', icon: CreditCard },
]

const Navbar = () => {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()
  const [balance, setBalance] = useState<any>(null)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  // Fetch user balance dynamically
  useEffect(() => {
    if (!user) return

    const fetchBalance = async () => {
      try {
        const result = await api.user.getBalance()
        setBalance(result?.userBalance || result)
      } catch (err) {
        console.error('Error fetching balance:', err)
      }
    }

    fetchBalance()
  }, [user])

  // Handle logout with loading state
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      await logout()
      // Router redirect is handled in AuthContext
    } catch (err) {
      console.error('Logout error:', err)
      // Even if logout API fails, redirect to login
      router.push('/auth/login')
    } finally {
      setIsLoggingOut(false)
    }
  }

  const totalBalance = balance?.totalBalance || 0
  const totalProfit = balance?.totalProfit || 0
  const totalInvested = balance?.totalInvested || 0
  const changePercent = totalInvested ? ((totalProfit / totalInvested) * 100) : 0

  return (
    <aside className="flex h-screen w-64 flex-col bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950 text-foreground">
      {/* Brand + user */}
      <div className="flex items-center gap-3 border-b border-white/5 px-4 py-4">
        <Link href="/dashboard/profile" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500/10 ring-1 ring-emerald-500/40">
            <Avatar.Root className="h-9 w-9 overflow-hidden rounded-full">
              <Avatar.Image
                src={user?.avatar || "https://github.com/shadcn.png"}
                className="h-full w-full object-cover"
              />
              <Avatar.Fallback className="flex h-full w-full items-center justify-center bg-emerald-500 text-xs font-semibold text-white">
                {user?.fullname?.split(' ').map(n => n[0]).join('').toUpperCase() || 'JD'}
              </Avatar.Fallback>
            </Avatar.Root>
          </div>
          <div className="flex flex-col">
            <p className="text-sm font-semibold tracking-tight">{user?.fullname || 'John Doe'}</p>
            <p className="text-[11px] text-muted-foreground">
              {user?.email || 'john.doe@example.com'}
            </p>
          </div>
        </Link>
      </div>

      {/* Balance / equity quick info - DYNAMIC */}
      <div className="border-b border-white/5 px-4 py-3">
        <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          Account equity
        </p>
        <p className="mt-1 text-lg font-semibold">${totalBalance.toFixed(2)}</p>
        <p className={`text-xs ${changePercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
          {changePercent >= 0 ? '+' : ''}{changePercent.toFixed(2)}% today
        </p>
      </div>

      {/* Main navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-4">
        <p className="mb-2 px-2 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Trading
        </p>
        <div className="flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? 'default' : 'ghost'}
                  size="sm"
                  className={`w-full justify-start gap-2 rounded-lg px-2 text-sm ${isActive
                      ? 'bg-emerald-500 text-white hover:bg-emerald-500/90'
                      : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                    }`}
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-md bg-white/5">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span>{item.label}</span>
                </Button>
              </Link>
            )
          })}
        </div>

        {/* Secondary section */}
        <div className="mt-6">
          <p className="mb-2 px-2 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Preferences
          </p>
          <div className="flex flex-col gap-1">
            <Link href="/dashboard/profile">
              <Button
                variant={pathname === '/dashboard/profile' ? 'default' : 'ghost'}
                size="sm"
                className={`w-full justify-start gap-2 rounded-lg px-2 text-sm ${pathname === '/dashboard/profile'
                    ? 'bg-emerald-500 text-white hover:bg-emerald-500/90'
                    : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                  }`}
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-white/5">
                  <User className="h-4 w-4" />
                </span>
                <span>Profile</span>
              </Button>
            </Link>
            <Link href="/dashboard/settings">
              <Button
                variant={pathname === '/dashboard/settings' ? 'default' : 'ghost'}
                size="sm"
                className={`w-full justify-start gap-2 rounded-lg px-2 text-sm ${pathname === '/dashboard/settings'
                    ? 'bg-emerald-500 text-white hover:bg-emerald-500/90'
                    : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                  }`}
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-white/5">
                  <Settings className="h-4 w-4" />
                </span>
                <span>Settings</span>
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Bottom: session / version */}
      <div className="border-t border-white/5 px-3 py-3">
        <Button
          onClick={handleLogout}
          disabled={isLoggingOut}
          variant="ghost"
          size="sm"
          className="w-full justify-between rounded-lg px-2 text-xs text-muted-foreground hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="flex items-center gap-2">
            <LogOut className={`h-4 w-4 ${isLoggingOut ? 'animate-spin' : ''}`} />
            <span>{isLoggingOut ? 'Signing out...' : 'Sign out'}</span>
          </span>

        </Button>
      </div>
    </aside>
  )
}

export default Navbar
