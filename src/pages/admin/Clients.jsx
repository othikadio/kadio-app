import { useState } from 'react'
import { OR, CREME, NOIR, CARD, MUTED, BORDER_OR, formatDate, statutColor, initiales } from '@/lib/utils'
import { useAllClients, useAllRdv } from '@/hooks'

export default function AdminClients() {
  const { data: clients = [], loading: loadingClients } = useAllClients()
  const { data: rdvReseau = [] } = useAllRdv()
  const [clientsState, setClients] = useState([])
  const [selected, setSelected] = useState(null)
  const [motif, setMotif] = useState('')
  const [voirRdv, setVoirRdv] = useState(false)
  const [toast, setToast] = useState('')

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500) }

  const updateClient = (id, changes) => {
    setClients(prev => prev.map(c => c.id === id ? { ...c, ...changes } : c))
    if (selected?.id === id) setSelected(prev => ({ ...prev, ...changes }))
  }

  const clientList = clients.length > 0 ? clients : clientsState
  const client = selected ? clientList.find(c => c.id === selected.id) : null
  const rdvClient = client
    ? (rdvReseau || []).filter(r => r.client?.toLowerCase().includes(client.prenom?.toLowerCase() || ''))
    : []

  if (client) {
    return (
      <div style={{ padding: '24px', paddingBottom: '100px', color: NOIR, background: CREME, minHeight: '100vh' }}>
        {toast && <div style={{ position: 'fixed', top: '20px', right: '20px', background: '#22c55e', color: '#fff', padding: '10px 18px', borderRadius: '8px', zIndex: 999, fontSize: '14px' }}>{toast}</div>}
        <button onClick={() => { setSelected(null); setVoirRdv(false); setMotif('') }} style={{ background: 'none', border: `1px solid ${BORDER_OR}`, color: MUTED, cursor: 'pointer', padding: '8px 14px', borderRadius: '8px', marginBottom: '20px', fontSize: '13px' }}>{`← Retour`}</button>

        <div style={{ background: CARD, border: `1px solid ${BORDER_OR}`, borderRadius: '14px', padding: '20px', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: OR + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', color: OR, fontWeight: '700', fontSize: '18px' }}>
              {initiales(client.prenom, client.nom)}
            </div>
            <div>
              <h2 style={{ margin: '0 0 4px', color: NOIR, fontSize: '18px', fontWeight: '700' }}>{client.prenom} {client.nom}</h2>
              <div style={{ display: 'flex', gap: '6px' }}>
                <span style={{ fontSize: '12px', padding: '2px 10px', borderRadius: '20px', background: statutColor(client.statut) + '22', color: statutColor(client.statut), fontWeight: '600' }}>{client.statut}</span>
                {client.abonne && <span style={{ fontSize: '12px', padding: '2px 10px', borderRadius: '20px', background: OR + '22', color: OR, fontWeight: '600' }}>Abonné</span>}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
            {[
              ['Téléphone', client.telephone],
              ['Email', client.email],
              ['Ville', client.ville],
              ['Inscription', formatDate(client.date_inscription)],
              ['Dernier RDV', formatDate(client.dernier_rdv)],
              ['No-shows', client.no_shows],
              ['RDV total', client.rdv_total],
              ['Plan', client.plan || '—'],
              ['Crédits parrainage', client.credits_parrainage],
            ].map(([label, val]) => (
              <div key={label}>
                <p style={{ color: MUTED, fontSize: '11px', margin: '0 0 2px', textTransform: 'uppercase' }}>{label}</p>
                <p style={{ color: NOIR, fontSize: '13px', margin: 0 }}>{val}</p>
              </div>
            ))}
          </div>

          {client.statut === 'bloque' && client.motif_blocage && (
            <div style={{ background: '#ef444422', border: '1px solid #ef4444', borderRadius: '8px', padding: '10px 12px', marginBottom: '14px', fontSize: '13px', color: '#ef4444' }}>
              <strong>Motif blocage :</strong> {client.motif_blocage}
            </div>
          )}

          {/* Actions */}
          {client.statut !== 'bloque' ? (
            <div>
              <p style={{ color: MUTED, fontSize: '12px', margin: '0 0 6px' }}>Motif de blocage (obligatoire)</p>
              <textarea
                value={motif}
                onChange={e => setMotif(e.target.value)}
                placeholder={`Raison du blocage...`}
                style={{ width: '100%', minHeight: '60px', background: CREME, border: `1px solid ${BORDER_OR}`, borderRadius: '8px', color: NOIR, padding: '10px', fontSize: '13px', resize: 'vertical', boxSizing: 'border-box', marginBottom: '8px' }}
              />
              <button
                onClick={() => {
                  if (!motif.trim()) { showToast('Motif requis'); return }
                  updateClient(client.id, { statut: 'bloque', motif_blocage: motif })
                  showToast(`${client.prenom} bloqué`)
                  setMotif('')
                }}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: 'none', background: '#ef4444', color: '#fff', fontWeight: '600', cursor: 'pointer', fontSize: '13px' }}
              >Bloquer le client</button>
            </div>
          ) : (
            <button
              onClick={() => { updateClient(client.id, { statut: 'actif', motif_blocage: null }); showToast(`${client.prenom} débloqué`) }}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: 'none', background: '#22c55e', color: '#fff', fontWeight: '600', cursor: 'pointer', fontSize: '13px' }}
            >Débloquer le client</button>
          )}
        </div>

        {/* Historique RDV */}
        <div>
          <button
            onClick={() => setVoirRdv(!voirRdv)}
            style={{ width: '100%', padding: '12px', borderRadius: '10px', border: `1px solid ${BORDER_OR}`, background: CARD, color: OR, fontWeight: '600', cursor: 'pointer', fontSize: '13px' }}
          >
            {voirRdv ? `▲ Masquer l'historique RDV` : `▼ Voir historique RDV`}
          </button>
          {voirRdv && (
            <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {rdvClient.length === 0 ? (
                <p style={{ color: MUTED, fontSize: '13px', textAlign: 'center', padding: '20px 0' }}>Aucun RDV trouvé</p>
              ) : rdvClient.map(r => (
                <div key={r.id} style={{ background: CARD, border: `1px solid ${BORDER_OR}`, borderRadius: '8px', padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: '0 0 2px', fontSize: '13px', color: NOIR, fontWeight: '600' }}>{r.service}</p>
                    <p style={{ margin: 0, fontSize: '11px', color: MUTED }}>{r.date} · {r.heure} · {r.coiffeur}</p>
                  </div>
                  <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '20px', background: statutColor(r.statut) + '22', color: statutColor(r.statut), fontWeight: '600' }}>{r.statut}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '24px', paddingBottom: '100px', color: NOIR, background: CREME, minHeight: '100vh' }}>
      {toast && <div style={{ position: 'fixed', top: '20px', right: '20px', background: '#22c55e', color: '#fff', padding: '10px 18px', borderRadius: '8px', zIndex: 999, fontSize: '14px' }}>{toast}</div>}

      {loadingClients && <div className="p-8 text-center text-zinc-400">Chargement...</div>}
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ color: OR, fontSize: '22px', fontWeight: '700', margin: '0 0 4px' }}>Clients</h1>
        <p style={{ color: MUTED, margin: 0, fontSize: '13px' }}>{clientList.length} clients · {clientList.filter(c => c.abonne).length} abonnés</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {clientList.map(c => (
          <div
            key={c.id}
            onClick={() => setSelected(c)}
            style={{ background: CARD, border: `1px solid ${c.statut === 'bloque' ? '#ef4444' : BORDER_OR}`, borderRadius: '12px', padding: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}
          >
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: OR + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', color: OR, fontWeight: '700', fontSize: '14px', flexShrink: 0 }}>
              {initiales(c.prenom, c.nom)}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: '0 0 2px', fontWeight: '600', color: NOIR, fontSize: '14px' }}>{c.prenom} {c.nom}</p>
              <p style={{ margin: 0, fontSize: '12px', color: MUTED }}>{c.ville} · {c.rdv_total} RDV</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ display: 'flex', gap: '4px', justifyContent: 'flex-end', marginBottom: '4px' }}>
                {c.abonne && <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '10px', background: OR + '22', color: OR, fontWeight: '600' }}>Abonné</span>}
                <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '10px', background: statutColor(c.statut) + '22', color: statutColor(c.statut), fontWeight: '600' }}>{c.statut}</span>
              </div>
              {c.no_shows > 0 && (
                <p style={{ margin: 0, fontSize: '11px', color: '#ef4444' }}>{c.no_shows} no-show{c.no_shows > 1 ? 's' : ''}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
