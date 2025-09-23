// src/pages/utils/dateUtils.js
// Small helper to format a datetime string like "2025-09-23 10:00"
// into a human friendly form, e.g. "Sep 23, 2025, 10:00 AM"

export function formatDate(input) {
  if (!input) return '';
  // Replace space with 'T' to make it ISO-like for Safari/iOS compatibility
  const isoish = String(input).replace(' ', 'T');
  const d = new Date(isoish);
  if (isNaN(d.getTime())) return String(input);
  const fmt = new Intl.DateTimeFormat(undefined, {
    year: 'numeric', month: 'short', day: '2-digit',
    hour: '2-digit', minute: '2-digit'
  });
  return fmt.format(d);
}
