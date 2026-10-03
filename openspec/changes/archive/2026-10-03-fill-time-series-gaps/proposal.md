## Why

Actualmente en el gráfico de la serie temporal (Evolución de Costes y Tokens para 7D, 30D y 90D), la API backend sólo devuelve los días en los que existen registros explícitos en `ExecutionLog`. Esto provoca que se omitan los días sin actividad (incluyendo el día de hoy si no se han registrado ejecuciones todavía), comprimiendo el eje X y trazando líneas diagonales falsas entre días inconsecutivos en lugar de mostrar los valles reales a cero.

## What Changes

- **Backend**:
  - Actualización de `getTimeSeriesChart()` en `TelemetryService.ts` para construir un rango continuo completo de fechas desde `(Hoy - N días)` hasta el día actual `Hoy`.
  - Implementación del patrón de **Zero-Filling**: Inicializar todos los días del esqueleto temporal con `{ cost: 0, tokens: 0, executions: 0 }` y superponer las agregaciones de los días con ejecuciones registradas.
  - Garantizar que el día actual (Hoy) siempre esté presente como la fecha final del eje X.

## Capabilities

### Modified Capabilities

- `backend-api`: El endpoint `GET /api/v1/telemetry/chart` retornará un arreglo de fechas continuo con zero-filling completando los días sin consumo hasta la fecha actual.

## Impact

- **Backend**:
  - `backend/src/modules/telemetry/services/TelemetryService.ts`
