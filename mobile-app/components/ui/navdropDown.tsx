'use client'

import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { ChevronDown, Home, Info, Mail, Settings, User, Shield, FileText, Phone, TrendingUp, BarChart3, Globe, LucideIcon } from 'lucide-react'
import Link from 'next/link'
import { ReactNode } from 'react'

export interface DropdownItem {
    label: string
    description?: string
    href: string
    icon?: string
    iconColor?: string
    separator?: boolean
}

export interface NavDropDownProps {
    trigger?: string | ReactNode
    items: DropdownItem[]
    align?: 'start' | 'center' | 'end'
    className?: string
    triggerClassName?: string
    contentClassName?: string
}

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
    home: Home,
    info: Info,
    mail: Mail,
    settings: Settings,
    user: User,
    shield: Shield,
    filetext: FileText,
    phone: Phone,
    trendingup: TrendingUp,
    barchart: BarChart3,
    globe: Globe,
}

// Icon color mapping matching login page gradient style
const iconColorMap: Record<string, { bg: string, text: string, hoverBg: string }> = {
    blue: { bg: 'bg-blue-500/10', text: 'text-blue-500', hoverBg: 'group-hover:bg-blue-500/20' },
    purple: { bg: 'bg-purple-500/10', text: 'text-purple-500', hoverBg: 'group-hover:bg-purple-500/20' },
    green: { bg: 'bg-green-500/10', text: 'text-green-500', hoverBg: 'group-hover:bg-green-500/20' },
    orange: { bg: 'bg-orange-500/10', text: 'text-orange-500', hoverBg: 'group-hover:bg-orange-500/20' },
    pink: { bg: 'bg-pink-500/10', text: 'text-pink-500', hoverBg: 'group-hover:bg-pink-500/20' },
    primary: { bg: 'bg-primary/10', text: 'text-primary', hoverBg: 'group-hover:bg-primary/20' },
}

export const NavdropDown = ({
    trigger = 'Menu',
    items,
    align = 'start',
    className = '',
    triggerClassName = '',
    contentClassName = ''
}: NavDropDownProps) => {
    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
                <button
                    className={`
                        group inline-flex items-center justify-center gap-1 
                        px-3 py-2
                        rounded
                        bg-transparent
                        text-gray-300 hover:text-white
                        font-medium text-sm
                        transition-all duration-200
                        focus:outline-none
                        ${triggerClassName}
                    `}
                >
                    {typeof trigger === 'string' ? (
                        <>
                            {trigger}
                            <ChevronDown className="w-3.5 h-3.5 transition-transform duration-200 group-data-[state=open]:rotate-180 opacity-70" />
                        </>
                    ) : (
                        trigger
                    )}
                </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
                <DropdownMenu.Content
                    className={`
                        bg-[#0a0e27]/90
                        rounded-2xl 
                        shadow-2xl 
                        border border-white/10
                        backdrop-blur-xl
                        p-2
                        z-50
                        min-w-[320px]
                        animate-in fade-in-0 zoom-in-95 slide-in-from-top-2
                        data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95
                        overflow-hidden
                        ${contentClassName}
                    `}
                    align={align}
                    sideOffset={8}
                >
                    {/* Purple Glow Effect */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-purple-600/20 blur-3xl pointer-events-none" />

                    <div className="relative p-2">
                        {items.map((item, index) => {
                            const IconComponent = item.icon ? iconMap[item.icon.toLowerCase()] : null

                            return (
                                <div key={index}>
                                    <DropdownMenu.Item asChild>
                                        <Link
                                            href={item.href}
                                            className={`
                                                group flex items-start gap-4 
                                                px-4 py-3 rounded-xl
                                                text-white
                                                hover:bg-white/5
                                                outline-none cursor-pointer
                                                transition-all duration-200
                                                ${className}
                                            `}
                                        >
                                            {IconComponent && (
                                                <div className={`
                                                    mt-0.5 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                                                    bg-[#1e293b] group-hover:bg-[#334155]
                                                    text-blue-400 group-hover:text-blue-300
                                                    transition-colors duration-200
                                                    border border-white/5
                                                `}>
                                                    <IconComponent className="w-4 h-4" strokeWidth={2} />
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <div className="font-medium text-white text-sm mb-0.5">
                                                    {item.label}
                                                </div>
                                                {item.description && (
                                                    <div className="text-xs text-gray-400 leading-relaxed line-clamp-2">
                                                        {item.description}
                                                    </div>
                                                )}
                                            </div>
                                        </Link>
                                    </DropdownMenu.Item>
                                </div>
                            )
                        })}
                    </div>
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    )
}
