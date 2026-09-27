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
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40";
      case "warning":
        return "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40";
      case "danger":
        return "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200 dark:border-rose-800/40";
      default:
        return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700";
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-5 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
      {/* Background glow on hover */}
      <div className="absolute -top-12 -right-12 w-24 h-24 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />

      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {value}
            </span>
            {badgeText && (
              <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${getBadgeStyle()}`}>
                {badgeText}
              </span>
            )}
          </div>
        </div>

        {/* Icon Badge */}
        <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} text-white shadow-md shadow-indigo-500/10 shrink-0`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {/* Trend & Description */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs">
        {change !== undefined ? (
          <div className="flex items-center gap-1.5 font-medium">
            <span
              className={`inline-flex items-center px-1.5 py-0.5 rounded-md text-[11px] font-bold ${
                isPositive
                  ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/80 dark:text-emerald-400"
                  : isNegative
                  ? "bg-rose-50 text-rose-600 dark:bg-rose-950/80 dark:text-rose-400"
                  : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
              }`}
            >
              {isPositive ? (
                <TrendingUp className="w-3 h-3 mr-0.5" />
              ) : isNegative ? (
                <TrendingDown className="w-3 h-3 mr-0.5" />
              ) : (
                <Minus className="w-3 h-3 mr-0.5" />
              )}
              {isPositive ? `+${change}%` : `${change}%`}
            </span>
            <span className="text-slate-400 dark:text-slate-500 font-normal">
              {changePeriod}
            </span>
          </div>
        ) : (
          <span className="text-slate-400 dark:text-slate-500">
            {description || "Actualizado en tiempo real"}
          </span>
        )}
      </div>
    </div>
  );
};
