import express from "express";
import cors from "cors";
import helmet from "helmet";
import { errorHandler } from "./core/middlewares/errorHandler";
import { notFoundHandler } from "./core/middlewares/notFoundHandler";
import v1Router from "./api/v1";

const app = express();

// Middlewares transversales
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rutas Base
app.use("/api/v1", v1Router);

// Catch 404
app.use(notFoundHandler);

// Error Handler Global
app.use(errorHandler);

export default app;
