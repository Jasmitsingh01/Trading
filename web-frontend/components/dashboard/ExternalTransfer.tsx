"use client"

export function ExternalTransfer() {
    return (
        <div className="bg-transparent border border-white/10 rounded-lg p-6">
            <h2 className="text-lg font-bold mb-2 text-white">External transfer (Available)</h2>
            <p className="text-xs text-slate-400 mb-4">
                Currently in markets that's used is enabled
            </p>

            <div className="space-y-2">
                <div className="flex items-center justify-between py-2 border-b border-white/5">
                    <div className="text-sm text-slate-300">PayPal connected here</div>
                    <button className="text-xs text-emerald-400 hover:underline">Connect</button>
                </div>
                <div className="flex items-center justify-between py-2">
                    <div className="text-sm text-slate-300">Venmo (not connected)</div>
                    <button className="text-xs text-emerald-400 hover:underline">Connect</button>
                </div>
            </div>

            <p className="text-xs text-slate-500 mt-4">
                Learn more about payment authorization for crypto (and on Shopchain)
            </p>
        </div>
    )
}
