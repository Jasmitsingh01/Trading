"use client"

interface Transaction {
    type: string
    date: string
    amount: string
}

interface WalletActivityProps {
    transactions: Transaction[]
}

export function WalletActivity({ transactions }: WalletActivityProps) {
    return (
        <div className="bg-transparent border border-white/10 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white">Recent activity</h2>
                <button className="px-3 py-1 bg-white/5 text-slate-300 rounded text-xs font-medium hover:bg-white/10 hover:text-white transition">
                    History
                </button>
            </div>
            <p className="text-xs text-slate-400 mb-4">Most recent transactions and movements</p>

            <div className="space-y-3">
                {transactions.map((tx, idx) => (
                    <div key={idx} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                        <div>
                            <div className="text-sm font-medium text-white">{tx.type}</div>
                            <div className="text-xs text-slate-400">{tx.date}</div>
                        </div>
                        <div className={`text-sm font-semibold ${tx.amount.startsWith('+') ? 'text-emerald-400' : 'text-slate-300'
                            }`}>
                            {tx.amount}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
