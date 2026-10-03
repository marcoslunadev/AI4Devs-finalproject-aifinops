import { Router } from "express";
import { TelemetryController } from "../controllers/TelemetryController";

const router = Router();
const controller = new TelemetryController();

router.get("/organizations", controller.getOrganizations);
router.get("/kpis", controller.getKpis);
router.get("/chart", controller.getChart);
router.get("/breakdown", controller.getBreakdown);
router.get("/department-executions", controller.getDepartmentExecutions);
router.get("/status", controller.getStatus);

export default router;
