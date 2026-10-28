import { Prisma } from "@prisma/client";
import { ModelPriceRepository } from "../repositories/ModelPriceRepository";

export interface CostCalculationResult {
  inputCost: Prisma.Decimal;
  outputCost: Prisma.Decimal;
  totalCost: Prisma.Decimal;
}

export class CostCalculatorService {
  private modelPriceRepo: ModelPriceRepository;

  constructor(modelPriceRepo?: ModelPriceRepository) {
    this.modelPriceRepo = modelPriceRepo || new ModelPriceRepository();
  }

  /**
   * Calcula deterministamente el coste de una llamada de IA en USD usando precisión Decimal.
   * cost_usd = (promptTokens * promptPricePer1k / 1000) + (completionTokens * completionPricePer1k / 1000)
   */
  public async calculateCost(
    provider: string,
    model: string,
    promptTokens: number,
    completionTokens: number
  ): Promise<CostCalculationResult> {
    const priceConfig = await this.modelPriceRepo.getActivePrice(provider, model);

    if (!priceConfig) {
      throw new Error(
        `Tarifa no encontrada para el modelo '${model}' del proveedor '${provider}'. Asegúrese de que el precio está registrado en ModelPrice.`
      );
    }

    return this.calculateWithPrices(
      promptTokens,
      completionTokens,
      priceConfig.promptPricePer1k,
      priceConfig.completionPricePer1k
    );
  }

  /**
   * Método puro para cálculo determinista a partir de objetos Decimal dados
   */
  public calculateWithPrices(
    promptTokens: number,
    completionTokens: number,
    promptPricePer1k: Prisma.Decimal,
    completionPricePer1k: Prisma.Decimal
  ): CostCalculationResult {
    const divisor = new Prisma.Decimal(1000);

    // inputCost = (promptTokens * promptPricePer1k) / 1000
    const inputCost = new Prisma.Decimal(promptTokens)
      .mul(promptPricePer1k)
      .div(divisor);

    // outputCost = (completionTokens * completionPricePer1k) / 1000
    const outputCost = new Prisma.Decimal(completionTokens)
      .mul(completionPricePer1k)
      .div(divisor);

    const totalCost = inputCost.add(outputCost);

    return {
      inputCost: new Prisma.Decimal(inputCost.toFixed(6)),
      outputCost: new Prisma.Decimal(outputCost.toFixed(6)),
      totalCost: new Prisma.Decimal(totalCost.toFixed(6)),
    };
  }
}
