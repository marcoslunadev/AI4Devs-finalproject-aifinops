## ADDED Requirements

### Requirement: Serie Temporal Continua con Zero-Filling (`GET /api/v1/telemetry/chart`)
El endpoint `GET /api/v1/telemetry/chart` SHALL generar un rango ininterrumpido de fechas continuas desde `(Hoy - N días)` hasta la fecha actual `Hoy`, rellenando con valores a cero (`cost: 0`, `tokens: 0`, `executions: 0`) todos los días en los que no existan ejecuciones registradas.

#### Scenario: Petición de gráfico temporal con días sin actividad
- **WHEN** un cliente consulta `GET /api/v1/telemetry/chart?range=7d`
- **THEN** la API devuelve exactamente 7 elementos correspondientes a los últimos 7 días calendario concluyendo en el día de hoy
- **AND** asigna `cost: 0`, `tokens: 0` y `executions: 0` a los días que no tienen registros en la base de datos
