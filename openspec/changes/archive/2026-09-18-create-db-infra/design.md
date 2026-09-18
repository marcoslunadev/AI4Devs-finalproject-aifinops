## Context

El backend de AIFindOps arranca sin infraestructura de datos (Ver `proposal.md` para motivación). El sistema debe ser capaz de soportar registros masivos (hasta 10,000 registros por fichero), garantizar integridad multitenant y proporcionar alta precisión matemática para los cálculos de FindOps.

## Goals / Non-Goals

**Goals:**
- Desplegar una instancia de PostgreSQL de forma consistente y reproducible.
- Establecer las bases del ORM con Prisma y un modelo relacional robusto.
- Configurar campos críticos (dinero/costes) con tipos de datos seguros contra pérdida de precisión.

**Non-Goals:**
- Implementar la lógica del worker asíncrono o los controladores de la API (solo sentaremos las bases de BBDD).
- Configurar réplicas, particionamiento avanzado u optimizaciones de lectura complejas de PostgreSQL para el MVP.

## Decisions

### 1. PostgreSQL 16 vía Docker Compose
- **Decisión:** Utilizaremos `docker-compose.yml` en la raíz del backend para levantar un contenedor `postgres:16-alpine`.
- **Rationale:** Permite a cualquier desarrollador levantar el entorno local sin necesidad de instalar dependencias pesadas. La versión 16 es estable y tiene buen soporte para operaciones JSONB que usaremos más adelante.
- **Alternativa:** Usar SQLite fue descartado porque Prisma con SQLite no soporta completamente características avanzadas de migración, concurrencia masiva (ingesta) ni tipos Decimal estandarizados requeridos para FindOps de la misma forma que Postgres.

### 2. Prisma ORM para el Modelo de Datos
- **Decisión:** Inicialización de Prisma (`npx prisma init`) con provider PostgreSQL.
- **Rationale:** Proporciona un tipado seguro en TypeScript, algo fundamental dada la adopción de Clean Architecture, permitiendo generar tipos automáticamente para las entidades.
- **Alternativas:** TypeORM o Sequelize. Fueron descartados porque Prisma ofrece una mejor experiencia de desarrollador (DX) y esquemas declarativos limpios (`schema.prisma`) que sirven como documentación del negocio.

### 3. Precisión Numérica (FindOps)
- **Decisión:** Todos los campos de coste (`cost`, `inputCost`, `outputCost`) en `ExecutionLog` usarán el tipo `Decimal` nativo de PostgreSQL (ej. `Decimal(12, 6)`).
- **Rationale:** Requisito indispensable para que las analíticas de costes agregados no sufran desajustes al sumar cientos de miles de céntimos en coma flotante.

## Risks / Trade-offs

- **[Risk] Rendimiento en Ingesta Masiva:** Inserciones simultáneas de miles de registros podrían provocar bloqueos en la base de datos si Prisma no se usa correctamente.
  - **Mitigation:** Las inserciones se harán utilizando `createMany` para bulk inserts, reduciendo la carga de red. Se considerará afinar el connection pool de Prisma si es necesario.
- **[Risk] Migraciones Conflictivas:** En etapas tempranas el esquema cambiará rápido.
  - **Mitigation:** Uso estricto de `prisma migrate dev` para asegurar el tracking de cambios. Se proveerá un script `seed.ts` para repoblar la base de datos tras cada reset rápido.
