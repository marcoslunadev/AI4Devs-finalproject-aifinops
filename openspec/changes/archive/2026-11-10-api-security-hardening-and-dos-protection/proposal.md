## Why

La auditoría de seguridad del backend de AIFinOps identificó vulnerabilidades frente a ataques de denegación de servicio (DoS/DDoS a nivel de aplicación) y debilidades de control de acceso: ausencia total de rate limiting activo en la API y en el endpoint de login (exponiendo al servidor a saturación de CPU por cómputo de `bcrypt` y fuerza bruta), ausencia de límites de tamaño y validación MIME en la carga de archivos vía Multer (riesgo de Disk Exhaustion en `/tmp`), falta de protección con token JWT en rutas sensibles de telemetría y subida de archivos, y parseo de payloads JSON sin límite explícito. Este cambio implementa una estrategia de endurecimiento defensivo integral en el backend.

## What Changes

- **Rate Limiting Global (DDoS Mitigation)**: Aplicar middleware de limitación de tasa con `express-rate-limit` a nivel transversal en `backend/src/app.ts` (120 peticiones por minuto por IP) retornando código `429 Too Many Requests` estandarizado.
- **Rate Limiting Estricto en Login (Fuerza Bruta & CPU DoS)**: Implementar limitador específico en `POST /api/v1/auth/login` (máximo 10 intentos por ventana de 15 minutos por IP) para mitigar el consumo masivo de ciclos de CPU derivado de `bcrypt.compare`.
- **Multer Hardening (Prevención de Disk Exhaustion)**: Configurar en `uploadMiddleware.ts` un límite estricto de tamaño (`limits: { fileSize: 10 * 1024 * 1024 }` / 10MB) y validación estricta de extensiones (`.json`, `.jsonl`) y tipos MIME en `fileFilter`.
- **Protección de Rutas de Telemetría (JWT)**: Requerir `authenticateToken` en todas las rutas de `/api/v1/telemetry/*` para evitar que visitantes anónimos consuman recursos de base de datos o extraigan métricas sensibles.
- **Protección de Ingesta (RBAC)**: Requerir autenticación `authenticateToken` y rol `ADMIN` (`requireRole([Role.ADMIN])`) en la ruta `POST /api/v1/ingestion/upload`.
- **Límite de Payload JSON y Seguridad en Manejo de Errores**: Configurar `express.json({ limit: "1mb" })` y garantizar que el middleware de errores no exponga stack traces ni detalles internos en producción.
- **Cobertura de Pruebas (>80%)**: Incorporar suites de pruebas de integración para validar rate limiting, rechazo de archivos no autorizados/pesados y protección de rutas, garantizando una cobertura de pruebas superior al 80%.

## Capabilities

### New Capabilities
<!-- None -->

### Modified Capabilities
- `backend-api`: Se actualiza para incorporar rate limiting global, límite explícito de payload JSON, protección con `authenticateToken` en todos los endpoints de telemetría, y el requerimiento mandatorio de cobertura de pruebas (>80%).
- `data-ingestion`: Se actualiza para restringir la subida de archivos exclusivamente a administradores (`ADMIN`), limitando el tamaño a 10MB y filtrando extensiones válidas (`.json`, `.jsonl`).
- `user-authentication`: Se actualiza para incorporar protección contra ataques de fuerza bruta y saturación de CPU en `POST /api/v1/auth/login` mediante limitación de tasa estricta.

## Impact

- **Backend**:
  - `backend/src/app.ts`: Inyección de limitadores de tasa globales y límite de payload JSON en Express.
  - `backend/src/modules/auth/routes/authRoutes.ts`: Aplicación de `authLimiter` en `/login`.
  - `backend/src/core/middlewares/uploadMiddleware.ts`: Incorporación de `limits` y `fileFilter`.
  - `backend/src/modules/telemetry/routes/telemetryRoutes.ts`: Protección de endpoints con `authenticateToken`.
  - `backend/src/modules/ingestion/routes/ingestionRoutes.ts`: Protección de `/upload` con `authenticateToken` y `requireRole([Role.ADMIN])`.
  - `backend/src/api/__tests__`: Nuevas pruebas de integración de seguridad y control de acceso.
- **Frontend**:
  - El cliente HTTP de frontend continuará operando normalmente ya que ya propaga los tokens Bearer JWT en sus peticiones autenticadas.
