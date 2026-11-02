import { Request, Response } from "express";
import { AgentRepository } from "../../../domain/repositories/AgentRepository";
import { prisma } from "../../../core/utils/db";

export class AgentController {
  private agentRepo: AgentRepository;

  constructor() {
    this.agentRepo = new AgentRepository();
  }

  public listAgents = async (req: Request, res: Response): Promise<void> => {
    try {
      const agents = await this.agentRepo.listAll();
      res.status(200).json(agents);
    } catch (error: any) {
      res.status(500).json({ error: "Error listando agentes", details: error.message });
    }
  };

  public getAgentById = async (req: Request, res: Response): Promise<void> => {
    try {
      const agentId = Array.isArray(req.params.agentId) ? req.params.agentId[0] : req.params.agentId;
      const agent = await this.agentRepo.findById(agentId);

      if (!agent) {
        res.status(404).json({ error: `Agente con ID '${agentId}' no encontrado.` });
        return;
      }

      // Sumatorios de ejecuciones asociadas
      const aggregations = await prisma.executionLog.aggregate({
        where: { agentId },
        _count: { id: true },
        _sum: {
          promptTokens: true,
          completionTokens: true,
          totalTokens: true,
          costUsd: true,
        },
        _avg: {
          latencyMs: true,
        },
      });

      res.status(200).json({
        ...agent,
        metrics: {
          totalExecutions: aggregations._count?.id ?? 0,
          totalPromptTokens: aggregations._sum?.promptTokens ?? 0,
          totalCompletionTokens: aggregations._sum?.completionTokens ?? 0,
          totalTokens: aggregations._sum?.totalTokens ?? 0,
          totalCostUsd: aggregations._sum?.costUsd ?? 0,
          avgLatencyMs: Math.round(aggregations._avg?.latencyMs ?? 0),
        },
      });
    } catch (error: any) {
      res.status(500).json({ error: "Error recuperando agente", details: error.message });
    }
  };

  public getAgentExecutions = async (req: Request, res: Response): Promise<void> => {
    try {
      const agentId = Array.isArray(req.params.agentId) ? req.params.agentId[0] : req.params.agentId;
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
      const skip = (page - 1) * limit;

      const [total, executions] = await Promise.all([
        prisma.executionLog.count({ where: { agentId } }),
        prisma.executionLog.findMany({
          where: { agentId },
          orderBy: { executedAt: "desc" },
          skip,
          take: limit,
          select: {
            id: true,
            provider: true,
            model: true,
            promptTokens: true,
            completionTokens: true,
            totalTokens: true,
            costUsd: true,
            latencyMs: true,
            status: true,
            environment: true,
            executedAt: true,
          },
        }),
      ]);

      res.status(200).json({
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        items: executions,
      });
    } catch (error: any) {
      res.status(500).json({ error: "Error recuperando llamadas del agente", details: error.message });
    }
  };
}
