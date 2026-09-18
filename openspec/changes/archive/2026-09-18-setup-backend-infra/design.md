## Context

El proyecto ya cuenta con el esquema base de la base de datos (Prisma) pero requiere la capa de red (servidor HTTP). Debemos estructurar Express con TypeScript y asegurar una capa transversal robusta de middlewares antes de construir los endpoints funcionales, garantizando que el scaffolding siga los principios de Clean Architecture.

## Goals / Non-Goals

**Goals:**
- Configurar un servidor Express básico escuchando en el puerto 3000 con soporte completo para TypeScript.
- Definir un interceptor de errores global (Error Handler) que traduzca las excepciones (ZodErrors, errores Prisma, etc.) a respuestas HTTP estándar (ej. 400, 500).
- Proteger el servidor con middlewares comunes: CORS, Helmet y parseo de JSON.

**Non-Goals:**
- Implementar los controladores de negocio (Auth, Ingestion). Este PR es solo para la infraestructura base del servidor.
- Configurar Rate Limiting complejo o Redis.

## Decisions

### 1. Framework: Express con tsx
- **Decisión:** Utilizaremos Express ejecutado mediante `tsx` en desarrollo y transpilado con `tsc` en producción.
- **Rationale:** Proporciona un entorno ligero pero sumamente controlable. `tsx` es extremadamente rápido para correr TypeScript en desarrollo comparado con el antiguo `ts-node`.
- **Alternativa:** NestJS. Descartado para mantener el MVP simple y sin un exceso de magia de decoradores, alineándose mejor con las habilidades requeridas y la flexibilidad de Clean Architecture puro.

### 2. Manejo de Errores
- **Decisión:** Un middleware final `errorHandler.ts` capturará todos los `next(err)` o excepciones síncronas lanzadas.
- **Rationale:** Previene fugas de información. Si el error es una instancia de `ZodError`, devolverá automáticamente un `400 Bad Request` formateando los campos erróneos. De lo contrario, registrará el error y enviará un `500` (ocultando el stack trace si `NODE_ENV=production`).

### 3. Estructura de Rutas
- **Decisión:** Todas las rutas se registrarán bajo un router principal exportado como `/api/v1`.
- **Rationale:** Permite versionar la API fácilmente en el futuro (ej. `/api/v2`).

## Risks / Trade-offs

- **[Risk] Promesas sin resolver en Express:** En Express 4, si una promesa falla dentro de un controlador async y no se hace un `catch`, el proceso puede crashear.
  - **Mitigation:** Se utilizará la librería `express-async-errors` para hacer "monkey patch" al enrutador de Express o se creará un wrapper de tipo `asyncHandler` para todos los controladores.
