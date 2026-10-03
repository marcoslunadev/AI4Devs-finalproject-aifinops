import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LayoutDashboard, Cpu, Building2 } from "lucide-react";

export const NavigationTabs: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const isOverview = location.pathname === "/";
  const isModelAnalytics = location.pathname === "/analytics/models";
  const isDeptAnalytics = location.pathname === "/analytics/departments";

  const handleTabChange = (path: string) => {
    // Preserve current URL query search parameters when switching tabs
    navigate({
      pathname: path,
      search: location.search,
    });
  };

  return (
    <div className="flex items-center border-b border-slate-200 dark:border-slate-800 pb-2 mb-6 overflow-x-auto">
      <nav className="flex space-x-2 min-w-max" aria-label="Tabs">
        <button
          onClick={() => handleTabChange("/")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-200 ${
            isOverview
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60"
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>{t("nav.executiveOverview", "Executive Overview")}</span>
        </button>

        <button
          onClick={() => handleTabChange("/analytics/models")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-200 ${
            isModelAnalytics
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60"
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>{t("nav.modelAnalytics", "Model & Provider Analytics")}</span>
        </button>

        <button
          onClick={() => handleTabChange("/analytics/departments")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-200 ${
            isDeptAnalytics
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60"
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>{t("nav.departmentAnalytics", "Department Executions")}</span>
        </button>
      </nav>
    </div>
  );
};
