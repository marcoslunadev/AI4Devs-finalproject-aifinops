import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { authenticateToken } from "../../../core/middlewares/authMiddleware";
import { authLimiter } from "../../../core/middlewares/rateLimitMiddleware";

const authRouter = Router();
const authController = new AuthController();

authRouter.post("/login", authLimiter, authController.login);
authRouter.get("/me", authenticateToken, authController.me);

export default authRouter;
