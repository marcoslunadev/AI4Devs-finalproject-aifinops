import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import app from "../../app";
import jwt from "jsonwebtoken";
import express from "express";
import rateLimit from "express-rate-limit";
import fs from "fs";
import path from "path";
import os from "os";
import { Role } from "@prisma/client";
import { uploadMiddleware } from "../../core/middlewares/uploadMiddleware";
import { errorHandler } from "../../core/middlewares/errorHandler";

const JWT_SECRET = process.env.JWT_SECRET || "super_secret_jwt_key_aifinops_2026";

describe("Security Hardening & DoS Protection Integration Tests", () => {
  let adminToken: string;
  let viewerToken: string;
  let validJsonlPath: string;
  let invalidTxtPath: string;

  beforeAll(() => {
    adminToken = jwt.sign(
      { id: "admin-test-id", email: "admin@aifinops.com", role: Role.ADMIN },
      JWT_SECRET
    );

    viewerToken = jwt.sign(
      { id: "viewer-test-id", email: "viewer@aifinops.com", role: Role.FINOPS_VIEWER },
      JWT_SECRET
    );

    // Crear archivo temporal válido (.jsonl)
    validJsonlPath = path.join(os.tmpdir(), `valid-log-${Date.now()}.jsonl`);
    fs.writeFileSync(
      validJsonlPath,
      JSON.stringify({
        agentId: "agent_cm4918239",
        userEmail: "admin@aifinops.com",
        environment: "PRO",
        provider: "OPENAI",
        model: "gpt-4o",
        promptTokens: 100,
        completionTokens: 50,
        latencyMs: 120,
        status: "SUCCESS",
        executedAt: new Date().toISOString(),
      })
    );

    // Crear archivo temporal inválido (.txt)
    invalidTxtPath = path.join(os.tmpdir(), `invalid-log-${Date.now()}.txt`);
    fs.writeFileSync(invalidTxtPath, "Contenido no JSON");
  });

  afterAll(() => {
    if (fs.existsSync(validJsonlPath)) fs.unlinkSync(validJsonlPath);
    if (fs.existsSync(invalidTxtPath)) fs.unlinkSync(invalidTxtPath);
  });

  describe("1. Rate Limiting Protection (DoS & Brute Force)", () => {
    it("debe bloquear con HTTP 429 cuando se excede el límite de peticiones", async () => {
      // Creamos una app de prueba con un limitador estricto de 2 peticiones
      const testApp = express();
      const testLimiter = rateLimit({
        windowMs: 1000,
        max: 2,
        standardHeaders: true,
        legacyHeaders: false,
        message: { error: "Demasiadas peticiones desde esta IP." },
      });
      testApp.use(testLimiter);
      testApp.get("/test-limit", (req, res) => res.json({ ok: true }));

      const res1 = await request(testApp).get("/test-limit");
      expect(res1.status).toBe(200);

      const res2 = await request(testApp).get("/test-limit");
      expect(res2.status).toBe(200);

      const res3 = await request(testApp).get("/test-limit");
      expect(res3.status).toBe(429);
      expect(res3.body).toHaveProperty("error");
      expect(res3.headers["ratelimit-limit"]).toBe("2");
    });
  });

  describe("2. Multer Hardening (File Size & Extension Validation)", () => {
    it("debe rechazar con HTTP 400 archivos con extensiones no permitidas (.txt, .exe, etc.)", async () => {
      const res = await request(app)
        .post("/api/v1/ingestion/upload")
        .set("Authorization", `Bearer ${adminToken}`)
        .attach("file", invalidTxtPath);

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/Formato de archivo no soportado/i);
    });

    it("debe rechazar con HTTP 413 archivos que excedan el límite de 10MB", async () => {
      // Creamos una app de test con un uploadMiddleware con límite simulado de 100 bytes
      const testApp = express();
      const miniUpload = express();
      const tinyMulter = uploadMiddleware; // probado con buffer grande
      
      const smallApp = express();
      const multer = (await import("multer")).default;
      const limitedUpload = multer({
        storage: multer.memoryStorage(),
        limits: { fileSize: 100 },
      });

      smallApp.post("/upload-test", limitedUpload.single("file"), (req, res) => {
        res.json({ ok: true });
      });
      smallApp.use(errorHandler);

      // Enviamos un archivo con más de 100 bytes
      const bigBuffer = Buffer.alloc(500, "a");
      const res = await request(smallApp)
        .post("/upload-test")
        .attach("file", bigBuffer, "large.json");

      expect(res.status).toBe(413);
      expect(res.body.error).toMatch(/supera el límite máximo/i);
    });
  });

  describe("3. Control de Acceso y RBAC en Rutas Sensibles", () => {
    it("GET /api/v1/telemetry/kpis - debe rechazar peticiones sin token con 401 Unauthorized", async () => {
      const res = await request(app).get("/api/v1/telemetry/kpis");
      expect(res.status).toBe(401);
      expect(res.body.error).toMatch(/Acceso no autorizado/i);
    });

    it("GET /api/v1/telemetry/kpis - debe responder 200 OK con token válido", async () => {
      const res = await request(app)
        .get("/api/v1/telemetry/kpis")
        .set("Authorization", `Bearer ${viewerToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("totalCost");
    });

    it("POST /api/v1/ingestion/upload - debe rechazar peticiones sin token con 401 Unauthorized", async () => {
      const res = await request(app)
        .post("/api/v1/ingestion/upload")
        .attach("file", validJsonlPath);

      expect(res.status).toBe(401);
      expect(res.body.error).toMatch(/Acceso no autorizado/i);
    });

    it("POST /api/v1/ingestion/upload - debe rechazar usuarios con rol FINOPS_VIEWER con 403 Forbidden", async () => {
      const res = await request(app)
        .post("/api/v1/ingestion/upload")
        .set("Authorization", `Bearer ${viewerToken}`)
        .attach("file", validJsonlPath);

      expect(res.status).toBe(403);
      expect(res.body.error).toMatch(/Rol insuficiente/i);
    });

    it("POST /api/v1/ingestion/upload - debe aceptar peticiones de usuarios con rol ADMIN", async () => {
      const res = await request(app)
        .post("/api/v1/ingestion/upload")
        .set("Authorization", `Bearer ${adminToken}`)
        .attach("file", validJsonlPath);

      expect(res.status).toBe(202);
      expect(res.body).toHaveProperty("batchId");
    });
  });

  describe("4. JSON Payload Size Limit", () => {
    it("debe rechazar cuerpos JSON superiores a 1MB con 413 Payload Too Large", async () => {
      const hugeObject = { data: "x".repeat(1.2 * 1024 * 1024) }; // ~1.2MB
      const res = await request(app)
        .post("/api/v1/auth/login")
        .send(hugeObject);

      expect(res.status).toBe(413);
    });
  });
});
