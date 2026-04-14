import { OR, CREME, NOIR, CARD, formatMontant } from '@/lib/utils'
import { MOCK_MARCUS_EMPLOYE } from '@/data/mockEmploye'
import { RECOMPENSES_MENSUELLES } from '@/utils/recompenses'

const MUTED = 'rgba(14,12,9,0.5)'

export default function EmployeRecompenses() {
  const r = MOCK_MARCUS_EMPLOYE.recompenses

  function progressPct(recomp) {
    const val = r[recomp.objectif_key] ?? 0
    if (recomp.id === 'fiabilite') {
      return val === 0 ? 100 : 0
    }
    return Math.min((val / recomp.objectif_cible) * 100, 100)
  }

  function isAtteint(recomp) {
    const val = r[recomp.objectif_key] ?? 0
    if (recomp.id === 'fiabilite') return val === 0
    return val >= recomp.objectif_cible
  }

  function valeurActuelle(recomp) {
    if (recomp.id === 'fiabilite') {
      return r.no_shows_mois === 0 ? '✓ Zéro no-show' : `${r.no_shows_mois} no-show(s)`
    }
    return r[recomp.objectif_key] ?? 0
  }

  return (
    <div style={{ fontFamily: `'DM Sans', sans-serif`, color: NOIR, padding: '24px 16px', paddingBottom: 100 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Récompenses</h1>
      <p style={{ color: MUTED, fontSize: 13, margin: '0 0 24px' }}>Objectifs ce mois · Mars 2026</p>

      {/* Total bonus ce mois */}
      <div style={{ background: CARD, border: `1px solid rgba(14,12,9,0.08)`, borderRadius: 14, padding: '20px', marginBottom: 20, textAlign: 'center' }}>
        <div style={{ fontSize: 11, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Bonus ce mois</div>
        <div style={{ fontSize: 36, fontWeight: 700, color: '#22c55e' }}>{formatMontant(r.bonus_ce_mois)}</div>
        <div style={{ fontSize: 12, color: MUTED, marginTop: 4 }}>
          {r.badges_obtenus.length} badge{r.badges_obtenus.length !== 1 ? 's' : ''} obtenu{r.badges_obtenus.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Objectifs */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
        {RECOMPENSES_MENSUELLES.map(recomp => {
          const atteint = isAtteint(recomp)
          const pct = progressPct(recomp)
          return (
            <div key={recomp.id} style={{ background: CARD, borderRadius: 12, padding: '14px 16px', border: `1px solid ${atteint ? recomp.couleur + '40' : 'rgba(14,12,9,0.08)'}` }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 20 }}>{recomp.icon}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: atteint ? recomp.couleur : CREME }}>{recomp.label}</div>
                    <div style={{ fontSize: 11, color: MUTED, marginTop: 1 }}>{recomp.desc}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 12 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#22c55e' }}>+{formatMontant(recomp.bonus)}</div>
                  {atteint && <div style={{ fontSize: 10, color: recomp.couleur, fontWeight: 700, marginTop: 2 }}>OBTENU ✓</div>}
                </div>
              </div>
              <div style={{ background: 'rgba(14,12,9,0.08)', borderRadius: 999, height: 6, overflow: 'hidden', marginBottom: 4 }}>
                <div style={{ width: `${pct}%`, height: '100%', background: atteint ? recomp.couleur : 'rgba(184,146,42,0.4)', borderRadius: 999, transition: 'width 0.4s' }} />
              </div>
              <div style={{ fontSize: 11, color: MUTED }}>
                {recomp.objectif_label} : {valeurActuelle(recomp)}
                {!atteint && recomp.id !== 'fiabilite' && (
                  <span style={{ color: OR }}> / {recomp.objectif_cible}</span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Historique badges */}
      <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Historique des badges</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {r.historique_badges.map((entry, i) => (
          <div key={i} style={{ background: CARD, borderRadius: 10, padding: '12px 14px', border: `1px solid rgba(14,12,9,0.08)`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{entry.mois}</div>
              <div style={{ display: 'flex', gap: 6, marginTop: 4, flexWrap: 'wrap' }}>
                {entry.badges.map(b => {
                  const def = RECOMPENSES_MENSUELLES.find(r => r.id === b)
                  return def ? (
                    <span key={b} style={{ fontSize: 11, background: def.couleur + '22', color: def.couleur, borderRadius: 20, padding: '2px 8px', fontWeight: 600 }}>
                      {def.icon} {def.label}
                    </span>
                  ) : null
                })}
              </div>
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#22c55e', flexShrink: 0, marginLeft: 12 }}>
              +{formatMontant(entry.bonus)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
