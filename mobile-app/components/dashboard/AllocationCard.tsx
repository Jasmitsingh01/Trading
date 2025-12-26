"use client"

interface AllocationItem {
    name: string
    percent: string
    value: string
}

interface AllocationCardProps {
    allocations: AllocationItem[]
}

export function AllocationCard({ allocations }: AllocationCardProps) {
    return (
        <div className="bg-transparent rounded-lg border border-white/5 p-5 mb-6">
            <h2 className="text-lg font-bold mb-4 text-white">Allocation</h2>
            <div className="text-xs text-slate-400 mb-3">Current breakdown</div>

            {allocations.map((item, idx) => (
                <div key={idx} className="mb-4">
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-white">{item.name}</span>
                        <span className="text-sm font-bold text-white">{item.percent}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden mr-3">
                            <div
                                className={`h-full ${idx === 0 ? 'bg-orange-500' :
                                    idx === 1 ? 'bg-blue-500' :
                                        idx === 2 ? 'bg-purple-500' : 'bg-slate-400'
                                    }`}
                                style={{ width: item.percent }}
                            ></div>
                        </div>
                        <span className="text-xs text-slate-400">{item.value}</span>
                    </div>
                </div>
            ))}
        </div>
    )
}
