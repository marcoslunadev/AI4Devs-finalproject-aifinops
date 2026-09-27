import React from "react";
import { useTranslation } from "react-i18next";
import { KpiCard } from "../components/KpiCard";
import { CostChart, type ChartDataPoint } from "../components/CostChart";
import { DrillDownTable, type DrillDownNode } from "../components/DrillDownTable";
import {
  DollarSign,
  Zap,
  Layers,
  TrendingUp,
  Building,
  AlertCircle,
  Sparkles,
} from "lucide-react";

// Mock Time Series Data for CostChart (30 days)
const mockChartData: ChartDataPoint[] = [
  { date: "01 Sep", cost: 1250, tokens: 12000, executions: 45000 },
  { date: "03 Sep", cost: 1400, tokens: 13500, executions: 48000 },
  { date: "05 Sep", cost: 1100, tokens: 10800, executions: 39000 },
  { date: "07 Sep", cost: 1650, tokens: 15200, executions: 52000 },
  { date: "09 Sep", cost: 1800, tokens: 17400, executions: 61000 },
  { date: "11 Sep", cost: 1550, tokens: 14900, executions: 55000 },
  { date: "13 Sep", cost: 1950, tokens: 18800, executions: 68000 },
  { date: "15 Sep", cost: 2100, tokens: 20500, executions: 72000 },
  { date: "17 Sep", cost: 1750, tokens: 16900, executions: 58000 },
  { date: "19 Sep", cost: 2300, tokens: 22100, executions: 81000 },
  { date: "21 Sep", cost: 2050, tokens: 19800, executions: 74000 },
  { date: "23 Sep", cost: 2450, tokens: 23600, executions: 89000 },
  { date: "25 Sep", cost: 2200, tokens: 21200, executions: 83000 },
  { date: "27 Sep", cost: 2600, tokens: 25100, executions: 95000 },
];

// Mock Hierarchical Data for DrillDownTable
const mockHierarchicalData: DrillDownNode[] = [
  {
    id: "org-1",
    name: "VASS Global Tech",
    type: "organization",
    status: "active",
    cost: 24850,
    executions: 980000,
    tokens: 245000,
    budget: 30000,
    children: [
      {
        id: "env-1-prod",
        name: "PROD - Production Env",
        type: "environment",
        status: "active",
        cost: 18200,
        executions: 720000,
        tokens: 180000,
        budget: 20000,
        children: [
          {
            id: "usr-1",
            name: "Customer Support Assistant (GPT-4o)",
            type: "user",
            status: "active",
            cost: 11500,
            executions: 450000,
            tokens: 112000,
            budget: 12000,
          },
          {
            id: "usr-2",
            name: "Code Copilot Enterprise (Claude 3.5)",
            type: "user",
            status: "active",
            cost: 6700,
            executions: 270000,
            tokens: 68000,
            budget: 8000,
          },
        ],
      },
      {
        id: "env-1-pre",
        name: "PRE - Staging & Testing",
        type: "environment",
        status: "active",
        cost: 4200,
        executions: 170000,
        tokens: 43000,
        budget: 6000,
        children: [
          {
            id: "usr-3",
            name: "QA Automated Testing Pipeline",
            type: "user",
            status: "active",
            cost: 4200,
            executions: 170000,
            tokens: 43000,
            budget: 6000,
          },
        ],
      },
      {
        id: "env-1-dev",
        name: "DEV - R&D Sandbox",
        type: "environment",
        status: "warning",
        cost: 2450,
        executions: 90000,
        tokens: 22000,
        budget: 2000,
        children: [
          {
            id: "usr-4",
            name: "Innovation Lab Playground",
            type: "user",
            status: "warning",
            cost: 2450,
            executions: 90000,
            tokens: 22000,
            budget: 2000,
          },
        ],
      },
    ],
  },
  {
    id: "org-2",
    name: "Banking Solutions Division",
    type: "organization",
    status: "active",
    cost: 14200,
    executions: 580000,
    tokens: 142000,
    budget: 15000,
    children: [
      {
        id: "env-2-prod",
        name: "PROD - Core Banking AI",
        type: "environment",
        status: "active",
        cost: 11000,
        executions: 450000,
        tokens: 110000,
        budget: 12000,
        children: [
          {
            id: "usr-5",
            name: "Fraud Detection Neural Agent",
            type: "user",
            status: "active",
            cost: 11000,
            executions: 450000,
            tokens: 110000,
            budget: 12000,
          },
        ],
      },
      {
        id: "env-2-dev",
        name: "DEV - Credit Risk Sandbox",
        type: "environment",
        status: "active",
        cost: 3200,
        executions: 130000,
        tokens: 32000,
        budget: 3000,
      },
    ],
  },
  {
    id: "org-3",
    name: "Retail & E-Commerce AI",
    type: "organization",
    status: "warning",
    cost: 6230,
    executions: 285200,
    tokens: 65800,
    budget: 6000,
    children: [
      {
        id: "env-3-prod",
        name: "PROD - Recommendation Engine",
        type: "environment",
        status: "warning",
        cost: 6230,
        executions: 285200,
        tokens: 65800,
        budget: 6000,
      },
    ],
  },
];

export const Dashboard: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Executive Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-indigo-200 border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Executive Overview • Q3 Telemetry
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {t("header.title")}
          </h1>
          <p className="text-sm text-indigo-200/90 leading-relaxed">
            Monitoriza en tiempo real los costes de modelos LLM, consumo de tokens por organización y eficiencia operativa en toda tu infraestructura empresarial.
          </p>
        </div>
      </div>

      {/* Top 6 KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* KPI 1: Total Cost */}
        <KpiCard
          title={t("kpis.totalCost")}
          value="$45,280"
          change={12.4}
          description={t("kpis.totalCostDesc")}
          icon={DollarSign}
          gradient="from-emerald-500 to-teal-600"
        />

        {/* KPI 2: Total Executions */}
        <KpiCard
          title={t("kpis.totalExecutions")}
          value="1.85M"
          change={8.7}
          description={t("kpis.totalExecutionsDesc")}
          icon={Zap}
          gradient="from-indigo-500 to-blue-600"
        />

        {/* KPI 3: Total Tokens */}
        <KpiCard
          title={t("kpis.totalTokens")}
          value="452.8M"
          change={15.3}
          description={t("kpis.totalTokensDesc")}
          icon={Layers}
          gradient="from-purple-500 to-pink-600"
        />

        {/* KPI 4: Avg Cost per Execution */}
        <KpiCard
          title={t("kpis.avgCostPerExec")}
          value="$0.024"
          change={-3.1}
          description={t("kpis.avgCostPerExecDesc")}
          icon={TrendingUp}
          gradient="from-amber-500 to-orange-600"
        />

        {/* KPI 5: Active Organizations */}
        <KpiCard
          title={t("kpis.activeOrgs")}
          value="8"
          badgeText="+2 New"
          badgeVariant="success"
          description={t("kpis.activeOrgsDesc")}
          icon={Building}
          gradient="from-cyan-500 to-blue-600"
        />

        {/* KPI 6: Error Rate */}
        <KpiCard
          title={t("kpis.errorRate")}
          value="0.42%"
          change={-0.15}
          description={t("kpis.errorRateDesc")}
          icon={AlertCircle}
          gradient="from-rose-500 to-red-600"
          badgeText="Optimal"
          badgeVariant="neutral"
        />
      </div>

      {/* Main Charts Section */}
      <CostChart data={mockChartData} />

      {/* Hierarchical DrillDown Table */}
      <DrillDownTable data={mockHierarchicalData} />
    </div>
  );
};
