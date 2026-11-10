## MODIFIED Requirements

### Requirement: Script de Seeding de Datos de Telemetría
El sistema MUST incluir un script ejecutable de seed (`prisma/seed.ts`) que inserte entidades organizacionales (`Organization`, `Department`, `User`, `AiAgent`, `ModelPrice` e `IngestionBatch`) y al menos 1000 registros de ejecuciones (`ExecutionLog`) distribuidos en los últimos 90 días calendario. El dataset MUST conservar todas las relaciones foráneas válidas y representar al menos dos organizaciones, cuatro departamentos, cuatro agentes, cuatro modelos/proveedores y los tres entornos soportados.

#### Scenario: Ejecución exitosa del comando de seed
- **WHEN** el desarrollador ejecuta `npm run seed` contra una base PostgreSQL disponible
- **THEN** el sistema inserta las entidades y los registros de ejecución sin errores de clave foránea
- **AND** la tabla `ExecutionLog` contiene al menos 1000 registros con `executedAt` dentro de los últimos 90 días calendario

#### Scenario: Cobertura temporal completa
- **WHEN** se inspeccionan los registros creados por el seed agrupándolos por la fecha UTC de `executedAt`
- **THEN** existen registros en cada uno de los 90 días calendario del período generado
- **AND** los rangos de consulta de 7d, 30d y 90d disponen de datos suficientes para mostrar actividad real

## ADDED Requirements

### Requirement: Dataset Determinista e Idempotente
El script de seed MUST producir el mismo conjunto lógico de datos al ejecutarse con la misma fecha de referencia y MUST poder ejecutarse repetidamente limpiando y reconstruyendo las tablas administradas por el seed sin duplicados ni residuos de ejecuciones anteriores.

#### Scenario: Repetición del seed
- **WHEN** el desarrollador ejecuta `npm run seed` dos veces con la misma fecha de referencia
- **THEN** la segunda ejecución finaliza correctamente y deja el mismo número y distribución de registros que la primera
- **AND** no existen duplicados de usuarios, agentes, modelos o lotes definidos por el seed

### Requirement: Variedad Realista de Telemetría
Los registros generados MUST cubrir todos los valores soportados de `Environment` y `ExecutionStatus`, múltiples departamentos y agentes, y una distribución no uniforme de uso. Cada `ExecutionLog` MUST tener tokens, latencia y coste compatibles con el modelo y proveedor asignados.

#### Scenario: Validación de dimensiones y estados
- **WHEN** se agregan los registros sembrados por entorno, estado, proveedor, modelo, departamento y agente
- **THEN** aparecen los tres entornos, al menos tres estados de ejecución, al menos cuatro combinaciones de proveedor/modelo y más de un grupo de departamento/agente
- **AND** cada grupo contiene registros válidos para las agregaciones de telemetría

#### Scenario: Consistencia financiera
- **WHEN** se recalcula el coste de cada ejecución usando sus tokens y el precio del `ModelPrice` correspondiente
- **THEN** `costUsd` coincide con la suma de los costes de entrada y salida con la precisión monetaria soportada
- **AND** `totalTokens` coincide con `promptTokens + completionTokens`

### Requirement: Cobertura de Pruebas Superior al 80%
El código de frontend y backend afectado por este cambio SHALL mantener una cobertura de pruebas unitarias o de integración igual o superior al 80% en líneas, funciones y declaraciones.

#### Scenario: Validación de umbrales de cobertura
- **WHEN** se ejecutan las suites de pruebas del proyecto con cobertura para frontend y backend
- **THEN** la cobertura informada por el test runner es igual o superior al 80% en líneas, funciones y declaraciones
- **AND** las pruebas de generación, idempotencia, rango temporal y consistencia financiera finalizan sin fallos
