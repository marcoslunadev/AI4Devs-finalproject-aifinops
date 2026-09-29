## Context

Ver `proposal.md` para la motivación. Actualmente la base de datos carece de un script de datos iniciales (seeding) de registros de telemetría de IA (`ExecutionLog`), provocando que `TelemetryService.ts` devuelva datos por defecto o generados sintéticamente.

## Goals / Non-Goals

**Goals:**
- Desarrollar un script ejecutable TypeScript `backend/prisma/seed.ts` para poblar Organizaciones, Departamentos, Usuarios y un histórico de `ExecutionLog` con modelos variados (`gpt-4o`, `claude-3-5-sonnet`, `gemini-1.5-pro`, `text-embedding-3-small`).
- Integrar la invocación del seed en `backend/package.json` mediante `"prisma": { "seed": "tsx prisma/seed.ts" }`.
- Refactorizar los métodos de `TelemetryService.ts` para realizar agrupaciones dinámicas en PostgreSQL usando Prisma:
  - `getTimeSeriesChart`: Usar `prisma.executionLog.findMany` o agrupaciones por fecha para mapear los puntos temporales formateados (ej. `"Sep 25"`).
  - `getHierarchicalBreakdown`: Calcular costes y ejecuciones agregando los `ExecutionLog` asociados a cada usuario, departamento y organización.
- Mantener fallbacks defensivos exclusivamente para el escenario en que la base de datos esté vacía o en migración.

**Non-Goals:**
- Alterar la estructura de la base de datos o ejecutar migraciones destructivas en `schema.prisma`.
- Modificar las firmas o esquemas Zod de la API REST entregados al Frontend.

## Decisions

### Decisión 1: Generación de Datos en `prisma/seed.ts` con `tsx`
Usar `tsx` para ejecutar el script TypeScript de seeding directamente sin necesidad de transpilación previa manual a JavaScript.
- *Razón*: `tsx` es ligero, rápido y estándar en proyectos Node.js con Prisma.
- *Alternativa considerada*: Compilar con `tsc` previa ejecución (añade pasos innecesarios al flujo de desarrollo).

### Decisión 2: Estrategia de Agregación de Serie Temporal (`getTimeSeriesChart`)
Dado que PostgreSQL almacena `createdAt` como timestamp (`DateTime`), realizaremos un desglose por días sumando costes y ejecuciones dentro del rango `7d`, `30d` o `90d`.
- *Razón*: Mantiene la compatibilidad con el tipo de retorno `ChartResponse` y permite representar variaciones reales según los datos sembrados.

## Risks / Trade-offs

- **[Riesgo]** Si no se ejecuta `npx prisma db seed` o si la base de datos PostgreSQL local no está arriba, la API retornaría arrays vacíos si no existen fallbacks.
  - *Mitigación*: Se mantendrá el bloque `try/catch` defensivo en `TelemetryService.ts` devolviendo la estructura básica por defecto únicamente cuando `executionLog.count() === 0`.
