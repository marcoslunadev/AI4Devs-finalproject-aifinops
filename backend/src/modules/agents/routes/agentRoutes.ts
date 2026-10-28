import { Router } from "express";
import { AgentController } from "../controllers/AgentController";
import { authenticateToken } from "../../../core/middlewares/authMiddleware";

const agentRouter = Router();
const agentController = new AgentController();

agentRouter.get("/:agentId", authenticateToken, agentController.getAgentById);
agentRouter.get("/:agentId/executions", authenticateToken, agentController.getAgentExecutions);

export default agentRouter;
