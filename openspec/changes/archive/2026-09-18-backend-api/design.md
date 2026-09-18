## Context

El proyecto requiere asentar las bases del backend para procesar peticiones de forma segura, estructurada y validada. La API debe ofrecer un manejo de errores robusto para no filtrar información sensible en producción y debe estar protegida contra ataques comunes mediante Helmet y CORS. (Ver `proposal.md` para la motivación).

## Goals / Non-Goals

**Goals:**
- Configurar la aplicación Express base en `backend/`.
- Configurar middlewares globales: `cors`, `helmet`, `express.json()`.
- Implementar estructura de rutas bajo el prefijo `/api/v1`.
- Proveer un endpoint de health check (`/api/v1/health`).
- Implementar middleware global para manejo de errores (captura de errores de Zod y genéricos).
- Implementar middleware global para endpoints no encontrados (404).

**Non-Goals:**
- Implementar conexión a base de datos (se hará en otro change).
- Implementar autenticación/JWT (se hará en otro change).
- Implementar endpoints de negocio (solo el framework base).

## Decisions

**1. Manejo de Errores Centralizado (Error Handler)**
- **Decisión**: Crear un middleware `errorHandler.ts` que se inserte al final de la cadena de middlewares de Express.
- **Rationale**: Express no captura por defecto excepciones asíncronas ni formatea las respuestas, y AIFindOps utilizará Zod extensivamente. Un middleware global unifica el formato JSON de error (ej. `{ error: "message", details: [...] }`), asegurando de que los stack traces no se filtren en `NODE_ENV=production`.
- **Alternativa**: Capturar y formatear errores en cada controlador de ruta (rechazado por ser repetitivo y propenso a errores).

**2. Prefijo `/api/v1`**
- **Decisión**: Montar las rutas en un `v1Router` y este a su vez en `app.use('/api/v1', v1Router)`.
- **Rationale**: Facilita la evolución de la API permitiendo versiones `v2` en el futuro sin romper los clientes actuales.

**3. Seguridad y CORS**
- **Decisión**: Utilizar `helmet()` con opciones por defecto y `cors({ origin: env.FRONTEND_URL })`.
- **Rationale**: Es el estándar de facto en el ecosistema Express para prevenir problemas básicos de seguridad.

## Risks / Trade-offs

- **[Risk] Exposición de stack traces**: Express por defecto expone errores si no se usa un custom error handler con 4 parámetros.
  - **Mitigation**: El error handler tendrá estrictamente la firma `(err, req, res, next)` para ser reconocido por Express y evaluará `process.env.NODE_ENV`.
- **[Risk] Unhandled Promise Rejections**: En versiones de Express < 5, los errores asíncronos en los handlers pueden causar cuelgues si no se pasan al `next()`.
  - **Mitigation**: Utilizar la librería `express-async-errors` (o un wrapper) para redirigir los errores al error handler global automáticamente.
