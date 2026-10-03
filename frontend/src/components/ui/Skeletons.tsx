import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { useTranslation } from "react-i18next";

export const KpiSkeleton: React.FC = () => {
  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-5 shadow-xs space-y-4 animate-pulse">
      <div className="flex justify-between items-start">
        <div className="space-y-2 w-2/3">
          <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-md w-24" />
          <div className="h-7 bg-slate-300 dark:bg-slate-700 rounded-lg w-32" />
        </div>
        <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800" />
      </div>
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between">
        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-md w-16" />
        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-md w-20" />
      </div>
    </div>
  );
};

export const ChartSkeleton: React.FC = () => {
  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-6 shadow-xs space-y-6 animate-pulse">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-5 bg-slate-300 dark:bg-slate-700 rounded-md w-48" />
          <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-md w-64" />
        </div>
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-xl w-32" />
      </div>
      <div className="h-64 w-full bg-slate-100 dark:bg-slate-800/60 rounded-xl flex items-end justify-between p-4 gap-2">
        {Array.from({ length: 12 }).map((_, idx) => (
          <div
            key={idx}
            className="w-full bg-slate-200 dark:bg-slate-700/50 rounded-t-md"
            style={{ height: `${30 + (idx % 5) * 15}%` }}
          />
        ))}
      </div>
    </div>
  );
};

export const TableSkeleton: React.FC = () => {
  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-6 shadow-xs space-y-4 animate-pulse">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-5 bg-slate-300 dark:bg-slate-700 rounded-md w-56" />
          <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-md w-72" />
        </div>
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-xl w-48" />
      </div>
      <div className="space-y-3 pt-2">
        {Array.from({ length: 5 }).map((_, idx) => (
          <div
            key={idx}
            className="h-10 bg-slate-100 dark:bg-slate-800/50 rounded-lg w-full flex items-center px-4 justify-between"
          >
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-md w-1/4" />
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-md w-1/6" />
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-md w-1/6" />
          </div>
        ))}
      </div>
    </div>
  );
};

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title,
  message,
  onRetry,
}) => {
  const { t } = useTranslation();
  const displayTitle = title || t("errors.defaultTitle");
  const displayMessage = message || t("errors.defaultMessage");

  return (
    <div className="rounded-2xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 p-6 text-center space-y-4 shadow-xs">
      <div className="inline-flex p-3 rounded-full bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-400">
        <AlertCircle className="w-6 h-6" />
      </div>
      <div className="space-y-1">
        <h3 className="text-base font-bold text-rose-900 dark:text-rose-200">
          {displayTitle}
        </h3>
        <p className="text-xs text-rose-700 dark:text-rose-300 max-w-md mx-auto">
          {displayMessage}
        </p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          {t("errors.retry")}
        </button>
      )}
    </div>
  );
};
