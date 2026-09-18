## Purpose
Define la estructura fundacional de datos relacional para el sistema AIFindOps, proporcionando soporte estricto para multi-tenant y análisis de telemetría financiera precisa mediante tipos Decimal.

## ADDED Requirements

### Requirement: Jerarquía Organizacional Base (Multi-Tenant)
El sistema de datos SHALL soportar una jerarquía de inquilinos de tres niveles: `Organization`, `Department` y `User`. 
- Una Organización es la entidad raíz (tenant).
- Un Departamento SHALL pertenecer a una única Organización.
- Un Usuario SHALL pertenecer a una única Organización y, de forma opcional, estar vinculado a un Departamento.

#### Scenario: Asignación de jerarquía al usuario
- **WHEN** un usuario es creado en el sistema
- **THEN** la base de datos exige obligatoriamente su enlace con un `organizationId` existente
- **AND** opcionalmente enlaza con un `departmentId`

### Requirement: Almacenamiento Preciso de Telemetría (FindOps)
El sistema SHALL almacenar la información de los eventos de IA en una tabla `ExecutionLog` con tipos de datos de precisión para cálculos financieros.
- Los campos que almacenen dinero (e.g. costes de IA) SHALL usar el tipo nativo `Decimal` en lugar de flotantes imprecisos.
- Los registros de telemetría SHALL tener integridad referencial con el `Usuario` que ejecutó el evento (y por consiguiente con su Org/Dept) y con el modelo de IA (`AiModel`) utilizado.

#### Scenario: Precisión de céntimos en BBDD
- **WHEN** el backend persiste un coste de 0.00000015 en un `ExecutionLog`
- **THEN** la base de datos lo retiene exactamente sin problemas de redondeo matemático

### Requirement: Trazabilidad de Auditoría de Ingesta Asíncrona
El sistema SHALL mantener un registro del estado del procesamiento masivo de logs en la tabla `IngestionAuditLog`.
- El log SHALL registrar el estado del procesamiento (ej. PENDING, COMPLETED, FAILED).
- El log SHALL contar la cantidad de aciertos y errores en la ingesta.

#### Scenario: Seguimiento del progreso del fichero
- **WHEN** se sube un nuevo fichero para ingesta asíncrona
- **THEN** se crea un `IngestionAuditLog` en estado PENDING con el ID del fichero o batch a procesar.
