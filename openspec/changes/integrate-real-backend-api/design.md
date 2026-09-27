## Context

The executive dashboard interface currently uses static mock data. See `proposal.md` for motivation.
We need a robust, scalable architecture to fetch and manage live telemetry data from PostgreSQL through the Express backend using TanStack React Query.

## Goals / Non-Goals

**Goals:**
- Implement backend controller, service, and repository layers for Telemetry analytics (`/api/v1/telemetry/*`).
- Create typed client fetchers (`frontend/src/services/telemetryApi.ts`) and React Query custom hooks (`useTelemetryKpis`, `useTelemetryChart`, `useTelemetryBreakdown`).
- Add fallback Skeletons and Error Retry states to all dashboard widgets.
- Ensure graceful fallback if backend is unreachable or returning empty data.

**Non-Goals:**
- Real-time WebSocket streaming (polling / cache invalidation via React Query is sufficient for MVP).
- Complete user authentication flow setup in this specific change (routes will use optional JWT middleware).

## Decisions

### Decisión 1: Data Fetching Library
**Opción seleccionada**: `@tanstack/react-query` (v5).
**Alternativas consideradas**: `useEffect` con `fetch` nativo, `swr`.
**Rationale**: React Query ya está instalado en el frontend. Proporciona caching automático, estados de `isLoading`/`isError`, reintentos automáticos, e inhabilitación limpia de cache sin boilerplate manual.

### Decisión 2: Estructura de Endpoints de Telemetría
**Opción seleccionada**: 3 endpoints especializados bajo `/api/v1/telemetry`:
1. `GET /api/v1/telemetry/kpis` (Resumen agregativo)
2. `GET /api/v1/telemetry/chart?range=30d` (Serie temporal)
3. `GET /api/v1/telemetry/breakdown` (Árbol jerárquico Org -> Env -> App)
**Alternativas consideradas**: Un único endpoint monolítico `/api/v1/telemetry/dashboard`.
**Rationale**: Endpoints independientes permiten al frontend cargar las tarjetas KPI inmediatamente mientras el gráfico o la tabla jerárquica completan sus consultas más complejas de forma asíncrona (progressive rendering).

### Decisión 3: Manejo de Estados de Carga
**Opción seleccionada**: Skeleton Loaders animados en TailwindCSS para cada componente (`KpiCardSkeleton`, `ChartSkeleton`, `TableSkeleton`).
**Alternativas consideradas**: Spinner global de pantalla completa.
**Rationale**: Los Skeletons por componente evitan saltos de layout (CLS) y mejoran la percepción de velocidad.

## Risks / Trade-offs

- **Risk**: Peticiones lentas en agregación de la base de datos para miles de registros de telemetría.
  - **Mitigation**: Crear índices en PostgreSQL sobre las columnas `createdAt`, `organizationId` y `environmentId` y utilizar caching en memoria en el backend si fuera necesario.
- **Risk**: Fallo de conexión con el backend durante el desarrollo local.
  - **Mitigation**: El cliente de API del frontend devolverá una respuesta estructurada con fallback elegante y un botón de reintento (`Retry`).
