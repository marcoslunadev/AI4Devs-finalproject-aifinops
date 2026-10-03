## ADDED Requirements

### Requirement: Endpoint de Estado de Ingesta y Auditoría (`GET /api/v1/telemetry/status`)
El backend API SHALL exponer el endpoint `GET /api/v1/telemetry/status` para informar al cliente del estado del motor de ingesta y el timestamp de la última actualización completada.

#### Scenario: Petición de estado de ingesta
- **WHEN** un cliente realiza una petición `GET /api/v1/telemetry/status`
- **THEN** el sistema responde `200 OK` con un cuerpo JSON conteniendo `status` (`"PROCESSING"` | `"COMPLETED"`), `lastIngestedAt` (ISO string o null), `totalRecordsProcessed` y `activeIngestionsCount`

## MODIFIED Requirements

### Requirement: Respuestas de Telemetría Basadas en Consultas Agregadas
El módulo de telemetría de la API v1 SHALL devolver métricas KPI, desgloses por jerarquía y gráficos temporales calculados directamente desde PostgreSQL a través de agregaciones dinámicas nativas (`aggregate`, `groupBy` o `$queryRaw`) sin descargar los registros crudos a memoria en Node.js.

#### Scenario: Consulta de resumen KPI con base de datos poblada
- **WHEN** un cliente realiza un `GET /api/v1/telemetry/kpis`
- **THEN** el sistema ejecuta agregaciones nativas `SUM` y `COUNT` en la base de datos PostgreSQL
- **AND** retorna la respuesta agregada en menos de 50ms sin iterar sobre arrays de registros en memoria Node.js
