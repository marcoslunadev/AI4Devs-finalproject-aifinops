import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { authenticateToken } from "../../../core/middlewares/authMiddleware";

const authRouter = Router();
const authController = new AuthController();

authRouter.post("/login", authController.login);
authRouter.get("/me", authenticateToken, authController.me);

export default authRouter;
