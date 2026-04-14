// ── Hook Rendez-vous — Supabase + fallback mock ──────────────
import { useSupabaseData, useSupabaseMutation } from './useData'
import { getRdvByClient, getRdvByPartenaire, getRdvByEmploye, getAllRdv, createRdv, updateRdvStatut, cancelRdv } from '@/services'
import { MOCK_RDV_AMINATA } from '@/data/mockClient'
import { MOCK_RDV_DIANE } from '@/data/mockPartenaire'

/** RDV d'un client */
export function useRdvClient(clientId) {
  return useSupabaseData(
    clientId ? () => getRdvByClient(clientId) : null,
    [...(MOCK_RDV_AMINATA?.a_venir || []), ...(MOCK_RDV_AMINATA?.historique || [])],
    [clientId],
    !clientId
  )
}

/** RDV d'un partenaire */
export function useRdvPartenaire(partenaireId) {
  return useSupabaseData(
    partenaireId ? () => getRdvByPartenaire(partenaireId) : null,
    MOCK_RDV_DIANE || [],
    [partenaireId],
    !partenaireId
  )
}

/** RDV d'un employé */
export function useRdvEmploye(employeId) {
  return useSupabaseData(
    employeId ? () => getRdvByEmploye(employeId) : null,
    [],
    [employeId],
    !employeId
  )
}

/** Admin — tous les RDV */
export function useAllRdv(filters) {
  return useSupabaseData(
    () => getAllRdv(filters),
    [],
    [JSON.stringify(filters)]
  )
}

/** Créer un RDV */
export function useCreateRdv() {
  return useSupabaseMutation(createRdv)
}

/** Mettre à jour statut RDV */
export function useUpdateRdvStatut() {
  return useSupabaseMutation((rdvId, statut, notes) => updateRdvStatut(rdvId, statut, notes))
}

/** Annuler un RDV */
export function useCancelRdv() {
  return useSupabaseMutation((rdvId, raison) => cancelRdv(rdvId, raison))
}
