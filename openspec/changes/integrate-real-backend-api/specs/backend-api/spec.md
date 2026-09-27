## ADDED Requirements

### Requirement: Endpoints de Telemetría para el Executive Dashboard
El backend API SHALL exponer tres endpoints bajo `/api/v1/telemetry` que agreguen y retornen los datos de consumo de IA registrados en la base de datos PostgreSQL.

- `GET /api/v1/telemetry/kpis`: Retorna los totales acumulados (Coste, Ejecuciones, Tokens, Coste Promedio, Orgs Activas, Tasa de Error) y variaciones porcentuales.
- `GET /api/v1/telemetry/chart`: Retorna la serie temporal agregada por día (coste USD y volumen de tokens).
- `GET /api/v1/telemetry/breakdown`: Retorna la estructura jerárquica (Organización → Entornos → Usuarios/Aplicaciones) con consumos y presupuestos.

#### Scenario: Petición exitosa a los endpoints de telemetría
- **WHEN** un cliente autenticado realiza una petición GET a `/api/v1/telemetry/kpis`
- **THEN** el sistema responde `200 OK` con la estructura de métricas agregadas validada por Zod
