## Why

Actualmente las métricas de telemetría y la tabla jerárquica del dashboard se calculan cargando todos los registros de `ExecutionLog` en la memoria Node.js mediante `.findMany()` y aplicando iteraciones `.reduce()`. Con decenas de miles de registros de telemetría, esto degrada el rendimiento del servidor y aumenta el riesgo de cuellos de botella. Además, los usuarios carecen de información en tiempo real sobre cuándo se está ejecutando un proceso de ingesta en segundo plano y de la fecha y hora exacta de la última actualización de datos.

## What Changes

- **Backend**:
  - Reemplazo de iteraciones en memoria por agregaciones nativas de PostgreSQL (`prisma.executionLog.aggregate()`, `groupBy()`) en `TelemetryService.ts`.
  - Nuevo endpoint GET `/api/v1/telemetry/status` que expone el estado de la ingesta activa (`PROCESSING` | `COMPLETED`), la fecha/hora del último lote completado (`lastIngestedAt`) y métricas de auditoría.
- **Frontend**:
  - Integración en la cabecera ejecutiva del `Dashboard.tsx` de un indicador animado cuando hay una ingesta en curso (`🔄 Ingestando nuevos datos...`).
  - Muestra transparente de la estampa temporal del último lote de datos procesado (`📅 Última actualización: DD/MM/YYYY HH:mm`).
  - Polling dinámico con React Query que consulta el estado de ingesta cada 5 segundos si el estado es `PROCESSING`.

## Capabilities

### Modified Capabilities

- `dashboard-ui`: La cabecera del Dashboard Ejecutivo mostrará el estado de la ingesta en tiempo real y la estampa temporal de la última actualización de datos.
- `backend-api`: Los servicios de telemetría utilizarán agregaciones nativas SQL en PostgreSQL y proveerán el endpoint de estado de ingesta `/api/v1/telemetry/status`.

## Impact

- **Backend**:
  - `backend/src/modules/telemetry/services/TelemetryService.ts`
  - `backend/src/modules/telemetry/controllers/TelemetryController.ts`
  - `backend/src/modules/telemetry/routes/telemetryRoutes.ts`
- **Frontend**:
  - `frontend/src/pages/Dashboard.tsx`
  - `frontend/src/services/telemetryApi.ts`
  - `frontend/src/hooks/useTelemetry.ts`
