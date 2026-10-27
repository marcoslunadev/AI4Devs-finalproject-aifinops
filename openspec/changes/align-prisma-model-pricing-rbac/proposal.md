## Why

El esquema actual de Prisma (`schema.prisma`) y los servicios de backend no contemplan la entidad de tarifas `ModelPrice`, la entidad `AiAgent`, el control de acceso basado en roles (`ADMIN` y `FINOPS_VIEWER`), ni el formato corporativo estandarizado de telemetría de IA delimitado en el MVP. Esta brecha bloquea el cálculo financiero determinista de costes de tokens y la atribución de consumo por Agente, Usuario, Departamento y Entorno (DEV, PRE, PRO).

Alinear el modelo de datos y la capa de servicios ahora es imprescindible para cumplir con la arquitectura Clean Architecture aprobada y habilitar la implementación de los tickets TCK-001, TCK-002 y TCK-003.

## What Changes

- **Base de Datos & Prisma ORM**:
  - **BREAKING**: Reemplazo de `IngestionAuditLog` por `IngestionBatch` con métricas completas de auditoría (`totalRecords`, `processedRecords`, `failedRecords`, `errorSummary`, `fileName`).
  - Creación de la entidad `ModelPrice` con precisión `Decimal(10, 6)` para tarificación por cada 1.000 tokens de prompt y completion, versionado por fecha de efectividad y flag de vigencia.
  - Creación de la entidad `AiAgent` vinculada a Organización y Departamento con campos de propósito y estado operativo.
  - Definición del enum de roles `Role` (`ADMIN`, `FINOPS_VIEWER`) y adición de `role` y `passwordHash` en `User` para autenticación JWT.
  - Ampliación de `ExecutionLog`: incorporación de claves foráneas con `AiAgent` y `IngestionBatch`, campos de entorno (`environment`: DEV/PRE/PRO), métricas de tokens (`promptTokens`, `completionTokens`, `totalTokens`), latencia (`latencyMs`), coste (`costUsd` con tipo Decimal), estado unificado (`status`: SUCCESS, ERROR, TIMEOUT, RATE_LIMIT_EXCEEDED) e índices para agregación temporal.
- **Lógica de Negocio & Servicios**:
  - `CostCalculatorService`: Implementación de la fórmula determinista $\text{cost} = (\text{prompt\_tokens} \times \frac{\text{prompt\_price\_per\_1k}}{1000}) + (\text{completion\_tokens} \times \frac{\text{completion\_price\_per\_1k}}{1000})$ utilizando el precio activo vigente en `ModelPrice`.
  - `IngestionService`: Soporte para resolución de identidad (`userEmail` -> `userId`, `agentId` -> `AiAgent`) y registro transaccional por batch.
  - Migración y Datos Semilla (`seed.ts`): Catálogo actualizado de tarifas (GPT-4o, Claude 3.5 Sonnet, Gemini 1.5 Pro) y datos relacionales de prueba.

## Capabilities

### New Capabilities
- `model-pricing`: Gestión versionada de tarifas por modelo (`ModelPrice`) y cálculo financiero determinista de consumo de tokens (prompt / completion) con precisión Decimal.

### Modified Capabilities
- `db-schema`: Extensión de entidades fundamentales (`ModelPrice`, `AiAgent`, `Role`, `IngestionBatch`, `ExecutionLog`) y claves foráneas en PostgreSQL.
- `data-ingestion`: Ingesta multipart/JSON con mapeo de identidades (`userEmail`, `agentId`), resolución en BBDD y auditoría en `IngestionBatch`.
- `backend-api`: Endpoints de autenticación JWT (`POST /api/v1/auth/login`, `GET /api/v1/auth/me`), control de acceso por roles (`ADMIN`, `FINOPS_VIEWER`) y consulta granular de agentes (`GET /api/v1/agents/{agentId}`).

## Impact

- **Base de Datos**: Generación y ejecución de migración Prisma (`npx prisma migrate dev --name align_model_pricing_rbac`).
- **Backend**:
  - Repositorios: `ModelPriceRepository`, `AgentRepository`, `ExecutionLogRepository`, `UserRepository`.
  - Servicios: `CostCalculatorService`, `IngestionService`, `AuthService`.
  - Controladores y Middlewares: validación de esquemas Zod actualizados y middleware de autorización JWT / RBAC.
  - Semillas: actualización completa de `backend/prisma/seed.ts`.
