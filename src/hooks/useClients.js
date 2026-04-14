// ── Hook Clients — Supabase + fallback mock ──────────────────
import { useSupabaseData, useSupabaseMutation } from './useData'
import { getClientByUserId, getAllClients, createClient, updateClient } from '@/services'
import { MOCK_CLIENTS_ADMIN } from '@/data/mockAdmin'

/** Profil client par user_id */
export function useClientProfil(userId) {
  return useSupabaseData(
    userId ? () => getClientByUserId(userId) : null,
    null,
    [userId],
    !userId
  )
}

/** Admin — tous les clients */
export function useAllClients() {
  return useSupabaseData(() => getAllClients(), MOCK_CLIENTS_ADMIN)
}

/** Créer un client */
export function useCreateClient() {
  return useSupabaseMutation(createClient)
}

/** Mettre à jour un client */
export function useUpdateClient() {
  return useSupabaseMutation((clientId, updates) => updateClient(clientId, updates))
}
