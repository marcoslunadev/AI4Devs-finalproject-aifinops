## Why

Actualmente, `TelemetryService.ts` recurre parcialmente a datos estáticos/sintéticos para generar la serie temporal y algunos desgloses jerárquicos de costes si las tablas están vacías. Para alcanzar una solución de producción realista y completamente integrada con PostgreSQL, es necesario disponer de un script de seeding (`prisma/seed.ts`) que genere volumen de datos realistas (múltiples organizaciones, departamentos, usuarios y logs de ejecución de IA con fechas, costes y modelos variados) y actualizar `TelemetryService.ts` para que realice agrupaciones dinámicas (`groupBy`, agregaciones por rangos de fechas) directamente mediante Prisma ORM.

## What Changes

- Creación del script de seed en `backend/prisma/seed.ts` para poblar automáticamente organizaciones (`VASS Global Tech`, `Banking Solutions`, etc.), departamentos, usuarios y miles de `ExecutionLog` repartidos en los últimos 90 días.
- Configuración de `package.json` en el backend para incluir el comando `prisma db seed` ejecutable vía `npm run seed`.
- Refactorización de `TelemetryService.ts` para sustituir los generadores sintéticos por consultas reales de Prisma:
  - `getTimeSeriesChart`: Agregación `groupBy` por fecha (día/semana) calculando sumas dinámicas de costes, ejecuciones y tokens en PostgreSQL.
  - `getHierarchicalBreakdown`: Cálculo dinámico en profundidad sumando costes, ejecuciones y tokens desde la tabla `ExecutionLog` para cada nivel (Organización -> Departamento -> Usuario/Agente).
  - `getKpiMetrics`: Cálculo preciso de tendencias relativas (%) e indicadores basándose en logs reales almacenados.

## Capabilities

### New Capabilities
- `telemetry-database-seeding`: Poblado de datos iniciales de telemetría de IA en PostgreSQL y agregación avanzada mediante agrupaciones `groupBy` en Prisma ORM.

### Modified Capabilities
- `backend-api`: Los endpoints de telemetría `/api/v1/telemetry/*` calcularán el 100% de las métricas, desgloses y gráficos de series temporales de forma dinámica mediante agregaciones SQL directo en PostgreSQL.

## Impact

- **Backend**:
  - `backend/prisma/seed.ts` (NUEVO)
  - `backend/package.json` (adición del script de `seed` en prisma config)
  - `backend/src/modules/telemetry/services/TelemetryService.ts` (refactorización de métodos de agregación)
- **Base de Datos**: Requiere ejecutar `npx prisma db seed` para contar con registros en la base de datos PostgreSQL local.
- **Frontend**: Transparente (continúa consumiendo exactamente las mismas respuestas bajo los esquemas Zod validados sin romper contratos).
