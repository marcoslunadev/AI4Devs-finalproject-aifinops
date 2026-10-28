import { describe, it, expect } from "vitest";
import { AggregationEngine, FlatExecutionRecord } from "../AggregationEngine";
import { Environment, Prisma } from "@prisma/client";

describe("AggregationEngine - Sumatorios en Cascada y Filtros de Entorno (FinOps)", () => {
  const mockRecords: FlatExecutionRecord[] = [
    // Usuario 1 en Dept 1 (PRO)
    {
      id: "log_1",
      userId: "user_1",
      userName: "Dev One",
      departmentId: "dept_eng",
      departmentName: "Engineering",
      organizationId: "org_acme",
      organizationName: "Acme Corp",
      environment: Environment.PRO,
      costUsd: new Prisma.Decimal("12.500000"),
      totalTokens: 10000,
    },
    // Usuario 2 en Dept 1 (PRO)
    {
      id: "log_2",
      userId: "user_2",
      userName: "Dev Two",
      departmentId: "dept_eng",
      departmentName: "Engineering",
      organizationId: "org_acme",
      organizationName: "Acme Corp",
      environment: Environment.PRO,
      costUsd: new Prisma.Decimal("7.500000"),
      totalTokens: 5000,
    },
    // Usuario 3 en Dept 2 (PRO)
    {
      id: "log_3",
      userId: "user_3",
      userName: "Ops Lead",
      departmentId: "dept_ops",
      departmentName: "Operations",
      organizationId: "org_acme",
      organizationName: "Acme Corp",
      environment: Environment.PRO,
      costUsd: new Prisma.Decimal("5.000000"),
      totalTokens: 3000,
    },
    // Usuario 1 en Dept 1 (DEV)
    {
      id: "log_4",
      userId: "user_1",
      userName: "Dev One",
      departmentId: "dept_eng",
      departmentName: "Engineering",
      organizationId: "org_acme",
      organizationName: "Acme Corp",
      environment: Environment.DEV,
      costUsd: new Prisma.Decimal("2.000000"),
      totalTokens: 2000,
    },
  ];

  it("debe validar que la suma de costes y tokens de los usuarios coincide exactamente con el total del departamento", () => {
    const engine = new AggregationEngine();
    const result = engine.aggregateHierarchy(mockRecords, "ALL");

    expect(result).toHaveLength(1);
    const org = result[0];
    const engDept = org.departments.find((d) => d.departmentId === "dept_eng");
    expect(engDept).toBeDefined();

    // Suma de usuarios de Engineering
    const sumUsersCost = engDept!.users.reduce((acc, u) => acc + u.totalCostUsd, 0);
    const sumUsersTokens = engDept!.users.reduce((acc, u) => acc + u.totalTokens, 0);

    expect(engDept!.totalCostUsd).toBeCloseTo(sumUsersCost, 5);
    expect(engDept!.totalTokens).toBe(sumUsersTokens);
    expect(engDept!.totalCostUsd).toBe(22.0); // 12.5 + 7.5 + 2.0
    expect(engDept!.totalTokens).toBe(17000); // 10000 + 5000 + 2000
  });

  it("debe validar que la suma de departamentos conforma exactamente el total de la organización", () => {
    const engine = new AggregationEngine();
    const result = engine.aggregateHierarchy(mockRecords, "ALL");

    const org = result[0];
    const sumDeptsCost = org.departments.reduce((acc, d) => acc + d.totalCostUsd, 0);
    const sumDeptsTokens = org.departments.reduce((acc, d) => acc + d.totalTokens, 0);

    expect(org.totalCostUsd).toBeCloseTo(sumDeptsCost, 5);
    expect(org.totalTokens).toBe(sumDeptsTokens);
    expect(org.totalCostUsd).toBe(27.0); // 22.0 + 5.0
    expect(org.totalTokens).toBe(20000); // 17000 + 3000
  });

  it("debe filtrar rigurosamente por entorno DEV excluyendo registros de PRO", () => {
    const engine = new AggregationEngine();
    const result = engine.aggregateHierarchy(mockRecords, Environment.DEV);

    expect(result).toHaveLength(1);
    const org = result[0];
    expect(org.totalCostUsd).toBe(2.0); // Solo log_4 de DEV
    expect(org.totalTokens).toBe(2000);
    expect(org.departments).toHaveLength(1);
    expect(org.departments[0].departmentId).toBe("dept_eng");
  });

  it("debe filtrar rigurosamente por entorno PRO excluyendo registros de DEV", () => {
    const engine = new AggregationEngine();
    const result = engine.aggregateHierarchy(mockRecords, Environment.PRO);

    const org = result[0];
    expect(org.totalCostUsd).toBe(25.0); // 12.5 + 7.5 + 5.0
    expect(org.totalTokens).toBe(18000);
    expect(org.executionCount).toBe(3);
  });
});
