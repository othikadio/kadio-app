import { OR, CREME, NOIR, CARD } from '@/lib/utils'
import { MOCK_FIDELITE_AMINATA } from '@/data/mockClient'
import { FIDELITE_RULES } from '@/utils/fidelite'

const MUTED = 'rgba(14,12,9,0.5)'

function CircularProgress({ points, objectif }) {
  const pct = Math.min(points / objectif, 1)
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - pct)

  return (
    <div style={{ position: 'relative', width: 140, height: 140, margin: '0 auto' }}>
      <svg width="140" height="140" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="70" cy="70" r={radius} fill="none" stroke="rgba(184,146,42,0.12)" strokeWidth="10" />
        <circle
          cx="70" cy="70" r={radius} fill="none"
          stroke={OR} strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{ fontSize: 26, fontWeight: 700, color: OR }}>{points}</div>
        <div style={{ fontSize: 11, color: MUTED }}>pts</div>
      </div>
    </div>
  )
}

export default function ClientFidelite() {
  const f = MOCK_FIDELITE_AMINATA
  const { seuil_recompense, valeur_recompense } = FIDELITE_RULES
  const manquants = seuil_recompense - (f.points_total % seuil_recompense)
  const paliers_atteints = Math.floor(f.points_total / seuil_recompense)

  return (
    <div style={{ fontFamily: `'DM Sans', sans-serif`, color: NOIR, padding: '24px 16px', paddingBottom: 100 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Fidélité</h1>
      <p style={{ color: MUTED, fontSize: 13, margin: '0 0 28px' }}>Chaque dollar dépensé = 1 point</p>

      {/* Cercle de progression */}
      <div style={{ background: CARD, borderRadius: 16, padding: '28px 20px', marginBottom: 16, border: `1px solid rgba(14,12,9,0.08)`, textAlign: 'center' }}>
        <CircularProgress points={f.points_total} objectif={seuil_recompense} />
        <div style={{ marginTop: 20 }}>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>
            {manquants} pts pour un crédit de {valeur_recompense} $
          </div>
          <div style={{ fontSize: 13, color: MUTED }}>
            {f.points_total} / {seuil_recompense} pts · Palier {paliers_atteints} atteint{paliers_atteints !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Barre linéaire */}
        <div style={{ marginTop: 16, background: 'rgba(14,12,9,0.08)', borderRadius: 999, height: 8, overflow: 'hidden' }}>
          <div style={{
            width: `${(f.points_total % seuil_recompense) / seuil_recompense * 100}%`,
            height: '100%', background: OR, borderRadius: 999, transition: 'width 0.5s',
          }} />
        </div>
      </div>

      {/* Crédits disponibles */}
      {f.credits_disponibles > 0 && (
        <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 12, padding: '14px 16px', marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#22c55e' }}>🎁 Crédit disponible</div>
            <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>Utilisable à votre prochain RDV</div>
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#22c55e' }}>{f.credits_disponibles * valeur_recompense} $</div>
        </div>
      )}

      {/* Comment ça marche */}
      <div style={{ background: 'rgba(184,146,42,0.06)', border: `1px solid rgba(14,12,9,0.08)`, borderRadius: 12, padding: '14px 16px', marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: OR, marginBottom: 10 }}>Comment ça marche</div>
        {[
          ['1 $ dépensé', '= 1 point fidélité'],
          [`${seuil_recompense} points`, `= crédit de ${valeur_recompense} $ offert`],
          ['Crédit automatique', 'appliqué à votre prochain RDV'],
        ].map(([a, b]) => (
          <div key={a} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
            <span style={{ color: MUTED }}>{a}</span>
            <span style={{ color: NOIR, fontWeight: 600 }}>{b}</span>
          </div>
        ))}
      </div>

      {/* Historique */}
      <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Historique des points</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {f.historique_points.map(entry => (
          <div key={entry.id} style={{ background: CARD, borderRadius: 10, padding: '12px 14px', border: `1px solid rgba(14,12,9,0.08)`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{entry.service}</div>
              <div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>{entry.date}</div>
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: entry.type === 'gain' ? '#22c55e' : '#ef4444' }}>
              {entry.type === 'gain' ? '+' : '-'}{entry.points} pts
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
