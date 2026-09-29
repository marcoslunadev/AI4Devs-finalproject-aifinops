import React, { useState } from "react";
import {
  Bell,
  CheckCheck,
  Trash2,
  ExternalLink,
  ShieldAlert,
  AlertTriangle,
  Loader2,
  CheckCircle2,
  X,
} from "lucide-react";
import { useAlertStore, type AnomalyAlert } from "../../store/alertStore";
import { sendJiraTicketWebhook } from "../../services/webhookApi";

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    alerts,
    unreadCount,
    markAsRead,
    markAllAsRead,
    dismissAlert,
    updateTicketStatus,
  } = useAlertStore();

  const [loadingAlertId, setLoadingAlertId] = useState<string | null>(null);

  if (!isOpen) return null;

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
    <div className="absolute right-0 top-12 w-80 sm:w-96 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xl z-50 overflow-hidden animate-fadeIn">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-indigo-500" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Alertas y Notificaciones
          </h3>
          {unreadCount > 0 && (
            <span className="px-1.5 py-0.5 text-[10px] font-extrabold rounded-full bg-rose-500 text-white">
              {unreadCount}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <CheckCheck className="w-3 h-3" />
              Leídas
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
        {alerts.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No hay notificaciones activas.
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              onClick={() => markAsRead(alert.id)}
              className={`p-4 transition-colors relative space-y-2 cursor-pointer ${
                !alert.isRead
                  ? "bg-indigo-50/30 dark:bg-indigo-950/20"
                  : "hover:bg-slate-50 dark:hover:bg-slate-800/40"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  {alert.severity === "critical" ? (
                    <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                  )}
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {alert.title}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 shrink-0">
                  {alert.timestamp}
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {alert.description}
              </p>

              {/* Actions Footer */}
              <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-100/60 dark:border-slate-800/40">
                {alert.ticketId ? (
                  <a
                    href={alert.ticketUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 text-[11px] font-bold"
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    <span>{alert.ticketId}</span>
                    <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                  </a>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCreateTicket(alert);
                    }}
                    disabled={loadingAlertId === alert.id}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-semibold transition disabled:opacity-50"
                  >
                    {loadingAlertId === alert.id ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin" />
                        <span>Enviando...</span>
                      </>
                    ) : (
                      <>
                        <span>Ticket Jira</span>
                      </>
                    )}
                  </button>
                )}

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    dismissAlert(alert.id);
                  }}
                  className="p-1 rounded-md text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/60 transition"
                  title="Descartar"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
