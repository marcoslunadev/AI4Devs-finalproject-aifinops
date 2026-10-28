import React from "react";
import { Header } from "./Header";
import { NavigationTabs } from "./NavigationTabs";
import { useTranslation } from "react-i18next";
import { ShieldCheck, Activity } from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const LayoutContent: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200 selection:bg-indigo-500 selection:text-white">
      {/* Top Header */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1750px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <NavigationTabs />
        {children}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200/80 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50 py-4 mt-12 backdrop-blur-xs">
        <div className="max-w-[1750px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>© {new Date().getFullYear()} {t("footer.rights")}</span>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
            <span>{t("footer.lastSync")}</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return <LayoutContent>{children}</LayoutContent>;
};
