## Why

Al intentar seleccionar una entidad u organización en el selector de la cabecera (`OrganizationScopeSelector`), la opción seleccionada no se fija en la interfaz y el dashboard no filtra los datos de telemetría.
Esto ocurre porque `OrganizationScopeSelector` manipula directamente `useSearchParams` sin sincronizar con el store global `useFilterStore`, mientras que `useSyncFilterParams` detecta el cambio en la URL y, al ver el store vacío (`organizationId: ""`), borra de inmediato el parámetro `organizationId` de la URL, descartando la selección del usuario e impidiendo la reactividad en los hooks de consulta.

## What Changes

- **Conectar `OrganizationScopeSelector` a `useFilterStore`**: Leer `organizationId` directamente del store y actualizarlo mediante `setOrganizationId`, manteniendo una única fuente de verdad reactiva.
- **Sincronización bidireccional robusta en `useSyncFilterParams`**: Asegurar que la sincronización entre Zustand (`useFilterStore`) y los query params de la URL no cree condiciones de carrera ni elimine parámetros válidos de la URL.
- **Reactividad en consultas de telemetría**: Garantizar que la selección o reseteo de la entidad desencadene la actualización de KPIs, gráficos de costes y tabla jerárquica con el `organizationId` seleccionado.
- **Pruebas unitarias e integración (>80% de cobertura)**: Añadir tests exhaustivos en Vitest + React Testing Library para `OrganizationScopeSelector` y `useSyncFilterParams`.

## Capabilities

### New Capabilities
<!-- None -->

### Modified Capabilities
- `dashboard-ui`: Corrección del selector de entidades en la cabecera (`OrganizationScopeSelector`), garantizando que la selección de una organización persista visualmente, se sincronice de forma bidireccional con la URL y actualice de forma reactiva las métricas y gráficos del dashboard, manteniendo un umbral de cobertura de tests >80%.

## Impact

- **Frontend**:
  - `frontend/src/components/OrganizationScopeSelector.tsx`: Migración del estado local / `useSearchParams` hacia `useFilterStore`.
  - `frontend/src/hooks/useSyncFilterParams.ts`: Refuerzo de la sincronización bidireccional URL <-> Store evitando borrados accidentales de `organizationId`.
  - `frontend/src/components/__tests__/OrganizationScopeSelector.test.tsx`: Nueva suite de tests con cobertura >80%.
  - `frontend/src/hooks/__tests__/useSyncFilterParams.test.ts`: Nueva suite de tests para verificar la sincronización URL-Store.
- **APIs / Backend**: Sin impacto en el backend (los endpoints de telemetría ya soportan el parámetro `organizationId`).
