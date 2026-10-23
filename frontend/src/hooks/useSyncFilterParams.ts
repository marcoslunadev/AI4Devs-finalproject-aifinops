import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import {
  useFilterStore,
  type DateRangePreset,
  type EnvironmentFilter,
} from "../store/filterStore";

const VALID_RANGES: DateRangePreset[] = ["7d", "30d", "90d", "ytd", "custom"];
const VALID_ENVIRONMENTS: EnvironmentFilter[] = ["ALL", "DEV", "PRE", "PRO"];

export function useSyncFilterParams() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = useFilterStore();
  const isInitializedRef = useRef(false);
  const isUpdatingFromUrlRef = useRef(false);

  // 1. Initial hydration: Read URL query params on mount and populate store
  useEffect(() => {
    if (!isInitializedRef.current) {
      isInitializedRef.current = true;
      isUpdatingFromUrlRef.current = true;

      const urlRange = searchParams.get("range") as DateRangePreset | null;
      const urlStartDate = searchParams.get("startDate") || "";
      const urlEndDate = searchParams.get("endDate") || "";
      const urlOrgId = searchParams.get("organizationId") || "";
      const urlEnv = searchParams.get("environment") as EnvironmentFilter | null;
      const urlProvider = searchParams.get("provider") || "";
      const urlModels = searchParams.get("models");

      const updates: Parameters<typeof filters.setFilters>[0] = {};

      if (urlRange && VALID_RANGES.includes(urlRange)) {
        updates.range = urlRange;
      }
      if (urlStartDate) updates.customStartDate = urlStartDate;
      if (urlEndDate) updates.customEndDate = urlEndDate;
      if (urlOrgId) updates.organizationId = urlOrgId;
      if (urlEnv && VALID_ENVIRONMENTS.includes(urlEnv)) {
        updates.environment = urlEnv;
      }
      if (urlProvider) updates.provider = urlProvider;
      if (urlModels) {
        updates.selectedModels = urlModels.split(",").map((s) => s.trim()).filter(Boolean);
      }

      if (Object.keys(updates).length > 0) {
        useFilterStore.getState().setFilters(updates);
      }

      setTimeout(() => {
        isUpdatingFromUrlRef.current = false;
      }, 0);
    }
  }, [searchParams]);

  // 2. Synchronize Zustand store changes to URL search params
  useEffect(() => {
    if (!isInitializedRef.current || isUpdatingFromUrlRef.current) {
      return;
    }

    const currentParams = new URLSearchParams(searchParams);
    let changed = false;

    // Range
    if (filters.range !== "30d") {
      if (currentParams.get("range") !== filters.range) {
        currentParams.set("range", filters.range);
        changed = true;
      }
    } else {
      if (currentParams.has("range")) {
        currentParams.delete("range");
        changed = true;
      }
    }

    // Custom Dates
    if (filters.range === "custom") {
      if (filters.customStartDate && currentParams.get("startDate") !== filters.customStartDate) {
        currentParams.set("startDate", filters.customStartDate);
        changed = true;
      }
      if (filters.customEndDate && currentParams.get("endDate") !== filters.customEndDate) {
        currentParams.set("endDate", filters.customEndDate);
        changed = true;
      }
    } else {
      if (currentParams.has("startDate")) {
        currentParams.delete("startDate");
        changed = true;
      }
      if (currentParams.has("endDate")) {
        currentParams.delete("endDate");
        changed = true;
      }
    }

    // Organization ID
    if (filters.organizationId) {
      if (currentParams.get("organizationId") !== filters.organizationId) {
        currentParams.set("organizationId", filters.organizationId);
        changed = true;
      }
    } else {
      if (currentParams.has("organizationId")) {
        currentParams.delete("organizationId");
        changed = true;
      }
    }

    // Environment
    if (filters.environment !== "ALL") {
      if (currentParams.get("environment") !== filters.environment) {
        currentParams.set("environment", filters.environment);
        changed = true;
      }
    } else {
      if (currentParams.has("environment")) {
        currentParams.delete("environment");
        changed = true;
      }
    }

    // Provider
    if (filters.provider && filters.provider !== "all") {
      if (currentParams.get("provider") !== filters.provider) {
        currentParams.set("provider", filters.provider);
        changed = true;
      }
    } else {
      if (currentParams.has("provider")) {
        currentParams.delete("provider");
        changed = true;
      }
    }

    // Selected Models
    if (filters.selectedModels.length > 0) {
      const modelsStr = filters.selectedModels.join(",");
      if (currentParams.get("models") !== modelsStr) {
        currentParams.set("models", modelsStr);
        changed = true;
      }
    } else {
      if (currentParams.has("models")) {
        currentParams.delete("models");
        changed = true;
      }
    }

    if (changed) {
      setSearchParams(currentParams, { replace: true });
    }
  }, [
    filters.range,
    filters.customStartDate,
    filters.customEndDate,
    filters.organizationId,
    filters.environment,
    filters.provider,
    filters.selectedModels,
    searchParams,
    setSearchParams,
  ]);

  return filters;
}
