// ── Services (barème coiffure) ──────────────────────────────
import { supabase } from '../lib/supabase'

/** Tous les services actifs (public) */
export async function getServices() {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('actif', true)
    .order('categorie')
  if (error) throw error
  return data
}

/** Un service par ID */
export async function getServiceById(id) {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

/** Services par catégorie */
export async function getServicesByCategory(categorie) {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('categorie', categorie)
    .eq('actif', true)
    .order('nom')
  if (error) throw error
  return data
}

/** Admin — créer / modifier un service */
export async function upsertService(service) {
  const { data, error } = await supabase
    .from('services')
    .upsert(service)
    .select()
    .single()
  if (error) throw error
  return data
}

/** Admin — désactiver un service */
export async function toggleService(id, actif) {
  const { data, error } = await supabase
    .from('services')
    .update({ actif })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}
