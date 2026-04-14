import { useState } from 'react'
import { OR, CREME, NOIR, CARD, MUTED, BORDER_OR, formatDate, statutColor, initiales } from '@/lib/utils'
import { useAllCandidatures } from '@/hooks'

const FILTRES = ['Tous', 'accepte', 'en_attente', 'en_revision', 'refusee']
const STATUT_LABELS = { accepte: 'Accepté', en_attente: 'En attente', en_revision: 'En révision', refusee: 'Refusée' }

export default function AdminCandidats() {
  const { data: candidaturesData = [], loading } = useAllCandidatures()
  const [candidats, setCandidats] = useState(candidaturesData)
  const [filtre, setFiltre] = useState('Tous')
  const [selected, setSelected] = useState(null)
  const [message, setMessage] = useState('')
  const [toast, setToast] = useState('')

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  const updateStatut = (id, statut) => {
    setCandidats(prev => prev.map(c => c.id === id ? { ...c, statut } : c))
    if (selected?.id === id) setSelected(prev => ({ ...prev, statut }))
    showToast(`Statut mis à jour : ${STATUT_LABELS[statut]}`)
  }

  const filtered = filtre === 'Tous' ? candidats : candidats.filter(c => c.statut === filtre)
  const candidat = selected ? candidats.find(c => c.id === selected.id) : null

  if (candidat) {
    return (
      <div style={{ padding: '24px', paddingBottom: '100px', color: NOIR, background: CREME, minHeight: '100vh' }}>
        {toast && (
          <div style={{ position: 'fixed', top: '20px', right: '20px', background: '#22c55e', color: '#fff', padding: '10px 18px', borderRadius: '8px', zIndex: 999, fontSize: '14px' }}>{toast}</div>
        )}
        <button onClick={() => setSelected(null)} style={{ background: 'none', border: `1px solid ${BORDER_OR}`, color: MUTED, cursor: 'pointer', padding: '8px 14px', borderRadius: '8px', marginBottom: '20px', fontSize: '13px' }}>
          {`← Retour`}
        </button>

        <div style={{ background: CARD, border: `1px solid ${BORDER_OR}`, borderRadius: '14px', padding: '20px', marginBottom: '16px' }}>
          {/* Avatar + nom */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: OR + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', color: OR, fontWeight: '700', fontSize: '18px' }}>
              {initiales(candidat.prenom, candidat.nom)}
            </div>
            <div>
              <h2 style={{ margin: '0 0 4px', color: NOIR, fontSize: '18px', fontWeight: '700' }}>{candidat.prenom} {candidat.nom}</h2>
              <span style={{ fontSize: '12px', padding: '2px 10px', borderRadius: '20px', background: statutColor(candidat.statut) + '22', color: statutColor(candidat.statut), fontWeight: '600' }}>
                {STATUT_LABELS[candidat.statut]}
              </span>
            </div>
          </div>

          {/* Infos */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
            {[
              ['Téléphone', candidat.telephone],
              ['Email', candidat.email],
              ['Ville', candidat.ville],
              ['Expérience', candidat.experience],
              ['Date candidature', formatDate(candidat.date)],
            ].map(([label, val]) => (
              <div key={label}>
                <p style={{ color: MUTED, fontSize: '11px', margin: '0 0 2px', textTransform: 'uppercase' }}>{label}</p>
                <p style={{ color: NOIR, fontSize: '13px', margin: 0 }}>{val}</p>
              </div>
            ))}
          </div>

          {/* Spécialités */}
          <div style={{ marginBottom: '16px' }}>
            <p style={{ color: MUTED, fontSize: '11px', margin: '0 0 6px', textTransform: 'uppercase' }}>Spécialités</p>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {candidat.specialites.map(s => (
                <span key={s} style={{ background: OR + '22', color: OR, fontSize: '12px', padding: '3px 10px', borderRadius: '20px' }}>{s}</span>
              ))}
            </div>
          </div>

          {/* Motivation */}
          <div style={{ marginBottom: '16px' }}>
            <p style={{ color: MUTED, fontSize: '11px', margin: '0 0 6px', textTransform: 'uppercase' }}>Motivation</p>
            <blockquote style={{ margin: 0, padding: '12px 14px', background: CREME, borderRadius: '8px', borderLeft: `3px solid ${OR}`, color: NOIR, fontSize: '13px', lineHeight: '1.6' }}>
              {candidat.motivation}
            </blockquote>
          </div>

          {/* Formation */}
          {candidat.statut === 'accepte' && (
            <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
              <div style={{ background: CREME, borderRadius: '8px', padding: '10px 14px', flex: 1 }}>
                <p style={{ color: MUTED, fontSize: '11px', margin: '0 0 4px' }}>Formation</p>
                <p style={{ color: candidat.formation_complete ? '#22c55e' : '#f59e0b', fontSize: '13px', fontWeight: '600', margin: 0 }}>
                  {candidat.formation_complete ? `✓ Complétée` : `En cours`}
                </p>
              </div>
              {candidat.score_quiz && (
                <div style={{ background: CREME, borderRadius: '8px', padding: '10px 14px', flex: 1 }}>
                  <p style={{ color: MUTED, fontSize: '11px', margin: '0 0 4px' }}>Score quiz</p>
                  <p style={{ color: OR, fontSize: '18px', fontWeight: '700', margin: 0 }}>{candidat.score_quiz}%</p>
                </div>
              )}
            </div>
          )}

          {/* Actions statut */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => updateStatut(candidat.id, 'accepte')}
              disabled={candidat.statut === 'accepte'}
              style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: candidat.statut === 'accepte' ? '#22c55e44' : '#22c55e', color: '#fff', fontWeight: '600', cursor: candidat.statut === 'accepte' ? 'default' : 'pointer', fontSize: '13px' }}
            >
              {`✓ Accepter`}
            </button>
            <button
              onClick={() => updateStatut(candidat.id, 'en_attente')}
              disabled={candidat.statut === 'en_attente'}
              style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: candidat.statut === 'en_attente' ? '#f59e0b44' : '#f59e0b', color: '#fff', fontWeight: '600', cursor: candidat.statut === 'en_attente' ? 'default' : 'pointer', fontSize: '13px' }}
            >
              {`⏳ Attente`}
            </button>
            <button
              onClick={() => updateStatut(candidat.id, 'refusee')}
              disabled={candidat.statut === 'refusee'}
              style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: candidat.statut === 'refusee' ? '#ef444444' : '#ef4444', color: '#fff', fontWeight: '600', cursor: candidat.statut === 'refusee' ? 'default' : 'pointer', fontSize: '13px' }}
            >
              {`✕ Refuser`}
            </button>
          </div>
        </div>

        {/* Envoyer SMS */}
        <div style={{ background: CARD, border: `1px solid ${BORDER_OR}`, borderRadius: '12px', padding: '16px' }}>
          <p style={{ color: OR, fontWeight: '600', fontSize: '14px', margin: '0 0 10px' }}>{`📱 Message au candidat`}</p>
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder={`Écrire un message à ${candidat.prenom}...`}
            style={{ width: '100%', minHeight: '80px', background: CREME, border: `1px solid ${BORDER_OR}`, borderRadius: '8px', color: NOIR, padding: '10px', fontSize: '13px', resize: 'vertical', boxSizing: 'border-box' }}
          />
          <button
            onClick={() => { showToast(`SMS envoyé à ${candidat.prenom} !`); setMessage('') }}
            style={{ marginTop: '10px', width: '100%', padding: '10px', background: OR, color: NOIR, fontWeight: '700', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}
          >
            {`Envoyer SMS`}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '24px', paddingBottom: '100px', color: NOIR, background: CREME, minHeight: '100vh' }}>
      {loading && <div className="p-8 text-center text-zinc-400">Chargement...</div>}
      {toast && (
        <div style={{ position: 'fixed', top: '20px', right: '20px', background: '#22c55e', color: '#fff', padding: '10px 18px', borderRadius: '8px', zIndex: 999, fontSize: '14px' }}>{toast}</div>
      )}

      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ color: OR, fontSize: '22px', fontWeight: '700', margin: '0 0 4px' }}>{`Candidatures`}</h1>
        <p style={{ color: MUTED, margin: 0, fontSize: '13px' }}>{candidats.length} candidature{candidats.length > 1 ? 's' : ''} au total</p>
      </div>

      {/* Filtres */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
        {FILTRES.map(f => (
          <button
            key={f}
            onClick={() => setFiltre(f)}
            style={{
              padding: '6px 14px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: '600',
              background: filtre === f ? OR : CARD,
              color: filtre === f ? NOIR : MUTED,
            }}
          >
            {f === 'Tous' ? 'Tous' : STATUT_LABELS[f]}
          </button>
        ))}
      </div>

      {/* Liste */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filtered.map(c => (
          <div
            key={c.id}
            onClick={() => setSelected(c)}
            style={{
              background: CARD, border: `1px solid ${BORDER_OR}`, borderRadius: '12px',
              padding: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px',
            }}
          >
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: OR + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', color: OR, fontWeight: '700', fontSize: '14px', flexShrink: 0 }}>
              {initiales(c.prenom, c.nom)}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: '0 0 4px', fontWeight: '600', color: NOIR, fontSize: '14px' }}>{c.prenom} {c.nom}</p>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '11px', color: MUTED }}>{c.ville} · {c.experience}</span>
              </div>
              <div style={{ display: 'flex', gap: '4px', marginTop: '4px', flexWrap: 'wrap' }}>
                {c.specialites.map(s => (
                  <span key={s} style={{ background: OR + '15', color: OR, fontSize: '11px', padding: '1px 6px', borderRadius: '10px' }}>{s}</span>
                ))}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ display: 'inline-block', fontSize: '11px', padding: '3px 10px', borderRadius: '20px', background: statutColor(c.statut) + '22', color: statutColor(c.statut), fontWeight: '600' }}>
                {STATUT_LABELS[c.statut]}
              </span>
              <p style={{ margin: '4px 0 0', fontSize: '11px', color: MUTED }}>{formatDate(c.date)}</p>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p style={{ color: MUTED, textAlign: 'center', padding: '40px 0' }}>Aucune candidature pour ce filtre.</p>
        )}
      </div>
    </div>
  )
}
