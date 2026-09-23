import { Router } from "express";
import ingestionRouter from "../../modules/ingestion/routes/ingestionRoutes";

const v1Router = Router();

v1Router.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

v1Router.use("/ingestion", ingestionRouter);

export default v1Router;
