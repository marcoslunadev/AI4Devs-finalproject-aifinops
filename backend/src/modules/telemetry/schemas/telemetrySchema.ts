import { z } from "zod";

export const KpiResponseSchema = z.object({
  totalCost: z.number(),
  totalCostChange: z.number(),
  totalExecutions: z.number(),
  totalExecutionsChange: z.number(),
  totalTokens: z.number(),
  totalTokensChange: z.number(),
  avgCostPerExec: z.number(),
  avgCostPerExecChange: z.number(),
  activeOrgs: z.number(),
  activeOrgsBadge: z.string().optional(),
  errorRate: z.number(),
  errorRateChange: z.number(),
});

export const ChartPointSchema = z.object({
  date: z.string(),
  cost: z.number(),
  tokens: z.number(),
  executions: z.number(),
});

export const ChartResponseSchema = z.array(ChartPointSchema);

export const BreakdownNodeSchema: z.ZodType<any> = z.lazy(() =>
  z.object({
    id: z.string(),
    name: z.string(),
    type: z.enum(["organization", "environment", "user"]),
    status: z.enum(["active", "warning", "inactive"]),
    cost: z.number(),
    executions: z.number(),
    tokens: z.number(),
    budget: z.number(),
    children: z.array(BreakdownNodeSchema).optional(),
  })
);

export const BreakdownResponseSchema = z.array(BreakdownNodeSchema);

export const OrganizationItemSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const OrganizationsResponseSchema = z.array(OrganizationItemSchema);

export const DepartmentExecutionSchema = z.object({
  id: z.string(),
  organizationId: z.string(),
  organizationName: z.string(),
  departmentId: z.string(),
  departmentName: z.string(),
  model: z.string(),
  totalCalls: z.number(),
  promptTokens: z.number(),
  completionTokens: z.number(),
  totalCost: z.number(),
  avgLatencyMs: z.number(),
});

export const DepartmentExecutionsResponseSchema = z.array(DepartmentExecutionSchema);

export const ProviderDistributionItemSchema = z.object({
  provider: z.string(),
  cost: z.number(),
  share: z.number(),
});

export const ProviderDistributionResponseSchema = z.array(ProviderDistributionItemSchema);

export type KpiResponse = z.infer<typeof KpiResponseSchema>;
export type ChartResponse = z.infer<typeof ChartResponseSchema>;
export type BreakdownResponse = z.infer<typeof BreakdownResponseSchema>;
export type OrganizationItem = z.infer<typeof OrganizationItemSchema>;
export type OrganizationsResponse = z.infer<typeof OrganizationsResponseSchema>;
export type DepartmentExecution = z.infer<typeof DepartmentExecutionSchema>;
export type DepartmentExecutionsResponse = z.infer<typeof DepartmentExecutionsResponseSchema>;
export type ProviderDistributionItem = z.infer<typeof ProviderDistributionItemSchema>;
export type ProviderDistributionResponse = z.infer<typeof ProviderDistributionResponseSchema>;
