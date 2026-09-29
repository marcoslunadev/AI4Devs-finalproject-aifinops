import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { KpiCard } from "../components/KpiCard";
import { CostChart } from "../components/CostChart";
import { DrillDownTable } from "../components/DrillDownTable";
import { BudgetWarningBanner } from "../components/alerts/BudgetWarningBanner";
import {
  formatCompactCurrency,
  formatCompactNumber,
  formatCompactTokens,
} from "../utils/formatters";
import {
  useTelemetryKpis,
  useTelemetryChart,
  useTelemetryBreakdown,
} from "../hooks/useTelemetry";
import {
  KpiSkeleton,
  ChartSkeleton,
  TableSkeleton,
  ErrorState,
} from "../components/ui/Skeletons";
import {
  DollarSign,
  Zap,
  Layers,
  TrendingUp,
  Building,
  AlertCircle,
  Sparkles,
} from "lucide-react";

export const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const [chartRange] = useState<string>("30d");

  // React Query Custom Hooks
  const {
    data: kpis,
    isLoading: kpisLoading,
    isError: kpisError,
    refetch: refetchKpis,
  } = useTelemetryKpis();

  const {
    data: chartData,
    isLoading: chartLoading,
    isError: chartError,
    refetch: refetchChart,
  } = useTelemetryChart(chartRange);

  const {
    data: breakdownData,
    isLoading: breakdownLoading,
    isError: breakdownError,
    refetch: refetchBreakdown,
  } = useTelemetryBreakdown();

  const handleRetryAll = () => {
    refetchKpis();
    refetchChart();
    refetchBreakdown();
  };

  const hasGlobalError = kpisError && chartError && breakdownError;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Executive Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-indigo-200 border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Executive Overview • Live API Telemetry
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {t("header.title")}
          </h1>
          <p className="text-sm text-indigo-200/90 leading-relaxed">
            Monitoriza en tiempo real los costes de modelos LLM, consumo de tokens por organización y eficiencia operativa en toda tu infraestructura empresarial.
          </p>
        </div>
      </div>

      {/* Global Error Banner if API fails completely */}
      {hasGlobalError && (
        <ErrorState
          title="Fallo de conexión con la API Backend"
          message="No se pudo conectar con el servidor de telemetría en http://localhost:3000/api/v1/telemetry. Asegúrate de que el backend Express está iniciado."
          onRetry={handleRetryAll}
        />
      )}

      {/* Budget Warning Banners (>85% / 100% threshold alerts) */}
      <BudgetWarningBanner />

      {/* Top 6 KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-6 gap-4 sm:gap-5">
        {kpisLoading ? (
          Array.from({ length: 6 }).map((_, i) => <KpiSkeleton key={i} />)
        ) : kpisError ? (
          <div className="col-span-full">
            <ErrorState message="Error al cargar las tarjetas KPI." onRetry={refetchKpis} />
          </div>
        ) : (
          <>
            {/* KPI 1: Total Cost */}
            <KpiCard
              title={t("kpis.totalCost")}
              value={kpis?.totalCost !== undefined ? formatCompactCurrency(kpis.totalCost) : "--"}
              change={kpis?.totalCostChange}
              description={t("kpis.totalCostDesc")}
              icon={DollarSign}
              gradient="from-emerald-500 to-teal-600"
            />

            {/* KPI 2: Total Executions */}
            <KpiCard
              title={t("kpis.totalExecutions")}
              value={kpis?.totalExecutions !== undefined ? formatCompactNumber(kpis.totalExecutions) : "--"}
              change={kpis?.totalExecutionsChange}
              description={t("kpis.totalExecutionsDesc")}
              icon={Zap}
              gradient="from-indigo-500 to-blue-600"
            />

            {/* KPI 3: Total Tokens */}
            <KpiCard
              title={t("kpis.totalTokens")}
              value={kpis?.totalTokens !== undefined ? formatCompactTokens(kpis.totalTokens) : "--"}
              change={kpis?.totalTokensChange}
              description={t("kpis.totalTokensDesc")}
              icon={Layers}
              gradient="from-purple-500 to-pink-600"
            />

            {/* KPI 4: Avg Cost per Execution */}
            <KpiCard
              title={t("kpis.avgCostPerExec")}
              value={kpis?.avgCostPerExec !== undefined ? formatCompactCurrency(kpis.avgCostPerExec) : "--"}
              change={kpis?.avgCostPerExecChange}
              description={t("kpis.avgCostPerExecDesc")}
              icon={TrendingUp}
              gradient="from-amber-500 to-orange-600"
            />

            {/* KPI 5: Active Organizations */}
            <KpiCard
              title={t("kpis.activeOrgs")}
              value={kpis?.activeOrgs !== undefined ? kpis.activeOrgs : "--"}
              badgeText={kpis?.activeOrgsBadge ?? "Activas"}
              badgeVariant={kpis?.activeOrgs ? "success" : "neutral"}
              description={t("kpis.activeOrgsDesc")}
              icon={Building}
              gradient="from-cyan-500 to-blue-600"
            />

            {/* KPI 6: Error Rate */}
            <KpiCard
              title={t("kpis.errorRate")}
              value={kpis?.errorRate !== undefined ? `${kpis.errorRate}%` : "--"}
              change={kpis?.errorRateChange}
              description={t("kpis.errorRateDesc")}
              icon={AlertCircle}
              gradient="from-rose-500 to-red-600"
              badgeText={kpis?.errorRate !== undefined ? (kpis.errorRate < 1 ? "Óptimo" : "Alerta") : "--"}
              badgeVariant={kpis?.errorRate !== undefined ? (kpis.errorRate < 1 ? "success" : "danger") : "neutral"}
            />
          </>
        )}
      </div>

      {/* Main Charts Section */}
      {chartLoading ? (
        <ChartSkeleton />
      ) : chartError ? (
        <ErrorState message="Error al cargar la serie temporal." onRetry={refetchChart} />
      ) : (
        <CostChart data={chartData || []} />
      )}

      {/* Hierarchical DrillDown Table */}
      {breakdownLoading ? (
        <TableSkeleton />
      ) : breakdownError ? (
        <ErrorState message="Error al cargar la tabla jerárquica." onRetry={refetchBreakdown} />
      ) : (
        <DrillDownTable data={breakdownData || []} />
      )}
    </div>
  );
};
