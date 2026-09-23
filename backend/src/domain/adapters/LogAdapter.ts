import { Prisma } from '@prisma/client';

export interface FileContext {
  organization: string;
  environment: string;
}

export interface LogAdapter {
  canHandle(filename: string): boolean;
  mapRow(row: any, context?: FileContext): Prisma.ExecutionLogCreateManyInput | null;
}
