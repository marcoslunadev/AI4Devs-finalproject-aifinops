## 1. Store Global de Filtros (Zustand)
- [x] 1.1 Crear el store de filtros en `frontend/src/store/filterStore.ts` con estado para fecha, modelo/proveedor u organización.
- [x] 1.2 Implementar hook personalizado de integración con URL `useSyncFilterParams.ts`.

## 2. Componentes UI de Filtrado
- [x] 2.1 Diseñar e implementar el componente `GlobalFilterBar.tsx` en `frontend/src/components/GlobalFilterBar.tsx`.
- [x] 2.2 Agregar controles de rango temporal (7D, 30D, 90D, YTD y DatePicker personalizado).
- [x] 2.3 Agregar selectores desplegables para filtro por Proveedor/Modelo y Organización.

## 3. Integración en el Dashboard
- [x] 3.1 Integrar `GlobalFilterBar` en la parte superior de `pages/Dashboard.tsx`.
- [x] 3.2 Reactivar el filtrado dinámico en los componentes de KPI, Gráfico y Tabla según los filtros activos.
