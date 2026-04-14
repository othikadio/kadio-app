// ── Partenaires ─────────────────────────────────────────────
import { supabase } from '../lib/supabase'

/** Partenaires actifs et disponibles (carte publique) */
export async function getPartenairesPublic() {
  const { data, error } = await supabase
    .from('partenaires')
    .select('id, nom_salon, specialites, adresse, latitude, longitude, photo_url, note_moyenne, is_disponible')
    .eq('statut', 'actif')
    .eq('is_disponible', true)
  if (error) throw error
  return data
}

/** Profil partenaire via user_id */
export async function getPartenaireByUserId(userId) {
  const { data, error } = await supabase
    .from('partenaires')
    .select('*')
    .eq('user_id', userId)
    .single()
  if (error) throw error
  return data
}

/** Mettre à jour son profil partenaire */
export async function updatePartenaire(partenaireId, updates) {
  const { data, error } = await supabase
    .from('partenaires')
    .update(updates)
    .eq('id', partenaireId)
    .select()
    .single()
  if (error) throw error
  return data
}

/** Toggle disponibilité */
export async function toggleDisponibilite(partenaireId, isDisponible) {
  return updatePartenaire(partenaireId, { is_disponible: isDisponible })
}

/** Admin — tous les partenaires */
export async function getAllPartenaires() {
  const { data, error } = await supabase
    .from('partenaires')
    .select('*, users(telephone, email)')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

/** Admin — changer le statut d'un partenaire */
export async function updatePartenaireStatut(partenaireId, statut) {
  return updatePartenaire(partenaireId, { statut })
}
