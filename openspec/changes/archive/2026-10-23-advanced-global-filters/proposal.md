## Why

Executives and FinOps managers need the ability to dynamically filter all dashboard visualizations (KPIs, time-series charts, and drill-down tables) by custom date ranges, AI models/providers, and specific organizations or environments. Currently, metrics are displayed globally without filtering controls.

## What Changes

- Implementation of a global filter bar component (`GlobalFilterBar.tsx`) positioned at the top of the executive dashboard.
- Date range filtering controls: Preset shortcuts (7D, 30D, 90D, Year-to-Date) and custom start/end date inputs.
- Provider and Model multi-select filter (e.g. OpenAI GPT-4o, Anthropic Claude 3.5, Google Gemini, Llama 3).
- Organization & Environment filter dropdowns to isolate cost centers.
- URL query parameter synchronization (`useSearchParams`) to support deep linking and shareable dashboard views.
- Global filter state management store (`useFilterStore`) with Zustand.

## Capabilities

### New Capabilities

### Modified Capabilities

- `dashboard-ui`: Add an advanced global filter bar supporting date range selection, AI model/provider filtering, organization scope, and URL search params state sync.

## Impact

- **Frontend**: Adds `GlobalFilterBar.tsx` component, Zustand filter store (`src/store/filterStore.ts`), and connects `Dashboard.tsx` components to active filter parameters.
