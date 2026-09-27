## Why

AIFinOps needs a core executive dashboard to visualize the ingested AI telemetry data. Users require a high-level view of key metrics (KPIs) and the ability to drill down into hierarchical consumption (Organization -> Department -> User) to identify cost anomalies and usage patterns.

## What Changes

- Implementation of the main Dashboard UI layout.
- Creation of base UI components: KPI metric cards and a hierarchical drill-down table.
- Integration of `recharts` for data visualization (charts).
- Configuration of a theme system to support Light and Dark modes.
- Implementation of a multi-language (i18n) system, supporting English and Spanish (with Spanish as the default).

## Capabilities

### New Capabilities
- `dashboard-ui`: The core executive dashboard interface, including KPI cards, drill-down table, charts, theming, and i18n support.

### Modified Capabilities

## Impact

- **Frontend**: New UI components, i18n setup (e.g., `i18next`), theme provider (Tailwind dark mode), and routing for the dashboard.
