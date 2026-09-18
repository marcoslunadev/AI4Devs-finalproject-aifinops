## Why

Para poder empezar a construir el backend de AIFindOps (API y servicios), necesitamos contar con la base de persistencia de datos. Actualmente no hay un motor de base de datos levantado ni un modelo estructurado en ORM. Construir la infraestructura de BBDD ahora nos permitirá conectar el motor de Ingesta y el Dashboard en pasos posteriores con una fuente de verdad confiable.

## What Changes

- Creación del archivo `docker-compose.yml` para levantar PostgreSQL 16 localmente.
- Inicialización de Prisma ORM en el proyecto backend (`schema.prisma`).
- Definición de los modelos principales de la jerarquía Multi-Tenant: `Organization`, `Department`, `User`.
- Definición de los modelos analíticos y de auditoría: `IngestionAuditLog` y `ExecutionLog`.
- Implementación de tipos `Decimal` nativos en campos de coste (ej. `cost`, `totalCost`) para precisión financiera.
- Script de `seed` básico para tener datos iniciales.

## Capabilities

### New Capabilities
- `db-schema`: Define la estructura relacional del proyecto, las restricciones de jerarquía multi-tenant (Organizaciones/Departamentos) y los campos analíticos necesarios para las consultas de telemetría de IA.

### Modified Capabilities
<!-- No requirement changes in existing capabilities for this task -->

## Impact

Este cambio es fundacional y sienta las bases para todos los módulos del backend (Autenticación, Ingesta, Métricas). No introduce breaking changes ya que es la inicialización del esquema. Afectará las dependencias al requerir la instalación de `prisma` y `@prisma/client`.
