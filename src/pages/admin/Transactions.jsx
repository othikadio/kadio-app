import { useState } from 'react'
import { OR, CREME, NOIR, CARD, MUTED, BORDER_OR, formatMontant, formatDate, statutColor } from '@/lib/utils'
import { MOCK_STATS_ADMIN } from '@/data/mockAdmin'
import { useAllTransactions } from '@/hooks'

const TYPE_LABELS = {
  abonnement: 'Abonnement',
  rdv_salon: 'RDV Salon',
  rdv_domicile: 'RDV Domicile',
  materiel: 'Matériel',
}

const TYPE_COLORS = {
  abonnement: '#60a5fa',
  rdv_salon: '#22c55e',
  rdv_domicile: '#a78bfa',
  materiel: '#f59e0b',
}

export default function AdminTransactions() {
  const { data: transactions = [], loading } = useAllTransactions()
  const totalCommissions = transactions.filter(t => t.statut === 'recu').reduce((s, t) => s + (t.commission_kadio || 0), 0)
  const totalRevenus = transactions.filter(t => t.statut === 'recu').reduce((s, t) => s + (t.montant || 0), 0)
  const totalAttente = transactions.filter(t => t.statut === 'en_attente').reduce((s, t) => s + (t.montant || 0), 0)
  const maxSource = Math.max(...MOCK_STATS_ADMIN.revenus_par_source.map(s => s.montant))

  const [toast, setToast] = useState('')
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500) }

  return (
    <div style={{ padding: '24px', paddingBottom: '100px', color: NOIR, background: CREME, minHeight: '100vh' }}>
      {loading && <div className="p-8 text-center text-zinc-400">Chargement...</div>}
      {toast && <div style={{ position: 'fixed', top: '20px', right: '20px', background: '#22c55e', color: '#fff', padding: '10px 18px', borderRadius: '8px', zIndex: 999, fontSize: '14px' }}>{toast}</div>}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h1 style={{ color: OR, fontSize: '22px', fontWeight: '700', margin: '0 0 4px' }}>Finances & Transactions</h1>
          <p style={{ color: MUTED, margin: 0, fontSize: '13px' }}>Mars 2026</p>
        </div>
        <button
          onClick={() => { showToast('Export CSV simulé') }}
          style={{ padding: '8px 16px', borderRadius: '8px', border: `1px solid ${BORDER_OR}`, background: 'none', color: OR, fontWeight: '600', cursor: 'pointer', fontSize: '13px' }}
        >{`Export CSV`}</button>
      </div>

      {/* Stats top */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '20px' }}>
        {[
          { label: 'Commissions', value: formatMontant(totalCommissions), color: OR },
          { label: 'Revenus total', value: formatMontant(totalRevenus), color: '#22c55e' },
          { label: 'En attente', value: formatMontant(totalAttente), color: '#f59e0b' },
        ].map((s, i) => (
          <div key={i} style={{ background: CARD, border: `1px solid ${BORDER_OR}`, borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
            <p style={{ color: MUTED, fontSize: '10px', margin: '0 0 4px', textTransform: 'uppercase' }}>{s.label}</p>
            <p style={{ color: s.color, fontSize: '16px', fontWeight: '700', margin: 0 }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Répartition par source */}
      <div style={{ background: CARD, border: `1px solid ${BORDER_OR}`, borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
        <p style={{ color: MUTED, fontSize: '11px', margin: '0 0 12px', textTransform: 'uppercase' }}>Répartition par source</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {MOCK_STATS_ADMIN.revenus_par_source.map((s, i) => {
            const pct = Math.round((s.montant / maxSource) * 100)
            const colors = [OR, '#22c55e', '#a78bfa', '#f59e0b']
            return (
              <div key={s.source}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '12px', color: NOIR }}>{s.source}</span>
                  <span style={{ fontSize: '12px', color: colors[i], fontWeight: '600' }}>{formatMontant(s.montant)}</span>
                </div>
                <div style={{ background: CREME, borderRadius: '4px', height: '6px', overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: colors[i], borderRadius: '4px', transition: 'width 0.3s' }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Liste transactions */}
      <h2 style={{ color: OR, fontSize: '16px', fontWeight: '600', margin: '0 0 12px' }}>Transactions</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {(transactions || []).map(t => (
          <div key={t.id} style={{ background: CARD, border: `1px solid ${BORDER_OR}`, borderRadius: '10px', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ background: (TYPE_COLORS[t.type] || '#6b7280') + '22', color: TYPE_COLORS[t.type] || '#6b7280', fontSize: '11px', padding: '2px 8px', borderRadius: '10px', fontWeight: '600', whiteSpace: 'nowrap', flexShrink: 0 }}>
              {TYPE_LABELS[t.type]}
            </span>
            <div style={{ flex: 1 }}>
              <p style={{ margin: '0 0 2px', fontSize: '13px', color: NOIR, fontWeight: '600' }}>{t.client || t.partenaire || '—'}</p>
              {t.partenaire && t.client && <p style={{ margin: 0, fontSize: '11px', color: MUTED }}>via {t.partenaire}</p>}
              <p style={{ margin: '2px 0 0', fontSize: '11px', color: MUTED }}>{formatDate(t.date)}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: '0 0 2px', color: NOIR, fontSize: '14px', fontWeight: '700' }}>{formatMontant(t.montant)}</p>
              <p style={{ margin: '0 0 4px', color: OR, fontSize: '11px' }}>+{formatMontant(t.commission_kadio)}</p>
              <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '10px', background: statutColor(t.statut) + '22', color: statutColor(t.statut), fontWeight: '600' }}>
                {t.statut === 'recu' ? 'Reçu' : 'Attente'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
