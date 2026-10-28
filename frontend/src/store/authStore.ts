import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

export type UserRole = "ADMIN" | "FINOPS_VIEWER" | "USER";

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  organizationId: string;
}

export interface AuthState {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (identifier: string, passwordPlain: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (identifier: string, passwordPlain: string): Promise<boolean> => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.post<{
            token: string;
            user: AuthUser;
          }>(`${API_BASE_URL}/auth/login`, {
            email: identifier.trim(),
            password: passwordPlain,
          });

          const { token, user } = response.data;
          set({
            token,
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          return true;
        } catch (err: unknown) {
          let errorMessage = "Error de autenticación. Verifique las credenciales.";
          if (axios.isAxiosError(err) && err.response?.data?.error) {
            errorMessage = err.response.data.error;
          } else if (err instanceof Error) {
            errorMessage = err.message;
          }
          set({
            isLoading: false,
            error: errorMessage,
            isAuthenticated: false,
            token: null,
            user: null,
          });
          return false;
        }
      },

      logout: () => {
        set({
          token: null,
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: "aifinops_auth",
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
