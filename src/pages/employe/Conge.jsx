import { useState } from 'react'
import { MOCK_CONGES_MARCUS, SOLDE_CONGES_MARCUS } from '@/data/mockEmploye'
import { OR, CREME, NOIR, CARD, formatDate, statutColor } from '@/lib/utils'

const TYPES_CONGE = ['Vacances', 'Maladie', 'Personnel', 'Formation', 'Autre']

function calcDuree(debut, fin) {
  if (!debut || !fin) return 0
  const d1 = new Date(debut + 'T00:00:00')
  const d2 = new Date(fin + 'T00:00:00')
  const diff = (d2 - d1) / (1000 * 60 * 60 * 24) + 1
  return diff > 0 ? diff : 0
}

const inputStyle = {
  width: '100%',
  background: CARD,
  border: `1px solid rgba(184,146,42,0.25)`,
  borderRadius: '10px',
  padding: '12px 14px',
  color: NOIR,
  fontFamily: `'DM Sans', sans-serif`,
  fontSize: '14px',
  boxSizing: 'border-box',
  outline: 'none',
}

const labelStyle = {
  fontSize: '12px',
  color: `rgba(14,12,9,0.5)`,
  display: 'block',
  marginBottom: '6px',
  fontWeight: 600,
}

function statutLabel(s) {
  if (s === 'approuve') return `Approuvé`
  if (s === 'en_attente') return `En attente`
  if (s === 'refuse') return `Refusé`
  return s
}

export default function EmployeConge() {
  const [typeConge, setTypeConge] = useState(TYPES_CONGE[0])
  const [dateDebut, setDateDebut] = useState('')
  const [dateFin, setDateFin]   = useState('')
  const [motif, setMotif]       = useState('')
  const [sent, setSent]         = useState(false)
  const [conges, setConges]     = useState(MOCK_CONGES_MARCUS)

  const duree = calcDuree(dateDebut, dateFin)

  function handleSubmit() {
    if (!dateDebut || !dateFin || duree <= 0) return
    setSent(true)
    setTimeout(() => setSent(false), 4000)
    setTypeConge(TYPES_CONGE[0])
    setDateDebut('')
    setDateFin('')
    setMotif('')
  }

  function annulerConge(id) {
    if (window.confirm(`Annuler cette demande de congé ?`)) {
      setConges(prev => prev.filter(c => c.id !== id))
    }
  }

  return (
    <div style={{ fontFamily: `'DM Sans', sans-serif`, color: NOIR, padding: '16px', paddingBottom: '100px' }}>
      <div style={{ fontSize: '20px', fontWeight: 700, marginBottom: '20px' }}>
        Demandes de congé
      </div>

      {/* ── Section 1: Solde ── */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
        <div style={{
          flex: 1, background: 'rgba(34,197,94,0.1)', borderRadius: '12px', padding: '12px',
          border: `1px solid rgba(34,197,94,0.25)`, textAlign: 'center',
        }}>
          <div style={{ fontSize: '20px', fontWeight: 700, color: '#22c55e' }}>
            {SOLDE_CONGES_MARCUS.disponibles}
          </div>
          <div style={{ fontSize: '11px', color: `rgba(14,12,9,0.5)`, marginTop: '2px' }}>Disponibles</div>
        </div>
        <div style={{
          flex: 1, background: CARD, borderRadius: '12px', padding: '12px',
          border: `1px solid rgba(184,146,42,0.12)`, textAlign: 'center',
        }}>
          <div style={{ fontSize: '20px', fontWeight: 700, color: `rgba(14,12,9,0.6)` }}>
            {SOLDE_CONGES_MARCUS.pris}
          </div>
          <div style={{ fontSize: '11px', color: `rgba(14,12,9,0.4)`, marginTop: '2px' }}>Pris</div>
        </div>
        <div style={{
          flex: 1, background: 'rgba(245,158,11,0.1)', borderRadius: '12px', padding: '12px',
          border: `1px solid rgba(245,158,11,0.25)`, textAlign: 'center',
        }}>
          <div style={{ fontSize: '20px', fontWeight: 700, color: '#f59e0b' }}>
            {SOLDE_CONGES_MARCUS.en_attente}
          </div>
          <div style={{ fontSize: '11px', color: `rgba(14,12,9,0.5)`, marginTop: '2px' }}>{`En attente`}</div>
        </div>
      </div>

      {/* ── Section 2: Nouvelle demande ── */}
      <div style={{
        background: CARD, borderRadius: '16px', padding: '16px',
        border: `1px solid rgba(14,12,9,0.08)`, marginBottom: '24px',
      }}>
        <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '14px' }}>
          Nouvelle demande
        </div>

        {sent && (
          <div style={{
            background: 'rgba(34,197,94,0.12)', border: `1px solid rgba(34,197,94,0.3)`,
            borderRadius: '10px', padding: '12px', marginBottom: '14px',
            color: '#22c55e', fontWeight: 600, fontSize: '13px', textAlign: 'center',
          }}>
            ✓ Demande envoyée, en attente d&apos;approbation
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={labelStyle}>Type de congé</label>
            <select value={typeConge} onChange={e => setTypeConge(e.target.value)}
              style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}>
              {TYPES_CONGE.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={labelStyle}>Date début</label>
              <input type="date" value={dateDebut} onChange={e => setDateDebut(e.target.value)}
                style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Date fin</label>
              <input type="date" value={dateFin} onChange={e => setDateFin(e.target.value)}
                style={inputStyle} />
            </div>
          </div>

          {/* Durée calculée */}
          {dateDebut && dateFin && (
            <div style={{
              background: `rgba(184,146,42,0.07)`, borderRadius: '10px',
              padding: '10px 14px', fontSize: '13px', color: OR, fontWeight: 600,
            }}>
              Durée : {duree > 0 ? `${duree} jour${duree > 1 ? 's' : ''}` : `Dates invalides`}
            </div>
          )}

          <div>
            <label style={labelStyle}>Motif (optionnel — 200 car. max)</label>
            <textarea
              value={motif}
              onChange={e => setMotif(e.target.value.slice(0, 200))}
              rows={2}
              placeholder="Motif de votre demande…"
              style={{ ...inputStyle, resize: 'vertical' }}
            />
            <div style={{ fontSize: '11px', color: `rgba(14,12,9,0.3)`, textAlign: 'right', marginTop: '4px' }}>
              {motif.length}/200
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!dateDebut || !dateFin || duree <= 0}
            style={{
              background: dateDebut && dateFin && duree > 0 ? OR : 'rgba(14,12,9,0.08)',
              color: dateDebut && dateFin && duree > 0 ? NOIR : `rgba(14,12,9,0.3)`,
              border: 'none', borderRadius: '10px', padding: '13px',
              fontSize: '14px', fontWeight: 700,
              cursor: dateDebut && dateFin && duree > 0 ? 'pointer' : 'default',
              fontFamily: `'DM Sans', sans-serif`,
            }}
          >
            Soumettre la demande
          </button>
        </div>
      </div>

      {/* ── Section 3: Mes demandes ── */}
      <div>
        <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '12px' }}>Mes demandes</div>

        {conges.length === 0 ? (
          <div style={{
            background: CARD, borderRadius: '12px', padding: '24px',
            textAlign: 'center', color: `rgba(14,12,9,0.4)`,
            border: `1px solid rgba(14,12,9,0.08)`,
          }}>
            Aucune demande de congé
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {conges.map(c => (
              <div key={c.id} style={{
                background: CARD, borderRadius: '14px', padding: '14px',
                border: `1px solid rgba(184,146,42,0.12)`,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '2px' }}>{c.type}</div>
                    <div style={{ fontSize: '12px', color: `rgba(14,12,9,0.5)` }}>
                      {formatDate(c.date_debut)}
                      {c.date_debut !== c.date_fin && ` → ${formatDate(c.date_fin)}`}
                    </div>
                  </div>
                  <div style={{
                    fontSize: '11px', fontWeight: 700,
                    color: statutColor(c.statut),
                    background: `${statutColor(c.statut)}18`,
                    padding: '3px 10px', borderRadius: '999px',
                    flexShrink: 0, marginLeft: '8px',
                  }}>
                    {statutLabel(c.statut)}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    fontSize: '12px', color: `rgba(14,12,9,0.5)`,
                    background: 'rgba(14,12,9,0.06)', padding: '3px 10px', borderRadius: '999px',
                  }}>
                    {c.duree} jour{c.duree > 1 ? 's' : ''}
                  </div>
                  {c.motif && (
                    <div style={{ fontSize: '12px', color: `rgba(14,12,9,0.5)`, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {c.motif}
                    </div>
                  )}
                </div>

                {c.statut === 'en_attente' && (
                  <button
                    onClick={() => annulerConge(c.id)}
                    style={{
                      marginTop: '10px', background: 'rgba(239,68,68,0.1)',
                      color: '#ef4444', border: `1px solid rgba(239,68,68,0.25)`,
                      borderRadius: '8px', padding: '7px 14px', fontSize: '12px',
                      fontWeight: 600, cursor: 'pointer', fontFamily: `'DM Sans', sans-serif`,
                    }}
                  >
                    Annuler
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
