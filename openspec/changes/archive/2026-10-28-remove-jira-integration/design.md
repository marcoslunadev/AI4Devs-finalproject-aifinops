## Context

The frontend previously integrated with a hypothetical or local Jira webhook endpoint via `frontend/src/services/webhookApi.ts`, invoked from `BudgetWarningBanner.tsx` and `NotificationDrawer.tsx`. As established in `proposal.md`, third-party issue tracking is excluded from the MVP scope in favor of a lean, robust FinOps observability core.

## Goals / Non-Goals

**Goals:**
- Completely remove external Jira webhook dispatching and related network requests.
- Streamline `BudgetWarningBanner.tsx` and `NotificationDrawer.tsx` to display cost and budget deviations cleanly without dead ticketing buttons.
- Clean up `alertStore.ts` by removing ticket tracking state (`ticketId`, `ticketUrl`, `updateTicketStatus`).
- Purge obsolete Jira translation keys from `frontend/src/lib/i18n.ts`.
- Ensure TypeScript build and all unit/integration tests pass with zero warnings or errors.

**Non-Goals:**
- Replacing Jira with an alternative ticketing system (Slack/PagerDuty) in this MVP; all external webhooks are deferred to v2.
- Modifying backend telemetry or database schema (which has no Jira dependency).

## Decisions

### Decision 1: Complete removal of `webhookApi.ts`
- **Choice**: Delete `frontend/src/services/webhookApi.ts` entirely.
- **Rationale**: No other module in the codebase depends on this file. Keeping dead code or stub implementations creates technical debt and confuses developers.
- **Alternative considered**: Keeping a mock stub returning no-op responses. Rejected because no component should even invoke external ticketing in MVP.

### Decision 2: Focus Alert UI on Observability
- **Choice**: In `BudgetWarningBanner.tsx`, render the threshold badge, alert title, and detailed deviation explanation. Remove the right-hand "Crear Ticket en Jira" button.
- **Choice**: In `NotificationDrawer.tsx`, retain the notification badge, title, timestamp, description, and the "dismiss" (trash icon) action. Remove the Jira ticket button and ticket link badge.
- **Rationale**: The alert banners and drawer maintain their premium look & feel while serving their primary goal: alerting executives and FinOps engineers about runaway spending.

### Decision 3: Clean Localization Dictionaries
- **Choice**: Remove unused Jira keys (`createJiraTicket`, `jiraTicketCreated`, `jiraTicket`) from both `es` and `en` locales in `frontend/src/lib/i18n.ts`.
- **Rationale**: Keeps the localization dictionary strictly synchronized with actual UI components.

## Risks / Trade-offs

- **[Risk] Broken imports or missing props in Alert UI**: If any component still references `updateTicketStatus` or `sendJiraTicketWebhook`, TypeScript compilation will fail.
  - **Mitigation**: Run `npm run build` in `frontend` to verify all imports and type definitions are resolved cleanly.
