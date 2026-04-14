export const FIDELITE_RULES = {
  points_par_dollar: 1,
  seuil_recompense: 450,
  valeur_recompense: 20,
}

export function calculerPoints(prix_total) {
  return Math.floor(prix_total)
}

export function verifierRecompense(points_total) {
  const credits = Math.floor(points_total / FIDELITE_RULES.seuil_recompense)
  return credits > 0 ? credits * FIDELITE_RULES.valeur_recompense : 0
}

export function smsFidelite(prenom, points_gagnes, points_total) {
  const manquants = FIDELITE_RULES.seuil_recompense - (points_total % FIDELITE_RULES.seuil_recompense)
  return `Kadio: Bravo ${prenom}! +${points_gagnes} pts fidélité. Total: ${points_total} pts. Plus que ${manquants} pts pour votre prochain crédit de ${FIDELITE_RULES.valeur_recompense}$.`
}
