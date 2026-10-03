## Why

Actualmente la cabecera cuenta con un buscador genérico de texto que no aporta valor operativo a los ejecutivos. Además, el Dashboard muestra únicamente métricas agregadas a nivel global sin permitir aislar el consumo de una entidad o compañía específica (ej. VASS Global Tech), ni profundizar en el desglose de ejecuciones agrupadas por departamento y modelo LLM.

## What Changes

- **Sustitución del Buscador en el Header**: Reemplazar el input de búsqueda en `Header.tsx` por un selector dinámico de Entidad/Compañía (`OrganizationScopeSelector.tsx`) alimentado desde el backend.
- **Filtrado Global por `organizationId`**: El selector dinámico permite filtrar todo el Dashboard por el `UUID` real de la organización, sincronizando la selección en la URL (`?organizationId=<uuid>`).
- **Nuevos Endpoints en Backend API**:
  - `GET /api/v1/telemetry/organizations`: Devuelve el catálogo dinámico de organizaciones registradas (`id`, `name`).
  - `GET /api/v1/telemetry/department-executions`: Devuelve las ejecuciones agrupadas por Entidad ➔ Departamento ➔ Modelo LLM con métricas de volumen, tokens (input/output), coste y latencia promedio.
  - Parámetro `organizationId` opcional en `GET /kpis`, `GET /chart` y `GET /breakdown`.
- **Nueva Vista de Detalle de Ejecuciones (`ExecutionLogsView.tsx`)**: Nueva pestaña en el frontend que permite inspeccionar la jerarquía Entidad ➔ Departamento ➔ Modelo LLM con métricas operativas y de latencia.

## Capabilities

### New Capabilities
- `department-execution-analytics`: Vista y análisis detallado de ejecuciones de modelos IA agrupados por Entidad, Departamento y Modelo.

### Modified Capabilities
- `dashboard-ui`: Integración del selector dinámico de Organización en el Header y filtrado de KPIs, gráficos y tablas por `organizationId`.
- `backend-api`: Exposición del catálogo de organizaciones, soporte de parámetro `organizationId` en consultas agregadas y endpoint de ejecuciones por departamento.

## Impact

- **Backend (`backend/src/modules/telemetry`)**: Actualización de `TelemetryService`, `TelemetryController` y `telemetryRoutes` para soportar `organizationId` y los dos nuevos endpoints.
- **Frontend (`frontend/src`)**:
  - Creación de `OrganizationScopeSelector.tsx` y `ExecutionLogsView.tsx`.
  - Actualización de `Header.tsx`, `Dashboard.tsx` y `telemetryApi.ts`.
  - Integración de i18n bilingüe (ES/EN) para todos los elementos nuevos.
