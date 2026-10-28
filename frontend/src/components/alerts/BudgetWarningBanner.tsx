import React from "react";
import { AlertTriangle, ShieldAlert } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAlertStore } from "../../store/alertStore";

export const BudgetWarningBanner: React.FC = () => {
  const { t } = useTranslation();
  const { alerts } = useAlertStore();

  // Filter top critical & warning alerts
  const activeBudgetAlerts = alerts.filter(
    (a) => a.percentageUsed >= 85
  );

  if (activeBudgetAlerts.length === 0) return null;

  return (
    <div className="space-y-3 animate-fadeIn">
      {activeBudgetAlerts.map((alert) => {
        const isCritical = alert.severity === "critical" || alert.percentageUsed >= 100;

        return (
          <div
            key={alert.id}
            className={`relative overflow-hidden rounded-2xl border p-4 sm:p-5 transition-all duration-200 shadow-md ${
              isCritical
                ? "bg-gradient-to-r from-rose-950/90 via-rose-900/80 to-slate-900 text-white border-rose-500/40 dark:border-rose-800/60"
                : "bg-gradient-to-r from-amber-950/80 via-amber-900/70 to-slate-900 text-white border-amber-500/40 dark:border-amber-800/60"
            }`}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              {/* Icon & Message */}
              <div className="flex items-start gap-3.5">
                <div
                  className={`p-2.5 rounded-xl shrink-0 ${
                    isCritical
                      ? "bg-rose-500/20 text-rose-300 border border-rose-400/30"
                      : "bg-amber-500/20 text-amber-300 border border-amber-400/30"
                  }`}
                >
                  {isCritical ? (
                    <ShieldAlert className="w-5 h-5 animate-pulse" />
                  ) : (
                    <AlertTriangle className="w-5 h-5" />
                  )}
                </div>

                <div className="space-y-1 max-w-2xl">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-extrabold uppercase rounded-full tracking-wider ${
                        isCritical
                          ? "bg-rose-500 text-white"
                          : "bg-amber-500 text-slate-950"
                      }`}
                    >
                      {isCritical ? t("alerts.criticalThreshold") : t("alerts.warningThreshold")}
                    </span>
                    <h4 className="text-sm font-bold tracking-tight">
                      {alert.titleKey ? t(alert.titleKey, alert.title) : alert.title}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-200/90 leading-relaxed">
                    {alert.descriptionKey ? t(alert.descriptionKey, alert.description) : alert.description}
                  </p>
                </div>
              </div>

              {/* Budget Metric Indicators */}
              <div className="shrink-0 w-full sm:w-auto flex items-center justify-end">
                <div className="text-left sm:text-right px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10">
                  <span className="text-xs font-mono font-bold tracking-tight">
                    {alert.percentageUsed.toFixed(1)}% {t("alerts.budgetExceededSuffix", "consumido")}
                  </span>
                  <span className="block text-[11px] text-slate-300 font-mono">
                    ${alert.currentCost.toLocaleString()} / ${alert.budget.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
