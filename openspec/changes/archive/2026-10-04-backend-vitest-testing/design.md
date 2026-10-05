## Context

Actualmente las pruebas del backend se ejecutan invocando directamente un script de TypeScript con `tsx` a través de `npm test`. Consúltese `proposal.md` para la motivación detallada.

## Goals / Non-Goals

**Goals:**
- Configurar **Vitest** como el runner de pruebas oficial para el backend Node.js + Express + TypeScript.
- Crear el archivo de configuración `backend/vitest.config.ts` especificando el entorno `node` e inclusiones de rutas `src/**/*.test.ts`.
- Refactorizar las pruebas existentes en `src/modules/telemetry` a la sintaxis estándar de Vitest (`describe`, `it`, `expect`).
- Actualizar `backend/package.json` agregando los scripts `"test": "vitest run"` y `"test:watch": "vitest"`.

**Non-Goals:**
- Alterar la suite de frontend ni configurar Vitest en el paquete `frontend/`.
- Reestructurar el esquema de Prisma o las migraciones de base de datos.

## Decisions

### 1. Elección de Vitest sobre Jest
- **Decisión**: Utilizar `vitest` como ejecutor de pruebas en el backend.
- **Razón**: Vitest ofrece soporte nativo e instantáneo para TypeScript sin necesidad de transformar código con Babel o `ts-jest`, reduciendo drásticamente el tiempo de inicio y ejecución.
- **Alternativas consideradas**: Jest. Rechazado debido a la sobrecarga de configuración con TypeScript/ESM.

### 2. Estructura de Directorios de Pruebas
- **Decisión**: Ubicar las pruebas dentro de cada módulo bajo `src/modules/<modulo>/__tests__/<nombre>.test.ts`.
- **Razón**: Mantiene los tests acoplados a sus respectivos servicios y controladores facilitando la mantenibilidad y modularidad.

### 3. Configuración de Vitest (`vitest.config.ts`)
- **Decisión**: Configurar `environment: 'node'`, `globals: true` e incluir sugerencias de patrones de archivos.
- **Razón**: Permite usar globals como `describe` e `it` sin importaciones repetitivas si se desea, o importaciones explícitas desde `'vitest'`.

## Risks / Trade-offs

- **[Dependencia de PostgreSQL en tests de integración de Prisma]** → *Mitigación*: Garantizar que los tests de integración utilicen las instancias activas de desarrollo o mocks adecuados sin alterar datos de producción.

## Migration Plan

1. Instalar `vitest` en `backend/` como `devDependency`.
2. Crear `backend/vitest.config.ts`.
3. Migrar `src/modules/telemetry/test/telemetry.test.ts` a `src/modules/telemetry/__tests__/telemetry.test.ts` adaptándolo a assertions de Vitest.
4. Actualizar `package.json` y verificar ejecución mediante `npm test`.
