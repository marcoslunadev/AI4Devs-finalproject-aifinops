## Context

Véase `proposal.md` y `specs/agent-observability/spec.md`. El backend de AIFinOps ya dispone de los controladores y servicios para exponer la ficha técnica (`GET /api/v1/agents/:agentId`) y las llamadas paginadas (`GET /api/v1/agents/:agentId/executions`). Esta propuesta de diseño especifica la arquitectura del frontend para conectar dichos endpoints, estructurar el componente visual `AgentDetailView.tsx` y ofrecer una experiencia de usuario fluida con TailwindCSS, React 19 y TypeScript.

## Goals / Non-Goals

**Goals:**
- Implementar el cliente `agentApi.ts` utilizando la instancia centralizada de Axios (`api.ts`), garantizando el envío automático de cabeceras de autorización JWT.
- Diseñar la página `AgentDetailView.tsx` con componentes modulares:
  - Tarjeta de ficha técnica con datos del agente (ID, Nombre, Modelo, Proveedor, Organización).
  - Bloque de KPIs clave del agente: Coste total acumulado, Número de ejecuciones, Latencia media y Tasa de éxito.
  - Tabla paginada de llamadas históricas con badges cromáticos para cada `ExecutionStatus` (`SUCCESS`, `ERROR`, `TIMEOUT`, `RATE_LIMIT_EXCEEDED`).
- Registrar la ruta protegida `/agents/:agentId` dentro de `App.tsx` y enlazarla desde las vistas principales de la aplicación.
- Proveer soporte bilingüe completo (ES/EN) a través de `i18n.ts`.
- Mantener cobertura de pruebas unitarias superior al 80%.

**Non-Goals:**
- Edición interactiva de la configuración o cambio de tarifas del agente desde esta vista (funcionalidad reservada a v2).
- Exportación manual de logs a formato CSV/Excel (se mantiene el alcance centrado en visualización analítica).

## Decisions

### 1. Cliente API Modular (`agentApi.ts`)
- **Decisión**: Crear un servicio específico en `frontend/src/services/agentApi.ts` que encapsule las llamadas HTTP a `/api/v1/agents`.
- **Alternativas consideradas**:
  - *Llamadas directas con fetch en el componente*: Desaconsejado, ya que duplica URLs y no reutiliza los interceptores de Axios y control de token 401.
- **Razón**: Mantiene la arquitectura limpia y la separación estricta de responsabilidades.

### 2. Paginación en Servidor con Caché Reactiva
- **Decisión**: La tabla de ejecuciones solicitará páginas mediante `page` y `limit` contra la API de Node.js/Prisma, conservando el estado de página en el componente.
- **Alternativas consideradas**:
  - *Cargar todas las llamadas a memoria*: No escala para agentes con miles de llamadas en producción.
- **Razón**: Tiempo de respuesta instantáneo y consumo de memoria contenido en el navegador.

### 3. Matriz Visual de Estados de Ejecución
- **Decisión**: Unificar el renderizado visual de los cuatro estados canónicos definidos en el enum Prisma:
  - `SUCCESS`: Verde esmeralda (`emerald-500` / `emerald-950`).
  - `ERROR`: Rojo carmesí (`rose-500` / `rose-950`).
  - `TIMEOUT`: Ámbar cálido (`amber-500` / `amber-950`).
  - `RATE_LIMIT_EXCEEDED`: Púrpura eléctrico (`purple-500` / `purple-950`).
- **Razón**: Permite a los analistas de FinOps identificar anomalías y caídas de servicio de un solo vistazo.

## Risks / Trade-offs

- **[Riesgo: Agente sin llamadas registradas]** → *Mitigación*: Implementar un estado vacío (*empty state*) elegante que invite a generar telemetría o verificar la ingesta.
- **[Riesgo: Identificador de agente erróneo en la URL]** → *Mitigación*: Capturar errores 404 del backend y renderizar un banner amigable con botón de retorno al Dashboard.
