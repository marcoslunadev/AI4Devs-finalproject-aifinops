## 1. Scaffold y Dependencias

- [x] 1.1 Inicializar el proyecto Node (`package.json`) si no existe, o actualizar el actual agregando scripts `dev` y `build`.
- [x] 1.2 Instalar dependencias base (`express`, `zod`, `helmet`, `cors`) y devDependencies (`typescript`, `tsx`, `@types/express`, etc).
- [x] 1.3 Inicializar `tsconfig.json` con configuraciones estrictas de TypeScript.
- [x] 1.4 Añadir .gitignore base para excluir dependencias y compilados.

## 2. Estructura y Middlewares Core

- [x] 2.1 Crear estructura de directorios (`src/core/middlewares`, `src/core/utils`, `src/modules`).
- [x] 2.2 Implementar middleware global `errorHandler.ts` para mapear excepciones a códigos HTTP.
- [x] 2.3 Implementar middleware base para CORS y configuración de Helmet en Express.

## 3. Configuración del Servidor

- [x] 3.1 Crear `src/app.ts` e inicializar la aplicación Express con todos sus middlewares transversales y un endpoint `GET /api/v1/health`.
- [x] 3.2 Crear `src/server.ts` para levantar el servidor y escuchar peticiones en el puerto configurado.
- [x] 3.3 Probar compilación y arranque del proyecto.
