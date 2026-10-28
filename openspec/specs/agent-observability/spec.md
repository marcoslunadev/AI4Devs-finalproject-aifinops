## Purpose

Proporciona una interfaz visual de observabilidad y auditoría granular para agentes de IA en AIFinOps, permitiendo a los roles directivos y técnicos inspeccionar su configuración, métricas agregadas de coste y latencia, y el historial paginado de ejecuciones con sus respectivos estados de éxito o fallo.

## Requirements

### Requirement: Ficha Técnica y Métricas del Agente de IA
El frontend SHALL ofrecer una vista de detalle accesible vía `/agents/:agentId` que consulte y exhiba los datos técnicos del agente desde `GET /api/v1/agents/:agentId`:
- Nombre del agente, identificador único, modelo por defecto, proveedor de LLM y organización/departamento de adscripción.
- Tarjetas de resumen métrico que calculen: total de ejecuciones históricas, coste monetario acumulado en USD, latencia media en milisegundos y tasa de éxito porcentual.

#### Scenario: Visualización de ficha técnica con agente existente
- **WHEN** el usuario navega a `/agents/agent_cm4918239`
- **THEN** la vista consulta `GET /api/v1/agents/agent_cm4918239` y muestra los metadatos y tarjetas métricas del agente

#### Scenario: Agente no encontrado
- **WHEN** el usuario accede a `/agents/inexistente`
- **THEN** la aplicación muestra un estado visual informativo de "Agente no encontrado" con opción de regresar al Dashboard

### Requirement: Explorador Paginado de Auditoría de Llamadas de IA
La vista de detalle de agente SHALL incluir una tabla de ejecuciones paginadas conectada a `GET /api/v1/agents/:agentId/executions?page=N&limit=M`:
- Cada fila SHALL reflejar el timestamp formateado, el modelo utilizado, los tokens de prompt y completion, la latencia en milisegundos, el coste exacto en USD y un badge de estado.
- Los estados de ejecución permitidos SHALL distinguirse con estilos visuales inequívocos:
  - `SUCCESS`: badge verde esmeralda.
  - `ERROR`: badge rojo coral.
  - `TIMEOUT`: badge ámbar/naranja.
  - `RATE_LIMIT_EXCEEDED`: badge púrpura/magenta.
- La tabla SHALL disponer de controles interactivos de paginación previa/siguiente y recuento total de registros.

#### Scenario: Paginación interactiva de llamadas del agente
- **WHEN** el usuario hace clic en el botón "Página Siguiente"
- **THEN** el componente solicita la página siguiente con el offset correspondiente y refresca los registros sin recargar la página

#### Scenario: Representación fiel de estados de ejecución
- **WHEN** una llamada registrada tiene estado `TIMEOUT` o `RATE_LIMIT_EXCEEDED`
- **THEN** la fila muestra el badge correspondiente con su color de advertencia distintivo

### Requirement: Navegación y Rutas de Detalle de Agente
La aplicación frontend SHALL registrar la ruta `/agents/:agentId` bajo `ProtectedRoute`, impidiendo el acceso a usuarios sin sesión activa y permitiendo acceso directo desde los enlaces del dashboard y pestañas de navegación.

#### Scenario: Acceso de usuario no autenticado a detalle de agente
- **WHEN** un usuario no autenticado intenta abrir directamente `http://localhost:5173/agents/agent_cm4918239`
- **THEN** el sistema lo redirige inmediatamente a `/login` preservando la ruta de destino

### Requirement: Cobertura de Pruebas (>80%)
El código introducido o modificado en frontend y backend para el soporte de observabilidad y auditoría de agentes SHALL mantener una cobertura de pruebas unitarias y de integración igual o superior al 80% (`>= 80%`) en líneas, funciones y sentencias.

#### Scenario: Validación de umbrales de cobertura
- **WHEN** se ejecuta la suite de pruebas del proyecto (`npm test`)
- **THEN** la cobertura informada por el test runner es igual o superior al 80% sin fallos de umbral
