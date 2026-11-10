import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { MemoryRouter, useSearchParams } from "react-router-dom";
import React from "react";
import { useSyncFilterParams } from "../useSyncFilterParams";
import { useFilterStore } from "../../store/filterStore";

describe("useSyncFilterParams Hook", () => {
  beforeEach(() => {
    useFilterStore.getState().resetFilters();
  });

  const createWrapper = (initialEntries: string[] = ["/"]) => {
    return ({ children }: { children: React.ReactNode }) => (
      <MemoryRouter initialEntries={initialEntries}>
        {children}
      </MemoryRouter>
    );
  };

  it("hydrates store from initial URL query params", () => {
    const wrapper = createWrapper([
      "/?organizationId=org-test-123&range=7d&environment=PRO&provider=openai&models=gpt-4o,gpt-4o-mini",
    ]);

    renderHook(() => useSyncFilterParams(), { wrapper });

    const storeState = useFilterStore.getState();
    expect(storeState.organizationId).toBe("org-test-123");
    expect(storeState.range).toBe("7d");
    expect(storeState.environment).toBe("PRO");
    expect(storeState.provider).toBe("openai");
    expect(storeState.selectedModels).toEqual(["gpt-4o", "gpt-4o-mini"]);
  });

  it("synchronizes Zustand store updates to URL search params", () => {
    let currentSearchParams: URLSearchParams | undefined;

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <MemoryRouter initialEntries={["/"]}>
        {children}
      </MemoryRouter>
    );

    const { result } = renderHook(
      () => {
        const filters = useSyncFilterParams();
        const [searchParams] = useSearchParams();
        currentSearchParams = searchParams;
        return filters;
      },
      { wrapper }
    );

    expect(currentSearchParams?.get("organizationId")).toBeNull();

    act(() => {
      result.current.setOrganizationId("org-sync-99");
      result.current.setEnvironment("DEV");
      result.current.setProvider("anthropic");
      result.current.setSelectedModels(["claude-3-5-sonnet"]);
    });

    expect(currentSearchParams?.get("organizationId")).toBe("org-sync-99");
    expect(currentSearchParams?.get("environment")).toBe("DEV");
    expect(currentSearchParams?.get("provider")).toBe("anthropic");
    expect(currentSearchParams?.get("models")).toBe("claude-3-5-sonnet");
  });

  it("removes organizationId and other filters from URL search params when cleared", () => {
    let currentSearchParams: URLSearchParams | undefined;

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <MemoryRouter initialEntries={["/?organizationId=org-sync-99&environment=PRE&provider=google&models=gemini-1.5-pro"]}>
        {children}
      </MemoryRouter>
    );

    const { result } = renderHook(
      () => {
        const filters = useSyncFilterParams();
        const [searchParams] = useSearchParams();
        currentSearchParams = searchParams;
        return filters;
      },
      { wrapper }
    );

    expect(currentSearchParams?.get("organizationId")).toBe("org-sync-99");

    act(() => {
      result.current.setOrganizationId("");
      result.current.setEnvironment("ALL");
      result.current.setProvider("all");
      result.current.setSelectedModels([]);
    });

    expect(currentSearchParams?.get("organizationId")).toBeNull();
    expect(currentSearchParams?.get("environment")).toBeNull();
    expect(currentSearchParams?.get("provider")).toBeNull();
    expect(currentSearchParams?.get("models")).toBeNull();
  });

  it("handles custom date range synchronization to and from URL", () => {
    let currentSearchParams: URLSearchParams | undefined;

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <MemoryRouter initialEntries={["/"]}>
        {children}
      </MemoryRouter>
    );

    const { result } = renderHook(
      () => {
        const filters = useSyncFilterParams();
        const [searchParams] = useSearchParams();
        currentSearchParams = searchParams;
        return filters;
      },
      { wrapper }
    );

    act(() => {
      result.current.setCustomDates("2026-01-01", "2026-01-31");
    });

    expect(currentSearchParams?.get("range")).toBe("custom");
    expect(currentSearchParams?.get("startDate")).toBe("2026-01-01");
    expect(currentSearchParams?.get("endDate")).toBe("2026-01-31");

    act(() => {
      result.current.setRange("30d");
    });

    expect(currentSearchParams?.get("range")).toBeNull();
    expect(currentSearchParams?.get("startDate")).toBeNull();
    expect(currentSearchParams?.get("endDate")).toBeNull();
  });
});
