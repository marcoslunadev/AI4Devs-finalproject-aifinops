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
El módulo de telemetría de la API v1 SHALL devolver métricas KPI, desgloses por jerarquía y gráficos temporales calculados directamente desde PostgreSQL a través de agregaciones dinámicas nativas (`aggregate`, `groupBy` o `$queryRaw`) sin descargar los registros crudos a memoria en Node.js.

#### Scenario: Consulta de resumen KPI con base de datos poblada
- **WHEN** un cliente realiza un `GET /api/v1/telemetry/kpis`
- **THEN** el sistema ejecuta agregaciones nativas `SUM` y `COUNT` en la base de datos PostgreSQL
- **AND** retorna la respuesta agregada en menos de 50ms sin iterar sobre arrays de registros en memoria Node.js

### Requirement: Endpoint de Estado de Ingesta y Auditoría (`GET /api/v1/telemetry/status`)
El backend API SHALL exponer el endpoint `GET /api/v1/telemetry/status` para informar al cliente del estado del motor de ingesta y el timestamp de la última actualización completada.

#### Scenario: Petición de estado de ingesta
- **WHEN** un cliente realiza una petición `GET /api/v1/telemetry/status`
- **THEN** el sistema responde `200 OK` con un cuerpo JSON conteniendo `status` (`"PROCESSING"` | `"COMPLETED"`), `lastIngestedAt` (ISO string o null), `totalRecordsProcessed` y `activeIngestionsCount`

### Requirement: Endpoints de Telemetría para el Executive Dashboard
El backend API SHALL exponer los endpoints bajo `/api/v1/telemetry` de forma protegida, requiriendo autenticación obligatoria mediante token JWT (`Bearer <token>`). Peticiones no autenticadas SHALL ser rechazadas con HTTP 401 Unauthorized.

- `GET /api/v1/telemetry/kpis`: Retorna los totales acumulados (Coste, Ejecuciones, Tokens, Coste Promedio, Orgs Activas, Tasa de Error) y variaciones porcentuales.
- `GET /api/v1/telemetry/chart`: Retorna la serie temporal agregada por día (coste USD y volumen de tokens).
- `GET /api/v1/telemetry/breakdown`: Retorna la estructura jerárquica (Organización → Entornos → Usuarios/Aplicaciones) con consumos y presupuestos.

#### Scenario: Petición exitosa a los endpoints de telemetría con token válido
- **WHEN** un cliente autenticado realiza una petición GET a `/api/v1/telemetry/kpis` con un token JWT válido
- **THEN** el sistema responde `200 OK` retornando el objeto con los totales y variaciones

#### Scenario: Petición no autenticada a endpoints de telemetría
- **WHEN** un cliente no autenticado realiza una petición a cualquier endpoint bajo `/api/v1/telemetry`
- **THEN** el sistema responde `401 Unauthorized` impidiendo el acceso a los datos y el consumo indebido de recursos

### Requirement: Serie Temporal Continua con Zero-Filling (`GET /api/v1/telemetry/chart`)
El endpoint `GET /api/v1/telemetry/chart` SHALL generar un rango ininterrumpido de fechas continuas desde `(Hoy - N días)` hasta la fecha actual `Hoy`, rellenando con valores a cero (`cost: 0`, `tokens: 0`, `executions: 0`) todos los días en los que no existan ejecuciones registradas.

#### Scenario: Petición de gráfico temporal con días sin actividad
- **WHEN** un cliente consulta `GET /api/v1/telemetry/chart?range=7d`
- **THEN** la API devuelve exactamente 7 elementos correspondientes a los últimos 7 días calendario concluyendo en el día de hoy
- **AND** asigna `cost: 0`, `tokens: 0` y `executions: 0` a los días que no tienen registros en la base de datos

### Requirement: Catálogo de Organizaciones
El backend API SHALL exponer la ruta `GET /api/v1/telemetry/organizations` devolviendo el listado de organizaciones activas registradas en la base de datos con su ID (UUID) y nombre.

#### Scenario: Consulta de organizaciones registradas
- **WHEN** se realiza una petición HTTP `GET /api/v1/telemetry/organizations`
- **THEN** el sistema responde status 200 OK con una lista JSON conteniendo `{ id: string, name: string }` de cada organización

### Requirement: Filtrado de Telemetría por `organizationId`
Los endpoints `GET /api/v1/telemetry/kpis`, `GET /api/v1/telemetry/chart` y `GET /api/v1/telemetry/breakdown` SHALL aceptar un parámetro opcional `organizationId` en el Query String.

#### Scenario: Filtrado por UUID de Organización
- **WHEN** se incluye `?organizationId=<uuid>` en las peticiones a los endpoints agregados de telemetría
- **THEN** las consultas a Prisma aplican la cláusula de filtrado correspondiente a través de la relación de la ejecución con el usuario/organización
- **AND** la respuesta devuelve métricas calculadas exclusivamente para dicha organización

### Requirement: Desglose de Ejecuciones por Departamento y Modelo
El backend API SHALL exponer la ruta `GET /api/v1/telemetry/department-executions` aceptando un parámetro opcional `organizationId`.

#### Scenario: Consulta de ejecuciones agrupadas por departamento
- **WHEN** se consulta `GET /api/v1/telemetry/department-executions`
- **THEN** el sistema agrupa los datos de telemetría por Organización, Departamento y Modelo LLM
- **AND** calcula `totalCalls`, `promptTokens`, `completionTokens`, `totalCost` y `avgLatencyMs`

### Requirement: Autenticación Unificada por Identificador (Username o Email)
El endpoint `POST /api/v1/auth/login` SHALL permitir a los usuarios autenticarse proporcionando en el campo `email` tanto su dirección de correo completa como su nombre de usuario base.
- Si el cliente envía `admin`, el sistema buscará `admin@aifinops.com` o coincidencia exacta de nombre/email.
- Si el cliente envía `viewer`, el sistema buscará `viewer@aifinops.com` o coincidencia exacta de nombre/email.
- La contraseña enviada SHALL compararse de forma segura mediante `bcrypt.compare`.

#### Scenario: Autenticación mediante username corto
- **WHEN** un usuario envía `POST /api/v1/auth/login` con `{ "email": "admin", "password": "Admin_M4rc0s" }`
- **THEN** el sistema valida el hash de contraseña y responde con `200 OK`, el token JWT y el rol `ADMIN`

### Requirement: Usuarios Semilla Maestros RBAC (admin y viewer)
La base de datos SHALL contar con los usuarios predeterminados de acceso para pruebas y demostración de roles:
- Usuario `admin` (email: `admin@aifinops.com`, password: `Admin_M4rc0s`, rol: `ADMIN`).
- Usuario `viewer` (email: `viewer@aifinops.com`, password: `Viewer_M4rc0s`, rol: `FINOPS_VIEWER`).

#### Scenario: Sembrado de credenciales maestras
- **WHEN** se ejecuta el script de semillas `seed.ts`
- **THEN** la base de datos registra a ambos usuarios con sus contraseñas hasheadas con salt rounds 10

### Requirement: Mitigación de DoS y Rate Limiting Global
La API SHALL protegerse contra saturación de tráfico y ataques de denegación de servicio (DoS) aplicando limitación de tasa global de peticiones por dirección IP (120 req/min). Las peticiones que excedan la cuota SHALL ser rechazadas con código HTTP 429 Too Many Requests y cabeceras estándar de rate limit.

#### Scenario: Petición dentro de la cuota permitida
- **WHEN** un cliente realiza peticiones por debajo de 120 req/min
- **THEN** el sistema procesa las peticiones normalmente

#### Scenario: Petición excediendo la cuota permitida
- **WHEN** un cliente realiza peticiones superando la cuota de 120 peticiones en la ventana de 1 minuto
- **THEN** el sistema responde con HTTP 429 Too Many Requests y un mensaje JSON descriptivo

### Requirement: Control de Tamaño de Payloads JSON
La API SHALL restringir el tamaño máximo permitido para el cuerpo de solicitudes JSON a 1MB para prevenir ataques de agotamiento de memoria en el parser de Express.

#### Scenario: Envío de payload JSON dentro del límite
- **WHEN** un cliente envía una solicitud con cuerpo JSON menor o igual a 1MB
- **THEN** el sistema procesa el payload correctamente

#### Scenario: Envío de payload JSON que supera el límite
- **WHEN** un cliente envía una solicitud POST/PUT con un cuerpo JSON superior a 1MB
- **THEN** el sistema responde con HTTP 413 Payload Too Large

### Requirement: Cobertura de Pruebas (>80%)
El código introducido o modificado en frontend y backend SHALL mantener una cobertura de pruebas unitarias/integración superior al 80% en líneas, funciones y declaraciones.

#### Scenario: Validación de umbrales de cobertura
- **WHEN** se ejecuta la suite de pruebas del proyecto (`npm test`)
- **THEN** la cobertura informada por el test runner es igual o superior al 80% sin fallos de umbral

