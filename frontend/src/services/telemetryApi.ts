import { type ChartDataPoint } from "../components/CostChart";
import { type DrillDownNode } from "../components/DrillDownTable";
import api from "./api";

export interface TelemetryKpis {
  totalCost: number;
  totalCostChange: number;
  totalExecutions: number;
  totalExecutionsChange: number;
  totalTokens: number;
  totalTokensChange: number;
  avgCostPerExec: number;
  avgCostPerExecChange: number;
  activeOrgs: number;
  activeOrgsBadge?: string;
  errorRate: number;
  errorRateChange: number;
}

export interface OrganizationItem {
  id: string;
  name: string;
}

export interface DepartmentExecution {
  id: string;
  organizationId: string;
  organizationName: string;
  departmentId: string;
  departmentName: string;
  model: string;
  totalCalls: number;
  promptTokens: number;
  completionTokens: number;
  totalCost: number;
  avgLatencyMs: number;
}

export interface ProviderDistribution {
  provider: string;
  cost: number;
  share: number;
}

export interface TelemetryStatus {
  status: "PROCESSING" | "COMPLETED";
  lastIngestedAt: string | null;
  totalRecordsProcessed: number;
  activeIngestionsCount: number;
}

export interface TelemetryFilterParams {
  organizationId?: string;
  environment?: string;
  provider?: string;
  models?: string[];
}

function buildFilterParams(filters?: TelemetryFilterParams): Record<string, string> {
  const params: Record<string, string> = {};
  if (!filters) return params;

  if (filters.organizationId) {
    params.organizationId = filters.organizationId;
  }
  if (filters.environment && filters.environment !== "ALL") {
    params.environment = filters.environment;
  }
  if (filters.provider && filters.provider !== "all") {
    params.provider = filters.provider;
  }
  if (filters.models && filters.models.length > 0) {
    params.models = filters.models.join(",");
  }
  return params;
}

export async function fetchOrganizations(): Promise<OrganizationItem[]> {
  const response = await api.get<OrganizationItem[]>("/telemetry/organizations");
  return response.data;
}

export async function fetchTelemetryKpis(filters?: TelemetryFilterParams): Promise<TelemetryKpis> {
  const params = buildFilterParams(filters);
  const response = await api.get<TelemetryKpis>("/telemetry/kpis", { params });
  return response.data;
}

export async function fetchTelemetryChart(
  range: string = "30d",
  filters?: TelemetryFilterParams
): Promise<ChartDataPoint[]> {
  const params = buildFilterParams(filters);
  params.range = range;
  const response = await api.get<ChartDataPoint[]>("/telemetry/chart", { params });
  return response.data;
}

export async function fetchTelemetryBreakdown(filters?: TelemetryFilterParams): Promise<DrillDownNode[]> {
  const params = buildFilterParams(filters);
  const response = await api.get<DrillDownNode[]>("/telemetry/breakdown", { params });
  return response.data;
}

export async function fetchDepartmentExecutions(organizationId?: string): Promise<DepartmentExecution[]> {
  const params: Record<string, string> = {};
  if (organizationId) {
    params.organizationId = organizationId;
  }
  const response = await api.get<DepartmentExecution[]>("/telemetry/department-executions", { params });
  return response.data;
}

export async function fetchProviderDistribution(
  filters?: TelemetryFilterParams
): Promise<ProviderDistribution[]> {
  const params = buildFilterParams(filters);
  const response = await api.get<ProviderDistribution[]>("/telemetry/provider-distribution", { params });
  return response.data;
}

export async function fetchTelemetryStatus(): Promise<TelemetryStatus> {
  const response = await api.get<TelemetryStatus>("/telemetry/status");
  return response.data;
}
