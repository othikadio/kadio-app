// ── Users & Rôles ───────────────────────────────────────────
import { supabase } from '../lib/supabase'

/** Profil utilisateur par téléphone */
export async function getUserByPhone(telephone) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('telephone', telephone)
    .single()
  if (error) throw error
  return data
}

/** Rôles d'un utilisateur */
export async function getUserRoles(userId) {
  const { data, error } = await supabase
    .from('user_roles')
    .select('role, statut')
    .eq('user_id', userId)
    .eq('statut', 'actif')
  if (error) throw error
  return data.map((r) => r.role)
}

/** Créer un utilisateur + rôle */
export async function createUser(user, role = 'client') {
  // 1. Insérer l'utilisateur
  const { data: userData, error: userError } = await supabase
    .from('users')
    .insert(user)
    .select()
    .single()
  if (userError) throw userError

  // 2. Assigner le rôle
  const { error: roleError } = await supabase
    .from('user_roles')
    .insert({ user_id: userData.id, role })
  if (roleError) throw roleError

  return userData
}

/** Mettre à jour le profil utilisateur */
export async function updateUser(userId, updates) {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()
  if (error) throw error
  return data
}

/** Admin — ajouter un rôle */
export async function addRole(userId, role) {
  const { data, error } = await supabase
    .from('user_roles')
    .insert({ user_id: userId, role })
    .select()
    .single()
  if (error) throw error
  return data
}

/** Admin — tous les utilisateurs */
export async function getAllUsers() {
  const { data, error } = await supabase
    .from('users')
    .select('*, user_roles(role, statut)')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}
