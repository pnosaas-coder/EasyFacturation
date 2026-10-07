/**
 * Utilitaires de formatage de dates en français
 * Règle métier : dates au format jour/mois/année (DD/MM/YYYY)
 */

export function formatDate(dateStringOrDate: string | Date): string {
  if (!dateStringOrDate) return "";
  const date = typeof dateStringOrDate === "string" ? new Date(dateStringOrDate) : dateStringOrDate;
  
  if (isNaN(date.getTime())) return "";

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

export function formatDateHuman(dateStringOrDate: string | Date): string {
  if (!dateStringOrDate) return "";
  const date = typeof dateStringOrDate === "string" ? new Date(dateStringOrDate) : dateStringOrDate;
  
  if (isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}
