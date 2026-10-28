import React from "react";
import {
  Bell,
  CheckCheck,
  Trash2,
  ShieldAlert,
  AlertTriangle,
  X,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAlertStore } from "../../store/alertStore";

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation();
  const {
    alerts,
    unreadCount,
    markAsRead,
    markAllAsRead,
    dismissAlert,
  } = useAlertStore();

  if (!isOpen) return null;

  return (
    <div className="absolute right-0 top-12 w-80 sm:w-96 rounded-2xl bg-white dark:bg-[#0f1420] border border-slate-200/80 dark:border-white/10 shadow-2xl z-50 overflow-hidden animate-fadeIn">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 dark:border-white/10 flex items-center justify-between bg-slate-50/50 dark:bg-[#171e2e]/50">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-cyan-500" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white font-heading">
            {t("notifications.title")}
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
              className="text-[11px] font-medium text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
            >
              <CheckCheck className="w-3 h-3" />
              {t("notifications.markAllRead")}
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
      <div className="max-h-96 overflow-y-auto divide-y divide-slate-100 dark:divide-white/5">
        {alerts.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            {t("notifications.empty")}
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              onClick={() => markAsRead(alert.id)}
              className={`p-4 transition-colors relative space-y-2 cursor-pointer ${
                !alert.isRead
                  ? "bg-cyan-50/40 dark:bg-cyan-950/20"
                  : "hover:bg-slate-50 dark:hover:bg-[#171e2e]/40"
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
                    {alert.titleKey ? t(alert.titleKey, alert.title) : alert.title}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 shrink-0">
                  {alert.timestampKey ? t(alert.timestampKey, alert.timestamp) : alert.timestamp}
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {alert.descriptionKey ? t(alert.descriptionKey, alert.description) : alert.description}
              </p>

              {/* Actions Footer */}
              <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-100/60 dark:border-white/5 text-[11px] text-slate-500 dark:text-slate-400">
                <span className="font-medium truncate max-w-[220px]">
                  {alert.entityName}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    dismissAlert(alert.id);
                  }}
                  className="p-1 rounded-md text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/60 transition"
                  title={t("notifications.dismiss")}
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
