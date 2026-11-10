import React from "react";
import { useTranslation } from "react-i18next";
import { ModelDistributionChart } from "../components/analytics/ModelDistributionChart";
import { TokenRatioChart } from "../components/analytics/TokenRatioChart";
import { ModelEfficiencyChart } from "../components/analytics/ModelEfficiencyChart";
import { useProviderDistribution } from "../hooks/useTelemetry";
import { type ProviderDistributionItem } from "../components/analytics/ModelDistributionChart";
import { Cpu, Zap, Clock, Award } from "lucide-react";

export const ModelAnalytics: React.FC = () => {
  const { t } = useTranslation();
  const { data: providerDistribution = [] } = useProviderDistribution();
  const distributionData: ProviderDistributionItem[] = providerDistribution.map((item) => ({
    ...item,
    provider: formatProviderName(item.provider),
    color: providerColor(item.provider),
  }));

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner MarcosLunaDev */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#080b11] via-[#0f1420] to-[#171e2e] p-6 sm:p-8 text-white shadow-2xl border border-cyan-500/25">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-32 -mb-10 w-60 h-60 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 backdrop-blur-md text-xs font-semibold font-heading">
            <Cpu className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
            {t("analytics.badge", "AI Intelligence & Model Intelligence")}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight font-heading bg-gradient-to-r from-white via-slate-100 to-cyan-200 bg-clip-text text-transparent">
            {t("analytics.title")}
          </h1>
          <p className="text-sm text-slate-300/90 leading-relaxed font-sans">
            {t("analytics.subtitle")}
          </p>
        </div>
      </div>

      {/* Summary KPI Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0f1420] border border-slate-200/80 dark:border-white/10 flex items-center gap-4 shadow-xs hover:border-emerald-500/40 transition">
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-heading">
              {t("analytics.topModel")}
            </p>
            <p className="text-lg font-bold text-slate-900 dark:text-white font-mono">
              GPT-4o (OpenAI)
            </p>
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 font-mono">
              {t("analytics.topModelVolume")}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#0f1420] border border-slate-200/80 dark:border-white/10 flex items-center gap-4 shadow-xs hover:border-cyan-500/40 transition">
          <div className="p-3 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-heading">
              {t("analytics.mostEfficient")}
            </p>
            <p className="text-lg font-bold text-slate-900 dark:text-white font-mono">
              GPT-4o Mini
            </p>
            <span className="text-[11px] font-semibold text-cyan-600 dark:text-cyan-400 font-mono">
              {t("analytics.mostEfficientCost")}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#0f1420] border border-slate-200/80 dark:border-white/10 flex items-center gap-4 shadow-xs hover:border-teal-500/40 transition">
          <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-heading">
              {t("analytics.avgLatency")}
            </p>
            <p className="text-lg font-bold text-slate-900 dark:text-white font-mono">
              538 ms
            </p>
            <span className="text-[11px] font-semibold text-teal-600 dark:text-teal-400 font-mono">
              {t("analytics.latencyRange")}
            </span>
          </div>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ModelDistributionChart data={distributionData} />
        <TokenRatioChart />
      </div>

      {/* Full Width Efficiency Scatter Matrix */}
      <div className="w-full">
        <ModelEfficiencyChart />
      </div>
    </div>
  );
};

function formatProviderName(provider: string): string {
  const names: Record<string, string> = {
    OPENAI: "OpenAI",
    ANTHROPIC: "Anthropic",
    GEMINI: "Google Gemini",
    GOOGLE: "Google Gemini",
    META: "Meta / Bedrock",
  };
  return names[provider.toUpperCase()] ?? provider;
}

function providerColor(provider: string): string {
  const colors: Record<string, string> = {
    OPENAI: "#10a37f",
    ANTHROPIC: "#d97706",
    GEMINI: "#4285f4",
    GOOGLE: "#4285f4",
    META: "#a855f7",
  };
  return colors[provider.toUpperCase()] ?? "#06b6d4";
}
