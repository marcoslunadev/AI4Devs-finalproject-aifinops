import api from "./api";

export type ExecutionStatus = "SUCCESS" | "ERROR" | "TIMEOUT" | "RATE_LIMIT_EXCEEDED";

export interface AgentMetrics {
  totalExecutions: number;
  totalPromptTokens: number;
  totalCompletionTokens: number;
  totalTokens: number;
  totalCostUsd: number;
  avgLatencyMs: number;
}

export interface AgentOrganization {
  id: string;
  name: string;
}

export interface AgentDepartment {
  id: string;
  name: string;
}

export interface AgentDetail {
  id: string;
  name: string;
  description: string | null;
  defaultModel: string;
  provider: string;
  organizationId: string;
  departmentId: string | null;
  organization?: AgentOrganization;
  department?: AgentDepartment | null;
  metrics: AgentMetrics;
}

export interface AgentExecution {
  id: string;
  provider: string;
  model: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  costUsd: number;
  latencyMs: number;
  status: ExecutionStatus;
  environment: string;
  executedAt: string;
}

export interface PaginatedExecutions {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  items: AgentExecution[];
}

export async function fetchAgents(): Promise<AgentDetail[]> {
  const response = await api.get<AgentDetail[]>("/agents");
  return response.data;
}

export async function fetchAgentDetail(agentId: string): Promise<AgentDetail> {
  const response = await api.get<AgentDetail>(`/agents/${encodeURIComponent(agentId)}`);
  return response.data;
}

export async function fetchAgentExecutions(
  agentId: string,
  page: number = 1,
  limit: number = 10
): Promise<PaginatedExecutions> {
  const response = await api.get<PaginatedExecutions>(
    `/agents/${encodeURIComponent(agentId)}/executions`,
    {
      params: { page, limit },
    }
  );
  return response.data;
}
