import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { KpiCard } from "../KpiCard";
import { Activity } from "lucide-react";

describe("KpiCard Component", () => {
  it("renders title and value correctly", () => {
    render(
      <KpiCard
        title="Total Agentes"
        value="42"
        icon={Activity}
      />
    );

    expect(screen.getByText("Total Agentes")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("displays positive change percentage with up trend", () => {
    render(
      <KpiCard
        title="Coste Total"
        value="$1,250.00"
        change={15.4}
        changePeriod="vs mes anterior"
        icon={Activity}
      />
    );

    expect(screen.getByText("+15.4%")).toBeInTheDocument();
    expect(screen.getByText("vs mes anterior")).toBeInTheDocument();
  });

  it("displays negative change percentage correctly", () => {
    render(
      <KpiCard
        title="Latencia Media"
        value="450ms"
        change={-8.2}
        icon={Activity}
      />
    );

    expect(screen.getByText("-8.2%")).toBeInTheDocument();
  });

  it("renders badgeText and badgeVariant correctly", () => {
    render(
      <KpiCard
        title="Tasa de Éxito"
        value="99.8%"
        badgeText="SLA Cumplido"
        badgeVariant="success"
        icon={Activity}
      />
    );

    expect(screen.getByText("SLA Cumplido")).toBeInTheDocument();
  });
});
