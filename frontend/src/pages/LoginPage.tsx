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
    <div className="min-h-screen w-full flex flex-col justify-between bg-[#f8fafc] dark:bg-[#080b11] text-slate-900 dark:text-slate-100 transition-colors duration-200 relative overflow-hidden select-none">
      {/* Decorative gradient glow backgrounds */}
      <div className="absolute top-[-10%] left-[-10%] w-[550px] h-[550px] bg-cyan-500/15 dark:bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[550px] h-[550px] bg-emerald-500/15 dark:bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Navbar with Language and Theme switches */}
      <div className="w-full max-w-7xl mx-auto px-6 py-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-teal-500 to-emerald-500 p-0.5 shadow-md shadow-cyan-500/20 shrink-0">
            <div className="w-full h-full bg-slate-900 dark:bg-[#080b11] rounded-[10px] flex items-center justify-center text-white">
              <Cpu className="w-4 h-4 text-cyan-400" />
            </div>
          </div>
          <span className="font-extrabold text-xl tracking-tight font-heading bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
            AIFinOps
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Language Switcher */}
          <div className="flex items-center bg-white dark:bg-[#171e2e] p-1 rounded-xl border border-slate-200/80 dark:border-white/10 shadow-xs">
            <Globe className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 ml-1.5 mr-1" />
            <button
              onClick={() => handleLanguageChange("es")}
              className={`px-2.5 py-0.5 text-xs font-semibold rounded-lg transition-all ${
                i18n.language?.startsWith("es")
                  ? "bg-gradient-to-r from-cyan-500 to-emerald-500 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              ES
            </button>
            <button
              onClick={() => handleLanguageChange("en")}
              className={`px-2.5 py-0.5 text-xs font-semibold rounded-lg transition-all ${
                i18n.language?.startsWith("en")
                  ? "bg-gradient-to-r from-cyan-500 to-emerald-500 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              EN
            </button>
          </div>

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-white dark:bg-[#171e2e] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1f293d] border border-slate-200/80 dark:border-white/10 hover:border-cyan-500/40 transition-all shadow-xs"
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-cyan-600" />
            )}
          </button>
        </div>
      </div>

      {/* Main Login Form Container */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 z-10">
        <div className="w-full max-w-md bg-white/85 dark:bg-[#0f1420]/90 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 rounded-3xl shadow-2xl p-8 transition-all">
          
          {/* Header & Title */}
          <div className="text-center mb-6">
            <div className="mx-auto mb-3.5 h-12 w-12 rounded-2xl bg-gradient-to-tr from-cyan-500 via-teal-500 to-emerald-500 p-0.5 shadow-lg shadow-cyan-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-slate-900 dark:bg-[#080b11] rounded-[14px] flex items-center justify-center text-white">
                <Cpu className="w-6 h-6 text-cyan-400" />
              </div>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 dark:bg-cyan-950/60 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 text-xs font-semibold mb-3 font-heading">
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
              <span>{t("auth.loginSubtitle")}</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white font-heading">
              {t("auth.loginTitle")}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Plataforma de Observabilidad y Gobernanza de Costes IA
            </p>
          </div>

          {/* 
            Credenciales de prueba para evaluación (véase README.md Sección 0.6):
            - Administrador: admin@aifinops.com (o admin) / Admin_M4rc0s
            - Visor FinOps: viewer@aifinops.com (o viewer) / Viewer_M4rc0s
          */}


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
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 font-heading"
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
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-[#171e2e] border border-slate-300 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 transition"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 font-heading"
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
                  className="w-full pl-9 pr-10 py-2 text-sm rounded-xl bg-slate-50 dark:bg-[#171e2e] border border-slate-300 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 transition"
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
              className="w-full mt-2 py-2.5 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 hover:opacity-95 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer font-heading"
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
      <div className="w-full py-4 text-center text-xs text-slate-500 dark:text-slate-400 z-10 border-t border-slate-200/60 dark:border-white/10 bg-white/40 dark:bg-[#0f1420]/40 backdrop-blur-md font-heading">
        © {new Date().getFullYear()} AIFinOps Telemetry Platform • Marcos Luna Personal Brand
      </div>
    </div>
  );
};

export default LoginPage;
