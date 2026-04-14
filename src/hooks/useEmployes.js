// ── Hook Employés — Supabase + fallback mock ─────────────────
import { useSupabaseData, useSupabaseMutation } from './useData'
import { getEmployeByUserId, getAllEmployes, upsertEmploye } from '@/services'
import { MOCK_MARCUS_EMPLOYE } from '@/data/mockEmploye'
import { MOCK_EMPLOYES_ADMIN } from '@/data/mockAdmin'

/** Profil employé par user_id */
export function useEmployeProfil(userId) {
  return useSupabaseData(
    userId ? () => getEmployeByUserId(userId) : null,
    MOCK_MARCUS_EMPLOYE,
    [userId],
    !userId
  )
}

/** Admin — tous les employés */
export function useAllEmployes() {
  return useSupabaseData(() => getAllEmployes(), MOCK_EMPLOYES_ADMIN)
}

/** Admin — créer/modifier employé */
export function useUpsertEmploye() {
  return useSupabaseMutation(upsertEmploye)
}
