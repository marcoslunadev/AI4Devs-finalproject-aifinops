## ADDED Requirements

### Requirement: Catálogo de Organizaciones
El backend API SHALL exponer la ruta `GET /api/v1/telemetry/organizations` devolviendo el listado de organizaciones activas registradas en la base de datos con su ID (UUID) y nombre.

#### Scenario: Consulta de organizaciones registradas
- **WHEN** se realiza una petición HTTP `GET /api/v1/telemetry/organizations`
- **THEN** el sistema responde status 200 OK con una lista JSON conteniendo `{ id: string, name: string }` de cada organización

### Requirement: Filtrado de Telemetría por `organizationId`
Los endpoints `GET /api/v1/telemetry/kpis`, `GET /api/v1/telemetry/chart` y `GET /api/v1/telemetry/breakdown` SHALL aceptar un parámetro opcional `organizationId` en el Query String.

#### Scenario: Filtrado por UUID de Organización
- **WHEN** se incluye `?organizationId=<uuid>` en las peticiones a los endpoints agregados de telemetría
- **THEN** las consultas a Prisma aplican la cláusula de filtrado correspondiente a través de la relación de la ejecución con el usuario/organización
- **AND** la respuesta devuelve métricas calculadas exclusivamente para dicha organización

### Requirement: Desglose de Ejecuciones por Departamento y Modelo
El backend API SHALL exponer la ruta `GET /api/v1/telemetry/department-executions` aceptando un parámetro opcional `organizationId`.

#### Scenario: Consulta de ejecuciones agrupadas por departamento
- **WHEN** se consulta `GET /api/v1/telemetry/department-executions`
- **THEN** el sistema agrupa los datos de telemetría por Organización, Departamento y Modelo LLM
- **AND** calcula `totalCalls`, `promptTokens`, `completionTokens`, `totalCost` y `avgLatencyMs`
