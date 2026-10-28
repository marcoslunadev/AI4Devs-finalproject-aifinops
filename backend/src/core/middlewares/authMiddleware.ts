import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Role } from "@prisma/client";
import { UserTokenPayload } from "../../modules/auth/services/AuthService";

const JWT_SECRET = process.env.JWT_SECRET || "super_secret_jwt_key_aifinops_2026";

declare global {
  namespace Express {
    interface Request {
      user?: UserTokenPayload;
    }
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "Acceso no autorizado: Token no proporcionado." });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as UserTokenPayload;
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: "Token inválido o expirado." });
    return;
  }
};

export const requireRole = (allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: "Usuario no autenticado." });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({ error: "Acceso denegado: Rol insuficiente para esta operación." });
      return;
    }

    next();
  };
};
