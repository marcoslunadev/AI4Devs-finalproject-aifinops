import { useQuery } from "@tanstack/react-query";
import {
  fetchTelemetryKpis,
  fetchTelemetryChart,
  fetchTelemetryBreakdown,
  fetchTelemetryStatus,
  fetchOrganizations,
  fetchDepartmentExecutions,
  fetchProviderDistribution,
  type TelemetryKpis,
  type TelemetryStatus,
  type OrganizationItem,
  type DepartmentExecution,
  type ProviderDistribution,
  type TelemetryFilterParams,
} from "../services/telemetryApi";
import { type ChartDataPoint } from "../components/CostChart";
import { type DrillDownNode } from "../components/DrillDownTable";

export function useOrganizations() {
  return useQuery<OrganizationItem[], Error>({
    queryKey: ["telemetry", "organizations"],
    queryFn: fetchOrganizations,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}

export function useTelemetryKpis(filters?: TelemetryFilterParams) {
  return useQuery<TelemetryKpis, Error>({
    queryKey: ["telemetry", "kpis", filters?.organizationId || "all", filters?.environment || "ALL", filters?.provider || "all", filters?.models?.join(",") || "all"],
    queryFn: () => fetchTelemetryKpis(filters),
    staleTime: 60 * 1000,
    retry: 2,
  });
}

export function useTelemetryChart(range: string = "30d", filters?: TelemetryFilterParams) {
  return useQuery<ChartDataPoint[], Error>({
    queryKey: ["telemetry", "chart", range, filters?.organizationId || "all", filters?.environment || "ALL", filters?.provider || "all", filters?.models?.join(",") || "all"],
    queryFn: () => fetchTelemetryChart(range, filters),
    staleTime: 60 * 1000,
    retry: 2,
  });
}

export function useTelemetryBreakdown(filters?: TelemetryFilterParams) {
  return useQuery<DrillDownNode[], Error>({
    queryKey: ["telemetry", "breakdown", filters?.organizationId || "all", filters?.environment || "ALL", filters?.provider || "all", filters?.models?.join(",") || "all"],
    queryFn: () => fetchTelemetryBreakdown(filters),
    staleTime: 60 * 1000,
    retry: 2,
  });
}

export function useDepartmentExecutions(organizationId?: string) {
  return useQuery<DepartmentExecution[], Error>({
    queryKey: ["telemetry", "department-executions", organizationId || "all"],
    queryFn: () => fetchDepartmentExecutions(organizationId),
    staleTime: 60 * 1000,
    retry: 2,
  });
}

export function useProviderDistribution(filters?: TelemetryFilterParams) {
  return useQuery<ProviderDistribution[], Error>({
    queryKey: [
      "telemetry",
      "provider-distribution",
      filters?.organizationId || "all",
      filters?.environment || "ALL",
      filters?.provider || "all",
      filters?.models?.join(",") || "all",
    ],
    queryFn: () => fetchProviderDistribution(filters),
    staleTime: 60 * 1000,
    retry: 2,
  });
}

export function useTelemetryStatus() {
  return useQuery<TelemetryStatus, Error>({
    queryKey: ["telemetry", "status"],
    queryFn: fetchTelemetryStatus,
    staleTime: 5 * 1000,
    refetchInterval: (query) => (query.state.data?.status === "PROCESSING" ? 5000 : false),
    retry: 2,
  });
}
