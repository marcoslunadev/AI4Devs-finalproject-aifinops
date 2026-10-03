## 1. Backend Implementation

- [x] 1.1 Add `getOrganizations` method in `TelemetryRepository` and `TelemetryService` to fetch active organizations from Prisma
- [x] 1.2 Update `getKpis`, `getChartData`, and `getBreakdownData` in `TelemetryService` to accept optional `organizationId` parameter
- [x] 1.3 Add `getDepartmentExecutions` method in `TelemetryRepository` and `TelemetryService` to aggregate logs by Organization ➔ Department ➔ LLM Model
- [x] 1.4 Expose `GET /api/v1/telemetry/organizations` and `GET /api/v1/telemetry/department-executions` in `TelemetryController` and `telemetryRoutes.ts`

- [x] 1.5 Add backend unit/integration tests for organization listing and department execution analytics endpoints


## 2. Frontend Component Implementation

- [x] 2.1 Update `telemetryApi.ts` client to include `fetchOrganizations` and `fetchDepartmentExecutions`, and pass `organizationId` query param to KPI/Chart endpoints

- [x] 2.2 Create `OrganizationScopeSelector.tsx` component to dynamically load organizations and manage `organizationId` URL search parameter

- [x] 2.3 Update `Header.tsx` to replace the static search input with `OrganizationScopeSelector.tsx`

- [x] 2.4 Create `ExecutionLogsView.tsx` component displaying hierarchical breakdown table by Organization ➔ Department ➔ LLM Model with calls, tokens, cost, and latency metrics

- [x] 2.5 Add navigation route/tab in `Dashboard.tsx` to switch between main Dashboard analytics and Department Execution Analytics


## 3. i18n and UI Polish

- [x] 3.1 Add bilingual i18n translation keys in `es.json` and `en.json` for organization selector labels, empty states, department analytics table headers, and tooltips

- [x] 3.2 Verify accessibility, dark mode styling with Tailwind CSS, and responsiveness across viewports
- [x] 3.3 Run tests and verify backend API and frontend build

