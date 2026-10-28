import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "../store/authStore";
import {
  Cpu,
  Sparkles,
  Lock,
  User,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  ShieldAlert,
  BarChart3,
  Sun,
  Moon,
  Globe,
} from "lucide-react";
import { useTheme } from "../components/ThemeProvider";

export const LoginPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const { isAuthenticated, isLoading, error, login, clearError } = useAuthStore();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  // Redirigir si el usuario ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      const target = (location.state as { from?: { pathname?: string } })?.from?.pathname || "/";
      navigate(target, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  const handleFillDemo = (userVal: string, passVal: string) => {
    setIdentifier(userVal);
    setPassword(passVal);
    setLocalError(null);
    clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    if (!identifier.trim() || !password) {
      setLocalError(t("auth.emptyFieldsError"));
      return;
    }

    const success = await login(identifier, password);
    if (success) {
      const target = (location.state as { from?: { pathname?: string } })?.from?.pathname || "/";
      navigate(target, { replace: true });
    }
  };

  const activeError = localError || error;

  return (
    <div className="min-h-screen w-full flex flex-col justify-between bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200 relative overflow-hidden select-none">
      {/* Decorative gradient glow backgrounds */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/10 dark:bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-500/10 dark:bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Navbar with Language and Theme switches */}
      <div className="w-full max-w-7xl mx-auto px-6 py-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 shadow-md shadow-indigo-500/20">
            <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center text-white">
              <Cpu className="w-4 h-4 text-indigo-400" />
            </div>
          </div>
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-800 dark:from-white dark:via-indigo-200 dark:to-slate-300 bg-clip-text text-transparent">
            AIFinOps
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Language Switcher */}
          <div className="flex items-center bg-white dark:bg-slate-900 p-1 rounded-lg border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
            <Globe className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 ml-1.5 mr-1" />
            <button
              onClick={() => handleLanguageChange("es")}
              className={`px-2 py-0.5 text-xs font-semibold rounded-md transition-all ${
                i18n.language?.startsWith("es")
                  ? "bg-indigo-600 text-white"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              ES
            </button>
            <button
              onClick={() => handleLanguageChange("en")}
              className={`px-2 py-0.5 text-xs font-semibold rounded-md transition-all ${
                i18n.language?.startsWith("en")
                  ? "bg-indigo-600 text-white"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              EN
            </button>
          </div>

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800/80 transition-all shadow-xs"
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600" />
            )}
          </button>
        </div>
      </div>

      {/* Main Login Form Container */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 z-10">
        <div className="w-full max-w-md bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-xl p-8 transition-all">
          
          {/* Header & Title */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800/50 text-indigo-600 dark:text-indigo-400 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>{t("auth.loginSubtitle")}</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {t("auth.loginTitle")}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Plataforma de Observabilidad y Gobernanza de Costes IA
            </p>
          </div>

          {/* Quick Demo Access Buttons */}
          <div className="mb-6 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              {t("auth.demoAccessTitle")}
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleFillDemo("admin", "Admin_M4rc0s")}
                className="flex items-center justify-center gap-1.5 px-2.5 py-2 text-xs font-medium rounded-lg bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/40 dark:hover:bg-purple-950/70 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60 transition-colors"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                <span>Admin</span>
              </button>
              <button
                type="button"
                onClick={() => handleFillDemo("viewer", "Viewer_M4rc0s")}
                className="flex items-center justify-center gap-1.5 px-2.5 py-2 text-xs font-medium rounded-lg bg-cyan-50 hover:bg-cyan-100 dark:bg-cyan-950/40 dark:hover:bg-cyan-950/70 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800/60 transition-colors"
              >
                <BarChart3 className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                <span>Viewer</span>
              </button>
            </div>
          </div>

          {/* Error Banner */}
          {activeError && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-start gap-2.5 text-rose-700 dark:text-rose-300 text-xs animate-shake">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{activeError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="identifier"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
              >
                {t("auth.identifierLabel")}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="identifier"
                  type="text"
                  autoComplete="username"
                  value={identifier}
                  onChange={(e) => {
                    setIdentifier(e.target.value);
                    if (activeError) clearError();
                    if (localError) setLocalError(null);
                  }}
                  placeholder={t("auth.identifierPlaceholder")}
                  disabled={isLoading}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 transition"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
              >
                {t("auth.passwordLabel")}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (activeError) clearError();
                    if (localError) setLocalError(null);
                  }}
                  placeholder={t("auth.passwordPlaceholder")}
                  disabled={isLoading}
                  className="w-full pl-9 pr-10 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
                  aria-label={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-2.5 px-4 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-indigo-600 via-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-indigo-500/25 transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{t("auth.submitting")}</span>
                </>
              ) : (
                <span>{t("auth.submitButton")}</span>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <div className="w-full py-4 text-center text-xs text-slate-500 dark:text-slate-400 z-10 border-t border-slate-200/60 dark:border-slate-800/60 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xs">
        © {new Date().getFullYear()} AIFinOps Telemetry Platform • RBAC Enterprise Security
      </div>
    </div>
  );
};

export default LoginPage;
