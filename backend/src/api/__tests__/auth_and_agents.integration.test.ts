import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../app";

describe("API Integration Tests - Auth & Agent Endpoints", () => {
  let authToken: string;

  it("POST /api/v1/auth/login - debe autenticar al usuario admin con éxito y retornar token JWT", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: "admin@acme.com",
        password: "admin123",
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body.user).toMatchObject({
      email: "admin@acme.com",
      role: "ADMIN",
    });

    authToken = res.body.token;
  });

  it("POST /api/v1/auth/login - debe autenticar al nuevo usuario maestro 'admin' con password 'Admin_M4rc0s'", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: "admin",
        password: "Admin_M4rc0s",
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body.user).toMatchObject({
      email: "admin@aifinops.com",
      role: "ADMIN",
    });
  });

  it("POST /api/v1/auth/login - debe autenticar al nuevo usuario maestro 'viewer' con password 'Viewer_M4rc0s'", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: "viewer",
        password: "Viewer_M4rc0s",
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body.user).toMatchObject({
      email: "viewer@aifinops.com",
      role: "FINOPS_VIEWER",
    });
  });

  it("POST /api/v1/auth/login - debe autenticar con email completo admin@aifinops.com y viewer@aifinops.com", async () => {
    const resAdmin = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: "admin@aifinops.com",
        password: "Admin_M4rc0s",
      });
    expect(resAdmin.status).toBe(200);
    expect(resAdmin.body.user.role).toBe("ADMIN");

    const resViewer = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: "viewer@aifinops.com",
        password: "Viewer_M4rc0s",
      });
    expect(resViewer.status).toBe(200);
    expect(resViewer.body.user.role).toBe("FINOPS_VIEWER");
  });

  it("POST /api/v1/auth/login - debe rechazar credenciales incorrectas con 401", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: "admin@acme.com",
        password: "wrong_password",
      });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("error");
  });

  it("GET /api/v1/auth/me - debe rechazar peticiones sin token con 401", async () => {
    const res = await request(app).get("/api/v1/auth/me");
    expect(res.status).toBe(401);
  });

  it("GET /api/v1/auth/me - debe retornar el perfil del usuario autenticado", async () => {
    const res = await request(app)
      .get("/api/v1/auth/me")
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("email", "admin@acme.com");
    expect(res.body).toHaveProperty("role", "ADMIN");
    expect(res.body).toHaveProperty("organization");
  });

  it("GET /api/v1/agents/:agentId - debe retornar la ficha técnica y métricas agregadas del agente", async () => {
    const res = await request(app)
      .get("/api/v1/agents/agent_cm4918239")
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id", "agent_cm4918239");
    expect(res.body).toHaveProperty("name", "Code Copilot Pro");
    expect(res.body).toHaveProperty("metrics");
    expect(res.body.metrics).toHaveProperty("totalExecutions");
    expect(res.body.metrics.totalExecutions).toBeGreaterThanOrEqual(1);
    expect(res.body.metrics).toHaveProperty("totalCostUsd");
  });

  it("GET /api/v1/agents/:agentId/executions - debe retornar las llamadas paginadas del agente", async () => {
    const res = await request(app)
      .get("/api/v1/agents/agent_cm4918239/executions?page=1&limit=5")
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("page", 1);
    expect(res.body).toHaveProperty("limit", 5);
    expect(res.body).toHaveProperty("total");
    expect(res.body).toHaveProperty("items");
    expect(Array.isArray(res.body.items)).toBe(true);
    expect(res.body.items.length).toBeLessThanOrEqual(5);
  });
});
