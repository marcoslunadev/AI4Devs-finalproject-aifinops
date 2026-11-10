## Context

La arquitectura de estado de AIFinOps utiliza **Zustand** (`useFilterStore`) como almacén de verdad reactivo para los filtros globales (`range`, `environment`, `provider`, `selectedModels`, `organizationId`), y el hook personalizado `useSyncFilterParams` para sincronizar dichos filtros con los query params de la URL de React Router.

Actualmente, `OrganizationScopeSelector.tsx` estaba desacoplado de `useFilterStore`, leyendo y escribiendo únicamente en `useSearchParams`. Al cambiar la entidad en el `<select>`, `useSyncFilterParams` detectaba la mutación de `searchParams` y, al consultar `filters.organizationId` en el store (que seguía vacío), borraba inmediatamente el parámetro de la URL y devolvía el valor del dropdown a vacío. Además, los hooks de telemetría en `Dashboard.tsx` (`useTelemetryKpis`, `useTelemetryChart`, `useTelemetryBreakdown`) leen de `filters.organizationId`, por lo que nunca recibían la entidad seleccionada.

## Goals / Non-Goals

**Goals:**
- Establecer `useFilterStore` como la única fuente de verdad (Single Source of Truth) para la entidad seleccionada (`organizationId`).
- Conectar `OrganizationScopeSelector` a `useFilterStore.setOrganizationId` y `useFilterStore.organizationId`.
- Optimizar `useSyncFilterParams` para sincronización bidireccional fiable:
  - Hidratación inicial desde URL hacia `useFilterStore`.
  - Propagación reactiva de cambios de `useFilterStore` hacia la URL (`setSearchParams({ replace: true })`).
  - Sincronización desde URL hacia el store en navegación de historial (Back/Forward).
  - Eliminación de condiciones de carrera y borrado espurio de parámetros.
- Asegurar que todas las peticiones de telemetría en `Dashboard.tsx` filtren por `organizationId`.
- Cumplir el requisito de cobertura de pruebas unitarias e integración >80% con Vitest y React Testing Library.

**Non-Goals:**
- Modificar el backend o endpoints de la API (ya soportan el parámetro `organizationId`).
- Modificar otros filtros independientes como `environment` o `provider`.
- Añadir persistencia en `localStorage` (la persistencia y compartición se rigen por la URL).

## Decisions

### 1. `OrganizationScopeSelector` conectado directamente a Zustand
- **Decisión**: El componente consumirá `organizationId` y `setOrganizationId` directamente de `useFilterStore`.
- **Razón**: `GlobalFilterBar` y `Dashboard` ya consumen `useFilterStore`. La reactividad es instantánea en toda la jerarquía de componentes sin depender del ciclo asíncrono de renderizado de la URL.
- **Alternativa descartada**: Mantener el estado en `searchParams` y forzar a `Dashboard` a leer de la URL. Descartado porque rompe la coherencia arquitectónica con el resto de filtros y perpetúa discrepancias con Zustand.

### 2. Guardia contra bucles y borrado en `useSyncFilterParams`
- **Decisión**: Implementar un control con refs (`isSyncingToUrlRef` e `isHydratedRef`) para distinguir mutaciones originadas en el store de mutaciones originadas en la navegación de la URL.
- **Razón**: Evita que un cambio en la URL sobreescriba el store con valores obsoletos o que un cambio en el store borre parámetros legítimos de la URL antes de que el store se actualice.
- **Alternativa descartada**: Eliminar la sincronización con la URL. Descartado porque los enlaces compartibles y recargas de página requieren mantener los filtros en la URL.

### 3. Tests unitarios con mocks de TanStack Query y MemoryRouter
- **Decisión**: Probar `OrganizationScopeSelector` usando `@testing-library/react`, `MemoryRouter` y mocks de `useOrganizations` y `useFilterStore`.
- **Razón**: Permite validar de forma aislada y determinista el comportamiento visual, el evento `onChange`, el estado de carga (`disabled`) y la interacción con el store global con una cobertura superior al 80%.

## Risks / Trade-offs

- **[Riesgo]** Bucle infinito de re-renders entre `useSyncFilterParams` y `setSearchParams`.
  - **Mitigación**: Usar banderas en `useRef` para bloquear la re-propagación circular y verificar si los valores realmente han cambiado antes de invocar `setSearchParams(..., { replace: true })` o `setFilters(...)`.
- **[Riesgo]** Desincronización al navegar entre rutas con y sin filtros.
  - **Mitigación**: `DashboardLayout` incluye `OrganizationScopeSelector` en el Header; el valor seleccionado en `useFilterStore` se mantiene entre cambios de pestaña sin perderse.
