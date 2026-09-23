import { Prisma } from '@prisma/client';
import { LogAdapter } from './LogAdapter';

export class AzureAdapter implements LogAdapter {
  canHandle(filename: string): boolean {
    return /azure/i.test(filename);
  }

  mapRow(row: any, context?: import('./LogAdapter').FileContext): Prisma.ExecutionLogCreateManyInput | null {
    if (!row.user_id || !row.resourceId) return null;

    return {
      userId: row.user_id,
      aiModel: row.ai_model || 'azure-unknown',
      cost: row.total_cost ? parseFloat(row.total_cost) : 0,
      metadata: {
        resourceId: row.resourceId,
        region: row.region,
        organization: context?.organization,
        environment: context?.environment,
      },
      createdAt: row.date ? new Date(row.date) : new Date()
    };
  }
}
