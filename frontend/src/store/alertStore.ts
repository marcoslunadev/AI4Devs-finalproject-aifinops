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
  ticketId?: string;
  ticketUrl?: string;
}

interface AlertState {
  alerts: AnomalyAlert[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  dismissAlert: (id: string) => void;
  updateTicketStatus: (id: string, ticketId: string, ticketUrl: string) => void;
  addAlert: (alert: Omit<AnomalyAlert, "id" | "timestamp" | "isRead">) => void;
}

const INITIAL_ALERTS: AnomalyAlert[] = [
  {
    id: "alert-1",
    title: "Presupuesto Crítico Excedido (100%)",
    description: "La organización 'Retail & E-Commerce AI' ha alcanzado el 103.8% de su presupuesto mensual asignado ($6.230 de $6.000).",
    titleKey: "alerts.items.alert1Title",
    descriptionKey: "alerts.items.alert1Desc",
    timestampKey: "alerts.items.time15m",
    severity: "critical",
    entityName: "Retail & E-Commerce AI",
    entityType: "organization",
    currentCost: 6230,
    budget: 6000,
    percentageUsed: 103.8,
    timestamp: "Hace 15 min",
    isRead: false,
  },
  {
    id: "alert-2",
    title: "Advertencia de Umbral de Presupuesto (85%)",
    description: "El entorno 'DEV - R&D Sandbox' ha alcanzado el 92.5% de su límite de gasto presupuestado ($2.450 de $2.000).",
    titleKey: "alerts.items.alert2Title",
    descriptionKey: "alerts.items.alert2Desc",
    timestampKey: "alerts.items.time42m",
    severity: "warning",
    entityName: "DEV - R&D Sandbox",
    entityType: "environment",
    currentCost: 2450,
    budget: 2000,
    percentageUsed: 92.5,
    timestamp: "Hace 42 min",
    isRead: false,
  },
  {
    id: "alert-3",
    title: "Pico Anómalo de Tokens en GPT-4o",
    description: "Se ha detectado un incremento del +240% de consumo de tokens por hora en 'Customer Support Assistant'.",
    titleKey: "alerts.items.alert3Title",
    descriptionKey: "alerts.items.alert3Desc",
    timestampKey: "alerts.items.time2h",
    severity: "warning",
    entityName: "Customer Support Assistant (GPT-4o)",
    entityType: "user",
    currentCost: 11500,
    budget: 12000,
    percentageUsed: 95.8,
    timestamp: "Hace 2 horas",
    isRead: true,
  },
];

export const useAlertStore = create<AlertState>((set) => ({
  alerts: INITIAL_ALERTS,
  unreadCount: INITIAL_ALERTS.filter((a) => !a.isRead).length,

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

  updateTicketStatus: (id, ticketId, ticketUrl) =>
    set((state) => ({
      alerts: state.alerts.map((a) =>
        a.id === id ? { ...a, ticketId, ticketUrl, isRead: true } : a
      ),
      unreadCount: state.alerts.filter((a) => !a.isRead && a.id !== id).length,
    })),

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
