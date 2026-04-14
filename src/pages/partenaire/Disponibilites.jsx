import { useState } from 'react'
import { OR, CREME, NOIR, CARD } from '@/lib/utils'

const JOURS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
const CRENEAUX = [
  { key: 'matin', label: 'Matin', range: '8h–12h' },
  { key: 'aprem', label: 'Après-midi', range: '12h–17h' },
  { key: 'soir', label: 'Soir', range: '17h–21h' },
]

function buildInitialState() {
  const state = {}
  JOURS.forEach((j, i) => {
    state[i] = {}
    CRENEAUX.forEach(c => {
      state[i][c.key] = i < 5 // Lun-Ven actifs par défaut
    })
  })
  return state
}

export default function PartenaireDisponibilites() {
  const [slots, setSlots] = useState(buildInitialState)
  const [saved, setSaved] = useState(false)

  function toggleSlot(dayIdx, creneauKey) {
    setSlots(prev => ({
      ...prev,
      [dayIdx]: { ...prev[dayIdx], [creneauKey]: !prev[dayIdx][creneauKey] },
    }))
    setSaved(false)
  }

  function toggleDay(dayIdx) {
    const daySlots = slots[dayIdx]
    const allActive = CRENEAUX.every(c => daySlots[c.key])
    setSlots(prev => ({
      ...prev,
      [dayIdx]: Object.fromEntries(CRENEAUX.map(c => [c.key, !allActive])),
    }))
    setSaved(false)
  }

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div style={{ fontFamily: `'DM Sans', sans-serif`, color: NOIR, padding: '16px', paddingBottom: '100px' }}>
      <div style={{ fontSize: '20px', fontWeight: 700, marginBottom: '6px' }}>Mes disponibilités</div>
      <div style={{ fontSize: '13px', color: `rgba(14,12,9,0.5)`, marginBottom: '20px' }}>
        Activez les créneaux où vous êtes disponible chaque semaine.
      </div>

      {/* Weekly grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px', marginBottom: '20px' }}>
        {JOURS.map((jour, i) => {
          const allActive = CRENEAUX.every(c => slots[i][c.key])
          return (
            <div key={i}>
              {/* Day header */}
              <button
                onClick={() => toggleDay(i)}
                style={{
                  width: '100%', background: allActive ? OR : `rgba(184,146,42,0.12)`,
                  color: allActive ? '#0E0C09' : `rgba(250,248,248,0.6)`,
                  border: 'none', borderRadius: '8px', padding: '6px 0',
                  fontSize: '11px', fontWeight: 700, cursor: 'pointer',
                  fontFamily: `'DM Sans', sans-serif`, marginBottom: '6px',
                }}>
                {jour}
              </button>
              {/* Creneaux */}
              {CRENEAUX.map(c => (
                <button key={c.key}
                  onClick={() => toggleSlot(i, c.key)}
                  title={`${jour} ${c.label} (${c.range})`}
                  style={{
                    width: '100%', background: slots[i][c.key] ? OR : `rgba(184,146,42,0.08)`,
                    border: `1px solid ${slots[i][c.key] ? OR : 'rgba(14,12,9,0.08)'}`,
                    borderRadius: '6px', padding: '5px 2px', marginBottom: '4px',
                    fontSize: '9px', fontWeight: 600, cursor: 'pointer',
                    color: slots[i][c.key] ? '#0E0C09' : `rgba(250,248,248,0.4)`,
                    fontFamily: `'DM Sans', sans-serif`, lineHeight: 1.2,
                  }}>
                  {c.label[0]}
                  <br />
                  <span style={{ fontSize: '8px', opacity: 0.7 }}>{c.range.split('–')[0]}</span>
                </button>
              ))}
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
        {CRENEAUX.map(c => (
          <div key={c.key} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: `rgba(14,12,9,0.6)` }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: OR }} />
            {c.label} ({c.range})
          </div>
        ))}
      </div>

      {/* Summary */}
      <div style={{ background: CARD, borderRadius: '12px', padding: '14px', marginBottom: '20px', border: `1px solid rgba(14,12,9,0.08)` }}>
        <div style={{ fontSize: '12px', color: `rgba(14,12,9,0.5)`, marginBottom: '8px' }}>Résumé</div>
        {JOURS.map((jour, i) => {
          const actifs = CRENEAUX.filter(c => slots[i][c.key])
          if (actifs.length === 0) return null
          return (
            <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px', fontSize: '12px' }}>
              <span style={{ width: '32px', fontWeight: 700 }}>{jour}</span>
              <span style={{ color: `rgba(14,12,9,0.6)` }}>
                {actifs.map(c => c.label).join(', ')}
              </span>
            </div>
          )
        })}
      </div>

      {/* Save button */}
      <button
        onClick={handleSave}
        style={{
          width: '100%', background: OR, color: '#0E0C09', border: 'none',
          borderRadius: '12px', padding: '14px', fontSize: '15px', fontWeight: 700,
          cursor: 'pointer', fontFamily: `'DM Sans', sans-serif`,
        }}>
        Enregistrer mes disponibilités
      </button>

      {saved && (
        <div style={{
          marginTop: '12px', textAlign: 'center', color: '#22c55e',
          fontWeight: 700, fontSize: '14px',
        }}>
          ✓ Disponibilités enregistrées
        </div>
      )}
    </div>
  )
}
