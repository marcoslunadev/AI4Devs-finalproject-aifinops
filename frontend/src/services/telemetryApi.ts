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

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

export async function fetchTelemetryKpis(): Promise<TelemetryKpis> {
  const response = await fetch(`${API_BASE_URL}/telemetry/kpis`);
  if (!response.ok) {
    throw new Error(`Failed to fetch KPI metrics: ${response.statusText}`);
  }
  return response.json();
}

export async function fetchTelemetryChart(range: string = "30d"): Promise<ChartDataPoint[]> {
  const response = await fetch(`${API_BASE_URL}/telemetry/chart?range=${encodeURIComponent(range)}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch time series chart: ${response.statusText}`);
  }
  return response.json();
}

export interface TelemetryStatus {
  status: "PROCESSING" | "COMPLETED";
  lastIngestedAt: string | null;
  totalRecordsProcessed: number;
  activeIngestionsCount: number;
}

export async function fetchTelemetryBreakdown(): Promise<DrillDownNode[]> {
  const response = await fetch(`${API_BASE_URL}/telemetry/breakdown`);
  if (!response.ok) {
    throw new Error(`Failed to fetch telemetry breakdown: ${response.statusText}`);
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
