## Why

El seed actual genera volumen básico de telemetría, pero su distribución aleatoria no garantiza una batería representativa ni reproducible para probar filtros, series temporales, costes, estados y desgloses del dashboard. Se necesita enriquecer los datos de los últimos 90 días para que los entornos de desarrollo y pruebas puedan validar escenarios realistas de forma consistente.

## What Changes

- Ampliar el seed de Prisma con un catálogo más variado de organizaciones, departamentos, usuarios, agentes, proveedores, modelos y entornos sin romper las relaciones existentes.
- Generar una batería determinista de registros `ExecutionLog` distribuida en los últimos 90 días, con actividad en todo el período y volúmenes suficientes para los rangos de 7d, 30d y 90d.
- Representar perfiles realistas de uso: ejecuciones exitosas, errores, timeouts y rate limits; diferencias de volumen por departamento/agente; y costes y tokens coherentes con cada modelo.
- Mantener el seed idempotente para que cada ejecución limpie y reconstruya el dataset completo sin duplicados ni claves foráneas inválidas.
- Añadir verificaciones automatizadas del conteo, rango temporal, variedad y consistencia financiera de los datos generados.
- Exponer la distribución de gasto de los últimos 30 días por proveedor y conectarla con la vista Model Analytics, sin conservar datos sintéticos de presentación.

## Capabilities

### New Capabilities

<!-- No new capability. -->

### Modified Capabilities

- `telemetry-database-seeding`: enriquecer y hacer reproducible la batería de datos de telemetría generada para los últimos 90 días, incluyendo criterios de cobertura y consistencia.

## Impact

- `backend/prisma/seed.ts`: lógica y datos de generación del seed.
- `backend/prisma/schema.prisma`: solo se consultará para respetar las relaciones y enums existentes; no se prevén cambios de esquema.
- Pruebas del backend y configuración de Prisma: validación de la ejecución del seed y de las invariantes del dataset.
- PostgreSQL de desarrollo: el comando de seed reemplaza los datos existentes de las tablas que ya limpia actualmente.
- API y frontend: se conservan los contratos existentes y se añade la consulta protegida de distribución por proveedor para que Model Analytics consuma datos reales.
