import React from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Building2, ChevronDown } from "lucide-react";
import { useOrganizations } from "../hooks/useTelemetry";

export const OrganizationScopeSelector: React.FC = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: orgs, isLoading } = useOrganizations();

  const selectedOrgId = searchParams.get("organizationId") || "";

  const handleOrgChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set("organizationId", value);
    } else {
      newParams.delete("organizationId");
    }
    setSearchParams(newParams);
  };

  return (
    <div className="relative flex items-center w-52 sm:w-64">
      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-500 dark:text-indigo-400 pointer-events-none z-10" />
      <select
        value={selectedOrgId}
        onChange={handleOrgChange}
        disabled={isLoading}
        aria-label={t("common.orgSelectorLabel", "Seleccionar Entidad / Scope")}
        className="w-full appearance-none pl-9 pr-8 py-1.5 text-xs font-medium bg-slate-100 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition cursor-pointer shadow-xs hover:bg-slate-200/50 dark:hover:bg-slate-700/50"
      >
        <option value="">{t("common.orgSelectorAll", "Todas las Entidades")}</option>
        {orgs?.map((org) => (
          <option key={org.id} value={org.id}>
            {org.name}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
    </div>
  );
};
