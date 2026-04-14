import { useState } from 'react'
import { OR, CREME, NOIR, CARD, MUTED, BORDER_OR } from '@/lib/utils'
import { useChaisesAdmin, useReservationsJour } from '@/hooks'
import { simulerSMS } from '@/utils/commandes'
import { getChaisesDisponibles, calculerTarif, estMardi } from '@/utils/chaises'

const MOCK_CHAISES_ADMIN = [
  { id: 'ch1', nom: 'Chaise 1', couleur: '#3B82F6', tarif_heure: 15, tarif_journee: 80 },
  { id: 'ch2', nom: 'Chaise 2', couleur: '#10B981', tarif_heure: 15, tarif_journee: 80 },
  { id: 'ch3', nom: 'Chaise VIP', couleur: '#8B5CF6', tarif_heure: 25, tarif_journee: 120 },
  { id: 'ch4', nom: 'Chaise 4', couleur: '#F59E0B', tarif_heure: 15, tarif_journee: 80 },
]

// Semaine courante : lun 24 → sam 29 mars 2026 (mardi fermé)
const SEMAINE = ['2026-03-24', '2026-03-25', '2026-03-26', '2026-03-27', '2026-03-28', '2026-03-29']
const JOURS   = ['Lun', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
const HEURES  = ['09', '10', '11', '12', '13', '14', '15', '16', '17', '18']

const PARTENAIRES_COULEUR = {
  'Diane Mbaye':      '#8B5CF6',
  'Rachel Ndoye':     '#10B981',
  'Fatou Konaté':     '#3B82F6',
  'Sandra Pierre':    '#F59E0B',
  'Aminata Coulibaly':'#EC4899',
}

const FORM_INIT = { chaise_id: 'ch1', partenaire: '', date: '2026-03-28', heure_debut: '09:00', heure_fin: '12:00', service: '' }

export default function AdminChaises() {
  const { data: chaisesData = [], loading: loadingChaises } = useChaisesAdmin()
  const { data: reservationsData = [] } = useReservationsJour(new Date().toISOString().slice(0,10))
  const [reservations, setReservations] = useState(reservationsData)
  const [jourActif, setJourActif]       = useState('2026-03-28')
  const [showForm, setShowForm]         = useState(false)
  const [form, setForm]                 = useState(FORM_INIT)
  const [formErr, setFormErr]           = useState('')
  const [toast, setToast]               = useState('')
  const [libererConfirm, setLibererConfirm] = useState(null)

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500) }

  const chaises = chaisesData.length > 0 ? chaisesData : MOCK_CHAISES_ADMIN

  const resDuJour = (chaiseId, date) =>
    reservations.filter(r => r.chaise_id === chaiseId && r.date === date && r.statut !== 'annule')

  const totalResDuJour = chaises.reduce((s, ch) => s + resDuJour(ch.id, jourActif).length, 0)

  // Vérifier si une heure est couverte par une réservation (pour le grid)
  const couvreHeure = (res, heure) => {
    const h = parseInt(heure)
    const deb = parseInt(res.heure_debut.split(':')[0])
    const fin  = parseInt(res.heure_fin.split(':')[0])
    return h >= deb && h < fin
  }

  // Première réservation qui commence à cette heure
  const resDebutant = (resList, heure) =>
    resList.find(r => r.heure_debut === `${heure}:00`)

  function addReservation() {
    if (!form.partenaire.trim() || !form.service.trim()) {
      setFormErr('Partenaire et service sont requis.')
      return
    }
    if (estMardi(form.date)) {
      setFormErr('Le salon est fermé le mardi.')
      return
    }
    const dispos = getChaisesDisponibles(reservations, chaises, form.date, form.heure_debut, form.heure_fin)
    if (!dispos.find(c => c.id === form.chaise_id)) {
      setFormErr('Cette chaise est déjà occupée sur ce créneau.')
      return
    }
    const chaise = chaises.find(c => c.id === form.chaise_id)
    const tarif = calculerTarif(chaise, form.heure_debut, form.heure_fin)
    setReservations(prev => [...prev, { id: `r${Date.now()}`, ...form, tarif }])
    simulerSMS('514-919-5970',
      `Nouvelle réservation chaise (admin) : ${chaise.nom} le ${form.date} ${form.heure_debut}–${form.heure_fin} — ${form.partenaire}. Kadio Admin.`
    )
    setForm(FORM_INIT)
    setShowForm(false)
    setFormErr('')
    setJourActif(form.date)
    showToast(`Réservation ajoutée — SMS envoyé ✓`)
  }

  function libererChaise(id) {
    setReservations(prev => prev.map(r => r.id === id ? { ...r, statut: 'annule' } : r))
    setLibererConfirm(null)
    showToast('Chaise libérée.')
  }

  return (
    <div style={{ padding: '24px', paddingBottom: '100px', color: NOIR, background: CREME, minHeight: '100vh' }}>

      {toast && (
        <div style={{ position: 'fixed', top: '20px', right: '20px', background: '#14532d', border: '1px solid #22c55e', color: '#86efac', padding: '10px 18px', borderRadius: '8px', zIndex: 999, fontSize: '14px' }}>
          {toast}
        </div>
      )}

      {/* Confirm libérer */}
      {libererConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(14,12,9,0.85)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ background: CARD, border: `1px solid ${BORDER_OR}`, borderRadius: '14px', padding: '20px', width: '100%', maxWidth: '360px' }}>
            <h3 style={{ color: NOIR, margin: '0 0 8px', fontSize: '16px' }}>Libérer cette chaise ?</h3>
            <p style={{ color: MUTED, fontSize: '13px', margin: '0 0 16px' }}>
              {libererConfirm.partenaire} · {libererConfirm.heure_debut}–{libererConfirm.heure_fin}
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => setLibererConfirm(null)}
                style={{ flex: 1, padding: '10px', background: 'transparent', border: `1px solid ${BORDER_OR}`, borderRadius: '8px', color: MUTED, cursor: 'pointer', fontSize: '13px' }}>
                Annuler
              </button>
              <button onClick={() => libererChaise(libererConfirm.id)}
                style={{ flex: 1, padding: '10px', background: '#ef4444', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: '13px' }}>
                Libérer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h1 style={{ color: OR, fontSize: '20px', fontWeight: 700, margin: '0 0 4px' }}>Chaises salon</h1>
          <p style={{ color: MUTED, margin: 0, fontSize: '13px' }}>{totalResDuJour} réservation(s) ce jour</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setFormErr('') }}
          style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: OR, color: NOIR, fontWeight: 700, cursor: 'pointer', fontSize: '13px' }}>
          + Réservation
        </button>
      </div>

      {/* Formulaire ajout */}
      {showForm && (
        <div style={{ background: CARD, border: `1px solid ${BORDER_OR}`, borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
          <h3 style={{ color: OR, fontSize: '14px', margin: '0 0 14px' }}>Nouvelle réservation manuelle</h3>
          {formErr && <p style={{ color: '#ef4444', fontSize: '12px', margin: '0 0 10px' }}>{formErr}</p>}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ color: MUTED, fontSize: '11px', display: 'block', marginBottom: '4px' }}>Chaise</label>
              <select value={form.chaise_id} onChange={e => setForm(p => ({ ...p, chaise_id: e.target.value }))}
                style={{ width: '100%', background: '#0f0c09', border: `1px solid ${BORDER_OR}`, borderRadius: '8px', color: NOIR, padding: '10px', fontSize: '13px' }}>
                {chaises.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
              </select>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ color: MUTED, fontSize: '11px', display: 'block', marginBottom: '4px' }}>Partenaire *</label>
              <input value={form.partenaire} onChange={e => setForm(p => ({ ...p, partenaire: e.target.value }))} placeholder="Nom du partenaire"
                style={{ width: '100%', background: '#0f0c09', border: `1px solid ${BORDER_OR}`, borderRadius: '8px', color: NOIR, padding: '10px', fontSize: '13px', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ color: MUTED, fontSize: '11px', display: 'block', marginBottom: '4px' }}>Date</label>
              <input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                style={{ width: '100%', background: '#0f0c09', border: `1px solid ${BORDER_OR}`, borderRadius: '8px', color: NOIR, padding: '10px', fontSize: '13px', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ color: MUTED, fontSize: '11px', display: 'block', marginBottom: '4px' }}>Service *</label>
              <input value={form.service} onChange={e => setForm(p => ({ ...p, service: e.target.value }))} placeholder="Ex: Knotless"
                style={{ width: '100%', background: '#0f0c09', border: `1px solid ${BORDER_OR}`, borderRadius: '8px', color: NOIR, padding: '10px', fontSize: '13px', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ color: MUTED, fontSize: '11px', display: 'block', marginBottom: '4px' }}>Début</label>
              <input type="time" value={form.heure_debut} onChange={e => setForm(p => ({ ...p, heure_debut: e.target.value }))}
                style={{ width: '100%', background: '#0f0c09', border: `1px solid ${BORDER_OR}`, borderRadius: '8px', color: NOIR, padding: '10px', fontSize: '13px', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ color: MUTED, fontSize: '11px', display: 'block', marginBottom: '4px' }}>Fin</label>
              <input type="time" value={form.heure_fin} onChange={e => setForm(p => ({ ...p, heure_fin: e.target.value }))}
                style={{ width: '100%', background: '#0f0c09', border: `1px solid ${BORDER_OR}`, borderRadius: '8px', color: NOIR, padding: '10px', fontSize: '13px', boxSizing: 'border-box' }} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => { setShowForm(false); setFormErr('') }}
              style={{ flex: 1, padding: '10px', borderRadius: '8px', border: `1px solid ${BORDER_OR}`, background: 'none', color: MUTED, cursor: 'pointer', fontSize: '13px' }}>
              Annuler
            </button>
            <button onClick={addReservation}
              style={{ flex: 2, padding: '10px', borderRadius: '8px', border: 'none', background: OR, color: NOIR, fontWeight: 700, cursor: 'pointer', fontSize: '13px' }}>
              Ajouter + SMS
            </button>
          </div>
        </div>
      )}

      {/* Légende partenaires */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
        {Object.entries(PARTENAIRES_COULEUR).map(([nom, col]) => (
          <div key={nom} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: col }} />
            <span style={{ fontSize: '11px', color: MUTED }}>{nom.split(' ')[0]}</span>
          </div>
        ))}
      </div>

      {/* Sélecteur jour (semaine) */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '20px', overflowX: 'auto', paddingBottom: '4px' }}>
        {SEMAINE.map((date, i) => {
          const isTuesday = estMardi(date)
          const resCount = chaises.reduce((s, ch) => s + resDuJour(ch.id, date).length, 0)
          const active = jourActif === date
          return (
            <button key={date} onClick={() => !isTuesday && setJourActif(date)} disabled={isTuesday}
              style={{
                flex: '0 0 auto', minWidth: '52px', padding: '8px 4px', borderRadius: '10px',
                border: `1px solid ${active ? OR : BORDER_OR}`,
                background: active ? OR : isTuesday ? 'rgba(239,68,68,0.08)' : CARD,
                color: active ? NOIR : isTuesday ? 'rgba(239,68,68,0.4)' : CREME,
                cursor: isTuesday ? 'not-allowed' : 'pointer', textAlign: 'center',
              }}>
              <div style={{ fontSize: '11px', fontWeight: 700 }}>{JOURS[i]}</div>
              <div style={{ fontSize: '13px', fontWeight: active ? 700 : 400 }}>{date.slice(8)}</div>
              {!isTuesday && resCount > 0 && (
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: active ? NOIR : OR, margin: '2px auto 0' }} />
              )}
              {isTuesday && <div style={{ fontSize: '9px', color: '#ef4444', marginTop: '1px' }}>Fermé</div>}
            </button>
          )
        })}
      </div>

      {/* Grille semaine — 4 chaises × heures */}
      <div style={{ overflowX: 'auto' }}>
        <div style={{ minWidth: '380px' }}>

          {/* En-têtes chaises */}
          <div style={{ display: 'grid', gridTemplateColumns: '40px repeat(4, 1fr)', gap: '4px', marginBottom: '4px' }}>
            <div />
            {chaises.map(ch => (
              <div key={ch.id} style={{ textAlign: 'center', padding: '6px 4px', background: `${ch.couleur}22`, borderRadius: '8px', border: `1px solid ${ch.couleur}44` }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: ch.couleur, margin: '0 auto 3px' }} />
                <div style={{ fontSize: '11px', color: NOIR, fontWeight: 600 }}>{ch.nom.replace('Chaise ', 'Ch.')}</div>
              </div>
            ))}
          </div>

          {/* Lignes par heure */}
          {HEURES.map(heure => (
            <div key={heure} style={{ display: 'grid', gridTemplateColumns: '40px repeat(4, 1fr)', gap: '4px', marginBottom: '3px' }}>
              {/* Heure label */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '6px' }}>
                <span style={{ fontSize: '10px', color: MUTED }}>{heure}h</span>
              </div>
              {/* Cellules par chaise */}
              {chaises.map(ch => {
                const resList = resDuJour(ch.id, jourActif)
                const resIci = resList.find(r => couvreHeure(r, heure))
                const estDebut = resIci && resDebutant(resList, heure) !== undefined && resDebutant(resList, heure)?.id === resIci.id
                const couleurPart = PARTENAIRES_COULEUR[resIci?.partenaire] || '#6b7280'

                return (
                  <div key={ch.id} style={{
                    height: '36px', borderRadius: '6px',
                    background: resIci ? `${couleurPart}30` : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${resIci ? `${couleurPart}60` : BORDER_OR}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
                    position: 'relative', cursor: resIci ? 'pointer' : 'default',
                  }}
                    onClick={() => resIci && setLibererConfirm(resIci)}
                  >
                    {estDebut && resIci && (
                      <span style={{ fontSize: '9px', color: couleurPart, fontWeight: 700, textAlign: 'center', padding: '0 2px', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%' }}>
                        {resIci.partenaire.split(' ')[0]}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Détails réservations du jour */}
      <div style={{ marginTop: '20px' }}>
        <h3 style={{ color: OR, fontSize: '14px', margin: '0 0 12px' }}>
          Détail · {jourActif}
        </h3>
        {chaises.map(ch => {
          const resList = resDuJour(ch.id, jourActif)
          if (resList.length === 0) return null
          return (
            <div key={ch.id} style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: ch.couleur }} />
                <span style={{ fontSize: '13px', fontWeight: 600, color: NOIR }}>{ch.nom}</span>
              </div>
              {resList.map(r => {
                const couleurPart = PARTENAIRES_COULEUR[r.partenaire] || '#6b7280'
                return (
                  <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: CARD, borderRadius: '8px', padding: '10px 12px', marginBottom: '6px', border: `1px solid ${BORDER_OR}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: couleurPart }} />
                      <div>
                        <p style={{ margin: '0 0 2px', fontSize: '13px', fontWeight: 600, color: NOIR }}>{r.partenaire}</p>
                        <p style={{ margin: 0, fontSize: '11px', color: MUTED }}>{r.heure_debut}–{r.heure_fin} · {r.service}</p>
                      </div>
                    </div>
                    <button onClick={() => setLibererConfirm(r)}
                      style={{ background: 'transparent', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '6px', padding: '4px 10px', color: '#ef4444', cursor: 'pointer', fontSize: '11px' }}>
                      Libérer
                    </button>
                  </div>
                )
              })}
            </div>
          )
        })}
        {totalResDuJour === 0 && (
          <p style={{ color: MUTED, fontSize: '13px', fontStyle: 'italic' }}>Aucune réservation ce jour.</p>
        )}
      </div>
    </div>
  )
}
