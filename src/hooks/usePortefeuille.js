// ── Hook Portefeuille / Transactions — Supabase + fallback mock
import { useSupabaseData } from './useData'
import { getTransactions, getSolde, getBonusConversions, getAllTransactions } from '@/services'
import { MOCK_TRANSACTIONS_DIANE } from '@/data/mockPartenaire'
import { MOCK_TRANSACTIONS_ADMIN } from '@/data/mockAdmin'

/** Transactions d'un partenaire */
export function useTransactionsPartenaire(partenaireId) {
  return useSupabaseData(
    partenaireId ? () => getTransactions(partenaireId) : null,
    MOCK_TRANSACTIONS_DIANE,
    [partenaireId],
    !partenaireId
  )
}

/** Solde d'un partenaire */
export function useSoldePartenaire(partenaireId) {
  return useSupabaseData(
    partenaireId ? () => getSolde(partenaireId) : null,
    { solde: 283.00, total_gagne: 4938.00 },
    [partenaireId],
    !partenaireId
  )
}

/** Bonus/conversions d'un partenaire */
export function useBonusConversions(partenaireId) {
  return useSupabaseData(
    partenaireId ? () => getBonusConversions(partenaireId) : null,
    [],
    [partenaireId],
    !partenaireId
  )
}

/** Admin — toutes les transactions */
export function useAllTransactions() {
  return useSupabaseData(() => getAllTransactions(), MOCK_TRANSACTIONS_ADMIN)
}
