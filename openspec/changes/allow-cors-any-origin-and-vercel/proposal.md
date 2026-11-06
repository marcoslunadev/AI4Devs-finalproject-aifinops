## Why

Actualmente, el despliegue del frontend en Vercel (`https://ai-4-devs-finalproject-a-git-73d0ca-marcosdanielluna1s-projects.vercel.app`) y clientes que consumen la API de AIFinOps desde diferentes dominios pueden experimentar bloqueos de CORS o restricciones de cabeceras de seguridad (como `Cross-Origin-Resource-Policy` por defecto de Helmet). Esta propuesta elimina las restricciones de origen en el backend para evitar errores de CORS ante llamadas desde cualquier dominio, garantizando el soporte explícito para el frontend de Vercel y preflights HTTP (`OPTIONS`).

## What Changes

- **Configuración permisiva de CORS**: Ajustar el middleware `cors` en `backend/src/app.ts` para aceptar peticiones desde cualquier origen (`origin: true` / reflejo de origen del cliente o wildcard según corresponda) sin arrojar errores de CORS, admitiendo credenciales, métodos HTTP estándar (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `OPTIONS`) y cabeceras habituales (`Content-Type`, `Authorization`).
- **Inclusión explícita del dominio de Vercel**: Garantizar soporte explícito y probado para `https://ai-4-devs-finalproject-a-git-73d0ca-marcosdanielluna1s-projects.vercel.app` (así como `http://localhost:5173` y `http://localhost:3000`).
- **Ajuste de Helmet**: Configurar Helmet con `crossOriginResourcePolicy: { policy: "cross-origin" }` (o deshabilitar CORP restrictivo) para evitar que las políticas de recursos de Helmet bloqueen respuestas cross-origin.
- **Soporte de preflight**: Garantizar que todas las peticiones `OPTIONS` respondan correctamente con estado `200` o `204` y cabeceras CORS válidas.
- **Cobertura de pruebas (>80%)**: Añadir y verificar tests de integración para peticiones CORS (con orígenes arbitrarios, preflight y el dominio de Vercel) asegurando un umbral >= 80%.

## Capabilities

### New Capabilities
<!-- None -->

### Modified Capabilities
- `backend-api`: Se modifica el requerimiento "Seguridad de Transporte y Cabeceras" para aceptar peticiones CORS desde cualquier origen sin error, incluyendo explícitamente el dominio desplegado en Vercel, y se añade el criterio mandatorio de cobertura de pruebas (>80%).

## Impact

- **Backend**:
  - `backend/src/app.ts`: Reconfiguración de middlewares `cors` y `helmet`.
  - `backend/.env.example`: Documentación opcional de variables de origen si se parametrizan.
  - Tests en backend para validar headers `Access-Control-Allow-Origin`, preflights y compatibilidad.
- **Frontend**:
  - La aplicación desplegada en Vercel podrá comunicarse transparentemente con la API backend sin errores de CORS.
