import { PrismaClient } from "@prisma/client";
import { describe, expect, it } from "vitest";
import { generateSeedData, SEED_EXECUTION_COUNT } from "../../../prisma/seedData";
import { seedDatabase } from "../../../prisma/seed";

const integrationEnabled = process.env.RUN_SEED_INTEGRATION === "1" && Boolean(process.env.DATABASE_URL);
const integrationDescribe = integrationEnabled ? describe : describe.skip;

integrationDescribe("PostgreSQL seed integration", () => {
  it("persists valid relations and remains idempotent across repeated runs", async () => {
    const database = new PrismaClient();
    const referenceDate = new Date("2026-11-10T00:00:00.000Z");

    try {
      await seedDatabase(database, referenceDate, "integration-seed");
      const firstCounts = await Promise.all([
        database.organization.count(),
        database.department.count(),
        database.user.count(),
        database.aiAgent.count(),
        database.modelPrice.count(),
        database.ingestionBatch.count(),
        database.executionLog.count(),
      ]);

      await seedDatabase(database, referenceDate, "integration-seed");
      const secondCounts = await Promise.all([
        database.organization.count(),
        database.department.count(),
        database.user.count(),
        database.aiAgent.count(),
        database.modelPrice.count(),
        database.ingestionBatch.count(),
        database.executionLog.count(),
      ]);

      expect(secondCounts).toEqual(firstCounts);
      expect(secondCounts[6]).toBe(SEED_EXECUTION_COUNT);
      expect(await database.executionLog.count({ where: { user: { organization: {} } } })).toBe(SEED_EXECUTION_COUNT);
      expect(await database.executionLog.count({ where: { agent: { isNot: null } } })).toBe(SEED_EXECUTION_COUNT);

      const expected = generateSeedData(referenceDate, "integration-seed");
      const dates = await database.executionLog.findMany({
        select: { executedAt: true },
        orderBy: { executedAt: "asc" },
      });
      expect(new Set(dates.map((log) => log.executedAt.toISOString().slice(0, 10))).size).toBe(
        new Set(expected.executionLogs.map((log) => log.executedAt.toISOString().slice(0, 10))).size
      );
    } finally {
      await database.$disconnect();
    }
  });
});
