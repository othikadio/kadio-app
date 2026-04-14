// ── Fournisseurs & Commandes ────────────────────────────────
import { supabase } from '../lib/supabase'

/** Profil fournisseur via user_id */
export async function getFournisseurByUserId(userId) {
  const { data, error } = await supabase
    .from('fournisseurs')
    .select('*')
    .eq('user_id', userId)
    .single()
  if (error) throw error
  return data
}

/** Produits d'un fournisseur */
export async function getProduitsByFournisseur(fournisseurId) {
  const { data, error } = await supabase
    .from('produits')
    .select('*')
    .eq('fournisseur_id', fournisseurId)
    .eq('actif', true)
    .order('nom')
  if (error) throw error
  return data
}

/** Tous les produits (partenaire view) */
export async function getAllProduits() {
  const { data, error } = await supabase
    .from('produits')
    .select('*, fournisseurs(entreprise)')
    .eq('actif', true)
    .order('categorie')
  if (error) throw error
  return data
}

/** Commandes d'un partenaire */
export async function getCommandesByPartenaire(partenaireId) {
  const { data, error } = await supabase
    .from('commandes_materiel')
    .select('*, produits(nom, prix_unitaire), fournisseurs(entreprise)')
    .eq('partenaire_id', partenaireId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

/** Commandes reçues par un fournisseur */
export async function getCommandesByFournisseur(fournisseurId) {
  const { data, error } = await supabase
    .from('commandes_materiel')
    .select('*, produits(nom), partenaires(nom_salon)')
    .eq('fournisseur_id', fournisseurId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

/** Créer une commande */
export async function createCommande(commande) {
  const { data, error } = await supabase
    .from('commandes_materiel')
    .insert(commande)
    .select()
    .single()
  if (error) throw error
  return data
}

/** Admin — upsert produit */
export async function upsertProduit(produit) {
  const { data, error } = await supabase
    .from('produits')
    .upsert(produit)
    .select()
    .single()
  if (error) throw error
  return data
}
