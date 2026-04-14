// ── Portefeuille & Transactions ─────────────────────────────
import { supabase } from '../lib/supabase'

/** Transactions d'un partenaire */
export async function getTransactions(partenaireId) {
  const { data, error } = await supabase
    .from('portefeuille_transactions')
    .select('*')
    .eq('partenaire_id', partenaireId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

/** Solde courant d'un partenaire */
export async function getSolde(partenaireId) {
  const { data, error } = await supabase
    .from('portefeuille_transactions')
    .select('montant, type')
    .eq('partenaire_id', partenaireId)

  if (error) throw error

  return data.reduce((acc, t) => {
    return t.type === 'credit' ? acc + Number(t.montant) : acc - Number(t.montant)
  }, 0)
}

/** Bonus de conversion d'un partenaire */
export async function getBonusConversions(partenaireId) {
  const { data, error } = await supabase
    .from('bonus_conversions')
    .select('*')
    .eq('partenaire_id', partenaireId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

/** Admin — toutes les transactions */
export async function getAllTransactions() {
  const { data, error } = await supabase
    .from('portefeuille_transactions')
    .select('*, partenaires(nom_salon)')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}
