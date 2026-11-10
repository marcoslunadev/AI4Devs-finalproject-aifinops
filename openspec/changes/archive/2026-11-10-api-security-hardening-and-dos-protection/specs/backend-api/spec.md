## MODIFIED Requirements

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

## ADDED Requirements

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
