import { useState } from 'react'
import { OR, CREME, NOIR, CARD, formatDate } from '@/lib/utils'

const TYPE_OPTIONS = [
  { value: 'vacances', label: 'Vacances' },
  { value: 'maladie', label: 'Maladie' },
  { value: 'formation', label: 'Formation' },
  { value: 'famille', label: 'Événement familial' },
  { value: 'autre', label: 'Autre' },
]

const MOCK_HISTORIQUE = [
  { id: 'h1', type: 'Vacances', du: '2025-12-22', au: '2026-01-05', duree: 14, statut: 'termine' },
  { id: 'h2', type: 'Formation', du: '2026-02-10', au: '2026-02-12', duree: 3, statut: 'termine' },
]

function calcDuree(debut, fin) {
  if (!debut || !fin) return 0
  const d1 = new Date(debut)
  const d2 = new Date(fin)
  const diff = Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24))
  return diff > 0 ? diff : 0
}

export default function PartenaireVacances() {
  const [actif, setActif] = useState(false)
  const [typeConge, setTypeConge] = useState('vacances')
  const [dateDebut, setDateDebut] = useState('')
  const [dateFin, setDateFin] = useState('')
  const [periodeActive, setPeriodeActive] = useState(null)

  const duree = calcDuree(dateDebut, dateFin)

  function activer() {
    if (!dateDebut || !dateFin || duree <= 0) return
    setPeriodeActive({ type: TYPE_OPTIONS.find(t => t.value === typeConge)?.label, dateDebut, dateFin, duree })
    setActif(true)
  }

  function desactiver() {
    setActif(false)
    setPeriodeActive(null)
    setDateDebut('')
    setDateFin('')
  }

  return (
    <div style={{ fontFamily: `'DM Sans', sans-serif`, color: NOIR, padding: '16px', paddingBottom: '100px' }}>
      <div style={{ fontSize: '20px', fontWeight: 700, marginBottom: '6px' }}>Mode vacances</div>
      <div style={{ fontSize: '13px', color: `rgba(14,12,9,0.5)`, marginBottom: '20px' }}>
        Désactivez temporairement votre profil des recherches.
      </div>

      {/* Toggle card */}
      <div style={{ background: CARD, borderRadius: '14px', padding: '20px', marginBottom: '20px', border: `1px solid ${actif ? 'rgba(245,158,11,0.4)' : 'rgba(14,12,9,0.08)'}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: actif ? '0' : '20px' }}>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 700 }}>Mode vacances</div>
            <div style={{ fontSize: '12px', color: `rgba(14,12,9,0.5)`, marginTop: '3px' }}>
              {actif ? 'Votre profil est masqué' : 'Votre profil est visible'}
            </div>
          </div>
          <button
            onClick={() => actif ? desactiver() : null}
            style={{
              width: '52px', height: '28px', borderRadius: '999px', position: 'relative',
              background: actif ? '#f59e0b' : 'rgba(107,114,128,0.4)',
              border: 'none', cursor: 'pointer', transition: 'background 0.2s',
            }}>
            <div style={{
              position: 'absolute', top: '3px',
              left: actif ? '26px' : '3px',
              width: '22px', height: '22px', borderRadius: '50%',
              background: '#fff', transition: 'left 0.2s',
            }} />
          </button>
        </div>

        {/* If active — info */}
        {actif && periodeActive && (
          <div style={{ marginTop: '16px' }}>
            <div style={{
              background: 'rgba(245,158,11,0.1)', borderRadius: '10px', padding: '12px',
              border: '1px solid rgba(245,158,11,0.3)', marginBottom: '14px',
            }}>
              <div style={{ color: '#f59e0b', fontWeight: 700, fontSize: '13px', marginBottom: '8px' }}>
                ⚠️ Mode vacances actif — Votre profil est masqué des recherches
              </div>
              <div style={{ fontSize: '12px', color: `rgba(14,12,9,0.7)` }}>
                <div>Type : <strong>{periodeActive.type}</strong></div>
                <div>Du {formatDate(periodeActive.dateDebut)} au {formatDate(periodeActive.dateFin)}</div>
                <div>Durée : {periodeActive.duree} jour(s)</div>
              </div>
            </div>
            <button onClick={desactiver}
              style={{
                width: '100%', background: 'transparent',
                border: '1px solid rgba(239,68,68,0.4)', borderRadius: '10px',
                padding: '11px', color: '#ef4444', fontSize: '14px', fontWeight: 700,
                cursor: 'pointer', fontFamily: `'DM Sans', sans-serif`,
              }}>
              Désactiver le mode vacances
            </button>
          </div>
        )}

        {/* If not active — form */}
        {!actif && (
          <>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '12px', color: `rgba(14,12,9,0.5)`, display: 'block', marginBottom: '6px' }}>
                Type de congé
              </label>
              <select
                value={typeConge}
                onChange={e => setTypeConge(e.target.value)}
                style={{
                  width: '100%', background: '#FAFAF8', border: `1px solid rgba(184,146,42,0.25)`,
                  borderRadius: '10px', padding: '10px 12px', color: NOIR,
                  fontFamily: `'DM Sans', sans-serif`, fontSize: '14px',
                }}>
                {TYPE_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '12px', color: `rgba(14,12,9,0.5)`, display: 'block', marginBottom: '6px' }}>
                  Date début
                </label>
                <input type="date" value={dateDebut} onChange={e => setDateDebut(e.target.value)}
                  style={{
                    width: '100%', background: '#FAFAF8', border: `1px solid rgba(184,146,42,0.25)`,
                    borderRadius: '10px', padding: '10px 12px', color: NOIR,
                    fontFamily: `'DM Sans', sans-serif`, fontSize: '14px', boxSizing: 'border-box',
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '12px', color: `rgba(14,12,9,0.5)`, display: 'block', marginBottom: '6px' }}>
                  Date fin
                </label>
                <input type="date" value={dateFin} onChange={e => setDateFin(e.target.value)}
                  style={{
                    width: '100%', background: '#FAFAF8', border: `1px solid rgba(184,146,42,0.25)`,
                    borderRadius: '10px', padding: '10px 12px', color: NOIR,
                    fontFamily: `'DM Sans', sans-serif`, fontSize: '14px', boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>
            {duree > 0 && (
              <div style={{ fontSize: '13px', color: `rgba(14,12,9,0.6)`, marginBottom: '14px' }}>
                Durée : <strong style={{ color: OR }}>{duree} jour(s)</strong>
              </div>
            )}
            <button
              onClick={activer}
              disabled={!dateDebut || !dateFin || duree <= 0}
              style={{
                width: '100%',
                background: dateDebut && dateFin && duree > 0 ? '#f59e0b' : 'rgba(245,158,11,0.2)',
                color: dateDebut && dateFin && duree > 0 ? '#0E0C09' : `rgba(250,248,248,0.3)`,
                border: 'none', borderRadius: '10px', padding: '13px',
                fontSize: '14px', fontWeight: 700,
                cursor: dateDebut && dateFin && duree > 0 ? 'pointer' : 'default',
                fontFamily: `'DM Sans', sans-serif`,
              }}>
              Activer le mode vacances
            </button>
          </>
        )}
      </div>

      {/* Historique */}
      <div>
        <div style={{ fontSize: '16px', fontWeight: 700, marginBottom: '14px', color: OR }}>Historique</div>
        {MOCK_HISTORIQUE.map(h => (
          <div key={h.id} style={{
            background: CARD, borderRadius: '12px', padding: '13px 14px', marginBottom: '8px',
            border: `1px solid rgba(14,12,9,0.08)`,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '14px' }}>{h.type}</div>
              <div style={{ fontSize: '12px', color: `rgba(14,12,9,0.5)`, marginTop: '2px' }}>
                {formatDate(h.du)} — {formatDate(h.au)}
              </div>
              <div style={{ fontSize: '12px', color: `rgba(14,12,9,0.4)`, marginTop: '2px' }}>
                {h.duree} jour(s)
              </div>
            </div>
            <span style={{
              fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '999px',
              background: 'rgba(34,197,94,0.12)', color: '#22c55e',
            }}>
              Terminé
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
