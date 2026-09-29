## 1. Servicio de Webhooks y Cliente HTTP
- [x] 1.1 Crear el servicio HTTP `frontend/src/services/webhookApi.ts` para enviar eventos hacia `jira-webhook-server`.
- [x] 1.2 Crear el store de estado de alertas `frontend/src/store/alertStore.ts` con Zustand.

## 2. Componentes UI de Alerta y Notificaciones
- [x] 2.1 Diseñar e implementar el componente `BudgetWarningBanner.tsx` para mostrar advertencias de consumo superior al 85% o 100%.
- [x] 2.2 Actualizar `Header.tsx` integrando el menú flotante de notificaciones (`NotificationDrawer.tsx`) con indicador animado de alertas activas.
- [x] 2.3 Implementar botón de acción "Crear Ticket en Jira" con feedback visual (Toast / Badge de éxito).

## 3. Integración en el Dashboard
- [x] 3.1 Conectar las alertas activas con la tabla jerárquica de organizaciones (`DrillDownTable.tsx`).
- [x] 3.2 Probar la simulación y el envío de payloads al webhook de Jira.
