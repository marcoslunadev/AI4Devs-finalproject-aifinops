## Context

La arquitectura de la API de AIFinOps utiliza Node.js, Express y TypeScript. El backend expone rutas públicas (`/auth/login`, `/health`), rutas de telemetría (`/telemetry/*`), rutas de auditoría de agentes (`/agents/*`) y rutas de ingesta (`/ingestion/*`).

Actualmente:
1. `express-rate-limit` está presente en las dependencias pero no se aplica en ninguna ruta.
2. `POST /api/v1/auth/login` ejecuta `bcrypt.compare` (CPU-bound) sin limitador de intentos.
3. `uploadMiddleware.ts` utiliza `multer.diskStorage` sin definir `limits.fileSize` ni `fileFilter`, permitiendo la subida de archivos arbitrarios de cualquier tamaño a `/tmp`.
4. Los endpoints de `/api/v1/telemetry/*` y `/api/v1/ingestion/upload` carecen del middleware `authenticateToken`, dejando expuestos datos financieros y la capacidad de ingesta a usuarios anónimos.
5. El parser `express.json()` no tiene cota de tamaño explícita.

Consultar `proposal.md` para la motivación completa de esta intervención.

## Goals / Non-Goals

**Goals:**
- Implementar un rate limiter global (120 req/min por IP) para mitigar flooding DoS en la API.
- Implementar un rate limiter estricto en `/api/v1/auth/login` (10 intentos por ventana de 15 minutos por IP) para mitigar fuerza bruta y DoS de CPU.
- Configurar `uploadMiddleware.ts` con límite de 10MB (`limits: { fileSize: 10 * 1024 * 1024 }`) y filtro exclusivo para extensiones `.json` y `.jsonl`.
- Proteger todas las rutas de `/api/v1/telemetry/*` con `authenticateToken`.
- Proteger `POST /api/v1/ingestion/upload` con `authenticateToken` y `requireRole([Role.ADMIN])`.
- Configurar `express.json({ limit: "1mb" })`.
- Garantizar que los tests de integración cubran estos escenarios y la cobertura se mantenga por encima del 80%.

**Non-Goals:**
- Implementar almacenamiento distribuido con Redis (el rate limiting in-memory de `express-rate-limit` es suficiente y óptimo para la arquitectura mononodo de AIFinOps).
- Alterar la lógica interna de cálculo de costes o el motor de agregación.

## Decisions

### Decisión 1: Rate Limiting in-memory con `express-rate-limit`
- **Elección**: Usar almacenamiento in-memory con `standardHeaders: true` y `legacyHeaders: false`.
- **Justificación**: AIFinOps opera en una instancia Node.js en Render. No se introduce una dependencia externa como Redis, manteniendo el despliegue simple y de bajo coste. En entornos de test, se parametriza para no interferir en suites de pruebas masivas mediante `skip: () => process.env.NODE_ENV === "test"` o mocks.

### Decisión 2: Separación de limitadores (Global vs Auth)
- **Elección**:
  - `globalLimiter`: 120 req / 1 min por IP para toda la API (`/api/v1/*`).
  - `authLimiter`: 10 req / 15 min por IP en `POST /api/v1/auth/login`.
- **Justificación**: El dashboard de frontend realiza peticiones paralelas al cargar KPIs, series temporales y desglose por organizaciones. Limitar a nivel global a 120 req/min no penaliza al usuario legítimo, pero frena floods masivos. El endpoint de login, en cambio, requiere máxima restricción para proteger el coste de cómputo de `bcrypt`.

### Decisión 3: Multer Hardening en Storage y FileFilter
- **Elección**:
  ```typescript
  export const uploadMiddleware = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      if (ext === ".json" || ext === ".jsonl") {
        cb(null, true);
      } else {
        cb(new Error("Formato de archivo no soportado. Debe ser .json o .jsonl"));
      }
    },
  });
  ```
- **Justificación**: Evita que peticiones con archivos binarios masivos o ejecutables lleguen a escribirse en el disco del servidor.

### Decisión 4: Autenticación obligatoria en Telemetría e Ingesta
- **Elección**:
  - `telemetryRouter.use(authenticateToken)`: Aplica a `/organizations`, `/kpis`, `/chart`, `/breakdown`, `/department-executions`, `/status`.
  - `ingestionRouter.post('/upload', authenticateToken, requireRole([Role.ADMIN]), uploadMiddleware.single('file'), ...)`: Restringe subidas a usuarios con rol `ADMIN`.
- **Justificación**: Alinea el backend con la especificación de gobernanza y RBAC del proyecto.

## Risks / Trade-offs

- **[Riesgo: Falsos positivos de rate limit en tests rápidos]** → **Mitigación**: Permitir que el middleware de rate limit se deshabilite o se pruebe de forma aislada e inyectada mediante configuración condicional en tests (`skip` o tests dedicados con instancias de Express).
- **[Riesgo: Tests existentes de telemetría fallando por falta de JWT]** → **Mitigación**: Revisar y actualizar los tests de integración en `src/modules/telemetry/__tests__` para incluir cabeceras de autorización válidas.

## Migration Plan

1. Crear middlewares de rate limiting en `backend/src/core/middlewares/rateLimitMiddleware.ts`.
2. Actualizar `backend/src/app.ts` con el limitador global y límite de payload `1mb`.
3. Actualizar `authRoutes.ts` con `authLimiter`.
4. Actualizar `uploadMiddleware.ts` con límites de 10MB y `fileFilter`.
5. Actualizar `telemetryRoutes.ts` e `ingestionRoutes.ts` con `authenticateToken` y `requireRole`.
6. Actualizar tests de telemetría existentes que requieran token JWT.
7. Añadir nuevos tests de integración para rate limiting, Multer limits y 401/403.
8. Ejecutar `npm test -- --coverage` y verificar umbral >= 80%.
