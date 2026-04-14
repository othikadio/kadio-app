import { useState } from 'react'
import { OR, CREME, NOIR, CARD, MUTED, BORDER_OR, formatMontant, formatDate, statutColor } from '@/lib/utils'
import { useAllAbonnements, usePlans } from '@/hooks'

const FILTRES = ['Tous', 'actif', 'en_attente', 'suspendu']
const STATUT_LABELS = { actif: 'Actif', en_attente: 'En attente', suspendu: 'Suspendu' }

export default function AdminAbonnements() {
  const { data: abonnementsData = [], loading } = useAllAbonnements()
  const { data: plans = [] } = usePlans()
  const [abonnements, setAbonnements] = useState(abonnementsData)
  const [filtre, setFiltre] = useState('Tous')
  const [showForm, setShowForm] = useState(false)
  const defaultPlan = (plans && plans.length > 0) ? plans[0] : null
  const [form, setForm] = useState({ tel: '', plan: defaultPlan?.nom || '', prix: defaultPlan?.prix || 0 })
  const [toast, setToast] = useState('')

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500) }

  const confirmerPaiement = (id) => {
    setAbonnements(prev => prev.map(a => a.id === id ? { ...a, statut: 'actif' } : a))
    showToast('Paiement confirmé !')
  }

  const addAbonnement = () => {
    if (!form.tel) return
    const forfait = (plans || []).find(f => f.nom === form.plan)
    setAbonnements(prev => [...prev, {
      id: `ab${Date.now()}`,
      client: { prenom: 'Client', nom: 'Nouveau', tel: form.tel },
      plan: form.plan,
      prix: forfait?.prix || Number(form.prix),
      statut: 'en_attente',
      prochain_paiement: '2026-04-28',
      date_debut: '2026-03-28',
      sessions_restantes: 1,
    }])
    setShowForm(false)
    const defaultPlan = (plans && plans.length > 0) ? plans[0] : null
    setForm({ tel: '', plan: defaultPlan?.nom || '', prix: defaultPlan?.prix || 0 })
    showToast('Abonnement créé !')
  }

  const filtered = filtre === 'Tous' ? abonnements : abonnements.filter(a => a.statut === filtre)

  const stats = {
    actifs: abonnements.filter(a => a.statut === 'actif').length,
    revenus: abonnements.filter(a => a.statut === 'actif').reduce((s, a) => s + a.prix, 0),
    attente: abonnements.filter(a => a.statut === 'en_attente').length,
    suspendus: abonnements.filter(a => a.statut === 'suspendu').length,
  }

  return (
    <div style={{ padding: '24px', paddingBottom: '100px', color: NOIR, background: CREME, minHeight: '100vh' }}>
      {loading && <div className="p-8 text-center text-zinc-400">Chargement...</div>}
      {toast && <div style={{ position: 'fixed', top: '20px', right: '20px', background: '#22c55e', color: '#fff', padding: '10px 18px', borderRadius: '8px', zIndex: 999, fontSize: '14px' }}>{toast}</div>}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h1 style={{ color: OR, fontSize: '22px', fontWeight: '700', margin: '0 0 4px' }}>Abonnements</h1>
          <p style={{ color: MUTED, margin: 0, fontSize: '13px' }}>{abonnements.length} abonnements</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: OR, color: NOIR, fontWeight: '700', cursor: 'pointer', fontSize: '13px' }}
        >{`+ Nouvel abonnement`}</button>
      </div>

      {/* Stats strip */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '8px', marginBottom: '20px' }}>
        {[
          { label: 'Actifs', value: stats.actifs, color: '#22c55e' },
          { label: 'Rev./mois', value: formatMontant(stats.revenus), color: OR },
          { label: 'En attente', value: stats.attente, color: '#f59e0b' },
          { label: 'Suspendus', value: stats.suspendus, color: '#ef4444' },
        ].map((s, i) => (
          <div key={i} style={{ background: CARD, border: `1px solid ${BORDER_OR}`, borderRadius: '10px', padding: '10px 8px', textAlign: 'center' }}>
            <p style={{ color: s.color, fontSize: '16px', fontWeight: '700', margin: '0 0 2px' }}>{s.value}</p>
            <p style={{ color: MUTED, fontSize: '10px', margin: 0 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Formulaire nouvel abonnement */}
      {showForm && (
        <div style={{ background: CARD, border: `1px solid ${OR}44`, borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
          <h3 style={{ color: OR, fontSize: '14px', margin: '0 0 12px' }}>Nouvel abonnement</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
            <input
              placeholder={`Téléphone client *`}
              value={form.tel}
              onChange={e => setForm(p => ({ ...p, tel: e.target.value }))}
              style={{ background: CREME, border: `1px solid ${BORDER_OR}`, borderRadius: '8px', color: NOIR, padding: '10px', fontSize: '13px' }}
            />
            <select
              value={form.plan}
              onChange={e => {
                const f = (plans || []).find(fo => fo.nom === e.target.value)
                setForm(p => ({ ...p, plan: e.target.value, prix: f?.prix || p.prix }))
              }}
              style={{ background: CREME, border: `1px solid ${BORDER_OR}`, borderRadius: '8px', color: NOIR, padding: '10px', fontSize: '13px', cursor: 'pointer' }}
            >
              {(plans || []).map(f => <option key={f.id} value={f.nom}>{f.nom} — {f.prix}$</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => setShowForm(false)} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: `1px solid ${BORDER_OR}`, background: 'none', color: MUTED, cursor: 'pointer', fontSize: '13px' }}>Annuler</button>
            <button onClick={addAbonnement} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: OR, color: NOIR, fontWeight: '700', cursor: 'pointer', fontSize: '13px' }}>Créer</button>
          </div>
        </div>
      )}

      {/* Filtres */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
        {FILTRES.map(f => (
          <button
            key={f}
            onClick={() => setFiltre(f)}
            style={{ padding: '6px 14px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: '600', background: filtre === f ? OR : CARD, color: filtre === f ? NOIR : MUTED }}
          >
            {f === 'Tous' ? 'Tous' : STATUT_LABELS[f]}
          </button>
        ))}
      </div>

      {/* Liste */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filtered.map(a => (
          <div key={a.id} style={{ background: CARD, border: `1px solid ${BORDER_OR}`, borderRadius: '12px', padding: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ flex: 1 }}>
                <p style={{ margin: '0 0 2px', fontWeight: '600', color: NOIR, fontSize: '14px' }}>{a.client.prenom} {a.client.nom}</p>
                <p style={{ margin: 0, fontSize: '12px', color: MUTED }}>{a.client.tel}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ display: 'block', fontSize: '11px', padding: '2px 8px', borderRadius: '20px', background: statutColor(a.statut) + '22', color: statutColor(a.statut), fontWeight: '600', marginBottom: '4px' }}>
                  {STATUT_LABELS[a.statut]}
                </span>
                <p style={{ margin: 0, fontSize: '13px', color: OR, fontWeight: '700' }}>{formatMontant(a.prix)}/mois</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
              <div>
                <span style={{ background: OR + '22', color: OR, fontSize: '12px', padding: '3px 10px', borderRadius: '20px' }}>{a.plan}</span>
                {a.prochain_paiement && (
                  <p style={{ margin: '4px 0 0', fontSize: '11px', color: MUTED }}>Prochain : {formatDate(a.prochain_paiement)}</p>
                )}
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: '0 0 4px', fontSize: '11px', color: MUTED }}>{a.sessions_restantes} session{a.sessions_restantes !== 1 ? 's' : ''} restante{a.sessions_restantes !== 1 ? 's' : ''}</p>
                {a.statut === 'en_attente' && (
                  <button
                    onClick={() => confirmerPaiement(a.id)}
                    style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', background: '#22c55e', color: '#fff', fontWeight: '600', cursor: 'pointer', fontSize: '11px' }}
                  >Confirmer paiement</button>
                )}
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p style={{ color: MUTED, textAlign: 'center', padding: '40px 0' }}>Aucun abonnement pour ce filtre.</p>
        )}
      </div>
    </div>
  )
}
