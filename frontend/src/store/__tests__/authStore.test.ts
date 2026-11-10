import axios from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useAuthStore } from "../authStore";

vi.mock("axios", () => ({
  default: {
    post: vi.fn(),
    isAxiosError: (error: unknown) => Boolean((error as { isAxiosError?: boolean })?.isAxiosError),
  },
}));

const mockedPost = vi.mocked(axios.post);

describe("useAuthStore", () => {
  beforeEach(() => {
    localStorage.clear();
    mockedPost.mockReset();
    useAuthStore.setState({
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  });

  it("logs in with a trimmed identifier and persists the authenticated user", async () => {
    const user = {
      id: "user-1",
      email: "admin@aifinops.com",
      name: "Admin",
      role: "ADMIN" as const,
      organizationId: "org-1",
    };
    mockedPost.mockResolvedValue({ data: { token: "jwt-token", user } });

    await expect(useAuthStore.getState().login("  admin@aifinops.com  ", "secret")).resolves.toBe(true);

    expect(mockedPost).toHaveBeenCalledWith("http://localhost:3000/api/v1/auth/login", {
      email: "admin@aifinops.com",
      password: "secret",
    });
    expect(useAuthStore.getState()).toMatchObject({
      token: "jwt-token",
      user,
      isAuthenticated: true,
      isLoading: false,
      error: null,
    });
  });

  it("uses the API error returned by Axios when credentials are rejected", async () => {
    mockedPost.mockRejectedValue({
      isAxiosError: true,
      response: { data: { error: "Credenciales inválidas" } },
    });

    await expect(useAuthStore.getState().login("user@example.com", "bad")).resolves.toBe(false);
    expect(useAuthStore.getState()).toMatchObject({
      isAuthenticated: false,
      token: null,
      user: null,
      isLoading: false,
      error: "Credenciales inválidas",
    });
  });

  it("uses Error and fallback messages for non-Axios login failures", async () => {
    mockedPost.mockRejectedValueOnce(new Error("Network down"));
    await expect(useAuthStore.getState().login("user@example.com", "bad")).resolves.toBe(false);
    expect(useAuthStore.getState().error).toBe("Network down");

    mockedPost.mockRejectedValueOnce("unknown failure");
    await expect(useAuthStore.getState().login("user@example.com", "bad")).resolves.toBe(false);
    expect(useAuthStore.getState().error).toBe("Error de autenticación. Verifique las credenciales.");
  });

  it("clears authentication and errors on logout and clearError", () => {
    useAuthStore.setState({
      token: "jwt-token",
      user: {
        id: "user-1",
        email: "user@example.com",
        name: null,
        role: "FINOPS_VIEWER",
        organizationId: "org-1",
      },
      isAuthenticated: true,
      isLoading: true,
      error: "old error",
    });

    useAuthStore.getState().clearError();
    expect(useAuthStore.getState().error).toBeNull();
    useAuthStore.getState().logout();
    expect(useAuthStore.getState()).toMatchObject({
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  });
});
