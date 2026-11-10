import { Environment, ExecutionStatus, Prisma, Role } from "@prisma/client";

export const SEED_WINDOW_DAYS = 90;
export const SEED_EXECUTION_COUNT = 1080;
// Keep development telemetry high-volume enough to exercise Budget Burn thresholds.
export const SEED_TOKEN_VOLUME_MULTIPLIER = 4000;
export const DEFAULT_SEED = "aifinops-telemetry-90d-v1";
const DAY_MS = 24 * 60 * 60 * 1000;
const MONEY_SCALE = 6;

export type SeedOrganization = {
  key: string;
  name: string;
};

export type SeedDepartment = {
  key: string;
  organizationKey: string;
  name: string;
};

export type SeedUser = {
  key: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  organizationKey: string;
  departmentKey: string;
};

export type SeedAgent = {
  key: string;
  id: string;
  name: string;
  description: string;
  organizationKey: string;
  departmentKey: string;
};

export type SeedModelPrice = {
  key: string;
  provider: string;
  model: string;
  promptPricePer1k: string;
  completionPricePer1k: string;
};

export type SeedBatch = {
  key: string;
  fileName: string;
  fileSizeBytes: number;
  status: "COMPLETED";
};

export type SeedCatalog = {
  organizations: SeedOrganization[];
  departments: SeedDepartment[];
  users: SeedUser[];
  agents: SeedAgent[];
  modelPrices: SeedModelPrice[];
  batches: SeedBatch[];
};

export type GeneratedExecutionLog = {
  userKey: string;
  agentKey: string;
  batchKey: string;
  environment: Environment;
  provider: string;
  model: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  latencyMs: number;
  costUsd: string;
  inputCost: string;
  outputCost: string;
  status: ExecutionStatus;
  executedAt: Date;
  metadata: {
    sessionId: string;
    temperature: number;
    profile: "baseline" | "weighted";
  };
};

export type GeneratedSeedData = {
  referenceDate: Date;
  catalog: SeedCatalog;
  executionLogs: GeneratedExecutionLog[];
};

export const seedCatalog: SeedCatalog = {
  organizations: [
    { key: "acme", name: "Acme Corporation" },
    { key: "northstar", name: "Northstar Analytics" },
  ],
  departments: [
    { key: "acme-engineering", organizationKey: "acme", name: "Core Engineering" },
    { key: "acme-operations", organizationKey: "acme", name: "Customer Operations" },
    { key: "acme-ai", organizationKey: "acme", name: "Data & AI Innovation" },
    { key: "northstar-platform", organizationKey: "northstar", name: "Platform Engineering" },
    { key: "northstar-support", organizationKey: "northstar", name: "Customer Intelligence" },
  ],
  users: [
    {
      key: "master-admin",
      name: "admin",
      email: "admin@aifinops.com",
      password: "Admin_M4rc0s",
      role: Role.ADMIN,
      organizationKey: "acme",
      departmentKey: "acme-engineering",
    },
    {
      key: "master-viewer",
      name: "viewer",
      email: "viewer@aifinops.com",
      password: "Viewer_M4rc0s",
      role: Role.FINOPS_VIEWER,
      organizationKey: "acme",
      departmentKey: "acme-operations",
    },
    {
      key: "legacy-admin",
      name: "Admin FinOps",
      email: "admin@acme.com",
      password: "admin123",
      role: Role.ADMIN,
      organizationKey: "acme",
      departmentKey: "acme-engineering",
    },
    {
      key: "legacy-viewer",
      name: "Auditor FinOps",
      email: "finops@acme.com",
      password: "viewer123",
      role: Role.FINOPS_VIEWER,
      organizationKey: "acme",
      departmentKey: "acme-operations",
    },
    {
      key: "acme-developer",
      name: "Developer Acme",
      email: "dev.user@acme.com",
      password: "viewer123",
      role: Role.FINOPS_VIEWER,
      organizationKey: "acme",
      departmentKey: "acme-engineering",
    },
    {
      key: "acme-ai-engineer",
      name: "AI Engineer",
      email: "ai.engineer@acme.com",
      password: "viewer123",
      role: Role.FINOPS_VIEWER,
      organizationKey: "acme",
      departmentKey: "acme-ai",
    },
    {
      key: "northstar-admin",
      name: "Northstar Platform Admin",
      email: "platform.admin@northstar.example",
      password: "viewer123",
      role: Role.ADMIN,
      organizationKey: "northstar",
      departmentKey: "northstar-platform",
    },
    {
      key: "northstar-analyst",
      name: "Northstar Analyst",
      email: "analyst@northstar.example",
      password: "viewer123",
      role: Role.FINOPS_VIEWER,
      organizationKey: "northstar",
      departmentKey: "northstar-support",
    },
    {
      key: "northstar-engineer",
      name: "Northstar Data Engineer",
      email: "data.engineer@northstar.example",
      password: "viewer123",
      role: Role.FINOPS_VIEWER,
      organizationKey: "northstar",
      departmentKey: "northstar-platform",
    },
  ],
  agents: [
    {
      key: "copilot",
      id: "agent_cm4918239",
      name: "Code Copilot Pro",
      description: "Asistente inteligente de desarrollo de software",
      organizationKey: "acme",
      departmentKey: "acme-engineering",
    },
    {
      key: "support",
      id: "agent_support_01",
      name: "Customer Care Bot",
      description: "Agente conversacional de atención a clientes 24/7",
      organizationKey: "acme",
      departmentKey: "acme-operations",
    },
    {
      key: "fraud",
      id: "agent_fraud_02",
      name: "Risk & Fraud Analyzer",
      description: "Agente de detección de anomalías y transacciones sospechosas",
      organizationKey: "acme",
      departmentKey: "acme-ai",
    },
    {
      key: "forecasting",
      id: "agent_forecast_03",
      name: "Demand Forecasting Analyst",
      description: "Agente de predicción de demanda y capacidad operativa",
      organizationKey: "northstar",
      departmentKey: "northstar-platform",
    },
    {
      key: "insights",
      id: "agent_insights_04",
      name: "Customer Insights Bot",
      description: "Agente de síntesis de feedback y señales de clientes",
      organizationKey: "northstar",
      departmentKey: "northstar-support",
    },
  ],
  modelPrices: [
    {
      key: "openai-gpt-4o",
      provider: "OPENAI",
      model: "gpt-4o",
      promptPricePer1k: "0.005000",
      completionPricePer1k: "0.015000",
    },
    {
      key: "openai-gpt-4o-mini",
      provider: "OPENAI",
      model: "gpt-4o-mini",
      promptPricePer1k: "0.000150",
      completionPricePer1k: "0.000600",
    },
    {
      key: "anthropic-claude-35-sonnet",
      provider: "ANTHROPIC",
      model: "claude-3-5-sonnet",
      promptPricePer1k: "0.003000",
      completionPricePer1k: "0.015000",
    },
    {
      key: "gemini-15-pro",
      provider: "GEMINI",
      model: "gemini-1.5-pro",
      promptPricePer1k: "0.001250",
      completionPricePer1k: "0.005000",
    },
    {
      key: "gemini-15-flash",
      provider: "GEMINI",
      model: "gemini-1.5-flash",
      promptPricePer1k: "0.000075",
      completionPricePer1k: "0.000300",
    },
  ],
  batches: [
    {
      key: "history-90d",
      fileName: "telemetry_seed_history_90d.jsonl",
      fileSizeBytes: 245000,
      status: "COMPLETED",
    },
  ],
};

type Weighted<T> = { value: T; weight: number };

function hashSeed(seed: string): number {
  let hash = 2166136261;
  for (const character of seed) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function createSeededRandom(seed: string | number): () => number {
  let state = hashSeed(String(seed)) || 1;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

export function normalizeReferenceDate(referenceDate: Date): Date {
  if (Number.isNaN(referenceDate.getTime())) {
    throw new Error("Seed reference date must be a valid date.");
  }

  return new Date(
    Date.UTC(referenceDate.getUTCFullYear(), referenceDate.getUTCMonth(), referenceDate.getUTCDate())
  );
}

function weightedPick<T>(items: Weighted<T>[], random: () => number): T {
  const totalWeight = items.reduce((total, item) => total + item.weight, 0);
  let threshold = random() * totalWeight;

  for (const item of items) {
    threshold -= item.weight;
    if (threshold < 0) return item.value;
  }

  return items[items.length - 1].value;
}

function pick<T>(items: T[], random: () => number): T {
  return items[Math.floor(random() * items.length)];
}

function dateForDay(startDate: Date, dayIndex: number, random: () => number): Date {
  const dayStart = startDate.getTime() + dayIndex * DAY_MS;
  return new Date(dayStart + Math.floor(random() * (DAY_MS - 1)));
}

function calculateCosts(
  promptTokens: number,
  completionTokens: number,
  price: SeedModelPrice
): { inputCost: string; outputCost: string; costUsd: string } {
  const inputCost = new Prisma.Decimal(promptTokens)
    .mul(new Prisma.Decimal(price.promptPricePer1k))
    .div(1000)
    .toDecimalPlaces(MONEY_SCALE);
  const outputCost = new Prisma.Decimal(completionTokens)
    .mul(new Prisma.Decimal(price.completionPricePer1k))
    .div(1000)
    .toDecimalPlaces(MONEY_SCALE);
  const costUsd = inputCost.plus(outputCost).toDecimalPlaces(MONEY_SCALE);

  return {
    inputCost: inputCost.toFixed(MONEY_SCALE),
    outputCost: outputCost.toFixed(MONEY_SCALE),
    costUsd: costUsd.toFixed(MONEY_SCALE),
  };
}

function buildLog(
  index: number,
  profile: "baseline" | "weighted",
  user: SeedUser,
  agent: SeedAgent,
  price: SeedModelPrice,
  environment: Environment,
  status: ExecutionStatus,
  executedAt: Date,
  random: () => number
): GeneratedExecutionLog {
  const promptTokens = Math.floor(
    (250 + random() * (price.model.includes("mini") || price.model.includes("flash") ? 2200 : 4800)) *
      SEED_TOKEN_VOLUME_MULTIPLIER
  );
  const completionTokens = Math.floor(
    (80 + random() * (price.model.includes("mini") || price.model.includes("flash") ? 900 : 1900)) *
      SEED_TOKEN_VOLUME_MULTIPLIER
  );
  const costs = calculateCosts(promptTokens, completionTokens, price);

  return {
    userKey: user.key,
    agentKey: agent.key,
    batchKey: "history-90d",
    environment,
    provider: price.provider,
    model: price.model,
    promptTokens,
    completionTokens,
    totalTokens: promptTokens + completionTokens,
    latencyMs: Math.floor(120 + random() * 2900),
    ...costs,
    status,
    executedAt,
    metadata: {
      sessionId: `sess_${String(index + 1).padStart(4, "0")}`,
      temperature: status === ExecutionStatus.SUCCESS ? 0.7 : 0.2,
      profile,
    },
  };
}

export function generateSeedData(
  referenceDate: Date = new Date(),
  seed: string | number = DEFAULT_SEED,
  catalog: SeedCatalog = seedCatalog
): GeneratedSeedData {
  const normalizedReferenceDate = normalizeReferenceDate(referenceDate);
  const startDate = new Date(normalizedReferenceDate.getTime() - (SEED_WINDOW_DAYS - 1) * DAY_MS);
  const random = createSeededRandom(`${seed}:${normalizedReferenceDate.toISOString()}`);
  const logs: GeneratedExecutionLog[] = [];
  const departmentsByOrganization = new Map<string, SeedDepartment[]>();
  const usersByDepartment = new Map<string, SeedUser[]>();
  const agentsByOrganization = new Map<string, SeedAgent[]>();

  for (const department of catalog.departments) {
    const departments = departmentsByOrganization.get(department.organizationKey) ?? [];
    departments.push(department);
    departmentsByOrganization.set(department.organizationKey, departments);
  }
  for (const user of catalog.users) {
    const users = usersByDepartment.get(user.departmentKey) ?? [];
    users.push(user);
    usersByDepartment.set(user.departmentKey, users);
  }
  for (const agent of catalog.agents) {
    const agents = agentsByOrganization.get(agent.organizationKey) ?? [];
    agents.push(agent);
    agentsByOrganization.set(agent.organizationKey, agents);
  }

  const environments: Environment[] = [Environment.DEV, Environment.PRE, Environment.PRO];
  const statuses: ExecutionStatus[] = [
    ExecutionStatus.SUCCESS,
    ExecutionStatus.ERROR,
    ExecutionStatus.TIMEOUT,
    ExecutionStatus.RATE_LIMIT_EXCEEDED,
  ];

  for (let dayIndex = 0; dayIndex < SEED_WINDOW_DAYS; dayIndex += 1) {
    const organization = catalog.organizations[dayIndex % catalog.organizations.length];
    const departments = departmentsByOrganization.get(organization.key) ?? [];
    const department = departments[dayIndex % departments.length];
    const users = usersByDepartment.get(department.key) ?? [];
    const agents = agentsByOrganization.get(organization.key) ?? [];
    const user = users[dayIndex % users.length];
    const agent = agents[dayIndex % agents.length];
    const price = catalog.modelPrices[dayIndex % catalog.modelPrices.length];

    logs.push(
      buildLog(
        logs.length,
        "baseline",
        user,
        agent,
        price,
        environments[dayIndex % environments.length],
        statuses[dayIndex % statuses.length],
        dateForDay(startDate, dayIndex, random),
        random
      )
    );
  }

  const organizationWeights: Weighted<SeedOrganization>[] = [
    { value: catalog.organizations[0], weight: 7 },
    { value: catalog.organizations[1], weight: 3 },
  ];
  const environmentWeights: Weighted<Environment>[] = [
    { value: Environment.DEV, weight: 5 },
    { value: Environment.PRE, weight: 3 },
    { value: Environment.PRO, weight: 2 },
  ];
  const statusWeights: Weighted<ExecutionStatus>[] = [
    { value: ExecutionStatus.SUCCESS, weight: 78 },
    { value: ExecutionStatus.ERROR, weight: 10 },
    { value: ExecutionStatus.TIMEOUT, weight: 8 },
    { value: ExecutionStatus.RATE_LIMIT_EXCEEDED, weight: 4 },
  ];

  while (logs.length < SEED_EXECUTION_COUNT) {
    const organization = weightedPick(organizationWeights, random);
    const departments = departmentsByOrganization.get(organization.key) ?? [];
    const department = weightedPick(
      departments.map((value, index) => ({ value, weight: index === 0 ? 5 : 2 })),
      random
    );
    const users = usersByDepartment.get(department.key) ?? [];
    const agents = agentsByOrganization.get(organization.key) ?? [];
    const user = pick(users, random);
    const agent = weightedPick(
      agents.map((value, index) => ({ value, weight: index === 0 ? 5 : 2 })),
      random
    );
    const price = weightedPick(
      catalog.modelPrices.map((value, index) => ({ value, weight: index === 0 ? 4 : index === 1 ? 3 : 2 })),
      random
    );
    const dayIndex = Math.floor(random() * SEED_WINDOW_DAYS);

    logs.push(
      buildLog(
        logs.length,
        "weighted",
        user,
        agent,
        price,
        weightedPick(environmentWeights, random),
        weightedPick(statusWeights, random),
        dateForDay(startDate, dayIndex, random),
        random
      )
    );
  }

  return {
    referenceDate: normalizedReferenceDate,
    catalog,
    executionLogs: logs,
  };
}

export function validateSeedData(data: GeneratedSeedData): void {
  if (data.executionLogs.length < 1000) {
    throw new Error(`Seed requires at least 1000 execution logs; received ${data.executionLogs.length}.`);
  }

  const expectedDays = new Set<string>();
  const startDate = new Date(data.referenceDate.getTime() - (SEED_WINDOW_DAYS - 1) * DAY_MS);
  for (let index = 0; index < SEED_WINDOW_DAYS; index += 1) {
    expectedDays.add(new Date(startDate.getTime() + index * DAY_MS).toISOString().slice(0, 10));
  }
  const actualDays = new Set(data.executionLogs.map((log) => log.executedAt.toISOString().slice(0, 10)));
  if (expectedDays.size !== actualDays.size || [...expectedDays].some((day) => !actualDays.has(day))) {
    throw new Error("Seed execution logs must cover every UTC calendar day in the 90-day window.");
  }

  const organizationKeys = new Set(data.catalog.organizations.map((organization) => organization.key));
  const departmentKeys = new Set(data.catalog.departments.map((department) => department.key));
  const userKeys = new Set(data.catalog.users.map((user) => user.key));
  const agentKeys = new Set(data.catalog.agents.map((agent) => agent.key));
  const priceKeys = new Set(data.catalog.modelPrices.map((price) => `${price.provider}:${price.model}`));
  const statusSet = new Set<ExecutionStatus>();
  const environmentSet = new Set<Environment>();
  const modelSet = new Set<string>();

  for (const user of data.catalog.users) {
    if (!organizationKeys.has(user.organizationKey) || !departmentKeys.has(user.departmentKey)) {
      throw new Error(`Invalid organization or department reference for user ${user.key}.`);
    }
  }
  for (const agent of data.catalog.agents) {
    if (!organizationKeys.has(agent.organizationKey) || !departmentKeys.has(agent.departmentKey)) {
      throw new Error(`Invalid organization or department reference for agent ${agent.key}.`);
    }
  }
  for (const log of data.executionLogs) {
    if (!userKeys.has(log.userKey) || !agentKeys.has(log.agentKey)) {
      throw new Error("Execution log contains an invalid user or agent reference.");
    }
    if (!priceKeys.has(`${log.provider}:${log.model}`)) {
      throw new Error(`Execution log contains an unknown model price: ${log.provider}/${log.model}.`);
    }
    if (log.totalTokens !== log.promptTokens + log.completionTokens) {
      throw new Error("Execution log token totals are inconsistent.");
    }
    const expectedCost = new Prisma.Decimal(log.inputCost).plus(new Prisma.Decimal(log.outputCost));
    if (!expectedCost.eq(new Prisma.Decimal(log.costUsd))) {
      throw new Error("Execution log cost totals are inconsistent.");
    }
    statusSet.add(log.status);
    environmentSet.add(log.environment);
    modelSet.add(`${log.provider}:${log.model}`);
  }

  if (environmentSet.size !== 3 || statusSet.size < 3 || modelSet.size < 4) {
    throw new Error("Seed execution logs do not contain the required dimensional variety.");
  }
}
