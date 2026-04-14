// ── Abonnements & Plans ─────────────────────────────────────
import { supabase } from '../lib/supabase'

/** Plans actifs (public) */
export async function getPlans() {
  const { data, error } = await supabase
    .from('plans_abonnement')
    .select('*')
    .eq('actif', true)
    .order('prix_mensuel')
  if (error) throw error
  return data
}

/** Abonnement actif d'un client */
export async function getAbonnementClient(clientId) {
  const { data, error } = await supabase
    .from('abonnements')
    .select('*, plans_abonnement(nom, categorie, prix_mensuel, services_inclus)')
    .eq('client_id', clientId)
    .eq('statut', 'actif')
    .maybeSingle()
  if (error) throw error
  return data
}

/** Souscrire à un plan */
export async function createAbonnement(abonnement) {
  const { data, error } = await supabase
    .from('abonnements')
    .insert(abonnement)
    .select()
    .single()
  if (error) throw error
  return data
}

/** Annuler un abonnement */
export async function cancelAbonnement(abonnementId) {
  const { data, error } = await supabase
    .from('abonnements')
    .update({ statut: 'annule', date_fin: new Date().toISOString() })
    .eq('id', abonnementId)
    .select()
    .single()
  if (error) throw error
  return data
}

/** Admin — tous les abonnements */
export async function getAllAbonnements() {
  const { data, error } = await supabase
    .from('abonnements')
    .select('*, plans_abonnement(nom, prix_mensuel), clients(prenom, nom)')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

/** Admin — upsert plan */
export async function upsertPlan(plan) {
  const { data, error } = await supabase
    .from('plans_abonnement')
    .upsert(plan)
    .select()
    .single()
  if (error) throw error
  return data
}
