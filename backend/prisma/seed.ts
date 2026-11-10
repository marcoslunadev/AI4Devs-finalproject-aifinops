import { PrismaClient, BatchStatus, Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import {
  DEFAULT_SEED,
  generateSeedData,
  normalizeReferenceDate,
  validateSeedData,
} from "./seedData";

const prisma = new PrismaClient();
const SEED_BCRYPT_SALT = "$2b$10$C6UzMDM.H6dfI/f/IKcEe.";
const LOG_BATCH_SIZE = 250;

function getReferenceDate(): Date {
  const configuredDate = process.env.SEED_REFERENCE_DATE;
  return configuredDate ? normalizeReferenceDate(new Date(configuredDate)) : normalizeReferenceDate(new Date());
}

export async function seedDatabase(
  db: PrismaClient = prisma,
  referenceDate: Date = getReferenceDate(),
  seed: string = process.env.SEED_RANDOM_SEED ?? DEFAULT_SEED
) {
  const generated = generateSeedData(referenceDate, seed);
  validateSeedData(generated);

  console.log("🌱 Starting Database Seeding for AIFinOps...");

  // Remove dependants first so reruns cannot leave stale telemetry or FK violations.
  await db.executionLog.deleteMany();
  await db.ingestionBatch.deleteMany();
  await db.aiAgent.deleteMany();
  await db.user.deleteMany();
  await db.department.deleteMany();
  await db.organization.deleteMany();
  await db.modelPrice.deleteMany();
  console.log("🧹 Cleaned existing database records.");

  const modelPriceIds = new Map<string, string>();
  for (const modelPrice of generated.catalog.modelPrices) {
    const created = await db.modelPrice.create({
      data: {
        provider: modelPrice.provider,
        model: modelPrice.model,
        promptPricePer1k: new Prisma.Decimal(modelPrice.promptPricePer1k),
        completionPricePer1k: new Prisma.Decimal(modelPrice.completionPricePer1k),
        effectiveFrom: referenceDate,
        isActive: true,
      },
    });
    modelPriceIds.set(modelPrice.key, created.id);
  }
  console.log(`💵 Seeded ${modelPriceIds.size} ModelPrice entries.`);

  const organizationIds = new Map<string, string>();
  for (const organization of generated.catalog.organizations) {
    const created = await db.organization.create({ data: { name: organization.name } });
    organizationIds.set(organization.key, created.id);
  }

  const departmentIds = new Map<string, string>();
  for (const department of generated.catalog.departments) {
    const organizationId = organizationIds.get(department.organizationKey);
    if (!organizationId) throw new Error(`Organization not found for department ${department.key}.`);
    const created = await db.department.create({
      data: { name: department.name, organizationId },
    });
    departmentIds.set(department.key, created.id);
  }
  console.log(`🏢 Seeded ${organizationIds.size} organizations and ${departmentIds.size} departments.`);

  const userIds = new Map<string, string>();
  for (const user of generated.catalog.users) {
    const organizationId = organizationIds.get(user.organizationKey);
    const departmentId = departmentIds.get(user.departmentKey);
    if (!organizationId || !departmentId) throw new Error(`Invalid catalog relation for user ${user.key}.`);
    const created = await db.user.create({
      data: {
        name: user.name,
        email: user.email,
        passwordHash: await bcrypt.hash(user.password, SEED_BCRYPT_SALT),
        role: user.role,
        organizationId,
        departmentId,
      },
    });
    userIds.set(user.key, created.id);
  }
  console.log(`👥 Seeded ${userIds.size} users.`);

  const agentIds = new Map<string, string>();
  for (const agent of generated.catalog.agents) {
    const organizationId = organizationIds.get(agent.organizationKey);
    const departmentId = departmentIds.get(agent.departmentKey);
    if (!organizationId || !departmentId) throw new Error(`Invalid catalog relation for agent ${agent.key}.`);
    const created = await db.aiAgent.create({
      data: {
        id: agent.id,
        name: agent.name,
        description: agent.description,
        organizationId,
        departmentId,
        status: "ACTIVE",
      },
    });
    agentIds.set(agent.key, created.id);
  }
  console.log(`🤖 Seeded ${agentIds.size} AI agents.`);

  const batch = generated.catalog.batches[0];
  const seedBatch = await db.ingestionBatch.create({
    data: {
      fileName: batch.fileName,
      fileSizeBytes: batch.fileSizeBytes,
      totalRecords: generated.executionLogs.length,
      processedRecords: generated.executionLogs.length,
      failedRecords: 0,
      status: BatchStatus[batch.status],
    },
  });

  const logsData: Prisma.ExecutionLogCreateManyInput[] = generated.executionLogs.map((log) => {
    const userId = userIds.get(log.userKey);
    const agentId = agentIds.get(log.agentKey);
    if (!userId || !agentId) throw new Error("Generated log references an entity that was not persisted.");
    return {
      userId,
      agentId,
      batchId: seedBatch.id,
      environment: log.environment,
      provider: log.provider,
      model: log.model,
      promptTokens: log.promptTokens,
      completionTokens: log.completionTokens,
      totalTokens: log.totalTokens,
      latencyMs: log.latencyMs,
      costUsd: new Prisma.Decimal(log.costUsd),
      inputCost: new Prisma.Decimal(log.inputCost),
      outputCost: new Prisma.Decimal(log.outputCost),
      status: log.status,
      executedAt: log.executedAt,
      metadata: log.metadata,
    };
  });

  for (let offset = 0; offset < logsData.length; offset += LOG_BATCH_SIZE) {
    await db.executionLog.createMany({ data: logsData.slice(offset, offset + LOG_BATCH_SIZE) });
  }

  console.log(
    `📊 Seeded ${logsData.length} ExecutionLogs from ${generated.executionLogs[0].executedAt.toISOString().slice(0, 10)} to ${referenceDate.toISOString().slice(0, 10)} across DEV, PRE, and PRO.`
  );
  console.log("✅ Database seeding completed successfully!");
}

async function main() {
  await seedDatabase();
}

if (require.main === module) {
  main()
    .catch((error) => {
      console.error("❌ Error seeding database:", error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
