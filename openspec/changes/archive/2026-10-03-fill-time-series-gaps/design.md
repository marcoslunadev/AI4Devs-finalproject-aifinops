## Context

Ver `proposal.md` para la motivación. Actualmente en `TelemetryService.ts`, el método `getTimeSeriesChart` únicamente procesa los elementos devueltos por `prisma.executionLog.findMany`. Si no hay ejecuciones registradas en ciertos días, la lista resultante omite esas fechas, colapsando el eje temporal en el frontend.

## Goals / Non-Goals

**Goals:**
- Construir en `getTimeSeriesChart` un array/mapa inicial de $N$ días continuos finalizando exactamente en la fecha actual (`now`).
- Rellenar cada día con `{ cost: 0, tokens: 0, executions: 0 }` (pattern *Zero-Filling*).
- Sumar los costes, tokens y ejecuciones reales sobre el esqueleto de $N$ días.

**Non-Goals:**
- Alterar la estructura de respuesta consumida por Recharts (`ChartDataPoint`).
- Cambiar la lógica del selector de rango (7d, 30d, 90d) en el frontend.

## Decisions

### Decisión 1: Construcción de Esqueleto de Fechas de `(now - (N-1) días)` a `now`
En `getTimeSeriesChart(range)`:
```ts
const days = range === "7d" ? 7 : range === "90d" ? 90 : 30;
const dateMap = new Map<string, { cost: number; tokens: number; executions: number }>();

for (let i = days - 1; i >= 0; i--) {
  const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
  const dateStr = d.toLocaleDateString("en-US", { month: "short", day: "2-digit" });
  dateMap.set(dateStr, { cost: 0, tokens: 0, executions: 0 });
}
```
- *Razón*: Asegura que las 7, 30 o 90 claves existan siempre en orden cronológico ascendente, concluyendo en el día actual (Hoy).

### Decisión 2: Mapeo de `ExecutionLog` sobre el Esqueleto
Recorrer los registros devueltos por la base de datos y acumular en `dateMap`:
```ts
for (const log of logs) {
  const dateStr = log.createdAt.toLocaleDateString("en-US", { month: "short", day: "2-digit" });
  const existing = dateMap.get(dateStr);
  if (existing) {
    existing.cost = Number((existing.cost + Number(log.cost)).toFixed(2));
    existing.tokens += log.metadata?.totalTokens || 0;
    existing.executions += 1;
  }
}
```
- *Razón*: Garantiza que los días con actividad sumen sus valores reales mientras que los días sin actividad conservan el valor `0`, manteniendo el eje X continuo y constante.

## Risks / Trade-offs

- **[Riesgo]** Cambio de zona horaria local al formatear fechas con `toLocaleDateString`.
  - *Mitigación*: Utilizar opciones consistentes `en-US` con `{ month: "short", day: "2-digit" }` en todo el loop.
