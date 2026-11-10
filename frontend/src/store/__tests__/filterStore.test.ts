import { describe, it, expect, beforeEach } from "vitest";
import { useFilterStore } from "../filterStore";

describe("filterStore Zustand", () => {
  beforeEach(() => {
    useFilterStore.getState().resetFilters();
  });

  it("sets and resets organizationId", () => {
    expect(useFilterStore.getState().organizationId).toBe("");
    useFilterStore.getState().setOrganizationId("org-123");
    expect(useFilterStore.getState().organizationId).toBe("org-123");
    useFilterStore.getState().setOrganizationId("");
    expect(useFilterStore.getState().organizationId).toBe("");
  });

  it("sets range and custom dates correctly", () => {
    useFilterStore.getState().setRange("7d");
    expect(useFilterStore.getState().range).toBe("7d");

    useFilterStore.getState().setCustomDates("2026-01-01", "2026-01-15");
    expect(useFilterStore.getState().range).toBe("custom");
    expect(useFilterStore.getState().customStartDate).toBe("2026-01-01");
    expect(useFilterStore.getState().customEndDate).toBe("2026-01-15");

    useFilterStore.getState().setRange("30d");
    expect(useFilterStore.getState().range).toBe("30d");
    expect(useFilterStore.getState().customStartDate).toBe("");
    expect(useFilterStore.getState().customEndDate).toBe("");
  });

  it("manages environment, provider, and model selection", () => {
    useFilterStore.getState().setEnvironment("PRO");
    expect(useFilterStore.getState().environment).toBe("PRO");

    useFilterStore.getState().setProvider("openai");
    expect(useFilterStore.getState().provider).toBe("openai");

    useFilterStore.getState().setSelectedModels(["gpt-4o"]);
    expect(useFilterStore.getState().selectedModels).toEqual(["gpt-4o"]);

    useFilterStore.getState().toggleModel("gpt-4o-mini");
    expect(useFilterStore.getState().selectedModels).toEqual(["gpt-4o", "gpt-4o-mini"]);

    useFilterStore.getState().toggleModel("gpt-4o");
    expect(useFilterStore.getState().selectedModels).toEqual(["gpt-4o-mini"]);

    // If changing provider, non-matching models are cleaned
    useFilterStore.getState().setProvider("anthropic");
    expect(useFilterStore.getState().selectedModels).toEqual([]);
    useFilterStore.getState().setProvider("all");
    expect(useFilterStore.getState().provider).toBe("all");
  });

  it("resets all filters to defaults", () => {
    useFilterStore.getState().setFilters({
      organizationId: "org-xyz",
      environment: "DEV",
      range: "90d",
      provider: "google",
      selectedModels: ["gemini-1.5-pro"],
    });

    useFilterStore.getState().resetFilters();

    const state = useFilterStore.getState();
    expect(state.organizationId).toBe("");
    expect(state.environment).toBe("ALL");
    expect(state.range).toBe("30d");
    expect(state.provider).toBe("all");
    expect(state.selectedModels).toEqual([]);
  });
});
