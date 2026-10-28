import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  RotateCcw,
  Cpu,
  Check,
  ChevronDown,
  X,
  Globe,
  SlidersHorizontal,
} from "lucide-react";
import {
  useFilterStore,
  AVAILABLE_MODELS,
  type EnvironmentFilter,
} from "../store/filterStore";

const ENVIRONMENT_OPTIONS: EnvironmentFilter[] = ["ALL", "PRO", "PRE", "DEV"];

const PROVIDER_OPTIONS = [
  { id: "all", labelKey: "filters.allProviders" },
  { id: "openai", label: "OpenAI" },
  { id: "anthropic", label: "Anthropic" },
  { id: "google", label: "Google" },
  { id: "meta", label: "Meta" },
];

export const GlobalFilterBar: React.FC = () => {
  const { t } = useTranslation();

  const {
    environment,
    provider,
    selectedModels,
    setEnvironment,
    setProvider,
    toggleModel,
    setSelectedModels,
  } = useFilterStore();

  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const modelDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        modelDropdownRef.current &&
        !modelDropdownRef.current.contains(event.target as Node)
      ) {
        setShowModelDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Filter available models by selected provider
  const filteredModels = AVAILABLE_MODELS.filter((model) => {
    if (provider === "all") return true;
    return model.provider === provider;
  });

  const isFiltered =
    environment !== "ALL" || provider !== "all" || selectedModels.length > 0;

  const handleResetFilters = () => {
    setEnvironment("ALL");
    setProvider("all");
    setSelectedModels([]);
  };

  return (
    <div className="relative z-30 rounded-2xl bg-white/90 dark:bg-[#0f1420]/95 backdrop-blur-md border border-slate-200/80 dark:border-white/10 shadow-xs p-4 sm:p-5 space-y-4 transition-all">
      {/* Top Filter Controls Row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Title and Active indicator */}
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 font-heading">
              {t("filters.title", "Filtros Globales")}
              {isFiltered && (
                <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
              )}
            </h3>
          </div>
        </div>

        {/* Reset Filters button if any filter applied */}
        {isFiltered && (
          <button
            onClick={handleResetFilters}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900/50 rounded-xl transition cursor-pointer border border-rose-200/60 dark:border-rose-900/60"
            title={t("filters.reset", "Restablecer Filtros")}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            {t("filters.reset", "Restablecer")}
          </button>
        )}
      </div>

      {/* Filter Selectors: Entorno & Modelos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
        {/* 1. Environment Selector */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5 uppercase tracking-wider font-heading">
            <Globe className="w-3 h-3 text-cyan-500" />
            {t("filters.environment", "Entorno")}
          </label>
          <div className="inline-flex w-full p-1 bg-slate-100 dark:bg-[#171e2e] rounded-xl border border-slate-200/80 dark:border-white/10">
            {ENVIRONMENT_OPTIONS.map((env) => {
              const isActive = environment === env;
              return (
                <button
                  key={env}
                  onClick={() => setEnvironment(env)}
                  className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-lg transition cursor-pointer text-center font-heading ${
                    isActive
                      ? "bg-gradient-to-r from-cyan-500 to-emerald-500 text-white shadow-xs"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {env}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Provider & Model Multi-select Dropdown */}
        <div
          className={`space-y-1.5 ${showModelDropdown ? "relative z-40" : "relative"}`}
          ref={modelDropdownRef}
        >
          <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center justify-between uppercase tracking-wider font-heading">
            <span className="flex items-center gap-1.5">
              <Cpu className="w-3 h-3 text-cyan-500" />
              {t("filters.models", "Proveedor & Modelos")}
            </span>
            {selectedModels.length > 0 && (
              <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-bold lowercase">
                {t("filters.modelsSelected", { count: selectedModels.length })}
              </span>
            )}
          </label>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowModelDropdown(!showModelDropdown)}
              className="w-full flex items-center justify-between px-3.5 py-2 text-xs font-medium bg-slate-50 dark:bg-[#171e2e] border border-slate-200/80 dark:border-white/10 rounded-xl text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1f293d] focus:outline-none focus:ring-2 focus:ring-cyan-500/50 cursor-pointer shadow-2xs transition"
            >
              <span className="truncate">
                {selectedModels.length === 0
                  ? provider === "all"
                    ? t("filters.allModels", "Todos los Modelos")
                    : `${provider.toUpperCase()} (${t("filters.allModels", "Todos")})`
                  : `${selectedModels.length} ${t("filters.modelsSelected", { count: selectedModels.length })}`}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1.5" />
            </button>

            {/* Models Popover */}
            {showModelDropdown && (
              <div className="absolute right-0 mt-2 z-50 w-80 p-3.5 bg-white dark:bg-[#0f1420] rounded-2xl border border-slate-200 dark:border-white/10 shadow-2xl space-y-3">
                {/* Provider selection pills */}
                <div>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5 font-heading">
                    {t("filters.provider", "Proveedor")}
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {PROVIDER_OPTIONS.map((opt) => {
                      const isActive = provider === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setProvider(opt.id)}
                          className={`px-2.5 py-1 text-[11px] font-medium rounded-lg transition cursor-pointer ${
                            isActive
                              ? "bg-gradient-to-r from-cyan-500 to-emerald-500 text-white shadow-xs"
                              : "bg-slate-100 dark:bg-[#171e2e] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#1f293d]"
                          }`}
                        >
                          {opt.labelKey ? t(opt.labelKey, "Todos") : opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Model Checkbox List */}
                <div className="border-t border-slate-100 dark:border-white/10 pt-2 space-y-1 max-h-48 overflow-y-auto pr-1">
                  <div className="flex items-center justify-between pb-1">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider font-heading">
                      {t("filters.models", "Modelos")}
                    </span>
                    {selectedModels.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setSelectedModels([])}
                        className="text-[10px] text-cyan-500 hover:underline cursor-pointer"
                      >
                        {t("filters.allModels", "Limpiar selección")}
                      </button>
                    )}
                  </div>
                  {filteredModels.map((model) => {
                    const isChecked = selectedModels.includes(model.id);
                    return (
                      <button
                        key={model.id}
                        type="button"
                        onClick={() => toggleModel(model.id)}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-lg transition cursor-pointer ${
                          isChecked
                            ? "bg-cyan-500/10 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 font-semibold"
                            : "hover:bg-slate-50 dark:hover:bg-[#171e2e]/60 text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span
                            className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${
                              isChecked
                                ? "bg-gradient-to-r from-cyan-500 to-emerald-500 border-transparent text-white"
                                : "border-slate-300 dark:border-slate-600"
                            }`}
                          >
                            {isChecked && <Check className="w-2.5 h-2.5" />}
                          </span>
                          {model.name}
                        </span>
                        <span className="text-[10px] text-slate-400 capitalize">
                          {model.provider}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Active Filter Chips Preview */}
      {isFiltered && (
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-white/10">
          <span className="text-[11px] font-semibold text-slate-400">
            {t("filters.activeFilters", "Filtros:")}
          </span>

          {environment !== "ALL" && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border border-cyan-200/60 dark:border-cyan-800/60">
              {t("filters.environment", "Entorno")}: {environment}
              <button onClick={() => setEnvironment("ALL")} className="hover:text-cyan-900 dark:hover:text-white cursor-pointer">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {provider !== "all" && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
              {provider.toUpperCase()}
              <button onClick={() => setProvider("all")} className="hover:text-emerald-900 dark:hover:text-white cursor-pointer">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedModels.map((modelId) => (
            <span
              key={modelId}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200/60 dark:border-teal-800/60"
            >
              {modelId}
              <button onClick={() => toggleModel(modelId)} className="hover:text-teal-900 dark:hover:text-white cursor-pointer">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
