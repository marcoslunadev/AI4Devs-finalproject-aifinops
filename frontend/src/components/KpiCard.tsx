import React from "react";
import { TrendingUp, TrendingDown, Minus, type LucideIcon } from "lucide-react";

export interface KpiCardProps {
  title: string;
  value: string | number;
  change?: number; // e.g. +12.5 or -3.2
  changePeriod?: string;
  description?: string;
  icon: LucideIcon;
  gradient?: string; // Tailwind gradient classes for icon container
  sparklineData?: number[];
  badgeText?: string;
  badgeVariant?: "neutral" | "warning" | "success" | "danger";
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  change,
  changePeriod = "vs mes anterior",
  description,
  icon: Icon,
  gradient = "from-indigo-500 to-purple-600",
  badgeText,
  badgeVariant = "neutral",
}) => {
  const isPositive = change !== undefined && change > 0;
  const isNegative = change !== undefined && change < 0;

  const getBadgeStyle = () => {
    switch (badgeVariant) {
      case "success":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20";
      case "warning":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20";
      case "danger":
        return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20";
      default:
        return "bg-slate-500/10 text-slate-600 dark:text-slate-300 border border-slate-500/20";
    }
  };

  const rawValueString = value !== undefined && value !== null ? String(value) : "--";

  return (
    <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
      {/* Subtle top accent gradient glow */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient} opacity-80 group-hover:opacity-100 transition-opacity`} />
      
      {/* Background ambient glow on hover */}
      <div className="absolute -top-10 -right-10 w-28 h-28 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500 pointer-events-none" />

      {/* Top Header: Title & Icon */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">
          {title}
        </span>
        <div className={`p-2.5 rounded-xl bg-gradient-to-br ${gradient} text-white shadow-md shrink-0 group-hover:scale-105 transition-transform duration-200`}>
          <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
      </div>

      {/* Main Value Display */}
      <div className="my-3 flex items-baseline justify-between gap-2">
        <span
          className="text-2xl sm:text-3xl xl:text-3xl font-black tracking-tight text-slate-900 dark:text-white font-mono"
          title={rawValueString}
        >
          {rawValueString}
        </span>
        {badgeText && (
          <span className={`px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide rounded-full shrink-0 ${getBadgeStyle()}`}>
            {badgeText}
          </span>
        )}
      </div>

      {/* Footer: Trend & Description */}
      <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
        {change !== undefined ? (
          <div className="flex items-center gap-1.5 font-semibold">
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold ${
                isPositive
                  ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400"
                  : isNegative
                  ? "bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400"
                  : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
              }`}
            >
              {isPositive ? (
                <TrendingUp className="w-3 h-3 mr-1" />
              ) : isNegative ? (
                <TrendingDown className="w-3 h-3 mr-1" />
              ) : (
                <Minus className="w-3 h-3 mr-1" />
              )}
              {isPositive ? `+${change}%` : `${change}%`}
            </span>
            <span className="text-slate-400 dark:text-slate-500 font-normal truncate">
              {changePeriod}
            </span>
          </div>
        ) : (
          <span className="text-slate-400 dark:text-slate-500 font-normal truncate">
            {description || "En tiempo real"}
          </span>
        )}
      </div>
    </div>
  );
};
