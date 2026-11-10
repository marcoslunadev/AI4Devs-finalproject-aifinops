## Context

See `proposal.md` for the motivation. The current backend seed already clears relational data and creates a single-organization dataset with randomized execution logs, but it does not guarantee reproducible distributions or coverage of every calendar day. The existing Prisma schema already contains the dimensions required by the change, so the design preserves the schema and existing API contracts while adding the provider-distribution query required by Model Analytics.

## Goals / Non-Goals

**Goals:**

- Generate a richer, deterministic dataset that exercises the existing telemetry aggregations across organizations, departments, users, agents, models, environments and statuses.
- Guarantee at least one valid execution per UTC calendar day in the 90-day window and enough additional records for meaningful 7d, 30d and 90d views.
- Keep monetary calculations aligned with `ModelPrice` and preserve the current `npm run seed` entry point.
- Make the provider cost distribution in Model Analytics reflect real `ExecutionLog` costs from the last 30 days.
- Make the data-generation rules independently testable without requiring a live PostgreSQL instance for every unit test.

**Non-Goals:**

- Change `schema.prisma`, add migrations, or alter existing API response contracts.
- Seed production data or preserve existing development telemetry when the command is intentionally rerun.
- Add a runtime data-generation service or a new third-party faker/randomness dependency.

## Decisions

### Deterministic local generator

Use a small seeded pseudo-random generator implemented within the seed domain instead of `Math.random()` or a new dependency. Use a fixed seed plus a date/reference parameter so the same inputs produce the same dimensions, values and timestamps while still providing variation.

**Alternative considered:** `Math.random()` is simpler, but it makes failures and snapshot comparisons non-reproducible. A faker package would provide richer names but adds dependency and version churn for data that can be represented by explicit catalog arrays.

### Explicit catalogs and weighted profiles

Represent organizations, departments, users, agents, prices and model profiles as explicit seed catalogs. Generate a baseline record for every day first, then fill the remaining volume using weighted profiles per organization, department, agent, environment and status. Keep success more frequent than failure, but include `ERROR`, `TIMEOUT` and `RATE_LIMIT_EXCEEDED` records deliberately.

**Alternative considered:** generate every field independently. That can create implausible combinations and accidentally omit a dimension, whereas profiles make coverage and business realism explicit.

### UTC date window and Decimal calculations

Normalize the reference date to UTC midnight and generate timestamps only from the 90 inclusive calendar dates ending on that reference day. Derive `totalTokens` from prompt and completion tokens and derive `inputCost`, `outputCost` and `costUsd` from the selected `ModelPrice` using Prisma `Decimal`, rounding only at the database precision boundary.

**Alternative considered:** use local timezone dates and floating-point totals. Local dates can shift records across dashboard buckets, and binary floating point can make financial invariant tests flaky.

### Relational reset followed by batched writes

Keep the established dependent-to-parent cleanup order, then create parent catalogs before children and insert execution logs in batches. Use stable logical identifiers/emails for seeded entities and validate generated collections before writes. The reset remains intentionally destructive for development seeding, while batches avoid creating one database request per log.

**Alternative considered:** upsert without cleanup. Upserts would preserve stale records and make historical counts depend on prior runs, violating the reproducible dataset contract.

### Test strategy

Extract or isolate pure generation and validation logic so unit tests can assert deterministic output, 90-day coverage, dimension variety, status distribution and cost/token invariants. Add an integration-level seed check where PostgreSQL is available to verify foreign keys, counts and repeat execution. Run the existing backend and frontend suites with coverage as the acceptance gate.

### Provider distribution

Aggregate provider costs from the same `executedAt`-bounded telemetry window used by the dashboard and calculate each share from the rounded provider totals. The frontend maps provider identifiers to display names and renders an empty zero-total state when the query returns no records instead of falling back to hardcoded values.

## Risks / Trade-offs

- **[Risk]** Rerunning the seed deletes development telemetry and related entities. **Mitigation:** document the destructive behavior, keep it scoped to the existing seed command, and require an explicit development database for execution.
- **[Risk]** A UTC boundary can differ from a user's local calendar. **Mitigation:** define the seed contract and assertions in UTC, matching the backend aggregation boundary.
- **[Risk]** Larger batches increase seed duration and memory use. **Mitigation:** generate only the planned dataset size in memory and use bounded `createMany` batches for logs.
- **[Risk]** Future schema enum or model changes can invalidate the catalogs. **Mitigation:** type catalogs against Prisma enums and run the backend build plus seed validation in CI.

## Migration Plan

1. Update the seed generator and its tests without changing Prisma migrations.
2. Ensure the development PostgreSQL database is available and run `npm run seed` from `backend`.
3. Run backend and frontend test suites with coverage and verify the 90-day dataset invariants.
4. Roll back by reverting the seed change and rerunning the previous seed if the generated dataset is incompatible; no schema rollback is required.

## Open Questions

None. The volume, date semantics, dimensions and destructive development-seed behavior are defined by the modified capability requirements.
