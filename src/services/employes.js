// ── Employés ────────────────────────────────────────────────
import { supabase } from '../lib/supabase'

/** Profil employé via user_id */
export async function getEmployeByUserId(userId) {
  const { data, error } = await supabase
    .from('employes')
    .select('*')
    .eq('user_id', userId)
    .single()
  if (error) throw error
  return data
}

/** Admin — tous les employés */
export async function getAllEmployes() {
  const { data, error } = await supabase
    .from('employes')
    .select('*, users(telephone, email, photo_url)')
    .order('nom')
  if (error) throw error
  return data
}

/** Admin — créer / modifier un employé */
export async function upsertEmploye(employe) {
  const { data, error } = await supabase
    .from('employes')
    .upsert(employe)
    .select()
    .single()
  if (error) throw error
  return data
}
