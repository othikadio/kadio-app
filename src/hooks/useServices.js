// ── Hook Services — Supabase + fallback mock ─────────────────
import { useSupabaseData } from './useData'
import { getServices } from '@/services'
import { SERVICES_PUBLIC } from '@/data/mockPublic'

/** Services publics (page tarifs, réservation) */
export function useServicesPublic() {
  return useSupabaseData(
    () => getServices(),
    SERVICES_PUBLIC
  )
}

/** Admin — tous les services */
export function useAllServices() {
  return useSupabaseData(
    () => getServices(),
    SERVICES_PUBLIC
  )
}
