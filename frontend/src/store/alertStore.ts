import { create } from "zustand";

export interface AnomalyAlert {
  id: string;
  title: string;
  description: string;
  titleKey?: string;
  descriptionKey?: string;
  timestampKey?: string;
  severity: "warning" | "critical";
  entityName: string;
  entityType: "organization" | "environment" | "user";
  currentCost: number;
  budget: number;
  percentageUsed: number;
  timestamp: string;
  isRead: boolean;
}

interface AlertState {
  alerts: AnomalyAlert[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  dismissAlert: (id: string) => void;
  addAlert: (alert: Omit<AnomalyAlert, "id" | "timestamp" | "isRead">) => void;
}

const INITIAL_ALERTS: AnomalyAlert[] = [];

export const useAlertStore = create<AlertState>((set) => ({
  alerts: INITIAL_ALERTS,
  unreadCount: 0,

  markAsRead: (id) =>
    set((state) => {
      const updated = state.alerts.map((a) => (a.id === id ? { ...a, isRead: true } : a));
      return {
        alerts: updated,
        unreadCount: updated.filter((a) => !a.isRead).length,
      };
    }),

  markAllAsRead: () =>
    set((state) => ({
      alerts: state.alerts.map((a) => ({ ...a, isRead: true })),
      unreadCount: 0,
    })),

  dismissAlert: (id) =>
    set((state) => {
      const updated = state.alerts.filter((a) => a.id !== id);
      return {
        alerts: updated,
        unreadCount: updated.filter((a) => !a.isRead).length,
      };
    }),

  addAlert: (alertData) =>
    set((state) => {
      const newAlert: AnomalyAlert = {
        ...alertData,
        id: `alert-${Date.now()}`,
        timestamp: "Ahora mismo",
        isRead: false,
      };
      const updated = [newAlert, ...state.alerts];
      return {
        alerts: updated,
        unreadCount: updated.filter((a) => !a.isRead).length,
      };
    }),
}));
