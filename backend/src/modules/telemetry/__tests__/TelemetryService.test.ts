import { describe, it, expect, beforeAll } from "vitest";
import { TelemetryService } from "../services/TelemetryService";
import {
  OrganizationsResponseSchema,
  DepartmentExecutionsResponseSchema,
  KpiResponseSchema,
  ChartResponseSchema,
  BreakdownResponseSchema,
} from "../schemas/telemetrySchema";

describe("TelemetryService", () => {
  let service: TelemetryService;

  beforeAll(() => {
    service = new TelemetryService();
  });

  it("should fetch active organizations matching OrganizationsResponseSchema", async () => {
    const orgs = await service.getOrganizations();
    expect(orgs).toBeDefined();
    expect(Array.isArray(orgs)).toBe(true);

    const parsed = OrganizationsResponseSchema.safeParse(orgs);
    expect(parsed.success).toBe(true);
  });

  it("should aggregate department executions matching DepartmentExecutionsResponseSchema", async () => {
    const deptExecs = await service.getDepartmentExecutions();
    expect(deptExecs).toBeDefined();
    expect(Array.isArray(deptExecs)).toBe(true);

    const parsed = DepartmentExecutionsResponseSchema.safeParse(deptExecs);
    expect(parsed.success).toBe(true);

    if (deptExecs.length > 0) {
      const first = deptExecs[0];
      expect(first).toHaveProperty("organizationId");
      expect(first).toHaveProperty("departmentId");
      expect(first).toHaveProperty("model");
      expect(typeof first.totalCalls).toBe("number");
      expect(typeof first.totalCost).toBe("number");
      expect(typeof first.avgLatencyMs).toBe("number");
    }
  });

  it("should calculate KPI metrics globally and when filtered by organizationId", async () => {
    const orgs = await service.getOrganizations();
    const globalKpis = await service.getKpiMetrics();

    expect(KpiResponseSchema.safeParse(globalKpis).success).toBe(true);
    expect(globalKpis.activeOrgs).toBeGreaterThanOrEqual(0);

    if (orgs.length > 0) {
      const filteredKpis = await service.getKpiMetrics(orgs[0].id);
      expect(KpiResponseSchema.safeParse(filteredKpis).success).toBe(true);
      expect(filteredKpis.activeOrgs).toBe(1);
    }
  });

  it("should fetch time series chart data for different ranges and filters", async () => {
    const chart30d = await service.getTimeSeriesChart("30d");
    expect(ChartResponseSchema.safeParse(chart30d).success).toBe(true);
    expect(chart30d.length).toBe(30);

    const chart7d = await service.getTimeSeriesChart("7d", undefined);
    expect(chart7d.length).toBe(7);

    const chart90d = await service.getTimeSeriesChart("90d");
    expect(chart90d.length).toBe(90);
  });

  it("should fetch hierarchical breakdown tree matching BreakdownResponseSchema", async () => {
    const breakdown = await service.getHierarchicalBreakdown();
    expect(BreakdownResponseSchema.safeParse(breakdown).success).toBe(true);
  });

  it("should return ingestion status", async () => {
    const status = await service.getIngestionStatus();
    expect(status).toHaveProperty("status");
    expect(["PROCESSING", "COMPLETED"]).toContain(status.status);
    expect(typeof status.totalRecordsProcessed).toBe("number");
  });

  it("should handle non-existent organization filter gracefully", async () => {
    const breakdown = await service.getHierarchicalBreakdown("non-existent-uuid");
    expect(breakdown).toEqual([]);

    const deptExecs = await service.getDepartmentExecutions("non-existent-uuid");
    expect(deptExecs).toEqual([]);

    const kpis = await service.getKpiMetrics("non-existent-uuid");
    expect(kpis.totalExecutions).toBe(0);
  });

  it("should return fallback defaults when db throws error", async () => {
    const errorService = new TelemetryService();
    (errorService as any).prisma = {
      organization: {
        findMany: () => Promise.reject(new Error("db error")),
        count: () => Promise.reject(new Error("db error")),
      },
      executionLog: {
        aggregate: () => Promise.reject(new Error("db error")),
        findMany: () => Promise.reject(new Error("db error")),
      },
      ingestionAuditLog: {
        count: () => Promise.reject(new Error("db error")),
        findFirst: () => Promise.reject(new Error("db error")),
        aggregate: () => Promise.reject(new Error("db error")),
      },
      $queryRaw: () => Promise.reject(new Error("db error")),
    };

    expect(await errorService.getOrganizations()).toEqual([]);
    expect((await errorService.getKpiMetrics()).activeOrgs).toBe(0);
    expect(await errorService.getTimeSeriesChart()).toEqual([]);
    expect(await errorService.getHierarchicalBreakdown()).toEqual([]);
    expect(await errorService.getDepartmentExecutions()).toEqual([]);
    expect((await errorService.getIngestionStatus()).status).toBe("COMPLETED");
  });

  it("should calculate positive percentage changes when previous metrics exist", async () => {
    const mockService = new TelemetryService();
    (mockService as any).prisma = {
      organization: {
        count: (args: any) => {
          if (args?.where?.createdAt) return Promise.resolve(2);
          return Promise.resolve(5);
        },
      },
      executionLog: {
        aggregate: (args: any) => {
          if (args?.where?.createdAt?.lt) {
            // previous period
            return Promise.resolve({ _sum: { cost: 50 }, _count: { id: 10 } });
          }
          // current period
          return Promise.resolve({ _sum: { cost: 100 }, _count: { id: 20 } });
        },
      },
      $queryRaw: (() => {
        let callCount = 0;
        return () => {
          callCount++;
          if (callCount % 2 === 1) {
            return Promise.resolve([{ sum: 10000 }]);
          }
          return Promise.resolve([{ sum: 5000 }]);
        };
      })(),
    };

    const kpis = await mockService.getKpiMetrics();
    expect(kpis.totalCostChange).toBe(100);
    expect(kpis.totalExecutionsChange).toBe(100);
    expect(kpis.totalTokensChange).toBe(100);
    expect(kpis.avgCostPerExecChange).toBe(0);
    expect(kpis.activeOrgsBadge).toBe("+2 New");
  });

  it("should handle PROCESSING status for ingestion logs", async () => {
    const mockService = new TelemetryService();
    const dateNow = new Date();
    (mockService as any).prisma = {
      ingestionAuditLog: {
        count: () => Promise.resolve(3),
        findFirst: () => Promise.resolve({ updatedAt: dateNow }),
        aggregate: () => Promise.resolve({ _sum: { successCount: 150 } }),
      },
    };

    const status = await mockService.getIngestionStatus();
    expect(status.status).toBe("PROCESSING");
    expect(status.activeIngestionsCount).toBe(3);
    expect(status.totalRecordsProcessed).toBe(150);
    expect(status.lastIngestedAt).toBe(dateNow.toISOString());
  });

  it("should handle unassigned user/department fallbacks in department executions", async () => {
    const mockService = new TelemetryService();
    (mockService as any).prisma = {
      executionLog: {
        findMany: () =>
          Promise.resolve([
            {
              id: "log-1",
              aiModel: null,
              cost: 12.34,
              user: null,
              metadata: null,
            },
            {
              id: "log-2",
              aiModel: "gpt-4o",
              cost: 10.0,
              user: {
                organizationId: null,
                organization: null,
                departmentId: null,
                department: null,
              },
              metadata: {
                promptTokens: 100,
                completionTokens: 50,
                latencyMs: 300,
              },
            },
            {
              id: "log-3",
              aiModel: "gpt-4o",
              cost: 5.0,
              user: {
                organizationId: null,
                organization: null,
                departmentId: null,
                department: null,
              },
              metadata: {
                promptTokens: 50,
                completionTokens: 25,
                latencyMs: 150,
              },
            },
          ]),
      },
    };

    const execs = await mockService.getDepartmentExecutions();
    expect(execs.length).toBe(2);
    const unassignedGpt4 = execs.find((e) => e.model === "gpt-4o");
    expect(unassignedGpt4?.organizationName).toBe("Unassigned / Sin Asignar");
    expect(unassignedGpt4?.departmentName).toBe("General / Sin Departamento");
    expect(unassignedGpt4?.totalCalls).toBe(2);
    expect(unassignedGpt4?.avgLatencyMs).toBe(225);
  });

  it("should handle user without name and null metadata in breakdown", async () => {
    const mockService = new TelemetryService();
    (mockService as any).prisma = {
      organization: {
        findMany: () =>
          Promise.resolve([
            {
              id: "org-1",
              name: "Org One",
              departments: [
                {
                  id: "dept-1",
                  name: "Dept One",
                  users: [
                    {
                      id: "u-1",
                      name: null,
                      email: "user1@test.com",
                      executionLogs: [
                        { cost: 5.5, metadata: null },
                        { cost: 2.5, metadata: { totalTokens: 100 } },
                      ],
                    },
                  ],
                },
              ],
            },
          ]),
      },
    };

    const breakdown = await mockService.getHierarchicalBreakdown();
    expect(breakdown.length).toBe(1);
    expect(breakdown[0].children[0].children[0].name).toBe("user1@test.com");
    expect(breakdown[0].children[0].children[0].cost).toBe(8);
    expect(breakdown[0].children[0].children[0].tokens).toBe(100);
  });

  it("should fetch time series chart filtered by organizationId", async () => {
    const orgs = await service.getOrganizations();
    if (orgs.length > 0) {
      const chart = await service.getTimeSeriesChart("30d", orgs[0].id);
      expect(chart.length).toBe(30);
    }
  });

  it("should handle empty department executions array correctly", async () => {
    const mockService = new TelemetryService();
    (mockService as any).prisma = {
      executionLog: {
        findMany: () => Promise.resolve([]),
      },
    };
    const execs = await mockService.getDepartmentExecutions();
    expect(execs).toEqual([]);
  });
});
