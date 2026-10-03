import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { useTranslation } from "react-i18next";
import { Layers } from "lucide-react";

export interface ModelTokenRatioItem {
  model: string;
  inputTokens: number; // in thousands (k)
  outputTokens: number; // in thousands (k)
  ratio: number; // e.g. 3.2 (input / output)
}

interface TokenRatioChartProps {
  data?: ModelTokenRatioItem[];
}

const DEFAULT_DATA: ModelTokenRatioItem[] = [
  { model: "GPT-4o", inputTokens: 420, outputTokens: 110, ratio: 3.8 },
  { model: "Claude 3.5", inputTokens: 310, outputTokens: 95, ratio: 3.2 },
  { model: "Gemini 1.5 Pro", inputTokens: 180, outputTokens: 40, ratio: 4.5 },
  { model: "GPT-4o Mini", inputTokens: 250, outputTokens: 85, ratio: 2.9 },
  { model: "Llama 3 70B", inputTokens: 95, outputTokens: 30, ratio: 3.1 },
];

export const TokenRatioChart: React.FC<TokenRatioChartProps> = ({
  data = DEFAULT_DATA,
}) => {
  const { t } = useTranslation();

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-6 shadow-xs space-y-4 flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            <Layers className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {t("analytics.ratioTitle", "Relación Input vs Output Tokens")}
          </h3>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {t("analytics.ratioSubtitle", "Comparativa de tokens de contexto (Entrada) frente a tokens generados (Salida) por modelo.")}
        </p>
      </div>

      <div className="h-64 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="currentColor"
              className="text-slate-200 dark:text-slate-800"
            />
            <XAxis
              dataKey="model"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "currentColor" }}
              className="text-slate-500 dark:text-slate-400"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v}k`}
              tick={{ fontSize: 11, fill: "currentColor" }}
              className="text-slate-500 dark:text-slate-400"
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const inputVal = payload[0]?.value as number;
                  const outputVal = payload[1]?.value as number;
                  const ratioVal = outputVal > 0 ? (inputVal / outputVal).toFixed(1) : "N/A";
                  return (
                    <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 p-3 rounded-xl shadow-xl text-xs space-y-1.5">
                      <p className="font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-1">
                        {label}
                      </p>
                      <div className="flex justify-between gap-4 font-mono text-indigo-600 dark:text-indigo-400">
                        <span>{t("analytics.inputTokens")}</span>
                        <span className="font-bold">{inputVal}k</span>
                      </div>
                      <div className="flex justify-between gap-4 font-mono text-purple-600 dark:text-purple-400">
                        <span>{t("analytics.outputTokens")}</span>
                        <span className="font-bold">{outputVal}k</span>
                      </div>
                      <div className="flex justify-between gap-4 font-mono text-slate-500 border-t border-slate-100 dark:border-slate-800 pt-1">
                        <span>{t("analytics.ratioInputOutput")}</span>
                        <span className="font-bold text-slate-900 dark:text-white">{ratioVal}x</span>
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
              wrapperStyle={{ paddingBottom: "8px", fontSize: "12px" }}
              formatter={(value) => (
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {value === "inputTokens" ? t("analytics.legendInput") : t("analytics.legendOutput")}
                </span>
              )}
            />
            <Bar
              dataKey="inputTokens"
              fill="#6366f1"
              radius={[4, 4, 0, 0]}
              barSize={14}
            />
            <Bar
              dataKey="outputTokens"
              fill="#a855f7"
              radius={[4, 4, 0, 0]}
              barSize={14}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
