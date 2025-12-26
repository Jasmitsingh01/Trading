"use client"

import { Copy } from "lucide-react"

interface AccountInfo {
    name: string
    accountNumber: string
    routingNumber: string
    bankName: string
}

interface AccountDetailsProps {
    info: AccountInfo
}

export function AccountDetails({ info }: AccountDetailsProps) {
    return (
        <div className="bg-transparent border border-white/10 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white">Account holder details</h2>
                <button className="text-xs text-emerald-400 hover:underline">Edit</button>
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                <div>
                    <div className="text-xs text-slate-400 mb-1">Account holder name</div>
                    <div className="text-sm font-medium text-white flex items-center gap-2">
                        {info.name}
                        <Copy className="w-3.5 h-3.5 text-slate-400 cursor-pointer hover:text-white" />
                    </div>
                </div>
                <div>
                    <div className="text-xs text-slate-400 mb-1">Account number</div>
                    <div className="text-sm font-medium text-white flex items-center gap-2">
                        {info.accountNumber}
                        <Copy className="w-3.5 h-3.5 text-slate-400 cursor-pointer hover:text-white" />
                    </div>
                </div>
                <div>
                    <div className="text-xs text-slate-400 mb-1">Routing number</div>
                    <div className="text-sm font-medium text-white flex items-center gap-2">
                        {info.routingNumber}
                        <Copy className="w-3.5 h-3.5 text-slate-400 cursor-pointer hover:text-white" />
                    </div>
                </div>
                <div>
                    <div className="text-xs text-slate-400 mb-1">Bank name</div>
                    <div className="text-sm font-medium text-white">{info.bankName}</div>
                </div>
            </div>

            <p className="text-xs text-slate-500 mt-4">
                Use the above details when transferring to accounts through banks, portals and crypto
            </p>
        </div>
    )
}
