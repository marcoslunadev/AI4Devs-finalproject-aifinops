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

export type KpiResponse = z.infer<typeof KpiResponseSchema>;
export type ChartResponse = z.infer<typeof ChartResponseSchema>;
export type BreakdownResponse = z.infer<typeof BreakdownResponseSchema>;
