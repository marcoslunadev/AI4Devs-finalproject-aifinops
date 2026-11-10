import express from "express";
import cors from "cors";
import helmet from "helmet";
import { errorHandler } from "./core/middlewares/errorHandler";
import { notFoundHandler } from "./core/middlewares/notFoundHandler";
import { globalLimiter } from "./core/middlewares/rateLimitMiddleware";
import v1Router from "./api/v1";

const app = express();

// Middlewares transversales de seguridad y control de tráfico
app.use(globalLimiter);
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

const allowedOrigins = [
  "https://ai-4-devs-finalproject-aifinops-r94g597j1.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
  ...(process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",").map((o) => o.trim()) : []),
];

const corsOptions: cors.CorsOptions = {
  origin: (requestOrigin, callback) => {
    // Permitir peticiones sin Origin (ej. mobile apps, curl, herramientas de servidor)
    if (!requestOrigin || allowedOrigins.includes(requestOrigin)) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  maxAge: 86400,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "1mb" }));

// Rutas Base
app.use("/api/v1", v1Router);

// Catch 404
app.use(notFoundHandler);

// Error Handler Global
app.use(errorHandler);

export default app;
