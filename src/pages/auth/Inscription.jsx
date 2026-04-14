import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { OR, CREME, NOIR } from '@/lib/utils'
import { useAuthStore } from '@/stores/authStore'
import { LANGUAGES } from '@/i18n/index'

const inputStyle = (focus) => ({
  width: '100%', padding: '13px 16px', background: `rgba(255,255,255,0.05)`,
  border: `1px solid ${focus ? OR : `rgba(14,12,9,0.08)`}`,
  background: focus ? `rgba(184,146,42,0.04)` : `rgba(255,255,255,0.05)`,
  borderRadius: '10px', color: NOIR, fontSize: '15px',
  fontFamily: `'DM Sans', sans-serif`, outline: 'none', boxSizing: 'border-box',
  transition: 'border-color 0.15s',
})
const labelStyle = { display: 'block', fontSize: '11px', color: `rgba(14,12,9,0.4)`, marginBottom: '7px', letterSpacing: '0.08em' }
const fieldWrap  = { marginBottom: '14px' }

const ROLE_OPTIONS = [
  {
    value: 'client',
    icon: '💇',
    titre: 'Client',
    desc: `Je veux réserver des services de coiffure et d'esthétique`,
    badge: null,
  },
  {
    value: 'partenaire',
    icon: '✂️',
    titre: 'Partenaire coiffeur',
    desc: `Je suis professionnel(le) et je veux rejoindre le réseau Kadio`,
    badge: 'Candidature',
  },
]

export default function Inscription() {
  const navigate = useNavigate()
  const { register, _pendingPhone } = useAuthStore()

  const [form, setForm] = useState({ prenom: '', nom: '', email: '', langue: 'fr', role: 'client' })
  const [focus, setFocus] = useState({})
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Si on arrive ici sans passer par l'OTP (accès direct en dev), mock le phone
  const phone = _pendingPhone || '514-DEV-TEST'

  function setField(k, v) { setForm(f => ({ ...f, [k]: v })); setError('') }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.prenom.trim()) { setError(`Le prénom est obligatoire`); return }
    if (!form.nom.trim())    { setError(`Le nom est obligatoire`); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 700))
    const result = register(form)
    setLoading(false)
    navigate(result.redirectTo)
  }

  return (
    <div style={{ color: NOIR, fontFamily: `'DM Sans', sans-serif` }}>
      <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '6px', textAlign: 'center' }}>Créer mon compte</h2>
      <p style={{ color: `rgba(14,12,9,0.4)`, fontSize: '13px', textAlign: 'center', marginBottom: '28px' }}>
        Numéro : <span style={{ color: OR }}>{phone}</span>
      </p>

      <form onSubmit={handleSubmit}>

        {/* Prénom + Nom */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
          <div>
            <label style={labelStyle}>PRÉNOM *</label>
            <input autoFocus required type="text" value={form.prenom}
              onChange={e => setField('prenom', e.target.value)}
              onFocus={() => setFocus(f => ({ ...f, prenom: true }))}
              onBlur={() => setFocus(f => ({ ...f, prenom: false }))}
              placeholder="Marie" style={inputStyle(focus.prenom)} />
          </div>
          <div>
            <label style={labelStyle}>NOM *</label>
            <input required type="text" value={form.nom}
              onChange={e => setField('nom', e.target.value)}
              onFocus={() => setFocus(f => ({ ...f, nom: true }))}
              onBlur={() => setFocus(f => ({ ...f, nom: false }))}
              placeholder="Dupont" style={inputStyle(focus.nom)} />
          </div>
        </div>

        {/* Email */}
        <div style={fieldWrap}>
          <label style={labelStyle}>EMAIL <span style={{ color: `rgba(14,12,9,0.25)` }}>(optionnel)</span></label>
          <input type="email" value={form.email}
            onChange={e => setField('email', e.target.value)}
            onFocus={() => setFocus(f => ({ ...f, email: true }))}
            onBlur={() => setFocus(f => ({ ...f, email: false }))}
            placeholder="marie@email.com" style={inputStyle(focus.email)} />
        </div>

        {/* Langue */}
        <div style={fieldWrap}>
          <label style={labelStyle}>LANGUE PRÉFÉRÉE</label>
          <select value={form.langue} onChange={e => setField('langue', e.target.value)}
            style={{ ...inputStyle(focus.langue), appearance: 'none', cursor: 'pointer' }}
            onFocus={() => setFocus(f => ({ ...f, langue: true }))}
            onBlur={() => setFocus(f => ({ ...f, langue: false }))}>
            {LANGUAGES.map(l => (
              <option key={l.code} value={l.code} style={{ background: '#F5F0E8' }}>
                {l.flag} {l.label}
              </option>
            ))}
          </select>
        </div>

        {/* Choix du rôle */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ ...labelStyle, marginBottom: '10px' }}>JE SOUHAITE…</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {ROLE_OPTIONS.map(opt => {
              const selected = form.role === opt.value
              return (
                <button key={opt.value} type="button" onClick={() => setField('role', opt.value)}
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: '14px', padding: '14px 16px',
                    background: selected ? `rgba(184,146,42,0.08)` : `rgba(255,255,255,0.03)`,
                    border: `1.5px solid ${selected ? OR : `rgba(14,12,9,0.08)`}`,
                    borderRadius: '12px', cursor: 'pointer', textAlign: 'left', width: '100%',
                    transition: 'all 0.15s',
                  }}>
                  <span style={{ fontSize: '24px', flexShrink: 0, marginTop: '2px' }}>{opt.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: selected ? OR : CREME }}>{opt.titre}</span>
                      {opt.badge && (
                        <span style={{ fontSize: '10px', background: `rgba(14,12,9,0.08)`, color: OR, padding: '2px 7px', borderRadius: '20px', fontWeight: 600 }}>
                          {opt.badge}
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: '12px', color: `rgba(14,12,9,0.45)`, margin: 0, lineHeight: 1.4 }}>{opt.desc}</p>
                  </div>
                  <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: `2px solid ${selected ? OR : `rgba(14,12,9,0.08)`}`, flexShrink: 0, marginTop: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {selected && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: OR }} />}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Info partenaire */}
        {form.role === 'partenaire' && (
          <div style={{ marginBottom: '16px', padding: '12px 14px', background: `rgba(184,146,42,0.06)`, borderRadius: '10px', border: `1px solid rgba(14,12,9,0.08)` }}>
            <p style={{ fontSize: '12px', color: `rgba(14,12,9,0.6)`, margin: 0, lineHeight: 1.5 }}>
              Une candidature sera ouverte. Notre équipe vous contactera pour valider votre profil et vous accompagner dans le processus de certification.
            </p>
          </div>
        )}

        {error && <p style={{ color: '#F87171', fontSize: '13px', marginBottom: '14px', textAlign: 'center' }}>{error}</p>}

        <button type="submit" disabled={loading}
          style={{ width: '100%', padding: '14px', background: OR, color: '#0E0C09', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: 700, cursor: loading ? 'default' : 'pointer', opacity: loading ? 0.7 : 1, fontFamily: `'DM Sans', sans-serif`, letterSpacing: '0.02em' }}>
          {loading ? `Création…` : form.role === 'partenaire' ? `Soumettre ma candidature` : `Créer mon compte`}
        </button>

        <p style={{ textAlign: 'center', marginTop: '18px', fontSize: '13px', color: `rgba(14,12,9,0.3)` }}>
          Déjà un compte ?{' '}
          <Link to="/connexion" style={{ color: OR, textDecoration: 'none' }}>Se connecter</Link>
        </p>
      </form>
    </div>
  )
}
