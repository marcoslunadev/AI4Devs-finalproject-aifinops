import React from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import { useTranslation } from "react-i18next";
import { PieChart as PieChartIcon } from "lucide-react";

export interface ProviderDistributionItem {
  provider: string;
  cost: number;
  share: number; // percentage
  color: string;
}

interface ModelDistributionChartProps {
  data?: ProviderDistributionItem[];
}

const DEFAULT_DATA: ProviderDistributionItem[] = [
  { provider: "OpenAI (GPT-4o / GPT-4o-mini)", cost: 2450.8, share: 54.1, color: "#10a37f" },
  { provider: "Anthropic (Claude 3.5 Sonnet)", cost: 1240.5, share: 27.4, color: "#d97706" },
  { provider: "Google (Gemini 1.5 Pro)", cost: 580.2, share: 12.8, color: "#4285f4" },
  { provider: "Meta / Bedrock (Llama 3)", cost: 257.0, share: 5.7, color: "#a855f7" },
];

export const ModelDistributionChart: React.FC<ModelDistributionChartProps> = ({
  data = DEFAULT_DATA,
}) => {
  const { t } = useTranslation();

  const totalCost = React.useMemo(
    () => data.reduce((acc, item) => acc + item.cost, 0),
    [data]
  );

  return (
    <div className="rounded-2xl bg-white dark:bg-[#0f1420] border border-slate-200/80 dark:border-white/10 p-6 shadow-xs space-y-4 flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
            <PieChartIcon className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">
            {t("analytics.distributionTitle", "Distribución por Proveedor")}
          </h3>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {t("analytics.distributionSubtitle", "Cuota de mercado y gasto total acumulado por proveedor de LLMs.")}
        </p>
      </div>

      <div className="h-64 w-full relative">
        {/* Center label inside Donut */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-6">
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-heading">
            Total
          </span>
          <span className="text-xl font-extrabold text-slate-900 dark:text-white font-mono">
            ${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        </div>

        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={95}
              paddingAngle={4}
              dataKey="cost"
              nameKey="provider"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload as ProviderDistributionItem;
                  return (
                    <div className="bg-white/95 dark:bg-[#0f1420]/95 backdrop-blur-md border border-slate-200 dark:border-white/10 p-3 rounded-xl shadow-xl text-xs space-y-1">
                      <p className="font-bold text-slate-800 dark:text-slate-200">
                        {item.provider}
                      </p>
                      <div className="flex justify-between gap-4 font-mono">
                        <span className="text-slate-500">{t("analytics.spend")}</span>
                        <span className="font-bold text-slate-900 dark:text-white">
                          ${item.cost.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between gap-4 font-mono">
                        <span className="text-slate-500">{t("analytics.share")}</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                          {item.share}%
                        </span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value, entry: any) => (
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  {value} ({entry.payload.share}%)
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
