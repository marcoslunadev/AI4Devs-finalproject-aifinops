## Purpose

Permite poblar la base de datos PostgreSQL con un volumen representativo y realista de logs de ejecución y entidades organizacionales para posibilitar agregaciones dinámicas reales en telemetría de IA.

## ADDED Requirements

### Requirement: Script de Seeding de Datos de Telemetría
El sistema MUST incluir un script ejecutable de seed (`prisma/seed.ts`) que inserte entidades organizacionales (`Organization`, `Department`, `User`) y al menos 500 registros de ejecuciones (`ExecutionLog`) distribuidos temporalmente en los últimos 90 días.

#### Scenario: Ejecución exitosa del comando de seed
- **WHEN** el desarrollador ejecuta `npm run seed` en el módulo backend
- **THEN** el sistema inserta las organizaciones, departamentos, usuarios y logs de ejecución correspondientes en PostgreSQL sin errores de clave foránea.

### Requirement: Agregación Dinámica de Telemetría vía PostgreSQL
El servicio `TelemetryService` SHALL calcular los indicadores KPI, la serie temporal y el desglose jerárquico mediante agrupaciones `groupBy` y consultas agregadas sobre las tablas de Prisma sin recurrir a funciones sintéticas.

#### Scenario: Petición de gráficos de series temporales desde la BBDD
- **WHEN** se solicita el endpoint `GET /api/v1/telemetry/chart?range=30d` y existen registros en `ExecutionLog`
- **THEN** el backend ejecuta una agregación por día utilizando la fecha de creación de los logs y responde la lista de puntos de series temporales sumando costes y ejecuciones reales.

### Requirement: Manejo de Estados Vacíos (Sin Fallbacks Sintéticos)
El servicio `TelemetryService` SHALL responder listas vacías (`[]`) y valores cero/insignias `--` cuando la consulta a PostgreSQL no arroje registros de ejecución, delegando la presentación de Estados Vacíos (*Empty States*) a los componentes del Frontend.

#### Scenario: Petición con base de datos sin registros
- **WHEN** se consulta cualquier endpoint de telemetría y la tabla `ExecutionLog` no contiene registros
- **THEN** el sistema responde sin generar datos mock sintéticos, entregando arrays vacíos o indicadores en `--`.
