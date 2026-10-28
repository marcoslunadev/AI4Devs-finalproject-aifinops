import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  fetchAgentDetail,
  fetchAgentExecutions,
  fetchAgents,
  type AgentDetail,
  type PaginatedExecutions,
  type ExecutionStatus,
} from "../services/agentApi";
import {
  Cpu,
  ArrowLeft,
  DollarSign,
  Activity,
  Clock,
  Layers,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ZapOff,
  ChevronLeft,
  ChevronRight,
  Building2,
  Briefcase,
  Loader2,
  RefreshCw,
  Search,
} from "lucide-react";

export const AgentDetailView: React.FC = () => {
  const { agentId } = useParams<{ agentId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [agent, setAgent] = useState<AgentDetail | null>(null);
  const [executions, setExecutions] = useState<PaginatedExecutions | null>(null);
  const [allAgents, setAllAgents] = useState<AgentDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingExecutions, setIsLoadingExecutions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const limit = 10;

  // Cargar lista de agentes para navegación rápida
  useEffect(() => {
    fetchAgents()
      .then((data) => setAllAgents(data))
      .catch((err) => console.error("Error loading agent list:", err));
  }, []);

  // Cargar ficha técnica del agente seleccionado
  useEffect(() => {
    if (!agentId) return;

    let isMounted = true;
    setIsLoading(true);
    setError(null);
    setPage(1);

    fetchAgentDetail(agentId)
      .then((data) => {
        if (isMounted) {
          setAgent(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.response?.data?.error || err.message || "Error al cargar el agente.");
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [agentId]);

  // Cargar llamadas paginadas
  useEffect(() => {
    if (!agentId) return;

    let isMounted = true;
    setIsLoadingExecutions(true);

    fetchAgentExecutions(agentId, page, limit)
      .then((data) => {
        if (isMounted) {
          setExecutions(data);
          setIsLoadingExecutions(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error("Error loading executions:", err);
          setIsLoadingExecutions(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [agentId, page]);

  const renderStatusBadge = (status: ExecutionStatus) => {
    switch (status) {
      case "SUCCESS":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {t("agentDetail.statuses.SUCCESS")}
          </span>
        );
      case "ERROR":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800/60">
            <XCircle className="w-3.5 h-3.5" />
            {t("agentDetail.statuses.ERROR")}
          </span>
        );
      case "TIMEOUT":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60">
            <AlertTriangle className="w-3.5 h-3.5" />
            {t("agentDetail.statuses.TIMEOUT")}
          </span>
        );
      case "RATE_LIMIT_EXCEEDED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800/60">
            <ZapOff className="w-3.5 h-3.5" />
            {t("agentDetail.statuses.RATE_LIMIT_EXCEEDED")}
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            {status}
          </span>
        );
    }
  };

  const renderEnvironmentBadge = (env: string) => {
    const isPro = env.toUpperCase() === "PRO";
    const isPre = env.toUpperCase() === "PRE";
    return (
      <span
        className={`px-2 py-0.5 rounded text-[11px] font-bold tracking-wider ${
          isPro
            ? "bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300 border border-rose-300 dark:border-rose-800"
            : isPre
            ? "bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-300 dark:border-amber-800"
            : "bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300 border border-blue-300 dark:border-blue-800"
        }`}
      >
        {env}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] space-y-4">
        <Loader2 className="w-10 h-10 text-indigo-600 dark:text-indigo-400 animate-spin" />
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          {t("agentDetail.loadingAgent")}
        </p>
      </div>
    );
  }

  if (error || !agent) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center shadow-lg">
        <div className="w-12 h-12 mx-auto rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-4">
          <Search className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          {t("agentDetail.agentNotFound")}
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          {error || t("agentDetail.agentNotFoundDesc")}
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t("agentDetail.backToDashboard")}</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header & Breadcrumb Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition shadow-xs"
            title={t("agentDetail.backToDashboard")}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {agent.name}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                {agent.id}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {t("agentDetail.subtitle")}
            </p>
          </div>
        </div>

        {/* Quick Agent Switcher Dropdown */}
        {allAgents.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden md:inline">
              Cambiar agente:
            </span>
            <select
              value={agent.id}
              onChange={(e) => navigate(`/agents/${e.target.value}`)}
              className="text-xs font-semibold px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition shadow-xs"
            >
              {allAgents.map((ag) => (
                <option key={ag.id} value={ag.id}>
                  {ag.name} ({ag.defaultModel})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Technical Profile Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800/80 shadow-xs backdrop-blur-xs">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4 flex items-center gap-2">
          <Cpu className="w-4 h-4 text-indigo-500" />
          <span>{t("agentDetail.technicalCard")}</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800/60">
            <span className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
              {t("agentDetail.defaultModel")}
            </span>
            <span className="text-sm font-bold text-slate-900 dark:text-slate-100 font-mono">
              {agent.defaultModel}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800/60">
            <span className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
              {t("agentDetail.provider")}
            </span>
            <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
              {agent.provider}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800/60">
            <span className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <span>{t("agentDetail.organization")}</span>
            </span>
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate block">
              {agent.organization?.name || "Acme Corporation"}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800/60">
            <span className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
              <Briefcase className="w-3.5 h-3.5 text-slate-400" />
              <span>{t("agentDetail.department")}</span>
            </span>
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate block">
              {agent.department?.name || t("agentDetail.noDepartment")}
            </span>
          </div>
        </div>

        {agent.description && (
          <p className="mt-4 text-xs text-slate-500 dark:text-slate-400 leading-relaxed italic border-t border-slate-100 dark:border-slate-800/60 pt-3">
            "{agent.description}"
          </p>
        )}
      </div>

      {/* Aggregate KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Calls */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {t("agentDetail.kpis.totalCalls")}
            </span>
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {agent.metrics.totalExecutions.toLocaleString()}
          </span>
        </div>

        {/* Total Cost */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {t("agentDetail.kpis.totalCost")}
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
            ${Number(agent.metrics.totalCostUsd).toFixed(4)}
          </span>
        </div>

        {/* Avg Latency */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {t("agentDetail.kpis.avgLatency")}
            </span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
            {agent.metrics.avgLatencyMs} <span className="text-sm font-normal text-slate-400">ms</span>
          </span>
        </div>

        {/* Total Tokens */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {t("agentDetail.kpis.totalTokens")}
            </span>
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
            {Number(agent.metrics.totalTokens).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Paginated Executions Table */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between flex-wrap gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {t("agentDetail.executionsTitle")}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {t("agentDetail.executionsSubtitle")}
            </p>
          </div>

          <button
            onClick={() => {
              setIsLoadingExecutions(true);
              fetchAgentExecutions(agent.id, page, limit).then((res) => {
                setExecutions(res);
                setIsLoadingExecutions(false);
              });
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingExecutions ? "animate-spin" : ""}`} />
            <span>Refrescar</span>
          </button>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">{t("agentDetail.table.timestamp")}</th>
                <th className="py-3 px-4">{t("agentDetail.table.model")}</th>
                <th className="py-3 px-4">{t("agentDetail.table.environment")}</th>
                <th className="py-3 px-4 text-right">{t("agentDetail.table.tokens")}</th>
                <th className="py-3 px-4 text-right">{t("agentDetail.table.latency")}</th>
                <th className="py-3 px-4 text-right">{t("agentDetail.table.cost")}</th>
                <th className="py-3 px-4 text-center">{t("agentDetail.table.status")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {executions?.items && executions.items.length > 0 ? (
                executions.items.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      {new Date(item.executedAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-200">
                      {item.model}
                    </td>
                    <td className="py-3 px-4">
                      {renderEnvironmentBadge(item.environment)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-600 dark:text-slate-400">
                      <span className="text-slate-400">{item.promptTokens}</span> /{" "}
                      <span className="text-slate-400">{item.completionTokens}</span> /{" "}
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {item.totalTokens}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-700 dark:text-slate-300">
                      {item.latencyMs} ms
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      ${Number(item.costUsd).toFixed(5)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {renderStatusBadge(item.status)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="py-12 text-center text-slate-400 dark:text-slate-500 font-medium"
                  >
                    {isLoadingExecutions
                      ? "Cargando llamadas..."
                      : t("agentDetail.table.noExecutions")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {executions && executions.totalPages > 1 && (
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between flex-wrap gap-3">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {t("agentDetail.pagination.showing", {
                page: executions.page,
                totalPages: executions.totalPages,
                total: executions.total,
              })}
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                disabled={page <= 1 || isLoadingExecutions}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-xs"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>{t("agentDetail.pagination.prev")}</span>
              </button>

              <span className="px-2.5 py-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 rounded-md">
                {page}
              </span>

              <button
                onClick={() => setPage((prev) => Math.min(executions.totalPages, prev + 1))}
                disabled={page >= executions.totalPages || isLoadingExecutions}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-xs"
              >
                <span>{t("agentDetail.pagination.next")}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentDetailView;
