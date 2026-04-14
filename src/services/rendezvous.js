// ── Rendez-vous ─────────────────────────────────────────────
import { supabase } from '../lib/supabase'

/** RDV d'un client (via son user_id) */
export async function getRdvByClient(clientId) {
  const { data, error } = await supabase
    .from('rendez_vous')
    .select('*, services(nom, categorie, duree), partenaires(nom_salon, telephone)')
    .eq('client_id', clientId)
    .order('date_heure', { ascending: false })
  if (error) throw error
  return data
}

/** RDV d'un partenaire */
export async function getRdvByPartenaire(partenaireId) {
  const { data, error } = await supabase
    .from('rendez_vous')
    .select('*, services(nom, categorie, duree), clients(prenom, nom, telephone)')
    .eq('partenaire_id', partenaireId)
    .order('date_heure', { ascending: false })
  if (error) throw error
  return data
}

/** RDV d'un employé */
export async function getRdvByEmploye(employeId) {
  const { data, error } = await supabase
    .from('rendez_vous')
    .select('*, services(nom, categorie, duree), clients(prenom, nom)')
    .eq('employe_id', employeId)
    .order('date_heure', { ascending: false })
  if (error) throw error
  return data
}

/** Admin — tous les RDV (filtrable par date) */
export async function getAllRdv({ from, to, statut } = {}) {
  let query = supabase
    .from('rendez_vous')
    .select('*, services(nom, categorie), clients(prenom, nom, telephone), partenaires(nom_salon)')
    .order('date_heure', { ascending: false })

  if (from) query = query.gte('date_heure', from)
  if (to) query = query.lte('date_heure', to)
  if (statut) query = query.eq('statut', statut)

  const { data, error } = await query
  if (error) throw error
  return data
}

/** Créer un RDV */
export async function createRdv(rdv) {
  const { data, error } = await supabase
    .from('rendez_vous')
    .insert(rdv)
    .select()
    .single()
  if (error) throw error
  return data
}

/** Mettre à jour le statut d'un RDV */
export async function updateRdvStatut(rdvId, statut, notes = null) {
  const update = { statut }
  if (notes) update.notes = notes
  const { data, error } = await supabase
    .from('rendez_vous')
    .update(update)
    .eq('id', rdvId)
    .select()
    .single()
  if (error) throw error
  return data
}

/** Annuler un RDV */
export async function cancelRdv(rdvId, raison = '') {
  return updateRdvStatut(rdvId, 'annule', raison)
}
