// ── Clients ─────────────────────────────────────────────────
import { supabase } from '../lib/supabase'

/** Profil client via user_id */
export async function getClientByUserId(userId) {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('user_id', userId)
    .single()
  if (error) throw error
  return data
}

/** Profil client via téléphone */
export async function getClientByPhone(telephone) {
  const { data, error } = await supabase
    .from('users')
    .select('id')
    .eq('telephone', telephone)
    .single()
  if (error) throw error

  return getClientByUserId(data.id)
}

/** Créer un profil client (après inscription) */
export async function createClient(client) {
  const { data, error } = await supabase
    .from('clients')
    .insert(client)
    .select()
    .single()
  if (error) throw error
  return data
}

/** Mettre à jour le profil client */
export async function updateClient(clientId, updates) {
  const { data, error } = await supabase
    .from('clients')
    .update(updates)
    .eq('id', clientId)
    .select()
    .single()
  if (error) throw error
  return data
}

/** Admin — tous les clients */
export async function getAllClients() {
  const { data, error } = await supabase
    .from('clients')
    .select('*, users(telephone, email, photo_url)')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}
