import React, { useState } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { useTranslation } from "react-i18next";
import { Calendar, DollarSign } from "lucide-react";

export interface ChartDataPoint {
  date: string;
  cost: number; // in USD
  tokens: number; // in thousands (k-tokens)
  executions: number;
}

interface CostChartProps {
  data: ChartDataPoint[];
  timeRange?: string;
  onTimeRangeChange?: (range: "7d" | "30d" | "90d") => void;
}

export const CostChart: React.FC<CostChartProps> = ({
  data,
  timeRange: externalTimeRange,
  onTimeRangeChange,
}) => {
  const { t } = useTranslation();
  const [internalTimeRange, setInternalTimeRange] = useState<"7d" | "30d" | "90d">("30d");

  const activeRange = (externalTimeRange as "7d" | "30d" | "90d") || internalTimeRange;

  const handleRangeChange = (range: "7d" | "30d" | "90d") => {
    setInternalTimeRange(range);
    if (onTimeRangeChange) {
      onTimeRangeChange(range);
    }
  };

  // Filter data based on selected range (or use data as-is if driven by parent API request)
  const filteredData = React.useMemo(() => {
    if (onTimeRangeChange) return data;
    if (activeRange === "7d") return data.slice(-7);
    if (activeRange === "30d") return data.slice(-30);
    return data;
  }, [data, activeRange, onTimeRangeChange]);

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-6 shadow-xs space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <DollarSign className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {t("charts.costEvolutionTitle")}
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t("charts.costEvolutionSubtitle")}
          </p>
        </div>

        {/* Time range selector */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700/80 self-start sm:self-auto">
          <Calendar className="w-3.5 h-3.5 text-slate-400 ml-2 mr-1" />
          <button
            onClick={() => handleRangeChange("7d")}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
              activeRange === "7d"
                ? "bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            7D
          </button>
          <button
            onClick={() => handleRangeChange("30d")}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
              activeRange === "30d"
                ? "bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            30D
          </button>
          <button
            onClick={() => handleRangeChange("90d")}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
              activeRange === "90d"
                ? "bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            90D
          </button>
        </div>
      </div>

      {/* Chart visualization */}
      {filteredData.length === 0 ? (
        <div className="h-72 w-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-950/40">
          <Calendar className="w-8 h-8 mb-2 opacity-40 text-indigo-500" />
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t("charts.noDataTitle")}</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{t("charts.noDataSubtitle")}</p>
        </div>
      ) : (
        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={filteredData}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="costGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="tokenGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0.05} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="currentColor"
              className="text-slate-200 dark:text-slate-800"
            />

            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "currentColor" }}
              className="text-slate-500 dark:text-slate-400"
            />

            {/* Left YAxis: Cost ($) */}
            <YAxis
              yAxisId="cost"
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `$${v}`}
              tick={{ fontSize: 11, fill: "currentColor" }}
              className="text-slate-500 dark:text-slate-400"
            />

            {/* Right YAxis: Tokens (k-Tokens) */}
            <YAxis
              yAxisId="tokens"
              orientation="right"
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v}k`}
              tick={{ fontSize: 11, fill: "currentColor" }}
              className="text-slate-500 dark:text-slate-400"
            />

            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 p-3 rounded-xl shadow-xl text-xs space-y-2 min-w-36">
                      <p className="font-bold text-slate-700 dark:text-slate-300 border-b border-slate-100 dark:border-slate-800 pb-1">
                        {label}
                      </p>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-indigo-600 dark:text-indigo-400 font-semibold">
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-indigo-500" />
                            {t("charts.legendCost")}:
                          </span>
                          <span>${payload[0]?.value}</span>
                        </div>
                        <div className="flex items-center justify-between text-purple-600 dark:text-purple-400 font-semibold">
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-purple-500" />
                            {t("charts.legendTokens")}:
                          </span>
                          <span>{payload[1]?.value}k</span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            <Legend
              verticalAlign="top"
              align="right"
              wrapperStyle={{ paddingBottom: "12px", fontSize: "12px" }}
              formatter={(value) => {
                const label = value === "cost" ? t("charts.legendCost") : t("charts.legendTokens");
                return (
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {label}
                  </span>
                );
              }}
            />

            <Area
              yAxisId="cost"
              type="monotone"
              dataKey="cost"
              stroke="#6366f1"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#costGradient)"
            />

            <Bar
              yAxisId="tokens"
              dataKey="tokens"
              fill="url(#tokenGradient)"
              radius={[4, 4, 0, 0]}
              barSize={12}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      )}
    </div>
  );
};
