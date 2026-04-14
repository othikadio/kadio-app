import { useState } from 'react'
import { OR, CREME, NOIR, CARD, MUTED, BORDER_OR, formatDate, statutColor, initiales } from '@/lib/utils'
import { useAllCandidatures } from '@/hooks'

const STATUT_LABELS = { accepte: 'Accepté', en_attente: 'En attente', en_revision: 'En révision', refusee: 'Refusée' }

export default function AdminFormation() {
  const { data: candidaturesData = [], loading } = useAllCandidatures()
  const [candidats, setCandidats] = useState(candidaturesData)
  const [toast, setToast] = useState('')

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500) }

  const enFormation = candidats.filter(c => c.statut === 'accepte')
  const certifies = enFormation.filter(c => c.formation_complete)
  const enCours = enFormation.filter(c => !c.formation_complete)

  const envoyerAcces = (id) => {
    showToast(`Accès formation envoyé !`)
  }

  return (
    <div style={{ padding: '24px', paddingBottom: '100px', color: NOIR, background: CREME, minHeight: '100vh' }}>
      {loading && <div className="p-8 text-center text-zinc-400">Chargement...</div>}
      {toast && <div style={{ position: 'fixed', top: '20px', right: '20px', background: '#22c55e', color: '#fff', padding: '10px 18px', borderRadius: '8px', zIndex: 999, fontSize: '14px' }}>{toast}</div>}

      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ color: OR, fontSize: '22px', fontWeight: '700', margin: '0 0 4px' }}>Formation</h1>
        <p style={{ color: MUTED, margin: 0, fontSize: '13px' }}>Programme de certification Kadio</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '24px' }}>
        <div style={{ background: CARD, border: `1px solid ${BORDER_OR}`, borderRadius: '10px', padding: '14px', textAlign: 'center' }}>
          <p style={{ color: OR, fontSize: '26px', fontWeight: '700', margin: '0 0 4px' }}>{enFormation.length}</p>
          <p style={{ color: MUTED, fontSize: '11px', margin: 0 }}>En formation</p>
        </div>
        <div style={{ background: CARD, border: `1px solid ${BORDER_OR}`, borderRadius: '10px', padding: '14px', textAlign: 'center' }}>
          <p style={{ color: '#22c55e', fontSize: '26px', fontWeight: '700', margin: '0 0 4px' }}>{certifies.length}</p>
          <p style={{ color: MUTED, fontSize: '11px', margin: 0 }}>Certifiés</p>
        </div>
        <div style={{ background: CARD, border: `1px solid ${BORDER_OR}`, borderRadius: '10px', padding: '14px', textAlign: 'center' }}>
          <p style={{ color: '#f59e0b', fontSize: '26px', fontWeight: '700', margin: '0 0 4px' }}>{enCours.length}</p>
          <p style={{ color: MUTED, fontSize: '11px', margin: 0 }}>En cours</p>
        </div>
      </div>

      {/* Acceptés — en formation */}
      {enFormation.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ color: OR, fontSize: '16px', fontWeight: '600', margin: '0 0 12px' }}>Candidats acceptés</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {enFormation.map(c => (
              <div key={c.id} style={{ background: CARD, border: `1px solid ${BORDER_OR}`, borderRadius: '12px', padding: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: OR + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', color: OR, fontWeight: '700', fontSize: '14px', flexShrink: 0 }}>
                    {initiales(c.prenom, c.nom)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: '0 0 2px', fontWeight: '600', color: NOIR, fontSize: '14px' }}>{c.prenom} {c.nom}</p>
                    <p style={{ margin: 0, fontSize: '12px', color: MUTED }}>{c.ville} · {c.experience}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{
                      display: 'block', fontSize: '11px', padding: '2px 10px', borderRadius: '20px',
                      background: c.formation_complete ? '#22c55e22' : '#f59e0b22',
                      color: c.formation_complete ? '#22c55e' : '#f59e0b',
                      fontWeight: '600', marginBottom: '4px',
                    }}>
                      {c.formation_complete ? `✓ Certifié` : `En cours`}
                    </span>
                    {c.score_quiz && (
                      <p style={{ margin: 0, color: OR, fontSize: '13px', fontWeight: '700' }}>Score : {c.score_quiz}%</p>
                    )}
                  </div>
                </div>

                {/* Spécialités */}
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '10px' }}>
                  {c.specialites.map(s => (
                    <span key={s} style={{ background: OR + '15', color: OR, fontSize: '11px', padding: '2px 8px', borderRadius: '10px' }}>{s}</span>
                  ))}
                </div>

                {/* Barre progression */}
                <div style={{ marginBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ color: MUTED, fontSize: '11px' }}>Progression formation</span>
                    <span style={{ color: c.formation_complete ? '#22c55e' : '#f59e0b', fontSize: '11px', fontWeight: '600' }}>
                      {c.formation_complete ? '100%' : '40%'}
                    </span>
                  </div>
                  <div style={{ background: CREME, borderRadius: '4px', height: '6px', overflow: 'hidden' }}>
                    <div style={{ width: c.formation_complete ? '100%' : '40%', height: '100%', background: c.formation_complete ? '#22c55e' : '#f59e0b', borderRadius: '4px' }} />
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => { showToast(`Rappel envoyé à ${c.prenom}`) }}
                    style={{ flex: 1, padding: '8px', borderRadius: '7px', border: `1px solid ${BORDER_OR}`, background: 'none', color: MUTED, cursor: 'pointer', fontSize: '12px' }}
                  >Envoyer rappel</button>
                  {!c.formation_complete && (
                    <button
                      onClick={() => envoyerAcces(c.id)}
                      style={{ flex: 1, padding: '8px', borderRadius: '7px', border: 'none', background: OR, color: NOIR, fontWeight: '700', cursor: 'pointer', fontSize: '12px' }}
                    >Envoyer accès</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Toutes les candidatures */}
      <div>
        <h2 style={{ color: OR, fontSize: '16px', fontWeight: '600', margin: '0 0 12px' }}>Toutes les candidatures</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {candidats.map(c => (
            <div key={c.id} style={{ background: CARD, border: `1px solid ${BORDER_OR}`, borderRadius: '10px', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: OR + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', color: OR, fontWeight: '700', fontSize: '13px', flexShrink: 0 }}>
                {initiales(c.prenom, c.nom)}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: '0 0 2px', fontWeight: '600', color: NOIR, fontSize: '13px' }}>{c.prenom} {c.nom}</p>
                <p style={{ margin: 0, fontSize: '11px', color: MUTED }}>{c.ville} · {formatDate(c.date)}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ display: 'block', fontSize: '11px', padding: '2px 8px', borderRadius: '20px', background: statutColor(c.statut) + '22', color: statutColor(c.statut), fontWeight: '600', marginBottom: '4px' }}>
                  {STATUT_LABELS[c.statut]}
                </span>
                {c.statut === 'en_attente' && (
                  <button
                    onClick={() => { envoyerAcces(c.id); showToast(`Accès envoyé à ${c.prenom}`) }}
                    style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '6px', border: 'none', background: OR, color: NOIR, fontWeight: '600', cursor: 'pointer' }}
                  >Envoyer accès</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
