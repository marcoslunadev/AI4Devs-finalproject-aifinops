/**
 * Utility functions for compact number and currency formatting across FinOps dashboards.
 * Uses Intl.NumberFormat native API with compact notation (K, M, B, T).
 */

/**
 * Formats a currency amount into compact notation if >= 1000 (e.g. $1.85M, $45.3K),
 * otherwise returns standard currency format.
 */
export const formatCompactCurrency = (val?: number): string => {
  if (val === undefined || val === null || isNaN(val)) return "$0";
  const abs = Math.abs(val);
  if (abs < 1000) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: val % 1 === 0 ? 0 : 2,
      maximumFractionDigits: 2,
    }).format(val);
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: 2,
  }).format(val);
};

/**
 * Formats a raw number (executions, items) into compact notation if >= 1000 (e.g. 1.85M, 452.8K),
 * otherwise returns localized number string.
 */
export const formatCompactNumber = (val?: number): string => {
  if (val === undefined || val === null || isNaN(val)) return "0";
  const abs = Math.abs(val);
  if (abs < 1000) {
    return val.toLocaleString("en-US");
  }
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: 2,
  }).format(val);
};

/**
 * Formats token counts into compact notation (e.g. 1.5M, 850.5K).
 */
export const formatCompactTokens = (val?: number): string => {
  if (val === undefined || val === null || isNaN(val)) return "0";
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: 2,
  }).format(val);
};
