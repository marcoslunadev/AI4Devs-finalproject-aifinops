## Purpose

Establece el marco estandarizado de pruebas automatizadas unitarias e integración para los servicios y controladores del backend mediante Vitest.

## ADDED Requirements

### Requirement: Ejecución de Tests con Runner Vitest
El sistema backend SHALL contar con la dependencia Vitest configurada en `package.json` de manera que el comando `npm test` ejecute la suite de pruebas mediante Vitest y devuelva un código de salida 0 en caso de éxito.

#### Scenario: Ejecución exitosa de la suite de pruebas del backend
- **WHEN** un desarrollador o pipeline de CI ejecuta `npm test` en el directorio `backend/`
- **THEN** Vitest descubre y ejecuta todos los archivos de prueba con patrón `*.test.ts` o `*.spec.ts`
- **AND** evalúa las aserciones devolviendo un resumen de pruebas pasadas/fallidas y código de salida 0 si todas son correctas

### Requirement: Cobertura de Módulos de Telemetría
El backend SHALL incluir tests automatizados en Vitest para los servicios y controladores de telemetría (`TelemetryService`, `TelemetryController`) verificando el cálculo de KPIs, filtrado por organización y agregaciones por departamento.

#### Scenario: Validación de endpoints y lógica de servicio con Vitest
- **WHEN** se ejecutan las pruebas del módulo de telemetría con `npm test`
- **THEN** Vitest comprueba mediante las funciones `describe`, `it` y `expect` que las respuestas de `getOrganizations`, `getDepartmentExecutions` y `getKpis` respetan la estructura de esquema esperada

### Requirement: Cobertura Mínima de Pruebas (>80%)
El código introducido o modificado en frontend y backend SHALL mantener una cobertura de pruebas unitarias/integración superior al 80% (`>= 80%`) en líneas, funciones, declaraciones y ramas.

#### Scenario: Validación de umbral de cobertura del 80%
- **WHEN** se ejecuta la suite de pruebas del proyecto (`npm test`)
- **THEN** el test runner reporta una cobertura en líneas, funciones y declaraciones igual o superior al 80% sin fallos de umbral

