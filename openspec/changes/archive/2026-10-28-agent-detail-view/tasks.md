## 1. Frontend: Cliente API y Tipos de Agente

- [x] 1.1 Crear `frontend/src/services/agentApi.ts` con tipos TypeScript (`AgentDetail`, `AgentMetrics`, `AgentExecution`, `PaginatedExecutions`) y funciones `fetchAgentDetail(agentId)` y `fetchAgentExecutions(agentId, page, limit)`.
- [x] 1.2 Añadir claves de internacionalización (ES y EN) en `frontend/src/lib/i18n.ts` para las vistas de auditoría del agente.

## 2. Frontend: Componentes y Vistas de Detalle

- [x] 2.1 Crear el componente `frontend/src/pages/AgentDetailView.tsx` con tarjeta de cabecera (datos técnicos del agente), panel de KPIs resumidos y estados de carga/error.
- [x] 2.2 Implementar en `AgentDetailView.tsx` la tabla de auditoría paginada con selector de páginas, timestamp formateado y badges de estado (`SUCCESS`, `ERROR`, `TIMEOUT`, `RATE_LIMIT_EXCEEDED`).
- [x] 2.3 Registrar la ruta `/agents/:agentId` bajo `ProtectedRoute` en `frontend/src/App.tsx`.
- [x] 2.4 Añadir navegación interactiva a la ficha del agente desde `frontend/src/components/NavigationTabs.tsx` y enlaces en la tabla drill-down.

## 3. Verificación, Pruebas y Cobertura (>80%)

- [x] 3.1 Crear pruebas unitarias para `agentApi.ts` y el renderizado de estados de `AgentDetailView`.
- [x] 3.2 Ejecutar las suites de pruebas de backend y frontend validando una cobertura de código igual o superior al 80% (`>= 80%`).
- [x] 3.3 Validar la compilación del proyecto sin errores (`npm run build`).
