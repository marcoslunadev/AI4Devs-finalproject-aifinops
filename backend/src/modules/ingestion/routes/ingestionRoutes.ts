import { Router } from 'express';
import { IngestionController } from '../controllers/IngestionController';
import { uploadMiddleware } from '../../../core/middlewares/uploadMiddleware';
import { authenticateToken, requireRole } from '../../../core/middlewares/authMiddleware';
import { Role } from '@prisma/client';

const ingestionRouter = Router();
const ingestionController = new IngestionController();

// Ruta POST /api/v1/ingestion/upload protegida con autenticación y rol ADMIN
ingestionRouter.post(
  '/upload',
  authenticateToken,
  requireRole([Role.ADMIN]),
  uploadMiddleware.single('file'),
  ingestionController.uploadLogFile
);

export default ingestionRouter;
