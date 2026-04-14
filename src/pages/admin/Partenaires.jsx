import { useState } from 'react'
import { OR, CREME, NOIR, CARD, MUTED, BORDER_OR, formatMontant, formatDate, statutColor, initiales, niveauLabel } from '@/lib/utils'
import { useAllPartenaires } from '@/hooks'

const NIVEAUX = ['partenaire', 'certifie', 'elite', 'ambassadeur']

export default function AdminPartenaires() {
  const { data: partenairesData = [], loading } = useAllPartenaires()
  const [partenaires, setPartenaires] = useState(partenairesData)
  const [selected, setSelected] = useState(null)
  const [toast, setToast] = useState('')

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500) }

  const updatePartenaire = (id, changes) => {
    setPartenaires(prev => prev.map(p => p.id === id ? { ...p, ...changes } : p))
    if (selected?.id === id) setSelected(prev => ({ ...prev, ...changes }))
  }

  const p = selected ? partenaires.find(x => x.id === selected.id) : null

  if (p) {
    return (
      <div style={{ padding: '24px', paddingBottom: '100px', color: NOIR, background: CREME, minHeight: '100vh' }}>
        {toast && <div style={{ position: 'fixed', top: '20px', right: '20px', background: '#22c55e', color: '#fff', padding: '10px 18px', borderRadius: '8px', zIndex: 999, fontSize: '14px' }}>{toast}</div>}

        <button onClick={() => setSelected(null)} style={{ background: 'none', border: `1px solid ${BORDER_OR}`, color: MUTED, cursor: 'pointer', padding: '8px 14px', borderRadius: '8px', marginBottom: '20px', fontSize: '13px' }}>
          {`← Retour`}
        </button>

        {/* Fiche */}
        <div style={{ background: CARD, border: `1px solid ${p.note < 4.0 ? '#ef4444' : BORDER_OR}`, borderRadius: '14px', padding: '20px', marginBottom: '14px' }}>
          {p.note < 4.0 && (
            <div style={{ background: '#ef444422', border: '1px solid #ef4444', borderRadius: '8px', padding: '8px 12px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#ef4444' }}>
              <span>⚠️</span> Note basse : {p.note}/5 — Intervention recommandée
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: OR + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', color: OR, fontWeight: '700', fontSize: '18px' }}>
              {initiales(p.prenom, p.nom)}
            </div>
            <div>
              <h2 style={{ margin: '0 0 4px', color: NOIR, fontSize: '18px', fontWeight: '700' }}>{p.prenom} {p.nom}</h2>
              <div style={{ display: 'flex', gap: '6px' }}>
                <span style={{ fontSize: '12px', padding: '2px 10px', borderRadius: '20px', background: OR + '22', color: OR, fontWeight: '600' }}>{niveauLabel(p.niveau)}</span>
                <span style={{ fontSize: '12px', padding: '2px 10px', borderRadius: '20px', background: statutColor(p.statut) + '22', color: statutColor(p.statut), fontWeight: '600' }}>{p.statut}</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
            {[
              ['Téléphone', p.telephone],
              ['Email', p.email],
              ['Ville', p.ville],
              ['Adhésion', formatDate(p.date_adhesion)],
              ['Note', `⭐ ${p.note}/5`],
              ['RDV total', p.rdv_total],
            ].map(([label, val]) => (
              <div key={label}>
                <p style={{ color: MUTED, fontSize: '11px', margin: '0 0 2px', textTransform: 'uppercase' }}>{label}</p>
                <p style={{ color: NOIR, fontSize: '13px', margin: 0 }}>{val}</p>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '16px' }}>
            <div style={{ background: CREME, borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
              <p style={{ color: MUTED, fontSize: '11px', margin: '0 0 4px' }}>Revenus/mois</p>
              <p style={{ color: '#22c55e', fontSize: '18px', fontWeight: '700', margin: 0 }}>{formatMontant(p.revenus_mois)}</p>
            </div>
            <div style={{ background: CREME, borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
              <p style={{ color: MUTED, fontSize: '11px', margin: '0 0 4px' }}>Portefeuille</p>
              <p style={{ color: OR, fontSize: '18px', fontWeight: '700', margin: 0 }}>{formatMontant(p.solde_portefeuille)}</p>
            </div>
            <div style={{ background: CREME, borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
              <p style={{ color: MUTED, fontSize: '11px', margin: '0 0 4px' }}>Commission</p>
              <p style={{ color: '#60a5fa', fontSize: '18px', fontWeight: '700', margin: 0 }}>{(p.commission_rate * 100).toFixed(0)}%</p>
            </div>
          </div>

          {/* Spécialités */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
            {p.specialites.map(s => (
              <span key={s} style={{ background: OR + '22', color: OR, fontSize: '12px', padding: '3px 10px', borderRadius: '20px' }}>{s}</span>
            ))}
          </div>

          {/* Avis clients */}
          <div style={{ background: CREME, borderRadius: '10px', padding: '14px', marginBottom: '14px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: OR, marginBottom: '12px' }}>Avis clients</div>
            {/* Étoiles visuelles */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <span style={{ fontSize: '28px', fontWeight: 700, color: OR }}>{p.note}</span>
              <div>
                <div style={{ fontSize: '16px', letterSpacing: '2px' }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} style={{ color: i < Math.round(p.note) ? OR : 'rgba(14,12,9,0.08)' }}>★</span>
                  ))}
                </div>
                <div style={{ fontSize: '11px', color: MUTED, marginTop: '2px' }}>{p.rdv_total} RDV total</div>
              </div>
            </div>
            {/* Répartition */}
            {[5, 4, 3, 2, 1].map(star => {
              const counts = { 5: Math.round(p.rdv_total * 0.55), 4: Math.round(p.rdv_total * 0.30), 3: Math.round(p.rdv_total * 0.08), 2: Math.round(p.rdv_total * 0.04), 1: Math.round(p.rdv_total * 0.03) }
              const count = counts[star]
              const pct = p.rdv_total > 0 ? (count / p.rdv_total) * 100 : 0
              return (
                <div key={star} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
                  <span style={{ width: '28px', fontSize: '11px', color: MUTED, flexShrink: 0 }}>{star} ★</span>
                  <div style={{ flex: 1, background: 'rgba(14,12,9,0.08)', borderRadius: '999px', height: '5px', overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: OR, borderRadius: '999px' }} />
                  </div>
                  <span style={{ width: '20px', fontSize: '11px', color: MUTED, textAlign: 'right', flexShrink: 0 }}>{count}</span>
                </div>
              )
            })}
            {/* Derniers commentaires */}
            <div style={{ marginTop: '12px', borderTop: `1px solid rgba(14,12,9,0.08)`, paddingTop: '12px' }}>
              <div style={{ fontSize: '11px', color: MUTED, marginBottom: '8px', textTransform: 'uppercase', fontWeight: 600 }}>Derniers commentaires</div>
              {[
                { client: 'Aminata D.', note: 5, commentaire: 'Incroyable ! Les tresses sont parfaites.', date: '8 mars' },
                { client: 'Fatoumata K.', note: 5, commentaire: 'Très professionnelle et douce. Je recommande !', date: '1 mars' },
                { client: 'Christelle M.', note: 4, commentaire: 'Bon résultat, un léger retard au départ.', date: '18 fév.' },
              ].map((avis, i) => (
                <div key={i} style={{ marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 600 }}>{avis.client}</span>
                      <span style={{ fontSize: '12px' }}>
                        {Array.from({ length: 5 }).map((_, j) => (
                          <span key={j} style={{ color: j < avis.note ? OR : 'rgba(14,12,9,0.08)' }}>★</span>
                        ))}
                      </span>
                    </div>
                    <span style={{ fontSize: '10px', color: MUTED }}>{avis.date}</span>
                  </div>
                  <div style={{ fontSize: '11px', color: MUTED, fontStyle: 'italic' }}>"{avis.commentaire}"</div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* Activer / Suspendre */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => { updatePartenaire(p.id, { statut: 'actif' }); showToast(`${p.prenom} activé`) }}
                disabled={p.statut === 'actif'}
                style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: p.statut === 'actif' ? '#22c55e44' : '#22c55e', color: '#fff', fontWeight: '600', cursor: p.statut === 'actif' ? 'default' : 'pointer', fontSize: '13px' }}
              >Activer</button>
              <button
                onClick={() => { updatePartenaire(p.id, { statut: 'suspendu' }); showToast(`${p.prenom} suspendu`) }}
                disabled={p.statut === 'suspendu'}
                style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: p.statut === 'suspendu' ? '#ef444444' : '#ef4444', color: '#fff', fontWeight: '600', cursor: p.statut === 'suspendu' ? 'default' : 'pointer', fontSize: '13px' }}
              >Suspendre</button>
            </div>

            {/* Changer niveau */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <select
                value={p.niveau}
                onChange={e => { updatePartenaire(p.id, { niveau: e.target.value }); showToast(`Niveau mis à jour`) }}
                style={{ flex: 1, background: CREME, border: `1px solid ${BORDER_OR}`, borderRadius: '8px', color: NOIR, padding: '10px', fontSize: '13px', cursor: 'pointer' }}
              >
                {NIVEAUX.map(n => <option key={n} value={n}>{niveauLabel(n)}</option>)}
              </select>
              <span style={{ color: MUTED, fontSize: '12px' }}>Niveau</span>
            </div>

            {/* Certificat */}
            <button
              onClick={() => { updatePartenaire(p.id, { certifie: !p.certifie }); showToast(p.certifie ? `Certificat retiré` : `Certificat activé`) }}
              style={{ padding: '10px', borderRadius: '8px', border: `1px solid ${OR}`, background: p.certifie ? OR + '22' : OR, color: p.certifie ? OR : NOIR, fontWeight: '600', cursor: 'pointer', fontSize: '13px' }}
            >
              {p.certifie ? `✓ Certifié (retirer)` : `Activer certificat`}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '24px', paddingBottom: '100px', color: NOIR, background: CREME, minHeight: '100vh' }}>
      {loading && <div className="p-8 text-center text-zinc-400">Chargement...</div>}
      {toast && <div style={{ position: 'fixed', top: '20px', right: '20px', background: '#22c55e', color: '#fff', padding: '10px 18px', borderRadius: '8px', zIndex: 999, fontSize: '14px' }}>{toast}</div>}

      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ color: OR, fontSize: '22px', fontWeight: '700', margin: '0 0 4px' }}>Partenaires</h1>
        <p style={{ color: MUTED, margin: 0, fontSize: '13px' }}>{partenaires.length} partenaires · {partenaires.filter(p => p.statut === 'actif').length} actifs</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {partenaires.map(p => (
          <div
            key={p.id}
            onClick={() => setSelected(p)}
            style={{
              background: CARD,
              border: `1px solid ${p.note < 4.0 ? '#ef4444' : BORDER_OR}`,
              borderRadius: '12px', padding: '14px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '12px',
            }}
          >
            {p.note < 4.0 && <span style={{ position: 'absolute', marginLeft: '-6px', fontSize: '16px' }}>⚠️</span>}
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: OR + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', color: OR, fontWeight: '700', fontSize: '14px', flexShrink: 0 }}>
              {initiales(p.prenom, p.nom)}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: '0 0 4px', fontWeight: '600', color: NOIR, fontSize: '14px' }}>{p.prenom} {p.nom}</p>
              <p style={{ margin: 0, fontSize: '12px', color: MUTED }}>{p.ville} · ⭐ {p.note}/5</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ display: 'flex', gap: '4px', justifyContent: 'flex-end', marginBottom: '4px' }}>
                <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '20px', background: OR + '22', color: OR }}>{niveauLabel(p.niveau)}</span>
                <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '20px', background: statutColor(p.statut) + '22', color: statutColor(p.statut) }}>{p.statut}</span>
              </div>
              <p style={{ margin: 0, fontSize: '12px', color: '#22c55e', fontWeight: '600' }}>{formatMontant(p.solde_portefeuille)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
