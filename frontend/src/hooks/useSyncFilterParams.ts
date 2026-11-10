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
  const lastSyncedUrlParamsRef = useRef<string | null>(null);

  // 1. URL -> Store: Synchronize URL query params to Zustand store (mount & browser back/forward)
  useEffect(() => {
    const currentQueryString = searchParams.toString();
    if (lastSyncedUrlParamsRef.current === currentQueryString) {
      return;
    }

    lastSyncedUrlParamsRef.current = currentQueryString;

    const urlRange = searchParams.get("range") as DateRangePreset | null;
    const urlStartDate = searchParams.get("startDate") || "";
    const urlEndDate = searchParams.get("endDate") || "";
    const urlOrgId = searchParams.get("organizationId") || "";
    const urlEnv = searchParams.get("environment") as EnvironmentFilter | null;
    const urlProvider = searchParams.get("provider") || "";
    const urlModels = searchParams.get("models");

    const currentStore = useFilterStore.getState();
    const updates: Parameters<typeof filters.setFilters>[0] = {};

    if (urlRange && VALID_RANGES.includes(urlRange) && urlRange !== currentStore.range) {
      updates.range = urlRange;
    }
    if (urlStartDate !== currentStore.customStartDate) {
      updates.customStartDate = urlStartDate;
    }
    if (urlEndDate !== currentStore.customEndDate) {
      updates.customEndDate = urlEndDate;
    }
    if (urlOrgId !== currentStore.organizationId) {
      updates.organizationId = urlOrgId;
    }
    if (urlEnv && VALID_ENVIRONMENTS.includes(urlEnv) && urlEnv !== currentStore.environment) {
      updates.environment = urlEnv;
    }
    if (urlProvider && urlProvider !== currentStore.provider) {
      updates.provider = urlProvider;
    }
    if (urlModels !== null) {
      const parsedModels = urlModels ? urlModels.split(",").map((s) => s.trim()).filter(Boolean) : [];
      if (parsedModels.join(",") !== currentStore.selectedModels.join(",")) {
        updates.selectedModels = parsedModels;
      }
    }

    if (Object.keys(updates).length > 0) {
      useFilterStore.getState().setFilters(updates);
    }
  }, [searchParams]);

  // 2. Store -> URL: Synchronize Zustand store changes to URL search params
  useEffect(() => {
    const currentParams = new URLSearchParams(searchParams);

    // Range
    if (filters.range !== "30d") {
      currentParams.set("range", filters.range);
    } else {
      currentParams.delete("range");
    }

    // Custom Dates
    if (filters.range === "custom") {
      if (filters.customStartDate) {
        currentParams.set("startDate", filters.customStartDate);
      } else {
        currentParams.delete("startDate");
      }
      if (filters.customEndDate) {
        currentParams.set("endDate", filters.customEndDate);
      } else {
        currentParams.delete("endDate");
      }
    } else {
      currentParams.delete("startDate");
      currentParams.delete("endDate");
    }

    // Organization ID
    if (filters.organizationId) {
      currentParams.set("organizationId", filters.organizationId);
    } else {
      currentParams.delete("organizationId");
    }

    // Environment
    if (filters.environment !== "ALL") {
      currentParams.set("environment", filters.environment);
    } else {
      currentParams.delete("environment");
    }

    // Provider
    if (filters.provider && filters.provider !== "all") {
      currentParams.set("provider", filters.provider);
    } else {
      currentParams.delete("provider");
    }

    // Selected Models
    if (filters.selectedModels && filters.selectedModels.length > 0) {
      currentParams.set("models", filters.selectedModels.join(","));
    } else {
      currentParams.delete("models");
    }

    const newQueryString = currentParams.toString();
    if (newQueryString !== searchParams.toString()) {
      lastSyncedUrlParamsRef.current = newQueryString;
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
