import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { IngestionService, LogRecordSchema } from "../services/IngestionService";
import { AgentRepository } from "../../../domain/repositories/AgentRepository";
import { prisma } from "../../../core/utils/db";
import fs from "fs";
import path from "path";
import os from "os";

describe("IngestionService & AgentRepository Integration", () => {
  let tempFilePath: string;
  let batchId: string;
  const ingestionService = new IngestionService();
  const agentRepo = new AgentRepository();

  beforeAll(async () => {
    // Crear archivo temporal JSONL con registros válidos, comentarios y casos límite
    tempFilePath = path.join(os.tmpdir(), `test-ingestion-${Date.now()}.jsonl`);
    const lines = [
      "// Línea de comentario que debe ignorarse",
      "",
      JSON.stringify({
        agentId: "agent_cm4918239",
        userEmail: "admin@acme.com",
        environment: "PRO",
        provider: "OPENAI",
        model: "gpt-4o",
        promptTokens: 1000,
        completionTokens: 200,
        latencyMs: 450,
        status: "SUCCESS",
        executedAt: new Date().toISOString(),
      }) + ",",
      JSON.stringify({
        userEmail: "new.user.generated@acme.com",
        environment: "DEV",
        provider: "OPENAI",
        model: "gpt-4o-mini",
        promptTokens: 500,
        completionTokens: 100,
        latencyMs: 250,
        status: "TIMEOUT",
        executedAt: new Date().toISOString(),
      }),
      "{ malformed_json_line: true",
    ];
    fs.writeFileSync(tempFilePath, lines.join("\n"));

    const batch = await prisma.ingestionBatch.create({
      data: {
        fileName: "test-ingestion.jsonl",
        fileSizeBytes: 1024,
        status: "PROCESSING",
      },
    });
    batchId = batch.id;
  });

  afterAll(async () => {
    if (fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
    }
    if (batchId) {
      await prisma.ingestionBatch.deleteMany({ where: { id: batchId } });
    }
  });

  it("LogRecordSchema - debe validar correctamente registros válidos", () => {
    const valid = {
      userEmail: "dev@acme.com",
      provider: "OPENAI",
      model: "gpt-4o",
      promptTokens: 100,
      completionTokens: 50,
      latencyMs: 300,
      status: "SUCCESS",
    };
    const parsed = LogRecordSchema.parse(valid);
    expect(parsed.userEmail).toBe("dev@acme.com");
    expect(parsed.status).toBe("SUCCESS");
  });

  it("LogRecordSchema - debe rechazar registros sin email válido", () => {
    const invalid = {
      userEmail: "not-an-email",
      provider: "OPENAI",
      model: "gpt-4o",
      promptTokens: 100,
      completionTokens: 50,
    };
    expect(() => LogRecordSchema.parse(invalid)).toThrow();
  });

  it("IngestionService.processFile - debe procesar el archivo por streaming y actualizar el batch", async () => {
    await ingestionService.processFile(batchId, tempFilePath);

    const updatedBatch = await prisma.ingestionBatch.findUnique({
      where: { id: batchId },
    });

    expect(updatedBatch).not.toBeNull();
    expect(updatedBatch?.status).toBe("COMPLETED");
    expect(updatedBatch?.totalRecords).toBe(3);
    expect(updatedBatch?.processedRecords).toBe(2);
    expect(updatedBatch?.failedRecords).toBe(1);
  });

  it("AgentRepository.listAll - debe listar todos los agentes con sus relaciones", async () => {
    const agents = await agentRepo.listAll();
    expect(Array.isArray(agents)).toBe(true);
    expect(agents.length).toBeGreaterThanOrEqual(1);
    expect(agents[0]).toHaveProperty("organization");
  });

  it("AgentRepository.listByOrganization - debe listar agentes filtrando por organización", async () => {
    const org = await prisma.organization.findFirst();
    if (org) {
      const agents = await agentRepo.listByOrganization(org.id);
      expect(Array.isArray(agents)).toBe(true);
      agents.forEach((ag) => {
        expect(ag.organizationId).toBe(org.id);
      });
    }
  });

  it("POST /api/v1/ingestion/upload - debe aceptar un archivo válido y responder 202 con batchId", async () => {
    const request = (await import("supertest")).default;
    const app = (await import("../../../app")).default;

    const res = await request(app)
      .post("/api/v1/ingestion/upload")
      .attach("file", tempFilePath);

    expect(res.status).toBe(202);
    expect(res.body).toHaveProperty("batchId");
    expect(res.body).toHaveProperty("status", "PROCESSING");

    // Limpiar batch de prueba creado
    if (res.body.batchId) {
      await prisma.ingestionBatch.deleteMany({ where: { id: res.body.batchId } });
    }
  });

  it("POST /api/v1/ingestion/upload - debe rechazar peticiones sin archivo con 400", async () => {
    const request = (await import("supertest")).default;
    const app = (await import("../../../app")).default;

    const res = await request(app).post("/api/v1/ingestion/upload");
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });
});
