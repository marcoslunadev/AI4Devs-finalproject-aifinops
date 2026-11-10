## 1. Generador Determinista y Catálogos

- [x] 1.1 Definir catálogos tipados de organizaciones, departamentos, usuarios, agentes, modelos/precios y lotes que cubran las dimensiones mínimas de la especificación.
- [x] 1.2 Implementar un generador pseudoaleatorio determinista con semilla y fecha de referencia configurables, sustituyendo el uso directo de `Math.random()`.
- [x] 1.3 Implementar la ventana de 90 días UTC y generar primero registros base para garantizar actividad en cada día calendario.
- [x] 1.4 Completar el volumen hasta al menos 1000 `ExecutionLog` con perfiles ponderados por organización, departamento, agente, entorno y estado.
- [x] 1.5 Calcular `totalTokens`, `inputCost`, `outputCost` y `costUsd` con los precios del modelo y la precisión Decimal del esquema.

## 2. Persistencia Del Seed

- [x] 2.1 Actualizar `backend/prisma/seed.ts` para crear las entidades padre e hijas en orden relacional y conservar `npm run seed` como punto de entrada.
- [x] 2.2 Mantener la limpieza dependiente-a-padre y la inserción de logs en lotes para que las ejecuciones repetidas sean idempotentes y no dejen datos obsoletos.
- [x] 2.3 Añadir validaciones previas a la escritura para conteo, cobertura temporal, variedad de dimensiones, estados y consistencia de tokens/costes.
- [x] 2.4 Confirmar que no se requieren cambios en `schema.prisma` ni migraciones, y que los contratos existentes de la API siguen siendo compatibles; documentar la nueva consulta de distribución por proveedor.

## 3. Pruebas Y Verificación

- [x] 3.1 Añadir pruebas unitarias para determinismo, rango UTC de 90 días, cobertura diaria, distribución de dimensiones y fórmulas financieras.
- [x] 3.2 Añadir una prueba de integración que ejecute el seed contra PostgreSQL, compruebe relaciones y conteos, y repita la ejecución para verificar idempotencia.
- [x] 3.3 Ejecutar `npm run test:backend -- --coverage` y `npm run test:frontend -- --coverage`, verificando cobertura igual o superior al 80% en líneas, funciones y declaraciones.
- [x] 3.4 Ejecutar `npm run seed` sobre la base de desarrollo y validar que las consultas de telemetría para 7d, 30d y 90d reciben datos distribuidos en el período.
- [x] 3.5 Ejecutar `npm run build` y documentar cualquier ajuste necesario para que el seed y sus pruebas compilen sin errores.
