import { Router } from "express";

const v1Router = Router();

v1Router.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

export default v1Router;
