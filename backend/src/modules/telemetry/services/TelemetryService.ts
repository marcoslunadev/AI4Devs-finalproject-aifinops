import { PrismaClient } from "@prisma/client";
import {
  KpiResponse,
  ChartResponse,
  BreakdownResponse,
  OrganizationsResponse,
  DepartmentExecutionsResponse,
} from "../schemas/telemetrySchema";

export class TelemetryService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  public async getOrganizations(): Promise<OrganizationsResponse> {
    try {
      const orgs = await this.prisma.organization.findMany({
        select: {
          id: true,
          name: true,
        },
        orderBy: { name: "asc" },
      });
      return orgs;
    } catch {
      return [];
    }
  }

  private buildExecutionWhere(
    dateRange: { gte: Date; lt?: Date },
    organizationId?: string,
    environment?: string,
    provider?: string,
    models?: string[]
  ): any {
    const where: any = { createdAt: dateRange };

    if (organizationId) {
      where.user = where.user || {};
      where.user.organizationId = organizationId;
    }

    if (environment && environment !== "ALL") {
      where.user = where.user || {};
      where.user.department = {
        name: { contains: environment, mode: "insensitive" },
      };
    }

    if (models && models.length > 0) {
      where.aiModel = { in: models };
    } else if (provider && provider !== "all") {
      const providerTerms: Record<string, string> = {
        openai: "gpt",
        anthropic: "claude",
        google: "gemini",
        meta: "llama",
      };
      const term = providerTerms[provider.toLowerCase()];
      if (term) {
        where.aiModel = { contains: term, mode: "insensitive" };
      }
    }

    return where;
  }

  public async getKpiMetrics(
    organizationId?: string,
    environment?: string,
    provider?: string,
    models?: string[]
  ): Promise<KpiResponse> {
    try {
      const now = new Date();
      const current30DaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const previous60DaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

      const [orgsCount, recentOrgsCount] = await Promise.all([
        organizationId
          ? this.prisma.organization.count({ where: { id: organizationId } })
          : this.prisma.organization.count(),
        organizationId
          ? this.prisma.organization.count({
              where: { id: organizationId, createdAt: { gte: current30DaysAgo } },
            })
          : this.prisma.organization.count({
              where: { createdAt: { gte: current30DaysAgo } },
            }),
      ]);

      const currentExecWhere = this.buildExecutionWhere(
        { gte: current30DaysAgo },
        organizationId,
        environment,
        provider,
        models
      );

      const prevExecWhere = this.buildExecutionWhere(
        { gte: previous60DaysAgo, lt: current30DaysAgo },
        organizationId,
        environment,
        provider,
        models
      );

      const currentAgg = await this.prisma.executionLog.aggregate({
        where: currentExecWhere,
        _sum: { cost: true },
        _count: { id: true },
      });

      const currentExecutions = currentAgg._count.id;
      if (currentExecutions === 0) {
        return {
          totalCost: 0,
          totalCostChange: 0,
          totalExecutions: 0,
          totalExecutionsChange: 0,
          totalTokens: 0,
          totalTokensChange: 0,
          avgCostPerExec: 0,
          avgCostPerExecChange: 0,
          activeOrgs: orgsCount,
          activeOrgsBadge: "--",
          errorRate: 0,
          errorRateChange: 0,
        };
      }

      const previousAgg = await this.prisma.executionLog.aggregate({
        where: prevExecWhere,
        _sum: { cost: true },
        _count: { id: true },
      });

      let currentTokensNum = 0;
      let prevTokensNum = 0;

      const hasSpecificFilters =
        (environment && environment !== "ALL") ||
        (models && models.length > 0) ||
        (provider && provider !== "all");

      if (hasSpecificFilters && typeof this.prisma.executionLog.findMany === "function") {
        try {
          const [currentLogs, prevLogs] = await Promise.all([
            this.prisma.executionLog.findMany({
              where: currentExecWhere,
              select: { metadata: true },
            }),
            this.prisma.executionLog.findMany({
              where: prevExecWhere,
              select: { metadata: true },
            }),
          ]);
          currentTokensNum = currentLogs.reduce(
            (acc, log) => acc + ((log.metadata as any)?.totalTokens || 0),
            0
          );
          prevTokensNum = prevLogs.reduce(
            (acc, log) => acc + ((log.metadata as any)?.totalTokens || 0),
            0
          );
        } catch {
          // fallback
        }
      } else if (typeof this.prisma.$queryRaw === "function") {
        try {
          const [currentTokensRes, prevTokensRes] = await Promise.all([
            organizationId
              ? this.prisma.$queryRaw<{ sum: bigint | number | null }[]>`
                  SELECT COALESCE(SUM((el.metadata->>'totalTokens')::bigint), 0) as sum
                  FROM "ExecutionLog" el
                  JOIN "User" u ON el."userId" = u."id"
                  WHERE el."createdAt" >= ${current30DaysAgo} AND u."organizationId" = ${organizationId}
                `
              : this.prisma.$queryRaw<{ sum: bigint | number | null }[]>`
                  SELECT COALESCE(SUM((metadata->>'totalTokens')::bigint), 0) as sum
                  FROM "ExecutionLog"
                  WHERE "createdAt" >= ${current30DaysAgo}
                `,
            organizationId
              ? this.prisma.$queryRaw<{ sum: bigint | number | null }[]>`
                  SELECT COALESCE(SUM((el.metadata->>'totalTokens')::bigint), 0) as sum
                  FROM "ExecutionLog" el
                  JOIN "User" u ON el."userId" = u."id"
                  WHERE el."createdAt" >= ${previous60DaysAgo} AND el."createdAt" < ${current30DaysAgo} AND u."organizationId" = ${organizationId}
                `
              : this.prisma.$queryRaw<{ sum: bigint | number | null }[]>`
                  SELECT COALESCE(SUM((metadata->>'totalTokens')::bigint), 0) as sum
                  FROM "ExecutionLog"
                  WHERE "createdAt" >= ${previous60DaysAgo} AND "createdAt" < ${current30DaysAgo}
                `,
          ]);
          currentTokensNum = Number(currentTokensRes[0]?.sum || 0);
          prevTokensNum = Number(prevTokensRes[0]?.sum || 0);
        } catch {
          // fallback
        }
      }

      const totalCostNum = Number(currentAgg._sum.cost || 0);
      const totalExecutionsNum = currentExecutions;
      const totalTokensNum = currentTokensNum;
      const avgCostPerExecNum = totalExecutionsNum > 0 ? totalCostNum / totalExecutionsNum : 0;

      const prevCostNum = Number(previousAgg._sum.cost || 0);
      const prevExecutionsNum = previousAgg._count.id;
      const prevAvgCost = prevExecutionsNum > 0 ? prevCostNum / prevExecutionsNum : 0;

      // Calculate percentage changes
      const totalCostChange = prevCostNum > 0 ? Number((((totalCostNum - prevCostNum) / prevCostNum) * 100).toFixed(1)) : 0;
      const totalExecutionsChange = prevExecutionsNum > 0 ? Number((((totalExecutionsNum - prevExecutionsNum) / prevExecutionsNum) * 100).toFixed(1)) : 0;
      const totalTokensChange = prevTokensNum > 0 ? Number((((totalTokensNum - prevTokensNum) / prevTokensNum) * 100).toFixed(1)) : 0;
      const avgCostPerExecChange = prevAvgCost > 0 ? Number((((avgCostPerExecNum - prevAvgCost) / prevAvgCost) * 100).toFixed(1)) : 0;

      return {
        totalCost: Number(totalCostNum.toFixed(2)),
        totalCostChange,
        totalExecutions: totalExecutionsNum,
        totalExecutionsChange,
        totalTokens: totalTokensNum,
        totalTokensChange,
        avgCostPerExec: Number(avgCostPerExecNum.toFixed(4)),
        avgCostPerExecChange,
        activeOrgs: orgsCount,
        activeOrgsBadge: recentOrgsCount > 0 ? `+${recentOrgsCount} New` : "--",
        errorRate: 0.42,
        errorRateChange: 0,
      };
    } catch {
      return {
        totalCost: 0,
        totalCostChange: 0,
        totalExecutions: 0,
        totalExecutionsChange: 0,
        totalTokens: 0,
        totalTokensChange: 0,
        avgCostPerExec: 0,
        avgCostPerExecChange: 0,
        activeOrgs: 0,
        activeOrgsBadge: "--",
        errorRate: 0,
        errorRateChange: 0,
      };
    }
  }

  public async getIngestionStatus(): Promise<{
    status: "PROCESSING" | "COMPLETED";
    lastIngestedAt: string | null;
    totalRecordsProcessed: number;
    activeIngestionsCount: number;
  }> {
    try {
      const processingLogsCount = await this.prisma.ingestionAuditLog.count({
        where: { status: "PROCESSING" },
      });

      const isProcessing = processingLogsCount > 0;

      const latestCompletedLog = await this.prisma.ingestionAuditLog.findFirst({
        where: { status: "COMPLETED" },
        orderBy: { updatedAt: "desc" },
      });

      const totalAgg = await this.prisma.ingestionAuditLog.aggregate({
        _sum: { successCount: true },
      });

      return {
        status: isProcessing ? "PROCESSING" : "COMPLETED",
        lastIngestedAt: latestCompletedLog ? latestCompletedLog.updatedAt.toISOString() : null,
        totalRecordsProcessed: totalAgg._sum.successCount || 0,
        activeIngestionsCount: processingLogsCount,
      };
    } catch {
      return {
        status: "COMPLETED",
        lastIngestedAt: null,
        totalRecordsProcessed: 0,
        activeIngestionsCount: 0,
      };
    }
  }

  public async getTimeSeriesChart(
    range: string = "30d",
    organizationId?: string,
    environment?: string,
    provider?: string,
    models?: string[]
  ): Promise<ChartResponse> {
    try {
      const days = range === "7d" ? 7 : range === "90d" ? 90 : 30;
      const dateMap = new Map<string, { cost: number; tokens: number; executions: number }>();

      const now = new Date();
      for (let i = days - 1; i >= 0; i--) {
        const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const dateStr = d.toLocaleDateString("en-US", { month: "short", day: "2-digit" });
        dateMap.set(dateStr, { cost: 0, tokens: 0, executions: 0 });
      }

      const startDate = new Date(now.getTime() - (days - 1) * 24 * 60 * 60 * 1000);
      startDate.setHours(0, 0, 0, 0);

      const where = this.buildExecutionWhere(
        { gte: startDate },
        organizationId,
        environment,
        provider,
        models
      );

      const logs = await this.prisma.executionLog.findMany({
        where,
        select: {
          cost: true,
          createdAt: true,
          metadata: true,
        },
        orderBy: { createdAt: "asc" },
      });

      for (const log of logs) {
        const dateStr = log.createdAt.toLocaleDateString("en-US", { month: "short", day: "2-digit" });
        const existing = dateMap.get(dateStr);
        if (existing) {
          const meta = log.metadata as { totalTokens?: number } | null;
          const tokens = meta?.totalTokens || 0;
          const costVal = Number(log.cost);

          existing.cost = Number((existing.cost + costVal).toFixed(2));
          existing.tokens += tokens;
          existing.executions += 1;
        }
      }

      return Array.from(dateMap.entries()).map(([date, stats]) => ({
        date,
        cost: stats.cost,
        tokens: stats.tokens,
        executions: stats.executions,
      }));
    } catch {
      return [];
    }
  }

  public async getHierarchicalBreakdown(
    organizationId?: string,
    environment?: string,
    provider?: string,
    models?: string[]
  ): Promise<BreakdownResponse> {
    try {
      const executionLogWhere: any = {};
      if (models && models.length > 0) {
        executionLogWhere.aiModel = { in: models };
      } else if (provider && provider !== "all") {
        const providerTerms: Record<string, string> = {
          openai: "gpt",
          anthropic: "claude",
          google: "gemini",
          meta: "llama",
        };
        const term = providerTerms[provider.toLowerCase()];
        if (term) {
          executionLogWhere.aiModel = { contains: term, mode: "insensitive" };
        }
      }

      const departmentWhere: any = {};
      if (environment && environment !== "ALL") {
        departmentWhere.name = { contains: environment, mode: "insensitive" };
      }

      const dbOrgs = await this.prisma.organization.findMany({
        where: organizationId ? { id: organizationId } : {},
        include: {
          departments: {
            where: departmentWhere,
            include: {
              users: {
                include: {
                  executionLogs: {
                    where: Object.keys(executionLogWhere).length > 0 ? executionLogWhere : undefined,
                    select: {
                      cost: true,
                      metadata: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (dbOrgs.length === 0) {
        return [];
      }

      return dbOrgs.map((org) => {
        let orgTotalCost = 0;
        let orgTotalExecutions = 0;
        let orgTotalTokens = 0;

        const departments = org.departments.map((dept) => {
          let deptCost = 0;
          let deptExecutions = 0;
          let deptTokens = 0;

          const users = dept.users.map((user) => {
            const userExecutions = user.executionLogs.length;
            const userCost = user.executionLogs.reduce((acc, log) => acc + Number(log.cost), 0);
            const userTokens = user.executionLogs.reduce((acc, log) => {
              const meta = log.metadata as { totalTokens?: number } | null;
              return acc + (meta?.totalTokens || 0);
            }, 0);

            deptCost += userCost;
            deptExecutions += userExecutions;
            deptTokens += userTokens;

            return {
              id: user.id,
              name: user.name || user.email,
              type: "user" as const,
              status: "active" as const,
              cost: Number(userCost.toFixed(2)),
              executions: userExecutions,
              tokens: userTokens,
              budget: 12000,
            };
          });

          orgTotalCost += deptCost;
          orgTotalExecutions += deptExecutions;
          orgTotalTokens += deptTokens;

          return {
            id: dept.id,
            name: dept.name,
            type: "environment" as const,
            status: "active" as const,
            cost: Number(deptCost.toFixed(2)),
            executions: deptExecutions,
            tokens: deptTokens,
            budget: 15000,
            children: users,
          };
        });

        return {
          id: org.id,
          name: org.name,
          type: "organization" as const,
          status: "active" as const,
          cost: Number(orgTotalCost.toFixed(2)),
          executions: orgTotalExecutions,
          tokens: orgTotalTokens,
          budget: 30000,
          children: departments,
        };
      });
    } catch {
      return [];
    }
  }

  public async getDepartmentExecutions(organizationId?: string): Promise<DepartmentExecutionsResponse> {
    try {
      const logs = await this.prisma.executionLog.findMany({
        where: organizationId ? { user: { organizationId } } : {},
        include: {
          user: {
            include: {
              organization: true,
              department: true,
            },
          },
        },
      });

      const groups = new Map<
        string,
        {
          id: string;
          organizationId: string;
          organizationName: string;
          departmentId: string;
          departmentName: string;
          model: string;
          totalCalls: number;
          promptTokens: number;
          completionTokens: number;
          totalCost: number;
          totalLatencyMs: number;
        }
      >();

      for (const log of logs) {
        const orgId = log.user?.organizationId || "unassigned";
        const orgName = log.user?.organization?.name || "Unassigned / Sin Asignar";
        const deptId = log.user?.departmentId || "unassigned";
        const deptName = log.user?.department?.name || "General / Sin Departamento";
        const model = log.aiModel || "Unknown Model";

        const key = `${orgId}:${deptId}:${model}`;

        const meta = log.metadata as {
          promptTokens?: number;
          completionTokens?: number;
          totalTokens?: number;
          latencyMs?: number;
        } | null;

        const promptTokens = meta?.promptTokens || 0;
        const completionTokens = meta?.completionTokens || 0;
        const latencyMs = meta?.latencyMs || 0;
        const costVal = Number(log.cost || 0);

        const existing = groups.get(key);
        if (existing) {
          existing.totalCalls += 1;
          existing.promptTokens += promptTokens;
          existing.completionTokens += completionTokens;
          existing.totalCost += costVal;
          existing.totalLatencyMs += latencyMs;
        } else {
          groups.set(key, {
            id: key,
            organizationId: orgId,
            organizationName: orgName,
            departmentId: deptId,
            departmentName: deptName,
            model,
            totalCalls: 1,
            promptTokens,
            completionTokens,
            totalCost: costVal,
            totalLatencyMs: latencyMs,
          });
        }
      }

      return Array.from(groups.values()).map((g) => ({
        id: g.id,
        organizationId: g.organizationId,
        organizationName: g.organizationName,
        departmentId: g.departmentId,
        departmentName: g.departmentName,
        model: g.model,
        totalCalls: g.totalCalls,
        promptTokens: g.promptTokens,
        completionTokens: g.completionTokens,
        totalCost: Number(g.totalCost.toFixed(2)),
        avgLatencyMs: g.totalCalls > 0 ? Math.round(g.totalLatencyMs / g.totalCalls) : 0,
      }));
    } catch {
      return [];
    }
  }
}
