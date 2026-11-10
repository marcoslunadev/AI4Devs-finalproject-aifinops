import { describe, it, expect, beforeEach, vi } from "vitest";
import { TelemetryController } from "../controllers/TelemetryController";

describe("TelemetryController", () => {
  let controller: TelemetryController;
  let req: any;
  let res: any;

  beforeEach(() => {
    controller = new TelemetryController();
    req = { query: {} };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };
  });

  it("getOrganizations should respond with HTTP 200 and organization array", async () => {
    await controller.getOrganizations(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.any(Array));
  });

  it("getKpis should respond with HTTP 200 and KPI metrics object", async () => {
    await controller.getKpis(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    const data = res.json.mock.calls[0][0];
    expect(data).toHaveProperty("totalCost");
    expect(data).toHaveProperty("totalExecutions");
    expect(data).toHaveProperty("activeOrgs");
  });

  it("getChart should respond with HTTP 200 and chart points", async () => {
    req.query.range = "7d";
    await controller.getChart(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    const data = res.json.mock.calls[0][0];
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBe(7);
  });

  it("getBreakdown should respond with HTTP 200 and breakdown tree", async () => {
    await controller.getBreakdown(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.any(Array));
  });

  it("getDepartmentExecutions should respond with HTTP 200 and department execution array", async () => {
    await controller.getDepartmentExecutions(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.any(Array));
  });

  it("getProviderDistribution should respond with HTTP 200 and provider distribution array", async () => {
    await controller.getProviderDistribution(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.any(Array));
  });

  it("getStatus should respond with HTTP 200 and ingestion status", async () => {
    await controller.getStatus(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    const data = res.json.mock.calls[0][0];
    expect(data).toHaveProperty("status");
  });

  it("should handle service errors gracefully with HTTP 500 status", async () => {
    (controller as any).telemetryService = {
      getOrganizations: vi.fn().mockRejectedValue(new Error("Database connection lost")),
      getKpiMetrics: vi.fn().mockRejectedValue(new Error("Database error")),
      getTimeSeriesChart: vi.fn().mockRejectedValue(new Error("Database error")),
      getHierarchicalBreakdown: vi.fn().mockRejectedValue(new Error("Database error")),
      getDepartmentExecutions: vi.fn().mockRejectedValue(new Error("Database error")),
      getProviderDistribution: vi.fn().mockRejectedValue(new Error("Database error")),
      getIngestionStatus: vi.fn().mockRejectedValue(new Error("Database error")),
    };

    await controller.getOrganizations(req, res);
    expect(res.status).toHaveBeenCalledWith(500);

    await controller.getKpis(req, res);
    expect(res.status).toHaveBeenCalledWith(500);

    await controller.getChart(req, res);
    expect(res.status).toHaveBeenCalledWith(500);

    await controller.getBreakdown(req, res);
    expect(res.status).toHaveBeenCalledWith(500);

    await controller.getDepartmentExecutions(req, res);
    expect(res.status).toHaveBeenCalledWith(500);

    await controller.getProviderDistribution(req, res);
    expect(res.status).toHaveBeenCalledWith(500);

    await controller.getStatus(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});
