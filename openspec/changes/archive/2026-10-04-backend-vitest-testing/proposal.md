## Why

Actualmente el backend carece de una suite y runner formal de pruebas unitarias e integración, dependiendo de scripts personalizados de TypeScript ejecutados mediante `tsx`. Integrar **Vitest** proporcionará un test runner ultrarrápido, nativo para TypeScript, con soporte para mocks, assertions estándar (`describe`, `it`, `expect`), reportes de cobertura y ejecución paralela.

## What Changes

- **Instalación y Configuración de Vitest**: Añadir `vitest` a `devDependencies` en `backend/package.json` y crear la configuración centralizada en `backend/vitest.config.ts`.
- **Actualización de Scripts npm**: Configurar `"test": "vitest run"` y `"test:watch": "vitest"` en el backend.
- **Refactorización de Pruebas**: Migrar las pruebas existentes de `telemetry.test.ts` a la sintaxis estándar de Vitest (`describe`, `it`, `expect`).
- **Nuevos Tests de Módulos**: Ampliar la suite de pruebas automatizadas para cubrir controladores y servicios del backend.

## Capabilities

### New Capabilities
- `backend-testing`: Suite de pruebas automatizadas, ejecutores y assertions para la arquitectura backend utilizando Vitest.

### Modified Capabilities
<!-- Ninguna especificación existente cambia sus requisitos de comportamiento de negocio. -->

## Impact

- **Backend (`backend/`)**:
  - `package.json`: Adición de `vitest` en `devDependencies` y actualización del script `"test"`.
  - Nuevo archivo `vitest.config.ts`.
  - Reorganización de archivos de prueba en `backend/src/modules/**/__tests__/*.test.ts`.
