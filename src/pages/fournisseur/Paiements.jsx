import { OR, CREME, NOIR, CARD, MUTED, BORDER_OR, formatDate, formatMontant } from '@/lib/utils'
import { MOCK_PAIEMENTS_JEAN, MOCK_FOURNISSEUR_JEAN } from '@/data/mockFournisseur'

const MOIS_COURANT = '2026-03'

export default function FournisseurPaiements() {
  const recusCeMois = MOCK_PAIEMENTS_JEAN.filter(p => p.statut === 'recu' && p.date.startsWith(MOIS_COURANT))
  const totalMois   = recusCeMois.reduce((s, p) => s + p.montant, 0)
  const totalAnnuel = MOCK_PAIEMENTS_JEAN.filter(p => p.statut === 'recu').reduce((s, p) => s + p.montant, 0)
  const enAttente   = MOCK_PAIEMENTS_JEAN.filter(p => p.statut === 'en_attente')
  const totalAttente = enAttente.reduce((s, p) => s + p.montant, 0)

  return (
    <div style={{ padding: '24px', paddingBottom: '100px', color: NOIR, background: CREME, minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ color: OR, margin: '0 0 4px', fontSize: '20px' }}>Paiements</h2>
        <p style={{ color: MUTED, margin: 0, fontSize: '13px' }}>{MOCK_FOURNISSEUR_JEAN.nom_entreprise}</p>
      </div>

      {/* Cartes résumé */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
        <div style={{ background: CARD, border: `1px solid ${BORDER_OR}`, borderRadius: '12px', padding: '16px' }}>
          <p style={{ color: MUTED, margin: '0 0 6px', fontSize: '12px' }}>Reçu ce mois</p>
          <p style={{ color: OR, margin: 0, fontSize: '22px', fontWeight: 700 }}>{formatMontant(totalMois)}</p>
          <p style={{ color: MUTED, margin: '4px 0 0', fontSize: '11px' }}>{recusCeMois.length} paiement(s)</p>
        </div>
        <div style={{ background: CARD, border: `1px solid ${BORDER_OR}`, borderRadius: '12px', padding: '16px' }}>
          <p style={{ color: MUTED, margin: '0 0 6px', fontSize: '12px' }}>Total annuel reçu</p>
          <p style={{ color: '#22c55e', margin: 0, fontSize: '22px', fontWeight: 700 }}>{formatMontant(totalAnnuel)}</p>
          <p style={{ color: MUTED, margin: '4px 0 0', fontSize: '11px' }}>depuis jan 2026</p>
        </div>
      </div>

      {/* En attente */}
      {enAttente.length > 0 && (
        <div style={{ background: '#1c1400', border: '1px solid #f59e0b', borderRadius: '12px', padding: '16px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <p style={{ margin: 0, color: '#fbbf24', fontWeight: 600, fontSize: '14px' }}>En attente de paiement</p>
            <p style={{ margin: 0, color: '#fbbf24', fontWeight: 700, fontSize: '16px' }}>{formatMontant(totalAttente)}</p>
          </div>
          {enAttente.map(p => (
            <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderTop: `1px solid rgba(245,158,11,0.2)` }}>
              <div>
                <p style={{ margin: '0 0 2px', color: NOIR, fontSize: '13px' }}>{p.commande}</p>
                <p style={{ margin: 0, color: MUTED, fontSize: '11px' }}>{formatDate(p.date)}</p>
              </div>
              <p style={{ margin: 0, color: '#fbbf24', fontWeight: 600, fontSize: '14px' }}>{formatMontant(p.montant)}</p>
            </div>
          ))}
        </div>
      )}

      {/* Historique */}
      <h3 style={{ color: NOIR, fontSize: '15px', margin: '0 0 12px' }}>Historique</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {MOCK_PAIEMENTS_JEAN.map(p => (
          <div key={p.id} style={{ background: CARD, border: `1px solid ${BORDER_OR}`, borderRadius: '10px', padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ margin: '0 0 2px', color: NOIR, fontSize: '14px', fontWeight: 500 }}>{p.commande}</p>
              <p style={{ margin: 0, color: MUTED, fontSize: '12px' }}>{formatDate(p.date)}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: '0 0 4px', color: p.statut === 'recu' ? '#22c55e' : '#f59e0b', fontWeight: 700, fontSize: '15px' }}>{formatMontant(p.montant)}</p>
              <span style={{
                background: p.statut === 'recu' ? '#14532d' : '#1c1400',
                border: `1px solid ${p.statut === 'recu' ? '#22c55e' : '#f59e0b'}`,
                borderRadius: '10px', padding: '2px 8px', fontSize: '11px',
                color: p.statut === 'recu' ? '#86efac' : '#fbbf24',
              }}>
                {p.statut === 'recu' ? 'Reçu' : 'En attente'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
