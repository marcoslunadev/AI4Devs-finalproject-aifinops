## 1. Setup & Dependencies

- [x] 1.1 Install Vitest in `backend/package.json` (`npm install -D vitest`)
- [x] 1.2 Create `backend/vitest.config.ts` with Node environment and test patterns
- [x] 1.3 Update `backend/package.json` scripts to include `"test": "vitest run"` and `"test:watch": "vitest"`


## 2. Test Suite Migration & Implementation

- [x] 2.1 Refactor existing telemetry tests to Vitest suite in `backend/src/modules/telemetry/__tests__/telemetry.test.ts`
- [x] 2.2 Add Vitest test assertions (`describe`, `it`, `expect`) for `TelemetryService` methods (`getOrganizations`, `getDepartmentExecutions`, `getKpiMetrics`, `getTimeSeriesChart`)
- [x] 2.3 Add Vitest controller unit test for `TelemetryController`


## 3. Verification

- [x] 3.1 Execute `npm test` in `backend/` and verify all Vitest tests pass cleanly

