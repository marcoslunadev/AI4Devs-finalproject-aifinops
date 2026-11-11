import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../app";

describe("CORS and Security Headers Integration Tests", () => {
  const vercelOrigin = "https://ai-4-devs-finalproject-aifinops.vercel.app";
  const arbitraryOrigin = "https://arbitrary-client.enterprise.org";
  const localhostOrigin = "http://localhost:5173";

  it("debe permitir peticiones desde el frontend desplegado en Vercel con los encabezados CORS correspondientes", async () => {
    const res = await request(app)
      .get("/api/v1/health")
      .set("Origin", vercelOrigin);

    expect(res.status).toBe(200);
    expect(res.headers["access-control-allow-origin"]).toBe(vercelOrigin);
    expect(res.headers["access-control-allow-credentials"]).toBe("true");
    expect(res.body.status).toBe("OK");
  });

  it("no debe emitir encabezados CORS para orígenes arbitrarios o no permitidos", async () => {
    const res = await request(app)
      .get("/api/v1/health")
      .set("Origin", arbitraryOrigin);

    expect(res.status).toBe(200);
    expect(res.headers["access-control-allow-origin"]).toBeUndefined();
  });

  it("debe permitir peticiones desde el entorno local de desarrollo (localhost)", async () => {
    const res = await request(app)
      .get("/api/v1/health")
      .set("Origin", localhostOrigin);

    expect(res.status).toBe(200);
    expect(res.headers["access-control-allow-origin"]).toBe(localhostOrigin);
    expect(res.headers["access-control-allow-credentials"]).toBe("true");
  });

  it("debe responder con éxito a peticiones preflight OPTIONS con cabeceras CORS de autorización", async () => {
    const res = await request(app)
      .options("/api/v1/auth/login")
      .set("Origin", vercelOrigin)
      .set("Access-Control-Request-Method", "POST")
      .set("Access-Control-Request-Headers", "Content-Type, Authorization, X-Requested-With");

    expect([200, 204]).toContain(res.status);
    expect(res.headers["access-control-allow-origin"]).toBe(vercelOrigin);
    expect(res.headers["access-control-allow-methods"]).toMatch(/POST/);
    expect(res.headers["access-control-allow-headers"]).toMatch(/Authorization/i);
    expect(res.headers["access-control-allow-headers"]).toMatch(/Content-Type/i);
    expect(res.headers["access-control-max-age"]).toBe("86400");
  });

  it("debe configurar Helmet con Cross-Origin-Resource-Policy en 'cross-origin'", async () => {
    const res = await request(app)
      .get("/api/v1/health")
      .set("Origin", vercelOrigin);

    expect(res.headers["cross-origin-resource-policy"]).toBe("cross-origin");
  });
});
