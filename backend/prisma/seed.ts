import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting Database Seeding for AIFinOps Telemetry...");

  // Clean existing data in order of foreign key constraints
  await prisma.executionLog.deleteMany();
  await prisma.user.deleteMany();
  await prisma.department.deleteMany();
  await prisma.organization.deleteMany();
  await prisma.ingestionAuditLog.deleteMany();

  console.log("🧹 Cleaned existing database records.");

  // 1. Create Organizations
  const orgVass = await prisma.organization.create({
    data: {
      name: "VASS Global Tech",
    },
  });

  const orgBanking = await prisma.organization.create({
    data: {
      name: "Banking Solutions Division",
    },
  });

  const orgRetail = await prisma.organization.create({
    data: {
      name: "Retail & E-Commerce AI",
    },
  });

  console.log("🏢 Created Organizations.");

  // 2. Create Departments / Environments
  const deptVassProd = await prisma.department.create({
    data: { name: "PROD - Production Env", organizationId: orgVass.id },
  });

  const deptVassPre = await prisma.department.create({
    data: { name: "PRE - Staging & Testing", organizationId: orgVass.id },
  });

  const deptVassDev = await prisma.department.create({
    data: { name: "DEV - R&D Sandbox", organizationId: orgVass.id },
  });

  const deptBankingProd = await prisma.department.create({
    data: { name: "PROD - Core Banking AI", organizationId: orgBanking.id },
  });

  const deptBankingDev = await prisma.department.create({
    data: { name: "DEV - Credit Risk Sandbox", organizationId: orgBanking.id },
  });

  const deptRetailProd = await prisma.department.create({
    data: { name: "PROD - Recommendation Engine", organizationId: orgRetail.id },
  });

  console.log("🏬 Created Departments.");

  // 3. Create Users / AI Agents
  const usersData = [
    {
      name: "Customer Support Assistant (GPT-4o)",
      email: "agent-support@vass.com",
      organizationId: orgVass.id,
      departmentId: deptVassProd.id,
    },
    {
      name: "Code Copilot Enterprise (Claude 3.5)",
      email: "copilot@vass.com",
      organizationId: orgVass.id,
      departmentId: deptVassProd.id,
    },
    {
      name: "QA Automated Testing Pipeline",
      email: "qa-pipeline@vass.com",
      organizationId: orgVass.id,
      departmentId: deptVassPre.id,
    },
    {
      name: "Innovation Lab Playground",
      email: "lab-dev@vass.com",
      organizationId: orgVass.id,
      departmentId: deptVassDev.id,
    },
    {
      name: "Fraud Detection Neural Agent",
      email: "fraud-ai@banking.com",
      organizationId: orgBanking.id,
      departmentId: deptBankingProd.id,
    },
    {
      name: "Credit Risk Sandbox Model",
      email: "risk-dev@banking.com",
      organizationId: orgBanking.id,
      departmentId: deptBankingDev.id,
    },
    {
      name: "Product Recommender Engine",
      email: "recommender@retail.com",
      organizationId: orgRetail.id,
      departmentId: deptRetailProd.id,
    },
  ];

  const createdUsers = [];
  for (const u of usersData) {
    const user = await prisma.user.create({ data: u });
    createdUsers.push(user);
  }

  console.log("👥 Created Users / Agents.");

  // 4. Generate random ExecutionLogs for the last 90 days (~600 logs)
  const aiModels = [
    { name: "gpt-4o", inputRate: 0.005, outputRate: 0.015 },
    { name: "gpt-4o-mini", inputRate: 0.00015, outputRate: 0.0006 },
    { name: "claude-3-5-sonnet", inputRate: 0.003, outputRate: 0.015 },
    { name: "gemini-1.5-pro", inputRate: 0.00125, outputRate: 0.005 },
  ];

  const logsToInsert = [];
  const now = Date.now();
  const ninetyDaysMs = 90 * 24 * 60 * 60 * 1000;

  for (let i = 0; i < 650; i++) {
    const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
    const model = aiModels[Math.floor(Math.random() * aiModels.length)];

    // Random timestamp within last 90 days
    const randomTime = new Date(now - Math.random() * ninetyDaysMs);

    const promptTokens = Math.floor(200 + Math.random() * 4000);
    const completionTokens = Math.floor(50 + Math.random() * 2000);
    const totalTokens = promptTokens + completionTokens;

    const inputCost = (promptTokens / 1000) * model.inputRate;
    const outputCost = (completionTokens / 1000) * model.outputRate;
    const totalCost = inputCost + outputCost;

    logsToInsert.push({
      userId: randomUser.id,
      aiModel: model.name,
      cost: totalCost,
      inputCost: inputCost,
      outputCost: outputCost,
      createdAt: randomTime,
      metadata: {
        promptTokens,
        completionTokens,
        totalTokens,
        latencyMs: Math.floor(120 + Math.random() * 1500),
      },
    });
  }

  await prisma.executionLog.createMany({
    data: logsToInsert,
  });

  console.log(`🚀 Successfully inserted ${logsToInsert.length} ExecutionLog entries.`);
  console.log("✅ Database Seeding Completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
