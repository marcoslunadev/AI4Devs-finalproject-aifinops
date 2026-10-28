import { Request, Response } from "express";
import { AuthService } from "../services/AuthService";
import { z } from "zod";

const LoginSchema = z.object({
  email: z.string().min(1, "El identificador de usuario o email es obligatorio"),
  password: z.string().min(1, "La contraseña es obligatoria"),
});

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  public login = async (req: Request, res: Response): Promise<void> => {
    try {
      const parsed = LoginSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: "Datos de entrada inválidos", details: parsed.error.issues });
        return;
      }

      const result = await this.authService.login(parsed.data.email, parsed.data.password);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(401).json({ error: error.message || "Error de autenticación." });
    }
  };

  public me = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ error: "No autenticado." });
        return;
      }

      const profile = await this.authService.getProfile(req.user.userId);
      res.status(200).json(profile);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  };
}
