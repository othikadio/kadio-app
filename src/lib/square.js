// ── Square simulé — Kadio Coiffure ───────────────────────────────
// En mode dev : toujours succès sauf cartes test d'erreur
// En prod : appeler Edge Function Supabase /api/square

const DEV_DELAY_MS = 800

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Cartes test connues
const CARD_OUTCOMES = {
  '4242424242424242': { ok: true },
  '4000000000000002': { ok: false, code: 'carte_refusee',       message: 'Carte refusée. Veuillez utiliser une autre carte.' },
  '4000000000009995': { ok: false, code: 'fonds_insuffisants',  message: 'Fonds insuffisants. Vérifiez votre solde.' },
  '4000000000000001': { ok: false, code: 'timeout',             message: 'Délai dépassé. Réessayez dans un moment.' },
}

/**
 * Initialise un intent de paiement Square.
 * @returns {{ ok: boolean, paymentId: string, amount: number, currency: string }}
 */
export async function initSquarePayment(amount, currency = 'CAD') {
  await delay(300)
  return { ok: true, paymentId: `sq_init_${Date.now()}`, amount, currency }
}

/**
 * Traite un paiement Square avec le numéro de carte (chiffres seulement).
 * @param {string} cardNumber — numéro brut (16 chiffres, sans espaces)
 * @param {number} amount
 * @returns {{ ok: boolean, transactionId?: string, code?: string, message?: string }}
 */
export async function processPayment(cardNumber, amount) {
  await delay(DEV_DELAY_MS)

  const clean = cardNumber.replace(/\s/g, '')

  // Cartes test connues
  const outcome = CARD_OUTCOMES[clean]
  if (outcome) {
    if (outcome.ok) return { ok: true, transactionId: `sq_${Date.now()}`, amount, method: 'Square' }
    return { ok: false, code: outcome.code, message: outcome.message }
  }

  // Carte valide générique → succès
  if (clean.length === 16 && /^\d+$/.test(clean)) {
    return { ok: true, transactionId: `sq_${Date.now()}`, amount, method: 'Square' }
  }

  return { ok: false, code: 'carte_invalide', message: 'Numéro de carte invalide (16 chiffres requis).' }
}

/**
 * Crée un abonnement Square.
 * @returns {{ ok: boolean, subscriptionId: string, status: string }}
 */
export async function createSubscription(planId, customerId) {
  await delay(DEV_DELAY_MS)
  return {
    ok: true,
    subscriptionId: `sq_sub_${Date.now()}`,
    planId,
    customerId,
    status: 'active',
    nextBilling: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().slice(0, 10),
  }
}

/**
 * Annule un abonnement Square.
 * @returns {{ ok: boolean, status: string }}
 */
export async function cancelSubscription(subscriptionId) {
  await delay(DEV_DELAY_MS)
  return { ok: true, subscriptionId, status: 'cancelled' }
}
