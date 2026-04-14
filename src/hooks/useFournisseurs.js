// ── Hook Fournisseurs — Supabase + fallback mock ─────────────
import { useSupabaseData, useSupabaseMutation } from './useData'
import {
  getFournisseurByUserId, getProduitsByFournisseur, getAllProduits,
  getCommandesByPartenaire, getCommandesByFournisseur, createCommande, upsertProduit
} from '@/services'
import { MOCK_FOURNISSEUR_JEAN, MOCK_PRODUITS_JEAN, MOCK_COMMANDES_JEAN } from '@/data/mockFournisseur'

/** Profil fournisseur par user_id */
export function useFournisseurProfil(userId) {
  return useSupabaseData(
    userId ? () => getFournisseurByUserId(userId) : null,
    MOCK_FOURNISSEUR_JEAN,
    [userId],
    !userId
  )
}

/** Produits d'un fournisseur */
export function useProduitsFournisseur(fournisseurId) {
  return useSupabaseData(
    fournisseurId ? () => getProduitsByFournisseur(fournisseurId) : null,
    MOCK_PRODUITS_JEAN,
    [fournisseurId],
    !fournisseurId
  )
}

/** Tous les produits (admin) */
export function useAllProduits() {
  return useSupabaseData(() => getAllProduits(), MOCK_PRODUITS_JEAN)
}

/** Commandes d'un partenaire */
export function useCommandesPartenaire(partenaireId) {
  return useSupabaseData(
    partenaireId ? () => getCommandesByPartenaire(partenaireId) : null,
    [],
    [partenaireId],
    !partenaireId
  )
}

/** Commandes d'un fournisseur */
export function useCommandesFournisseur(fournisseurId) {
  return useSupabaseData(
    fournisseurId ? () => getCommandesByFournisseur(fournisseurId) : null,
    MOCK_COMMANDES_JEAN,
    [fournisseurId],
    !fournisseurId
  )
}

/** Créer une commande */
export function useCreateCommande() {
  return useSupabaseMutation(createCommande)
}

/** Créer/modifier un produit */
export function useUpsertProduit() {
  return useSupabaseMutation(upsertProduit)
}
