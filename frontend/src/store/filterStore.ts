import { create } from "zustand";

export type DateRangePreset = "7d" | "30d" | "90d" | "ytd" | "custom";
export type EnvironmentFilter = "ALL" | "DEV" | "PRE" | "PRO";

export interface AIModelOption {
  id: string;
  name: string;
  provider: "openai" | "anthropic" | "google" | "meta";
}

export const AVAILABLE_MODELS: AIModelOption[] = [
  { id: "gpt-4o", name: "GPT-4o", provider: "openai" },
  { id: "gpt-4o-mini", name: "GPT-4o Mini", provider: "openai" },
  { id: "o1-preview", name: "o1 Preview", provider: "openai" },
  { id: "claude-3-5-sonnet", name: "Claude 3.5 Sonnet", provider: "anthropic" },
  { id: "claude-3-haiku", name: "Claude 3 Haiku", provider: "anthropic" },
  { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro", provider: "google" },
  { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash", provider: "google" },
  { id: "llama-3.1-70b", name: "Llama 3.1 70B", provider: "meta" },
  { id: "llama-3.1-8b", name: "Llama 3.1 8B", provider: "meta" },
];

export interface FilterValues {
  range: DateRangePreset;
  customStartDate: string;
  customEndDate: string;
  organizationId: string;
  environment: EnvironmentFilter;
  provider: string;
  selectedModels: string[];
}

export interface FilterState extends FilterValues {
  setRange: (range: DateRangePreset) => void;
  setCustomDates: (startDate: string, endDate: string) => void;
  setOrganizationId: (orgId: string) => void;
  setEnvironment: (env: EnvironmentFilter) => void;
  setProvider: (provider: string) => void;
  setSelectedModels: (models: string[]) => void;
  toggleModel: (modelId: string) => void;
  resetFilters: () => void;
  setFilters: (filters: Partial<FilterValues>) => void;
}

const DEFAULT_FILTER_VALUES: FilterValues = {
  range: "30d",
  customStartDate: "",
  customEndDate: "",
  organizationId: "",
  environment: "ALL",
  provider: "all",
  selectedModels: [],
};

export const useFilterStore = create<FilterState>((set) => ({
  ...DEFAULT_FILTER_VALUES,

  setRange: (range) =>
    set(() => ({
      range,
      ...(range !== "custom" ? { customStartDate: "", customEndDate: "" } : {}),
    })),

  setCustomDates: (customStartDate, customEndDate) =>
    set(() => ({
      range: "custom",
      customStartDate,
      customEndDate,
    })),

  setOrganizationId: (organizationId) => set(() => ({ organizationId })),

  setEnvironment: (environment) => set(() => ({ environment })),

  setProvider: (provider) =>
    set((state) => {
      // If changing provider, filter or reset selectedModels if they don't match provider
      if (provider === "all") {
        return { provider };
      }
      const validModels = AVAILABLE_MODELS.filter((m) => m.provider === provider).map((m) => m.id);
      const remainingSelected = state.selectedModels.filter((m) => validModels.includes(m));
      return {
        provider,
        selectedModels: remainingSelected,
      };
    }),

  setSelectedModels: (selectedModels) => set(() => ({ selectedModels })),

  toggleModel: (modelId) =>
    set((state) => {
      const exists = state.selectedModels.includes(modelId);
      const updated = exists
        ? state.selectedModels.filter((id) => id !== modelId)
        : [...state.selectedModels, modelId];
      return { selectedModels: updated };
    }),

  resetFilters: () => set(() => ({ ...DEFAULT_FILTER_VALUES })),

  setFilters: (filters) => set((state) => ({ ...state, ...filters })),
}));
