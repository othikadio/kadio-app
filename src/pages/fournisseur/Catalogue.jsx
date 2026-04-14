import { useState, useEffect } from 'react'
import React from 'react'
import { OR, CREME, NOIR, CARD, MUTED, BORDER_OR, formatMontant } from '@/lib/utils'
import { useProduitsFournisseur } from '@/hooks'
import { CATS_FOURNISSEUR } from '@/data/mockFournisseur'

const CAT_ICONS = {
  'Mèches':       '🧵',
  'Produits':     '🧴',
  'Accessoires':  '🪮',
  'Équipements':  '🧥',
}

const FORM_INIT = { nom: '', description: '', cat: 'Mèches', prix: '', stock: '', actif: true }

export default function FournisseurCatalogue() {
  const { data: produitsFetch, loading } = useProduitsFournisseur('four-jean')
  const [produits, setProduits] = useState(produitsFetch || [])
  const [filtre, setFiltre]     = useState('Tous')
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId]     = useState(null)
  const [form, setForm]         = useState(FORM_INIT)
  const [success, setSuccess]   = useState('')

  // Sync fetched data with local state
  React.useEffect(() => {
    if (produitsFetch) setProduits(produitsFetch)
  }, [produitsFetch])

  const filtered = filtre === 'Tous' ? produits : produits.filter(p => p.cat === filtre)

  if (loading) return <div style={{ padding: '24px', paddingBottom: '100px', color: NOIR, background: CREME, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ textAlign: 'center', color: MUTED }}>Chargement...</div>
  </div>

  const openAdd = () => {
    setEditId(null)
    setForm(FORM_INIT)
    setShowForm(true)
  }

  const openEdit = (p) => {
    setEditId(p.id)
    setForm({ nom: p.nom, description: p.description || '', cat: p.cat, prix: String(p.prix), stock: String(p.stock), actif: p.actif })
    setShowForm(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.nom.trim() || !form.prix) return
    if (editId) {
      setProduits(ps => ps.map(p => p.id === editId
        ? { ...p, nom: form.nom, description: form.description, cat: form.cat, prix: parseFloat(form.prix), stock: parseInt(form.stock) || 0, actif: form.actif }
        : p
      ))
      setSuccess('Produit modifié.')
    } else {
      const newId = 'fp' + Date.now()
      setProduits(ps => [...ps, { id: newId, nom: form.nom, description: form.description, cat: form.cat, prix: parseFloat(form.prix), stock: parseInt(form.stock) || 0, actif: form.actif }])
      setSuccess('Produit ajouté.')
    }
    setShowForm(false)
    setEditId(null)
    setForm(FORM_INIT)
    setTimeout(() => setSuccess(''), 3000)
  }

  const toggleActif = (id) => {
    setProduits(ps => ps.map(p => p.id === id ? { ...p, actif: !p.actif } : p))
  }

  return (
    <div style={{ padding: '24px', paddingBottom: '100px', color: NOIR, background: CREME, minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ color: OR, margin: 0, fontSize: '20px' }}>Catalogue produits</h2>
          <p style={{ color: MUTED, margin: '4px 0 0', fontSize: '13px' }}>{produits.filter(p => p.actif).length} actifs · {produits.length} total</p>
        </div>
        <button onClick={openAdd} style={{ background: OR, color: NOIR, border: 'none', borderRadius: '8px', padding: '10px 16px', fontWeight: 700, cursor: 'pointer', fontSize: '13px' }}>
          + Ajouter
        </button>
      </div>

      {/* Success */}
      {success && (
        <div style={{ background: '#14532d', border: '1px solid #22c55e', borderRadius: '8px', padding: '10px 16px', marginBottom: '16px', color: '#86efac', fontSize: '14px' }}>
          {success}
        </div>
      )}

      {/* Filtres */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
        {CATS_FOURNISSEUR.map(cat => (
          <button key={cat} onClick={() => setFiltre(cat)} style={{
            background: filtre === cat ? OR : CARD,
            color: filtre === cat ? NOIR : CREME,
            border: `1px solid ${filtre === cat ? OR : BORDER_OR}`,
            borderRadius: '20px', padding: '6px 14px', cursor: 'pointer', fontSize: '13px', fontWeight: filtre === cat ? 700 : 400,
          }}>
            {cat}
          </button>
        ))}
      </div>

      {/* Formulaire */}
      {showForm && (
        <div style={{ background: CARD, border: `1px solid ${BORDER_OR}`, borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
          <h3 style={{ color: OR, margin: '0 0 16px', fontSize: '16px' }}>{editId ? 'Modifier le produit' : 'Nouveau produit'}</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ color: MUTED, fontSize: '12px', display: 'block', marginBottom: '4px' }}>Nom *</label>
                <input value={form.nom} onChange={e => setForm(f => ({ ...f, nom: e.target.value }))} required
                  style={{ width: '100%', background: '#0f0c09', border: `1px solid ${BORDER_OR}`, borderRadius: '8px', padding: '10px 12px', color: NOIR, fontSize: '14px', boxSizing: 'border-box' }} />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ color: MUTED, fontSize: '12px', display: 'block', marginBottom: '4px' }}>Description</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2}
                  style={{ width: '100%', background: '#0f0c09', border: `1px solid ${BORDER_OR}`, borderRadius: '8px', padding: '10px 12px', color: NOIR, fontSize: '14px', boxSizing: 'border-box', resize: 'vertical' }} />
              </div>

              <div>
                <label style={{ color: MUTED, fontSize: '12px', display: 'block', marginBottom: '4px' }}>Catégorie</label>
                <select value={form.cat} onChange={e => setForm(f => ({ ...f, cat: e.target.value }))}
                  style={{ width: '100%', background: '#0f0c09', border: `1px solid ${BORDER_OR}`, borderRadius: '8px', padding: '10px 12px', color: NOIR, fontSize: '14px' }}>
                  {CATS_FOURNISSEUR.filter(c => c !== 'Tous').map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label style={{ color: MUTED, fontSize: '12px', display: 'block', marginBottom: '4px' }}>Prix ($) *</label>
                <input type="number" step="0.01" min="0" value={form.prix} onChange={e => setForm(f => ({ ...f, prix: e.target.value }))} required
                  style={{ width: '100%', background: '#0f0c09', border: `1px solid ${BORDER_OR}`, borderRadius: '8px', padding: '10px 12px', color: NOIR, fontSize: '14px', boxSizing: 'border-box' }} />
              </div>

              <div>
                <label style={{ color: MUTED, fontSize: '12px', display: 'block', marginBottom: '4px' }}>Stock</label>
                <input type="number" min="0" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))}
                  style={{ width: '100%', background: '#0f0c09', border: `1px solid ${BORDER_OR}`, borderRadius: '8px', padding: '10px 12px', color: NOIR, fontSize: '14px', boxSizing: 'border-box' }} />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <label style={{ color: MUTED, fontSize: '12px' }}>Actif</label>
                <button type="button" onClick={() => setForm(f => ({ ...f, actif: !f.actif }))}
                  style={{ background: form.actif ? '#14532d' : '#1f1f1f', border: `1px solid ${form.actif ? '#22c55e' : '#6b7280'}`, borderRadius: '20px', padding: '6px 14px', color: form.actif ? '#86efac' : '#9ca3af', cursor: 'pointer', fontSize: '13px' }}>
                  {form.actif ? 'Actif' : 'Inactif'}
                </button>
              </div>

            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
              <button type="submit" style={{ background: OR, color: NOIR, border: 'none', borderRadius: '8px', padding: '10px 20px', fontWeight: 700, cursor: 'pointer', fontSize: '14px' }}>
                {editId ? 'Enregistrer' : 'Ajouter'}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setEditId(null) }}
                style={{ background: 'transparent', color: MUTED, border: `1px solid ${BORDER_OR}`, borderRadius: '8px', padding: '10px 20px', cursor: 'pointer', fontSize: '14px' }}>
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Liste produits */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filtered.length === 0 && (
          <p style={{ color: MUTED, textAlign: 'center', padding: '40px 0' }}>Aucun produit dans cette catégorie.</p>
        )}
        {filtered.map(p => (
          <div key={p.id} style={{ background: CARD, border: `1px solid ${BORDER_OR}`, borderRadius: '12px', padding: '16px', opacity: p.actif ? 1 : 0.55, display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
            <div style={{ fontSize: '28px', flexShrink: 0 }}>{CAT_ICONS[p.cat] || '📦'}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                <div>
                  <p style={{ margin: '0 0 4px', fontWeight: 600, fontSize: '15px', color: NOIR }}>{p.nom}</p>
                  <span style={{ background: '#F5F0E8', border: `1px solid ${BORDER_OR}`, borderRadius: '10px', padding: '2px 8px', fontSize: '11px', color: OR }}>{p.cat}</span>
                </div>
                <p style={{ margin: 0, color: OR, fontWeight: 700, fontSize: '16px', flexShrink: 0 }}>{formatMontant(p.prix)}</p>
              </div>
              {p.description && <p style={{ margin: '8px 0 0', color: MUTED, fontSize: '13px', lineHeight: '1.5' }}>{p.description}</p>}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                <span style={{ color: p.stock === 0 ? '#ef4444' : '#9ca3af', fontSize: '13px' }}>
                  {p.stock === 0 ? 'Rupture de stock' : `Stock : ${p.stock}`}
                </span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => toggleActif(p.id)}
                    style={{ background: p.actif ? '#14532d' : '#1f1f1f', border: `1px solid ${p.actif ? '#22c55e' : '#6b7280'}`, borderRadius: '16px', padding: '4px 12px', color: p.actif ? '#86efac' : '#9ca3af', cursor: 'pointer', fontSize: '12px' }}>
                    {p.actif ? 'Actif' : 'Inactif'}
                  </button>
                  <button onClick={() => openEdit(p)}
                    style={{ background: 'transparent', border: `1px solid ${BORDER_OR}`, borderRadius: '16px', padding: '4px 12px', color: OR, cursor: 'pointer', fontSize: '12px' }}>
                    Modifier
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
