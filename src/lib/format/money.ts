/**
 * Formatage monétaire pour la zone FCFA (XOF / XAF)
 * Règle métier : montants entiers en FCFA avec séparateur d'espace insécable fine
 */
export function formatFCFA(amount: number | bigint): string {
  const numericAmount = typeof amount === "bigint" ? Number(amount) : amount;
  
  // Formatage standard français avec séparateur de milliers
  const formatted = new Intl.NumberFormat("fr-FR", {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(numericAmount);

  return `${formatted} FCFA`;
}

/**
 * Raccourci compact pour les badges ou graphiques (ex: 1,2M FCFA ou 450K FCFA)
 */
export function formatCompactFCFA(amount: number): string {
  if (amount >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(1).replace(".", ",")}M FCFA`;
  }
  if (amount >= 1_000) {
    return `${Math.round(amount / 1_000)}k FCFA`;
  }
  return `${amount} FCFA`;
}
