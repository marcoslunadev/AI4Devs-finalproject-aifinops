import React from "react";
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import { useTranslation } from "react-i18next";
import { Gauge } from "lucide-react";

export interface ModelEfficiencyItem {
  model: string;
  latencyMs: number; // Avg response time in milliseconds
  costPer1k: number; // Avg cost per 1k tokens ($)
  executions: number; // Size indicator
  color: string;
}

interface ModelEfficiencyChartProps {
  data?: ModelEfficiencyItem[];
}

const DEFAULT_DATA: ModelEfficiencyItem[] = [
  { model: "GPT-4o", latencyMs: 650, costPer1k: 0.005, executions: 450000, color: "#10a37f" },
  { model: "Claude 3.5 Sonnet", latencyMs: 820, costPer1k: 0.003, executions: 270000, color: "#d97706" },
  { model: "Gemini 1.5 Pro", latencyMs: 540, costPer1k: 0.00125, executions: 180000, color: "#4285f4" },
  { model: "GPT-4o Mini", latencyMs: 280, costPer1k: 0.00015, executions: 620000, color: "#06b6d4" },
  { model: "Llama 3 70B", latencyMs: 420, costPer1k: 0.0007, executions: 140000, color: "#a855f7" },
];

export const ModelEfficiencyChart: React.FC<ModelEfficiencyChartProps> = ({
  data = DEFAULT_DATA,
}) => {
  const { t } = useTranslation();

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-6 shadow-xs space-y-4 flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
            <Gauge className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {t("analytics.efficiencyTitle", "Matriz de Eficiencia (Latencia vs Coste)")}
          </h3>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {t("analytics.efficiencySubtitle", "Relación de velocidad de respuesta (ms) frente al coste por 1.000 tokens.")}
        </p>
      </div>

      <div className="h-64 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 20, left: -10, bottom: 10 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="currentColor"
              className="text-slate-200 dark:text-slate-800"
            />
            <XAxis
              type="number"
              dataKey="latencyMs"
              name={t("analytics.latencyAxis")}
              unit="ms"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "currentColor" }}
              className="text-slate-500 dark:text-slate-400"
            />
            <YAxis
              type="number"
              dataKey="costPer1k"
              name={t("analytics.costAxis")}
              unit="$"
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `$${v}`}
              tick={{ fontSize: 11, fill: "currentColor" }}
              className="text-slate-500 dark:text-slate-400"
            />
            <ZAxis type="number" dataKey="executions" range={[100, 400]} />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload as ModelEfficiencyItem;
                  return (
                    <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 p-3 rounded-xl shadow-xl text-xs space-y-1">
                      <p className="font-bold text-slate-900 dark:text-white">
                        {item.model}
                      </p>
                      <div className="flex justify-between gap-4 font-mono text-slate-600 dark:text-slate-400">
                        <span>{t("analytics.avgLatencyLabel")}</span>
                        <span className="font-bold text-indigo-600 dark:text-indigo-400">{item.latencyMs} ms</span>
                      </div>
                      <div className="flex justify-between gap-4 font-mono text-slate-600 dark:text-slate-400">
                        <span>{t("analytics.costPer1kLabel")}</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">${item.costPer1k}</span>
                      </div>
                      <div className="flex justify-between gap-4 font-mono text-slate-500 border-t border-slate-100 dark:border-slate-800 pt-1">
                        <span>{t("analytics.totalExecutionsLabel")}</span>
                        <span className="font-bold">{item.executions.toLocaleString()}</span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Scatter name={t("analytics.modelsScatterName")} data={data}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
