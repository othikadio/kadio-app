import { useState, useEffect } from 'react'
import React from 'react'
import { OR, CREME, NOIR, CARD, MUTED, BORDER_OR, formatDate, formatMontant } from '@/lib/utils'
import { useCommandesFournisseur } from '@/hooks'
import { STATUTS_COMMANDE } from '@/data/mockFournisseur'
import { simulerSMS } from '@/utils/commandes'

const FILTRES = ['Toutes', 'en_attente', 'confirmee', 'preparee', 'expediee', 'livree']
const STATUT_SMS = {
  confirmee: `Votre commande {num} a été confirmée. Préparation en cours. — BeautyPro / Kadio`,
  preparee:  `Votre commande {num} est prête et sera expédiée sous peu. — BeautyPro / Kadio`,
  expediee:  `Votre commande {num} a été expédiée. Numéro de suivi : {suivi}. — BeautyPro / Kadio`,
  livree:    `Votre commande {num} a été livrée. Merci pour votre commande ! — BeautyPro / Kadio`,
}

export default function FournisseurCommandes() {
  const { data: commandesFetch, loading } = useCommandesFournisseur('four-jean')
  const [commandes, setCommandes] = useState(commandesFetch || [])
  const [filtre, setFiltre]       = useState('Toutes')
  const [suivi, setSuivi]         = useState({})
  const [suiviError, setSuiviError] = useState({})
  const [success, setSuccess]     = useState('')
  const [smsLog, setSmsLog]       = useState([])

  // Sync fetched data with local state
  React.useEffect(() => {
    if (commandesFetch) setCommandes(commandesFetch)
  }, [commandesFetch])

  const filtered = filtre === 'Toutes' ? commandes : commandes.filter(c => c.statut === filtre)
  const nouvelles = commandes.filter(c => c.nouvelle).length

  if (loading) return <div style={{ padding: '24px', paddingBottom: '100px', color: NOIR, background: CREME, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ textAlign: 'center', color: MUTED }}>Chargement...</div>
  </div>

  const getStatut = (val) => STATUTS_COMMANDE.find(s => s.val === val)

  const avancer = (id) => {
    const cmd = commandes.find(c => c.id === id)
    const s = getStatut(cmd?.statut)

    // Numéro de suivi obligatoire avant expédition
    if (s?.next === 'expediee' && !suivi[id]?.trim()) {
      setSuiviError(e => ({ ...e, [id]: true }))
      return
    }
    setSuiviError(e => ({ ...e, [id]: false }))

    let updatedSuivi = suivi[id]
    setCommandes(cs => cs.map(c => {
      if (c.id !== id) return c
      const update = { ...c, statut: s.next, nouvelle: false }
      if (s.next === 'expediee' && updatedSuivi) update.numero_suivi = updatedSuivi.trim()
      return update
    }))

    // SMS simulé au partenaire
    const template = STATUT_SMS[s.next]
    if (template && cmd) {
      const msg = template
        .replace('{num}', cmd.numero)
        .replace('{suivi}', suivi[id] || '—')
      simulerSMS(cmd.partenaire.code, msg)
      const logEntry = { id: Date.now(), partenaire: `${cmd.partenaire.prenom} ${cmd.partenaire.nom}`, numero: cmd.numero, statut: s.next, msg, time: new Date().toLocaleTimeString('fr-CA') }
      setSmsLog(l => [logEntry, ...l.slice(0, 4)])
      setSuccess(`Statut mis à jour → SMS envoyé à ${cmd.partenaire.prenom} ✓`)
    } else {
      setSuccess('Statut mis à jour.')
    }
    setTimeout(() => setSuccess(''), 4000)
  }

  const marquerLue = (id) => {
    setCommandes(cs => cs.map(c => c.id === id ? { ...c, nouvelle: false } : c))
  }

  return (
    <div style={{ padding: '24px', paddingBottom: '100px', color: NOIR, background: CREME, minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
        <h2 style={{ color: OR, margin: 0, fontSize: '20px' }}>Commandes reçues</h2>
        {nouvelles > 0 && (
          <span style={{ background: '#ef4444', color: '#fff', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, flexShrink: 0 }}>
            {nouvelles}
          </span>
        )}
      </div>
      <p style={{ color: MUTED, margin: '0 0 16px', fontSize: '13px' }}>
        {nouvelles > 0 ? `${nouvelles} nouvelle(s) — cliquez pour marquer comme lue` : `${commandes.length} commandes au total`}
      </p>

      {/* Success + SMS log */}
      {success && (
        <div style={{ background: '#0d2818', border: '1px solid #22c55e', borderRadius: '8px', padding: '10px 16px', marginBottom: '12px', color: '#86efac', fontSize: '13px' }}>
          {success}
        </div>
      )}

      {smsLog.length > 0 && (
        <div style={{ background: CARD, border: `1px solid ${BORDER_OR}`, borderRadius: '10px', padding: '12px', marginBottom: '16px' }}>
          <p style={{ color: MUTED, fontSize: '11px', fontWeight: 700, margin: '0 0 8px', textTransform: 'uppercase' }}>SMS envoyés récemment</p>
          {smsLog.map(log => (
            <div key={log.id} style={{ borderBottom: `1px solid ${BORDER_OR}`, paddingBottom: '6px', marginBottom: '6px' }}>
              <p style={{ margin: '0 0 2px', fontSize: '12px', color: NOIR }}>
                → <strong>{log.partenaire}</strong> · {log.numero} · {log.time}
              </p>
              <p style={{ margin: 0, fontSize: '11px', color: MUTED, fontStyle: 'italic' }}>{log.msg}</p>
            </div>
          ))}
        </div>
      )}

      {/* Filtres */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
        {FILTRES.map(f => {
          const s = STATUTS_COMMANDE.find(x => x.val === f)
          const label = f === 'Toutes' ? 'Toutes' : s?.label || f
          const active = filtre === f
          return (
            <button key={f} onClick={() => setFiltre(f)} style={{
              background: active ? OR : CARD,
              color: active ? NOIR : CREME,
              border: `1px solid ${active ? OR : BORDER_OR}`,
              borderRadius: '20px', padding: '6px 14px', cursor: 'pointer', fontSize: '13px', fontWeight: active ? 700 : 400,
            }}>
              {label}
            </button>
          )
        })}
      </div>

      {/* Liste */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filtered.length === 0 && (
          <p style={{ color: MUTED, textAlign: 'center', padding: '40px 0' }}>Aucune commande dans ce statut.</p>
        )}
        {filtered.map(cmd => {
          const s = getStatut(cmd.statut)
          const needsSuivi = s?.next === 'expediee'
          const hasError   = suiviError[cmd.id]

          return (
            <div key={cmd.id} style={{ background: CARD, border: `1px solid ${cmd.nouvelle ? OR : BORDER_OR}`, borderRadius: '12px', padding: '16px', position: 'relative' }}
              onClick={() => cmd.nouvelle && marquerLue(cmd.id)}>

              {cmd.nouvelle && (
                <span style={{ position: 'absolute', top: '12px', right: '12px', background: OR, color: NOIR, borderRadius: '10px', padding: '2px 8px', fontSize: '11px', fontWeight: 700 }}>
                  NOUVELLE
                </span>
              )}

              {/* Numéro + date + statut */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', paddingRight: cmd.nouvelle ? '80px' : '0' }}>
                <div>
                  <p style={{ margin: '0 0 2px', fontWeight: 700, fontSize: '15px', color: NOIR }}>{cmd.numero}</p>
                  <p style={{ margin: 0, color: MUTED, fontSize: '12px' }}>{formatDate(cmd.date)}</p>
                </div>
                <span style={{ background: `${s?.color}22`, border: `1px solid ${s?.color}`, borderRadius: '10px', padding: '3px 10px', fontSize: '12px', color: s?.color, fontWeight: 600, flexShrink: 0 }}>
                  {s?.label}
                </span>
              </div>

              {/* Partenaire */}
              <div style={{ background: '#0f0c09', borderRadius: '8px', padding: '10px 12px', marginBottom: '12px' }}>
                <p style={{ margin: '0 0 2px', fontSize: '13px', color: NOIR }}>
                  <span style={{ color: MUTED }}>Partenaire : </span>
                  {cmd.partenaire.prenom} {cmd.partenaire.nom}
                </p>
                <p style={{ margin: 0, fontSize: '11px', color: MUTED }}>{cmd.partenaire.code}</p>
              </div>

              {/* Articles */}
              <div style={{ marginBottom: '12px' }}>
                {cmd.articles.map((art, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: i < cmd.articles.length - 1 ? `1px solid ${BORDER_OR}` : 'none' }}>
                    <span style={{ color: NOIR, fontSize: '13px' }}>{art.nom} <span style={{ color: MUTED }}>×{art.qte}</span></span>
                    <span style={{ color: NOIR, fontSize: '13px' }}>{formatMontant(art.prix_unit * art.qte)}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px' }}>
                  <span style={{ color: MUTED, fontSize: '13px' }}>Total</span>
                  <span style={{ color: OR, fontWeight: 700, fontSize: '15px' }}>{formatMontant(cmd.total)}</span>
                </div>
              </div>

              {/* Numéro suivi existant */}
              {cmd.numero_suivi && (
                <p style={{ color: '#60a5fa', fontSize: '13px', margin: '0 0 12px' }}>
                  Suivi : <span style={{ fontWeight: 600 }}>{cmd.numero_suivi}</span>
                </p>
              )}

              {/* Champ suivi OBLIGATOIRE avant expédition */}
              {needsSuivi && (
                <div style={{ marginBottom: '10px' }}>
                  <input
                    placeholder="Numéro de suivi — OBLIGATOIRE pour expédier"
                    value={suivi[cmd.id] || ''}
                    onChange={e => { setSuivi(sv => ({ ...sv, [cmd.id]: e.target.value })); setSuiviError(er => ({ ...er, [cmd.id]: false })) }}
                    onClick={e => e.stopPropagation()}
                    style={{
                      width: '100%', background: '#0f0c09',
                      border: `1px solid ${hasError ? '#ef4444' : BORDER_OR}`,
                      borderRadius: '8px', padding: '10px 12px', color: NOIR,
                      fontSize: '13px', boxSizing: 'border-box',
                    }}
                  />
                  {hasError && (
                    <p style={{ color: '#ef4444', fontSize: '12px', margin: '4px 0 0' }}>
                      Le numéro de suivi est obligatoire avant l'expédition.
                    </p>
                  )}
                </div>
              )}

              {/* Bouton avancer statut */}
              {s?.next && (
                <button
                  onClick={(e) => { e.stopPropagation(); avancer(cmd.id) }}
                  style={{ background: OR, color: NOIR, border: 'none', borderRadius: '8px', padding: '10px 20px', fontWeight: 700, cursor: 'pointer', fontSize: '14px', width: '100%' }}>
                  {s.nextLabel} + SMS partenaire
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
