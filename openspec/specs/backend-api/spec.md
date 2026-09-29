## Purpose
Define el contrato base y la estructura fundacional de la API HTTP de AIFinOps, garantizando consistencia en las respuestas, validación centralizada y seguridad.
## Requirements
### Requirement: Enrutamiento Base (API v1)
El sistema SHALL exponer todos sus recursos bajo el prefijo común `/api/v1` para facilitar un futuro versionado. Las rutas no existentes SHALL retornar un error 404 estandarizado.

#### Scenario: Petición a ruta válida
- **WHEN** un cliente hace una petición a `GET /api/v1/health`
- **THEN** el sistema responde `200 OK`
- **AND** retorna un payload de comprobación de estado

#### Scenario: Petición a ruta inexistente
- **WHEN** un cliente hace una petición a `GET /api/v1/unknown`
- **THEN** el sistema responde `404 Not Found`
- **AND** retorna un cuerpo JSON estandarizado de error

### Requirement: Manejo de Errores Estandarizado (Error Handler)
El sistema SHALL capturar todas las excepciones no controladas y errores de dominio, devolviendo una respuesta HTTP consistente que nunca exponga trazas de error internas en producción.

- Todos los errores de validación (e.g., Zod) SHALL retornar `400 Bad Request` (o `422 Unprocessable Entity`) con la lista de campos inválidos.
- Las excepciones generales SHALL retornar `500 Internal Server Error` y omitir el stack trace si el entorno es de producción.

#### Scenario: Error de validación Zod
- **WHEN** un cliente envía un body que no cumple el esquema Zod de un endpoint
- **THEN** el sistema captura el error antes de llegar al controlador
- **AND** responde `400 Bad Request` indicando qué campos fallaron

### Requirement: Seguridad de Transporte y Cabeceras
La API SHALL protegerse activamente contra vectores de ataque comunes web.
- SHALL incluir cabeceras de seguridad mediante Helmet (ej. HSTS, X-Content-Type-Options).
- SHALL aceptar peticiones cross-origin (CORS) estrictamente desde los orígenes del frontend configurados.

#### Scenario: Petición desde el Frontend permitido
- **WHEN** el frontend de AIFinOps envía una petición al backend
- **THEN** el sistema procesa la petición incluyendo los headers CORS correctos (`Access-Control-Allow-Origin`)

### Requirement: Respuestas de Telemetría Basadas en Consultas Agregadas
El módulo de telemetría de la API v1 SHALL devolver métricas KPI, desgloses por jerarquía y gráficos temporales calculados directamente desde PostgreSQL a través de agregaciones dinámicas de Prisma ORM.

#### Scenario: Consulta de resumen KPI con base de datos poblada
- **WHEN** un cliente realiza un `GET /api/v1/telemetry/kpis`
- **THEN** el sistema realiza un `aggregate` de suma de costes e ID count sobre la tabla `ExecutionLog` y calcula el total de organizaciones dinámicamente desde PostgreSQL.

### Requirement: Endpoints de Telemetría para el Executive Dashboard
El backend API SHALL exponer tres endpoints bajo `/api/v1/telemetry` que agreguen y retornen los datos de consumo de IA registrados en la base de datos PostgreSQL.

- `GET /api/v1/telemetry/kpis`: Retorna los totales acumulados (Coste, Ejecuciones, Tokens, Coste Promedio, Orgs Activas, Tasa de Error) y variaciones porcentuales.
- `GET /api/v1/telemetry/chart`: Retorna la serie temporal agregada por día (coste USD y volumen de tokens).
- `GET /api/v1/telemetry/breakdown`: Retorna la estructura jerárquica (Organización → Entornos → Usuarios/Aplicaciones) con consumos y presupuestos.

#### Scenario: Petición exitosa a los endpoints de telemetría
- **WHEN** un cliente autenticado realiza una petición GET a `/api/v1/telemetry/kpis`
- **THEN** el sistema responde `200 OK` con la estructura de métricas agregadas validada por Zod

