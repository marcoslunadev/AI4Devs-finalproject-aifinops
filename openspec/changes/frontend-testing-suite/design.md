## Context

The frontend application is built with React 19, Vite, and TypeScript. While the backend has a comprehensive Vitest suite, the frontend previously lacked test infrastructure. See `proposal.md` for the motivation and `specs/frontend-testing/spec.md` for the behavioral requirements.

## Goals / Non-Goals

**Goals:**
- Provide a fast, reliable test execution environment in the frontend matching the backend test stack (Vitest).
- Implement jsdom DOM emulation for browser-like testing of React components without launching full browser processes.
- Add unit and component test suites verifying core presentation (`KpiCard`), routing guards (`ProtectedRoute`), and interaction behaviors.
- Ensure strict separation between test files and production build (`tsc -b && vite build` continues to succeed cleanly).

**Non-Goals:**
- Full End-to-End browser automation (Playwright test runner is maintained as a separate integration layer).
- Testing internal charting library SVG vector rendering (Recharts internals).

## Decisions

### 1. Vitest as Test Runner for Frontend
- **Decision**: Use Vitest with `jsdom` rather than Jest.
- **Rationale**: Vitest provides native Vite support, understands ESM without complex Babel transforms, reuses `@` alias paths from `vite.config.ts`, and aligns with the existing backend test stack.
- **Alternatives Considered**: Jest (requires `ts-jest` and additional Babel configuration for React 19).

### 2. Standalone Test Configuration and TypeScript Typing
- **Decision**: Configure Vitest using `vitest/config` in `vite.config.ts` (or a dedicated `vitest.config.ts`) and include `@testing-library/jest-dom/vitest` for type augmentation.
- **Rationale**: Ensures the test runner has access to custom DOM matchers (`toBeInTheDocument`, `toHaveClass`) while maintaining strict production TypeScript compilation.
- **Alternatives Considered**: Manual custom assertions without jest-dom (verbose and prone to brittle DOM structure checks).

### 3. Component Test Focus on Business & Financial Value
- **Decision**: Target high-impact components first: `KpiCard` (financial metrics, trend formatting, percentage indicators) and `ProtectedRoute` (authentication and navigation guard).
- **Rationale**: Directly satisfies the rubric requirements for unit testing critical presentation and security layers.

## Risks / Trade-offs

- **[Risk]** Type conflicts between Vitest's `expect` and Testing Library's `jest-dom` extensions.
  - *Mitigation*: Import `@testing-library/jest-dom/vitest` in `src/test/setup.ts` and ensure `tsconfig` references the vitest matcher definitions.
- **[Risk]** Production bundle bloat if test setup files are included in the build.
  - *Mitigation*: Test files (`__tests__/*.test.tsx`) are only loaded during test execution and tree-shaken by Vite during `vite build`.
