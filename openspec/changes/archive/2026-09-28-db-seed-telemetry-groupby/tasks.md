## 1. Script de Seeding y Configuración de Prisma

- [x] 1.1 Configurar `"prisma": { "seed": "npx tsx prisma/seed.ts" }` y dependencias en `backend/package.json`.
- [x] 1.2 Crear el script `backend/prisma/seed.ts` para sembrar Organizaciones (`VASS Global Tech`, `Banking Solutions`), Departamentos (`PROD`, `PRE`, `DEV`), Usuarios y al menos 500 registros de `ExecutionLog` con variaciones de fechas, modelos de IA y costes.
- [x] 1.3 Ejecutar `npx prisma db seed` para verificar la inserción limpia en PostgreSQL.

## 2. Refactorización de Agregaciones en TelemetryService

- [x] 2.1 Actualizar `getTimeSeriesChart` en `TelemetryService.ts` para agrupar y sumar dinámicamente costes y ejecuciones desde la tabla `ExecutionLog` por rangos de fechas (`7d`, `30d`, `90d`).
- [x] 2.2 Refactorizar `getHierarchicalBreakdown` en `TelemetryService.ts` para agregar métricas reales de costes y ejecuciones por Usuario, Departamento u Organización a partir de la BBDD.
- [x] 2.3 Ajustar `getKpiMetrics` en `TelemetryService.ts` para calcular totales y variaciones porcentuales directamente con consultas agregadas de Prisma.

## 3. Verificación de Integración

- [x] 3.1 Validar que los endpoints de `/api/v1/telemetry/*` retornen el 100% de los datos sembrados correctamente sin errores.
- [x] 3.2 Verificar con `npm run build` en el backend que el código TypeScript compile limpiamente.
