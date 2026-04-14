// ── Salon Config & Frais ────────────────────────────────────
import { supabase } from '../lib/supabase'

/** Configuration du salon (public) */
export async function getSalonConfig() {
  const { data, error } = await supabase
    .from('salon_config')
    .select('cle, valeur')
  if (error) throw error
  // Transformer en objet clé-valeur
  return data.reduce((acc, row) => {
    acc[row.cle] = row.valeur
    return acc
  }, {})
}

/** Admin — mettre à jour une config */
export async function updateSalonConfig(cle, valeur) {
  const { data, error } = await supabase
    .from('salon_config')
    .upsert({ cle, valeur })
    .select()
    .single()
  if (error) throw error
  return data
}

/** Frais de déplacement (public) */
export async function getFraisDeplacement() {
  const { data, error } = await supabase
    .from('frais_deplacement')
    .select('*')
    .order('distance_min_km')
  if (error) throw error
  return data
}

/** Calculer le frais pour une distance donnée */
export async function calculerFrais(distanceKm, isAbonne = false) {
  const frais = await getFraisDeplacement()
  const tranche = frais.find(
    (f) => distanceKm >= f.distance_min_km && distanceKm <= f.distance_max_km
  )
  if (!tranche) return 0
  return isAbonne ? tranche.tarif_abonne : tranche.tarif_normal
}

/** SMS Logs — admin seulement */
export async function getSmsLogs({ limit = 50 } = {}) {
  const { data, error } = await supabase
    .from('sms_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data
}
