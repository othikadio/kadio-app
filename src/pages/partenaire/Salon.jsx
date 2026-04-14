import { useState } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { useChaises, usePartenaireProfil } from '@/hooks'
import { OR, CREME, CARD, MUTED, BORDER_OR, formatMontant, formatDate, statutColor, NOIR } from '@/lib/utils'
import { simulerSMS } from '@/utils/commandes'
import {
  getChaisesDisponibles, calculerTarif, creerReservation,
  estMardi, dureeSuffisante, toMin, DUREE_MIN_H,
} from '@/utils/chaises'

const TODAY = '2026-03-28'

const RES_INIT = [
  { id: 'rc1', chaise_id: 'ch1', chaise_nom: 'Chaise 1', partenaire: 'Diane Mbaye', date: '2026-04-05', heure_debut: '09:00', heure_fin: '13:00', tarif: 60, service: 'Knotless braids', statut: 'confirme' },
  { id: 'rc2', chaise_id: 'ch3', chaise_nom: 'Chaise VIP', partenaire: 'Rachel Ndoye', date: '2026-04-12', heure_debut: '10:00', heure_fin: '17:00', tarif: 120, service: 'Tresses signature', statut: 'confirme' },
  // Occupation existante pour démo conflit
  { id: 'rc3', chaise_id: 'ch1', chaise_nom: 'Chaise 1', partenaire: 'Fatou Konaté', date: '2026-04-05', heure_debut: '14:00', heure_fin: '17:00', tarif: 45, service: 'Locs', statut: 'confirme' },
]

const JOURS_FR = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']

function erreurDate(dateStr) {
  if (!dateStr) return null
  if (estMardi(dateStr)) return `Le salon est fermé le mardi.`
  const d = new Date(dateStr + 'T12:00:00')
  const today = new Date(TODAY + 'T12:00:00')
  if (d < today) return `Impossible de réserver dans le passé.`
  const max = new Date(today)
  max.setDate(max.getDate() + 60)
  if (d > max) return `Réservation possible jusqu'à 60 jours à l'avance.`
  return null
}

function erreurHoraires(heureDebut, heureFin) {
  if (!heureDebut || !heureFin) return null
  const debut = toMin(heureDebut)
  const fin   = toMin(heureFin)
  if (fin <= debut) return `L'heure de fin doit être après l'heure de début.`
  if (debut < toMin('09:00')) return `Le salon ouvre à 09h00.`
  if (fin > toMin('19:00'))   return `Le salon ferme à 19h00.`
  if (!dureeSuffisante(heureDebut, heureFin)) return `Minimum ${DUREE_MIN_H}h de réservation.`
  return null
}

export default function PartenaireSalon() {
  const { partenaire } = useAuthStore()
  const userId = partenaire?.user_id || 'usr-diane'

  const { data: chaises, loading: loadingChaises } = useChaises()
  const { data: profil } = usePartenaireProfil(userId)

  if (loadingChaises) {
    return <div style={{ fontFamily: `'DM Sans', sans-serif`, color: NOIR, padding: '16px', textAlign: 'center' }}>Chargement...</div>
  }

  const partenaireName = profil?.prenom && profil?.nom ? `${profil.prenom} ${profil.nom}` : 'Diane Mbaye'

  const [step, setStep]               = useState('date') // date | heures | chaises | recap
  const [date, setDate]               = useState('')
  const [heureDebut, setHeureDebut]   = useState('')
  const [heureFin, setHeureFin]       = useState('')
  const [chaiseChoisie, setChaiseChoisie] = useState(null)
  const [reservations, setReservations] = useState(RES_INIT)
  const [solde, setSolde]             = useState(profil?.portefeuille_solde ?? 0)
  const [confirmation, setConfirmation] = useState(null)
  const [activeView, setActiveView]   = useState('reserver') // reserver | mesres

  const dateErr = erreurDate(date)
  const heureErr = erreurHoraires(heureDebut, heureFin)
  const chaisesDispos = (date && !dateErr && heureDebut && heureFin && !heureErr)
    ? getChaisesDisponibles(reservations, chaises || [], date, heureDebut, heureFin)
    : []
  const tarif = chaiseChoisie ? calculerTarif(chaiseChoisie, heureDebut, heureFin) : 0
  const soldeSuffisant = solde >= tarif

  const mesReservations = reservations
    .filter(r => r.partenaire === partenaireName)
    .sort((a, b) => a.date.localeCompare(b.date))

  const STEPS = ['date', 'heures', 'chaises', 'recap']
  const stepIdx = STEPS.indexOf(step)

  function reset() {
    setStep('date')
    setDate('')
    setHeureDebut('')
    setHeureFin('')
    setChaiseChoisie(null)
  }

  function confirmer() {
    const res = creerReservation({
      chaiseId: chaiseChoisie.id,
      chaiseNom: chaiseChoisie.nom,
      partenaire: partenaireName,
      date, heureDebut, heureFin, tarif,
      service: '',
    })
    setReservations(prev => [...prev, res])
    setSolde(s => +(s - tarif).toFixed(2))
    setConfirmation(res)

    // SMS simulé à Othi (514-919-5970)
    simulerSMS('514-919-5970',
      `Nouvelle réservation chaise salon : ${chaiseChoisie.nom} le ${date} de ${heureDebut} à ${heureFin} — Diane Mbaye. Tarif : ${formatMontant(tarif)}. Kadio.`
    )
    reset()
    setActiveView('mesres')
  }

  function annulerReservation(id) {
    setReservations(prev => prev.map(r => r.id === id ? { ...r, statut: 'annule' } : r))
  }

  const canCancelBefore24h = (dateStr, heureStr) => {
    const rdvTs = new Date(`${dateStr}T${heureStr}:00`).getTime()
    const nowTs = new Date(`${TODAY}T09:00:00`).getTime()
    return rdvTs - nowTs > 24 * 60 * 60 * 1000
  }

  return (
    <div style={{ fontFamily: `'DM Sans', sans-serif`, color: NOIR, padding: '16px', paddingBottom: '100px' }}>

      {/* Header */}
      <div style={{ fontSize: '20px', fontWeight: 700, marginBottom: '4px' }}>Salon Kadio</div>
      <div style={{ fontSize: '13px', color: MUTED, marginBottom: '16px' }}>
        Portefeuille : <span style={{ color: OR, fontWeight: 700 }}>{formatMontant(solde)}</span>
      </div>

      {/* Confirmation bannière */}
      {confirmation && (
        <div style={{ background: '#0d2818', border: '1px solid #22c55e', borderRadius: '12px', padding: '14px', marginBottom: '16px' }}>
          <p style={{ margin: '0 0 4px', color: '#86efac', fontWeight: 700 }}>✅ Réservation confirmée !</p>
          <p style={{ margin: '0 0 2px', color: NOIR, fontSize: '13px' }}>{confirmation.chaise_nom} · {formatDate(confirmation.date)}</p>
          <p style={{ margin: '0 0 4px', color: NOIR, fontSize: '13px' }}>{confirmation.heure_debut} — {confirmation.heure_fin} · {formatMontant(confirmation.tarif)}</p>
          <p style={{ margin: 0, color: '#86efac', fontSize: '12px' }}>SMS de confirmation envoyé à Kadio ✓</p>
          <button onClick={() => setConfirmation(null)}
            style={{ marginTop: '10px', width: '100%', background: 'transparent', border: '1px solid #22c55e', borderRadius: '8px', padding: '7px', color: '#86efac', cursor: 'pointer', fontSize: '13px' }}>
            OK
          </button>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '20px' }}>
        {[{ k: 'reserver', l: 'Réserver' }, { k: 'mesres', l: `Mes réservations (${mesReservations.filter(r => r.statut === 'confirme').length})` }].map(t => (
          <button key={t.k} onClick={() => setActiveView(t.k)}
            style={{
              flex: 1, background: activeView === t.k ? OR : `rgba(14,12,9,0.08)`,
              color: activeView === t.k ? '#0E0C09' : MUTED,
              border: 'none', borderRadius: '999px', padding: '9px 6px',
              fontSize: '12px', fontWeight: 700, cursor: 'pointer',
              fontFamily: `'DM Sans', sans-serif`,
            }}>
            {t.l}
          </button>
        ))}
      </div>

      {/* ═══ Réserver ═══ */}
      {activeView === 'reserver' && (
        <>
          {/* Progress bar */}
          <div style={{ display: 'flex', gap: '4px', marginBottom: '20px' }}>
            {STEPS.map((s, i) => (
              <div key={s} style={{
                flex: 1, height: '3px', borderRadius: '999px',
                background: i <= stepIdx ? OR : `rgba(14,12,9,0.08)`,
              }} />
            ))}
          </div>

          {/* ── Étape 1 : Date ── */}
          {step === 'date' && (
            <div>
              <p style={{ fontWeight: 700, fontSize: '15px', margin: '0 0 16px' }}>Étape 1 — Choisir une date</p>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '12px', color: MUTED, display: 'block', marginBottom: '6px' }}>Date de réservation</label>
                <input type="date" value={date} min={TODAY}
                  onChange={e => setDate(e.target.value)}
                  style={{
                    width: '100%', background: CARD, border: `1px solid ${dateErr ? '#ef4444' : BORDER_OR}`,
                    borderRadius: '10px', padding: '12px', color: NOIR, fontSize: '14px', boxSizing: 'border-box',
                  }}
                />
                {dateErr && <p style={{ color: '#ef4444', fontSize: '12px', margin: '4px 0 0' }}>{dateErr}</p>}
                {date && !dateErr && (
                  <p style={{ color: '#22c55e', fontSize: '12px', margin: '4px 0 0' }}>
                    {JOURS_FR[new Date(date + 'T12:00:00').getDay()]} {formatDate(date)} — disponible ✓
                  </p>
                )}
              </div>
              <p style={{ color: MUTED, fontSize: '12px', margin: '0 0 16px' }}>
                ℹ️ Salon fermé le mardi. Heures d'ouverture : 09h00 — 19h00.
              </p>
              <button onClick={() => setStep('heures')} disabled={!date || !!dateErr}
                style={{
                  width: '100%', background: (!date || dateErr) ? `rgba(14,12,9,0.08)` : OR,
                  color: (!date || dateErr) ? MUTED : NOIR,
                  border: 'none', borderRadius: '10px', padding: '13px',
                  fontSize: '14px', fontWeight: 700, cursor: (!date || dateErr) ? 'default' : 'pointer',
                  fontFamily: `'DM Sans', sans-serif`,
                }}>
                Continuer
              </button>
            </div>
          )}

          {/* ── Étape 2 : Heures ── */}
          {step === 'heures' && (
            <div>
              <p style={{ fontWeight: 700, fontSize: '15px', margin: '0 0 4px' }}>Étape 2 — Horaires</p>
              <p style={{ color: MUTED, fontSize: '12px', margin: '0 0 16px' }}>
                {JOURS_FR[new Date(date + 'T12:00:00').getDay()]} {formatDate(date)} · Minimum {DUREE_MIN_H}h
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: MUTED, display: 'block', marginBottom: '6px' }}>Heure début</label>
                  <input type="time" value={heureDebut} min="09:00" max="17:00"
                    onChange={e => { setHeureDebut(e.target.value); setChaiseChoisie(null) }}
                    style={{ width: '100%', background: CARD, border: `1px solid ${BORDER_OR}`, borderRadius: '10px', padding: '10px 12px', color: NOIR, fontSize: '14px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: MUTED, display: 'block', marginBottom: '6px' }}>Heure fin</label>
                  <input type="time" value={heureFin} min="11:00" max="19:00"
                    onChange={e => { setHeureFin(e.target.value); setChaiseChoisie(null) }}
                    style={{ width: '100%', background: CARD, border: `1px solid ${BORDER_OR}`, borderRadius: '10px', padding: '10px 12px', color: NOIR, fontSize: '14px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              {heureErr && <p style={{ color: '#ef4444', fontSize: '12px', margin: '0 0 12px' }}>{heureErr}</p>}

              {heureDebut && heureFin && !heureErr && (
                <div style={{ background: `rgba(184,146,42,0.08)`, borderRadius: '10px', padding: '10px 12px', marginBottom: '12px', border: `1px solid ${BORDER_OR}` }}>
                  <p style={{ margin: '0 0 4px', fontSize: '12px', color: MUTED }}>
                    Durée : {((toMin(heureFin) - toMin(heureDebut)) / 60).toFixed(1)}h
                    · {(toMin(heureFin) - toMin(heureDebut)) / 60 >= 6 ? 'Tarif journée appliqué' : 'Tarif horaire appliqué'}
                  </p>
                  <p style={{ margin: 0, color: '#22c55e', fontSize: '12px', fontWeight: 600 }}>
                    {chaisesDispos.length} chaise(s) disponible(s) sur ce créneau
                  </p>
                </div>
              )}

              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => setStep('date')}
                  style={{ flex: 1, background: 'transparent', border: `1px solid ${BORDER_OR}`, borderRadius: '10px', padding: '12px', color: MUTED, cursor: 'pointer', fontSize: '14px' }}>
                  Retour
                </button>
                <button onClick={() => setStep('chaises')} disabled={!heureDebut || !heureFin || !!heureErr || chaisesDispos.length === 0}
                  style={{
                    flex: 2, background: (!heureDebut || !heureFin || !!heureErr || chaisesDispos.length === 0) ? `rgba(14,12,9,0.08)` : OR,
                    color: (!heureDebut || !heureFin || !!heureErr || chaisesDispos.length === 0) ? MUTED : NOIR,
                    border: 'none', borderRadius: '10px', padding: '12px',
                    cursor: (!heureDebut || !heureFin || !!heureErr || chaisesDispos.length === 0) ? 'default' : 'pointer',
                    fontFamily: `'DM Sans', sans-serif`, fontSize: '14px', fontWeight: 700,
                  }}>
                  Voir les chaises disponibles
                </button>
              </div>
            </div>
          )}

          {/* ── Étape 3 : Chaises ── */}
          {step === 'chaises' && (
            <div>
              <p style={{ fontWeight: 700, fontSize: '15px', margin: '0 0 4px' }}>Étape 3 — Choisir une chaise</p>
              <p style={{ color: MUTED, fontSize: '12px', margin: '0 0 16px' }}>{formatDate(date)} · {heureDebut} — {heureFin}</p>

              {chaisesDispos.length === 0 ? (
                <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', padding: '16px', textAlign: 'center', marginBottom: '16px' }}>
                  <p style={{ color: '#ef4444', fontWeight: 700, margin: '0 0 4px' }}>Aucune chaise disponible</p>
                  <p style={{ color: MUTED, fontSize: '12px', margin: 0 }}>Toutes les chaises sont occupées sur ce créneau.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                  {chaisesDispos.map(ch => {
                    const t = calculerTarif(ch, heureDebut, heureFin)
                    const isJournee = (toMin(heureFin) - toMin(heureDebut)) / 60 >= 6
                    const selected = chaiseChoisie?.id === ch.id
                    return (
                      <button key={ch.id} onClick={() => setChaiseChoisie(ch)}
                        style={{
                          background: selected ? `${ch.couleur}18` : CARD,
                          border: `2px solid ${selected ? ch.couleur : BORDER_OR}`,
                          borderRadius: '12px', padding: '14px', cursor: 'pointer',
                          fontFamily: `'DM Sans', sans-serif`,
                          display: 'flex', alignItems: 'center', gap: '14px', textAlign: 'left',
                        }}>
                        <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: ch.couleur, flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, color: NOIR, fontSize: '14px' }}>{ch.nom}</div>
                          <div style={{ fontSize: '12px', color: MUTED, marginTop: '2px' }}>
                            {isJournee ? `Tarif journée` : `${formatMontant(ch.tarif_heure)}/h`}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ color: OR, fontWeight: 700, fontSize: '17px' }}>{formatMontant(t)}</div>
                          <div style={{ fontSize: '11px', color: MUTED }}>{isJournee ? 'journée' : 'total'}</div>
                        </div>
                        {selected && <span style={{ color: '#22c55e', fontSize: '20px' }}>✓</span>}
                      </button>
                    )
                  })}
                </div>
              )}

              {/* Alerte solde insuffisant */}
              {chaiseChoisie && !soldeSuffisant && (
                <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', padding: '12px', marginBottom: '12px' }}>
                  <p style={{ color: '#ef4444', fontWeight: 600, margin: '0 0 2px', fontSize: '13px' }}>Solde insuffisant</p>
                  <p style={{ color: MUTED, fontSize: '12px', margin: 0 }}>
                    Solde : {formatMontant(solde)} · Tarif : {formatMontant(tarif)} · Manque : {formatMontant(tarif - solde)}
                  </p>
                </div>
              )}

              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => setStep('heures')}
                  style={{ flex: 1, background: 'transparent', border: `1px solid ${BORDER_OR}`, borderRadius: '10px', padding: '12px', color: MUTED, cursor: 'pointer', fontSize: '14px' }}>
                  Retour
                </button>
                <button onClick={() => setStep('recap')} disabled={!chaiseChoisie || !soldeSuffisant}
                  style={{
                    flex: 2, background: (!chaiseChoisie || !soldeSuffisant) ? `rgba(14,12,9,0.08)` : OR,
                    color: (!chaiseChoisie || !soldeSuffisant) ? MUTED : NOIR,
                    border: 'none', borderRadius: '10px', padding: '12px',
                    cursor: (!chaiseChoisie || !soldeSuffisant) ? 'default' : 'pointer',
                    fontFamily: `'DM Sans', sans-serif`, fontSize: '14px', fontWeight: 700,
                  }}>
                  Voir le récapitulatif
                </button>
              </div>
            </div>
          )}

          {/* ── Étape 4 : Récapitulatif ── */}
          {step === 'recap' && chaiseChoisie && (
            <div>
              <p style={{ fontWeight: 700, fontSize: '15px', margin: '0 0 16px' }}>Étape 4 — Confirmation</p>

              <div style={{ background: CARD, border: `2px solid ${chaiseChoisie.couleur}`, borderRadius: '14px', padding: '18px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', paddingBottom: '14px', borderBottom: `1px solid ${BORDER_OR}` }}>
                  <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: chaiseChoisie.couleur }} />
                  <span style={{ fontWeight: 700, fontSize: '15px' }}>{chaiseChoisie.nom}</span>
                </div>
                {[
                  { label: 'Date', value: `${JOURS_FR[new Date(date + 'T12:00:00').getDay()]} ${formatDate(date)}` },
                  { label: 'Horaires', value: `${heureDebut} — ${heureFin}` },
                  { label: 'Durée', value: `${((toMin(heureFin) - toMin(heureDebut)) / 60).toFixed(1)} heures` },
                  { label: 'Mode paiement', value: 'Portefeuille Kadio' },
                ].map(row => (
                  <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '13px', color: MUTED }}>{row.label}</span>
                    <span style={{ fontSize: '13px', color: NOIR, fontWeight: 600 }}>{row.value}</span>
                  </div>
                ))}
                <div style={{ borderTop: `1px solid ${BORDER_OR}`, paddingTop: '12px', marginTop: '8px', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 700, color: NOIR }}>Total débité</span>
                  <span style={{ fontSize: '20px', fontWeight: 700, color: OR }}>{formatMontant(tarif)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
                  <span style={{ fontSize: '12px', color: MUTED }}>Solde après</span>
                  <span style={{ fontSize: '13px', color: '#22c55e', fontWeight: 600 }}>{formatMontant(solde - tarif)}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => setStep('chaises')}
                  style={{ flex: 1, background: 'transparent', border: `1px solid ${BORDER_OR}`, borderRadius: '10px', padding: '12px', color: MUTED, cursor: 'pointer', fontSize: '14px' }}>
                  Retour
                </button>
                <button onClick={confirmer}
                  style={{ flex: 2, background: OR, color: NOIR, border: 'none', borderRadius: '10px', padding: '12px', cursor: 'pointer', fontFamily: `'DM Sans', sans-serif`, fontSize: '14px', fontWeight: 700 }}>
                  Confirmer la réservation
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* ═══ Mes réservations ═══ */}
      {activeView === 'mesres' && (
        <>
          {mesReservations.filter(r => r.statut === 'confirme').length === 0 ? (
            <p style={{ color: MUTED, textAlign: 'center', padding: '32px 0', fontSize: '14px' }}>Aucune réservation à venir.</p>
          ) : null}
          {mesReservations.map(res => {
            const chaise = (chaises || []).find(c => c.id === res.chaise_id)
            const canCancel = res.statut === 'confirme' && canCancelBefore24h(res.date, res.heure_debut)
            const annule = res.statut === 'annule'
            return (
              <div key={res.id} style={{
                background: CARD, borderRadius: '12px', padding: '14px', marginBottom: '10px',
                border: `1px solid ${annule ? 'rgba(239,68,68,0.2)' : BORDER_OR}`,
                opacity: annule ? 0.55 : 1,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: chaise?.couleur || OR, flexShrink: 0 }} />
                    <span style={{ fontWeight: 700, fontSize: '14px' }}>{res.chaise_nom}</span>
                  </div>
                  <span style={{
                    fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '999px',
                    background: `${statutColor(res.statut)}22`, color: statutColor(res.statut),
                  }}>
                    {res.statut === 'confirme' ? 'Confirmé' : 'Annulé'}
                  </span>
                </div>
                <p style={{ margin: '0 0 2px', fontSize: '13px', color: NOIR }}>{JOURS_FR[new Date(res.date + 'T12:00:00').getDay()]} {formatDate(res.date)}</p>
                <p style={{ margin: '0 0 4px', fontSize: '12px', color: MUTED }}>{res.heure_debut} — {res.heure_fin}</p>
                <p style={{ margin: 0, fontSize: '14px', color: OR, fontWeight: 700 }}>{formatMontant(res.tarif)}</p>
                {canCancel && (
                  <button onClick={() => annulerReservation(res.id)}
                    style={{ marginTop: '10px', width: '100%', background: 'transparent', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '8px', color: '#ef4444', cursor: 'pointer', fontSize: '12px', fontFamily: `'DM Sans', sans-serif` }}>
                    Annuler cette réservation
                  </button>
                )}
                {res.statut === 'confirme' && !canCancel && (
                  <p style={{ margin: '8px 0 0', fontSize: '11px', color: MUTED }}>Annulation impossible — moins de 24h avant le RDV</p>
                )}
              </div>
            )
          })}
        </>
      )}
    </div>
  )
}
