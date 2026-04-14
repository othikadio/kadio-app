// ── Chaises & Réservations ──────────────────────────────────
import { supabase } from '../lib/supabase'

/** Toutes les chaises actives */
export async function getChaises() {
  const { data, error } = await supabase
    .from('chaises')
    .select('*')
    .eq('actif', true)
    .order('numero')
  if (error) throw error
  return data
}

/** Réservations d'un partenaire */
export async function getReservationsByPartenaire(partenaireId) {
  const { data, error } = await supabase
    .from('reservations_chaises')
    .select('*, chaises(numero, nom)')
    .eq('partenaire_id', partenaireId)
    .order('date_debut', { ascending: false })
  if (error) throw error
  return data
}

/** Réservations du jour (toutes) */
export async function getReservationsJour(date) {
  const debut = `${date}T00:00:00`
  const fin = `${date}T23:59:59`
  const { data, error } = await supabase
    .from('reservations_chaises')
    .select('*, chaises(numero, nom), partenaires(nom_salon)')
    .gte('date_debut', debut)
    .lte('date_debut', fin)
    .order('date_debut')
  if (error) throw error
  return data
}

/** Créer une réservation */
export async function createReservation(reservation) {
  const { data, error } = await supabase
    .from('reservations_chaises')
    .insert(reservation)
    .select()
    .single()
  if (error) throw error
  return data
}

/** Annuler une réservation */
export async function cancelReservation(reservationId) {
  const { data, error } = await supabase
    .from('reservations_chaises')
    .update({ statut: 'annulee' })
    .eq('id', reservationId)
    .select()
    .single()
  if (error) throw error
  return data
}
