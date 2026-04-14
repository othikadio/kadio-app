import { useState } from 'react'
import { OR, CREME, NOIR, CARD, MUTED, BORDER_OR, formatMontant, formatDate, statutColor, initiales } from '@/lib/utils'
import { useAllEmployes } from '@/hooks'
import { RECOMPENSES_MENSUELLES } from '@/utils/recompenses'
import { MOCK_MARCUS_EMPLOYE } from '@/data/mockEmploye'

export default function AdminEmployes() {
  const { data: employesData = [], loading } = useAllEmployes()
  const [employes, setEmployes] = useState(employesData)
  const [selected, setSelected] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [toast, setToast] = useState('')
  const [newEmploye, setNewEmploye] = useState({ prenom: '', nom: '', telephone: '', email: '', poste: '', specialites: '' })

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500) }

  const updateEmploye = (id, changes) => {
    setEmployes(prev => prev.map(e => e.id === id ? { ...e, ...changes } : e))
    if (selected?.id === id) setSelected(prev => ({ ...prev, ...changes }))
  }

  const addEmploye = () => {
    if (!newEmploye.prenom || !newEmploye.nom) return
    const e = {
      id: `e${Date.now()}`,
      ...newEmploye,
      specialites: newEmploye.specialites.split(',').map(s => s.trim()).filter(Boolean),
      couleur_agenda: '#6B7280',
      statut: 'actif',
      rdv_semaine: 0,
      revenus_semaine: 0,
      date_embauche: '2026-03-28',
      commission_rate: 0.75,
    }
    setEmployes(prev => [...prev, e])
    setNewEmploye({ prenom: '', nom: '', telephone: '', email: '', poste: '', specialites: '' })
    setShowForm(false)
    showToast(`${e.prenom} ${e.nom} ajouté(e) !`)
  }

  const emp = selected ? employes.find(e => e.id === selected.id) : null

  if (emp) {
    return (
      <div style={{ padding: '24px', paddingBottom: '100px', color: NOIR, background: CREME, minHeight: '100vh' }}>
        {toast && <div style={{ position: 'fixed', top: '20px', right: '20px', background: '#22c55e', color: '#fff', padding: '10px 18px', borderRadius: '8px', zIndex: 999, fontSize: '14px' }}>{toast}</div>}
        <button onClick={() => setSelected(null)} style={{ background: 'none', border: `1px solid ${BORDER_OR}`, color: MUTED, cursor: 'pointer', padding: '8px 14px', borderRadius: '8px', marginBottom: '20px', fontSize: '13px' }}>{`← Retour`}</button>

        <div style={{ background: CARD, border: `1px solid ${BORDER_OR}`, borderRadius: '14px', padding: '20px', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: emp.couleur_agenda + '33', border: `2px solid ${emp.couleur_agenda}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: emp.couleur_agenda, fontWeight: '700', fontSize: '18px' }}>
              {initiales(emp.prenom, emp.nom)}
            </div>
            <div>
              <h2 style={{ margin: '0 0 4px', color: NOIR, fontSize: '18px', fontWeight: '700' }}>{emp.prenom} {emp.nom}</h2>
              <div style={{ display: 'flex', gap: '6px' }}>
                <span style={{ background: '#6b728022', color: MUTED, fontSize: '12px', padding: '2px 10px', borderRadius: '20px' }}>{emp.poste}</span>
                <span style={{ fontSize: '12px', padding: '2px 10px', borderRadius: '20px', background: statutColor(emp.statut) + '22', color: statutColor(emp.statut), fontWeight: '600' }}>{emp.statut}</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
            {[
              ['Téléphone', emp.telephone],
              ['Email', emp.email],
              [`Date d'embauche`, formatDate(emp.date_embauche)],
              ['Commission', `${(emp.commission_rate * 100).toFixed(0)}%`],
            ].map(([label, val]) => (
              <div key={label}>
                <p style={{ color: MUTED, fontSize: '11px', margin: '0 0 2px', textTransform: 'uppercase' }}>{label}</p>
                <p style={{ color: NOIR, fontSize: '13px', margin: 0 }}>{val}</p>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
            <div style={{ background: CREME, borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
              <p style={{ color: MUTED, fontSize: '11px', margin: '0 0 4px' }}>RDV semaine</p>
              <p style={{ color: OR, fontSize: '22px', fontWeight: '700', margin: 0 }}>{emp.rdv_semaine}</p>
            </div>
            <div style={{ background: CREME, borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
              <p style={{ color: MUTED, fontSize: '11px', margin: '0 0 4px' }}>Revenus semaine</p>
              <p style={{ color: '#22c55e', fontSize: '22px', fontWeight: '700', margin: 0 }}>{formatMontant(emp.revenus_semaine)}</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
            {emp.specialites.map(s => (
              <span key={s} style={{ background: OR + '22', color: OR, fontSize: '12px', padding: '3px 10px', borderRadius: '20px' }}>{s}</span>
            ))}
          </div>

          {/* Récompenses du mois */}
          {emp.id === 'e1' && MOCK_MARCUS_EMPLOYE.recompenses && (() => {
            const r = MOCK_MARCUS_EMPLOYE.recompenses
            return (
              <div style={{ background: CREME, borderRadius: '10px', padding: '14px', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: OR }}>Récompenses — Mars 2026</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#22c55e' }}>{formatMontant(r.bonus_ce_mois)} bonus</div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
                  {RECOMPENSES_MENSUELLES.map(recomp => {
                    const obtenu = r.badges_obtenus.includes(recomp.id)
                    return (
                      <span key={recomp.id} style={{ fontSize: '11px', padding: '3px 9px', borderRadius: '20px', fontWeight: 600, background: obtenu ? recomp.couleur + '22' : 'rgba(14,12,9,0.06)', color: obtenu ? recomp.couleur : MUTED }}>
                        {recomp.icon} {recomp.label} {obtenu ? '✓' : `+${formatMontant(recomp.bonus)}`}
                      </span>
                    )
                  })}
                </div>
                <button
                  onClick={() => showToast(`Bonus de ${formatMontant(r.bonus_ce_mois)} viré à ${emp.prenom} !`)}
                  style={{ width: '100%', padding: '9px', borderRadius: '8px', border: 'none', background: '#22c55e', color: '#fff', fontWeight: '700', cursor: 'pointer', fontSize: '13px' }}>
                  Valider et virer le bonus ({formatMontant(r.bonus_ce_mois)})
                </button>
              </div>
            )
          })()}

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => { updateEmploye(emp.id, { statut: 'actif' }); showToast(`${emp.prenom} activé`) }}
              disabled={emp.statut === 'actif'}
              style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: emp.statut === 'actif' ? '#22c55e44' : '#22c55e', color: '#fff', fontWeight: '600', cursor: emp.statut === 'actif' ? 'default' : 'pointer', fontSize: '13px' }}
            >Activer</button>
            <button
              onClick={() => { updateEmploye(emp.id, { statut: 'conge', rdv_semaine: 0, revenus_semaine: 0 }); showToast(`${emp.prenom} en congé`) }}
              disabled={emp.statut === 'conge'}
              style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: emp.statut === 'conge' ? '#f59e0b44' : '#f59e0b', color: '#fff', fontWeight: '600', cursor: emp.statut === 'conge' ? 'default' : 'pointer', fontSize: '13px' }}
            >{`Congé`}</button>
            <button
              onClick={() => { updateEmploye(emp.id, { statut: 'inactif' }); showToast(`${emp.prenom} désactivé`) }}
              disabled={emp.statut === 'inactif'}
              style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: emp.statut === 'inactif' ? '#ef444444' : '#ef4444', color: '#fff', fontWeight: '600', cursor: emp.statut === 'inactif' ? 'default' : 'pointer', fontSize: '13px' }}
            >Désactiver</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '24px', paddingBottom: '100px', color: NOIR, background: CREME, minHeight: '100vh' }}>
      {loading && <div className="p-8 text-center text-zinc-400">Chargement...</div>}
      {toast && <div style={{ position: 'fixed', top: '20px', right: '20px', background: '#22c55e', color: '#fff', padding: '10px 18px', borderRadius: '8px', zIndex: 999, fontSize: '14px' }}>{toast}</div>}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h1 style={{ color: OR, fontSize: '22px', fontWeight: '700', margin: '0 0 4px' }}>{`Employés`}</h1>
          <p style={{ color: MUTED, margin: 0, fontSize: '13px' }}>{employes.length} employé{employes.length > 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: OR, color: NOIR, fontWeight: '700', cursor: 'pointer', fontSize: '13px' }}
        >{`+ Ajouter`}</button>
      </div>

      {/* Formulaire ajout */}
      {showForm && (
        <div style={{ background: CARD, border: `1px solid ${OR}44`, borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
          <h3 style={{ color: OR, fontSize: '14px', margin: '0 0 12px' }}>Nouvel employé</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
            {[
              ['prenom', 'Prénom *'],
              ['nom', 'Nom *'],
              ['telephone', 'Téléphone'],
              ['email', 'Email'],
              ['poste', 'Poste'],
              ['specialites', 'Spécialités (virgule)'],
            ].map(([key, label]) => (
              <input
                key={key}
                placeholder={label}
                value={newEmploye[key]}
                onChange={e => setNewEmploye(prev => ({ ...prev, [key]: e.target.value }))}
                style={{ background: CREME, border: `1px solid ${BORDER_OR}`, borderRadius: '8px', color: NOIR, padding: '10px', fontSize: '13px' }}
              />
            ))}
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => setShowForm(false)} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: `1px solid ${BORDER_OR}`, background: 'none', color: MUTED, cursor: 'pointer', fontSize: '13px' }}>Annuler</button>
            <button onClick={addEmploye} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: OR, color: NOIR, fontWeight: '700', cursor: 'pointer', fontSize: '13px' }}>Ajouter</button>
          </div>
        </div>
      )}

      {/* Liste */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {employes.map(e => (
          <div
            key={e.id}
            onClick={() => setSelected(e)}
            style={{ background: CARD, border: `1px solid ${BORDER_OR}`, borderRadius: '12px', padding: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}
          >
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: e.couleur_agenda, flexShrink: 0 }} />
            <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: e.couleur_agenda + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', color: e.couleur_agenda, fontWeight: '700', fontSize: '13px', flexShrink: 0 }}>
              {initiales(e.prenom, e.nom)}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: '0 0 2px', fontWeight: '600', color: NOIR, fontSize: '14px' }}>{e.prenom} {e.nom}</p>
              <p style={{ margin: 0, fontSize: '12px', color: MUTED }}>{e.poste}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ display: 'block', fontSize: '11px', padding: '2px 8px', borderRadius: '20px', background: statutColor(e.statut) + '22', color: statutColor(e.statut), fontWeight: '600', marginBottom: '4px' }}>{e.statut}</span>
              <p style={{ margin: 0, fontSize: '12px', color: MUTED }}>{e.rdv_semaine} RDV · {formatMontant(e.revenus_semaine)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
