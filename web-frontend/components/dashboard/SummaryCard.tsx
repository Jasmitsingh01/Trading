"use client"

import { cn } from "@/lib/utils"

interface SummaryCardProps {
    label: string
    value: string
    valueColor?: string
    className?: string
}

export function SummaryCard({ label, value, valueColor = "text-white", className }: SummaryCardProps) {
    return (
        <div className={cn("bg-transparent rounded-lg border border-white/5 p-4", className)}>
            <div className="text-xs text-slate-400 mb-1">{label}</div>
            <div className={cn("text-2xl font-bold", valueColor)}>{value}</div>
        </div>
    )
}
