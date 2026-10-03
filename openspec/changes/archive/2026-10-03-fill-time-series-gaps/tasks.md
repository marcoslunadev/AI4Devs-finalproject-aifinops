## 1. Implementación de Zero-Filling en Serie Temporal Backend

- [x] 1.1 Modificar `getTimeSeriesChart` en `TelemetryService.ts` para construir un mapa continuo de N días finalizando en la fecha actual (`now`).
- [x] 1.2 Mapear y acumular los registros reales sobre el mapa continuo conservando los valles a cero en los días inactivos.

## 2. Verificación y Pruebas

- [x] 2.1 Verificar que la respuesta de `GET /api/v1/telemetry/chart?range=7d` devuelve exactamente 7 días consecutivos incluyendo la fecha de hoy.
- [x] 2.2 Probar con los selectores de 30D y 90D comprobando que los huecos de días inactivos se muestran a cero en la gráfica de Recharts.
