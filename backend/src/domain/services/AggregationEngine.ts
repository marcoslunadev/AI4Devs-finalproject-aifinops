import { Environment, Prisma } from "@prisma/client";

export interface FlatExecutionRecord {
  id: string;
  userId: string;
  userName?: string;
  departmentId?: string;
  departmentName?: string;
  organizationId: string;
  organizationName?: string;
  environment: Environment;
  costUsd: Prisma.Decimal | number;
  totalTokens: number;
}

export interface UserAggregation {
  userId: string;
  userName: string;
  totalCostUsd: number;
  totalTokens: number;
  executionCount: number;
}

export interface DepartmentAggregation {
  departmentId: string;
  departmentName: string;
  totalCostUsd: number;
  totalTokens: number;
  executionCount: number;
  users: UserAggregation[];
}

export interface OrganizationAggregation {
  organizationId: string;
  organizationName: string;
  totalCostUsd: number;
  totalTokens: number;
  executionCount: number;
  departments: DepartmentAggregation[];
}

export class AggregationEngine {
  /**
   * Agrega en cascada: Users -> Departments -> Organizations
   * Filtra estrictamente por entorno cuando se especifica.
   */
  public aggregateHierarchy(
    records: FlatExecutionRecord[],
    environmentFilter?: Environment | "ALL"
  ): OrganizationAggregation[] {
    // 1. Filtrado de entorno
    const filteredRecords =
      !environmentFilter || environmentFilter === "ALL"
        ? records
        : records.filter((r) => r.environment === environmentFilter);

    const orgMap = new Map<string, OrganizationAggregation>();
    const deptMap = new Map<string, DepartmentAggregation>();
    const userMap = new Map<string, UserAggregation>();

    for (const r of filteredRecords) {
      const cost =
        r.costUsd instanceof Prisma.Decimal
          ? parseFloat(r.costUsd.toString())
          : Number(r.costUsd);

      // --- USER ROLLUP ---
      let userAgg = userMap.get(r.userId);
      if (!userAgg) {
        userAgg = {
          userId: r.userId,
          userName: r.userName || "Unknown User",
          totalCostUsd: 0,
          totalTokens: 0,
          executionCount: 0,
        };
        userMap.set(r.userId, userAgg);
      }
      userAgg.totalCostUsd = parseFloat((userAgg.totalCostUsd + cost).toFixed(6));
      userAgg.totalTokens += r.totalTokens;
      userAgg.executionCount += 1;

      // --- DEPT ROLLUP ---
      const deptId = r.departmentId || "unassigned_dept";
      let deptAgg = deptMap.get(deptId);
      if (!deptAgg) {
        deptAgg = {
          departmentId: deptId,
          departmentName: r.departmentName || "General Department",
          totalCostUsd: 0,
          totalTokens: 0,
          executionCount: 0,
          users: [],
        };
        deptMap.set(deptId, deptAgg);
      }
      deptAgg.totalCostUsd = parseFloat((deptAgg.totalCostUsd + cost).toFixed(6));
      deptAgg.totalTokens += r.totalTokens;
      deptAgg.executionCount += 1;
      if (!deptAgg.users.some((u) => u.userId === userAgg!.userId)) {
        deptAgg.users.push(userAgg);
      }

      // --- ORG ROLLUP ---
      let orgAgg = orgMap.get(r.organizationId);
      if (!orgAgg) {
        orgAgg = {
          organizationId: r.organizationId,
          organizationName: r.organizationName || "Corporate Org",
          totalCostUsd: 0,
          totalTokens: 0,
          executionCount: 0,
          departments: [],
        };
        orgMap.set(r.organizationId, orgAgg);
      }
      orgAgg.totalCostUsd = parseFloat((orgAgg.totalCostUsd + cost).toFixed(6));
      orgAgg.totalTokens += r.totalTokens;
      orgAgg.executionCount += 1;
      if (!orgAgg.departments.some((d) => d.departmentId === deptAgg!.departmentId)) {
        orgAgg.departments.push(deptAgg);
      }
    }

    return Array.from(orgMap.values());
  }
}
