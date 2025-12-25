"use client"

import { CheckCircle, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Activity {
    date: string
    type: string
    asset: string
    amount: string
    status: string
}

interface RecentActivityTableProps {
    activities: Activity[]
    onViewAll?: () => void
}

export function RecentActivityTable({ activities, onViewAll }: RecentActivityTableProps) {
    return (
        <div className="border border-white/5 rounded-2xl p-6 shadow-xl">
            <div className="flex justify-between items-center mb-5">
                <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white text-xs" onClick={onViewAll}>
                    View All →
                </Button>
            </div>
            <div className="overflow-x-auto">
                {activities.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-800/50 flex items-center justify-center">
                            <Bell className="w-8 h-8 text-slate-600" />
                        </div>
                        <p className="text-slate-400 text-sm mb-2">No recent activity</p>
                        <p className="text-slate-500 text-xs">Your transactions will appear here</p>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead>
                            <tr className="text-slate-500 text-xs font-medium border-b border-white/5">
                                <th className="text-left py-3 px-4">DATE</th>
                                <th className="text-left py-3 px-4">TYPE</th>
                                <th className="text-left py-3 px-4">ASSET</th>
                                <th className="text-right py-3 px-4">AMOUNT</th>
                                <th className="text-right py-3 px-4">STATUS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {activities.map((row, idx) => (
                                <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="py-4 px-4 text-slate-400 text-sm">{row.date}</td>
                                    <td className="py-4 px-4">
                                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold ${row.type === 'BUY'
                                            ? "bg-emerald-500/10 text-emerald-400"
                                            : row.type === 'SELL'
                                                ? "bg-red-500/10 text-red-400"
                                                : "bg-blue-500/10 text-blue-400"
                                            }`}>
                                            {row.type}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 font-semibold text-white">{row.asset}</td>
                                    <td className="py-4 px-4 text-right font-semibold text-white">{row.amount}</td>
                                    <td className="py-4 px-4 text-right">
                                        <span className="inline-flex items-center gap-1 text-emerald-400 text-sm">
                                            <CheckCircle className="w-4 h-4" />
                                            {row.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}
