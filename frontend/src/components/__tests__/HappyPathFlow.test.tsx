import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "../ProtectedRoute";
import { DrillDownTable, DrillDownNode } from "../DrillDownTable";
import { useAuthStore } from "../../store/authStore";
import "../../lib/i18n";

const mockHierarchy: DrillDownNode[] = [
  {
    id: "org-1",
    name: "TechCorp Global",
    type: "organization",
    status: "active",
    cost: 4250.75,
    executions: 850,
    tokens: 350000,
    budget: 5000,
    children: [
      {
        id: "dept-1",
        name: "IA & Data Science",
        type: "environment",
        status: "active",
        cost: 3100.25,
        executions: 620,
        tokens: 250000,
        budget: 3500,
        children: [
          {
            id: "user-1",
            name: "dev.user@techcorp.com",
            type: "user",
            status: "active",
            cost: 1800.0,
            executions: 360,
            tokens: 150000,
            budget: 2000,
          },
        ],
      },
    ],
  },
];

describe("E2E Happy Path Flow - Autenticación, Dashboard y Navegación Jerárquica", () => {
  beforeEach(() => {
    useAuthStore.setState({
      isAuthenticated: false,
      user: null,
      token: null,
      isLoading: false,
      error: null,
    });
  });

  it("Paso 1: Usuario no autenticado es redirigido fuera de rutas protegidas hacia /login", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <div data-testid="dashboard-content">Dashboard Ejecutivo</div>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<div data-testid="login-view">Pantalla de Login</div>} />
        </Routes>
      </MemoryRouter>
    );

    // No debe renderizar el contenido protegido
    expect(screen.queryByTestId("dashboard-content")).not.toBeInTheDocument();
    // Debe renderizar la pantalla de login
    expect(screen.getByTestId("login-view")).toBeInTheDocument();
  });

  it("Paso 2: Al autenticarse con éxito, el usuario accede al Dashboard y visualiza la organización", () => {
    useAuthStore.setState({
      isAuthenticated: true,
      user: {
        id: "usr_admin_01",
        email: "admin@aifinops.com",
        role: "ADMIN",
        organization: "TechCorp Global",
      },
      token: "mock_jwt_token_admin",
      isLoading: false,
    });

    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <div data-testid="dashboard-view">
                  <h1>Dashboard de Observabilidad y FinOps</h1>
                  <DrillDownTable data={mockHierarchy} />
                </div>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<div>Login</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId("dashboard-view")).toBeInTheDocument();
    expect(screen.getByText("Dashboard de Observabilidad y FinOps")).toBeInTheDocument();
    expect(screen.getByText("TechCorp Global")).toBeInTheDocument();
  });

  it("Paso 3: La matriz Drill-Down muestra departamentos y permite expandir hasta el nivel de usuario", () => {
    render(
      <MemoryRouter>
        <DrillDownTable data={mockHierarchy} />
      </MemoryRouter>
    );

    // Nivel 1 (Organización) y Nivel 2 (Departamento) visibles por defecto
    expect(screen.getByText("TechCorp Global")).toBeInTheDocument();
    expect(screen.getAllByText("IA & Data Science").length).toBeGreaterThan(0);

    // El usuario final dev.user@techcorp.com está colapsado inicialmente
    expect(screen.queryByText("dev.user@techcorp.com")).not.toBeInTheDocument();

    // Hacemos clic en 'Expandir todo'
    const expandAllBtn = screen.getByRole("button", { name: /expandir todo/i });
    fireEvent.click(expandAllBtn);

    // Tras expandir todo, el usuario debe ser visible en el árbol
    expect(screen.getByText("dev.user@techcorp.com")).toBeInTheDocument();
  });

  it("Paso 4: El buscador de la matriz jerárquica filtra elementos dinámicamente", () => {
    render(
      <MemoryRouter>
        <DrillDownTable data={mockHierarchy} />
      </MemoryRouter>
    );

    const searchInput = screen.getByPlaceholderText(/filtrar por nombre/i);
    fireEvent.change(searchInput, { target: { value: "EntidadInexistenteXYZ" } });

    expect(screen.queryByText("TechCorp Global")).not.toBeInTheDocument();
  });
});
