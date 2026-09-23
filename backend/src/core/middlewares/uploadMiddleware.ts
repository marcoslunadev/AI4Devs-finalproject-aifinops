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

// Crear el middleware multer
export const uploadMiddleware = multer({ storage });
