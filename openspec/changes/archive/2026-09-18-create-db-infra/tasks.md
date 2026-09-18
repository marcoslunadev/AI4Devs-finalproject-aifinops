## 1. Setup Infraestructura

- [x] 1.1 Crear archivo `docker-compose.yml` en la raíz del backend para levantar la imagen `postgres:16-alpine`.
- [x] 1.2 Levantar el contenedor y verificar conectividad.

## 2. Configuración Prisma ORM

- [x] 2.1 Inicializar Prisma en el proyecto (`npx prisma init`).
- [x] 2.2 Configurar URL de conexión en `.env`.
- [x] 2.3 Definir modelos de jerarquía Multi-Tenant en `schema.prisma` (`Organization`, `Department`, `User`).
- [x] 2.4 Definir modelos de telemetría y auditoría en `schema.prisma` (`IngestionAuditLog`, `ExecutionLog`) usando el tipo `Decimal` para los costes.

## 3. Migraciones y Datos Semilla

- [x] 3.1 Generar y aplicar la primera migración de Prisma (`npx prisma migrate dev --name init`).
- [x] 3.2 Crear script `prisma/seed.ts` con datos básicos (1 Org, 1 Dept, 2 Users, 1 AuditLog de prueba).
- [x] 3.3 Configurar el comando `prisma db seed` en el `package.json` y ejecutar la semilla.
