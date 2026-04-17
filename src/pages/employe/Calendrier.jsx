import { useState } from 'react'
import { useRdvEmploye } from '@/hooks'
import { useAuthStore } from '@/stores/authStore'
import { OR, CREME, NOIR, CARD, formatHeure } from '@/lib/utils'

// Base week: 2026-03-28 (samedi) = offset 0
function addDays(dateStr, days) {
  const d = new Date(dateStr + 'T00:00:00')
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

function getWeekDates(offset) {
  const base = '2026-03-28'
  const start = addDays(base, offset * 7)
  return Array.from({ length: 7 }, (_, i) => addDays(start, i))
}

const JOURS_COURTS = ['Sam', 'Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven']
const HOURS = Array.from({ length: 12 }, (_, i) => i + 8) // 8–19

function formatWeekLabel(dates) {
  const first = new Date(dates[0] + 'T00:00:00')
  const last  = new Date(dates[6] + 'T00:00:00')
  const M = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.']
  const d1 = first.getDate(), m1 = M[first.getMonth()]
  const d2 = last.getDate(),  m2 = M[last.getMonth()], y = last.getFullYear()
  if (first.getMonth() === last.getMonth()) return `${d1} – ${d2} ${m1} ${y}`
  return `${d1} ${m1} – ${d2} ${m2} ${y}`
}

function timeToMin(t) {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

const PX_PER_HOUR = 52
const TIME_W = 36
const COL_W  = 90

export default function EmployeCalendrier() {
  const { employe } = useAuthStore()
  const employeId = employe?.id || 'emp-marcus'
  const [weekOffset, setWeekOffset] = useState(0)
  const { data: rdvList = [], loading } = useRdvEmploye(employeId)
  const weekDates = getWeekDates(weekOffset)
  const weekLabel = formatWeekLabel(weekDates)
  const weekRdvs  = rdvList.filter(r => weekDates.includes(r.date_rdv))

  if (loading) {
    return <div className="p-8 text-center text-zinc-400">Chargement...</div>
  }

  return (
    <div style={{ fontFamily: `'DM Sans', sans-serif`, color: NOIR, paddingBottom: '100px' }}>

      {/* Nav */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 16px', borderBottom: `1px solid rgba(184,146,42,0.12)`,
        position: 'sticky', top: '56px', background: `rgba(14,12,9,0.97)`,
        zIndex: 10, backdropFilter: 'blur(8px)',
      }}>
        <button onClick={() => setWeekOffset(o => o - 1)} style={{
          background: 'none', border: `1px solid rgba(184,146,42,0.25)`, color: NOIR,
          borderRadius: '8px', padding: '6px 12px', cursor: 'pointer', fontSize: '12px',
          fontFamily: `'DM Sans', sans-serif`,
        }}>
          ‹ Préc.
        </button>
        <div style={{ fontSize: '13px', fontWeight: 700, color: OR }}>{weekLabel}</div>
        <button onClick={() => setWeekOffset(o => o + 1)} style={{
          background: 'none', border: `1px solid rgba(184,146,42,0.25)`, color: NOIR,
          borderRadius: '8px', padding: '6px 12px', cursor: 'pointer', fontSize: '12px',
          fontFamily: `'DM Sans', sans-serif`,
        }}>
          Suiv. ›
        </button>
      </div>

      {weekRdvs.length === 0 ? (
        <div style={{ padding: '40px 16px', textAlign: 'center', color: `rgba(14,12,9,0.4)` }}>
          Aucun RDV cette semaine
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <div style={{ minWidth: `${TIME_W + 7 * COL_W}px` }}>

            {/* Day headers */}
            <div style={{
              display: 'flex', borderBottom: `1px solid rgba(14,12,9,0.08)`,
              position: 'sticky', top: '101px', background: `rgba(14,12,9,0.97)`,
              zIndex: 9, backdropFilter: 'blur(8px)',
            }}>
              <div style={{ width: TIME_W, flexShrink: 0 }} />
              {weekDates.map((date, i) => {
                const d = new Date(date + 'T00:00:00')
                const isToday = date === '2026-03-28'
                return (
                  <div key={date} style={{
                    flex: `0 0 ${COL_W}px`, width: `${COL_W}px`, textAlign: 'center',
                    padding: '8px 4px', fontSize: '11px', fontWeight: 700,
                    color: isToday ? OR : `rgba(14,12,9,0.5)`,
                    borderLeft: `1px solid rgba(184,146,42,0.08)`,
                  }}>
                    <div>{JOURS_COURTS[i]}</div>
                    <div style={{
                      width: '22px', height: '22px', borderRadius: '50%',
                      background: isToday ? OR : 'transparent',
                      color: isToday ? NOIR : 'inherit',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      margin: '2px auto 0', fontSize: '12px',
                    }}>
                      {d.getDate()}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Grid */}
            <div style={{ position: 'relative' }}>
              {HOURS.map(h => (
                <div key={h} style={{
                  display: 'flex', height: `${PX_PER_HOUR}px`,
                  borderBottom: `1px solid rgba(184,146,42,0.06)`,
                }}>
                  <div style={{
                    width: TIME_W, flexShrink: 0, fontSize: '10px',
                    color: `rgba(14,12,9,0.3)`, paddingTop: '4px',
                    paddingRight: '6px', textAlign: 'right',
                  }}>
                    {h}h
                  </div>
                  {weekDates.map(date => (
                    <div key={date} style={{
                      flex: `0 0 ${COL_W}px`, width: `${COL_W}px`,
                      borderLeft: `1px solid rgba(184,146,42,0.08)`,
                    }} />
                  ))}
                </div>
              ))}

              {/* RDV blocks */}
              {weekRdvs.map(rdv => {
                const colIdx = weekDates.indexOf(rdv.date_rdv)
                if (colIdx === -1) return null
                const startMin = timeToMin(rdv.heure_debut)
                const endMin   = timeToMin(rdv.heure_fin)
                const top    = ((startMin - 8 * 60) / 60) * PX_PER_HOUR
                const height = Math.max(((endMin - startMin) / 60) * PX_PER_HOUR, 20)
                const left   = TIME_W + colIdx * COL_W + 2
                const inactive = rdv.statut === 'annule' || rdv.statut === 'no_show'
                return (
                  <div key={rdv.id} style={{
                    position: 'absolute', top: `${top}px`, left: `${left}px`,
                    width: `${COL_W - 4}px`, height: `${height}px`,
                    borderRadius: '6px',
                    background: inactive ? 'rgba(107,114,128,0.3)' : 'rgba(16,185,129,0.82)',
                    border: inactive ? '1px solid rgba(107,114,128,0.3)' : '1px solid rgba(16,185,129,0.4)',
                    padding: '3px 5px', overflow: 'hidden', boxSizing: 'border-box',
                  }}>
                    <div style={{
                      fontSize: '10px', fontWeight: 700,
                      color: inactive ? `rgba(14,12,9,0.5)` : NOIR,
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: 1.3,
                    }}>
                      {rdv.service.nom}
                    </div>
                    <div style={{
                      fontSize: '10px',
                      color: inactive ? `rgba(14,12,9,0.4)` : 'rgba(14,12,9,0.8)',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      display: 'flex', alignItems: 'center', gap: '3px',
                    }}>
                      {rdv.client.prenom}
                      {rdv.walk_in && (
                        <span style={{
                          fontSize: '8px', fontWeight: 700,
                          background: 'rgba(139,92,246,0.9)', color: '#fff',
                          padding: '1px 4px', borderRadius: '3px', flexShrink: 0,
                        }}>WI</span>
                      )}
                    </div>
                    {rdv.statut === 'no_show' && (
                      <div style={{ fontSize: '9px', color: '#ef4444', fontWeight: 700 }}>NO SHOW</div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
