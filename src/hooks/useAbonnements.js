// ── Hook Abonnements — Supabase + fallback mock ──────────────
import { useSupabaseData, useSupabaseMutation } from './useData'
import { getPlans, getAbonnementClient, getAllAbonnements, createAbonnement, cancelAbonnement, upsertPlan } from '@/services'
import { MOCK_ABONNEMENT_AMINATA } from '@/data/mockClient'
import { MOCK_ABONNEMENTS_ADMIN } from '@/data/mockAdmin'
import { FORFAITS } from '@/data/mockPublic'

/** Plans / forfaits disponibles */
export function usePlans() {
  return useSupabaseData(() => getPlans(), FORFAITS)
}

/** Abonnement d'un client */
export function useAbonnementClient(clientId) {
  return useSupabaseData(
    clientId ? () => getAbonnementClient(clientId) : null,
    MOCK_ABONNEMENT_AMINATA,
    [clientId],
    !clientId
  )
}

/** Admin — tous les abonnements */
export function useAllAbonnements() {
  return useSupabaseData(() => getAllAbonnements(), MOCK_ABONNEMENTS_ADMIN)
}

/** Créer un abonnement */
export function useCreateAbonnement() {
  return useSupabaseMutation(createAbonnement)
}

/** Annuler un abonnement */
export function useCancelAbonnement() {
  return useSupabaseMutation(cancelAbonnement)
}

/** Admin — créer/modifier un plan */
export function useUpsertPlan() {
  return useSupabaseMutation(upsertPlan)
}
