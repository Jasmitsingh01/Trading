import * as React from "react"
import { Search } from "lucide-react"
import { Input, InputProps } from "./input"
import { cn } from "@/lib/utils"

export interface SearchInputProps extends InputProps { }

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
    ({ className, ...props }, ref) => {
        return (
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                    className={cn(
                        "pl-10 bg-white/5 border-white/10 text-white placeholder-slate-400 focus-visible:ring-emerald-500/50",
                        className
                    )}
                    ref={ref}
                    {...props}
                />
            </div>
        )
    }
)
SearchInput.displayName = "SearchInput"

export { SearchInput }
