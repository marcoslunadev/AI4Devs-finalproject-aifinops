import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { ProtectedRoute } from "../ProtectedRoute";
import { useAuthStore } from "../../store/authStore";
import { MemoryRouter, Routes, Route } from "react-router-dom";

describe("ProtectedRoute Component", () => {
  beforeEach(() => {
    useAuthStore.setState({
      isAuthenticated: false,
      user: null,
      token: null,
    });
  });

  it("redirects unauthenticated users to /login", () => {
    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <div>Contenido Protegido</div>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<div>Página de Login</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.queryByText("Contenido Protegido")).not.toBeInTheDocument();
    expect(screen.getByText("Página de Login")).toBeInTheDocument();
  });

  it("renders protected content when user is authenticated", () => {
    useAuthStore.setState({
      isAuthenticated: true,
      user: {
        id: "usr_1",
        email: "admin@acme.com",
        name: "Admin User",
        role: "ADMIN",
        organizationId: "org_1",
      },
      token: "mock_jwt_token",
    });

    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <div>Contenido Protegido</div>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<div>Página de Login</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Contenido Protegido")).toBeInTheDocument();
    expect(screen.queryByText("Página de Login")).not.toBeInTheDocument();
  });
});
