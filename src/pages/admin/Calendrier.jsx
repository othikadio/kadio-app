import { useState } from 'react'
import {
  DndContext, DragOverlay, PointerSensor,
  useSensor, useSensors, useDroppable, useDraggable,
} from '@dnd-kit/core'
import { OR, CREME, NOIR, CARD, MUTED, BORDER_OR, formatMontant, statutColor } from '@/lib/utils'
import { useAllRdv, useAllEmployes, useAllServices } from '@/hooks'
import { MOCK_EMPLOYES_ADMIN } from '@/data/mockAdmin'
import { SERVICES_PUBLIC } from '@/data/mockPublic'

// ─── Constants ───────────────────────────────────────────────
const ROW_H   = 20
const START_H = 8
const END_H   = 22
const ROWS    = (END_H - START_H) * 4

const SALON_H = {
  0: { open: 10, close: 18 }, // dim
  1: { open: 10, close: 19 }, // lun
  2: null,                    // mar fermé
  3: { open: 10, close: 19 }, // mer
  4: { open: 10, close: 19 }, // jeu
  5: { open: 10, close: 21 }, // ven
  6: { open: 10, close: 21 }, // sam
}

const JOURS = [`Dim`, `Lun`, `Mar`, `Mer`, `Jeu`, `Ven`, `Sam`]

const COIFFEURS = [
  { id: `Diane Mbaye`,    prenom: `Diane`,   couleur: `#B8922A`, bg: `rgba(184,146,42,0.16)` },
  { id: `Steve Moreau`,   prenom: `Steve`,   couleur: `#F59E0B`, bg: `rgba(245,158,11,0.16)` },
  { id: `Marcus Durand`,  prenom: `Marcus`,  couleur: `#3B82F6`, bg: `rgba(59,130,246,0.16)` },
  { id: `Rachel Ndoye`,   prenom: `Rachel`,  couleur: `#EC4899`, bg: `rgba(236,72,153,0.16)` },
  { id: `Fatou Konaté`,   prenom: `Fatou`,   couleur: `#10B981`, bg: `rgba(16,185,129,0.16)` },
  { id: `Joël Tamba`,     prenom: `Joël`,    couleur: `#60a5fa`, bg: `rgba(96,165,250,0.16)` },
  { id: `Carine Lussier`, prenom: `Carine`,  couleur: `#8B5CF6`, bg: `rgba(139,92,246,0.16)` },
]

const STATUTS = {
  confirme: { label: `Confirmé`,  color: `#B8922A` },
  en_cours: { label: `En cours`,  color: `#60a5fa` },
  termine:  { label: `Terminé`,   color: `#34d399` },
  no_show:  { label: `No-show`,   color: `#f87171` },
  annule:   { label: `Annulé`,    color: `rgba(14,12,9,0.3)` },
}

// ─── Utils ───────────────────────────────────────────────────
const parseMin  = t => { const [h, m] = t.split(`:`).map(Number); return h * 60 + m }
const minToStr  = m => `${String(Math.floor(m / 60)).padStart(2, `0`)}:${String(m % 60).padStart(2, `0`)}`
const timeToY   = t => ((parseMin(t) - START_H * 60) / 15) * ROW_H
const durToH    = d => (d / 15) * ROW_H
const dateToStr = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, `0`)}-${String(d.getDate()).padStart(2, `0`)}`
const isToday   = d => { const t = new Date(); return d.getFullYear() === t.getFullYear() && d.getMonth() === t.getMonth() && d.getDate() === t.getDate() }

function getWeekDates(date) {
  const d = new Date(date)
  const day = d.getDay()
  const monday = new Date(d)
  monday.setDate(d.getDate() - (day === 0 ? 6 : day - 1))
  return Array.from({ length: 7 }, (_, i) => { const dd = new Date(monday); dd.setDate(monday.getDate() + i); return dd })
}

function fmtFull(d) { return d.toLocaleDateString(`fr-CA`, { weekday: `long`, day: `numeric`, month: `long`, year: `numeric` }) }

function getCoiffeur(name) { return COIFFEURS.find(c => c.id === name) || { couleur: OR, bg: `rgba(184,146,42,0.16)`, prenom: name } }

// ─── DroppableSlot ───────────────────────────────────────────
function DroppableSlot({ id, top, onClickSlot }) {
  const { setNodeRef, isOver } = useDroppable({ id })
  return (
    <div ref={setNodeRef} onClick={() => onClickSlot(id)} style={{
      position: `absolute`, top, left: 0, right: 0, height: ROW_H,
      background: isOver ? `rgba(184,146,42,0.13)` : `transparent`,
      cursor: `crosshair`, zIndex: 1,
    }} />
  )
}

// ─── DraggableRdvCard ────────────────────────────────────────
function DraggableRdvCard({ rdv, top, height, left = `2px`, width = `calc(100% - 4px)`, onClick }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: rdv.id })
  const c = getCoiffeur(rdv.coiffeur)
  const s = STATUTS[rdv.statut] || STATUTS.confirme
  const h = Math.max(height, ROW_H)
  return (
    <div ref={setNodeRef} {...listeners} {...attributes}
      onClick={e => { e.stopPropagation(); onClick(rdv) }}
      style={{
        position: `absolute`, top, left, width, height: h, boxSizing: `border-box`,
        background: c.bg, borderLeft: `3px solid ${c.couleur}`,
        border: `1px solid ${c.couleur}55`, borderRadius: `5px`,
        padding: `3px 6px`, cursor: `grab`, overflow: `hidden`,
        opacity: isDragging ? 0.3 : 1, zIndex: isDragging ? 200 : 10,
        transition: isDragging ? `none` : `opacity 0.1s`,
      }}>
      <p style={{ fontSize: `11px`, fontWeight: 700, color: c.couleur, margin: `0 0 1px`, lineHeight: 1.2, whiteSpace: `nowrap`, overflow: `hidden`, textOverflow: `ellipsis` }}>
        {rdv.client}
      </p>
      {h >= ROW_H * 2 && <p style={{ fontSize: `10px`, color: `rgba(14,12,9,0.55)`, margin: 0, lineHeight: 1.2, whiteSpace: `nowrap`, overflow: `hidden`, textOverflow: `ellipsis` }}>{rdv.service}</p>}
      {h >= ROW_H * 3 && <p style={{ fontSize: `10px`, color: s.color, margin: `1px 0 0`, lineHeight: 1.2 }}>{s.label}</p>}
    </div>
  )
}

// ─── HourLines ───────────────────────────────────────────────
function HourLines() {
  return <>
    {Array.from({ length: END_H - START_H + 1 }, (_, i) => (
      <div key={i} style={{ position: `absolute`, top: i * 4 * ROW_H, left: 0, right: 0, borderTop: `1px solid rgba(184,146,42,${i === 0 ? 0.15 : 0.07})`, zIndex: 0, pointerEvents: `none` }} />
    ))}
  </>
}

// ─── TimeLabels ──────────────────────────────────────────────
function TimeLabels() {
  return (
    <div style={{ position: `relative`, width: 48, flexShrink: 0, height: ROWS * ROW_H }}>
      {Array.from({ length: END_H - START_H }, (_, i) => (
        <div key={i} style={{ position: `absolute`, top: i * 4 * ROW_H - 6, right: 6, fontSize: `10px`, color: `rgba(14,12,9,0.28)`, lineHeight: 1 }}>
          {String(START_H + i).padStart(2, `0`)}h
        </div>
      ))}
    </div>
  )
}

// ─── DayColumn (WeekView) ─────────────────────────────────────
function DayColumn({ date, rdvs, onClickSlot, onClickRdv }) {
  const dateStr = dateToStr(date)
  const dow = date.getDay()
  const salon = SALON_H[dow]

  // Overlap layout
  const sorted = [...rdvs].sort((a, b) => parseMin(a.heure) - parseMin(b.heure))
  const placed = []
  for (const rdv of sorted) {
    const s = parseMin(rdv.heure), e = s + rdv.duree
    let col = 0
    while (placed.some(p => p.col === col && parseMin(p.rdv.heure) < e && parseMin(p.rdv.heure) + p.rdv.duree > s)) col++
    placed.push({ rdv, col })
  }
  const maxCols = Math.max(1, ...placed.map(p => p.col + 1))

  const slots = []
  if (salon) {
    for (let si = (salon.open - START_H) * 4; si < (salon.close - START_H) * 4; si++) {
      slots.push({ id: `${dateStr}|${minToStr(START_H * 60 + si * 15)}`, top: si * ROW_H })
    }
  }

  return (
    <div style={{ position: `relative`, flex: 1, height: ROWS * ROW_H, borderLeft: `1px solid rgba(184,146,42,0.08)`, boxSizing: `border-box`, minWidth: 0 }}>
      {salon ? (
        <>
          <div style={{ position: `absolute`, top: 0, left: 0, right: 0, height: (salon.open - START_H) * 4 * ROW_H, background: `rgba(0,0,0,0.22)`, pointerEvents: `none`, zIndex: 0 }} />
          <div style={{ position: `absolute`, top: (salon.close - START_H) * 4 * ROW_H, left: 0, right: 0, bottom: 0, background: `rgba(0,0,0,0.22)`, pointerEvents: `none`, zIndex: 0 }} />
        </>
      ) : (
        <div style={{ position: `absolute`, inset: 0, background: `repeating-linear-gradient(45deg, rgba(239,68,68,0.03) 0, rgba(239,68,68,0.03) 4px, transparent 4px, transparent 10px)`, pointerEvents: `none`, zIndex: 0 }} />
      )}
      <HourLines />
      {slots.map(sl => <DroppableSlot key={sl.id} id={sl.id} top={sl.top} onClickSlot={onClickSlot} />)}
      {placed.map(({ rdv, col }) => (
        <DraggableRdvCard key={rdv.id} rdv={rdv}
          top={timeToY(rdv.heure)} height={durToH(rdv.duree)}
          left={`${col * (100 / maxCols)}%`}
          width={`calc(${100 / maxCols}% - 3px)`}
          onClick={onClickRdv}
        />
      ))}
    </div>
  )
}

// ─── Week View ───────────────────────────────────────────────
function WeekView({ rdvs, currentDate, onClickSlot, onClickRdv, filter }) {
  const week = getWeekDates(currentDate)
  const filtered = filter.length ? rdvs.filter(r => filter.includes(r.coiffeur)) : rdvs
  return (
    <div style={{ display: `flex`, flexDirection: `column`, flex: 1, overflow: `hidden` }}>
      <div style={{ display: `flex`, flexShrink: 0, borderBottom: `1px solid rgba(184,146,42,0.12)` }}>
        <div style={{ width: 48, flexShrink: 0 }} />
        {week.map(d => {
          const closed = SALON_H[d.getDay()] === null
          const today  = isToday(d)
          return (
            <div key={dateToStr(d)} style={{ flex: 1, textAlign: `center`, padding: `8px 4px`, borderLeft: `1px solid rgba(184,146,42,0.08)`, minWidth: 0 }}>
              <p style={{ fontSize: `10px`, color: closed ? `rgba(239,68,68,0.45)` : `rgba(14,12,9,0.35)`, margin: `0 0 3px`, textTransform: `uppercase`, letterSpacing: `0.08em` }}>
                {JOURS[d.getDay()]}
              </p>
              <div style={{ display: `inline-flex`, width: 26, height: 26, borderRadius: `50%`, alignItems: `center`, justifyContent: `center`, background: today ? OR : `transparent` }}>
                <span style={{ fontSize: `13px`, fontWeight: today ? 700 : 400, color: today ? NOIR : closed ? `rgba(239,68,68,0.35)` : `rgba(14,12,9,0.75)` }}>
                  {d.getDate()}
                </span>
              </div>
              {closed && <p style={{ fontSize: `8px`, color: `rgba(239,68,68,0.4)`, margin: `1px 0 0` }}>FERMÉ</p>}
            </div>
          )
        })}
      </div>
      <div style={{ display: `flex`, flex: 1, overflowY: `auto` }}>
        <TimeLabels />
        {week.map(d => (
          <DayColumn key={dateToStr(d)} date={d}
            rdvs={filtered.filter(r => r.date === dateToStr(d))}
            onClickSlot={onClickSlot} onClickRdv={onClickRdv}
          />
        ))}
      </div>
    </div>
  )
}

// ─── Day View ────────────────────────────────────────────────
function DayView({ rdvs, currentDate, onClickSlot, onClickRdv, filter }) {
  const dateStr = dateToStr(currentDate)
  const dow = currentDate.getDay()
  const salon = SALON_H[dow]
  const cols = filter.length ? COIFFEURS.filter(c => filter.includes(c.id)) : COIFFEURS
  const filtered = filter.length ? rdvs.filter(r => filter.includes(r.coiffeur)) : rdvs

  return (
    <div style={{ display: `flex`, flexDirection: `column`, flex: 1, overflow: `hidden` }}>
      <div style={{ padding: `8px 12px`, borderBottom: `1px solid rgba(184,146,42,0.12)`, display: `flex`, gap: `12px`, alignItems: `center`, flexShrink: 0 }}>
        <span style={{ fontSize: `15px`, color: NOIR }}>{fmtFull(currentDate)}</span>
        <span style={{ fontSize: `12px`, color: salon ? `rgba(184,146,42,0.6)` : `rgba(239,68,68,0.6)` }}>
          {salon ? `${salon.open}h \u2013 ${salon.close}h` : `Fermé`}
        </span>
      </div>
      <div style={{ display: `flex`, flexShrink: 0, borderBottom: `1px solid rgba(184,146,42,0.08)` }}>
        <div style={{ width: 48, flexShrink: 0 }} />
        {cols.map(c => (
          <div key={c.id} style={{ flex: 1, textAlign: `center`, padding: `8px 4px`, borderLeft: `1px solid rgba(184,146,42,0.08)` }}>
            <span style={{ fontSize: `13px`, fontWeight: 700, color: c.couleur }}>{c.prenom}</span>
          </div>
        ))}
      </div>
      <div style={{ display: `flex`, flex: 1, overflowY: `auto` }}>
        <TimeLabels />
        {cols.map(c => {
          const colRdvs = filtered.filter(r => r.date === dateStr && r.coiffeur === c.id)
          const slots = salon
            ? Array.from({ length: (salon.close - salon.open) * 4 }, (_, i) => {
                const minVal = salon.open * 60 + i * 15
                return { id: `${dateStr}|${minToStr(minVal)}|${c.id}`, top: ((minVal - START_H * 60) / 15) * ROW_H }
              })
            : []
          return (
            <div key={c.id} style={{ position: `relative`, flex: 1, height: ROWS * ROW_H, borderLeft: `1px solid rgba(184,146,42,0.08)` }}>
              {salon && <>
                <div style={{ position: `absolute`, top: 0, left: 0, right: 0, height: (salon.open - START_H) * 4 * ROW_H, background: `rgba(0,0,0,0.22)`, pointerEvents: `none` }} />
                <div style={{ position: `absolute`, top: (salon.close - START_H) * 4 * ROW_H, left: 0, right: 0, bottom: 0, background: `rgba(0,0,0,0.22)`, pointerEvents: `none` }} />
              </>}
              <HourLines />
              {slots.map(sl => <DroppableSlot key={sl.id} id={sl.id} top={sl.top} onClickSlot={onClickSlot} />)}
              {colRdvs.map(rdv => (
                <DraggableRdvCard key={rdv.id} rdv={rdv}
                  top={timeToY(rdv.heure)} height={durToH(rdv.duree)}
                  onClick={onClickRdv}
                />
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Month View ──────────────────────────────────────────────
function MonthView({ rdvs, currentDate, onClickRdv, onSelectDay, filter }) {
  const y = currentDate.getFullYear(), m = currentDate.getMonth()
  const first = new Date(y, m, 1), last = new Date(y, m + 1, 0)
  const pad = (first.getDay() + 6) % 7
  const cells = Math.ceil((pad + last.getDate()) / 7) * 7
  const filtered = filter.length ? rdvs.filter(r => filter.includes(r.coiffeur)) : rdvs

  return (
    <div style={{ flex: 1, overflowY: `auto`, padding: `12px` }}>
      <div style={{ display: `grid`, gridTemplateColumns: `repeat(7, 1fr)`, gap: `3px`, marginBottom: `6px` }}>
        {[`Lun`, `Mar`, `Mer`, `Jeu`, `Ven`, `Sam`, `Dim`].map(j => (
          <div key={j} style={{ textAlign: `center`, fontSize: `10px`, color: j === `Mar` ? `rgba(239,68,68,0.4)` : `rgba(14,12,9,0.28)`, textTransform: `uppercase`, padding: `4px 0` }}>{j}</div>
        ))}
      </div>
      <div style={{ display: `grid`, gridTemplateColumns: `repeat(7, 1fr)`, gap: `3px` }}>
        {Array.from({ length: cells }, (_, idx) => {
          const dayNum = idx - pad + 1
          if (dayNum < 1 || dayNum > last.getDate()) return <div key={idx} />
          const d = new Date(y, m, dayNum)
          const ds = dateToStr(d)
          const dayRdvs = filtered.filter(r => r.date === ds)
          const today = isToday(d)
          const closed = SALON_H[d.getDay()] === null
          return (
            <div key={idx} onClick={() => !closed && onSelectDay(d)}
              style={{ minHeight: 72, padding: `5px`, borderRadius: `7px`, cursor: closed ? `not-allowed` : `pointer`, border: `1px solid`, borderColor: today ? `rgba(184,146,42,0.5)` : `rgba(184,146,42,0.08)`, background: today ? `rgba(184,146,42,0.06)` : `rgba(14,12,9,0.01)` }}>
              <p style={{ fontSize: `12px`, fontWeight: today ? 700 : 400, color: today ? OR : closed ? `rgba(239,68,68,0.3)` : `rgba(14,12,9,0.55)`, margin: `0 0 3px`, textDecoration: closed ? `line-through` : `none` }}>
                {dayNum}
              </p>
              {dayRdvs.slice(0, 3).map(r => {
                const c = getCoiffeur(r.coiffeur)
                return (
                  <div key={r.id} onClick={e => { e.stopPropagation(); onClickRdv(r) }}
                    style={{ padding: `2px 4px`, borderRadius: `3px`, marginBottom: `2px`, background: c.bg, borderLeft: `2px solid ${c.couleur}` }}>
                    <p style={{ fontSize: `9px`, color: `rgba(14,12,9,0.8)`, margin: 0, whiteSpace: `nowrap`, overflow: `hidden`, textOverflow: `ellipsis` }}>
                      {r.heure} {r.client}
                    </p>
                  </div>
                )
              })}
              {dayRdvs.length > 3 && <p style={{ fontSize: `9px`, color: `rgba(184,146,42,0.5)`, margin: `1px 0 0` }}>+{dayRdvs.length - 3}</p>}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Stats Strip ─────────────────────────────────────────────
function StatsStrip({ rdvs, date }) {
  const ds = dateToStr(date)
  const today = rdvs.filter(r => r.date === ds)
  const rev = today.reduce((s, r) => s + r.montant, 0)
  const sh = SALON_H[date.getDay()]
  const totalMin = sh ? (sh.close - sh.open) * 60 * COIFFEURS.length : 0
  const bookedMin = today.reduce((s, r) => s + r.duree, 0)
  const taux = totalMin ? Math.round((bookedMin / totalMin) * 100) : 0

  return (
    <div style={{ display: `flex`, gap: `1px`, marginBottom: `10px`, borderRadius: `10px`, overflow: `hidden`, border: `1px solid rgba(184,146,42,0.12)` }}>
      {[
        { lbl: `RDV aujourd'hui`, val: today.length },
        { lbl: `Revenus estimés`, val: `${rev} $` },
        { lbl: `Occupation`,      val: `${taux} %` },
        { lbl: `Confirmés`,       val: today.filter(r => r.statut === `confirme`).length },
      ].map(({ lbl, val }) => (
        <div key={lbl} style={{ flex: 1, padding: `8px 10px`, background: CARD, textAlign: `center` }}>
          <p style={{ fontSize: `20px`, color: OR, margin: `0 0 1px`, fontWeight: 700 }}>{val}</p>
          <p style={{ fontSize: `9px`, color: MUTED, margin: 0, textTransform: `uppercase`, letterSpacing: `0.08em` }}>{lbl}</p>
        </div>
      ))}
    </div>
  )
}

// ─── Calendar Header ─────────────────────────────────────────
const NB = { padding: `5px 8px`, borderRadius: `6px`, border: `1px solid rgba(14,12,9,0.08)`, background: `transparent`, color: `rgba(14,12,9,0.55)`, cursor: `pointer`, fontSize: `15px`, lineHeight: 1 }

function CalHeader({ view, setView, currentDate, goToPrev, goToNext, goToToday, filter, toggleCoiffeur }) {
  const week = getWeekDates(currentDate)
  const ml = currentDate.toLocaleDateString(`fr-CA`, { month: `long`, year: `numeric` })
  const periodLabel = view === `day`
    ? fmtFull(currentDate)
    : view === `week`
    ? `${week[0].getDate()} \u2013 ${week[6].getDate()} ${ml}`
    : ml.charAt(0).toUpperCase() + ml.slice(1)

  return (
    <div style={{ display: `flex`, alignItems: `center`, gap: `8px`, marginBottom: `10px`, flexWrap: `wrap`, flexShrink: 0 }}>
      <div style={{ display: `flex`, gap: `4px` }}>
        <button onClick={goToPrev} style={NB}>{`\u2039`}</button>
        <button onClick={goToToday} style={{ ...NB, padding: `5px 10px`, fontSize: `11px` }}>{`Aujourd'hui`}</button>
        <button onClick={goToNext} style={NB}>{`\u203a`}</button>
      </div>
      <span style={{ fontSize: `14px`, color: `rgba(14,12,9,0.7)`, flex: 1, minWidth: `120px` }}>{periodLabel}</span>
      <div style={{ display: `flex`, gap: `5px`, flexWrap: `wrap` }}>
        {COIFFEURS.map(c => {
          const on = filter.includes(c.id)
          return (
            <button key={c.id} onClick={() => toggleCoiffeur(c.id)} style={{ padding: `4px 9px`, borderRadius: `999px`, fontSize: `11px`, cursor: `pointer`, border: `1px solid`, transition: `all 0.1s`, borderColor: on ? c.couleur : `rgba(255,255,255,0.1)`, background: on ? `${c.couleur}20` : `transparent`, color: on ? c.couleur : `rgba(14,12,9,0.35)`, fontWeight: on ? 700 : 400 }}>
              {c.prenom}
            </button>
          )
        })}
      </div>
      <div style={{ display: `flex`, border: `1px solid rgba(14,12,9,0.08)`, borderRadius: `7px`, overflow: `hidden` }}>
        {[`day`, `week`, `month`].map((v, i) => (
          <button key={v} onClick={() => setView(v)} style={{ padding: `5px 12px`, border: `none`, fontSize: `11px`, cursor: `pointer`, background: view === v ? OR : `transparent`, color: view === v ? NOIR : `rgba(14,12,9,0.45)`, fontWeight: view === v ? 700 : 400 }}>
            {[`Jour`, `Semaine`, `Mois`][i]}
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Create / Walk-in Modal ───────────────────────────────────
const LS = { display: `block`, fontSize: `10px`, textTransform: `uppercase`, letterSpacing: `0.1em`, color: MUTED, marginBottom: `4px` }
const LI = { width: `100%`, background: `rgba(14,12,9,0.04)`, border: `1px solid rgba(14,12,9,0.08)`, borderRadius: `6px`, padding: `9px 11px`, color: NOIR, fontSize: `13px`, outline: `none`, boxSizing: `border-box` }

function CreateModal({ slotId, onClose, onCreate }) {
  const parts = (slotId || ``).split(`|`)
  const defaultCoiffeur = parts[2] || MOCK_EMPLOYES_ADMIN.filter(e => e.statut === `actif`)[0]?.prenom + ` ` + MOCK_EMPLOYES_ADMIN.filter(e => e.statut === `actif`)[0]?.nom || COIFFEURS[0].id
  const defaultService = SERVICES_PUBLIC[0]
  const [form, setForm] = useState(() => ({
    client: ``, service: defaultService.nom, coiffeur: defaultCoiffeur,
    date: parts[0] || dateToStr(new Date()), heure: parts[1] || `10:00`,
    duree: 60, montant: defaultService.salon || 0, lieu: `salon`,
  }))
  const up = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const fin = minToStr(parseMin(form.heure) + form.duree)

  function pickService(nom) {
    const s = SERVICES_PUBLIC.find(x => x.nom === nom)
    setForm(f => ({ ...f, service: nom, montant: s?.salon || 0 }))
  }

  function submit() {
    if (!form.client.trim()) return
    onCreate({ ...form, id: `rdv${Date.now()}`, statut: `confirme` })
    onClose()
  }

  return (
    <div style={{ position: `fixed`, inset: 0, background: `rgba(0,0,0,0.72)`, zIndex: 500, display: `flex`, alignItems: `center`, justifyContent: `center`, padding: `16px` }} onClick={onClose}>
      <div style={{ background: CARD, border: `1px solid rgba(184,146,42,0.22)`, borderRadius: `14px`, padding: `24px`, width: `100%`, maxWidth: `460px`, maxHeight: `90vh`, overflowY: `auto` }} onClick={e => e.stopPropagation()}>
        <div style={{ display: `flex`, justifyContent: `space-between`, alignItems: `center`, marginBottom: `18px` }}>
          <h2 style={{ fontSize: `17px`, color: NOIR, margin: 0, fontWeight: 700 }}>Nouveau rendez-vous</h2>
          <button onClick={onClose} style={{ background: `none`, border: `none`, color: MUTED, cursor: `pointer`, fontSize: `20px`, lineHeight: 1 }}>{`\u00d7`}</button>
        </div>
        <div style={{ display: `flex`, flexDirection: `column`, gap: `12px` }}>
          <div>
            <label style={LS}>Client *</label>
            <input value={form.client} onChange={e => up(`client`, e.target.value)} placeholder={`Nom du client`}
              style={{ ...LI, borderColor: !form.client ? `rgba(239,68,68,0.3)` : `rgba(14,12,9,0.08)` }} />
          </div>
          <div>
            <label style={LS}>Service</label>
            <select value={form.service} onChange={e => pickService(e.target.value)} style={LI}>
              {SERVICES_PUBLIC.map(s => <option key={s.nom} value={s.nom}>{s.nom} — {s.salon}$</option>)}
            </select>
          </div>
          <div>
            <label style={LS}>Coiffeur</label>
            <select value={form.coiffeur} onChange={e => up(`coiffeur`, e.target.value)} style={LI}>
              {COIFFEURS.map(c => <option key={c.id} value={c.id}>{c.prenom}</option>)}
            </select>
          </div>
          <div style={{ display: `grid`, gridTemplateColumns: `1fr 1fr`, gap: `10px` }}>
            <div><label style={LS}>Date</label><input type="date" value={form.date} onChange={e => up(`date`, e.target.value)} style={LI} /></div>
            <div><label style={LS}>Heure</label><input type="time" step="900" value={form.heure} onChange={e => up(`heure`, e.target.value)} style={LI} /></div>
          </div>
          <div>
            <label style={LS}>Lieu</label>
            <select value={form.lieu} onChange={e => up(`lieu`, e.target.value)} style={LI}>
              <option value="salon">Salon</option>
              <option value="domicile">Domicile</option>
            </select>
          </div>
          <div style={{ padding: `9px 12px`, background: `rgba(184,146,42,0.06)`, borderRadius: `7px`, display: `flex`, justifyContent: `space-between` }}>
            <span style={{ fontSize: `12px`, color: MUTED }}>Heure de fin</span>
            <span style={{ fontSize: `13px`, fontWeight: 700, color: OR }}>{fin}</span>
          </div>
          <div style={{ display: `flex`, gap: `8px`, paddingTop: `4px` }}>
            <button onClick={onClose} style={{ flex: 1, padding: `11px`, borderRadius: `7px`, border: `1px solid rgba(14,12,9,0.08)`, background: `transparent`, color: MUTED, cursor: `pointer`, fontSize: `13px` }}>Annuler</button>
            <button onClick={submit} disabled={!form.client.trim()} style={{ flex: 1, padding: `11px`, borderRadius: `7px`, border: `none`, background: form.client.trim() ? OR : `rgba(14,12,9,0.08)`, color: NOIR, cursor: form.client.trim() ? `pointer` : `not-allowed`, fontSize: `13px`, fontWeight: 700 }}>Créer le RDV</button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Detail Panel ────────────────────────────────────────────
function DetailPanel({ rdv, onClose, onStatut, onDelete }) {
  if (!rdv) return null
  const c = getCoiffeur(rdv.coiffeur)
  const s = STATUTS[rdv.statut] || STATUTS.confirme
  const fin = minToStr(parseMin(rdv.heure) + rdv.duree)

  return (
    <div style={{ width: 260, flexShrink: 0, background: CARD, borderLeft: `1px solid rgba(184,146,42,0.12)`, display: `flex`, flexDirection: `column`, overflowY: `auto` }}>
      <div style={{ padding: `14px 16px`, borderBottom: `1px solid rgba(14,12,9,0.08)`, display: `flex`, justifyContent: `space-between`, alignItems: `center` }}>
        <span style={{ fontSize: `12px`, fontWeight: 700, color: c.couleur }}>{c.prenom}</span>
        <button onClick={onClose} style={{ background: `none`, border: `none`, color: MUTED, cursor: `pointer`, fontSize: `18px`, lineHeight: 1 }}>{`\u00d7`}</button>
      </div>
      <div style={{ padding: `14px 16px`, display: `flex`, flexDirection: `column`, gap: `10px` }}>
        <div>
          <p style={{ fontSize: `16px`, color: NOIR, fontWeight: 600, margin: `0 0 2px` }}>{rdv.client}</p>
          <p style={{ fontSize: `12px`, color: MUTED, margin: 0 }}>{rdv.service}</p>
        </div>
        {[
          [`Date`,   rdv.date],
          [`Heure`,  `${rdv.heure} \u2192 ${fin}`],
          [`Durée`,  `${rdv.duree} min`],
          [`Lieu`,   rdv.lieu === `domicile` ? `Domicile` : `Salon`],
          [`Montant`, formatMontant(rdv.montant)],
        ].map(([lbl, val]) => (
          <div key={lbl} style={{ display: `flex`, justifyContent: `space-between`, padding: `5px 0`, borderBottom: `1px solid rgba(184,146,42,0.07)` }}>
            <span style={{ fontSize: `11px`, color: MUTED }}>{lbl}</span>
            <span style={{ fontSize: `11px`, color: `rgba(14,12,9,0.75)` }}>{val}</span>
          </div>
        ))}
        <div style={{ padding: `7px 10px`, borderRadius: `7px`, background: `rgba(255,255,255,0.04)`, display: `flex`, justifyContent: `space-between` }}>
          <span style={{ fontSize: `11px`, color: MUTED }}>Statut</span>
          <span style={{ fontSize: `11px`, fontWeight: 700, color: s.color }}>{s.label}</span>
        </div>
        <div>
          <p style={{ fontSize: `10px`, textTransform: `uppercase`, letterSpacing: `0.1em`, color: MUTED, margin: `0 0 7px` }}>Changer le statut</p>
          <div style={{ display: `grid`, gridTemplateColumns: `1fr 1fr`, gap: `5px` }}>
            {Object.entries(STATUTS).map(([k, { label, color }]) => (
              <button key={k} onClick={() => onStatut(rdv.id, k)} style={{ padding: `7px 5px`, borderRadius: `5px`, border: `1px solid`, fontSize: `10px`, cursor: `pointer`, borderColor: rdv.statut === k ? color : `rgba(255,255,255,0.08)`, background: rdv.statut === k ? `${color}1a` : `transparent`, color: rdv.statut === k ? color : `rgba(14,12,9,0.45)`, fontWeight: rdv.statut === k ? 700 : 400 }}>
                {label}
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={() => { if (window.confirm(`Supprimer ce RDV ?`)) { onDelete(rdv.id); onClose() } }}
          style={{ padding: `9px`, borderRadius: `7px`, border: `1px solid rgba(239,68,68,0.2)`, background: `transparent`, color: `rgba(239,68,68,0.55)`, cursor: `pointer`, fontSize: `12px`, marginTop: `4px` }}>
          Supprimer ce RDV
        </button>
      </div>
    </div>
  )
}

// ─── Main ────────────────────────────────────────────────────

export default function AdminCalendrier() {
  const { data: rdvReseau = [] } = useAllRdv()
  const initRdv = rdvReseau.map(r => ({ ...r, duree: r.duree || 60 }))
  const [rdvs, setRdvs] = useState(initRdv)
  const [view, setView] = useState(`week`)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedCoiffeurs, setSelectedCoiffeurs] = useState([])
  const [selRdv, setSelRdv] = useState(null)
  const [createSlot, setCreateSlot] = useState(null)
  const [activeId, setActiveId] = useState(null)
  const [toast, setToast] = useState(``)

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))
  const activeRdv = rdvs.find(r => r.id === activeId)

  const showToast = msg => { setToast(msg); setTimeout(() => setToast(``), 2500) }

  function toggleCoiffeur(id) {
    setSelectedCoiffeurs(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  function goToPrev() {
    const d = new Date(currentDate)
    if (view === `day`)   d.setDate(d.getDate() - 1)
    if (view === `week`)  d.setDate(d.getDate() - 7)
    if (view === `month`) d.setMonth(d.getMonth() - 1)
    setCurrentDate(d)
  }
  function goToNext() {
    const d = new Date(currentDate)
    if (view === `day`)   d.setDate(d.getDate() + 1)
    if (view === `week`)  d.setDate(d.getDate() + 7)
    if (view === `month`) d.setMonth(d.getMonth() + 1)
    setCurrentDate(d)
  }
  function goToToday() { setCurrentDate(new Date()) }

  function onDragEnd({ active, over }) {
    setActiveId(null)
    if (!over) return
    const parts = over.id.split(`|`)
    if (parts.length < 2) return
    setRdvs(prev => prev.map(r => r.id === active.id
      ? { ...r, date: parts[0], heure: parts[1], ...(parts[2] ? { coiffeur: parts[2] } : {}) }
      : r
    ))
    showToast(`RDV déplacé`)
  }

  function onClickSlot(slotId) { setCreateSlot(slotId); setSelRdv(null) }
  function onClickRdv(rdv)     { setSelRdv(rdv); setCreateSlot(null) }

  function onCreate(rdv) {
    setRdvs(prev => [...prev, rdv])
    showToast(`RDV créé : ${rdv.client}`)
  }

  return (
    <div style={{ display: `flex`, flexDirection: `column`, height: `calc(100vh - 112px)`, background: CREME, color: NOIR, overflow: `hidden` }}>
      {toast && (
        <div style={{ position: `fixed`, top: `20px`, right: `20px`, background: `#22c55e`, color: `#fff`, padding: `10px 18px`, borderRadius: `8px`, zIndex: 999, fontSize: `14px` }}>{toast}</div>
      )}

      <div style={{ padding: `12px 14px 0`, flexShrink: 0 }}>
        <StatsStrip rdvs={rdvs} date={currentDate} />
        <CalHeader
          view={view} setView={setView}
          currentDate={currentDate}
          goToPrev={goToPrev} goToNext={goToNext} goToToday={goToToday}
          filter={selectedCoiffeurs} toggleCoiffeur={toggleCoiffeur}
        />
      </div>

      <DndContext sensors={sensors} onDragStart={e => setActiveId(e.active.id)} onDragEnd={onDragEnd}>
        <div style={{ display: `flex`, flex: 1, overflow: `hidden` }}>
          <div style={{ flex: 1, display: `flex`, flexDirection: `column`, overflow: `hidden` }}>
            {view === `week`  && <WeekView  rdvs={rdvs} currentDate={currentDate} onClickSlot={onClickSlot} onClickRdv={onClickRdv} filter={selectedCoiffeurs} />}
            {view === `day`   && <DayView   rdvs={rdvs} currentDate={currentDate} onClickSlot={onClickSlot} onClickRdv={onClickRdv} filter={selectedCoiffeurs} />}
            {view === `month` && <MonthView rdvs={rdvs} currentDate={currentDate} onClickRdv={onClickRdv} onSelectDay={d => { setCurrentDate(d); setView(`day`) }} filter={selectedCoiffeurs} />}
          </div>
          {selRdv && (
            <DetailPanel rdv={selRdv} onClose={() => setSelRdv(null)}
              onStatut={(id, st) => {
                setRdvs(p => p.map(r => r.id === id ? { ...r, statut: st } : r))
                setSelRdv(p => p && p.id === id ? { ...p, statut: st } : p)
              }}
              onDelete={id => setRdvs(p => p.filter(r => r.id !== id))}
            />
          )}
        </div>

        <DragOverlay>
          {activeRdv ? (
            <div style={{ padding: `6px 10px`, borderRadius: `6px`, background: getCoiffeur(activeRdv.coiffeur).bg, border: `1px solid rgba(184,146,42,0.4)`, boxShadow: `0 6px 24px rgba(0,0,0,0.5)`, minWidth: 120 }}>
              <p style={{ fontSize: `11px`, fontWeight: 700, color: OR, margin: `0 0 2px` }}>{activeRdv.client}</p>
              <p style={{ fontSize: `10px`, color: `rgba(14,12,9,0.6)`, margin: 0 }}>{activeRdv.service}</p>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {createSlot && <CreateModal slotId={createSlot} onClose={() => setCreateSlot(null)} onCreate={onCreate} />}
    </div>
  )
}
