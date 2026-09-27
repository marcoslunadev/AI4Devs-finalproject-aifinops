## Why

Organizations need detailed visibility into which AI models (e.g. GPT-4o, Claude 3.5 Sonnet, Gemini 1.5, Llama 3) and providers are driving LLM expenditure. Providing dedicated model analytics enables executives to identify cost-inefficient models, analyze prompt vs. completion token ratios, and optimize provider allocation.

## What Changes

- Creation of a dedicated "Model & Provider Analytics" view in the frontend (`ModelAnalytics.tsx`).
- Donut/Pie Chart component (`ModelDistributionChart.tsx`) displaying market share and cost breakdown by provider (OpenAI, Anthropic, Google, Meta/Bedrock).
- Bar Chart component (`TokenRatioChart.tsx`) comparing Prompt (Input) vs Completion (Output) tokens per model.
- Scatter Plot / Efficiency Grid component (`ModelEfficiencyChart.tsx`) comparing average latency (ms) vs cost per call ($) across models.
- Navigation tab / route integration (`/analytics/models`) in the Executive Dashboard navigation.

## Capabilities

### New Capabilities

- `model-analytics`: Specialized analytics suite for AI models & providers, providing cost share distribution, input/output token ratio analysis, and latency vs. cost efficiency metrics.

### Modified Capabilities

- `dashboard-ui`: Add navigation tabs and route routing to switch between the Executive Overview and the Model & Provider Analytics view.

## Impact

- **Frontend**: Adds `ModelAnalytics.tsx`, `ModelDistributionChart.tsx`, `TokenRatioChart.tsx`, and `ModelEfficiencyChart.tsx` in `frontend/src/components/analytics/` following `react-expert` guidelines.
- **Navigation**: Adds tab navigation in `DashboardLayout.tsx` for seamless switching between Executive Overview and Model Analytics.
