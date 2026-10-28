import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../../../core/utils/db";
import { Role } from "@prisma/client";

const JWT_SECRET = process.env.JWT_SECRET || "super_secret_jwt_key_aifinops_2026";

export interface UserTokenPayload {
  userId: string;
  email: string;
  role: Role;
  organizationId: string;
}

export class AuthService {
  public async login(identifier: string, passwordPlain: string): Promise<{ token: string; user: { id: string; email: string; name: string | null; role: Role; organizationId: string } }> {
    const cleanId = identifier.trim().toLowerCase();

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: { equals: cleanId, mode: "insensitive" } },
          { name: { equals: cleanId, mode: "insensitive" } },
          cleanId === "admin" ? { email: { equals: "admin@aifinops.com", mode: "insensitive" } } : {},
          cleanId === "viewer" ? { email: { equals: "viewer@aifinops.com", mode: "insensitive" } } : {},
        ],
      },
    });

    if (!user || !user.passwordHash) {
      throw new Error("Credenciales inválidas.");
    }

    const isValid = await bcrypt.compare(passwordPlain, user.passwordHash);
    if (!isValid) {
      throw new Error("Credenciales inválidas.");
    }

    const payload: UserTokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      organizationId: user.organizationId,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        organizationId: user.organizationId,
      },
    };
  }

  public async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        organizationId: true,
        departmentId: true,
        organization: { select: { id: true, name: true } },
        department: { select: { id: true, name: true } },
      },
    });

    if (!user) {
      throw new Error("Usuario no encontrado.");
    }

    return user;
  }
}
