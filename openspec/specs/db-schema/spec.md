## Purpose
Define la estructura fundacional de datos relacional para el sistema AIFinOps, proporcionando soporte estricto para multi-tenant y análisis de telemetría financiera precisa mediante tipos Decimal.
## Requirements
### Requirement: Jerarquía Organizacional Base (Multi-Tenant)
El sistema de datos SHALL soportar una jerarquía de inquilinos de tres niveles: `Organization`, `Department` y `User`. 
- Una Organización es la entidad raíz (tenant).
- Un Departamento SHALL pertenecer a una única Organización.
- Un Usuario SHALL pertenecer a una única Organización y, de forma opcional, estar vinculado a un Departamento.

#### Scenario: Asignación de jerarquía al usuario
- **WHEN** un usuario es creado en el sistema
- **THEN** la base de datos exige obligatoriamente su enlace con un `organizationId` existente
- **AND** opcionalmente enlaza con un `departmentId`

### Requirement: Almacenamiento Preciso de Telemetría (FinOps)
El sistema SHALL almacenar la información de los eventos de IA en una tabla `ExecutionLog` con tipos de datos de precisión para cálculos financieros y atributos completos de ejecución y gobernanza.
- Los campos que almacenen costes monetarios (`costUsd`, `inputCost`, `outputCost`) SHALL usar el tipo nativo `Decimal(12, 6)` en base de datos.
- Los registros de telemetría SHALL tener integridad referencial con el `User` que ejecutó el evento, el `AiAgent` asociado y opcionalmente con el lote de ingesta `IngestionBatch`.
- El registro SHALL almacenar métricas de tokens (`promptTokens`, `completionTokens`, `totalTokens`), latencia en milisegundos (`latencyMs`), entorno (`environment` con valores DEV, PRE o PRO) y estado de ejecución (`status` con valores estrictos SUCCESS, ERROR, TIMEOUT, RATE_LIMIT_EXCEEDED).
- La tabla SHALL disponer de índices en `executedAt`, `userId`, `agentId` y `environment` para optimizar consultas de agregación analítica.

#### Scenario: Precisión de céntimos en BBDD
- **WHEN** el backend persiste un coste de 0.00000015 en un `ExecutionLog`
- **THEN** la base de datos lo retiene exactamente sin problemas de redondeo matemático

#### Scenario: Trazabilidad completa de llamada de agente
- **WHEN** se persiste una llamada con tokens, latencia y agente asociado
- **THEN** la base de datos almacena el registro con sus claves foráneas a `AiAgent` y `User` y su estado `SUCCESS`

### Requirement: Trazabilidad de Auditoría de Ingesta Asíncrona
El sistema SHALL mantener un registro de auditoría del procesamiento de lotes de logs en la tabla `IngestionBatch`.
- La entidad `IngestionBatch` SHALL registrar `fileName`, `fileSizeBytes`, `totalRecords`, `processedRecords`, `failedRecords`, `errorSummary`, `status` (PENDING, PROCESSING, COMPLETED, FAILED) y timestamps de ejecución.
- Cada lote SHALL permitir la vinculación referencial con los registros `ExecutionLog` generados.

#### Scenario: Seguimiento del progreso del fichero
- **WHEN** se sube un nuevo fichero para ingesta asíncrona
- **THEN** se crea un `IngestionBatch` en estado PROCESSING con el ID del fichero o batch a procesar

#### Scenario: Seguimiento del progreso del lote de ingesta
- **WHEN** se procesa un archivo de telemetría de 1500 registros
- **THEN** se crea un `IngestionBatch` que actualiza `processedRecords` y `failedRecords` al finalizar

### Requirement: Gestión de Entidades de Agentes y Control de Acceso (RBAC)
El sistema SHALL almacenar las identidades de Agentes de IA (`AiAgent`) y soportar control de acceso basado en roles en `User`.
- `AiAgent` SHALL pertenecer a una `Organization` y a un `Department`, teniendo un identificador único, nombre, descripción y estado operativo.
- `User` SHALL almacenar un campo `role` tipado con el enum `Role` (`ADMIN` y `FINOPS_VIEWER`) y un campo seguro `passwordHash` para autenticación local.

#### Scenario: Creación de agente con adscripción departamental
- **WHEN** se registra un nuevo agente de IA
- **THEN** la base de datos valida su pertenencia a una organización y departamento válidos

#### Scenario: Asignación de rol de seguridad a usuario
- **WHEN** un usuario con rol `FINOPS_VIEWER` es autenticado
- **THEN** su registro de usuario refleja el rol autorizado en base de datos

