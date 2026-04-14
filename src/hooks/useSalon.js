// ── Hook Salon Config — Supabase + fallback mock ─────────────
import { useSupabaseData, useSupabaseMutation } from './useData'
import { getSalonConfig, updateSalonConfig, getFraisDeplacement, getSmsLogs } from '@/services'
import { MOCK_CONFIG_SALON } from '@/data/mockAdmin'

/** Config du salon */
export function useSalonConfig() {
  return useSupabaseData(() => getSalonConfig(), MOCK_CONFIG_SALON)
}

/** Grille frais déplacement */
export function useFraisDeplacement() {
  return useSupabaseData(
    () => getFraisDeplacement(),
    MOCK_CONFIG_SALON.deplacement_grille
  )
}

/** Logs SMS */
export function useSmsLogs(limit = 50) {
  return useSupabaseData(() => getSmsLogs({ limit }), [], [limit])
}

/** Modifier config */
export function useUpdateSalonConfig() {
  return useSupabaseMutation((cle, valeur) => updateSalonConfig(cle, valeur))
}
