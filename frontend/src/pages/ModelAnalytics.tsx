import React from "react";
import { useTranslation } from "react-i18next";
import { ModelDistributionChart } from "../components/analytics/ModelDistributionChart";
import { TokenRatioChart } from "../components/analytics/TokenRatioChart";
import { ModelEfficiencyChart } from "../components/analytics/ModelEfficiencyChart";
import { Cpu, Zap, Clock, Award } from "lucide-react";

export const ModelAnalytics: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-purple-200 border border-white/10">
            <Cpu className="w-3.5 h-3.5 text-purple-300" />
            AI Intelligence & Model Intelligence
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {t("analytics.title", "Analítica Detallada por Modelo y Proveedor")}
          </h1>
          <p className="text-sm text-purple-200/90 leading-relaxed">
            {t("analytics.subtitle", "Visualización avanzada de cuota de mercado, ratios de tokens e indicadores de latencia/coste por modelo LLM.")}
          </p>
        </div>
      </div>

      {/* Summary KPI Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 flex items-center gap-4 shadow-xs">
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t("analytics.topModel", "Modelo Más Utilizado")}
            </p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">
              GPT-4o (OpenAI)
            </p>
            <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
              54.1% del volumen total
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 flex items-center gap-4 shadow-xs">
          <div className="p-3 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t("analytics.mostEfficient", "Modelo Más Eficiente")}
            </p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">
              GPT-4o Mini
            </p>
            <span className="text-[11px] font-medium text-cyan-600 dark:text-cyan-400">
              $0.00015 / 1k tokens
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 flex items-center gap-4 shadow-xs">
          <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t("analytics.avgLatency", "Latencia Promedio Global")}
            </p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">
              538 ms
            </p>
            <span className="text-[11px] font-medium text-purple-600 dark:text-purple-400">
              Rango 280ms - 820ms
            </span>
          </div>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ModelDistributionChart />
        <TokenRatioChart />
      </div>

      {/* Full Width Efficiency Scatter Matrix */}
      <div className="w-full">
        <ModelEfficiencyChart />
      </div>
    </div>
  );
};
