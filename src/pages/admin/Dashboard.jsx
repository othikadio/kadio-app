import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { OR, CREME, NOIR, CARD, MUTED, BORDER_OR, formatMontant, statutColor, initiales } from '@/lib/utils'
import { MOCK_ALERTES, MOCK_STATS_ADMIN } from '@/data/mockAdmin'
import { useAllRdv } from '@/hooks'

const TODAY = '2026-03-28'

const alerteIcon = (type) => {
  if (type === 'no_show') return '🚫'
  if (type === 'paiement') return '💳'
  if (type === 'virement') return '💸'
  if (type === 'candidature') return '📋'
  return '⚠️'
}

const severityColor = (s) => {
  if (s === 'high') return '#ef4444'
  if (s === 'medium') return '#f59e0b'
  return '#60a5fa'
}

const ACCES_RAPIDES = [
  { label: 'Candidats', icon: '📋', path: '/admin/candidats' },
  { label: 'Partenaires', icon: '💼', path: '/admin/partenaires' },
  { label: 'Clients', icon: '👥', path: '/admin/clients' },
  { label: `Employés`, icon: '🧑‍💼', path: '/admin/employes' },
  { label: 'Abonnements', icon: '📦', path: '/admin/abonnements' },
  { label: 'Virements', icon: '💸', path: '/admin/virements' },
  { label: 'SMS', icon: '📱', path: '/admin/sms' },
  { label: 'Stats', icon: '📊', path: '/admin/stats' },
]

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [alertes, setAlertes] = useState(MOCK_ALERTES)
  const { data: rdvReseau, loading: loadingRdv } = useAllRdv()

  const dismissAlerte = (id) => setAlertes(prev => prev.filter(a => a.id !== id))

  const dateLabel = new Date(TODAY).toLocaleDateString('fr-CA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  const rdvAujourdhui = (rdvReseau || []).filter(r => r.date === TODAY)
  const revenusAujourdHui = rdvAujourdhui.reduce((s, r) => s + (r.montant || 0), 0)

  const kpis = [
    { label: 'RDV réseau aujourd\'hui', value: rdvAujourdhui.length, unit: 'rendez-vous', color: OR },
    { label: `Revenus aujourd'hui`, value: formatMontant(revenusAujourdHui), unit: '', color: '#22c55e' },
    { label: `Abonnés actifs`, value: MOCK_STATS_ADMIN.abonnes_actifs, unit: 'abonnés', color: '#60a5fa' },
    { label: `Partenaires actifs`, value: MOCK_STATS_ADMIN.partenaires_actifs, unit: 'partenaires', color: '#a78bfa' },
  ]

  return (
    <div style={{ padding: '24px', paddingBottom: '100px', color: NOIR, background: CREME, minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ color: OR, fontSize: '26px', fontWeight: '700', margin: '0 0 4px' }}>
          {`Bonjour, Othi 👋`}
        </h1>
        <p style={{ color: MUTED, margin: 0, fontSize: '14px', textTransform: 'capitalize' }}>{dateLabel}</p>
      </div>

      {/* KPI Grid 2×2 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '28px' }}>
        {kpis.map((k, i) => (
          <div key={i} style={{ background: CARD, border: `1px solid ${BORDER_OR}`, borderRadius: '12px', padding: '16px' }}>
            <p style={{ color: MUTED, fontSize: '11px', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{k.label}</p>
            <p style={{ color: k.color, fontSize: '24px', fontWeight: '700', margin: '0 0 2px' }}>{k.value}</p>
            {k.unit && <p style={{ color: MUTED, fontSize: '12px', margin: 0 }}>{k.unit}</p>}
          </div>
        ))}
      </div>

      {/* Alertes */}
      {alertes.length > 0 && (
        <div style={{ marginBottom: '28px' }}>
          <h2 style={{ color: OR, fontSize: '16px', fontWeight: '600', margin: '0 0 12px' }}>
            {`⚡ Alertes prioritaires`}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {alertes.map(a => (
              <div key={a.id} style={{
                background: CARD,
                border: `1px solid ${severityColor(a.severity)}40`,
                borderLeft: `3px solid ${severityColor(a.severity)}`,
                borderRadius: '8px',
                padding: '12px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}>
                <span style={{ fontSize: '18px' }}>{alerteIcon(a.type)}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: '0 0 4px', fontSize: '13px', color: NOIR }}>{a.message}</p>
                  <span style={{ fontSize: '11px', color: severityColor(a.severity), fontWeight: '600' }}>{a.action}</span>
                </div>
                <button
                  onClick={() => dismissAlerte(a.id)}
                  style={{ background: 'none', border: 'none', color: MUTED, cursor: 'pointer', fontSize: '16px', padding: '4px' }}
                >✕</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Derniers RDV réseau */}
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ color: OR, fontSize: '16px', fontWeight: '600', margin: '0 0 12px' }}>
          {`5 derniers RDV réseau`}
        </h2>
        {loadingRdv && <div className="p-8 text-center text-zinc-400">Chargement...</div>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[...(rdvReseau || [])].slice(0, 5).map(rdv => (
            <div key={rdv.id} style={{
              background: CARD,
              border: `1px solid ${BORDER_OR}`,
              borderRadius: '10px',
              padding: '12px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%',
                background: OR + '22', display: 'flex', alignItems: 'center',
                justifyContent: 'center', color: OR, fontWeight: '700', fontSize: '13px', flexShrink: 0,
              }}>
                {rdv.heure}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: '0 0 2px', fontSize: '13px', fontWeight: '600', color: NOIR }}>
                  {rdv.client} — <span style={{ color: MUTED, fontWeight: '400' }}>{rdv.coiffeur}</span>
                </p>
                <p style={{ margin: 0, fontSize: '12px', color: MUTED }}>{rdv.service} · {rdv.lieu === 'salon' ? `Salon` : `Domicile`}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{
                  display: 'inline-block', fontSize: '11px', padding: '2px 8px',
                  borderRadius: '20px', background: statutColor(rdv.statut) + '22',
                  color: statutColor(rdv.statut), fontWeight: '600',
                }}>{rdv.statut.replace('_', ' ')}</span>
                <p style={{ margin: '4px 0 0', fontSize: '12px', color: OR }}>{formatMontant(rdv.montant)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Accès rapides */}
      <div>
        <h2 style={{ color: OR, fontSize: '16px', fontWeight: '600', margin: '0 0 12px' }}>
          {`Accès rapides`}
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {ACCES_RAPIDES.map((a, i) => (
            <button
              key={i}
              onClick={() => navigate(a.path)}
              style={{
                background: CARD, border: `1px solid ${BORDER_OR}`, borderRadius: '10px',
                padding: '14px 12px', display: 'flex', alignItems: 'center', gap: '10px',
                cursor: 'pointer', color: NOIR, fontSize: '14px', fontWeight: '500',
                transition: 'border-color 0.2s',
              }}
            >
              <span style={{ fontSize: '20px' }}>{a.icon}</span>
              {a.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
