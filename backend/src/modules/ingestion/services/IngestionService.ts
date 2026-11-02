import { createReadStream, promises as fsPromises } from 'fs';
import readline from 'readline';
import { prisma } from '../../../core/utils/db';
import { BatchStatus, Environment, ExecutionStatus, Prisma } from '@prisma/client';
import { CostCalculatorService } from '../../../domain/services/CostCalculatorService';
import { z } from 'zod';

export const LogRecordSchema = z.object({
  agentId: z.string().optional(),
  userEmail: z.string().email(),
  environment: z.enum(['DEV', 'PRE', 'PRO']).default('PRO'),
  provider: z.string().min(1),
  model: z.string().min(1),
  promptTokens: z.number().int().nonnegative(),
  completionTokens: z.number().int().nonnegative(),
  latencyMs: z.number().int().nonnegative().default(0),
  status: z.enum(['SUCCESS', 'ERROR', 'TIMEOUT', 'RATE_LIMIT_EXCEEDED']).default('SUCCESS'),
  executedAt: z.string().optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});

export type LogRecordInput = z.infer<typeof LogRecordSchema>;

export class IngestionService {
  private costCalculator: CostCalculatorService;

  constructor() {
    this.costCalculator = new CostCalculatorService();
  }

  public async startIngestion(fileId: string, filePath: string, originalName: string, fileSizeBytes?: number) {
    // 1. Crear el registro en IngestionBatch
    const batch = await prisma.ingestionBatch.create({
      data: {
        fileName: originalName,
        fileSizeBytes: fileSizeBytes || 0,
        status: BatchStatus.PROCESSING,
      },
    });

    // 2. Procesamiento asíncrono
    this.processFile(batch.id, filePath).catch(async (err) => {
      console.error(`Error procesando lote de ingesta ${batch.id}:`, err);
      try {
        await prisma.ingestionBatch.update({
          where: { id: batch.id },
          data: {
            status: BatchStatus.FAILED,
            errorSummary: err.message || 'Error desconocido durante la ingesta',
          },
        });
      } catch (updateErr) {
        // Ignorar si el lote no existe en BD
      }
    });

    return batch;
  }

  public async processFile(batchId: string, filePath: string): Promise<void> {
    const userCache = new Map<string, string>(); // email -> userId
    const agentCache = new Map<string, string>(); // agentId -> agentId

    // Precargar usuarios y agentes existentes
    const existingUsers = await prisma.user.findMany({ select: { id: true, email: true } });
    existingUsers.forEach((u) => userCache.set(u.email.toLowerCase(), u.id));

    const existingAgents = await prisma.aiAgent.findMany({ select: { id: true } });
    existingAgents.forEach((a) => agentCache.set(a.id, a.id));

    // Obtener organización por defecto si se requiere crear usuario al vuelo
    const defaultOrg = await prisma.organization.findFirst();

    const fileStream = createReadStream(filePath);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    let totalRecords = 0;
    let processedRecords = 0;
    let failedRecords = 0;
    const errors: string[] = [];

    const executionLogsBatch: Prisma.ExecutionLogCreateManyInput[] = [];
    const BATCH_SIZE = 250;

    for await (const line of rl) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('//') || trimmed === '[' || trimmed === ']') continue;

      totalRecords++;
      const cleanLine = trimmed.endsWith(',') ? trimmed.slice(0, -1) : trimmed;

      try {
        const rawJson = JSON.parse(cleanLine);
        const parsed = LogRecordSchema.parse(rawJson);

        // 1. Resolver userId
        const emailLower = parsed.userEmail.toLowerCase();
        let userId = userCache.get(emailLower);

        if (!userId) {
          if (!defaultOrg) {
            throw new Error(`Usuario ${parsed.userEmail} no encontrado y no existe organización por defecto.`);
          }
          const newUser = await prisma.user.create({
            data: {
              email: parsed.userEmail,
              name: parsed.userEmail.split('@')[0],
              organizationId: defaultOrg.id,
            },
          });
          userId = newUser.id;
          userCache.set(emailLower, userId);
        }

        // 2. Resolver agentId (si existe)
        let agentId: string | undefined = undefined;
        if (parsed.agentId && agentCache.has(parsed.agentId)) {
          agentId = parsed.agentId;
        }

        // 3. Calcular costes deterministas con ModelPrice
        let inputCost = new Prisma.Decimal(0);
        let outputCost = new Prisma.Decimal(0);
        let costUsd = new Prisma.Decimal(0);

        try {
          const costRes = await this.costCalculator.calculateCost(
            parsed.provider,
            parsed.model,
            parsed.promptTokens,
            parsed.completionTokens
          );
          inputCost = costRes.inputCost;
          outputCost = costRes.outputCost;
          costUsd = costRes.totalCost;
        } catch (calcErr: any) {
          // Fallback en caso de modelo desconocido: registrar con coste 0 y advertencia
          console.warn(`[Ingestion] Advertencia de tarificación: ${calcErr.message}`);
        }

        const executedAt = parsed.executedAt ? new Date(parsed.executedAt) : new Date();

        executionLogsBatch.push({
          batchId,
          userId,
          agentId,
          environment: parsed.environment as Environment,
          provider: parsed.provider,
          model: parsed.model,
          promptTokens: parsed.promptTokens,
          completionTokens: parsed.completionTokens,
          totalTokens: parsed.promptTokens + parsed.completionTokens,
          latencyMs: parsed.latencyMs,
          costUsd,
          inputCost,
          outputCost,
          status: parsed.status as ExecutionStatus,
          executedAt,
          metadata: (parsed.metadata ?? {}) as Prisma.InputJsonValue,
        });

        processedRecords++;

        if (executionLogsBatch.length >= BATCH_SIZE) {
          await prisma.executionLog.createMany({ data: [...executionLogsBatch] });
          executionLogsBatch.length = 0;
        }
      } catch (err: any) {
        failedRecords++;
        if (errors.length < 5) {
          errors.push(`Línea ${totalRecords}: ${err.message}`);
        }
      }
    }

    // Insertar registros restantes
    if (executionLogsBatch.length > 0) {
      await prisma.executionLog.createMany({ data: executionLogsBatch });
    }

    // Actualizar estado del lote
    try {
      await prisma.ingestionBatch.update({
        where: { id: batchId },
        data: {
          totalRecords,
          processedRecords,
          failedRecords,
          errorSummary: errors.length > 0 ? errors.join('; ') : null,
          status: failedRecords > 0 && processedRecords === 0 ? BatchStatus.FAILED : BatchStatus.COMPLETED,
        },
      });
    } catch (err: any) {
      // Ignorar si el lote fue eliminado durante tests de aislamiento
    }
  }
}
