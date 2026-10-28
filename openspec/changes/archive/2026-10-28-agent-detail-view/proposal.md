## Why

El feedback de la primera entrega exige explícitamente recortar el alcance del MVP a un "camino feliz" centrado en el dashboard jerárquico, la ingesta estructurada y la vista de detalle de agente (`AgentDetailView`). Aunque el backend ya cuenta con los endpoints para consultar la ficha técnica y las ejecuciones paginadas del agente (`/api/v1/agents/:agentId`), el frontend carece de la interfaz de usuario que permita a los directivos y analistas de FinOps inspeccionar la auditoría granular de un agente de IA específico (consumo, llamadas históricas, latencia y estados de error).

## What Changes

- Crear el servicio de cliente `agentApi.ts` en el frontend utilizando el cliente centralizado Axios para consumir `/api/v1/agents/:agentId` y `/api/v1/agents/:agentId/executions`.
- Crear el componente `AgentDetailView.tsx` (y modal/vista de auditoría) con:
  - Ficha técnica superior: nombre del agente, ID único, modelo LLM, proveedor, departamento y organización vinculada.
  - Tarjetas de resumen métrico: total de llamadas, coste total en USD, latencia promedio y porcentaje de éxito.
  - Tabla interactiva de ejecuciones paginadas con paginador (anterior/siguiente), selector de tamaño de página, timestamp formateado, tokens consumidos (prompt/completion), coste unitario en USD y badge visual del estado de ejecución (`SUCCESS`, `ERROR`, `TIMEOUT`, `RATE_LIMIT_EXCEEDED`).
- Habilitar la navegación en el frontend mediante ruta protegida `/agents/:agentId` y botón de acceso directo desde la pestaña de navegación o enlaces interactivos en el dashboard.
- Incorporar traducción bilingüe (Español / Inglés) en `i18n.ts` para todas las etiquetas del detalle del agente.
- Añadir pruebas de componentes en frontend y validar cobertura de tests unitarios/integración `>= 80%`.

## Capabilities

### New Capabilities
- `agent-observability`: Interfaz de usuario interactiva y explorador de auditoría granular para agentes de IA con ficha técnica, métricas agregadas y tabla de llamadas paginadas con badges de estado de ejecución.

### Modified Capabilities

## Impact

- Frontend: Añade `frontend/src/pages/AgentDetailView.tsx`, `frontend/src/services/agentApi.ts`, actualiza `App.tsx`, `NavigationTabs.tsx` y `i18n.ts`.
- Backend: Reutiliza los endpoints ya existentes en `agentRoutes.ts` asegurando compatibilidad plena de tipos TypeScript.
- Dependencias: Sin librerías externas adicionales; utiliza Lucide React, TailwindCSS y Zustand/Axios ya instalados.
