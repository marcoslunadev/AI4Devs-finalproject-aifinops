## ADDED Requirements

### Requirement: Respuestas de Telemetría Basadas en Consultas Agregadas
El módulo de telemetría de la API v1 SHALL devolver métricas KPI, desgloses por jerarquía y gráficos temporales calculados directamente desde PostgreSQL a través de agregaciones dinámicas de Prisma ORM.

#### Scenario: Consulta de resumen KPI con base de datos poblada
- **WHEN** un cliente realiza un `GET /api/v1/telemetry/kpis`
- **THEN** el sistema realiza un `aggregate` de suma de costes e ID count sobre la tabla `ExecutionLog` y calcula el total de organizaciones dinámicamente desde PostgreSQL.
