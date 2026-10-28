import { Router } from "express";
import authRouter from "../../modules/auth/routes/authRoutes";
import agentRouter from "../../modules/agents/routes/agentRoutes";
import ingestionRouter from "../../modules/ingestion/routes/ingestionRoutes";
import telemetryRouter from "../../modules/telemetry/routes/telemetryRoutes";

const v1Router = Router();

v1Router.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

v1Router.use("/auth", authRouter);
v1Router.use("/agents", agentRouter);
v1Router.use("/ingestion", ingestionRouter);
v1Router.use("/telemetry", telemetryRouter);

export default v1Router;
