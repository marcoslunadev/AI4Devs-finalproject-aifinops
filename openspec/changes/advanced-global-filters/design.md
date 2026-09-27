## Context

The executive dashboard needs a centralized state management pattern to handle multi-parameter filtering across all child widgets. See `proposal.md` for motivation.

## Goals / Non-Goals

**Goals:**
- Implement a global Zustand filter store (`src/store/filterStore.ts`).
- Create `GlobalFilterBar.tsx` containing Date Range Shortcuts (7D, 30D, 90D, YTD, Custom), Provider/Model multi-select, and Organization dropdowns.
- Sync active filter parameters with URL search params using `useSearchParams` from `react-router-dom`.
- Ensure all dashboard components (`KpiCard`, `CostChart`, `DrillDownTable`) automatically reflect active global filters.

**Non-Goals:**
- Server-side stored saved presets per user in the database (local Zustand + URL query params is sufficient for this scope).

## Decisions

### Decisión 1: Gestión de Estado Global de Filtros
**Opción seleccionada**: Zustand (`useFilterStore`) combinado con `react-router-dom` `useSearchParams`.
**Alternativas consideradas**: React Context simple, estado prop-drilling en `Dashboard.tsx`.
**Rationale**: Zustand ya está instalado en el proyecto. Evita prop drilling innecesario a través de componentes hijos deeply nested y permite sincronizar bidireccionalmente los parámetros en la URL para compartir enlaces directos.

### Decisión 2: Diseño de la Barra de Filtros (`GlobalFilterBar`)
**Opción seleccionada**: Barra flotante/adherida debajo del Header principal con diseño responsive adaptado a pantallas pequeñas (Mobile popover / drawer de filtros).
**Alternativas consideradas**: Filtros dispersos en cada tarjeta individual.
**Rationale**: Unificar los filtros en un único panel global proporciona claridad ejecutiva y evita inconsistencias donde un gráfico esté filtrado por 7 días y la tabla por 30 días.

## Risks / Trade-offs

- **Risk**: URLs extremadamente largas si se seleccionan docenas de modelos individualmente.
  - **Mitigation**: Agrupar modelos por proveedor (ej. `provider=openai`) cuando se seleccionan todos los modelos de dicho proveedor.
