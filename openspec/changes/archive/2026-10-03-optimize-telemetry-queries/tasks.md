## 1. Backend Query Optimization & Endpoint de Estado

- [x] 1.1 Optimizar `getKpiMetrics` en `TelemetryService.ts` utilizando `prisma.executionLog.aggregate()` y `$queryRaw` para evitar cargar arrays en memoria Node.js.
- [x] 1.2 Implementar el método `getIngestionStatus()` en `TelemetryService.ts` consultando `IngestionAuditLog` para devolver `status` y `lastIngestedAt`.
- [x] 1.3 Exponer el endpoint `GET /api/v1/telemetry/status` en `TelemetryController.ts` y `telemetryRoutes.ts`.

## 2. Integración en Frontend

- [x] 2.1 Añadir el método `fetchTelemetryStatus()` en `telemetryApi.ts` y el hook `useTelemetryStatus()` con polling dinámico en `useTelemetry.ts`.
- [x] 2.2 Actualizar la cabecera del `Dashboard.tsx` para mostrar la insignia animada de ingesta en curso y la estampa temporal de la última actualización de datos.

## 3. Verificación y Testing

- [x] 3.1 Verificar la compilación del backend y del frontend (`npm run build` en `frontend`).
- [x] 3.2 Comprobar que los tiempos de respuesta de los endpoints de telemetría sean óptimos sin degradación de memoria.
