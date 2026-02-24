/**
 * Format a number as a USD currency string, e.g. $1,000.00
 * Uses Intl.NumberFormat with en-US locale per the content strategy.
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Format a number as a percentage string with 2 decimal places, e.g. 5.26%
 */
export function formatPercent(value: number): string {
  return `${value.toFixed(2)}%`;
}

/**
 * Format an ISO date string (YYYY-MM-DD) as DD MMM YYYY, e.g. 23 Aug 2025
 * Uses en-GB locale per the content strategy.
 */
export function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}
