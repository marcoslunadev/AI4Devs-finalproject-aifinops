import { describe, it, expect, vi } from "vitest";
import { CostCalculatorService } from "../CostCalculatorService";
import { ModelPriceRepository } from "../../repositories/ModelPriceRepository";
import { Prisma } from "@prisma/client";

describe("CostCalculatorService - Cálculo Financiero Determinista", () => {
  it("debe calcular exactamente los costes con fórmula matemática formal sin imprecisión flotante", () => {
    const service = new CostCalculatorService();

    // gpt-4o: prompt $0.005 / 1K, completion $0.015 / 1K
    // promptTokens: 1250 -> 1.25 * 0.005 = 0.006250
    // completionTokens: 430 -> 0.43 * 0.015 = 0.006450
    // total: 0.012700
    const promptPrice = new Prisma.Decimal("0.005000");
    const completionPrice = new Prisma.Decimal("0.015000");

    const result = service.calculateWithPrices(1250, 430, promptPrice, completionPrice);

    expect(result.inputCost.toString()).toBe("0.00625");
    expect(result.outputCost.toString()).toBe("0.00645");
    expect(result.totalCost.toString()).toBe("0.0127");
  });

  it("debe mantener alta precisión con modelos de bajo coste (gpt-4o-mini)", () => {
    const service = new CostCalculatorService();

    // gpt-4o-mini: prompt $0.000150 / 1K, completion $0.000600 / 1K
    // 2000 prompt -> 2.0 * 0.00015 = 0.000300
    // 1000 completion -> 1.0 * 0.0006 = 0.000600
    // total: 0.000900
    const promptPrice = new Prisma.Decimal("0.000150");
    const completionPrice = new Prisma.Decimal("0.000600");

    const result = service.calculateWithPrices(2000, 1000, promptPrice, completionPrice);

    expect(result.inputCost.toString()).toBe("0.0003");
    expect(result.outputCost.toString()).toBe("0.0006");
    expect(result.totalCost.toString()).toBe("0.0009");
  });

  it("debe consultar la tarifa activa en ModelPriceRepository y calcular correctamente", async () => {
    const mockRepo = {
      getActivePrice: vi.fn().mockResolvedValue({
        id: "mock_id",
        provider: "OPENAI",
        model: "gpt-4o",
        promptPricePer1k: new Prisma.Decimal("0.005000"),
        completionPricePer1k: new Prisma.Decimal("0.015000"),
        effectiveFrom: new Date(),
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      listActivePrices: vi.fn(),
    } as unknown as ModelPriceRepository;

    const service = new CostCalculatorService(mockRepo);
    const result = await service.calculateCost("OPENAI", "gpt-4o", 1000, 1000);

    expect(mockRepo.getActivePrice).toHaveBeenCalledWith("OPENAI", "gpt-4o");
    expect(result.totalCost.toString()).toBe("0.02");
  });

  it("debe lanzar un error descriptivo si el modelo o proveedor no existe en ModelPrice", async () => {
    const mockRepo = {
      getActivePrice: vi.fn().mockResolvedValue(null),
      listActivePrices: vi.fn(),
    } as unknown as ModelPriceRepository;

    const service = new CostCalculatorService(mockRepo);

    await expect(service.calculateCost("UNKNOWN", "model-x", 500, 500)).rejects.toThrow(
      "Tarifa no encontrada para el modelo 'model-x' del proveedor 'UNKNOWN'."
    );
  });
});
