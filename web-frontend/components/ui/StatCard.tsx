import { Card } from "./card";
import { ArrowUpRight, ArrowDownRight, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  change?: string;
  isPositive?: boolean;
  icon: LucideIcon;
  color: "emerald" | "blue" | "amber" | "purple";
  subtext?: string;
  action?: React.ReactNode;
}

export function StatCard({ label, value, change, isPositive, icon: Icon, color, subtext, action }: StatCardProps) {
  const colorStyles = {
    emerald: {
      bg: "bg-emerald-500/10",
      text: "text-emerald-400",
      border: "border-emerald-500/20",
      shadow: "hover:shadow-emerald-500/10",
      blur: "bg-emerald-500/10",
    },
    blue: {
      bg: "bg-blue-500/10",
      text: "text-blue-400",
      border: "border-blue-500/20",
      shadow: "hover:shadow-blue-500/10",
      blur: "bg-blue-500/10",
    },
    amber: {
      bg: "bg-amber-500/10",
      text: "text-amber-400",
      border: "border-amber-500/20",
      shadow: "hover:shadow-amber-500/10",
      blur: "bg-amber-500/10",
    },
    purple: {
      bg: "bg-purple-500/10",
      text: "text-purple-400",
      border: "border-purple-500/20",
      shadow: "hover:shadow-purple-500/10",
      blur: "bg-purple-500/10",
    },
  };

  const styles = colorStyles[color];

  return (
    <div className={cn(
      "relative overflow-hidden rounded-2xl p-6 shadow-xl transition-all group border border-white/5",
      styles.shadow
    )}>
      <div className={cn(
        "absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl transition-all group-hover:opacity-100 opacity-50",
        styles.blur
      )}></div>
      <div className="relative">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm text-slate-400 mb-1">{label}</p>
            <h3 className="text-3xl font-bold text-white">{value}</h3>
          </div>
          <div className={cn("p-3 rounded-xl", styles.bg)}>
            <Icon className={cn("w-5 h-5", styles.text)} />
          </div>
        </div>

        {(change || subtext) && (
          <div className="flex items-center gap-2">
            {change && (
              <span className={cn("text-sm font-semibold flex items-center", isPositive ? "text-emerald-400" : "text-red-400")}>
                {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                {change}
              </span>
            )}
            {subtext && <span className="text-slate-500 text-xs">{subtext}</span>}
          </div>
        )}

        {action && (
          <div className="mt-4">
            {action}
          </div>
        )}
      </div>
    </div>
  );
}
