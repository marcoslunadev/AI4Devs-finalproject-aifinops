## Context

The executive dashboard needs proactive alerting features for cost anomalies and budget burn limits. See `proposal.md` for motivation.

## Goals / Non-Goals

**Goals:**
- Create `BudgetWarningBanner.tsx` for critical/warning alerts on top of the dashboard.
- Upgrade `Header.tsx` bell button to open a Notification Drawer popover (`NotificationDrawer.tsx`) displaying unread alerts.
- Build `webhookApi.ts` service in `frontend/src/services/` to dispatch webhook payloads to the `jira-webhook-server` (e.g. `POST /webhook/jira`).
- Follow strict `react-expert` patterns: clean state management with Zustand/Context, robust error handling, and accessible UI popovers.

**Non-Goals:**
- Full custom alert rule builder UI (simple threshold checks at 85% and 100% are used for this scope).

## Decisions

### Decisión 1: Integración de Webhook con `jira-webhook-server`
**Opción seleccionada**: Petición HTTP POST directa a la URL del microservicio `jira-webhook-server` (o endpoint proxy en el backend) enviando el payload de la anomalía `{ anomalyId, orgName, costSpike, timestamp }`.
**Alternativas consideradas**: Enviar correos electrónicos directamente desde el navegador.
**Rationale**: `jira-webhook-server` ya forma parte del monorepo y permite crear incidencias automáticas directamente en los tableros de gestión de las organizaciones.

### Decisión 2: Componente de Notificaciones en la Cabecera
**Opción seleccionada**: Popover desplegable flotante con `backdrop-blur` e indicador de animación `animate-pulse` en el icono de la campana.
**Alternativas consideradas**: Redirección a una página completa `/alerts`.
**Rationale**: Los ejecutivos prefieren ver y accionar alertas directamente sin abandonar la vista actual del dashboard.

## Risks / Trade-offs

- **Risk**: Peticiones duplicadas al pulsar varias veces el botón de "Crear Ticket en Jira".
  - **Mitigation**: Deshabilitar el botón durante la petición HTTP (`isPending`) y cambiar el estado del botón a "Ticket Creado (#JIRA-123)" tras recibir respuesta de éxito.
