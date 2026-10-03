## Context

Ver `proposal.md` para la motivación. Actualmente `TelemetryService.ts` descarga todos los registros de `ExecutionLog` en memoria mediante `findMany()` y realiza cálculos manuales con `.reduce()`. Esto resulta ineficiente para decenas de miles de filas. Además, no se expone el estado de procesamiento de los ficheros de ingesta asíncrona ni el timestamp del último lote procesado.

## Goals / Non-Goals

**Goals:**
- Delegar las operaciones numéricas (suma de costes, número de ejecuciones, totales de tokens) directamente al motor de base de datos PostgreSQL mediante Prisma `aggregate` y SQL nativo `$queryRaw`.
- Proveer un endpoint ligero GET `/api/v1/telemetry/status` que consulte `IngestionAuditLog` para retornar el estado actual de ingesta y la fecha/hora de la última ingesta finalizada (`lastIngestedAt`).
- Añadir en el frontend (`Dashboard.tsx`) una insignia de estado animada ("Ingestando datos...") y una etiqueta con la última actualización ("Última actualización: DD/MM/YYYY HH:mm"), configurando polling reactivo en React Query solo mientras haya una ingesta activa.

**Non-Goals:**
- Crear vistas materializadas en PostgreSQL para esta fase (reservado para millones de registros/día).
- Modificar el esquema Prisma de `ExecutionLog` o `IngestionAuditLog`.

## Decisions

### Decisión 1: Agregaciones Nativas SQL con Prisma
Utilizar `prisma.executionLog.aggregate({ _sum: { cost: true }, _count: { id: true } })` y `$queryRaw` para extraer la suma de `metadata->>'totalTokens'`.
- *Razón*: Mantiene la ejecución en el motor SQL optimizado con índices B-Tree en lugar de transferir arrays masivos a la memoria de Node.js.

### Decisión 2: Endpoint `/api/v1/telemetry/status` basado en `IngestionAuditLog`
Consultar el registro de auditoría más reciente en `IngestionAuditLog`:
- Si existe algún registro con `status: 'PROCESSING'`, el sistema retorna `status: 'PROCESSING'`.
- De lo contrario, retorna `status: 'COMPLETED'` y la fecha `updatedAt` / `createdAt` del último registro exitoso como `lastIngestedAt`.
- *Razón*: Utiliza la tabla de auditoría existente de forma eficiente sin requerir tablas adicionales.

### Decisión 3: Polling Condicional en React Query
En `useTelemetryStatus()`, configurar `refetchInterval` dinámico:
```ts
refetchInterval: (query) => (query.state.data?.status === "PROCESSING" ? 5000 : false)
```
- *Razón*: Evita tráfico inútil cuando el sistema está inactivo, pero actualiza automáticamente la interfaz cada 5 segundos durante una ingesta.

## Risks / Trade-offs

- **[Riesgo]** Incompatibilidad de tipos en `metadata` al sumar tokens con `$queryRaw`.
  - *Mitigación*: Utilizar casting seguro `COALESCE(SUM((metadata->>'totalTokens')::int), 0)` en PostgreSQL.
