import { OR, CREME, NOIR, CARD, MUTED, BORDER_OR, formatMontant } from '@/lib/utils'
import { MOCK_STATS_ADMIN } from '@/data/mockAdmin'
import { useAllPartenaires } from '@/hooks'

const pct = (val, prev) => {
  if (!prev) return 0
  return (((val - prev) / prev) * 100).toFixed(1)
}

export default function AdminStats() {
  const { data: partenaires = [], loading } = useAllPartenaires()
  const rdvPct = pct(MOCK_STATS_ADMIN.rdv_semaine, MOCK_STATS_ADMIN.rdv_semaine_prev)
  const revPct = pct(MOCK_STATS_ADMIN.revenus_mois, MOCK_STATS_ADMIN.revenus_mois_prev)
  const maxMois = Math.max(...MOCK_STATS_ADMIN.revenus_par_mois.map(m => m.montant))
  const maxService = Math.max(...MOCK_STATS_ADMIN.top_services.map(s => s.count))
  const maxSource = Math.max(...MOCK_STATS_ADMIN.revenus_par_source.map(s => s.montant))
  const sortedPartenaires = [...(partenaires || [])].sort((a, b) => (b.revenus_mois || 0) - (a.revenus_mois || 0))

  const sourceColors = [OR, '#22c55e', '#a78bfa', '#f59e0b']

  return (
    <div style={{ padding: '24px', paddingBottom: '100px', color: NOIR, background: CREME, minHeight: '100vh' }}>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ color: OR, fontSize: '22px', fontWeight: '700', margin: '0 0 4px' }}>Statistiques</h1>
        <p style={{ color: MUTED, margin: 0, fontSize: '13px' }}>Mars 2026 — Réseau Kadio</p>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '24px' }}>
        {[
          { label: 'RDV réseau / semaine', value: MOCK_STATS_ADMIN.rdv_semaine, delta: `+${rdvPct}%`, color: OR },
          { label: 'Revenus / mois', value: formatMontant(MOCK_STATS_ADMIN.revenus_mois), delta: `+${revPct}%`, color: '#22c55e' },
          { label: 'No-shows (mois)', value: MOCK_STATS_ADMIN.no_shows_mois, delta: `${MOCK_STATS_ADMIN.taux_no_show}%`, color: '#ef4444' },
          { label: 'Partenaires actifs', value: MOCK_STATS_ADMIN.partenaires_actifs, delta: null, color: '#60a5fa' },
        ].map((k, i) => (
          <div key={i} style={{ background: CARD, border: `1px solid ${BORDER_OR}`, borderRadius: '12px', padding: '16px' }}>
            <p style={{ color: MUTED, fontSize: '11px', margin: '0 0 6px', textTransform: 'uppercase' }}>{k.label}</p>
            <p style={{ color: k.color, fontSize: '24px', fontWeight: '700', margin: '0 0 4px' }}>{k.value}</p>
            {k.delta && <p style={{ color: k.color, fontSize: '12px', margin: 0, opacity: 0.7 }}>{k.delta} vs mois préc.</p>}
          </div>
        ))}
      </div>

      {/* Graphe barres revenus/mois */}
      <div style={{ background: CARD, border: `1px solid ${BORDER_OR}`, borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
        <p style={{ color: MUTED, fontSize: '11px', margin: '0 0 16px', textTransform: 'uppercase' }}>Évolution revenus mensuels</p>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end', height: '100px' }}>
          {MOCK_STATS_ADMIN.revenus_par_mois.map((m, i) => {
            const h = Math.round((m.montant / maxMois) * 90)
            const isLast = i === MOCK_STATS_ADMIN.revenus_par_mois.length - 1
            return (
              <div key={m.mois} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <span style={{ color: isLast ? OR : MUTED, fontSize: '10px', fontWeight: isLast ? '700' : '400' }}>{formatMontant(m.montant).replace(',00 $', '$').replace(' $', '$')}</span>
                <div style={{ width: '100%', height: `${h}px`, background: isLast ? OR : OR + '44', borderRadius: '4px 4px 0 0' }} />
                <span style={{ color: isLast ? OR : MUTED, fontSize: '11px', fontWeight: isLast ? '700' : '400' }}>{m.mois}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Répartition sources */}
      <div style={{ background: CARD, border: `1px solid ${BORDER_OR}`, borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
        <p style={{ color: MUTED, fontSize: '11px', margin: '0 0 12px', textTransform: 'uppercase' }}>Répartition par source</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {MOCK_STATS_ADMIN.revenus_par_source.map((s, i) => {
            const widthPct = Math.round((s.montant / maxSource) * 100)
            return (
              <div key={s.source}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '12px', color: NOIR }}>{s.source}</span>
                  <span style={{ fontSize: '12px', color: sourceColors[i], fontWeight: '600' }}>{formatMontant(s.montant)}</span>
                </div>
                <div style={{ background: CREME, borderRadius: '4px', height: '8px', overflow: 'hidden' }}>
                  <div style={{ width: `${widthPct}%`, height: '100%', background: sourceColors[i], borderRadius: '4px' }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Top services */}
      <div style={{ background: CARD, border: `1px solid ${BORDER_OR}`, borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
        <p style={{ color: MUTED, fontSize: '11px', margin: '0 0 12px', textTransform: 'uppercase' }}>Top 5 services</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {MOCK_STATS_ADMIN.top_services.map((s, i) => {
            const widthPct = Math.round((s.count / maxService) * 100)
            return (
              <div key={s.service} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ width: '18px', height: '18px', borderRadius: '50%', background: OR + '22', color: OR, fontSize: '11px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i + 1}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                    <span style={{ fontSize: '12px', color: NOIR }}>{s.service}</span>
                    <span style={{ fontSize: '12px', color: OR, fontWeight: '600' }}>{s.count}</span>
                  </div>
                  <div style={{ background: CREME, borderRadius: '3px', height: '5px', overflow: 'hidden' }}>
                    <div style={{ width: `${widthPct}%`, height: '100%', background: OR + '88', borderRadius: '3px' }} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Performance partenaires */}
      <div>
        <h2 style={{ color: OR, fontSize: '16px', fontWeight: '600', margin: '0 0 12px' }}>Performance partenaires</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {sortedPartenaires.map((p, i) => (
            <div key={p.id} style={{ background: CARD, border: `1px solid ${BORDER_OR}`, borderRadius: '10px', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: i < 3 ? OR : MUTED, fontWeight: '700', fontSize: '14px', width: '20px', flexShrink: 0 }}>#{i + 1}</span>
              <div style={{ flex: 1 }}>
                <p style={{ margin: '0 0 2px', fontSize: '13px', fontWeight: '600', color: NOIR }}>{p.prenom} {p.nom}</p>
                <p style={{ margin: 0, fontSize: '11px', color: MUTED }}>⭐ {p.note} · {p.rdv_total} RDV total</p>
              </div>
              <p style={{ color: '#22c55e', fontWeight: '700', fontSize: '14px', margin: 0 }}>{formatMontant(p.revenus_mois)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
