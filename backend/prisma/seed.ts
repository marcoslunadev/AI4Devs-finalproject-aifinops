import { PrismaClient, Role, Environment, ExecutionStatus, BatchStatus, Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting Database Seeding for AIFinOps...");

  // 1. Limpieza en orden relacional
  await prisma.executionLog.deleteMany();
  await prisma.ingestionBatch.deleteMany();
  await prisma.aiAgent.deleteMany();
  await prisma.user.deleteMany();
  await prisma.department.deleteMany();
  await prisma.organization.deleteMany();
  await prisma.modelPrice.deleteMany();

  console.log("🧹 Cleaned existing database records.");

  // 2. Catálogo de Tarifas en ModelPrice (precios por cada 1K tokens)
  const modelPricesData = [
    {
      provider: "OPENAI",
      model: "gpt-4o",
      promptPricePer1k: new Prisma.Decimal("0.005000"),
      completionPricePer1k: new Prisma.Decimal("0.015000"),
      isActive: true,
    },
    {
      provider: "OPENAI",
      model: "gpt-4o-mini",
      promptPricePer1k: new Prisma.Decimal("0.000150"),
      completionPricePer1k: new Prisma.Decimal("0.000600"),
      isActive: true,
    },
    {
      provider: "ANTHROPIC",
      model: "claude-3-5-sonnet",
      promptPricePer1k: new Prisma.Decimal("0.003000"),
      completionPricePer1k: new Prisma.Decimal("0.015000"),
      isActive: true,
    },
    {
      provider: "GEMINI",
      model: "gemini-1.5-pro",
      promptPricePer1k: new Prisma.Decimal("0.001250"),
      completionPricePer1k: new Prisma.Decimal("0.005000"),
      isActive: true,
    },
    {
      provider: "GEMINI",
      model: "gemini-1.5-flash",
      promptPricePer1k: new Prisma.Decimal("0.000075"),
      completionPricePer1k: new Prisma.Decimal("0.000300"),
      isActive: true,
    },
  ];

  for (const mp of modelPricesData) {
    await prisma.modelPrice.create({ data: mp });
  }
  console.log("💵 Seeded ModelPrice catalog.");

  // 3. Crear Organización y Departamentos
  const acmeOrg = await prisma.organization.create({
    data: { name: "Acme Corporation" },
  });

  const engDept = await prisma.department.create({
    data: { name: "Core Engineering", organizationId: acmeOrg.id },
  });

  const opsDept = await prisma.department.create({
    data: { name: "Customer Operations", organizationId: acmeOrg.id },
  });

  const aiDept = await prisma.department.create({
    data: { name: "Data & AI Innovation", organizationId: acmeOrg.id },
  });

  console.log("🏢 Seeded Organizations and Departments.");

  // 4. Crear Usuarios con hash bcrypt
  const salt = await bcrypt.genSalt(10);
  const masterAdminPassword = await bcrypt.hash("Admin_M4rc0s", salt);
  const masterViewerPassword = await bcrypt.hash("Viewer_M4rc0s", salt);
  const legacyAdminPassword = await bcrypt.hash("admin123", salt);
  const legacyViewerPassword = await bcrypt.hash("viewer123", salt);

  // Usuarios Maestros solicitados
  const masterAdminUser = await prisma.user.create({
    data: {
      name: "admin",
      email: "admin@aifinops.com",
      passwordHash: masterAdminPassword,
      role: Role.ADMIN,
      organizationId: acmeOrg.id,
      departmentId: engDept.id,
    },
  });

  const masterViewerUser = await prisma.user.create({
    data: {
      name: "viewer",
      email: "viewer@aifinops.com",
      passwordHash: masterViewerPassword,
      role: Role.FINOPS_VIEWER,
      organizationId: acmeOrg.id,
      departmentId: opsDept.id,
    },
  });

  // Usuarios adicionales para pruebas y retrocompatibilidad
  const adminUser = await prisma.user.create({
    data: {
      name: "Admin FinOps",
      email: "admin@acme.com",
      passwordHash: legacyAdminPassword,
      role: Role.ADMIN,
      organizationId: acmeOrg.id,
      departmentId: engDept.id,
    },
  });

  const finopsUser = await prisma.user.create({
    data: {
      name: "Auditor FinOps",
      email: "finops@acme.com",
      passwordHash: legacyViewerPassword,
      role: Role.FINOPS_VIEWER,
      organizationId: acmeOrg.id,
      departmentId: opsDept.id,
    },
  });

  const devUser = await prisma.user.create({
    data: {
      name: "Developer Acme",
      email: "dev.user@acme.com",
      passwordHash: legacyViewerPassword,
      role: Role.FINOPS_VIEWER,
      organizationId: acmeOrg.id,
      departmentId: engDept.id,
    },
  });

  const aiEngUser = await prisma.user.create({
    data: {
      name: "AI Engineer",
      email: "ai.engineer@acme.com",
      passwordHash: legacyViewerPassword,
      role: Role.FINOPS_VIEWER,
      organizationId: acmeOrg.id,
      departmentId: aiDept.id,
    },
  });

  console.log("👥 Seeded Master Users (admin/Admin_M4rc0s, viewer/Viewer_M4rc0s) and test users.");

  // 5. Crear Agentes de IA
  const copilotAgent = await prisma.aiAgent.create({
    data: {
      id: "agent_cm4918239",
      name: "Code Copilot Pro",
      description: "Asistente inteligente de desarrollo de software",
      organizationId: acmeOrg.id,
      departmentId: engDept.id,
      status: "ACTIVE",
    },
  });

  const supportAgent = await prisma.aiAgent.create({
    data: {
      id: "agent_support_01",
      name: "Customer Care Bot",
      description: "Agente conversacional de atención a clientes 24/7",
      organizationId: acmeOrg.id,
      departmentId: opsDept.id,
      status: "ACTIVE",
    },
  });

  const fraudAgent = await prisma.aiAgent.create({
    data: {
      id: "agent_fraud_02",
      name: "Risk & Fraud Analyzer",
      description: "Agente de detección de anomalías y transacciones sospechosas",
      organizationId: acmeOrg.id,
      departmentId: aiDept.id,
      status: "ACTIVE",
    },
  });

  console.log("🤖 Seeded AI Agents.");

  // 6. Crear IngestionBatch inicial
  const seedBatch = await prisma.ingestionBatch.create({
    data: {
      fileName: "telemetry_seed_history_90d.jsonl",
      fileSizeBytes: 145020,
      totalRecords: 700,
      processedRecords: 695,
      failedRecords: 5,
      errorSummary: "5 registros descartados por formato inválido o timeout de proveedor.",
      status: BatchStatus.COMPLETED,
    },
  });

  // 7. Generar registros de ejecución realistas de los últimos 90 días
  const users = [masterAdminUser, masterViewerUser, adminUser, finopsUser, devUser, aiEngUser];
  const agents = [copilotAgent, supportAgent, fraudAgent];
  const environments: Environment[] = [Environment.DEV, Environment.PRE, Environment.PRO];
  const statuses: ExecutionStatus[] = [
    ExecutionStatus.SUCCESS,
    ExecutionStatus.SUCCESS,
    ExecutionStatus.SUCCESS,
    ExecutionStatus.SUCCESS,
    ExecutionStatus.ERROR,
    ExecutionStatus.TIMEOUT,
  ];

  const now = Date.now();
  const ninetyDaysMs = 90 * 24 * 60 * 60 * 1000;

  const logsData = [];

  for (let i = 0; i < 700; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    const agent = agents[Math.floor(Math.random() * agents.length)];
    const priceConfig = modelPricesData[Math.floor(Math.random() * modelPricesData.length)];
    const env = environments[Math.floor(Math.random() * environments.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    const promptTokens = Math.floor(150 + Math.random() * 3500);
    const completionTokens = Math.floor(50 + Math.random() * 1500);
    const totalTokens = promptTokens + completionTokens;

    // Cálculo financiero determinista:
    // cost = (promptTokens * promptPrice / 1000) + (completionTokens * completionPrice / 1000)
    const promptPriceNum = Number(priceConfig.promptPricePer1k.toString());
    const completionPriceNum = Number(priceConfig.completionPricePer1k.toString());

    const inputCostNum = (promptTokens * promptPriceNum) / 1000;
    const outputCostNum = (completionTokens * completionPriceNum) / 1000;
    const totalCostNum = inputCostNum + outputCostNum;

    const inputCost = new Prisma.Decimal(inputCostNum.toFixed(6));
    const outputCost = new Prisma.Decimal(outputCostNum.toFixed(6));
    const costUsd = new Prisma.Decimal(totalCostNum.toFixed(6));

    const latencyMs = Math.floor(100 + Math.random() * 1800);
    const executedAt = new Date(now - Math.random() * ninetyDaysMs);

    logsData.push({
      userId: user.id,
      agentId: agent.id,
      batchId: seedBatch.id,
      environment: env,
      provider: priceConfig.provider,
      model: priceConfig.model,
      promptTokens,
      completionTokens,
      totalTokens,
      latencyMs,
      costUsd,
      inputCost,
      outputCost,
      status,
      executedAt,
      metadata: {
        sessionId: `sess_${Math.random().toString(36).substring(7)}`,
        temperature: 0.7,
      },
    });
  }

  // Insertar en bloques para mejor rendimiento
  await prisma.executionLog.createMany({
    data: logsData,
  });

  console.log(`📊 Seeded ${logsData.length} ExecutionLogs spanning 90 days across DEV, PRE, and PRO.`);
  console.log("✅ Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
