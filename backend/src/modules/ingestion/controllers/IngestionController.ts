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
        res.status(400).json({ error: 'No se ha adjuntado ningún archivo para procesar.' });
        return;
      }

      const fileId = randomUUID();

      const batch = await this.ingestionService.startIngestion(
        fileId,
        req.file.path,
        req.file.originalname,
        req.file.size
      );

      res.status(202).json({
        message: 'Archivo recibido correctamente. Procesamiento de lote iniciado.',
        batchId: batch.id,
        fileName: batch.fileName,
        status: batch.status,
      });
    } catch (error: any) {
      res.status(500).json({ error: 'Error interno del servidor durante la ingesta', details: error.message });
    }
  };
}
