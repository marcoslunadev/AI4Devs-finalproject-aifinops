import { Router } from "express";
import { TelemetryController } from "../controllers/TelemetryController";
import { authenticateToken } from "../../../core/middlewares/authMiddleware";

const router = Router();
const controller = new TelemetryController();

// Proteger todos los endpoints de telemetría con autenticación JWT
router.use(authenticateToken);

router.get("/organizations", controller.getOrganizations);
router.get("/kpis", controller.getKpis);
router.get("/chart", controller.getChart);
router.get("/breakdown", controller.getBreakdown);
router.get("/department-executions", controller.getDepartmentExecutions);
router.get("/status", controller.getStatus);

export default router;
