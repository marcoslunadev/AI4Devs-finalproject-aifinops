## 1. Setup Base de Express

- [x] 1.1 Instalar dependencias necesarias (express, cors, helmet) y sus tipos.
- [x] 1.2 Crear el archivo `backend/src/app.ts` configurando la app básica con `express.json()`, `cors` y `helmet`.

## 2. Middlewares Globales

- [x] 2.1 Crear middleware `backend/src/middlewares/errorHandler.ts` para manejar errores de Zod y errores generales (retornando 400 y 500 respectivamente).
- [x] 2.2 Crear middleware `backend/src/middlewares/notFoundHandler.ts` para capturar rutas inexistentes y devolver 404 estandarizado.

## 3. Enrutamiento (API v1)

- [x] 3.1 Crear el enrutador principal de la API en `backend/src/api/v1/index.ts`.
- [x] 3.2 Implementar el endpoint `GET /health` dentro del enrutador v1 devolviendo estado 200 OK.
- [x] 3.3 Integrar el `v1Router` en `app.ts` bajo el prefijo `/api/v1`.
- [x] 3.4 Conectar los middlewares `notFoundHandler` y `errorHandler` al final de la cadena en `app.ts`.
