import { useState } from 'react'
import { OR, CREME, NOIR, CARD, formatDate, formatDateShort, statutColor, formatMontant } from '@/lib/utils'
import { useRdvClient } from '@/hooks'

const FILTRES = ['Tous', 'Terminés', 'Annulés', 'No-show']

const LIEU_LABEL = {
  domicile_client: 'Chez vous',
  salon_kadio:     'Salon Kadio',
  deplacement:     'Déplacement',
}

function StatutBadge({ statut }) {
  const color = statutColor(statut)
  const labels = {
    confirme: 'Confirmé', en_attente: 'En attente',
    termine: 'Terminé', annule: 'Annulé', no_show: 'No-show',
  }
  return (
    <span style={{
      display: 'inline-block', padding: '2px 8px', borderRadius: 20,
      fontSize: 10, fontWeight: 700, color,
      background: `${color}18`, border: `1px solid ${color}40`,
    }}>
      {labels[statut] || statut}
    </span>
  )
}

export default function ClientHistorique() {
  const { data: rdvList, loading } = useRdvClient('client-aminata')
  const [filtre, setFiltre] = useState('Tous')
  const [expandedId, setExpandedId] = useState(null)

  if (loading) {
    return <div style={{ fontFamily: `'DM Sans', sans-serif`, background: CREME, minHeight: '100vh', padding: '32px 16px', textAlign: 'center', color: 'rgba(14,12,9,0.4)' }}>Chargement...</div>
  }

  const past = rdvList.filter(r =>
    r.statut === 'termine' || r.statut === 'annule' || r.statut === 'no_show'
  ).sort((a, b) => new Date(b.date_rdv) - new Date(a.date_rdv))

  const filtered = past.filter(r => {
    if (filtre === 'Tous') return true
    if (filtre === 'Terminés') return r.statut === 'termine'
    if (filtre === 'Annulés') return r.statut === 'annule'
    if (filtre === 'No-show') return r.statut === 'no_show'
    return true
  })

  const totalDepense = past
    .filter(r => r.statut === 'termine')
    .reduce((sum, r) => sum + r.prix_total, 0)

  return (
    <div style={{ fontFamily: `'DM Sans', sans-serif`, background: CREME, minHeight: '100vh', paddingBottom: 100 }}>

      {/* Header */}
      <div style={{ padding: '24px 20px 16px', borderBottom: '1px solid rgba(14,12,9,0.08)' }}>
        <h1 style={{ color: NOIR, fontSize: 22, fontWeight: 700, margin: 0 }}>Historique complet</h1>
      </div>

      {/* Total banner */}
      <div style={{
        margin: '16px 16px',
        background: 'linear-gradient(135deg, rgba(184,146,42,0.12) 0%, rgba(184,146,42,0.05) 100%)',
        border: `1px solid rgba(14,12,9,0.08)`,
        borderRadius: 14,
        padding: '16px 18px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div>
          <div style={{ color: 'rgba(14,12,9,0.5)', fontSize: 12, marginBottom: 4 }}>Total dépensé (services terminés)</div>
          <div style={{ color: OR, fontWeight: 800, fontSize: 26 }}>{totalDepense} $</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ color: 'rgba(14,12,9,0.4)', fontSize: 12 }}>
            {past.filter(r => r.statut === 'termine').length} RDV terminés
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{ padding: '4px 16px 16px', display: 'flex', gap: 8, overflowX: 'auto' }}>
        {FILTRES.map(f => (
          <button
            key={f}
            onClick={() => setFiltre(f)}
            style={{
              padding: '7px 16px',
              borderRadius: 20,
              border: `1.5px solid ${filtre === f ? OR : 'rgba(184,146,42,0.25)'}`,
              background: filtre === f ? OR : 'transparent',
              color: filtre === f ? NOIR : CREME,
              fontWeight: 600,
              fontSize: 13,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              fontFamily: `'DM Sans', sans-serif`,
            }}
          >
            {f}
          </button>
        ))}
      </div>

      <div style={{ padding: '0 16px' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>📋</div>
            <p style={{ color: 'rgba(14,12,9,0.4)', fontSize: 14 }}>
              Aucun RDV dans cette catégorie
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filtered.map(rdv => {
              const isExpanded = expandedId === rdv.id
              const isMuted = rdv.statut === 'annule' || rdv.statut === 'no_show'
              return (
                <div key={rdv.id}>
                  <div
                    onClick={() => setExpandedId(isExpanded ? null : rdv.id)}
                    style={{
                      background: CARD,
                      border: `1px solid ${isExpanded ? 'rgba(14,12,9,0.08)' : 'rgba(14,12,9,0.08)'}`,
                      borderRadius: isExpanded ? '12px 12px 0 0' : 12,
                      padding: '13px 14px',
                      cursor: 'pointer',
                      opacity: isMuted ? 0.7 : 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span style={{ color: NOIR, fontWeight: 600, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {rdv.service.nom}
                        </span>
                        <StatutBadge statut={rdv.statut} />
                      </div>
                      <div style={{ display: 'flex', gap: 10, color: 'rgba(14,12,9,0.45)', fontSize: 12 }}>
                        <span>{formatDateShort(rdv.date_rdv)}</span>
                        <span>·</span>
                        <span>{rdv.partenaire.prenom} {rdv.partenaire.nom}</span>
                        <span>·</span>
                        <span>{LIEU_LABEL[rdv.lieu] || rdv.lieu}</span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ color: isMuted ? 'rgba(14,12,9,0.35)' : CREME, fontWeight: 600, fontSize: 14 }}>
                        {rdv.prix_total} $
                      </div>
                      <div style={{ color: 'rgba(14,12,9,0.3)', fontSize: 12 }}>
                        {isExpanded ? '▲' : '▼'}
                      </div>
                    </div>
                  </div>

                  {isExpanded && (
                    <div style={{
                      background: '#0f0d0a',
                      border: `1px solid rgba(14,12,9,0.08)`,
                      borderTop: 'none',
                      borderRadius: '0 0 12px 12px',
                      padding: '14px 16px',
                    }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <DetailRow label="Code QR" value={rdv.code_qr} mono />
                        <DetailRow label="Date" value={formatDate(rdv.date_rdv)} />
                        <DetailRow label="Heure" value={`${rdv.heure_debut} → ${rdv.heure_fin}`} />
                        <DetailRow label="Dépôt payé" value={`${rdv.depot_paye} $`} />
                        <DetailRow label="Prix total" value={`${rdv.prix_total} $`} />
                        {rdv.note_client && (
                          <DetailRow label="Votre note" value={`${'★'.repeat(rdv.note_client)}${'☆'.repeat(5 - rdv.note_client)}`} />
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function DetailRow({ label, value, mono }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ color: 'rgba(14,12,9,0.45)', fontSize: 12 }}>{label}</span>
      <span style={{
        color: NOIR, fontSize: 12, fontWeight: 600,
        fontFamily: mono ? 'monospace' : 'inherit',
        letterSpacing: mono ? '0.05em' : 0,
      }}>
        {value}
      </span>
    </div>
  )
}
