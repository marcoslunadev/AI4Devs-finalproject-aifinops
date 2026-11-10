## 1. Rate Limiting y Endurecimiento de Express

- [x] 1.1 Crear el módulo `backend/src/core/middlewares/rateLimitMiddleware.ts` definiendo `globalLimiter` (120 req/min por IP) y `authLimiter` (10 intentos/15 min por IP) con cabeceras estándar.
- [x] 1.2 Aplicar `globalLimiter` y el límite de payload `express.json({ limit: "1mb" })` en `backend/src/app.ts`.
- [x] 1.3 Aplicar `authLimiter` en la ruta `POST /api/v1/auth/login` dentro de `backend/src/modules/auth/routes/authRoutes.ts`.

## 2. Hardening de Multer y Control de Acceso en Ingesta

- [x] 2.1 Modificar `backend/src/core/middlewares/uploadMiddleware.ts` para fijar `limits: { fileSize: 10 * 1024 * 1024 }` (10MB) y `fileFilter` que restrinja la carga a archivos `.json` y `.jsonl`.
- [x] 2.2 Proteger la ruta `POST /api/v1/ingestion/upload` en `backend/src/modules/ingestion/routes/ingestionRoutes.ts` aplicando `authenticateToken` y `requireRole([Role.ADMIN])`.

## 3. Protección de Rutas de Telemetría

- [x] 3.1 Proteger todos los endpoints de `backend/src/modules/telemetry/routes/telemetryRoutes.ts` con `authenticateToken`.
- [x] 3.2 Actualizar los tests existentes que invocan rutas de telemetría para incluir autenticación mediante token JWT en las peticiones.

## 4. Tests Automatizados y Verificación de Cobertura

- [x] 4.1 Implementar tests de integración en `backend/src/api/__tests__/security_hardening.integration.test.ts` para validar rate limiting (código 429), límites y filtros de Multer, y respuestas 401/403 en rutas protegidas.
- [x] 4.2 Ejecutar la suite completa de pruebas con verificación de umbrales de cobertura (`npm test -- --coverage`) asegurando que la cobertura se mantenga superior al 80% (>= 80%).
