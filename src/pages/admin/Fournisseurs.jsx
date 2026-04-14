import { useState } from 'react'
import { OR, CREME, NOIR, CARD, MUTED, BORDER_OR, formatMontant, formatDate, statutColor } from '@/lib/utils'
import { useAllProduits, useCommandesFournisseur } from '@/hooks'
import { MOCK_FOURNISSEUR_JEAN, STATUTS_COMMANDE } from '@/data/mockFournisseur'

export default function AdminFournisseurs() {
  const { data: produits = [] } = useAllProduits()
  const { data: commandesData = [] } = useCommandesFournisseur()
  const [fournisseurs, setFournisseurs] = useState([MOCK_FOURNISSEUR_JEAN])
  const [commandes, setCommandes] = useState(commandesData.length > 0 ? commandesData : [])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ nom_entreprise: '', contact: '', tel: '', email: '' })
  const [toast, setToast] = useState('')

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500) }

  const toggleActif = (id) => {
    setFournisseurs(prev => prev.map(f => f.id === id ? { ...f, actif: !f.actif } : f))
    showToast('Statut mis à jour')
  }

  const addFournisseur = () => {
    if (!form.nom_entreprise) return
    setFournisseurs(prev => [...prev, { id: `four-${Date.now()}`, ...form, actif: true }])
    setForm({ nom_entreprise: '', contact: '', tel: '', email: '' })
    setShowForm(false)
    showToast('Fournisseur ajouté !')
  }

  const avancerStatut = (cmdId) => {
    setCommandes(prev => prev.map(cmd => {
      if (cmd.id !== cmdId) return cmd
      const s = STATUTS_COMMANDE.find(s => s.val === cmd.statut)
      if (!s?.next) return cmd
      return { ...cmd, statut: s.next }
    }))
    showToast('Statut commande mis à jour !')
  }

  return (
    <div style={{ padding: '24px', paddingBottom: '100px', color: NOIR, background: CREME, minHeight: '100vh' }}>
      {toast && <div style={{ position: 'fixed', top: '20px', right: '20px', background: '#22c55e', color: '#fff', padding: '10px 18px', borderRadius: '8px', zIndex: 999, fontSize: '14px' }}>{toast}</div>}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h1 style={{ color: OR, fontSize: '22px', fontWeight: '700', margin: '0 0 4px' }}>Fournisseurs</h1>
          <p style={{ color: MUTED, margin: 0, fontSize: '13px' }}>{fournisseurs.length} fournisseur{fournisseurs.length > 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: OR, color: NOIR, fontWeight: '700', cursor: 'pointer', fontSize: '13px' }}
        >{`+ Ajouter`}</button>
      </div>

      {/* Formulaire */}
      {showForm && (
        <div style={{ background: CARD, border: `1px solid ${OR}44`, borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
          <h3 style={{ color: OR, fontSize: '14px', margin: '0 0 12px' }}>Nouveau fournisseur</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
            {[['nom_entreprise', 'Nom entreprise *'], ['contact', 'Contact'], ['tel', 'Téléphone'], ['email', 'Email']].map(([key, label]) => (
              <input key={key} placeholder={label} value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                style={{ background: CREME, border: `1px solid ${BORDER_OR}`, borderRadius: '8px', color: NOIR, padding: '10px', fontSize: '13px' }} />
            ))}
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => setShowForm(false)} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: `1px solid ${BORDER_OR}`, background: 'none', color: MUTED, cursor: 'pointer', fontSize: '13px' }}>Annuler</button>
            <button onClick={addFournisseur} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: OR, color: NOIR, fontWeight: '700', cursor: 'pointer', fontSize: '13px' }}>Ajouter</button>
          </div>
        </div>
      )}

      {/* Liste fournisseurs */}
      {fournisseurs.map(f => (
        <div key={f.id} style={{ background: CARD, border: `1px solid ${BORDER_OR}`, borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div>
              <h2 style={{ color: NOIR, fontSize: '16px', fontWeight: '700', margin: '0 0 4px' }}>{f.nom_entreprise}</h2>
              {f.contact_prenom && <p style={{ color: MUTED, fontSize: '12px', margin: '0 0 2px' }}>{f.contact_prenom} {f.contact_nom} · {f.telephone}</p>}
              <p style={{ color: MUTED, fontSize: '12px', margin: 0 }}>{f.email}</p>
            </div>
            <div style={{ display: 'flex', flex: '0 0 auto', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '12px', padding: '2px 10px', borderRadius: '20px', background: f.actif ? '#22c55e22' : '#ef444422', color: f.actif ? '#22c55e' : '#ef4444', fontWeight: '600' }}>
                {f.actif ? 'Actif' : 'Inactif'}
              </span>
              <button onClick={() => toggleActif(f.id)} style={{ padding: '6px 12px', borderRadius: '6px', border: `1px solid ${BORDER_OR}`, background: 'none', color: MUTED, cursor: 'pointer', fontSize: '12px' }}>
                {f.actif ? 'Désactiver' : 'Activer'}
              </button>
            </div>
          </div>

          {/* Catalogue produits */}
          <div style={{ marginBottom: '14px' }}>
            <p style={{ color: MUTED, fontSize: '11px', margin: '0 0 8px', textTransform: 'uppercase' }}>Catalogue ({(produits || []).length} produits)</p>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                <thead>
                  <tr>
                    {['Produit', 'Cat.', 'Prix', 'Stock', 'Marge Kadio'].map(h => (
                      <th key={h} style={{ color: MUTED, fontWeight: '600', textAlign: 'left', padding: '6px 8px', borderBottom: `1px solid ${BORDER_OR}` }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {MOCK_PRODUITS_JEAN.map(p => (
                    <tr key={p.id} style={{ opacity: p.actif ? 1 : 0.5 }}>
                      <td style={{ color: NOIR, padding: '8px', borderBottom: `1px solid ${BORDER_OR}20` }}>{p.nom}</td>
                      <td style={{ color: MUTED, padding: '8px', borderBottom: `1px solid ${BORDER_OR}20` }}>{p.cat}</td>
                      <td style={{ color: OR, padding: '8px', borderBottom: `1px solid ${BORDER_OR}20` }}>{formatMontant(p.prix)}</td>
                      <td style={{ color: p.stock === 0 ? '#ef4444' : MUTED, padding: '8px', borderBottom: `1px solid ${BORDER_OR}20` }}>{p.stock === 0 ? 'Épuisé' : p.stock}</td>
                      <td style={{ color: '#22c55e', padding: '8px', borderBottom: `1px solid ${BORDER_OR}20` }}>{formatMontant(p.prix * 0.10)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ))}

      {/* Commandes réseau */}
      <div>
        <h2 style={{ color: OR, fontSize: '16px', fontWeight: '600', margin: '0 0 12px' }}>Commandes réseau</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {commandes.map(cmd => {
            const s = STATUTS_COMMANDE.find(st => st.val === cmd.statut)
            return (
              <div key={cmd.id} style={{ background: CARD, border: `1px solid ${BORDER_OR}`, borderRadius: '12px', padding: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div>
                    <p style={{ margin: '0 0 2px', fontWeight: '600', color: NOIR, fontSize: '13px' }}>{cmd.numero}</p>
                    <p style={{ margin: 0, fontSize: '12px', color: MUTED }}>{cmd.partenaire.prenom} {cmd.partenaire.nom} · {formatDate(cmd.date)}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ display: 'block', fontSize: '11px', padding: '2px 8px', borderRadius: '20px', background: (s?.color || '#6b7280') + '22', color: s?.color || '#6b7280', fontWeight: '600', marginBottom: '4px' }}>
                      {s?.label || cmd.statut}
                    </span>
                    <p style={{ margin: 0, color: OR, fontWeight: '700', fontSize: '13px' }}>{formatMontant(cmd.total)}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '10px' }}>
                  {cmd.articles.map((a, i) => (
                    <span key={i} style={{ background: CREME, color: MUTED, fontSize: '11px', padding: '3px 8px', borderRadius: '6px' }}>{a.qte}× {a.nom}</span>
                  ))}
                </div>
                {s?.next && (
                  <button
                    onClick={() => avancerStatut(cmd.id)}
                    style={{ padding: '7px 14px', borderRadius: '7px', border: 'none', background: s.color, color: '#fff', fontWeight: '600', cursor: 'pointer', fontSize: '12px' }}
                  >
                    {s.nextLabel}
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
