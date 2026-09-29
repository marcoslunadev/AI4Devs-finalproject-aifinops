import { useQuery } from "@tanstack/react-query";
import {
  fetchTelemetryKpis,
  fetchTelemetryChart,
  fetchTelemetryBreakdown,
  type TelemetryKpis,
} from "../services/telemetryApi";
import { type ChartDataPoint } from "../components/CostChart";
import { type DrillDownNode } from "../components/DrillDownTable";

export function useTelemetryKpis() {
  return useQuery<TelemetryKpis, Error>({
    queryKey: ["telemetry", "kpis"],
    queryFn: fetchTelemetryKpis,
    staleTime: 60 * 1000, // 1 minute stale time
    retry: 2,
  });
}

export function useTelemetryChart(range: string = "30d") {
  return useQuery<ChartDataPoint[], Error>({
    queryKey: ["telemetry", "chart", range],
    queryFn: () => fetchTelemetryChart(range),
    staleTime: 60 * 1000,
    retry: 2,
  });
}

export function useTelemetryBreakdown() {
  return useQuery<DrillDownNode[], Error>({
    queryKey: ["telemetry", "breakdown"],
    queryFn: fetchTelemetryBreakdown,
    staleTime: 60 * 1000,
    retry: 2,
  });
}
