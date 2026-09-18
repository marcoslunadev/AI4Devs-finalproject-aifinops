## Why

Con la base de datos ya planificada, el siguiente paso crítico es construir el andamiaje (scaffolding) de la aplicación Node.js/Express. Necesitamos un servidor robusto configurado con TypeScript, Zod y middlewares de seguridad (CORS, Helmet, Error Handler) para poder empezar a implementar la lógica de negocio real de AIFindOps (Ingesta y Métricas).

## What Changes

- Inicialización de un proyecto Node.js (`package.json`) y configuración de TypeScript (`tsconfig.json`).
- Instalación de dependencias core: Express, Zod, Helmet, CORS.
- Creación de la estructura de carpetas modular (`src/core`, `src/modules`).
- Implementación de un Error Handler centralizado para capturar errores de Zod y de dominio de forma estandarizada.
- Configuración del servidor base para exponer rutas bajo el prefijo `/api/v1`.

## Capabilities

### New Capabilities
- `backend-api`: Define el contrato base de la API, el enrutamiento y la estructura de respuestas estándar de éxito y error.

### Modified Capabilities
<!-- No requirement changes in existing capabilities for this task -->

## Impact

Este cambio afecta a la estructura de directorios raíz, creando la carpeta `backend` o iniciando la base de código sobre el repositorio existente. Proveerá las utilidades fundamentales (ej. `logger`, `errorHandler`) que todos los futuros desarrolladores consumirán.
