import { Prisma, Environment, ExecutionStatus } from "@prisma/client";
import { describe, expect, it } from "vitest";
import {
  SEED_EXECUTION_COUNT,
  SEED_TOKEN_VOLUME_MULTIPLIER,
  SEED_WINDOW_DAYS,
  createSeededRandom,
  generateSeedData,
  normalizeReferenceDate,
  seedCatalog,
  validateSeedData,
} from "../../../prisma/seedData";

describe("deterministic telemetry seed generator", () => {
  const referenceDate = new Date("2026-11-10T18:45:00.000Z");

  it("produces the same logical dataset for the same seed and UTC reference date", () => {
    const first = generateSeedData(referenceDate, "test-seed");
    const second = generateSeedData(new Date("2026-11-10T02:00:00.000Z"), "test-seed");

    expect(first.referenceDate).toEqual(new Date("2026-11-10T00:00:00.000Z"));
    expect(second.executionLogs).toEqual(first.executionLogs);
  });

  it("changes generated values when the configured seed changes", () => {
    const first = generateSeedData(referenceDate, "seed-a");
    const second = generateSeedData(referenceDate, "seed-b");

    expect(second.executionLogs).not.toEqual(first.executionLogs);
  });

  it("uses a reproducible pseudo-random sequence without relying on global randomness", () => {
    const firstRandom = createSeededRandom("sequence");
    const secondRandom = createSeededRandom("sequence");

    expect([firstRandom(), firstRandom(), firstRandom()]).toEqual([
      secondRandom(),
      secondRandom(),
      secondRandom(),
    ]);
  });

  it("generates 90 UTC days, at least 1000 logs, and all required dimensions", () => {
    const generated = generateSeedData(referenceDate, "coverage-seed");
    const dates = new Set(generated.executionLogs.map((log) => log.executedAt.toISOString().slice(0, 10)));
    const environments = new Set(generated.executionLogs.map((log) => log.environment));
    const statuses = new Set(generated.executionLogs.map((log) => log.status));
    const models = new Set(generated.executionLogs.map((log) => `${log.provider}:${log.model}`));

    expect(generated.executionLogs).toHaveLength(SEED_EXECUTION_COUNT);
    expect(dates.size).toBe(SEED_WINDOW_DAYS);
    expect(environments).toEqual(new Set([Environment.DEV, Environment.PRE, Environment.PRO]));
    expect(statuses).toEqual(
      new Set([
        ExecutionStatus.SUCCESS,
        ExecutionStatus.ERROR,
        ExecutionStatus.TIMEOUT,
        ExecutionStatus.RATE_LIMIT_EXCEEDED,
      ])
    );
    expect(models.size).toBeGreaterThanOrEqual(4);
    validateSeedData(generated);
  });

  it("keeps token and Decimal financial formulas consistent with model prices", () => {
    const generated = generateSeedData(referenceDate, "finance-seed");
    const prices = new Map(generated.catalog.modelPrices.map((price) => [`${price.provider}:${price.model}`, price]));

    for (const log of generated.executionLogs.slice(0, 50)) {
      const price = prices.get(`${log.provider}:${log.model}`);
      expect(price).toBeDefined();
      expect(log.totalTokens).toBe(log.promptTokens + log.completionTokens);

      const input = new Prisma.Decimal(log.promptTokens)
        .mul(new Prisma.Decimal(price!.promptPricePer1k))
        .div(1000)
        .toDecimalPlaces(6);
      const output = new Prisma.Decimal(log.completionTokens)
        .mul(new Prisma.Decimal(price!.completionPricePer1k))
        .div(1000)
        .toDecimalPlaces(6);
      expect(log.inputCost).toBe(input.toFixed(6));
      expect(log.outputCost).toBe(output.toFixed(6));
      expect(log.costUsd).toBe(input.plus(output).toFixed(6));
    }
  });

  it("generates enough deterministic usage volume for budget burn visibility", () => {
    const generated = generateSeedData(referenceDate, "budget-seed");
    const totalTokens = generated.executionLogs.reduce((sum, log) => sum + log.totalTokens, 0);

    expect(totalTokens).toBeGreaterThan(SEED_EXECUTION_COUNT * SEED_TOKEN_VOLUME_MULTIPLIER);
    expect(generated.executionLogs.some((log) => Number(log.costUsd) >= 30)).toBe(true);
  });

  it("rejects an invalid reference date", () => {
    expect(() => normalizeReferenceDate(new Date("invalid"))).toThrow("valid date");
  });

  it("keeps the catalog above the minimum relational dimensions", () => {
    expect(seedCatalog.organizations).toHaveLength(2);
    expect(seedCatalog.departments.length).toBeGreaterThanOrEqual(4);
    expect(seedCatalog.agents.length).toBeGreaterThanOrEqual(4);
    expect(seedCatalog.modelPrices.length).toBeGreaterThanOrEqual(4);
  });
});
