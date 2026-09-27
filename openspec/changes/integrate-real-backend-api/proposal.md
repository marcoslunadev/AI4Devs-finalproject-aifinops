## Why

Currently, the AIFinOps frontend executive dashboard displays static mock telemetry data. To make the platform fully functional, we need to connect the UI components to live backend endpoints, enabling real-time cost, token, and execution analytics powered by TanStack Query and PostgreSQL telemetry tables.

## What Changes

- Create backend API endpoints under `/api/v1/telemetry/` for KPIs, time-series charts, and hierarchical drill-down data.
- Build frontend API services in `frontend/src/services/telemetryApi.ts` using fetch/axios.
- Integrate `@tanstack/react-query` custom hooks (`useTelemetryKpis`, `useTelemetryChart`, `useTelemetryBreakdown`) in the Dashboard UI.
- Implement loading state Skeletons and Error Fallback UI for dashboard components.
- Support refetching and live synchronization of telemetry metrics.

## Capabilities

### New Capabilities

### Modified Capabilities

- `dashboard-ui`: Integrate TanStack Query hooks to fetch live backend telemetry metrics, handle loading/error states, and update real-time visual indicators.
- `backend-api`: Expose `/api/v1/telemetry/kpis`, `/api/v1/telemetry/chart`, and `/api/v1/telemetry/breakdown` HTTP endpoints with Zod validation.

## Impact

- **Frontend**: Adds API service layer in `src/services`, TanStack Query hooks in `src/hooks`, and replaces hardcoded mock data in `Dashboard.tsx`.
- **Backend**: Adds Telemetry controller, service, and routes under `/api/v1/telemetry`.
