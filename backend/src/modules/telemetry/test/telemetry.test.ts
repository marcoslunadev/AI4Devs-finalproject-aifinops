import { TelemetryService } from "../services/TelemetryService";
import {
  OrganizationsResponseSchema,
  DepartmentExecutionsResponseSchema,
  KpiResponseSchema,
  ChartResponseSchema,
} from "../schemas/telemetrySchema";

async function runTests() {
  console.log("🧪 Starting TelemetryService tests...");
  const service = new TelemetryService();

  // Test 1: getOrganizations
  console.log("Testing getOrganizations()...");
  const orgs = await service.getOrganizations();
  OrganizationsResponseSchema.parse(orgs);
  console.log(`✓ getOrganizations returned ${orgs.length} organizations.`);

  // Test 2: getDepartmentExecutions
  console.log("Testing getDepartmentExecutions()...");
  const deptExecs = await service.getDepartmentExecutions();
  DepartmentExecutionsResponseSchema.parse(deptExecs);
  console.log(`✓ getDepartmentExecutions returned ${deptExecs.length} execution groups.`);

  // Test 3: getKpiMetrics with optional organizationId
  console.log("Testing getKpiMetrics(orgId)...");
  const testOrgId = orgs[0]?.id;
  const kpis = await service.getKpiMetrics(testOrgId);
  KpiResponseSchema.parse(kpis);
  console.log(`✓ getKpiMetrics returned valid KPIs (activeOrgs: ${kpis.activeOrgs}).`);

  // Test 4: getTimeSeriesChart with optional organizationId
  console.log("Testing getTimeSeriesChart('30d', orgId)...");
  const chart = await service.getTimeSeriesChart("30d", testOrgId);
  ChartResponseSchema.parse(chart);
  console.log(`✓ getTimeSeriesChart returned ${chart.length} data points.`);

  console.log("✅ All TelemetryService tests passed successfully!");
}

runTests().catch((err) => {
  console.error("❌ Test failed:", err);
  process.exit(1);
});
