const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const timeFormatter = new Intl.DateTimeFormat("pt-BR", {
  hour: "2-digit",
  minute: "2-digit",
});

function toDate(iso: string): Date | null {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** "24/09/2026" */
export function formatDate(iso: string): string {
  const date = toDate(iso);
  return date ? dateFormatter.format(date) : "Data não informada";
}

/** "24/09/2026 às 14:32" */
export function formatDateTime(iso: string): string {
  const date = toDate(iso);
  return date ? `${dateFormatter.format(date)} às ${timeFormatter.format(date)}` : "Data não informada";
}

/** "Ana Ribeiro" vira "AR". */
export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const first = parts[0][0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] ?? "" : "";
  return (first + last).toUpperCase();
}

/** "1 seção", "2 seções" */
export function pluralize(count: number, singular: string, plural: string): string {
  return `${count} ${count === 1 ? singular : plural}`;
}
