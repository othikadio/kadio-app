// ── Logique centralisée commandes matériel ────────────────────

export const STATUTS_COMMANDE_FLOW = [
  { val: 'en_attente', label: 'En attente',  color: '#F59E0B', next: 'confirmee',  nextLabel: 'Confirmer' },
  { val: 'confirmee',  label: 'Confirmée',   color: '#3B82F6', next: 'preparee',   nextLabel: `Prête à expédier` },
  { val: 'preparee',   label: 'Préparée',    color: '#8B5CF6', next: 'expediee',   nextLabel: 'Expédier' },
  { val: 'expediee',   label: 'Expédiée',    color: '#10B981', next: 'livree',     nextLabel: 'Marquer livrée' },
  { val: 'livree',     label: 'Livrée',      color: '#22c55e', next: null,         nextLabel: null },
]

export const getStatutInfo = (val) => STATUTS_COMMANDE_FLOW.find(s => s.val === val)

/**
 * Calculer le total d'une commande
 * @param {Array} items — [{ prix, qte }]
 * @param {number} margeKadio — ex: 0.10 pour 10%
 */
export function calculerTotal(items, margeKadio = 0) {
  const sous_total = items.reduce((s, item) => s + item.prix * item.qte, 0)
  return sous_total * (1 + margeKadio)
}

/**
 * Vérifier si le stock est suffisant
 * @param {Array} items — [{ id, qte }]
 * @param {Array} catalogue — produits avec { id, stock: number|boolean }
 * @returns {{ ok: boolean, ruptures: string[] }}
 */
export function validerCommande(items, catalogue) {
  const ruptures = []
  for (const item of items) {
    const prod = catalogue.find(p => p.id === item.id)
    if (!prod) { ruptures.push(item.nom || item.id); continue }
    if (prod.stock === false || prod.stock === 0) ruptures.push(prod.nom)
    else if (typeof prod.stock === 'number' && prod.stock < item.qte) ruptures.push(prod.nom)
  }
  return { ok: ruptures.length === 0, ruptures }
}

/**
 * Générer un numéro de commande unique
 * Format : CMD-YYYY-XXX
 */
export function genNumeroCommande() {
  const year = new Date().getFullYear()
  const n = String(Math.floor(100 + Math.random() * 900))
  return `CMD-${year}-${n}`
}

/**
 * Simuler l'envoi d'un SMS
 * @param {string} destinataire
 * @param {string} message
 */
export function simulerSMS(destinataire, message) {
  console.log(`[SMS → ${destinataire}] ${message}`)
  // En production : appel API Twilio
}
