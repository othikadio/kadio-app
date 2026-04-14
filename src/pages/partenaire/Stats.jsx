import { useState } from 'react'
import { MOCK_STATS_DIANE } from '@/data/mockPartenaire'
import { OR, CREME, NOIR, CARD, formatMontant } from '@/lib/utils'

const PERIOD_TABS = [
  { key: 'semaine', label: 'Semaine' },
  { key: 'mois', label: 'Mois' },
  { key: 'annee', label: 'Année' },
]

export default function PartenaireStats() {
  const s = MOCK_STATS_DIANE
  const [period, setPeriod] = useState('mois')

  const revenu = period === 'semaine' ? s.revenus_semaine : period === 'mois' ? s.revenus_mois : s.revenus_annee

  const totalNotes = Object.values(s.repartition_notes).reduce((a, b) => a + b, 0)

  return (
    <div style={{ fontFamily: `'DM Sans', sans-serif`, color: NOIR, padding: '16px', paddingBottom: '100px' }}>
      <div style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px' }}>Statistiques</div>

      {/* Period tabs */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '20px' }}>
        {PERIOD_TABS.map(tab => (
          <button key={tab.key} onClick={() => setPeriod(tab.key)}
            style={{
              flex: 1, background: period === tab.key ? OR : `rgba(14,12,9,0.08)`,
              color: period === tab.key ? '#0E0C09' : `rgba(250,248,248,0.7)`,
              border: 'none', borderRadius: '999px', padding: '9px',
              fontSize: '13px', fontWeight: 700, cursor: 'pointer',
              fontFamily: `'DM Sans', sans-serif`,
            }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Section 1 — Revenus */}
      <div style={{ background: CARD, borderRadius: '14px', padding: '20px', marginBottom: '16px', textAlign: 'center', border: `1px solid rgba(14,12,9,0.08)` }}>
        <div style={{ fontSize: '11px', color: `rgba(14,12,9,0.45)`, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
          Revenus — {PERIOD_TABS.find(t => t.key === period)?.label}
        </div>
        <div style={{ fontFamily: `'Bebas Neue', sans-serif`, fontSize: '44px', color: '#22c55e', letterSpacing: '0.04em' }}>
          {formatMontant(revenu)}
        </div>
      </div>

      {/* 3 KPI mini cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '20px' }}>
        {[
          { label: 'Services ce mois', value: s.services_mois },
          { label: 'Note moyenne', value: `⭐ ${s.note_moyenne}`, color: OR },
          { label: 'Total services', value: s.services_total },
        ].map((k, i) => (
          <div key={i} style={{ background: CARD, borderRadius: '10px', padding: '12px 8px', textAlign: 'center', border: `1px solid rgba(14,12,9,0.08)` }}>
            <div style={{ fontSize: '18px', fontWeight: 700, color: k.color || CREME }}>{k.value}</div>
            <div style={{ fontSize: '10px', color: `rgba(14,12,9,0.45)`, marginTop: '4px', lineHeight: 1.3 }}>{k.label}</div>
          </div>
        ))}
      </div>

      {/* Section 2 — Notes */}
      <div style={{ background: CARD, borderRadius: '14px', padding: '16px', marginBottom: '16px', border: `1px solid rgba(14,12,9,0.08)` }}>
        <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '14px', color: OR }}>Répartition des notes</div>
        {[5, 4, 3, 2, 1].map(star => {
          const count = s.repartition_notes[star] || 0
          const pct = totalNotes > 0 ? (count / totalNotes) * 100 : 0
          return (
            <div key={star} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div style={{ width: '32px', fontSize: '12px', color: `rgba(14,12,9,0.7)`, flexShrink: 0 }}>{star} ⭐</div>
              <div style={{ flex: 1, background: `rgba(14,12,9,0.08)`, borderRadius: '999px', height: '8px', overflow: 'hidden' }}>
                <div style={{
                  width: `${pct}%`, height: '100%',
                  background: OR, opacity: 0.4 + (star / 10),
                  borderRadius: '999px', transition: 'width 0.3s',
                }} />
              </div>
              <div style={{ width: '24px', fontSize: '12px', color: `rgba(14,12,9,0.55)`, textAlign: 'right', flexShrink: 0 }}>{count}</div>
            </div>
          )
        })}
      </div>

      {/* Section 3 — Top services */}
      <div style={{ background: CARD, borderRadius: '14px', padding: '16px', marginBottom: '16px', border: `1px solid rgba(14,12,9,0.08)` }}>
        <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '14px', color: OR }}>Top 3 services</div>
        {s.top_services.map((svc, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{
              width: '28px', height: '28px', borderRadius: '50%',
              background: i === 0 ? OR : i === 1 ? 'rgba(184,146,42,0.4)' : 'rgba(14,12,9,0.08)',
              color: '#0E0C09', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '13px', fontWeight: 700, flexShrink: 0,
            }}>
              {i + 1}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '13px', fontWeight: 600 }}>{svc.nom}</div>
              <div style={{ fontSize: '11px', color: `rgba(14,12,9,0.45)` }}>{svc.count} services</div>
            </div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#22c55e' }}>{formatMontant(svc.revenus)}</div>
          </div>
        ))}
      </div>

      {/* Section 4 — Clients fidèles */}
      <div style={{ background: CARD, borderRadius: '14px', padding: '16px', marginBottom: '16px', border: `1px solid rgba(14,12,9,0.08)` }}>
        <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '14px', color: OR }}>Clients fidèles</div>
        <div style={{ display: 'flex', gap: '10px' }}>
          {s.clients_fideles.map((c, i) => (
            <div key={i} style={{ flex: 1, background: `rgba(184,146,42,0.06)`, borderRadius: '10px', padding: '12px', textAlign: 'center', border: `1px solid rgba(14,12,9,0.08)` }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%', background: `rgba(14,12,9,0.08)`,
                border: `1px solid ${OR}`, margin: '0 auto 8px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: OR, fontWeight: 700, fontSize: '14px',
              }}>
                {c.prenom[0]}
              </div>
              <div style={{ fontWeight: 700, fontSize: '12px' }}>{c.prenom}</div>
              <div style={{ fontSize: '11px', color: `rgba(14,12,9,0.5)`, marginTop: '4px' }}>
                📅 {c.rdv_count} RDV
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 5 — Mes avis clients */}
      <div style={{ background: CARD, borderRadius: '14px', padding: '16px', border: `1px solid rgba(14,12,9,0.08)` }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div style={{ fontSize: '14px', fontWeight: 700, color: OR }}>Mes avis clients</div>
          <div style={{ fontSize: '20px', fontWeight: 700, color: OR }}>⭐ {s.note_moyenne}</div>
        </div>
        {[
          { client: 'Aminata D.', note: 5, commentaire: 'Incroyable comme toujours ! Les tresses sont parfaites.', date: '8 mars' },
          { client: 'Fatoumata K.', note: 5, commentaire: 'Très professionnelle, rapide et douce. Je recommande !', date: '1 mars' },
          { client: 'Christelle M.', note: 4, commentaire: 'Super résultat, juste un peu de retard au départ.', date: '18 fév.' },
        ].map((avis, i) => (
          <div key={i} style={{ borderTop: i > 0 ? `1px solid rgba(184,146,42,0.08)` : 'none', paddingTop: i > 0 ? '12px' : 0, marginTop: i > 0 ? '12px' : 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700 }}>{avis.client}</span>
                <span style={{ fontSize: '13px', letterSpacing: 1 }}>
                  {Array.from({ length: 5 }).map((_, j) => (
                    <span key={j} style={{ color: j < avis.note ? OR : 'rgba(14,12,9,0.08)' }}>★</span>
                  ))}
                </span>
              </div>
              <span style={{ fontSize: '11px', color: `rgba(14,12,9,0.4)` }}>{avis.date}</span>
            </div>
            <div style={{ fontSize: '12px', color: `rgba(14,12,9,0.6)`, fontStyle: 'italic' }}>
              "{avis.commentaire}"
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
