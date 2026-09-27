import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ChevronRight,
  ChevronDown,
  Building2,
  Server,
  User,
  Search,
  Maximize2,
  Minimize2,
  MoreVertical,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

export interface DrillDownNode {
  id: string;
  name: string;
  type: "organization" | "environment" | "user";
  status: "active" | "warning" | "inactive";
  cost: number;
  executions: number;
  tokens: number; // in thousands
  budget: number;
  children?: DrillDownNode[];
}

interface DrillDownTableProps {
  data: DrillDownNode[];
}

export const DrillDownTable: React.FC<DrillDownTableProps> = ({ data }) => {
  const { t } = useTranslation();
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    new Set(["org-1"]) // expand first org by default
  );
  const [searchTerm, setSearchTerm] = useState("");

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const expandAll = () => {
    const allIds = new Set<string>();
    const collectIds = (nodes: DrillDownNode[]) => {
      nodes.forEach((n) => {
        if (n.children && n.children.length > 0) {
          allIds.add(n.id);
          collectIds(n.children);
        }
      });
    };
    collectIds(data);
    setExpandedIds(allIds);
  };

  const collapseAll = () => {
    setExpandedIds(new Set());
  };

  // Helper to format currency
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(val);
  };

  // Helper to format large numbers
  const formatNumber = (val: number) => {
    return new Intl.NumberFormat("en-US").format(val);
  };

  // Filter tree recursively
  const filterTree = (nodes: DrillDownNode[]): DrillDownNode[] => {
    if (!searchTerm.trim()) return nodes;
    const term = searchTerm.toLowerCase();

    return nodes.reduce<DrillDownNode[]>((acc, node) => {
      const nameMatches = node.name.toLowerCase().includes(term);
      const filteredChildren = node.children ? filterTree(node.children) : [];

      if (nameMatches || filteredChildren.length > 0) {
        acc.push({
          ...node,
          children: filteredChildren.length > 0 ? filteredChildren : node.children,
        });
      }
      return acc;
    }, []);
  };

  const filteredData = filterTree(data);

  // Render node icon according to type
  const renderIcon = (type: DrillDownNode["type"]) => {
    switch (type) {
      case "organization":
        return <Building2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" />;
      case "environment":
        return <Server className="w-3.5 h-3.5 text-purple-500 shrink-0" />;
      case "user":
        return <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />;
    }
  };

  // Render Status Badge
  const renderStatus = (status: DrillDownNode["status"]) => {
    if (status === "active") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-400 whitespace-nowrap">
          <CheckCircle2 className="w-2.5 h-2.5" /> Active
        </span>
      );
    }
    if (status === "warning") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-400 whitespace-nowrap">
          <AlertTriangle className="w-2.5 h-2.5" /> Warning
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 whitespace-nowrap">
        Inactive
      </span>
    );
  };

  // Render Budget Burn Bar
  const renderBurnBar = (cost: number, budget: number) => {
    if (!budget || budget === 0) return <span className="text-slate-400">—</span>;
    const pct = Math.min(Math.round((cost / budget) * 100), 100);

    let colorClass = "bg-emerald-500";
    if (pct >= 90) colorClass = "bg-rose-500";
    else if (pct >= 75) colorClass = "bg-amber-500";

    return (
      <div className="w-24 sm:w-28 space-y-1">
        <div className="flex justify-between text-[10px] font-semibold">
          <span className="text-slate-700 dark:text-slate-300">{pct}%</span>
          <span className="text-slate-400 font-mono">{formatCurrency(budget)}</span>
        </div>
        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full ${colorClass} rounded-full transition-all duration-500`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    );
  };

  // Recursive Table Row Renderer
  const renderRows = (nodes: DrillDownNode[], level: number = 0) => {
    return nodes.map((node) => {
      const isExpanded = expandedIds.has(node.id) || searchTerm.length > 0;
      const hasChildren = node.children && node.children.length > 0;

      return (
        <React.Fragment key={node.id}>
          <tr
            className={`group transition-colors ${
              level === 0
                ? "bg-slate-50/50 dark:bg-slate-900/50 hover:bg-indigo-50/40 dark:hover:bg-indigo-950/30 font-semibold"
                : level === 1
                ? "bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                : "bg-slate-50/30 dark:bg-slate-950/40 hover:bg-slate-100/50 dark:hover:bg-slate-900/80 text-xs"
            } border-b border-slate-200/60 dark:border-slate-800/60`}
          >
            {/* Entity / Name with indent */}
            <td className="py-2.5 px-3 text-slate-900 dark:text-slate-100 max-w-[200px] sm:max-w-[280px]">
              <div
                className="flex items-center gap-1.5 min-w-0"
                style={{ paddingLeft: `${level * 0.85}rem` }}
              >
                {hasChildren ? (
                  <button
                    onClick={() => toggleExpand(node.id)}
                    className="p-0.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition shrink-0"
                    aria-label="Toggle Expand"
                  >
                    {isExpanded ? (
                      <ChevronDown className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5" />
                    )}
                  </button>
                ) : (
                  <span className="w-4 shrink-0" />
                )}
                {renderIcon(node.type)}
                <span className="truncate text-xs">{node.name}</span>
                {node.type === "organization" && (
                  <span className="px-1 py-0.2 text-[9px] font-bold uppercase bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 rounded border border-indigo-200 dark:border-indigo-800/60 shrink-0">
                    Org
                  </span>
                )}
                {node.type === "environment" && (
                  <span className="px-1 py-0.2 text-[9px] font-bold uppercase bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 rounded border border-purple-200 dark:border-purple-800/60 shrink-0 hidden sm:inline">
                    {node.name.split(" ")[0]}
                  </span>
                )}
              </div>
            </td>

            {/* Status */}
            <td className="py-2.5 px-3">{renderStatus(node.status)}</td>

            {/* Cost */}
            <td className="py-2.5 px-3 font-mono font-semibold text-slate-900 dark:text-slate-100 whitespace-nowrap">
              {formatCurrency(node.cost)}
            </td>

            {/* Executions */}
            <td className="py-2.5 px-3 font-mono text-slate-700 dark:text-slate-300 whitespace-nowrap">
              {formatNumber(node.executions)}
            </td>

            {/* Tokens */}
            <td className="py-2.5 px-3 font-mono text-slate-700 dark:text-slate-300 whitespace-nowrap">
              {formatNumber(node.tokens)}k
            </td>

            {/* Budget */}
            <td className="py-2.5 px-3 font-mono text-slate-700 dark:text-slate-300 whitespace-nowrap">
              {formatCurrency(node.budget)}
            </td>

            {/* Budget Burn */}
            <td className="py-2.5 px-3 whitespace-nowrap">{renderBurnBar(node.cost, node.budget)}</td>

            {/* Actions */}
            <td className="py-2.5 px-3 text-right">
              <button
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800"
                title="Options"
              >
                <MoreVertical className="w-3.5 h-3.5" />
              </button>
            </td>
          </tr>

          {/* Render children recursively if expanded */}
          {hasChildren && isExpanded && renderRows(node.children!, level + 1)}
        </React.Fragment>
      );
    });
  };

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-4 sm:p-6 shadow-xs space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            {t("table.title")}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {t("table.subtitle")}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Search Bar */}
          <div className="relative w-full sm:w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t("table.searchPlaceholder")}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>

          {/* Expand / Collapse All Controls */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700/80">
            <button
              onClick={expandAll}
              className="flex items-center gap-1 px-2 py-1 text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition"
            >
              <Maximize2 className="w-3 h-3 text-indigo-500" />
              {t("table.expandAll")}
            </button>
            <button
              onClick={collapseAll}
              className="flex items-center gap-1 px-2 py-1 text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition"
            >
              <Minimize2 className="w-3 h-3 text-indigo-500" />
              {t("table.collapseAll")}
            </button>
          </div>
        </div>
      </div>

      {/* HTML Table Container - auto overflow scoped inside card */}
      <div className="overflow-x-auto rounded-xl border border-slate-200/80 dark:border-slate-800 max-w-full">
        <table className="w-full text-left text-xs border-collapse min-w-[700px] lg:min-w-0">
          <thead className="bg-slate-100/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 uppercase tracking-wider text-[10px] font-semibold border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="py-2.5 px-3">{t("table.columnName")}</th>
              <th className="py-2.5 px-3">{t("table.columnStatus")}</th>
              <th className="py-2.5 px-3">{t("table.columnCurrentCost")}</th>
              <th className="py-2.5 px-3">{t("table.columnExecutions")}</th>
              <th className="py-2.5 px-3">{t("table.columnTokens")}</th>
              <th className="py-2.5 px-3">{t("table.columnBudget")}</th>
              <th className="py-2.5 px-3">{t("table.columnBurn")}</th>
              <th className="py-2.5 px-3 text-right">{t("table.columnActions")}</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              renderRows(filteredData)
            ) : (
              <tr>
                <td
                  colSpan={8}
                  className="py-8 text-center text-slate-400 dark:text-slate-500"
                >
                  {t("table.noData")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
