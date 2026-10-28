## Context

Véase `proposal.md` y `specs/`. La base de datos actual en `backend/prisma/schema.prisma` carece de las entidades `ModelPrice`, `AiAgent`, del enum `Role` (`ADMIN`, `FINOPS_VIEWER`) y de métricas esenciales de tokens y latencia en `ExecutionLog`. Este diseño detalla la arquitectura técnica para la migración del modelo relacional, la formulación matemática de cálculo de costes y la integración en Clean Architecture de los servicios backend.

## Goals / Non-Goals

**Goals:**
- Extender el modelo de datos Prisma con las entidades `ModelPrice`, `AiAgent`, `Role` y renombrar/actualizar `IngestionBatch`.
- Garantizar cálculo monetario determinista en `CostCalculatorService` usando `Decimal` (sin imprecisiones de coma flotante IEEE-754).
- Diseñar la resolución de identidades de logs en `IngestionService` (búsqueda eficiente de `userEmail` y `agentId` corporativos).
- Actualizar `seed.ts` con tarifas oficiales de mercado (OpenAI, Anthropic, Gemini) y datos jerárquicos realistas.

**Non-Goals:**
- Soporte para ingesta de archivos CSV o streaming Kafka/WebSockets (pospuestos para v2).
- Interfaz gráfica (UI) de administración de tarifas (CRUD de `ModelPrice` pospuesto para v2; en MVP se gestiona vía seed/migración).

## Decisions

### 1. Manejo Financiero con `Prisma.Decimal`
- **Decisión**: Los campos monetarios en Prisma utilizarán `@db.Decimal(10, 6)` para precios por cada mil tokens y `@db.Decimal(12, 6)` para costes totales en USD.
- **Alternativas consideradas**:
  - *Enteros en microdólares*: Exige multiplicaciones y divisiones manuales propensas a errores de escala en capa de presentación.
  - *Floats nativos (`Float`)*: Genera imprecisiones inaceptables en agregaciones contables (e.g. `0.1 + 0.2 = 0.30000000000000004`).
- **Razón**: Cumple estrictamente con el principio de exactitud contable exigido en la gobernanza FinOps.

### 2. Entidad Independiente `AiAgent` vs Usuario Especial
- **Decisión**: Modelar `AiAgent` como entidad propia vinculada a `Organization` y `Department`, con relación 1:N hacia `ExecutionLog`.
- **Alternativas consideradas**:
  - Modelar agentes como registros en la tabla `User` con un flag `isAgent`.
- **Razón**: Los agentes tienen ciclo de vida, modelos asociados y metadatos técnicos propios, mientras que los usuarios representan personas autenticables con roles de acceso (`ADMIN` / `FINOPS_VIEWER`).

### 3. Sustitución de `IngestionAuditLog` por `IngestionBatch`
- **Decisión**: Renombrar y expandir el modelo a `IngestionBatch` con métricas de progreso (`totalRecords`, `processedRecords`, `failedRecords`, `errorSummary`, `fileName`).
- **Razón**: Alineación directa con el diccionario de datos y OpenAPI de la entrega.

### 4. Caché de Identidades en Memoria durante Ingesta
- **Decisión**: En `IngestionService`, pre-cargar en un `Map<email, userId>` y `Map<agentId, AiAgent>` los usuarios y agentes existentes antes de iterar sobre las líneas del archivo `.json`/`.jsonl`.
- **Razón**: Evita el problema de $N+1$ queries contra PostgreSQL durante la ingesta de lotes masivos.

## Risks / Trade-offs

- **[Riesgo: Migración destructiva en entornos de desarrollo local]** → *Mitigación*: Utilizar `npx prisma migrate dev` para crear una migración formal versionada en `/backend/prisma/migrations/` y mantener un `seed.ts` completamente autónomo e idempotente.
- **[Riesgo: Modelo de IA no tarificado en `ModelPrice`]** → *Mitigación*: `CostCalculatorService` registrará una tarifa de fallback con advertencia controlada o marcará el registro con estado `RATE_LIMIT_EXCEEDED` / error en el resumen de auditoría del batch sin abortar la transacción completa.

## Migration Plan

1. Modificar `backend/prisma/schema.prisma` incorporando los nuevos modelos y relaciones.
2. Ejecutar `npx prisma migrate dev --name align_model_pricing_rbac` para aplicar los cambios a PostgreSQL.
3. Actualizar `backend/prisma/seed.ts` con tarifas vigentes e invocar `npx prisma db seed`.
4. Refactorizar `CostCalculatorService`, `IngestionService` y sus suites de tests unitarios en Vitest.
