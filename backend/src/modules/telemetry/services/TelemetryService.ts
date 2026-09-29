import { PrismaClient } from "@prisma/client";
import { KpiResponse, ChartResponse, BreakdownResponse } from "../schemas/telemetrySchema";

export class TelemetryService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  public async getKpiMetrics(): Promise<KpiResponse> {
    try {
      const now = new Date();
      const current30DaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const previous60DaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

      const orgsCount = await this.prisma.organization.count();
      const recentOrgsCount = await this.prisma.organization.count({
        where: { createdAt: { gte: current30DaysAgo } },
      });

      // Current 30 days logs
      const currentLogs = await this.prisma.executionLog.findMany({
        where: { createdAt: { gte: current30DaysAgo } },
        select: { cost: true, metadata: true },
      });

      // If no logs present in the DB
      if (currentLogs.length === 0) {
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

      // Previous 30 days logs (30d - 60d ago)
      const previousLogs = await this.prisma.executionLog.findMany({
        where: { createdAt: { gte: previous60DaysAgo, lt: current30DaysAgo } },
        select: { cost: true, metadata: true },
      });

      // Compute current period totals
      const totalCostNum = currentLogs.reduce((acc, log) => acc + Number(log.cost), 0);
      const totalExecutionsNum = currentLogs.length;
      const totalTokensNum = currentLogs.reduce((acc, log) => {
        const meta = log.metadata as { totalTokens?: number } | null;
        return acc + (meta?.totalTokens || 0);
      }, 0);

      const avgCostPerExecNum = totalExecutionsNum > 0 ? totalCostNum / totalExecutionsNum : 0;

      // Compute previous period totals for change rates
      const prevCostNum = previousLogs.reduce((acc, log) => acc + Number(log.cost), 0);
      const prevExecutionsNum = previousLogs.length;
      const prevTokensNum = previousLogs.reduce((acc, log) => {
        const meta = log.metadata as { totalTokens?: number } | null;
        return acc + (meta?.totalTokens || 0);
      }, 0);
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

  public async getTimeSeriesChart(range: string = "30d"): Promise<ChartResponse> {
    try {
      const days = range === "7d" ? 7 : range === "90d" ? 90 : 30;
      const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

      const logs = await this.prisma.executionLog.findMany({
        where: { createdAt: { gte: startDate } },
        select: {
          cost: true,
          createdAt: true,
          metadata: true,
        },
        orderBy: { createdAt: "asc" },
      });

      if (logs.length === 0) {
        return [];
      }

      // Group logs into date buckets
      const groupedMap = new Map<string, { cost: number; tokens: number; executions: number }>();

      for (const log of logs) {
        const dateStr = log.createdAt.toLocaleDateString("en-US", { month: "short", day: "2-digit" });
        const meta = log.metadata as { totalTokens?: number } | null;
        const tokens = meta?.totalTokens || 0;
        const costVal = Number(log.cost);

        const existing = groupedMap.get(dateStr) || { cost: 0, tokens: 0, executions: 0 };
        groupedMap.set(dateStr, {
          cost: Number((existing.cost + costVal).toFixed(2)),
          tokens: existing.tokens + tokens,
          executions: existing.executions + 1,
        });
      }

      return Array.from(groupedMap.entries()).map(([date, stats]) => ({
        date,
        cost: stats.cost,
        tokens: stats.tokens,
        executions: stats.executions,
      }));
    } catch {
      return [];
    }
  }

  public async getHierarchicalBreakdown(): Promise<BreakdownResponse> {
    try {
      const dbOrgs = await this.prisma.organization.findMany({
        include: {
          departments: {
            include: {
              users: {
                include: {
                  executionLogs: {
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
}
