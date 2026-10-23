import { type ChartDataPoint } from "../components/CostChart";
import { type DrillDownNode } from "../components/DrillDownTable";

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

export interface TelemetryStatus {
  status: "PROCESSING" | "COMPLETED";
  lastIngestedAt: string | null;
  totalRecordsProcessed: number;
  activeIngestionsCount: number;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

export async function fetchOrganizations(): Promise<OrganizationItem[]> {
  const response = await fetch(`${API_BASE_URL}/telemetry/organizations`);
  if (!response.ok) {
    throw new Error(`Failed to fetch organizations: ${response.statusText}`);
  }
  return response.json();
}

export interface TelemetryFilterParams {
  organizationId?: string;
  environment?: string;
  provider?: string;
  models?: string[];
}

function appendFilterParams(url: URL, filters?: TelemetryFilterParams) {
  if (!filters) return;
  if (filters.organizationId) {
    url.searchParams.append("organizationId", filters.organizationId);
  }
  if (filters.environment && filters.environment !== "ALL") {
    url.searchParams.append("environment", filters.environment);
  }
  if (filters.provider && filters.provider !== "all") {
    url.searchParams.append("provider", filters.provider);
  }
  if (filters.models && filters.models.length > 0) {
    url.searchParams.append("models", filters.models.join(","));
  }
}

export async function fetchTelemetryKpis(filters?: TelemetryFilterParams): Promise<TelemetryKpis> {
  const url = new URL(`${API_BASE_URL}/telemetry/kpis`);
  appendFilterParams(url, filters);
  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`Failed to fetch KPI metrics: ${response.statusText}`);
  }
  return response.json();
}

export async function fetchTelemetryChart(
  range: string = "30d",
  filters?: TelemetryFilterParams
): Promise<ChartDataPoint[]> {
  const url = new URL(`${API_BASE_URL}/telemetry/chart`);
  url.searchParams.append("range", range);
  appendFilterParams(url, filters);
  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`Failed to fetch time series chart: ${response.statusText}`);
  }
  return response.json();
}

export async function fetchTelemetryBreakdown(filters?: TelemetryFilterParams): Promise<DrillDownNode[]> {
  const url = new URL(`${API_BASE_URL}/telemetry/breakdown`);
  appendFilterParams(url, filters);
  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`Failed to fetch telemetry breakdown: ${response.statusText}`);
  }
  return response.json();
}

export async function fetchDepartmentExecutions(organizationId?: string): Promise<DepartmentExecution[]> {
  const url = new URL(`${API_BASE_URL}/telemetry/department-executions`);
  if (organizationId) {
    url.searchParams.append("organizationId", organizationId);
  }
  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`Failed to fetch department executions: ${response.statusText}`);
  }
  return response.json();
}

export async function fetchTelemetryStatus(): Promise<TelemetryStatus> {
  const response = await fetch(`${API_BASE_URL}/telemetry/status`);
  if (!response.ok) {
    throw new Error(`Failed to fetch telemetry status: ${response.statusText}`);
  }
  return response.json();
}
