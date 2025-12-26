"use client"

interface WalletData {
    totalBalance: string
    available: string
    currency: string
    pl: string
}

interface WalletOverviewProps {
    data: WalletData
}

export function WalletOverview({ data }: WalletOverviewProps) {
    return (
        <div className="bg-transparent border border-white/10 rounded-lg p-6">
            <h2 className="text-lg font-bold mb-4 text-white">Wallet overview</h2>
            <p className="text-xs text-slate-400 mb-4">Available balances and holdings</p>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <div className="text-xs text-slate-400 mb-1">Total wallet value</div>
                    <div className="text-3xl font-bold text-white">{data.totalBalance}</div>
                </div>
                <div>
                    <div className="text-xs text-slate-400 mb-1">Available</div>
                    <div className="text-3xl font-bold text-white">{data.available}</div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                    <div className="text-xs text-slate-400 mb-1">P/L</div>
                    <div className="text-sm font-medium text-emerald-400">{data.pl}</div>
                </div>
                <div>
                    <div className="text-xs text-slate-400 mb-1">Account for trading</div>
                    <div className="text-sm font-medium text-slate-300">{data.currency}</div>
                </div>
            </div>

            <p className="text-xs text-slate-500">
                Available withdrawals by bank transfer to other accounts, crypto, and digital
            </p>
        </div>
    )
}
