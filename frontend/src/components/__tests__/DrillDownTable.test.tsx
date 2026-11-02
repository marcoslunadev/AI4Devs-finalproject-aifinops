import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { DrillDownTable, DrillDownNode } from "../DrillDownTable";
import { MemoryRouter } from "react-router-dom";

const mockData: DrillDownNode[] = [
  {
    id: "org-1",
    name: "Acme Corporation",
    type: "organization",
    status: "active",
    cost: 4500.5,
    executions: 1200,
    tokens: 3500,
    budget: 5000,
    children: [
      {
        id: "dept-1",
        name: "Engineering",
        type: "environment",
        status: "active",
        cost: 3000.0,
        executions: 800,
        tokens: 2200,
        budget: 3500,
        children: [
          {
            id: "user-1",
            name: "John Doe",
            type: "user",
            status: "active",
            cost: 1500.0,
            executions: 400,
            tokens: 1100,
            budget: 2000,
          },
        ],
      },
    ],
  },
];

describe("DrillDownTable Component", () => {
  it("renders organization row and metrics", () => {
    render(
      <MemoryRouter>
        <DrillDownTable data={mockData} />
      </MemoryRouter>
    );

    expect(screen.getByText("Acme Corporation")).toBeInTheDocument();
    // Org-1 is expanded by default, so Engineering should be visible
    expect(screen.getAllByText("Engineering").length).toBeGreaterThan(0);
  });

  it("expands child user row when clicking on expand all button", () => {
    render(
      <MemoryRouter>
        <DrillDownTable data={mockData} />
      </MemoryRouter>
    );

    // Initially John Doe is collapsed inside Engineering
    expect(screen.queryByText("John Doe")).not.toBeInTheDocument();

    // Click on Expandir todo button
    const expandAllBtn = screen.getByRole("button", { name: /expandir todo/i });
    fireEvent.click(expandAllBtn);

    // Now John Doe should be visible
    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });

  it("filters rows by search term", () => {
    render(
      <MemoryRouter>
        <DrillDownTable data={mockData} />
      </MemoryRouter>
    );

    const searchInput = screen.getByPlaceholderText(/filtrar por nombre/i);
    fireEvent.change(searchInput, { target: { value: "Nonexistent" } });

    expect(screen.queryByText("Acme Corporation")).not.toBeInTheDocument();
  });
});
