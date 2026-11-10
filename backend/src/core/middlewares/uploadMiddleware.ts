import multer from 'multer';
import path from 'path';
import os from 'os';

// Configurar almacenamiento temporal en el disco
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Usar la carpeta temporal del SO
    cb(null, os.tmpdir());
  },
  filename: (req, file, cb) => {
    // Generar un nombre único para evitar colisiones
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Crear el middleware multer con hardening contra DoS y tipos de archivo no válidos
export const uploadMiddleware = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB máximo
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === '.json' || ext === '.jsonl') {
      cb(null, true);
    } else {
      const err: any = new Error('Formato de archivo no soportado. Debe ser .json o .jsonl');
      err.status = 400;
      cb(err);
    }
  },
});
