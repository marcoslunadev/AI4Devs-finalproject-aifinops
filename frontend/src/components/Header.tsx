import React from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "./ThemeProvider";
import {
  Sun,
  Moon,
  Globe,
  Bell,
  Cpu,
  Search,
  Sparkles,
  UserCheck,
} from "lucide-react";

export const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  const currentLang = i18n.language || "es";

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors duration-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 shadow-md shadow-indigo-500/20">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center text-white">
                <Cpu className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-800 dark:from-white dark:via-indigo-200 dark:to-slate-300 bg-clip-text text-transparent">
                  AIFinOps
                </span>
                <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase bg-indigo-100 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300 dark:border dark:border-indigo-800/50 rounded-full flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-indigo-500 animate-pulse" />
                  Executive
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                {t("header.subtitle")}
              </p>
            </div>
          </div>

          {/* Search Bar & Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Search Input */}
            <div className="relative hidden md:block w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder={t("header.searchPlaceholder")}
                className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-lg text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition"
              />
            </div>

            {/* Language Switcher */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200/80 dark:border-slate-700/80">
              <Globe className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 ml-1.5 mr-1 hidden xs:block" />
              <button
                onClick={() => handleLanguageChange("es")}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                  currentLang.startsWith("es")
                    ? "bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
                title="Español"
              >
                ES
              </button>
              <button
                onClick={() => handleLanguageChange("en")}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                  currentLang.startsWith("en")
                    ? "bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
                title="English"
              >
                EN
              </button>
            </div>

            {/* Dark / Light Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700/80 transition-all shadow-xs"
              aria-label="Toggle Theme"
              title={theme === "dark" ? t("header.themeLight") : t("header.themeDark")}
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600 hover:-rotate-12 transition-transform" />
              )}
            </button>

            {/* Notifications */}
            <button
              className="relative p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700/80 transition shadow-xs hidden xs:flex"
              title={t("header.notifications")}
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900 animate-pulse" />
            </button>

            {/* Profile Avatar */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs ring-2 ring-indigo-500/20">
                <UserCheck className="w-4 h-4" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};
