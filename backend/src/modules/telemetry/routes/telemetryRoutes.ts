import { Router } from "express";
import { TelemetryController } from "../controllers/TelemetryController";

const router = Router();
const controller = new TelemetryController();

router.get("/kpis", controller.getKpis);
router.get("/chart", controller.getChart);
router.get("/breakdown", controller.getBreakdown);

export default router;
