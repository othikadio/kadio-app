// ── Stripe — Kadio Coiffure ──────────────────────────────────
// Frontend : Stripe.js (clé publique) pour le formulaire de paiement
// Backend  : Edge Functions Supabase avec sk_live pour les charges
import { supabase } from './supabase'

const STRIPE_PK = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
const isStripeConfigured = !!STRIPE_PK && STRIPE_PK !== 'your_stripe_publishable_key'

// Charger Stripe.js dynamiquement (évite le bloat si pas configuré)
let stripePromise = null

export function getStripe() {
  if (!stripePromise && isStripeConfigured) {
    stripePromise = import('@stripe/stripe-js').then(m => m.loadStripe(STRIPE_PK))
  }
  return stripePromise
}

export { isStripeConfigured }

// ══════════════════════════════════════════════════════════════
//  PAIEMENT UNIQUE (rendez-vous, dépôt)
// ══════════════════════════════════════════════════════════════

/**
 * Crée une session de paiement Checkout via Edge Function.
 * Redirige le client vers Stripe Checkout.
 */
export async function createCheckoutSession({
  montant,         // en cents CAD
  description,
  clientEmail,
  cardNum = null,  // pour simulation dev (test carte refusée)
  rdvId = null,
  successUrl = `${window.location.origin}/client/confirmation`,
  cancelUrl = `${window.location.origin}/client/carte`,
}) {
  if (!isStripeConfigured) {
    // ── DEV fallback — simule succès/échec selon numéro de carte ──
    console.log('[Stripe DEV] Checkout simulé:', { montant, description })
    await new Promise(r => setTimeout(r, 800))
    // Carte test refusée : 4000 0000 0000 0002
    if (cardNum && cardNum.replace(/\s/g, '') === '4000000000000002') {
      return { ok: false, message: 'Carte refusée. Essayez une autre carte.' }
    }
    return {
      ok: true,
      sessionId: `cs_dev_${Date.now()}`,
    }
  }

  const { data, error } = await supabase.functions.invoke('stripe-checkout', {
    body: { montant, description, clientEmail, rdvId, successUrl, cancelUrl },
  })
  if (error) throw error
  return data
}

// ══════════════════════════════════════════════════════════════
//  ABONNEMENTS RÉCURRENTS (Stripe Billing)
// ══════════════════════════════════════════════════════════════

/**
 * Crée un abonnement Stripe Billing via Edge Function.
 */
export async function createSubscription({
  planId,          // ID du plan Kadio
  stripePriceId,   // ID Stripe du prix récurrent
  clientEmail,
  clientId,
  cardNum = null,  // pour simulation dev
}) {
  if (!isStripeConfigured) {
    console.log('[Stripe DEV] Abonnement simulé:', { planId, stripePriceId })
    await new Promise(r => setTimeout(r, 800))
    if (cardNum && cardNum.replace(/\s/g, '') === '4000000000000002') {
      return { ok: false, message: 'Carte refusée. Essayez une autre carte.' }
    }
    return {
      ok: true,
      subscriptionId: `sub_dev_${Date.now()}`,
      status: 'active',
    }
  }

  const { data, error } = await supabase.functions.invoke('stripe-subscription', {
    body: { planId, stripePriceId, clientEmail, clientId },
  })
  if (error) throw error
  return data
}

/**
 * Annule un abonnement Stripe via Edge Function.
 */
export async function cancelSubscription(stripeSubscriptionId) {
  if (!isStripeConfigured) {
    console.log('[Stripe DEV] Annulation simulée:', stripeSubscriptionId)
    await new Promise(r => setTimeout(r, 500))
    return { ok: true, status: 'canceled' }
  }

  const { data, error } = await supabase.functions.invoke('stripe-cancel-subscription', {
    body: { stripeSubscriptionId },
  })
  if (error) throw error
  return data
}

// ══════════════════════════════════════════════════════════════
//  STRIPE CONNECT (versements partenaires)
// ══════════════════════════════════════════════════════════════

/**
 * Crée un compte Stripe Connect pour un partenaire.
 */
export async function createConnectedAccount(partenaireId) {
  if (!isStripeConfigured) {
    await new Promise(r => setTimeout(r, 700))
    return {
      ok: true,
      stripeAccountId: `acct_dev_${Date.now().toString(36)}`,
      onboardingUrl: '/partenaire/accueil?stripe_onboarding=dev',
    }
  }

  const { data, error } = await supabase.functions.invoke('stripe-connect-create', {
    body: { partenaireId },
  })
  if (error) throw error
  return data
}

/**
 * Transfère un montant vers le compte Stripe d'un partenaire.
 */
export async function transferToPartner(amount, stripeAccountId) {
  if (!isStripeConfigured) {
    await new Promise(r => setTimeout(r, 700))
    return {
      ok: true,
      transferId: `tr_dev_${Date.now()}`,
      amount,
      currency: 'CAD',
    }
  }

  const { data, error } = await supabase.functions.invoke('stripe-transfer', {
    body: { amount, stripeAccountId },
  })
  if (error) throw error
  return data
}

/**
 * Récupère le solde d'un compte Stripe Connect.
 */
export async function getAccountBalance(stripeAccountId) {
  if (!isStripeConfigured) {
    await new Promise(r => setTimeout(r, 500))
    return { ok: true, available: 245.50, pending: 38.00, currency: 'CAD' }
  }

  const { data, error } = await supabase.functions.invoke('stripe-balance', {
    body: { stripeAccountId },
  })
  if (error) throw error
  return data
}
