// ── Hook Chaises / Réservations — Supabase + fallback mock ───
import { useSupabaseData, useSupabaseMutation } from './useData'
import { getChaises, getReservationsByPartenaire, getReservationsJour, createReservation, cancelReservation } from '@/services'
import { MOCK_CHAISES, MOCK_RESERVATIONS_CHAISES } from '@/data/mockPartenaire'
import { CHAISES_SALON, MOCK_RESERVATIONS_ADMIN } from '@/data/mockAdmin'

/** Chaises (partenaire) */
export function useChaises() {
  return useSupabaseData(() => getChaises(), MOCK_CHAISES)
}

/** Chaises salon (admin) */
export function useChaisesAdmin() {
  return useSupabaseData(() => getChaises(), CHAISES_SALON)
}

/** Réservations d'un partenaire */
export function useReservationsPartenaire(partenaireId) {
  return useSupabaseData(
    partenaireId ? () => getReservationsByPartenaire(partenaireId) : null,
    MOCK_RESERVATIONS_CHAISES,
    [partenaireId],
    !partenaireId
  )
}

/** Réservations du jour (admin) */
export function useReservationsJour(date) {
  return useSupabaseData(
    date ? () => getReservationsJour(date) : null,
    MOCK_RESERVATIONS_ADMIN,
    [date],
    !date
  )
}

/** Créer une réservation de chaise */
export function useCreateReservation() {
  return useSupabaseMutation(createReservation)
}

/** Annuler une réservation */
export function useCancelReservation() {
  return useSupabaseMutation(cancelReservation)
}
