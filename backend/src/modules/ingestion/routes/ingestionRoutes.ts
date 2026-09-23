import { Router } from 'express';
import { IngestionController } from '../controllers/IngestionController';
import { uploadMiddleware } from '../../../core/middlewares/uploadMiddleware';

const ingestionRouter = Router();
const ingestionController = new IngestionController();

// 4.2 Registrar la nueva ruta POST /api/v1/ingestion/upload protegida
ingestionRouter.post('/upload', uploadMiddleware.single('file'), ingestionController.uploadLogFile);

export default ingestionRouter;
