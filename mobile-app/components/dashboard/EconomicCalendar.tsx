"use client"

interface Event {
    time: string
    event: string
    impact: string
}

interface EconomicCalendarProps {
    events: Event[]
}

export function EconomicCalendar({ events }: EconomicCalendarProps) {
    return (
        <div className="border border-white/10 rounded-lg p-4 bg-gradient-to-br from-slate-900/50 to-slate-800/30 backdrop-blur-sm">
            <h3 className="text-sm font-bold mb-3 text-white">Economic calendar (Today)</h3>
            <p className="text-xs text-slate-400 mb-3">Upcoming key market-moving releases</p>

            <div className="space-y-3">
                {events.map((event, idx) => (
                    <div key={idx} className="pb-3 border-b border-white/5 last:border-0">
                        <div className="flex items-start justify-between mb-1">
                            <div className="text-xs font-medium text-slate-300">{event.event}</div>
                            <div className={`text-xs font-semibold px-2 py-0.5 rounded ${event.impact === 'high'
                                ? 'bg-red-500/20 text-red-400'
                                : 'bg-yellow-500/20 text-yellow-400'
                                }`}>
                                {event.impact}
                            </div>
                        </div>
                        <div className="text-xs text-slate-500">{event.time}</div>
                    </div>
                ))}
            </div>

            <button className="w-full mt-3 text-xs text-emerald-400 hover:underline text-left">
                Event history shown in your dashboard
            </button>
        </div>
    )
}
