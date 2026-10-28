## Why

To adhere to the lean MVP scope focused on the core FinOps happy path (as emphasized in teacher feedback), external ticketing integrations with third-party issue trackers (specifically Jira webhooks) are removed from the current delivery and deferred to version 2. The anomaly alerts system will focus strictly on internal platform observability: real-time budget threshold warnings (85% warning, 100% critical) and in-app notifications.

## What Changes

- **Remove External Jira Webhook Client**: Delete `frontend/src/services/webhookApi.ts` as external ticketing is out of MVP scope.
- **Streamline Alert Components**: Remove the "Create Jira Ticket" button and ticket status links from `BudgetWarningBanner.tsx` and `NotificationDrawer.tsx`, keeping the alert cards cleanly focused on threshold status, entity names, costs, and budget percentages.
- **Clean Alert Store**: Remove Jira ticket properties (`ticketId`, `ticketUrl`, `updateTicketStatus`) from `alertStore.ts`.
- **Clean Localization Keys**: Remove obsolete Jira webhook translation keys from Spanish and English dictionaries in `frontend/src/lib/i18n.ts`.
- **Update Capability Specification**: Remove the Jira webhook integration requirement from `anomaly-alerts` capability, officially marking external webhook ticketing as deferred to v2.

## Capabilities

### Modified Capabilities

- `anomaly-alerts`: Remove the Jira/Slack webhook ticketing requirement (`Requirement: Integración de Webhooks de Jira / Slack`), keeping the budget burn warning banners and notification drawer focused strictly on internal FinOps observability.

## Impact

- **Frontend**:
  - `frontend/src/services/webhookApi.ts` (removed).
  - `frontend/src/components/alerts/BudgetWarningBanner.tsx` (simplified UI without Jira action button).
  - `frontend/src/components/alerts/NotificationDrawer.tsx` (simplified UI without Jira action button).
  - `frontend/src/store/alertStore.ts` (cleaned of ticket state).
  - `frontend/src/lib/i18n.ts` (removed Jira-related translation keys).
- **Specifications**:
  - `openspec/specs/anomaly-alerts/spec.md` updated to remove the webhook requirement.
