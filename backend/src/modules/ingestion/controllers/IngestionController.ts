import { Request, Response } from 'express';
import { IngestionService } from '../services/IngestionService';
import { randomUUID } from 'crypto';

export class IngestionController {
  private ingestionService: IngestionService;

  constructor() {
    this.ingestionService = new IngestionService();
  }

  public uploadLogFile = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({ error: 'No file uploaded' });
        return;
      }

      const fileId = randomUUID();
      
      const auditLog = await this.ingestionService.startIngestion(
        fileId,
        req.file.path,
        req.file.originalname
      );

      res.status(202).json({
        message: 'File upload accepted and processing started in the background.',
        auditLogId: auditLog.id,
        fileId: fileId
      });
    } catch (error: any) {
      res.status(500).json({ error: 'Internal server error', details: error.message });
    }
  };
}
