import React from "react";
import { useTranslation } from "react-i18next";
import { Building2, ChevronDown } from "lucide-react";
import { useOrganizations } from "../hooks/useTelemetry";
import { useFilterStore } from "../store/filterStore";

export const OrganizationScopeSelector: React.FC = () => {
  const { t } = useTranslation();
  const { data: orgs, isLoading } = useOrganizations();
  const organizationId = useFilterStore((state) => state.organizationId);
  const setOrganizationId = useFilterStore((state) => state.setOrganizationId);

  const handleOrgChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setOrganizationId(value);
  };

  return (
    <div className="relative flex items-center w-52 sm:w-64">
      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-500 dark:text-cyan-400 pointer-events-none z-10" />
      <select
        value={organizationId || ""}
        onChange={handleOrgChange}
        disabled={isLoading}
        aria-label={t("common.orgSelectorLabel", "Seleccionar Entidad / Scope")}
        className="w-full appearance-none pl-9 pr-8 py-2 text-xs font-medium bg-slate-100 dark:bg-[#171e2e] border border-slate-200/80 dark:border-white/10 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition cursor-pointer shadow-xs hover:bg-slate-200/60 dark:hover:bg-[#1f293d]"
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
