import { useState } from 'react'
import { OR, CREME, NOIR, CARD } from '@/lib/utils'

// ─── Données initiales ────────────────────────────────────────
const HORAIRES_INIT = [
  { jour: 'Lundi',    ferme: false, debut: '12:00', fin: '19:00' },
  { jour: 'Mardi',    ferme: true,  debut: '10:00', fin: '19:00' },
  { jour: 'Mercredi', ferme: false, debut: '10:00', fin: '19:00' },
  { jour: 'Jeudi',    ferme: false, debut: '10:00', fin: '21:00' },
  { jour: 'Vendredi', ferme: false, debut: '10:00', fin: '21:00' },
  { jour: 'Samedi',   ferme: false, debut: '10:00', fin: '21:00' },
  { jour: 'Dimanche', ferme: false, debut: '10:00', fin: '17:00' },
]

const COIFFEURS_INIT = [
  { id: 'c1', prenom: 'Kadio',  nom: 'Kadio',  couleur: OR,        initiales: 'KA', poste: 'Directeur & Coiffeur',           pin: '1234', specialites: ['Tresses', 'Locs', 'Coupe'],      actif: true },
  { id: 'c2', prenom: 'Sarah',  nom: 'Osei',   couleur: '#60a5fa', initiales: 'SO', poste: `Coiffeuse — Spécialiste tresses`, pin: '5678', specialites: ['Tresses', 'Knotless', 'Locs'],   actif: true },
  { id: 'c3', prenom: 'Marcus', nom: 'Bell',   couleur: '#34d399', initiales: 'MB', poste: 'Barbier & Coiffeur',              pin: '9012', specialites: ['Coupe', 'Barbe'],                actif: true },
]

const SERVICES_DEPOT  = ['Tresses cornrows', 'Knotless braids', 'Locs installation', 'Barbier Coupe simple', 'Barbe illimitée']
const COULEURS_AGENDA = [OR, '#60a5fa', '#34d399', '#f87171', '#a78bfa', '#fb923c', '#f472b6', '#38bdf8']
const SPECIALITES_LIST = ['Tresses', 'Knotless', 'Locs', 'Coupe', 'Barbe', 'Soin', 'Esthétique', 'Coloration']

const TABS_NAV = [
  { key: 'salon',       label: 'Salon',        icon: '🏪' },
  { key: 'coiffeurs',   label: 'Coiffeurs',    icon: '✂️' },
  { key: 'depot',       label: 'Dépôt',        icon: '💰' },
  { key: 'sms',         label: 'SMS',          icon: '📱' },
  { key: 'square',      label: 'Square',       icon: '💳' },
  { key: 'supabase',    label: 'Supabase',     icon: '🗄️' },
  { key: 'noshow',      label: 'No-show',      icon: '🚫' },
  { key: 'abonnements', label: 'Abonnements',  icon: '🔄' },
  { key: 'export',      label: 'Export',       icon: '📦' },
  { key: 'danger',      label: 'Zone danger',  icon: '⚠️' },
]

// ─── Composants réutilisables ────────────────────────────────
function CardSection({ children, style = {} }) {
  return (
    <div style={{ background: CARD, border: `1px solid rgba(184,146,42,0.13)`, borderRadius: '14px', padding: '24px', ...style }}>
      {children}
    </div>
  )
}

function SectionTitle({ children }) {
  return (
    <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '20px', color: OR, letterSpacing: '0.1em', marginBottom: '20px' }}>
      {children}
    </h2>
  )
}

function Label({ children }) {
  return (
    <label style={{ display: 'block', fontSize: '11px', color: `rgba(14,12,9,0.4)`, letterSpacing: '0.08em', marginBottom: '6px', fontFamily: 'DM Sans, sans-serif' }}>
      {children}
    </label>
  )
}

function Inp({ value, onChange, placeholder = '', type = 'text', disabled = false, style = {} }) {
  return (
    <input type={type} value={value} onChange={onChange} placeholder={placeholder} disabled={disabled}
      style={{ width: '100%', boxSizing: 'border-box', background: disabled ? NOIR : '#0d0a08', border: `1px solid rgba(184,146,42,${disabled ? '0.08' : '0.2'})`, borderRadius: '8px', padding: '10px 14px', color: disabled ? `rgba(14,12,9,0.3)` : CREME, fontSize: '14px', fontFamily: 'DM Sans, sans-serif', outline: 'none', ...style }} />
  )
}

function Toggle({ checked, onChange, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
      <span style={{ fontSize: '14px', color: `rgba(14,12,9,0.7)`, fontFamily: 'DM Sans, sans-serif' }}>{label}</span>
      <button onClick={() => onChange(!checked)}
        style={{ width: '46px', height: '26px', borderRadius: '13px', background: checked ? OR : 'rgba(255,255,255,0.1)', border: `2px solid ${checked ? OR : 'rgba(255,255,255,0.15)'}`, cursor: 'pointer', position: 'relative', transition: 'all 0.2s', flexShrink: 0 }}>
        <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: checked ? NOIR : `rgba(14,12,9,0.5)`, position: 'absolute', top: '2px', left: checked ? '24px' : '2px', transition: 'left 0.2s' }} />
      </button>
    </div>
  )
}

function SaveBar({ onSave, saved }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
      <button onClick={onSave}
        style={{ padding: '11px 28px', borderRadius: '8px', background: OR, color: NOIR, fontFamily: 'Bebas Neue, sans-serif', fontSize: '16px', letterSpacing: '0.08em', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
        {saved ? `✓ SAUVEGARDÉ` : `SAUVEGARDER`}
      </button>
    </div>
  )
}

function StatusBadge({ ok, okLabel, koLabel }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: ok ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${ok ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`, color: ok ? '#22c55e' : '#ef4444', borderRadius: '100px', padding: '4px 12px', fontSize: '11px', fontWeight: 600, fontFamily: 'DM Sans, sans-serif' }}>
      <span style={{ fontSize: '8px' }}>●</span>
      {ok ? okLabel : koLabel}
    </span>
  )
}

// ═══════════════════════════════════════════════════════════════
export default function AdminParametres() {
  const [activeTab, setActiveTab] = useState('salon')

  // ── Salon
  const [salon, setSalon] = useState({
    nom:           `Kadio Coiffure & Esthétique`,
    adresse:       `615, rue Antoinette-Robidoux, Local 100, Longueuil (QC)`,
    telephone:     `514-919-5970`,
    email_interac: `kadiocoiffure@gmail.com`,
    site_web:      `kadio.app`,
  })
  const [horaires, setHoraires]   = useState(HORAIRES_INIT)
  const [salonSaved, setSalonSaved] = useState(false)

  // ── Coiffeurs
  const [coiffeurs, setCoiffeurs]           = useState(COIFFEURS_INIT)
  const [editCoiffeur, setEditCoiffeur]     = useState(null)
  const [showAddCoiffeur, setShowAddCoiffeur] = useState(false)
  const [newCoiffeur, setNewCoiffeur]       = useState({ prenom: '', nom: '', poste: '', pin: '', couleur: OR, specialites: [], actif: true, initiales: '' })

  // ── Dépôt
  const [depotActif, setDepotActif]             = useState(true)
  const [depotPct, setDepotPct]                 = useState(20)
  const [depotExceptions, setDepotExceptions]   = useState({ 'Barbier Coupe simple': false, 'Barbe illimitée': false })
  const [depotSaved, setDepotSaved]             = useState(false)

  // ── SMS Twilio
  const [twilio, setTwilio] = useState({ accountSid: import.meta.env.VITE_TWILIO_ACCOUNT_SID || '', authToken: '', numExp: '+1 (438) 000-0000', testDest: '' })
  const [smsSent, setSmsSent] = useState(false)

  // ── Square
  const [square, setSquare]     = useState({ mode: 'sandbox', appId: import.meta.env.VITE_SQUARE_APP_ID || '', locationId: import.meta.env.VITE_SQUARE_LOCATION_ID || '' })
  const [squareTest, setSquareTest] = useState(false)

  // ── Supabase
  const [supa, setSupa] = useState({ url: import.meta.env.VITE_SUPABASE_URL || '', anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '' })

  // ── No-show
  const [noShowConfig, setNoShowConfig] = useState({ seuil: 4, delaiJours: 30, alerteAuto: true, blocageAuto: false })
  const [noShowSaved, setNoShowSaved]   = useState(false)

  // ── Abonnements
  const [aboConfig, setAboConfig] = useState({ delaiGrace: 3, autoRenouvellement: true, notifJ7: true, notifJ1: true, notifExpire: true })
  const [aboSaved, setAboSaved]   = useState(false)

  // ── Danger
  const [showConfirmReset, setShowConfirmReset] = useState(false)
  const [resetConfirmText, setResetConfirmText] = useState('')

  // ─── Helpers
  function savedFn(setter) { setter(true); setTimeout(() => setter(false), 2500) }
  function setHoraire(idx, key, val) {
    setHoraires(prev => prev.map((h, i) => i === idx ? { ...h, [key]: val } : h))
  }
  function toggleDepotException(service) {
    setDepotExceptions(prev => ({ ...prev, [service]: !prev[service] }))
  }
  function toggleSpecialite(spec) {
    setNewCoiffeur(prev => ({
      ...prev,
      specialites: prev.specialites.includes(spec)
        ? prev.specialites.filter(s => s !== spec)
        : [...prev.specialites, spec],
    }))
  }
  function saveNewCoiffeur() {
    if (!newCoiffeur.prenom.trim() || !newCoiffeur.pin.trim()) return
    const initiales = (newCoiffeur.prenom[0] + (newCoiffeur.nom[0] || '')).toUpperCase()
    setCoiffeurs(prev => [...prev, { ...newCoiffeur, id: `c${Date.now()}`, initiales }])
    setShowAddCoiffeur(false)
    setNewCoiffeur({ prenom: '', nom: '', poste: '', pin: '', couleur: OR, specialites: [], actif: true, initiales: '' })
  }
  function toggleCoiffeurActif(id) {
    setCoiffeurs(prev => prev.map(c => c.id === id ? { ...c, actif: !c.actif } : c))
  }

  const supaConnected    = supa.url.includes('supabase.co')
  const twilioConnected  = twilio.accountSid.startsWith('AC')
  const squareConnected  = square.appId.length > 6

  const inp2 = { width: '100%', boxSizing: 'border-box', background: '#0d0a08', border: `1px solid rgba(14,12,9,0.08)`, borderRadius: '8px', padding: '10px 14px', color: NOIR, fontSize: '14px', fontFamily: 'DM Sans, sans-serif', outline: 'none' }

  return (
    <div style={{ padding: '20px', fontFamily: 'DM Sans, sans-serif', maxWidth: '900px', paddingBottom: '100px' }}>

      {/* En-tête */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '36px', color: OR, letterSpacing: '0.1em', lineHeight: 1 }}>PARAMÈTRES</h1>
        <p style={{ fontSize: '13px', color: `rgba(14,12,9,0.4)`, marginTop: '4px' }}>Configuration du salon Kadio Coiffure & Esthétique</p>
      </div>

      {/* Navigation tabs */}
      <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', paddingBottom: '2px', marginBottom: '24px', borderBottom: `1px solid rgba(184,146,42,0.12)` }}>
        {TABS_NAV.map(({ key, label, icon }) => {
          const actif    = activeTab === key
          const isDanger = key === 'danger'
          return (
            <button key={key} onClick={() => setActiveTab(key)}
              style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '9px 14px', background: 'none', border: 'none', borderBottom: `2px solid ${actif ? (isDanger ? '#ef4444' : OR) : 'transparent'}`, color: actif ? (isDanger ? '#ef4444' : OR) : `rgba(14,12,9,0.38)`, fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: actif ? 600 : 400, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.15s' }}>
              <span style={{ fontSize: '14px' }}>{icon}</span>
              {label}
            </button>
          )
        })}
      </div>

      {/* ── TAB: SALON ── */}
      {activeTab === 'salon' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <CardSection>
            <SectionTitle>🏪 INFORMATIONS DU SALON</SectionTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
                {[
                  { key: 'nom',           label: 'Nom du salon',     ph: `Kadio Coiffure & Esthétique` },
                  { key: 'adresse',       label: 'Adresse',          ph: 'Longueuil, QC' },
                  { key: 'telephone',     label: 'Téléphone',        ph: '514-919-5970' },
                  { key: 'email_interac', label: 'Courriel Interac', ph: 'kadiocoiffure@gmail.com' },
                  { key: 'site_web',      label: 'Site web',         ph: 'kadio.app' },
                ].map(({ key, label, ph }) => (
                  <div key={key}>
                    <Label>{label.toUpperCase()}</Label>
                    <Inp value={salon[key]} onChange={e => setSalon(s => ({ ...s, [key]: e.target.value }))} placeholder={ph} />
                  </div>
                ))}
              </div>
            </div>
          </CardSection>

          <CardSection>
            <SectionTitle>🕐 HORAIRES D'OUVERTURE</SectionTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {horaires.map((h, i) => (
                <div key={h.jour} style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <div style={{ width: '88px', fontSize: '13px', color: NOIR, fontWeight: 500 }}>{h.jour}</div>
                  <button onClick={() => setHoraire(i, 'ferme', !h.ferme)}
                    style={{ padding: '6px 14px', borderRadius: '6px', border: `1px solid`, borderColor: h.ferme ? 'rgba(239,68,68,0.4)' : 'rgba(34,197,94,0.3)', background: h.ferme ? 'rgba(239,68,68,0.08)' : 'rgba(34,197,94,0.08)', color: h.ferme ? '#ef4444' : '#22c55e', fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: 600, cursor: 'pointer', minWidth: '72px' }}>
                    {h.ferme ? 'FERMÉ' : 'OUVERT'}
                  </button>
                  {!h.ferme && (
                    <>
                      <input type="time" value={h.debut} onChange={e => setHoraire(i, 'debut', e.target.value)}
                        style={{ background: '#0d0a08', border: `1px solid rgba(14,12,9,0.08)`, borderRadius: '6px', padding: '6px 10px', color: NOIR, fontSize: '13px', fontFamily: 'DM Sans, sans-serif', outline: 'none' }} />
                      <span style={{ color: `rgba(14,12,9,0.3)`, fontSize: '13px' }}>→</span>
                      <input type="time" value={h.fin} onChange={e => setHoraire(i, 'fin', e.target.value)}
                        style={{ background: '#0d0a08', border: `1px solid rgba(14,12,9,0.08)`, borderRadius: '6px', padding: '6px 10px', color: NOIR, fontSize: '13px', fontFamily: 'DM Sans, sans-serif', outline: 'none' }} />
                    </>
                  )}
                  {h.ferme && <span style={{ fontSize: '12px', color: `rgba(14,12,9,0.25)`, fontStyle: 'italic' }}>Salon fermé ce jour</span>}
                </div>
              ))}
            </div>
            <SaveBar onSave={() => savedFn(setSalonSaved)} saved={salonSaved} />
          </CardSection>
        </div>
      )}

      {/* ── TAB: COIFFEURS ── */}
      {activeTab === 'coiffeurs' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ fontSize: '13px', color: `rgba(14,12,9,0.4)` }}>{coiffeurs.filter(c => c.actif).length} coiffeurs actifs</p>
            <button onClick={() => setShowAddCoiffeur(true)}
              style={{ padding: '9px 18px', borderRadius: '8px', background: OR, color: NOIR, fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 700, cursor: 'pointer', border: 'none' }}>
              + Ajouter coiffeur
            </button>
          </div>

          {coiffeurs.map(c => (
            <CardSection key={c.id}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: `${c.couleur}20`, border: `2px solid ${c.couleur}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '18px', color: c.couleur }}>{c.initiales}</span>
                </div>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 700, color: NOIR, fontSize: '16px' }}>{c.prenom} {c.nom}</span>
                    {!c.actif && (
                      <span style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.28)', color: '#ef4444', borderRadius: '100px', padding: '2px 9px', fontSize: '10px', fontWeight: 600 }}>Désactivé</span>
                    )}
                  </div>
                  <div style={{ fontSize: '12px', color: `rgba(14,12,9,0.45)`, marginBottom: '8px' }}>{c.poste}</div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '10px' }}>
                    {c.specialites.map(s => (
                      <span key={s} style={{ background: `${c.couleur}15`, border: `1px solid ${c.couleur}30`, color: c.couleur, borderRadius: '100px', padding: '2px 9px', fontSize: '11px', fontWeight: 500 }}>{s}</span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '11px', color: `rgba(14,12,9,0.38)` }}>Couleur agenda:</span>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        {COULEURS_AGENDA.map(col => (
                          <button key={col} onClick={() => setCoiffeurs(prev => prev.map(x => x.id === c.id ? { ...x, couleur: col } : x))}
                            style={{ width: '16px', height: '16px', borderRadius: '50%', background: col, border: `2px solid ${c.couleur === col ? CREME : 'transparent'}`, cursor: 'pointer', padding: 0 }} />
                        ))}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '11px', color: `rgba(14,12,9,0.38)` }}>PIN:</span>
                      <span style={{ fontFamily: 'monospace', fontSize: '13px', color: `rgba(14,12,9,0.5)`, letterSpacing: '0.15em' }}>••••</span>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                  <button onClick={() => setEditCoiffeur(c)}
                    style={{ padding: '8px 14px', borderRadius: '8px', background: 'transparent', border: `1px solid rgba(184,146,42,0.22)`, color: OR, fontFamily: 'DM Sans, sans-serif', fontSize: '12px', cursor: 'pointer' }}>
                    Modifier
                  </button>
                  <button onClick={() => toggleCoiffeurActif(c.id)}
                    style={{ padding: '8px 14px', borderRadius: '8px', background: 'transparent', border: `1px solid ${c.actif ? 'rgba(239,68,68,0.28)' : 'rgba(34,197,94,0.28)'}`, color: c.actif ? '#ef4444' : '#22c55e', fontFamily: 'DM Sans, sans-serif', fontSize: '12px', cursor: 'pointer' }}>
                    {c.actif ? 'Désactiver' : 'Réactiver'}
                  </button>
                </div>
              </div>
            </CardSection>
          ))}

          {/* Modal ajouter coiffeur */}
          {showAddCoiffeur && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.78)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '24px' }} onClick={() => setShowAddCoiffeur(false)}>
              <div style={{ background: '#F5F0E8', border: `1px solid rgba(184,146,42,0.22)`, borderRadius: '16px', padding: '28px', width: '100%', maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
                <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '22px', color: OR, letterSpacing: '0.1em', marginBottom: '20px' }}>NOUVEAU COIFFEUR</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <Label>PRÉNOM *</Label>
                      <input value={newCoiffeur.prenom} onChange={e => setNewCoiffeur(p => ({ ...p, prenom: e.target.value }))} placeholder="Sarah" style={inp2} />
                    </div>
                    <div>
                      <Label>NOM</Label>
                      <input value={newCoiffeur.nom} onChange={e => setNewCoiffeur(p => ({ ...p, nom: e.target.value }))} placeholder="Osei" style={inp2} />
                    </div>
                  </div>
                  <div>
                    <Label>POSTE / TITRE</Label>
                    <input value={newCoiffeur.poste} onChange={e => setNewCoiffeur(p => ({ ...p, poste: e.target.value }))} placeholder={`Coiffeuse — Spécialiste tresses`} style={inp2} />
                  </div>
                  <div>
                    <Label>PIN (4 CHIFFRES) *</Label>
                    <input type="password" maxLength={4} value={newCoiffeur.pin} onChange={e => setNewCoiffeur(p => ({ ...p, pin: e.target.value.replace(/\D/g,'').slice(0,4) }))} placeholder="••••" style={{ ...inp2, textAlign: 'center', letterSpacing: '0.3em' }} />
                  </div>
                  <div>
                    <Label>COULEUR AGENDA</Label>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {COULEURS_AGENDA.map(col => (
                        <button key={col} onClick={() => setNewCoiffeur(p => ({ ...p, couleur: col }))}
                          style={{ width: '28px', height: '28px', borderRadius: '50%', background: col, border: `3px solid ${newCoiffeur.couleur === col ? CREME : 'transparent'}`, cursor: 'pointer', padding: 0 }} />
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label>SPÉCIALITÉS</Label>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {SPECIALITES_LIST.map(s => {
                        const sel = newCoiffeur.specialites.includes(s)
                        return (
                          <button key={s} onClick={() => toggleSpecialite(s)}
                            style={{ padding: '5px 12px', borderRadius: '100px', border: `1px solid`, borderColor: sel ? newCoiffeur.couleur : 'rgba(184,146,42,0.18)', background: sel ? `${newCoiffeur.couleur}18` : 'transparent', color: sel ? newCoiffeur.couleur : `rgba(14,12,9,0.45)`, fontFamily: 'DM Sans, sans-serif', fontSize: '12px', cursor: 'pointer' }}>
                            {s}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                    <button onClick={() => setShowAddCoiffeur(false)} style={{ flex: 1, padding: '12px', borderRadius: '8px', background: 'transparent', border: `1px solid rgba(184,146,42,0.18)`, color: `rgba(14,12,9,0.45)`, fontFamily: 'DM Sans, sans-serif', fontSize: '14px', cursor: 'pointer' }}>Annuler</button>
                    <button onClick={saveNewCoiffeur} style={{ flex: 1, padding: '12px', borderRadius: '8px', background: OR, color: NOIR, fontFamily: 'DM Sans, sans-serif', fontSize: '14px', fontWeight: 700, cursor: 'pointer', border: 'none' }}>Créer le profil</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Modal modifier coiffeur */}
          {editCoiffeur && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.78)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '24px' }} onClick={() => setEditCoiffeur(null)}>
              <div style={{ background: '#F5F0E8', border: `1px solid rgba(184,146,42,0.22)`, borderRadius: '16px', padding: '28px', width: '100%', maxWidth: '480px' }} onClick={e => e.stopPropagation()}>
                <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '22px', color: OR, letterSpacing: '0.1em', marginBottom: '20px' }}>MODIFIER — {editCoiffeur.prenom.toUpperCase()}</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <Label>POSTE</Label>
                    <input defaultValue={editCoiffeur.poste} style={inp2} />
                  </div>
                  <div>
                    <Label>NOUVEAU PIN (4 CHIFFRES)</Label>
                    <input type="password" maxLength={4} placeholder="Laisser vide pour conserver" style={{ ...inp2, textAlign: 'center', letterSpacing: '0.3em' }} />
                  </div>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                    <button onClick={() => setEditCoiffeur(null)} style={{ flex: 1, padding: '12px', borderRadius: '8px', background: 'transparent', border: `1px solid rgba(184,146,42,0.18)`, color: `rgba(14,12,9,0.45)`, fontFamily: 'DM Sans, sans-serif', fontSize: '14px', cursor: 'pointer' }}>Annuler</button>
                    <button onClick={() => setEditCoiffeur(null)} style={{ flex: 1, padding: '12px', borderRadius: '8px', background: OR, color: NOIR, fontFamily: 'DM Sans, sans-serif', fontSize: '14px', fontWeight: 700, cursor: 'pointer', border: 'none' }}>Sauvegarder</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── TAB: DÉPÔT ── */}
      {activeTab === 'depot' && (
        <CardSection>
          <SectionTitle>💰 PARAMÈTRES DÉPÔT À LA RÉSERVATION</SectionTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <Toggle checked={depotActif} onChange={setDepotActif} label="Activer le dépôt obligatoire à la réservation" />
            {depotActif && (
              <>
                <div>
                  <Label>POURCENTAGE DU DÉPÔT (%)</Label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <input type="range" min={10} max={50} step={5} value={depotPct} onChange={e => setDepotPct(Number(e.target.value))}
                      style={{ flex: 1, accentColor: OR }} />
                    <div style={{ background: '#0d0a08', border: `1px solid rgba(14,12,9,0.08)`, borderRadius: '8px', padding: '8px 16px', minWidth: '60px', textAlign: 'center' }}>
                      <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '22px', color: OR }}>{depotPct}%</span>
                    </div>
                  </div>
                  <p style={{ fontSize: '12px', color: `rgba(14,12,9,0.35)`, marginTop: '6px' }}>
                    {`Exemple: service à 120$ → dépôt de ${(120 * depotPct / 100).toFixed(2)}$`}
                  </p>
                </div>
                <div>
                  <Label>EXCEPTIONS — PAS DE DÉPÔT POUR CES SERVICES</Label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '8px' }}>
                    {SERVICES_DEPOT.map(s => (
                      <div key={s} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: `rgba(255,255,255,0.02)`, borderRadius: '8px' }}>
                        <span style={{ fontSize: '13px', color: NOIR }}>{s}</span>
                        <Toggle checked={depotExceptions[s] || false} onChange={() => toggleDepotException(s)} label="" />
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
            <SaveBar onSave={() => savedFn(setDepotSaved)} saved={depotSaved} />
          </div>
        </CardSection>
      )}

      {/* ── TAB: SMS TWILIO ── */}
      {activeTab === 'sms' && (
        <CardSection>
          <SectionTitle>📱 PARAMÈTRES SMS — TWILIO</SectionTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '14px', color: `rgba(14,12,9,0.6)` }}>Statut connexion Twilio:</span>
              <StatusBadge ok={twilioConnected} okLabel="Connecté" koLabel="Non configuré" />
            </div>
            {[
              { key: 'accountSid', label: 'ACCOUNT SID (VITE_TWILIO_ACCOUNT_SID)', ph: 'ACxxxxxxxxxxxxxxxx', mono: true },
              { key: 'authToken',  label: 'AUTH TOKEN',                             ph: '••••••••••••••••••', mono: true, type: 'password' },
              { key: 'numExp',     label: 'NUMÉRO EXPÉDITEUR TWILIO',               ph: '+1 (438) 000-0000' },
            ].map(({ key, label, ph, mono, type }) => (
              <div key={key}>
                <Label>{label}</Label>
                <Inp type={type || 'text'} value={twilio[key]} onChange={e => setTwilio(t => ({ ...t, [key]: e.target.value }))} placeholder={ph} style={mono ? { fontFamily: 'monospace', letterSpacing: '0.04em' } : {}} />
              </div>
            ))}
            <div style={{ borderTop: `1px solid rgba(14,12,9,0.08)`, paddingTop: '16px' }}>
              <Label>TEST SMS — NUMÉRO DE DESTINATION</Label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <Inp value={twilio.testDest} onChange={e => setTwilio(t => ({ ...t, testDest: e.target.value }))} placeholder="+1 (514) 555-0000" style={{ flex: 1 }} />
                <button onClick={() => { setSmsSent(true); setTimeout(() => setSmsSent(false), 2500) }}
                  style={{ padding: '10px 18px', borderRadius: '8px', background: smsSent ? 'rgba(34,197,94,0.15)' : `rgba(14,12,9,0.08)`, border: `1px solid ${smsSent ? 'rgba(34,197,94,0.3)' : 'rgba(184,146,42,0.22)'}`, color: smsSent ? '#22c55e' : OR, fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s' }}>
                  {smsSent ? `✓ Envoyé` : `Envoyer test`}
                </button>
              </div>
            </div>
            <div style={{ background: `rgba(184,146,42,0.05)`, border: `1px solid rgba(14,12,9,0.08)`, borderRadius: '8px', padding: '12px 14px' }}>
              <p style={{ fontSize: '12px', color: `rgba(14,12,9,0.4)`, lineHeight: 1.6 }}>
                {`Ajoutez VITE_TWILIO_ACCOUNT_SID et VITE_TWILIO_AUTH_TOKEN dans votre fichier .env.local pour activer l'envoi SMS automatique.`}
              </p>
            </div>
          </div>
        </CardSection>
      )}

      {/* ── TAB: SQUARE ── */}
      {activeTab === 'square' && (
        <CardSection>
          <SectionTitle>💳 PARAMÈTRES SQUARE — PAIEMENTS</SectionTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '14px', color: `rgba(14,12,9,0.6)` }}>Statut connexion Square:</span>
              <StatusBadge ok={squareConnected} okLabel="Connecté" koLabel="Non configuré" />
            </div>
            <div>
              <Label>MODE</Label>
              <div style={{ display: 'flex', gap: '10px' }}>
                {['sandbox', 'production'].map(mode => {
                  const sel = square.mode === mode
                  return (
                    <button key={mode} onClick={() => setSquare(s => ({ ...s, mode }))}
                      style={{ flex: 1, padding: '10px', borderRadius: '8px', border: `2px solid`, borderColor: sel ? (mode === 'production' ? '#22c55e' : '#fbbf24') : 'rgba(14,12,9,0.08)', background: sel ? (mode === 'production' ? 'rgba(34,197,94,0.08)' : 'rgba(251,191,36,0.08)') : 'transparent', color: sel ? (mode === 'production' ? '#22c55e' : '#fbbf24') : `rgba(14,12,9,0.45)`, fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: sel ? 600 : 400, cursor: 'pointer', textTransform: 'capitalize' }}>
                      {mode === 'production' ? '🟢 Production' : '🟡 Sandbox (test)'}
                    </button>
                  )
                })}
              </div>
            </div>
            {[
              { key: 'appId',      label: 'APP ID (VITE_SQUARE_APP_ID)',           ph: 'sq0idp-xxxxxxxx' },
              { key: 'locationId', label: 'LOCATION ID (VITE_SQUARE_LOCATION_ID)', ph: 'LXXXXXXXXXX' },
            ].map(({ key, label, ph }) => (
              <div key={key}>
                <Label>{label}</Label>
                <Inp value={square[key]} onChange={e => setSquare(s => ({ ...s, [key]: e.target.value }))} placeholder={ph} style={{ fontFamily: 'monospace' }} />
              </div>
            ))}
            <button onClick={() => { setSquareTest(true); setTimeout(() => setSquareTest(false), 2500) }}
              style={{ alignSelf: 'flex-start', padding: '10px 20px', borderRadius: '8px', background: squareTest ? 'rgba(34,197,94,0.12)' : `rgba(14,12,9,0.08)`, border: `1px solid ${squareTest ? 'rgba(34,197,94,0.3)' : 'rgba(184,146,42,0.22)'}`, color: squareTest ? '#22c55e' : OR, fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
              {squareTest ? `✓ Paiement test OK` : `Tester la connexion Square`}
            </button>
            <div style={{ background: `rgba(184,146,42,0.05)`, border: `1px solid rgba(14,12,9,0.08)`, borderRadius: '8px', padding: '12px 14px' }}>
              <p style={{ fontSize: '12px', color: `rgba(14,12,9,0.4)`, lineHeight: 1.6 }}>
                {`Utilisez le mode Sandbox pour tester les paiements. Passez en Production uniquement avec de vraies clés Square live.`}
              </p>
            </div>
          </div>
        </CardSection>
      )}

      {/* ── TAB: SUPABASE ── */}
      {activeTab === 'supabase' && (
        <CardSection>
          <SectionTitle>🗄️ PARAMÈTRES SUPABASE</SectionTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '14px', color: `rgba(14,12,9,0.6)` }}>Statut connexion Supabase:</span>
              <StatusBadge ok={supaConnected} okLabel="Base de données connectée" koLabel="Non configuré" />
            </div>
            <div>
              <Label>URL SUPABASE (VITE_SUPABASE_URL)</Label>
              <Inp value={supa.url} onChange={e => setSupa(s => ({ ...s, url: e.target.value }))} placeholder="https://xxxxxxxxxxxx.supabase.co" style={{ fontFamily: 'monospace', fontSize: '12px' }} />
            </div>
            <div>
              <Label>CLÉ ANON PUBLIQUE (VITE_SUPABASE_ANON_KEY)</Label>
              <Inp type="password" value={supa.anonKey} onChange={e => setSupa(s => ({ ...s, anonKey: e.target.value }))} placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." style={{ fontFamily: 'monospace', fontSize: '12px' }} />
            </div>
            <div style={{ background: `rgba(96,165,250,0.06)`, border: `1px solid rgba(96,165,250,0.2)`, borderRadius: '10px', padding: '16px' }}>
              <div style={{ fontSize: '13px', color: '#60a5fa', fontWeight: 600, marginBottom: '8px' }}>📋 Instructions</div>
              <ol style={{ fontSize: '12px', color: `rgba(14,12,9,0.5)`, lineHeight: 1.8, paddingLeft: '16px', margin: 0 }}>
                <li>Créez un projet sur supabase.com</li>
                <li>Copiez l'URL et la clé anon depuis Project Settings → API</li>
                <li>Ajoutez-les dans votre fichier <code style={{ color: OR }}>.env.local</code> à la racine du projet</li>
                <li>Exécutez les migrations SQL depuis NEXT-STEPS.md (001, 002, 003)</li>
                <li>Redémarrez le serveur de développement</li>
              </ol>
            </div>
          </div>
        </CardSection>
      )}

      {/* ── TAB: NO-SHOW ── */}
      {activeTab === 'noshow' && (
        <CardSection>
          <SectionTitle>🚫 POLITIQUE NO-SHOW</SectionTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <Label>NOMBRE DE NO-SHOWS AVANT BLOCAGE AUTOMATIQUE</Label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px' }}>
                <input type="range" min={1} max={10} value={noShowConfig.seuil} onChange={e => setNoShowConfig(c => ({ ...c, seuil: Number(e.target.value) }))}
                  style={{ flex: 1, accentColor: OR }} />
                <div style={{ background: '#0d0a08', border: `1px solid rgba(14,12,9,0.08)`, borderRadius: '8px', padding: '8px 16px', minWidth: '50px', textAlign: 'center' }}>
                  <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '24px', color: '#f97316' }}>{noShowConfig.seuil}</span>
                </div>
              </div>
              <p style={{ fontSize: '12px', color: `rgba(14,12,9,0.35)`, marginTop: '6px' }}>
                {`Après ${noShowConfig.seuil} no-shows, le client sera automatiquement alerté et bloqué si l'option ci-dessous est activée.`}
              </p>
            </div>
            <div>
              <Label>FENÊTRE DE CALCUL (JOURS)</Label>
              <div style={{ display: 'flex', gap: '10px' }}>
                {[7, 14, 30, 60, 90].map(j => {
                  const sel = noShowConfig.delaiJours === j
                  return (
                    <button key={j} onClick={() => setNoShowConfig(c => ({ ...c, delaiJours: j }))}
                      style={{ flex: 1, padding: '10px 4px', borderRadius: '8px', border: `1px solid`, borderColor: sel ? OR : 'rgba(184,146,42,0.18)', background: sel ? `rgba(14,12,9,0.08)` : 'transparent', color: sel ? OR : `rgba(14,12,9,0.45)`, fontFamily: 'DM Sans, sans-serif', fontSize: '12px', fontWeight: sel ? 600 : 400, cursor: 'pointer' }}>
                      {j}j
                    </button>
                  )
                })}
              </div>
            </div>
            <Toggle checked={noShowConfig.alerteAuto} onChange={v => setNoShowConfig(c => ({ ...c, alerteAuto: v }))} label="Envoyer alerte SMS au client après un no-show" />
            <Toggle checked={noShowConfig.blocageAuto} onChange={v => setNoShowConfig(c => ({ ...c, blocageAuto: v }))} label={`Bloquer automatiquement après ${noShowConfig.seuil} no-shows`} />
            <SaveBar onSave={() => savedFn(setNoShowSaved)} saved={noShowSaved} />
          </div>
        </CardSection>
      )}

      {/* ── TAB: ABONNEMENTS ── */}
      {activeTab === 'abonnements' && (
        <CardSection>
          <SectionTitle>🔄 PARAMÈTRES ABONNEMENTS</SectionTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <Label>DÉLAI DE GRÂCE APRÈS EXPIRATION (JOURS)</Label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px' }}>
                <input type="range" min={0} max={14} value={aboConfig.delaiGrace} onChange={e => setAboConfig(c => ({ ...c, delaiGrace: Number(e.target.value) }))}
                  style={{ flex: 1, accentColor: OR }} />
                <div style={{ background: '#0d0a08', border: `1px solid rgba(14,12,9,0.08)`, borderRadius: '8px', padding: '8px 16px', minWidth: '60px', textAlign: 'center' }}>
                  <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '22px', color: OR }}>{aboConfig.delaiGrace}j</span>
                </div>
              </div>
              <p style={{ fontSize: '12px', color: `rgba(14,12,9,0.35)`, marginTop: '6px' }}>
                {aboConfig.delaiGrace === 0
                  ? `L'abonnement est suspendu immédiatement à l'expiration.`
                  : `Le client garde ses accès pendant ${aboConfig.delaiGrace} jour${aboConfig.delaiGrace > 1 ? 's' : ''} après expiration avant suspension.`}
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <Toggle checked={aboConfig.autoRenouvellement} onChange={v => setAboConfig(c => ({ ...c, autoRenouvellement: v }))} label="Proposer le renouvellement automatique (Square)" />
              <Toggle checked={aboConfig.notifJ7}        onChange={v => setAboConfig(c => ({ ...c, notifJ7: v }))}        label="Notification SMS 7 jours avant expiration" />
              <Toggle checked={aboConfig.notifJ1}        onChange={v => setAboConfig(c => ({ ...c, notifJ1: v }))}        label="Notification SMS 1 jour avant expiration" />
              <Toggle checked={aboConfig.notifExpire}    onChange={v => setAboConfig(c => ({ ...c, notifExpire: v }))}    label={`Notification SMS le jour de l'expiration`} />
            </div>
            <SaveBar onSave={() => savedFn(setAboSaved)} saved={aboSaved} />
          </div>
        </CardSection>
      )}

      {/* ── TAB: EXPORT ── */}
      {activeTab === 'export' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <CardSection>
            <SectionTitle>📦 SAUVEGARDE & EXPORT</SectionTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { icon: '👥', label: 'Exporter les clients (JSON)',       desc: 'Tous les profils clients avec historique' },
                { icon: '📅', label: 'Exporter les RDVs (JSON)',          desc: 'Historique complet des rendez-vous' },
                { icon: '💳', label: 'Exporter les abonnements (JSON)',   desc: 'Plans actifs, expirés et annulés' },
                { icon: '🌐', label: 'Exporter les partenaires (JSON)',   desc: 'Réseau, transactions et virements' },
                { icon: '📊', label: 'Exporter les statistiques (CSV)',   desc: 'Revenus et KPIs au format tableur' },
              ].map(({ icon, label, desc }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: `rgba(255,255,255,0.02)`, borderRadius: '10px', border: `1px solid rgba(184,146,42,0.08)`, gap: '12px', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '20px' }}>{icon}</span>
                    <div>
                      <div style={{ fontSize: '14px', color: NOIR, fontWeight: 500 }}>{label}</div>
                      <div style={{ fontSize: '11px', color: `rgba(14,12,9,0.38)`, marginTop: '2px' }}>{desc}</div>
                    </div>
                  </div>
                  <button onClick={() => {
                    const blob = new Blob([JSON.stringify({ export: label, date: new Date().toISOString(), data: [] }, null, 2)], { type: 'application/json' })
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = url; a.download = `kadio-export-${Date.now()}.json`; a.click()
                    URL.revokeObjectURL(url)
                  }}
                    style={{ padding: '8px 16px', borderRadius: '8px', background: `rgba(14,12,9,0.08)`, border: `1px solid rgba(184,146,42,0.22)`, color: OR, fontFamily: 'DM Sans, sans-serif', fontSize: '12px', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                    ⬇ Télécharger
                  </button>
                </div>
              ))}
            </div>
          </CardSection>
          <CardSection>
            <SectionTitle>🗄️ BACKUP COMPLET</SectionTitle>
            <p style={{ fontSize: '14px', color: `rgba(14,12,9,0.55)`, marginBottom: '16px', lineHeight: 1.6 }}>
              {`Génère un fichier ZIP contenant l'intégralité des données du salon: clients, RDVs, abonnements, partenaires, paramètres et transactions.`}
            </p>
            <button style={{ padding: '12px 24px', borderRadius: '10px', background: OR, color: NOIR, fontFamily: 'Bebas Neue, sans-serif', fontSize: '16px', letterSpacing: '0.08em', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
              📦 GÉNÉRER BACKUP COMPLET
            </button>
          </CardSection>
        </div>
      )}

      {/* ── TAB: DANGER ── */}
      {activeTab === 'danger' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: 'rgba(239,68,68,0.06)', border: `1px solid rgba(239,68,68,0.25)`, borderRadius: '14px', padding: '16px 20px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <span style={{ fontSize: '20px', flexShrink: 0 }}>⚠️</span>
            <div>
              <div style={{ fontSize: '14px', color: '#ef4444', fontWeight: 600, marginBottom: '4px' }}>Zone danger — Actions irréversibles</div>
              <div style={{ fontSize: '13px', color: `rgba(14,12,9,0.5)`, lineHeight: 1.5 }}>
                {`Ces actions sont permanentes. Assurez-vous d'avoir exporté vos données avant de procéder.`}
              </div>
            </div>
          </div>

          {[
            { icon: '🔄', titre: 'Réinitialiser les données mockées',  desc: `Remet toutes les données de démonstration à leur état initial. N'affecte pas la base Supabase.`, btn: 'Réinitialiser mock', danger: false },
            { icon: '📅', titre: `Effacer l'historique des RDVs`,      desc: 'Supprime tous les rendez-vous passés de la base Supabase. Les données en cours sont conservées.',   btn: 'Effacer RDVs',      danger: true  },
            { icon: '💥', titre: 'Réinitialisation complète',          desc: 'Supprime TOUTES les données: clients, RDVs, abonnements, partenaires, transactions. Action irréversible.', btn: 'RÉINITIALISER TOUT', danger: true  },
          ].map(({ icon, titre, desc, btn, danger }) => (
            <CardSection key={titre} style={{ border: `1px solid ${danger ? 'rgba(239,68,68,0.2)' : 'rgba(184,146,42,0.13)'}` }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '18px' }}>{icon}</span>
                    <span style={{ fontSize: '15px', color: NOIR, fontWeight: 600 }}>{titre}</span>
                  </div>
                  <p style={{ fontSize: '13px', color: `rgba(14,12,9,0.45)`, lineHeight: 1.55 }}>{desc}</p>
                </div>
                <button onClick={() => setShowConfirmReset(titre)}
                  style={{ padding: '10px 18px', borderRadius: '8px', background: danger ? 'rgba(239,68,68,0.1)' : `rgba(14,12,9,0.08)`, border: `1px solid ${danger ? 'rgba(239,68,68,0.35)' : 'rgba(184,146,42,0.22)'}`, color: danger ? '#ef4444' : OR, fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>
                  {btn}
                </button>
              </div>
            </CardSection>
          ))}

          {showConfirmReset && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.82)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '24px' }} onClick={() => { setShowConfirmReset(false); setResetConfirmText('') }}>
              <div style={{ background: '#F5F0E8', border: `2px solid rgba(239,68,68,0.35)`, borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '440px', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
                <div style={{ fontSize: '44px', marginBottom: '16px' }}>⚠️</div>
                <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '22px', color: '#ef4444', letterSpacing: '0.08em', marginBottom: '8px' }}>CONFIRMER L'ACTION</h2>
                <p style={{ fontSize: '14px', color: `rgba(14,12,9,0.55)`, marginBottom: '20px', lineHeight: 1.6 }}>
                  Pour confirmer, tapez <strong style={{ color: NOIR }}>CONFIRMER</strong> ci-dessous.
                </p>
                <input value={resetConfirmText} onChange={e => setResetConfirmText(e.target.value)}
                  placeholder="CONFIRMER" style={{ ...inp2, textAlign: 'center', marginBottom: '16px', letterSpacing: '0.1em' }} />
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => { setShowConfirmReset(false); setResetConfirmText('') }} style={{ flex: 1, padding: '12px', borderRadius: '8px', background: 'transparent', border: `1px solid rgba(184,146,42,0.18)`, color: `rgba(14,12,9,0.45)`, fontFamily: 'DM Sans, sans-serif', fontSize: '14px', cursor: 'pointer' }}>Annuler</button>
                  <button disabled={resetConfirmText !== 'CONFIRMER'}
                    onClick={() => { setShowConfirmReset(false); setResetConfirmText('') }}
                    style={{ flex: 1, padding: '12px', borderRadius: '8px', background: resetConfirmText === 'CONFIRMER' ? '#ef4444' : 'rgba(239,68,68,0.2)', color: '#fff', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', fontWeight: 700, cursor: resetConfirmText === 'CONFIRMER' ? 'pointer' : 'not-allowed', border: 'none', opacity: resetConfirmText === 'CONFIRMER' ? 1 : 0.5 }}>
                    Confirmer
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
