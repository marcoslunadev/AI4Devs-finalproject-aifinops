## Why

The frontend application currently lacks an automated testing suite and `npm test` script. To guarantee the reliability of critical UI components (such as KPI metrics, hierarchical drill-down tables, and protected routing), meet master deliverable criteria, and prevent UI regressions, a robust unit and component testing setup using Vitest and React Testing Library is required.

## What Changes

- Add Vitest, jsdom, and `@testing-library/react` dependencies to the frontend package.
- Configure `vitest` in `frontend/vite.config.ts` with jsdom environment and setup files without breaking production Vite builds.
- Add `test` and `test:watch` scripts to `frontend/package.json`.
- Configure TypeScript settings (`tsconfig.app.json`) to recognize test globals and matchers.
- Implement unit and component tests for core components:
  - `KpiCard`: Validates rendering of metrics, dynamic percentages, trend indicators, and status badges.
  - `ProtectedRoute`: Validates authentication guards, session checks, and redirection flows.
  - `DrillDownTable`: Validates table expansion and cascading hierarchy presentation.
- Ensure `npm run build` (`tsc -b && vite build`) and `npm test` execute cleanly with 100% green status.

## Capabilities

### New Capabilities
- `frontend-testing`: Automated unit, component, and routing test suite for the frontend SPA using Vitest and React Testing Library.

### Modified Capabilities

## Impact

- `frontend/package.json`: Adds devDependencies (`vitest`, `jsdom`, `@testing-library/react`, `@testing-library/jest-dom`) and test scripts.
- `frontend/vite.config.ts`: Configures test runner environment and setup file imports.
- `frontend/src/test/setup.ts`: Global test setup with extended DOM assertions.
- `frontend/src/components/__tests__/`: New automated test files for core components.
