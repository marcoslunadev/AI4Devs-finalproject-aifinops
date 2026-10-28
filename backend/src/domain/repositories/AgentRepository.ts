import { prisma } from "../../core/utils/db";
import { AiAgent } from "@prisma/client";

export class AgentRepository {
  public async findById(id: string): Promise<AiAgent | null> {
    return prisma.aiAgent.findUnique({
      where: { id },
      include: {
        organization: true,
        department: true,
      },
    });
  }

  public async listByOrganization(organizationId: string): Promise<AiAgent[]> {
    return prisma.aiAgent.findMany({
      where: { organizationId },
      include: { department: true },
      orderBy: { name: "asc" },
    });
  }

  public async listAll(): Promise<AiAgent[]> {
    return prisma.aiAgent.findMany({
      include: {
        organization: true,
        department: true,
      },
      orderBy: { name: "asc" },
    });
  }
}
