## Why

AI expenditures can spike unexpectedly due to infinite loops, unoptimized prompt chains, or abnormal API traffic. Implementing an anomaly detection and budget control system allows FinOps teams to receive instant alerts when spending exceeds defined thresholds and automatically trigger webhooks (e.g. Jira / Slack) to prevent budget overruns.

## What Changes

- Implementation of an Anomaly Alert Center in the frontend (`AnomalyAlertCenter.tsx` & notification popover in `Header.tsx`).
- Prominent Budget Burn Warning Banners displayed when an Organization or Environment crosses 85% (Warning) or 100% (Critical) of its budget.
- Interactive "Trigger Alert / Open Ticket" action button integrated with the `jira-webhook-server` to automatically log cost anomalies into Jira.
- Real-Time Anomaly Feed displaying sudden token spikes (+200% in 1h) or error rate increases.

## Capabilities

### New Capabilities

- `anomaly-alerts`: Real-time detection of AI cost anomalies, budget threshold warnings (85%/100%), and automated webhook integration for Jira/Slack ticket generation.

### Modified Capabilities

- `dashboard-ui`: Add budget burn alert banners, active notification badge with drawer popover, and Jira webhook trigger buttons on alert items.

## Impact

- **Frontend**: Adds `AnomalyAlertCenter.tsx`, `BudgetWarningBanner.tsx`, notification drawer in `Header.tsx`, and webhook integration service (`src/services/webhookApi.ts`).
- **Jira Webhook Integration**: Connects frontend alert actions with the `jira-webhook-server` endpoint.
