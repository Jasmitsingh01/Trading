"use client"

interface Limits {
    daily: string
    monthly: string
    used: string
}

interface TradingLimitsProps {
    limits: Limits
}

export function TradingLimits({ limits }: TradingLimitsProps) {
    return (
        <div className="bg-transparent border border-white/10 rounded-lg p-5">
            <h3 className="text-sm font-bold mb-3 text-white">Limits</h3>
            <p className="text-xs text-slate-400 mb-4">Your current trading limits</p>

            <div className="space-y-4">
                <div>
                    <div className="flex items-center justify-between mb-1">
                        <div className="text-xs text-slate-400">Daily limit</div>
                        <div className="text-sm font-semibold text-white">{limits.daily}</div>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{ width: '54%' }}></div>
                    </div>
                    <div className="text-xs text-slate-500 mt-1">Used: {limits.used}</div>
                </div>

                <div>
                    <div className="flex items-center justify-between mb-1">
                        <div className="text-xs text-slate-400">Monthly limit</div>
                        <div className="text-sm font-semibold text-white">{limits.monthly}</div>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500" style={{ width: '12%' }}></div>
                    </div>
                    <div className="text-xs text-slate-500 mt-1">Used: $12,000.00</div>
                </div>
            </div>

            <button className="w-full mt-4 text-xs text-emerald-400 hover:underline text-left">
                Request limit increase
            </button>
        </div>
    )
}
