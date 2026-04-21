// ── Hook Candidatures & Formation — Supabase + fallback mock ──
import { useSupabaseData, useSupabaseMutation } from './useData'
import {
  submitCandidature, getCandidatureByPhone, getAllCandidatures,
  updateCandidatureStatut, getFormationModules, getFormationProgression, completeModule
} from '@/services'
import { MOCK_CANDIDATURE_MARIAM, MOCK_MODULES } from '@/data/mockCandidat'
import { MOCK_CANDIDATURES } from '@/data/mockAdmin'

/** Candidature d'un candidat par téléphone */
export function useCandidature(telephone) {
  return useSupabaseData(
    telephone ? () => getCandidatureByPhone(telephone) : null,
    MOCK_CANDIDATURE_MARIAM,
    [telephone],
    !telephone
  )
}

/** Admin — toutes les candidatures */
export function useAllCandidatures() {
  return useSupabaseData(() => getAllCandidatures(), MOCK_CANDIDATURES)
}

/** Modules de formation */
export function useFormationModules() {
  return useSupabaseData(() => getFormationModules(), MOCK_MODULES)
}

/** Progression de formation d'un partenaire */
export function useFormationProgression(partenaireId) {
  return useSupabaseData(
    partenaireId ? () => getFormationProgression(partenaireId) : null,
    MOCK_MODULES,
    [partenaireId],
    !partenaireId
  )
}

/** Soumettre une candidature */
export function useSubmitCandidature() {
  return useSupabaseMutation(submitCandidature)
}

/** Admin — mettre à jour statut candidature */
export function useUpdateCandidatureStatut() {
  return useSupabaseMutation((id, statut) => updateCandidatureStatut(id, statut))
}

/** Compléter un module de formation */
export function useCompleteModule() {
  return useSupabaseMutation((partenaireId, moduleId) => completeModule(partenaireId, moduleId))
}
