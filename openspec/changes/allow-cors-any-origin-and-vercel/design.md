## Context

Actualmente en `backend/src/app.ts`, la aplicación inicializa los middlewares de seguridad con `app.use(helmet())` y `app.use(cors())`.
Sin embargo:
1. `helmet()` por defecto establece `Cross-Origin-Resource-Policy: same-origin`, provocando que navegadores modernos bloqueen la lectura de respuestas API cuando se consumen desde dominios remotos distintos al backend, como el frontend desplegado en Vercel.
2. `cors()` por defecto usa configuración básica sin parametrizar métodos, preflights explícitos ni reflejo dinámico de orígenes para dominios dinámicos (como previews de Vercel o dominios arbitrarios).

Consultar `proposal.md` para la motivación de este cambio.

## Goals / Non-Goals

**Goals:**
- Configurar el middleware `cors` para admitir solicitudes desde cualquier origen (`origin: true` o función que refleje el `req.header('Origin')`), admitiendo expresamente el dominio `https://ai-4-devs-finalproject-a-git-73d0ca-marcosdanielluna1s-projects.vercel.app`, dominios locales y cualquier origen arbitrario.
- Configurar `helmet` con `crossOriginResourcePolicy: { policy: "cross-origin" }` para asegurar que las políticas CORP no interfieran con las solicitudes cross-origin.
- Habilitar preflight requests (`OPTIONS`) de manera global para métodos `GET, POST, PUT, PATCH, DELETE, OPTIONS` y cabeceras `Content-Type, Authorization`.
- Asegurar que la suite de pruebas unitarias/integración cubra la configuración CORS y mantenga la cobertura superior al 80%.

**Non-Goals:**
- Modificar el sistema de autenticación JWT o las rutas de la API.
- Cambiar la configuración de variables de entorno de la SPA frontend.

## Decisions

### Decisión 1: Estrategia de origen permisiva y dinámica (`origin: true`)
- **Elección**: Configurar `cors({ origin: true, credentials: true })` en `backend/src/app.ts`.
- **Justificación**: En la librería `cors`, `origin: true` refleja dinámicamente el valor de la cabecera `Origin` de la solicitud en `Access-Control-Allow-Origin`. Esto permite solicitudes desde el dominio de producción de Vercel (`https://ai-4-devs-finalproject-a-git-73d0ca-marcosdanielluna1s-projects.vercel.app`), desde cualquier previsualización de Vercel (URLs efímeras de pull request), localhost y cualquier otro dominio arbitrario, sin fallar con errores de CORS y permitiendo el transporte de cabeceras de autorización.
- **Alternativas consideradas**:
  - *Lista estática en array*: Requeriría desplegar o reiniciar el backend ante cada nueva URL de preview de Vercel o nuevo dominio de consumo.
  - *`origin: "*"` con credenciales*: La especificación de Fetch y CORS prohíbe el uso de `*` si se envían credenciales (`Access-Control-Allow-Credentials: true`). El reflejo dinámico evita este conflicto.

### Decisión 2: Ajuste de la directiva CORP en Helmet
- **Elección**: `app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }))`.
- **Justificación**: Helmet protege los encabezados HTTP comunes (HSTS, frameguard, noSniff, etc.), pero su valor predeterminado para `Cross-Origin-Resource-Policy` es `same-origin`, lo cual genera bloqueos en navegadores al consumir la API desde Vercel. Al fijar la directiva en `cross-origin`, se mantiene el resto de capas de seguridad intactas y se elimina el bloqueo.
- **Alternativas consideradas**:
  - *Desactivar Helmet*: Inseguro e innecesario; basta con modular la directiva específica.

### Decisión 3: Métodos y cabeceras autorizadas
- **Elección**: Definir explícitamente:
  - `methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]`
  - `allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]`
- **Justificación**: Permite todas las operaciones CRUD de AIFinOps y la propagación de tokens Bearer JWT en las peticiones Axios.

## Risks / Trade-offs

- **[Riesgo: Consumo de la API desde orígenes no previstos]** → **Mitigación**: Los endpoints de AIFinOps que gestionan telemetría, auditoría e ingesta están protegidos a nivel de aplicación mediante el middleware de verificación JWT y control de acceso RBAC (`ADMIN`, `FINOPS_VIEWER`). CORS es una política impuesta por el navegador, por lo que la seguridad real reside en la autenticación criptográfica.
- **[Riesgo: Cacheo de preflights incorrecto]** → **Mitigación**: Establecer `maxAge: 86400` en la configuración CORS para optimizar el rendimiento y evitar preflights redundantes en cada petición de la aplicación cliente.

## Migration Plan

1. Actualizar `backend/src/app.ts` con la configuración de `cors` y `helmet`.
2. Añadir tests de integración en `backend/src` para verificar:
   - Respuesta de cabecera `Access-Control-Allow-Origin` con origen de Vercel.
   - Respuesta con origen arbitrario.
   - Petición preflight `OPTIONS`.
   - Cabecera `Cross-Origin-Resource-Policy: cross-origin`.
3. Ejecutar `npm test` en backend validando que todos los tests pasen y la cobertura se mantenga >= 80%.
