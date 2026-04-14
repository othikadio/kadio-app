// ── Candidatures & Formation ────────────────────────────────
import { supabase } from '../lib/supabase'

/** Soumettre une candidature (public) */
export async function submitCandidature(candidature) {
  const { data, error } = await supabase
    .from('candidatures')
    .insert(candidature)
    .select()
    .single()
  if (error) throw error
  return data
}

/** Candidature par téléphone (candidat) */
export async function getCandidatureByPhone(telephone) {
  const { data, error } = await supabase
    .from('candidatures')
    .select('*')
    .eq('telephone', telephone)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

/** Admin — toutes les candidatures */
export async function getAllCandidatures() {
  const { data, error } = await supabase
    .from('candidatures')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

/** Admin — changer le statut d'une candidature */
export async function updateCandidatureStatut(id, statut) {
  const { data, error } = await supabase
    .from('candidatures')
    .update({ statut })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

/** Modules de formation actifs */
export async function getFormationModules() {
  const { data, error } = await supabase
    .from('formation_modules')
    .select('*')
    .eq('actif', true)
    .order('ordre')
  if (error) throw error
  return data
}

/** Progression formation d'un partenaire */
export async function getFormationProgression(partenaireId) {
  const { data, error } = await supabase
    .from('formation_progression')
    .select('*, formation_modules(titre, ordre)')
    .eq('partenaire_id', partenaireId)
    .order('created_at')
  if (error) throw error
  return data
}

/** Marquer un module comme complété */
export async function completeModule(partenaireId, moduleId) {
  const { data, error } = await supabase
    .from('formation_progression')
    .upsert({
      partenaire_id: partenaireId,
      module_id: moduleId,
      complete: true,
      completed_at: new Date().toISOString(),
    })
    .select()
    .single()
  if (error) throw error
  return data
}
