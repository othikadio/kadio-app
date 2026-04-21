import { useState } from 'react'
import { OR, CREME, NOIR, CARD, MUTED, BORDER_OR } from '@/lib/utils'
import { useSalonConfig } from '@/hooks'

const JOURS = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche']
const JOURS_LABELS = { lundi: 'Lundi', mardi: 'Mardi', mercredi: 'Mercredi', jeudi: 'Jeudi', vendredi: 'Vendredi', samedi: 'Samedi', dimanche: 'Dimanche' }

export default function AdminConfig() {
  const { data: configData, loading } = useSalonConfig()
  const [config, setConfig] = useState(configData || {})
  const [toast, setToast] = useState('')

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500) }

  const upd = (path, value) => {
    setConfig(prev => {
      const next = { ...prev }
      const keys = path.split('.')
      let obj = next
      for (let i = 0; i < keys.length - 1; i++) {
        obj[keys[i]] = { ...obj[keys[i]] }
        obj = obj[keys[i]]
      }
      obj[keys[keys.length - 1]] = value
      return next
    })
  }

  const inputStyle = {
    background: CREME, border: `1px solid ${BORDER_OR}`, borderRadius: '8px',
    color: NOIR, padding: '10px', fontSize: '13px', width: '100%', boxSizing: 'border-box',
  }

  const Section = ({ title, children }) => (
    <div style={{ background: CARD, border: `1px solid ${BORDER_OR}`, borderRadius: '12px', padding: '16px', marginBottom: '14px' }}>
      <h2 style={{ color: OR, fontSize: '14px', fontWeight: '700', margin: '0 0 14px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</h2>
      {children}
    </div>
  )

  return (
    <div style={{ padding: '24px', paddingBottom: '100px', color: NOIR, background: CREME, minHeight: '100vh' }}>
      {loading && <div className="p-8 text-center text-zinc-400">Chargement...</div>}
      {toast && <div style={{ position: 'fixed', top: '20px', right: '20px', background: '#22c55e', color: '#fff', padding: '10px 18px', borderRadius: '8px', zIndex: 999, fontSize: '14px' }}>{toast}</div>}

      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ color: OR, fontSize: '22px', fontWeight: '700', margin: '0 0 4px' }}>Configuration</h1>
        <p style={{ color: MUTED, margin: 0, fontSize: '13px' }}>Paramètres du salon Kadio</p>
      </div>

      {/* Infos salon */}
      <Section title="Infos salon">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[
            ['Nom du salon', 'nom'],
            ['Adresse', 'adresse'],
            ['Téléphone', 'telephone'],
            ['Email', 'email'],
          ].map(([label, key]) => (
            <div key={key}>
              <p style={{ color: MUTED, fontSize: '11px', margin: '0 0 4px', textTransform: 'uppercase' }}>{label}</p>
              <input value={config[key]} onChange={e => upd(key, e.target.value)} style={inputStyle} />
            </div>
          ))}
        </div>
      </Section>

      {/* Horaires */}
      <Section title="Horaires d'ouverture">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {JOURS.map(j => {
            const h = config.horaires[j]
            return (
              <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ width: '70px', color: MUTED, fontSize: '13px', flexShrink: 0 }}>{JOURS_LABELS[j]}</span>
                <button
                  onClick={() => upd(`horaires.${j}.ouvert`, !h.ouvert)}
                  style={{
                    width: '40px', height: '22px', borderRadius: '11px', border: 'none', cursor: 'pointer',
                    background: h.ouvert ? '#22c55e' : '#6b7280', position: 'relative', flexShrink: 0,
                  }}
                >
                  <span style={{
                    position: 'absolute', top: '2px', width: '18px', height: '18px', borderRadius: '50%', background: '#fff',
                    transition: 'left 0.2s', left: h.ouvert ? '20px' : '2px',
                  }} />
                </button>
                {h.ouvert ? (
                  <div style={{ display: 'flex', gap: '6px', flex: 1 }}>
                    <input type="time" value={h.debut} onChange={e => upd(`horaires.${j}.debut`, e.target.value)}
                      style={{ ...inputStyle, width: '90px', padding: '6px 8px' }} />
                    <span style={{ color: MUTED, alignSelf: 'center' }}>—</span>
                    <input type="time" value={h.fin} onChange={e => upd(`horaires.${j}.fin`, e.target.value)}
                      style={{ ...inputStyle, width: '90px', padding: '6px 8px' }} />
                  </div>
                ) : (
                  <span style={{ color: MUTED, fontSize: '12px', fontStyle: 'italic' }}>Fermé</span>
                )}
              </div>
            )
          })}
        </div>
      </Section>

      {/* Commissions */}
      <Section title="Commissions par mode de travail">
        <div style={{ background: 'rgba(184,146,42,0.08)', border: '1px solid rgba(14,12,9,0.08)', borderRadius: '10px', padding: '10px 14px', marginBottom: '14px' }}>
          <p style={{ color: OR, fontSize: '12px', fontWeight: 700, margin: '0 0 2px' }}>Modèle en vigueur — 5 modes de travail</p>
          <p style={{ color: MUTED, fontSize: '11px', margin: 0 }}>Le mode salon (chaise Kadio) applique 50/50. Tous les autres modes → partenaire 75% / Kadio 25%.</p>
        </div>
        {[
          { mode: 'au_salon',              icone: '🏠', label: 'Salon Kadio',          partenaire: 50, kadio: 50,  note: `Kadio fournit l'espace et applique ses prix` },
          { mode: 'chez_coiffeur',         icone: '✂️', label: 'À domicile — chez toi', partenaire: 75, kadio: 25,  note: 'Le client se déplace chez le coiffeur' },
          { mode: 'deplacement_voiture',   icone: '🚗', label: 'Déplacement voiture',  partenaire: 75, kadio: 25,  note: '+ frais kilométriques remboursés au partenaire' },
          { mode: 'deplacement_transport', icone: '🚌', label: 'Déplacement transport', partenaire: 75, kadio: 25,  note: '+ frais de transport inclus dans le tarif' },
          { mode: 'mode_mixte',            icone: '🔄', label: 'Mode mixte',           partenaire: 75, kadio: 25,  note: 'Taux appliqué selon le mode choisi au RDV' },
        ].map(row => (
          <div key={row.mode} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', marginBottom: '8px', background: CREME, borderRadius: '8px', border: `1px solid rgba(14,12,9,0.08)` }}>
            <div>
              <p style={{ margin: '0 0 2px', fontSize: '13px', color: NOIR, fontWeight: 600 }}>{row.icone} {row.label}</p>
              <p style={{ margin: 0, fontSize: '11px', color: MUTED }}>{row.note}</p>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: '12px' }}>
              <p style={{ margin: '0 0 1px', fontSize: '13px', color: '#22c55e', fontWeight: 700 }}>Part. {row.partenaire}%</p>
              <p style={{ margin: 0, fontSize: '11px', color: MUTED }}>Kadio {row.kadio}%</p>
            </div>
          </div>
        ))}
        <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div>
            <p style={{ color: MUTED, fontSize: '11px', margin: '0 0 4px', textTransform: 'uppercase' }}>Commission Kadio — Salon (%)</p>
            <input type="number" min="0" max="100" value={config.commission_defaut_salon}
              onChange={e => upd('commission_defaut_salon', Number(e.target.value))} style={inputStyle} />
          </div>
          <div>
            <p style={{ color: MUTED, fontSize: '11px', margin: '0 0 4px', textTransform: 'uppercase' }}>Commission Kadio — Autres modes (%)</p>
            <input type="number" min="0" max="100" value={config.commission_defaut_domicile}
              onChange={e => upd('commission_defaut_domicile', Number(e.target.value))} style={inputStyle} />
          </div>
        </div>
      </Section>

      {/* Politique no-show */}
      <Section title="Politique no-show">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div>
            <p style={{ color: MUTED, fontSize: '11px', margin: '0 0 4px', textTransform: 'uppercase' }}>Seuil avertissement</p>
            <input type="number" min="1" value={config.politique_no_show.seuil_avertissement}
              onChange={e => upd('politique_no_show.seuil_avertissement', Number(e.target.value))} style={inputStyle} />
          </div>
          <div>
            <p style={{ color: MUTED, fontSize: '11px', margin: '0 0 4px', textTransform: 'uppercase' }}>Seuil blocage</p>
            <input type="number" min="1" value={config.politique_no_show.seuil_blocage}
              onChange={e => upd('politique_no_show.seuil_blocage', Number(e.target.value))} style={inputStyle} />
          </div>
        </div>
      </Section>

      {/* Grille déplacement */}
      <Section title="Grille de déplacement">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
            <thead>
              <tr>
                {['Distance (km)', 'Tarif normal', 'Tarif abonné'].map(h => (
                  <th key={h} style={{ color: MUTED, fontWeight: '600', textAlign: 'left', padding: '6px 8px', borderBottom: `1px solid ${BORDER_OR}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {config.deplacement_grille.map((row, i) => (
                <tr key={i}>
                  <td style={{ color: MUTED, padding: '8px', borderBottom: `1px solid ${BORDER_OR}20`, fontSize: '12px' }}>
                    {row.distance_min_km} – {row.distance_max_km === 99 ? '∞' : row.distance_max_km} km
                  </td>
                  <td style={{ padding: '8px', borderBottom: `1px solid ${BORDER_OR}20` }}>
                    <input type="number" value={row.tarif_normal}
                      onChange={e => {
                        const newGrille = config.deplacement_grille.map((r, ri) =>
                          ri === i ? { ...r, tarif_normal: Number(e.target.value) } : r
                        )
                        upd('deplacement_grille', newGrille)
                      }}
                      style={{ ...inputStyle, width: '80px', padding: '6px 8px' }} />
                  </td>
                  <td style={{ padding: '8px', borderBottom: `1px solid ${BORDER_OR}20` }}>
                    <input type="number" value={row.tarif_abonne}
                      onChange={e => {
                        const newGrille = config.deplacement_grille.map((r, ri) =>
                          ri === i ? { ...r, tarif_abonne: Number(e.target.value) } : r
                        )
                        upd('deplacement_grille', newGrille)
                      }}
                      style={{ ...inputStyle, width: '80px', padding: '6px 8px' }} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Intégrations */}
      <Section title="Intégrations">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            { key: 'square_actif', label: 'Square Payments', desc: 'Paiements par carte' },
            { key: 'twilio_actif', label: 'Twilio SMS', desc: 'Notifications SMS' },
            { key: 'supabase_actif', label: 'Supabase', desc: 'Base de données & Auth' },
          ].map(({ key, label, desc }) => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ flex: 1 }}>
                <p style={{ margin: '0 0 2px', fontSize: '14px', color: NOIR, fontWeight: '600' }}>{label}</p>
                <p style={{ margin: 0, fontSize: '12px', color: MUTED }}>{desc}</p>
              </div>
              <span style={{ fontSize: '12px', padding: '4px 12px', borderRadius: '20px', background: config[key] ? '#22c55e22' : '#ef444422', color: config[key] ? '#22c55e' : '#ef4444', fontWeight: '600' }}>
                {config[key] ? 'Connecté' : 'Déconnecté'}
              </span>
            </div>
          ))}
        </div>
      </Section>

      {/* Sauvegarder */}
      <button
        onClick={() => showToast('Configuration sauvegardée !')}
        style={{ width: '100%', padding: '14px', borderRadius: '10px', border: 'none', background: OR, color: NOIR, fontWeight: '700', cursor: 'pointer', fontSize: '15px' }}
      >
        Sauvegarder la configuration
      </button>
    </div>
  )
}
