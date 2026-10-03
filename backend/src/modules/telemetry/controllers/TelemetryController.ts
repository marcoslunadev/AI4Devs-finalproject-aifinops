import { Request, Response } from "express";
import { TelemetryService } from "../services/TelemetryService";
import {
  KpiResponseSchema,
  ChartResponseSchema,
  BreakdownResponseSchema,
  OrganizationsResponseSchema,
  DepartmentExecutionsResponseSchema,
} from "../schemas/telemetrySchema";

export class TelemetryController {
  private telemetryService: TelemetryService;

  constructor() {
    this.telemetryService = new TelemetryService();
  }

  public getOrganizations = async (_req: Request, res: Response): Promise<void> => {
    try {
      const data = await this.telemetryService.getOrganizations();
      const validated = OrganizationsResponseSchema.parse(data);
      res.status(200).json(validated);
    } catch (error: any) {
      res.status(500).json({ error: "Internal server error", details: error.message });
    }
  };

  public getKpis = async (req: Request, res: Response): Promise<void> => {
    try {
      const organizationId = req.query.organizationId as string | undefined;
      const data = await this.telemetryService.getKpiMetrics(organizationId);
      const validated = KpiResponseSchema.parse(data);
      res.status(200).json(validated);
    } catch (error: any) {
      res.status(500).json({ error: "Internal server error", details: error.message });
    }
  };

  public getChart = async (req: Request, res: Response): Promise<void> => {
    try {
      const range = (req.query.range as string) || "30d";
      const organizationId = req.query.organizationId as string | undefined;
      const data = await this.telemetryService.getTimeSeriesChart(range, organizationId);
      const validated = ChartResponseSchema.parse(data);
      res.status(200).json(validated);
    } catch (error: any) {
      res.status(500).json({ error: "Internal server error", details: error.message });
    }
  };

  public getBreakdown = async (req: Request, res: Response): Promise<void> => {
    try {
      const organizationId = req.query.organizationId as string | undefined;
      const data = await this.telemetryService.getHierarchicalBreakdown(organizationId);
      const validated = BreakdownResponseSchema.parse(data);
      res.status(200).json(validated);
    } catch (error: any) {
      res.status(500).json({ error: "Internal server error", details: error.message });
    }
  };

  public getDepartmentExecutions = async (req: Request, res: Response): Promise<void> => {
    try {
      const organizationId = req.query.organizationId as string | undefined;
      const data = await this.telemetryService.getDepartmentExecutions(organizationId);
      const validated = DepartmentExecutionsResponseSchema.parse(data);
      res.status(200).json(validated);
    } catch (error: any) {
      res.status(500).json({ error: "Internal server error", details: error.message });
    }
  };

  public getStatus = async (_req: Request, res: Response): Promise<void> => {
    try {
      const data = await this.telemetryService.getIngestionStatus();
      res.status(200).json(data);
    } catch (error: any) {
      res.status(500).json({ error: "Internal server error", details: error.message });
    }
  };
}
