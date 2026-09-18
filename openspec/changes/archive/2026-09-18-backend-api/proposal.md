## Why

Se necesita implementar la estructura fundacional de la API HTTP de AIFinOps basándose en el contrato definido previamente en `openspec/specs/backend-api/spec.md`. Esto garantizará consistencia en las respuestas, validación centralizada de Zod y seguridad básica (Helmet, CORS) antes de desarrollar endpoints específicos.

## What Changes

- Configurar servidor Express y enrutamiento base bajo el prefijo `/api/v1`.
- Implementar endpoint `GET /api/v1/health`.
- Implementar manejador para rutas no existentes que responda con 404 estandarizado.
- Implementar manejador de errores global (400 para validaciones Zod, 500 para errores generales ocultando stack traces en producción).
- Configurar cabeceras de seguridad con Helmet.
- Configurar políticas CORS estrictas para el frontend.

## Capabilities

### New Capabilities

### Modified Capabilities

## Impact

- **Backend**: Creación del entry point de Express, routers base, error handler middlewares y configuración de seguridad.
- **Frontend**: El frontend ahora podrá comunicarse de forma segura con el backend a través de `/api/v1/health`.
