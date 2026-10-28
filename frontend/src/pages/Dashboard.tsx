import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { KpiCard } from "../components/KpiCard";
import { CostChart } from "../components/CostChart";
import { DrillDownTable } from "../components/DrillDownTable";
import { BudgetWarningBanner } from "../components/alerts/BudgetWarningBanner";
import { GlobalFilterBar } from "../components/GlobalFilterBar";
import {
  formatCompactCurrency,
  formatCompactNumber,
  formatCompactTokens,
} from "../utils/formatters";
import {
  useTelemetryKpis,
  useTelemetryChart,
  useTelemetryBreakdown,
  useTelemetryStatus,
} from "../hooks/useTelemetry";
import { type TelemetryFilterParams } from "../services/telemetryApi";
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
  RefreshCw,
  Clock,
} from "lucide-react";

import { useSyncFilterParams } from "../hooks/useSyncFilterParams";

export const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const filters = useSyncFilterParams();
  const organizationId = filters.organizationId || undefined;
  const chartRange = filters.range;

  const filterParams: TelemetryFilterParams = useMemo(
    () => ({
      organizationId,
      environment: filters.environment,
      provider: filters.provider,
      models: filters.selectedModels,
    }),
    [
      organizationId,
      filters.environment,
      filters.provider,
      filters.selectedModels,
    ]
  );

  // React Query Custom Hooks
  const {
    data: kpis,
    isLoading: kpisLoading,
    isError: kpisError,
    refetch: refetchKpis,
  } = useTelemetryKpis(filterParams);

  const {
    data: chartData,
    isLoading: chartLoading,
    isError: chartError,
    refetch: refetchChart,
  } = useTelemetryChart(chartRange, filterParams);

  const {
    data: breakdownData,
    isLoading: breakdownLoading,
    isError: breakdownError,
    refetch: refetchBreakdown,
  } = useTelemetryBreakdown(filterParams);


  const { data: telemetryStatus } = useTelemetryStatus();

  const handleRetryAll = () => {
    refetchKpis();
    refetchChart();
    refetchBreakdown();
  };

  const hasGlobalError = kpisError && chartError && breakdownError;

  const formatDate = (isoStr?: string | null) => {
    if (!isoStr) return null;
    try {
      const d = new Date(isoStr);
      return d.toLocaleString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return null;
    }
  };

  const formattedLastUpdated = formatDate(telemetryStatus?.lastIngestedAt);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Executive Welcome Banner MarcosLunaDev */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#080b11] via-[#0f1420] to-[#171e2e] border border-cyan-500/25 p-6 sm:p-8 text-white shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-28 -mb-10 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-3 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 backdrop-blur-md text-xs font-semibold font-heading">
              <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
              {t("header.badge", "Executive Overview • Live API Telemetry")}
            </div>

            {telemetryStatus?.status === "PROCESSING" ? (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-200 border border-amber-400/30 backdrop-blur-md text-xs font-bold animate-pulse">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-300" />
                {t("dashboard.ingesting", "Ingestando nuevos datos...")}
              </div>
            ) : formattedLastUpdated ? (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 backdrop-blur-md text-xs font-medium">
                <Clock className="w-3.5 h-3.5 text-emerald-300" />
                {t("dashboard.lastUpdated", { time: formattedLastUpdated, defaultValue: `Última actualización: ${formattedLastUpdated}h` })}
              </div>
            ) : null}
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-heading bg-gradient-to-r from-white via-slate-100 to-cyan-200 bg-clip-text text-transparent">
            {t("header.title")}
          </h1>
          <p className="text-sm text-slate-300/90 leading-relaxed">
            {t("dashboard.welcomeDescription")}
          </p>
        </div>
      </div>

      {/* Global Error Banner if API fails completely */}
      {hasGlobalError && (
        <ErrorState
          title={t("errors.backendConnectionTitle")}
          message={t("errors.backendConnectionMessage")}
          onRetry={handleRetryAll}
        />
      )}

      {/* Global Filter Bar (Dates, Organization, Environment, AI Models) */}
      <GlobalFilterBar />

      {/* Budget Warning Banners (>85% / 100% threshold alerts) */}
      <BudgetWarningBanner />

      {/* Top 6 KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-6 gap-4 sm:gap-5">
        {kpisLoading ? (
          Array.from({ length: 6 }).map((_, i) => <KpiSkeleton key={i} />)
        ) : kpisError ? (
          <div className="col-span-full">
            <ErrorState message={t("errors.kpisLoad")} onRetry={refetchKpis} />
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
              gradient="from-cyan-500 to-teal-500"
            />

            {/* KPI 2: Total Executions */}
            <KpiCard
              title={t("kpis.totalExecutions")}
              value={kpis?.totalExecutions !== undefined ? formatCompactNumber(kpis.totalExecutions) : "--"}
              change={kpis?.totalExecutionsChange}
              description={t("kpis.totalExecutionsDesc")}
              icon={Zap}
              gradient="from-teal-500 to-emerald-500"
            />

            {/* KPI 3: Total Tokens */}
            <KpiCard
              title={t("kpis.totalTokens")}
              value={kpis?.totalTokens !== undefined ? formatCompactTokens(kpis.totalTokens) : "--"}
              change={kpis?.totalTokensChange}
              description={t("kpis.totalTokensDesc")}
              icon={Layers}
              gradient="from-cyan-500 to-blue-500"
            />

            {/* KPI 4: Avg Cost per Execution */}
            <KpiCard
              title={t("kpis.avgCostPerExec")}
              value={kpis?.avgCostPerExec !== undefined ? formatCompactCurrency(kpis.avgCostPerExec) : "--"}
              change={kpis?.avgCostPerExecChange}
              description={t("kpis.avgCostPerExecDesc")}
              icon={TrendingUp}
              gradient="from-emerald-500 to-teal-600"
            />

            {/* KPI 5: Active Organizations */}
            <KpiCard
              title={t("kpis.activeOrgs")}
              value={kpis?.activeOrgs !== undefined ? kpis.activeOrgs : "--"}
              badgeText={kpis?.activeOrgsBadge ?? t("kpis.active")}
              badgeVariant={kpis?.activeOrgs ? "success" : "neutral"}
              description={t("kpis.activeOrgsDesc")}
              icon={Building}
              gradient="from-cyan-400 to-emerald-500"
            />

            {/* KPI 6: Error Rate */}
            <KpiCard
              title={t("kpis.errorRate")}
              value={kpis?.errorRate !== undefined ? `${kpis.errorRate}%` : "--"}
              change={kpis?.errorRateChange}
              description={t("kpis.errorRateDesc")}
              icon={AlertCircle}
              gradient="from-rose-500 to-red-600"
              badgeText={kpis?.errorRate !== undefined ? (kpis.errorRate < 1 ? t("kpis.optimal") : t("kpis.alert")) : "--"}
              badgeVariant={kpis?.errorRate !== undefined ? (kpis.errorRate < 1 ? "success" : "danger") : "neutral"}
            />
          </>
        )}
      </div>

      {/* Main Charts Section */}
      {chartLoading ? (
        <ChartSkeleton />
      ) : chartError ? (
        <ErrorState message={t("errors.chartLoad")} onRetry={refetchChart} />
      ) : (
        <CostChart
          data={chartData || []}
          timeRange={filters.range}
          onTimeRangeChange={(range) => filters.setRange(range as any)}
        />
      )}

      {/* Hierarchical DrillDown Table */}
      {breakdownLoading ? (
        <TableSkeleton />
      ) : breakdownError ? (
        <ErrorState message="Error al cargar la tabla jerárquica." onRetry={refetchBreakdown} />
      ) : (
        <DrillDownTable
          data={breakdownData || []}
          environmentFilter={filters.environment}
        />
      )}
    </div>
  );
};
