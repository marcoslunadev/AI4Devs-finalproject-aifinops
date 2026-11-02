import { Prisma } from '@prisma/client';
import { LogAdapter } from './LogAdapter';

export class OpenAIAdapter implements LogAdapter {
  canHandle(filename: string): boolean {
    return /openai/i.test(filename);
  }

  mapRow(row: any, context?: import('./LogAdapter').FileContext): Prisma.ExecutionLogCreateManyInput | null {
    if (!row.userId || !row.model) return null;

    return {
      userId: row.userId,
      provider: 'OPENAI',
      model: row.model,
      costUsd: row.cost ? parseFloat(row.cost) : 0,
      inputCost: row.promptCost ? parseFloat(row.promptCost) : 0,
      outputCost: row.completionCost ? parseFloat(row.completionCost) : 0,
      metadata: {
        tokens: row.tokens ? parseInt(row.tokens, 10) : 0,
        promptTokens: row.promptTokens ? parseInt(row.promptTokens, 10) : 0,
        completionTokens: row.completionTokens ? parseInt(row.completionTokens, 10) : 0,
        organization: context?.organization,
        environment: context?.environment,
      },
      createdAt: row.timestamp ? new Date(row.timestamp) : new Date()
    };
  }
}
