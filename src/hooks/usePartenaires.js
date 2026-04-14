// ── Hook Partenaires — Supabase + fallback mock ─────────────
import { useSupabaseData } from './useData'
import { getPartenairesPublic, getPartenaireByUserId, getAllPartenaires } from '@/services'
import { MOCK_PARTENAIRES } from '@/data/mockPublic'

/** Partenaires publics (carte, réservation) */
export function usePartenairesPublic() {
  return useSupabaseData(
    () => getPartenairesPublic(),
    MOCK_PARTENAIRES
  )
}

/** Profil partenaire par user_id */
export function usePartenaireProfil(userId) {
  return useSupabaseData(
    userId ? () => getPartenaireByUserId(userId) : null,
    null,
    [userId],
    !userId
  )
}

/** Admin — tous les partenaires */
export function useAllPartenaires() {
  return useSupabaseData(
    () => getAllPartenaires(),
    MOCK_PARTENAIRES
  )
}
