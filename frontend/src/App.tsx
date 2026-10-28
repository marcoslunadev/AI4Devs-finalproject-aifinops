import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import { DashboardLayout } from "./components/DashboardLayout";
import { Dashboard } from "./pages/Dashboard";
import { ModelAnalytics } from "./pages/ModelAnalytics";
import { ExecutionLogsView } from "./components/ExecutionLogsView";
import { LoginPage } from "./pages/LoginPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import "./App.css";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
        {/* Ruta pública de Autenticación */}
        <Route path="/login" element={<LoginPage />} />

        {/* Rutas Privadas / Protegidas con RBAC */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics/models"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <ModelAnalytics />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics/departments"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <ExecutionLogsView />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Fallback general redirige a / */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </ThemeProvider>
  );
}

export default App;
