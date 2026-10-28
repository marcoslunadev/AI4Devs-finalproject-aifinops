## 1. Frontend Alert UI Cleanup

- [x] 1.1 Remove Jira webhook button and state from `frontend/src/components/alerts/BudgetWarningBanner.tsx`
- [x] 1.2 Remove Jira ticket action and status badges from `frontend/src/components/alerts/NotificationDrawer.tsx`
- [x] 1.3 Clean up ticket state and actions from `frontend/src/store/alertStore.ts`
- [x] 1.4 Delete obsolete Jira webhook service file `frontend/src/services/webhookApi.ts`
- [x] 1.5 Remove Jira-related translation keys from `frontend/src/lib/i18n.ts`

## 2. Capability Spec and Documentation Alignment

- [x] 2.1 Update `openspec/specs/anomaly-alerts/spec.md` to remove Jira webhook requirement and focus purpose on internal alerting
- [x] 2.2 Verify frontend build with `npm run build` and backend test suite with `npm test`
