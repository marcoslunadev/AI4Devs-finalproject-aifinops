## 1. Endpoints Backend de Telemetría
- [ ] 1.1 Crear el módulo de telemetría en el backend (`backend/src/modules/telemetry`).
- [ ] 1.2 Implementar esquemas Zod para la validación de entrada/salida de métricas de telemetría.
- [ ] 1.3 Exponer endpoints HTTP `/api/v1/telemetry/kpis`, `/api/v1/telemetry/chart` y `/api/v1/telemetry/breakdown` en Express.

## 2. Cliente API y Hooks en Frontend
- [ ] 2.1 Crear el servicio HTTP del cliente en `frontend/src/services/telemetryApi.ts`.
- [ ] 2.2 Crear custom hooks de TanStack Query en `frontend/src/hooks/useTelemetry.ts`.

## 3. Integración UI y Componentes de Estado (Skeletons / Errors)
- [ ] 3.1 Crear componentes UI de carga Skeletons (`KpiSkeleton`, `ChartSkeleton`, `TableSkeleton`).
- [ ] 3.2 Conectar `pages/Dashboard.tsx` a los custom hooks de React Query reemplazando la simulación hardcodeada.
- [ ] 3.3 Añadir botón de reintento (`Retry`) y vista de error elegante ante fallos de conexión.
