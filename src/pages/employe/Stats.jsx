import { useState } from 'react'
import { MOCK_STATS_MARCUS } from '@/data/mockEmploye'
import { OR, CREME, NOIR, CARD, formatMontant } from '@/lib/utils'

const PERIODS = ['Semaine', 'Mois', 'Total']

const RANK_COLORS = ['#B8922A', '#9CA3AF', '#CD7F32']
const RANK_LABELS = ['#1', '#2', '#3']

export default function EmployeStats() {
  const [period, setPeriod] = useState('Semaine')
  const s = MOCK_STATS_MARCUS

  const commission = period === 'Semaine' ? s.commission_semaine : period === 'Mois' ? s.commission_mois : null
  const services   = period === 'Semaine' ? s.services_semaine  : period === 'Mois' ? s.services_mois   : s.services_total

  const projection = s.commission_semaine * 4

  const maxCount = Math.max(...s.top_services.map(t => t.count))

  return (
    <div style={{ fontFamily: `'DM Sans', sans-serif`, color: NOIR, padding: '16px', paddingBottom: '100px' }}>
      <div style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px' }}>Mes statistiques</div>

      {/* Period tabs */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '24px' }}>
        {PERIODS.map(p => (
          <button key={p} onClick={() => setPeriod(p)} style={{
            flex: 1, background: period === p ? OR : `rgba(14,12,9,0.08)`,
            color: period === p ? NOIR : `rgba(14,12,9,0.7)`,
            border: 'none', borderRadius: '999px', padding: '9px',
            fontSize: '13px', fontWeight: 700, cursor: 'pointer',
            fontFamily: `'DM Sans', sans-serif`,
          }}>
            {p}
          </button>
        ))}
      </div>

      {/* ── Section 1: KPI row ── */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
        <div style={{
          flex: 1, background: CARD, borderRadius: '14px', padding: '14px',
          border: `1px solid rgba(14,12,9,0.08)`, textAlign: 'center',
        }}>
          <div style={{ fontSize: '11px', color: `rgba(14,12,9,0.45)`, marginBottom: '6px' }}>Commission</div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: OR }}>
            {commission !== null ? formatMontant(commission) : '—'}
          </div>
        </div>
        <div style={{
          flex: 1, background: CARD, borderRadius: '14px', padding: '14px',
          border: `1px solid rgba(14,12,9,0.08)`, textAlign: 'center',
        }}>
          <div style={{ fontSize: '11px', color: `rgba(14,12,9,0.45)`, marginBottom: '6px' }}>Services</div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: OR }}>{services}</div>
        </div>
        <div style={{
          flex: 1, background: CARD, borderRadius: '14px', padding: '14px',
          border: `1px solid rgba(14,12,9,0.08)`, textAlign: 'center',
        }}>
          <div style={{ fontSize: '11px', color: `rgba(14,12,9,0.45)`, marginBottom: '6px' }}>Taux comm.</div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: '#22c55e' }}>50%</div>
        </div>
      </div>

      {/* ── Section 2: Top 3 services ── */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '12px' }}>Top services</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {s.top_services.map((svc, i) => (
            <div key={svc.nom} style={{
              background: CARD, borderRadius: '12px', padding: '14px',
              border: `1px solid rgba(184,146,42,0.12)`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  background: `${RANK_COLORS[i]}22`, border: `2px solid ${RANK_COLORS[i]}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '11px', fontWeight: 700, color: RANK_COLORS[i], flexShrink: 0,
                }}>
                  {RANK_LABELS[i]}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '13px' }}>{svc.nom}</div>
                  <div style={{ fontSize: '12px', color: `rgba(14,12,9,0.5)` }}>
                    {svc.count} services · {formatMontant(svc.commission)}
                  </div>
                </div>
              </div>
              {/* Horizontal bar */}
              <div style={{ background: 'rgba(14,12,9,0.08)', borderRadius: '999px', height: '6px', overflow: 'hidden' }}>
                <div style={{
                  width: `${(svc.count / maxCount) * 100}%`,
                  height: '100%',
                  borderRadius: '999px',
                  background: RANK_COLORS[i],
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Section 3: Projection ── */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '12px' }}>Projection mensuelle</div>
        <div style={{
          background: CARD, borderRadius: '14px', padding: '16px',
          border: `1px solid rgba(14,12,9,0.08)`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: '12px', color: `rgba(14,12,9,0.45)`, marginBottom: '4px' }}>
              À ce rythme (semaine × 4)
            </div>
            <div style={{ fontSize: '22px', fontWeight: 700, color: OR }}>
              {formatMontant(projection)} / mois
            </div>
          </div>
          <span style={{ fontSize: '28px' }}>🎯</span>
        </div>
      </div>

      {/* ── Section 4: Note ── */}
      <div style={{
        background: `rgba(184,146,42,0.06)`,
        border: `1px solid rgba(14,12,9,0.08)`,
        borderRadius: '12px',
        padding: '14px',
        fontSize: '12px',
        color: `rgba(14,12,9,0.5)`,
        lineHeight: 1.6,
        marginBottom: '24px',
      }}>
        ℹ️ Commission calculée à 50% du prix client. Les walk-ins comptent identiquement.
      </div>

      {/* ── Section 5: Mes avis clients ── */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '12px' }}>Mes avis clients</div>
        <div style={{ background: CARD, borderRadius: '14px', padding: '16px', border: `1px solid rgba(184,146,42,0.12)` }}>

          {/* Note globale + étoiles */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px', paddingBottom: '14px', borderBottom: `1px solid rgba(184,146,42,0.08)` }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '36px', fontWeight: 700, color: OR, lineHeight: 1 }}>{s.note_moyenne}</div>
              <div style={{ fontSize: '11px', color: `rgba(14,12,9,0.4)`, marginTop: '2px' }}>/ 5</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '18px', letterSpacing: '2px', color: OR, marginBottom: '6px' }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} style={{ color: i < Math.round(s.note_moyenne) ? OR : 'rgba(14,12,9,0.08)' }}>★</span>
                ))}
              </div>
              <div style={{ fontSize: '11px', color: `rgba(14,12,9,0.4)` }}>
                {Object.values(s.repartition_notes).reduce((a, b) => a + b, 0)} avis
              </div>
            </div>
          </div>

          {/* Répartition des notes */}
          <div style={{ marginBottom: '16px', paddingBottom: '14px', borderBottom: `1px solid rgba(184,146,42,0.08)` }}>
            {[5, 4, 3, 2, 1].map(star => {
              const count = s.repartition_notes[star] || 0
              const total = Object.values(s.repartition_notes).reduce((a, b) => a + b, 0)
              const pct = total > 0 ? (count / total) * 100 : 0
              return (
                <div key={star} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <div style={{ width: '28px', fontSize: '11px', color: `rgba(14,12,9,0.6)`, flexShrink: 0 }}>{star} ★</div>
                  <div style={{ flex: 1, background: 'rgba(14,12,9,0.08)', borderRadius: '999px', height: '6px', overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: OR, borderRadius: '999px', opacity: 0.4 + (star / 10) }} />
                  </div>
                  <div style={{ width: '20px', fontSize: '11px', color: `rgba(14,12,9,0.45)`, textAlign: 'right', flexShrink: 0 }}>{count}</div>
                </div>
              )
            })}
          </div>

          {/* 3 derniers commentaires */}
          {[
            { client: 'Jean-Paul R.', note: 5, commentaire: `Coupe parfaite, Marcus sait exactement ce qu'il fait.`, date: '28 mars' },
            { client: 'Kevin M.', note: 5, commentaire: 'Dégradé impeccable, finitions à la perfection.', date: '22 mars' },
            { client: 'Omar B.', note: 4, commentaire: 'Très bonne barbe, un peu d\'attente mais ça valait le coup.', date: '15 mars' },
          ].map((avis, i) => (
            <div key={i} style={{ borderTop: i > 0 ? `1px solid rgba(184,146,42,0.08)` : 'none', paddingTop: i > 0 ? '10px' : 0, marginTop: i > 0 ? '10px' : 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: NOIR }}>{avis.client}</span>
                  <span style={{ fontSize: '12px', letterSpacing: 1 }}>
                    {Array.from({ length: 5 }).map((_, j) => (
                      <span key={j} style={{ color: j < avis.note ? OR : 'rgba(14,12,9,0.08)' }}>★</span>
                    ))}
                  </span>
                </div>
                <span style={{ fontSize: '11px', color: `rgba(14,12,9,0.35)` }}>{avis.date}</span>
              </div>
              <div style={{ fontSize: '12px', color: `rgba(14,12,9,0.55)`, fontStyle: 'italic' }}>
                "{avis.commentaire}"
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
