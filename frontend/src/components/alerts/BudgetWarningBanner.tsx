import React, { useState } from "react";
import { AlertTriangle, ShieldAlert, ArrowRight, ExternalLink, Loader2, CheckCircle2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAlertStore, type AnomalyAlert } from "../../store/alertStore";
import { sendJiraTicketWebhook } from "../../services/webhookApi";

export const BudgetWarningBanner: React.FC = () => {
  const { t } = useTranslation();
  const { alerts, updateTicketStatus } = useAlertStore();
  const [loadingAlertId, setLoadingAlertId] = useState<string | null>(null);

  // Filter top critical & warning alerts
  const activeBudgetAlerts = alerts.filter(
    (a) => a.percentageUsed >= 85
  );

  if (activeBudgetAlerts.length === 0) return null;

  const handleCreateTicket = async (alert: AnomalyAlert) => {
    setLoadingAlertId(alert.id);
    try {
      const result = await sendJiraTicketWebhook({
        alertId: alert.id,
        entityName: alert.entityName,
        entityType: alert.entityType,
        severity: alert.severity,
        currentCost: alert.currentCost,
        budget: alert.budget,
        percentageUsed: alert.percentageUsed,
        description: alert.description,
      });

      if (result.success) {
        updateTicketStatus(alert.id, result.ticketId, result.ticketUrl);
      }
    } finally {
      setLoadingAlertId(null);
    }
  };

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

              {/* Interactive Jira Webhook Trigger */}
              <div className="shrink-0 w-full sm:w-auto flex justify-end">
                {alert.ticketId ? (
                  <a
                    href={alert.ticketUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-semibold hover:bg-emerald-500/30 transition shadow-xs"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>{alert.ticketId}</span>
                    <ExternalLink className="w-3.5 h-3.5 ml-0.5 opacity-70" />
                  </a>
                ) : (
                  <button
                    onClick={() => handleCreateTicket(alert)}
                    disabled={loadingAlertId === alert.id}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 disabled:opacity-50 ${
                      isCritical
                        ? "bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/30"
                        : "bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-900/30"
                    }`}
                  >
                    {loadingAlertId === alert.id ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>{t("alerts.creatingTicket")}</span>
                      </>
                    ) : (
                      <>
                        <span>{t("alerts.createJiraTicket")}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
