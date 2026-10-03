import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Building2,
  Users,
  Cpu,
  Clock,
  Coins,
  Search,
  RefreshCw,
  AlertCircle,
  FileText,
} from "lucide-react";
import { useDepartmentExecutions } from "../hooks/useTelemetry";

export const ExecutionLogsView: React.FC = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const organizationId = searchParams.get("organizationId") || undefined;

  const { data: executions, isLoading, isError, refetch } = useDepartmentExecutions(organizationId);
  const [filterText, setFilterText] = useState("");

  const filteredData = (executions || []).filter((item) => {
    const searchLower = filterText.toLowerCase();
    return (
      item.organizationName.toLowerCase().includes(searchLower) ||
      item.departmentName.toLowerCase().includes(searchLower) ||
      item.model.toLowerCase().includes(searchLower)
    );
  });

  const totalCallsCount = filteredData.reduce((acc, curr) => acc + curr.totalCalls, 0);
  const totalCostAmount = filteredData.reduce((acc, curr) => acc + curr.totalCost, 0);

  const getLatencyBadgeClass = (latencyMs: number) => {
    if (latencyMs < 1000) {
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-800/50";
    }
    if (latencyMs <= 2500) {
      return "bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-800/50";
    }
    return "bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 dark:border-rose-800/50";
  };

  const getModelBadgeStyle = (model: string) => {
    const lower = model.toLowerCase();
    if (lower.includes("gpt")) {
      return {
        className: "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-500/30 dark:border-emerald-800/60",
        dotColor: "bg-emerald-500 dark:bg-emerald-400",
      };
    }
    if (lower.includes("claude")) {
      return {
        className: "bg-amber-500/10 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-500/30 dark:border-amber-800/60",
        dotColor: "bg-amber-500 dark:bg-amber-400",
      };
    }
    if (lower.includes("gemini")) {
      return {
        className: "bg-sky-500/10 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 border-sky-500/30 dark:border-sky-800/60",
        dotColor: "bg-sky-500 dark:bg-sky-400",
      };
    }
    if (lower.includes("llama")) {
      return {
        className: "bg-purple-500/10 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-500/30 dark:border-purple-800/60",
        dotColor: "bg-purple-500 dark:bg-purple-400",
      };
    }
    return {
      className: "bg-indigo-500/10 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-500/30 dark:border-indigo-800/60",
      dotColor: "bg-indigo-500 dark:bg-indigo-400",
    };
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-500" />
            {t("executionAnalytics.title", "Desglose por Departamento y Modelo")}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t("executionAnalytics.subtitle", "Análisis detallado de ejecuciones, tokens y latencia agrupados por entidad y departamento")}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-indigo-500" />
            <span>{totalCallsCount.toLocaleString()} {t("executionAnalytics.totalCalls", "Llamadas")}</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-indigo-500/10 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/60 text-xs font-bold text-indigo-700 dark:text-indigo-300 flex items-center gap-2">
            <Coins className="w-4 h-4 text-indigo-500" />
            <span>${totalCostAmount.toFixed(2)} {t("executionAnalytics.totalCost", "Coste")}</span>
          </div>
        </div>
      </div>

      {/* Filter and Controls */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            placeholder={t("executionAnalytics.filterPlaceholder", "Filtrar por departamento o modelo...")}
            className="w-full pl-9 pr-4 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 shadow-xs transition"
          />
        </div>

        <button
          onClick={() => refetch()}
          className="p-2 rounded-xl bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800 transition shadow-xs flex items-center gap-1.5 text-xs font-semibold"
          title={t("executionAnalytics.reload", "Recargar datos")}
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{t("executionAnalytics.reload", "Recargar")}</span>
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin mx-auto" />
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              {t("executionAnalytics.loading", "Cargando métricas de ejecuciones...")}
            </p>
          </div>
        ) : isError ? (
          <div className="p-12 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
            <p className="text-sm font-semibold text-rose-600 dark:text-rose-400">
              {t("executionAnalytics.error", "Error al obtener las ejecuciones por departamento.")}
            </p>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 text-xs font-semibold bg-indigo-600 text-white rounded-xl shadow-xs hover:bg-indigo-700 transition"
            >
              {t("executionAnalytics.retry", "Reintentar")}
            </button>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <FileText className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
              {t("executionAnalytics.noData", "No se encontraron ejecuciones registradas para la selección actual.")}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200/80 dark:border-slate-800/80 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-4 sm:px-5 py-3.5 whitespace-nowrap">{t("executionAnalytics.colOrg", "Entidad / Organización")}</th>
                  <th className="px-4 sm:px-5 py-3.5 whitespace-nowrap">{t("executionAnalytics.colDept", "Departamento")}</th>
                  <th className="px-4 sm:px-5 py-3.5 whitespace-nowrap">{t("executionAnalytics.colModel", "Modelo LLM")}</th>
                  <th className="px-4 sm:px-5 py-3.5 text-right whitespace-nowrap">{t("executionAnalytics.colCalls", "Llamadas")}</th>
                  <th className="px-4 sm:px-5 py-3.5 text-right whitespace-nowrap">{t("executionAnalytics.colPromptTokens", "Prompt Tokens")}</th>
                  <th className="px-4 sm:px-5 py-3.5 text-right whitespace-nowrap">{t("executionAnalytics.colCompletionTokens", "Completion Tokens")}</th>
                  <th className="px-4 sm:px-5 py-3.5 text-right whitespace-nowrap">{t("executionAnalytics.colCost", "Coste Acumulado")}</th>
                  <th className="px-4 sm:px-5 py-3.5 text-right whitespace-nowrap">{t("executionAnalytics.colLatency", "Latencia Promedio")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/80 dark:divide-slate-800/80 text-slate-700 dark:text-slate-300">
                {filteredData.map((row) => {
                  const style = getModelBadgeStyle(row.model);
                  return (
                    <tr
                      key={row.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="px-4 sm:px-5 py-3.5 font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-indigo-500 shrink-0" />
                          <span>{row.organizationName}</span>
                        </div>
                      </td>
                      <td className="px-4 sm:px-5 py-3.5 font-medium whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{row.departmentName}</span>
                        </div>
                      </td>
                      <td className="px-4 sm:px-5 py-3.5 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold border shadow-xs whitespace-nowrap ${style.className}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${style.dotColor} shrink-0`} />
                          {row.model}
                        </span>
                      </td>
                      <td className="px-4 sm:px-5 py-3.5 text-right font-medium whitespace-nowrap">
                        {row.totalCalls.toLocaleString()}
                      </td>
                      <td className="px-4 sm:px-5 py-3.5 text-right text-slate-500 dark:text-slate-400 font-mono whitespace-nowrap">
                        {row.promptTokens.toLocaleString()}
                      </td>
                      <td className="px-4 sm:px-5 py-3.5 text-right text-slate-500 dark:text-slate-400 font-mono whitespace-nowrap">
                        {row.completionTokens.toLocaleString()}
                      </td>
                      <td className="px-4 sm:px-5 py-3.5 text-right font-bold text-slate-900 dark:text-white whitespace-nowrap">
                        ${row.totalCost.toFixed(2)}
                      </td>
                      <td className="px-4 sm:px-5 py-3.5 text-right whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getLatencyBadgeClass(row.avgLatencyMs)}`}>
                          <Clock className="w-3 h-3" />
                          {row.avgLatencyMs} ms
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
