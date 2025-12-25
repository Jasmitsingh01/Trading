"use client"

import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "./button"

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    title: string
    children: React.ReactNode
    className?: string
}

export function Modal({ isOpen, onClose, title, children, className }: ModalProps) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className={cn(
                "relative w-full max-w-lg overflow-hidden rounded-xl border border-white/10 bg-slate-950 p-6 shadow-2xl animate-in zoom-in-95 duration-200",
                className
            )}>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-white">{title}</h2>
                    <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 text-slate-400 hover:text-white">
                        <X className="h-4 w-4" />
                    </Button>
                </div>
                <div className="text-slate-300">
                    {children}
                </div>
            </div>
        </div>
    )
}
