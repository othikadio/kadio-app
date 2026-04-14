import { useState } from 'react'
import { OR, CREME, NOIR, CARD, MUTED, BORDER_OR, formatMontant } from '@/lib/utils'
import { useAllServices } from '@/hooks'

const CATS = ['Tous', 'Tresses', 'Locs', 'Barbier', 'Enfants', 'Tissage', 'Soins']

export default function AdminServices() {
  const { data: servicesData = [], loading } = useAllServices()
  const [services, setServices] = useState(servicesData.length > 0 ? servicesData : [])
  const [catFiltre, setCatFiltre] = useState('Tous')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ nom: '', cat: 'Tresses', salon: '', domicile: '', deplacement: '' })
  const [editId, setEditId] = useState(null)
  const [toast, setToast] = useState('')

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500) }

  const filtered = catFiltre === 'Tous' ? services : services.filter(s => s.cat === catFiltre)

  const updateService = (id, key, value) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, [key]: value } : s))
  }

  const addService = () => {
    if (!form.nom) return
    setServices(prev => [...prev, { ...form, id: Date.now(), salon: Number(form.salon), domicile: Number(form.domicile), deplacement: Number(form.deplacement) }])
    setForm({ nom: '', cat: 'Tresses', salon: '', domicile: '', deplacement: '' })
    setShowForm(false)
    showToast('Service ajouté !')
  }

  const priceInput = (id, key, value) => (
    <input
      type="number"
      value={value}
      onChange={e => updateService(id, key, Number(e.target.value))}
      style={{ width: '60px', background: CREME, border: `1px solid ${BORDER_OR}`, borderRadius: '6px', color: OR, padding: '5px 6px', fontSize: '12px', textAlign: 'center' }}
    />
  )

  return (
    <div style={{ padding: '24px', paddingBottom: '100px', color: NOIR, background: CREME, minHeight: '100vh' }}>
      {loading && <div className="p-8 text-center text-zinc-400">Chargement...</div>}
      {toast && <div style={{ position: 'fixed', top: '20px', right: '20px', background: '#22c55e', color: '#fff', padding: '10px 18px', borderRadius: '8px', zIndex: 999, fontSize: '14px' }}>{toast}</div>}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h1 style={{ color: OR, fontSize: '22px', fontWeight: '700', margin: '0 0 4px' }}>Services</h1>
          <p style={{ color: MUTED, margin: 0, fontSize: '13px' }}>{services.length} services</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: OR, color: NOIR, fontWeight: '700', cursor: 'pointer', fontSize: '13px' }}
        >{`+ Ajouter`}</button>
      </div>

      {/* Formulaire */}
      {showForm && (
        <div style={{ background: CARD, border: `1px solid ${OR}44`, borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
          <h3 style={{ color: OR, fontSize: '14px', margin: '0 0 12px' }}>Nouveau service</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
            <input placeholder="Nom du service *" value={form.nom} onChange={e => setForm(p => ({ ...p, nom: e.target.value }))}
              style={{ background: CREME, border: `1px solid ${BORDER_OR}`, borderRadius: '8px', color: NOIR, padding: '10px', fontSize: '13px' }} />
            <select value={form.cat} onChange={e => setForm(p => ({ ...p, cat: e.target.value }))}
              style={{ background: CREME, border: `1px solid ${BORDER_OR}`, borderRadius: '8px', color: NOIR, padding: '10px', fontSize: '13px', cursor: 'pointer' }}>
              {CATS.filter(c => c !== 'Tous').map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
              {[['salon', 'Salon $'], ['domicile', 'Domicile $'], ['domicile_client', 'Déplacement $']].map(([key, label]) => (
                <div key={key}>
                  <p style={{ color: MUTED, fontSize: '10px', margin: '0 0 3px' }}>{label}</p>
                  <input type="number" placeholder="0" value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                    style={{ width: '100%', background: CREME, border: `1px solid ${BORDER_OR}`, borderRadius: '6px', color: NOIR, padding: '8px', fontSize: '13px', boxSizing: 'border-box' }} />
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => setShowForm(false)} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: `1px solid ${BORDER_OR}`, background: 'none', color: MUTED, cursor: 'pointer', fontSize: '13px' }}>Annuler</button>
            <button onClick={addService} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: OR, color: NOIR, fontWeight: '700', cursor: 'pointer', fontSize: '13px' }}>Ajouter</button>
          </div>
        </div>
      )}

      {/* Filtres catégorie */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
        {CATS.map(c => (
          <button key={c} onClick={() => setCatFiltre(c)}
            style={{ padding: '5px 12px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: '600', background: catFiltre === c ? OR : CARD, color: catFiltre === c ? NOIR : MUTED }}
          >{c}</button>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: CARD, border: `1px solid ${BORDER_OR}`, borderRadius: '12px', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 60px 65px 65px 65px', gap: '0', borderBottom: `1px solid ${BORDER_OR}`, padding: '10px 14px' }}>
          {['Service', 'Cat.', 'Salon', 'Dom.', 'Dépl.'].map(h => (
            <span key={h} style={{ color: MUTED, fontSize: '11px', fontWeight: '600', textTransform: 'uppercase' }}>{h}</span>
          ))}
        </div>
        {filtered.map((s, i) => (
          <div key={s.id} style={{
            display: 'grid', gridTemplateColumns: '1fr 60px 65px 65px 65px', gap: '0',
            padding: '10px 14px', alignItems: 'center',
            borderBottom: i < filtered.length - 1 ? `1px solid ${BORDER_OR}20` : 'none',
          }}>
            <span style={{ color: NOIR, fontSize: '13px' }}>{s.nom}</span>
            <span style={{ background: OR + '22', color: OR, fontSize: '10px', padding: '2px 6px', borderRadius: '8px', textAlign: 'center' }}>{s.cat}</span>
            {priceInput(s.id, 'salon', s.salon)}
            {priceInput(s.id, 'domicile', s.domicile)}
            {priceInput(s.id, 'domicile_client', s.deplacement)}
          </div>
        ))}
      </div>

      <p style={{ color: MUTED, fontSize: '11px', marginTop: '8px', textAlign: 'center' }}>
        Les prix sont éditables directement dans le tableau.
      </p>
    </div>
  )
}
