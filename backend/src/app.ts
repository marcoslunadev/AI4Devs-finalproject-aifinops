import express from "express";
import cors from "cors";
import helmet from "helmet";
import { errorHandler } from "./core/middlewares/errorHandler";

const app = express();

// Middlewares transversales
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rutas Base
const apiV1Router = express.Router();

apiV1Router.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

app.use("/api/v1", apiV1Router);

// Catch 404
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

// Error Handler Global
app.use(errorHandler);

export default app;
