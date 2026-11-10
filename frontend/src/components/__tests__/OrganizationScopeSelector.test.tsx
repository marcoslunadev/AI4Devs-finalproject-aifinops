import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { OrganizationScopeSelector } from "../OrganizationScopeSelector";
import { useFilterStore } from "../../store/filterStore";
import * as telemetryHooks from "../../hooks/useTelemetry";
import "../../lib/i18n";

vi.mock("../../hooks/useTelemetry", () => ({
  useOrganizations: vi.fn(),
}));

const mockOrganizations = [
  { id: "org-1", name: "VASS Global Tech", createdAt: "2026-01-01" },
  { id: "org-2", name: "Acme Corp", createdAt: "2026-01-01" },
];

describe("OrganizationScopeSelector Component", () => {
  beforeEach(() => {
    useFilterStore.setState({ organizationId: "" });
    vi.clearAllMocks();
  });

  it("renders disabled state while loading organizations", () => {
    vi.mocked(telemetryHooks.useOrganizations).mockReturnValue({
      data: undefined,
      isLoading: true,
    } as any);

    render(<OrganizationScopeSelector />);

    const select = screen.getByRole("combobox", { name: /seleccionar entidad/i });
    expect(select).toBeDisabled();
    expect(screen.getByText(/todas las entidades/i)).toBeInTheDocument();
  });

  it("renders organizations list when data is available", () => {
    vi.mocked(telemetryHooks.useOrganizations).mockReturnValue({
      data: mockOrganizations,
      isLoading: false,
    } as any);

    render(<OrganizationScopeSelector />);

    const select = screen.getByRole("combobox", { name: /seleccionar entidad/i });
    expect(select).not.toBeDisabled();
    expect(screen.getByText("Todas las Entidades")).toBeInTheDocument();
    expect(screen.getByText("VASS Global Tech")).toBeInTheDocument();
    expect(screen.getByText("Acme Corp")).toBeInTheDocument();
  });

  it("displays the organization currently selected in useFilterStore", () => {
    useFilterStore.setState({ organizationId: "org-2" });

    vi.mocked(telemetryHooks.useOrganizations).mockReturnValue({
      data: mockOrganizations,
      isLoading: false,
    } as any);

    render(<OrganizationScopeSelector />);

    const select = screen.getByRole("combobox", { name: /seleccionar entidad/i }) as HTMLSelectElement;
    expect(select.value).toBe("org-2");
  });

  it("updates useFilterStore when selecting an organization", () => {
    vi.mocked(telemetryHooks.useOrganizations).mockReturnValue({
      data: mockOrganizations,
      isLoading: false,
    } as any);

    render(<OrganizationScopeSelector />);

    const select = screen.getByRole("combobox", { name: /seleccionar entidad/i });
    fireEvent.change(select, { target: { value: "org-1" } });

    expect(useFilterStore.getState().organizationId).toBe("org-1");
  });

  it("clears organization filter in useFilterStore when selecting 'Todas las Entidades'", () => {
    useFilterStore.setState({ organizationId: "org-1" });

    vi.mocked(telemetryHooks.useOrganizations).mockReturnValue({
      data: mockOrganizations,
      isLoading: false,
    } as any);

    render(<OrganizationScopeSelector />);

    const select = screen.getByRole("combobox", { name: /seleccionar entidad/i });
    fireEvent.change(select, { target: { value: "" } });

    expect(useFilterStore.getState().organizationId).toBe("");
  });
});
