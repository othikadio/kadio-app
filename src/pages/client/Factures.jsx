import { useState } from 'react'
import { OR, CREME, NOIR, CARD, formatDate, statutColor } from '@/lib/utils'
import { MOCK_FACTURES_AMINATA } from '@/data/mockClient'

function StatutBadge({ statut }) {
  const color = statutColor(statut === 'paye' ? 'termine' : statut)
  const labels = { paye: 'Payée', impaye: 'Non payée', en_attente: 'En attente' }
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

export default function ClientFactures() {
  const [expandedId, setExpandedId] = useState(null)

  const factures = [...MOCK_FACTURES_AMINATA].sort((a, b) => new Date(b.date) - new Date(a.date))

  // Group by year
  const byYear = factures.reduce((acc, f) => {
    const year = f.date.slice(0, 4)
    if (!acc[year]) acc[year] = []
    acc[year].push(f)
    return acc
  }, {})

  const years = Object.keys(byYear).sort((a, b) => b - a)

  const total2026 = factures
    .filter(f => f.date.startsWith('2026'))
    .reduce((sum, f) => sum + f.montant, 0)

  return (
    <div style={{ fontFamily: `'DM Sans', sans-serif`, background: CREME, minHeight: '100vh', paddingBottom: 100 }}>

      {/* Header */}
      <div style={{ padding: '24px 20px 16px', borderBottom: '1px solid rgba(14,12,9,0.08)' }}>
        <h1 style={{ color: NOIR, fontSize: 22, fontWeight: 700, margin: 0 }}>Mes factures</h1>
      </div>

      {/* 2026 total banner */}
      <div style={{
        margin: '16px 16px',
        background: 'linear-gradient(135deg, rgba(184,146,42,0.12) 0%, rgba(184,146,42,0.04) 100%)',
        border: `1px solid rgba(14,12,9,0.08)`,
        borderRadius: 14,
        padding: '16px 18px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div>
          <div style={{ color: 'rgba(14,12,9,0.5)', fontSize: 12, marginBottom: 4 }}>Total 2026</div>
          <div style={{ color: OR, fontWeight: 800, fontSize: 26 }}>{total2026} $</div>
        </div>
        <div style={{ textAlign: 'right', color: 'rgba(14,12,9,0.4)', fontSize: 12 }}>
          {factures.filter(f => f.date.startsWith('2026')).length} factures
        </div>
      </div>

      <div style={{ padding: '0 16px' }}>
        {years.map(year => (
          <div key={year} style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h2 style={{ color: 'rgba(14,12,9,0.5)', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', margin: 0 }}>
                {year}
              </h2>
              <span style={{ color: 'rgba(14,12,9,0.35)', fontSize: 12 }}>
                {byYear[year].reduce((s, f) => s + f.montant, 0)} $ total
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {byYear[year].map(fac => {
                const isExpanded = expandedId === fac.id
                return (
                  <div key={fac.id}>
                    <div
                      onClick={() => setExpandedId(isExpanded ? null : fac.id)}
                      style={{
                        background: CARD,
                        border: `1px solid ${isExpanded ? 'rgba(14,12,9,0.08)' : 'rgba(14,12,9,0.08)'}`,
                        borderRadius: isExpanded ? '12px 12px 0 0' : 12,
                        padding: '13px 14px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <span style={{ color: NOIR, fontWeight: 600, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {fac.service}
                          </span>
                          <StatutBadge statut={fac.statut} />
                        </div>
                        <div style={{ color: 'rgba(14,12,9,0.4)', fontSize: 11, fontFamily: 'monospace' }}>
                          {fac.numero}
                        </div>
                        <div style={{ color: 'rgba(14,12,9,0.4)', fontSize: 12, marginTop: 2 }}>
                          {formatDate(fac.date)}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ color: NOIR, fontWeight: 700, fontSize: 15 }}>{fac.montant} $</div>
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
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
                          <DetailRow label="N° facture" value={fac.numero} mono />
                          <DetailRow label="Date" value={formatDate(fac.date)} />
                          <DetailRow label="Service" value={fac.service} />
                          <DetailRow label="Partenaire" value={fac.partenaire} />
                          <DetailRow label="Montant" value={`${fac.montant} $`} />
                          <DetailRow label="Statut" value="Payée" />
                        </div>
                        <button
                          onClick={() => alert(`Téléchargement simulé — disponible en prod`)}
                          style={{
                            width: '100%',
                            padding: '10px 0',
                            background: 'rgba(14,12,9,0.08)',
                            border: `1px solid rgba(14,12,9,0.08)`,
                            borderRadius: 10,
                            color: OR,
                            fontWeight: 700,
                            fontSize: 13,
                            cursor: 'pointer',
                            fontFamily: `'DM Sans', sans-serif`,
                          }}
                        >
                          ⬇ Télécharger PDF
                        </button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
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
        letterSpacing: mono ? '0.04em' : 0,
      }}>
        {value}
      </span>
    </div>
  )
}
