import { createReadStream } from 'fs';
import { parse } from 'csv-parse';
import { prisma } from '../../../core/utils/db';
import { AdapterResolver } from '../../../domain/adapters/AdapterResolver';
import { Prisma } from '@prisma/client';

export class IngestionService {
  private resolver: AdapterResolver;

  constructor() {
    this.resolver = new AdapterResolver();
  }

  public async startIngestion(fileId: string, filePath: string, originalName: string) {
    // 3.2 Implementar la creación del registro IngestionAuditLog en estado PENDING
    const auditLog = await prisma.ingestionAuditLog.create({
      data: {
        fileId,
        status: 'PENDING'
      }
    });

    // Iniciamos el procesamiento de forma asíncrona (background)
    this.processFile(auditLog.id, filePath, originalName).catch(err => {
      console.error(`Error no manejado procesando archivo ${fileId}:`, err);
    });

    return auditLog;
  }

  private async processFile(auditLogId: string, filePath: string, originalName: string) {
    let adapter;
    try {
      adapter = this.resolver.resolve(originalName);
    } catch (error: any) {
      await prisma.ingestionAuditLog.update({
        where: { id: auditLogId },
        data: { status: 'FAILED', errorMessage: error.message }
      });
      return;
    }

    let successCount = 0;
    let errorCount = 0;
    let batch: Prisma.ExecutionLogCreateManyInput[] = [];
    const BATCH_SIZE = 500;

    // 3.3 Implementar el parseo en streaming usando csv-parse
    const parser = createReadStream(filePath).pipe(
      parse({
        columns: true,
        skip_empty_lines: true,
        trim: true,
      })
    );

    const parts = originalName.split('_');
    const fileContext = {
      organization: parts.length >= 3 ? parts[0] : 'UNKNOWN',
      environment: parts.length >= 3 ? parts[1] : 'UNKNOWN'
    };

    try {
      for await (const row of parser) {
        const mappedRow = adapter.mapRow(row, fileContext);
        if (mappedRow) {
          batch.push(mappedRow as Prisma.ExecutionLogCreateManyInput);
          // 3.4 Agrupar filas parseadas y hacer inserción en lote (chunking)
          if (batch.length >= BATCH_SIZE) {
            await this.insertBatch(batch);
            successCount += batch.length;
            batch = [];
          }
        } else {
          errorCount++;
        }
      }

      // Insertar el resto
      if (batch.length > 0) {
        await this.insertBatch(batch);
        successCount += batch.length;
      }

      // 3.5 Actualizar el estado del IngestionAuditLog a COMPLETED
      await prisma.ingestionAuditLog.update({
        where: { id: auditLogId },
        data: { status: 'COMPLETED', successCount, errorCount }
      });
    } catch (error: any) {
      // 3.5 Actualizar el estado del IngestionAuditLog a FAILED
      await prisma.ingestionAuditLog.update({
        where: { id: auditLogId },
        data: { status: 'FAILED', errorMessage: error.message, successCount, errorCount }
      });
    }
  }

  private async insertBatch(batch: Prisma.ExecutionLogCreateManyInput[]) {
    await prisma.executionLog.createMany({
      data: batch,
      skipDuplicates: true
    });
  }
}
