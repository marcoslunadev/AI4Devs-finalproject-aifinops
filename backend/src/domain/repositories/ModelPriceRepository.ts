import { prisma } from "../../core/utils/db";
import { ModelPrice } from "@prisma/client";

export class ModelPriceRepository {
  public async getActivePrice(provider: string, model: string): Promise<ModelPrice | null> {
    return prisma.modelPrice.findFirst({
      where: {
        provider: { equals: provider, mode: "insensitive" },
        model: { equals: model, mode: "insensitive" },
        isActive: true,
      },
      orderBy: { effectiveFrom: "desc" },
    });
  }

  public async listActivePrices(): Promise<ModelPrice[]> {
    return prisma.modelPrice.findMany({
      where: { isActive: true },
      orderBy: [{ provider: "asc" }, { model: "asc" }],
    });
  }
}
