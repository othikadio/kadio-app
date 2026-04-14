import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { OR, CREME, NOIR, CARD } from '@/lib/utils'

const VILLES_OPTIONS = ['Longueuil', 'Montréal', 'Laval', 'Brossard', 'Québec', 'Gatineau', 'Sherbrooke', 'Autre']

const LANGUES_OPTIONS = [
  'Français', 'English', 'Wolof', 'Malinké', 'Dioula',
  'Haïtien', 'Fulfuldé', 'Bambara', 'Lingala', 'Yoruba', 'Ewondo',
]

const SPECIALITES_OPTIONS = [
  'Tresses classiques', 'Knotless braids', 'Locs installation',
  'Locs entretien', 'Barbier', 'Coupes enfants',
  'Tissage', 'Crochet braids', 'Soins',
]

const JOURS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']

const REFERENCES = [
  'Bouche à oreille', 'Instagram', 'TikTok',
  'Google', 'Salon de coiffure', 'Autre',
]

const inputStyle = {
  width: '100%', padding: '11px 14px', borderRadius: 8,
  background: '#0f0c09', border: `1px solid rgba(184,146,42,0.25)`,
  color: NOIR, fontSize: 14, outline: 'none', boxSizing: 'border-box',
}

const labelStyle = {
  color: 'rgba(14,12,9,0.75)', fontSize: 13, fontWeight: 500,
  display: 'block', marginBottom: 6,
}

export default function Candidature() {
  const navigate = useNavigate()

  const [step, setStep] = useState(1)
  const [confirmed, setConfirmed] = useState(false)
  const [errors, setErrors] = useState({})

  const [form, setForm] = useState({
    // Step 1
    prenom: '',
    nom: '',
    telephone: '',
    email: '',
    ville: '',
    langue: 'Français',
    // Step 2
    specialites: [],
    experience: 0,
    modeAvec: '',
    voiture: '',
    disponibilites: [],
    // Step 3
    motivation: '',
    instagram: '',
    tiktok: '',
    reference: '',
  })

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const toggleArr = (key, val) => {
    setForm(f => {
      const arr = f[key]
      return { ...f, [key]: arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val] }
    })
  }

  const validateStep1 = () => {
    const e = {}
    if (!form.prenom.trim()) e.prenom = `Prénom requis`
    if (!form.nom.trim()) e.nom = `Nom requis`
    if (!form.telephone.trim()) e.telephone = `Téléphone requis`
    if (!form.ville) e.ville = `Ville requise`
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const validateStep2 = () => {
    const e = {}
    if (form.specialites.length === 0) e.specialites = `Choisis au moins une spécialité`
    if (!form.modeAvec) e.modeAvec = `Mode de travail requis`
    if (!form.voiture) e.voiture = `Réponse requise`
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const validateStep3 = () => {
    const e = {}
    if (!form.motivation.trim() || form.motivation.trim().length < 20) e.motivation = `Motivation trop courte (min. 20 caractères)`
    if (!form.reference) e.reference = `Champ requis`
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleNext = () => {
    setErrors({})
    if (step === 1 && validateStep1()) setStep(2)
    if (step === 2 && validateStep2()) setStep(3)
    if (step === 3 && validateStep3()) setConfirmed(true)
  }

  const handleBack = () => {
    setErrors({})
    setStep(s => Math.max(1, s - 1))
  }

  const fieldErr = (key) => errors[key] ? (
    <div style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>{errors[key]}</div>
  ) : null

  if (confirmed) {
    return (
      <div style={{ background: CREME, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
        <div style={{
          background: CARD, borderRadius: 20, padding: '48px 36px', maxWidth: 520, width: '100%',
          border: `2px solid ${OR}`, textAlign: 'center',
        }}>
          <div style={{ fontSize: 56, marginBottom: 20 }}>🎉</div>
          <h2 style={{
            fontFamily: `'Bebas Neue', sans-serif`,
            fontSize: 40, color: OR, margin: '0 0 16px',
          }}>
            Candidature reçue !
          </h2>
          <p style={{ color: NOIR, fontSize: 16, lineHeight: 1.7, marginBottom: 8 }}>
            Merci <strong style={{ color: OR }}>{form.prenom}</strong> !
          </p>
          <p style={{ color: 'rgba(14,12,9,0.7)', fontSize: 14, lineHeight: 1.7, marginBottom: 28 }}>
            {`Ta candidature a bien été reçue. Notre équipe te contacte dans 48h au `}
            <strong style={{ color: OR }}>{form.telephone}</strong>
            {` pour valider ton profil.`}
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href={`https://wa.me/5149195970?text=Bonjour%2C%20je%20suis%20${encodeURIComponent(form.prenom + ' ' + form.nom)}%20et%20j%27ai%20soumis%20ma%20candidature%20Kadio.`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '12px 24px', background: '#25D366', color: '#fff',
                borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none',
                display: 'inline-flex', alignItems: 'center', gap: 6,
              }}
            >
              💬 Contacter via WhatsApp
            </a>
            <button
              onClick={() => navigate('/')}
              style={{
                padding: '12px 24px', background: 'transparent', color: NOIR,
                border: `1.5px solid rgba(14,12,9,0.3)`, borderRadius: 8,
                fontSize: 14, fontWeight: 600, cursor: 'pointer',
              }}
            >
              Retour à l'accueil
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: CREME, minHeight: '100vh', fontFamily: `'Inter', sans-serif`, color: NOIR }}>

      {/* Header */}
      <div style={{
        padding: '60px 24px 40px', textAlign: 'center',
        background: `radial-gradient(ellipse at 50% 0%, rgba(184,146,42,0.08) 0%, transparent 60%)`,
        borderBottom: `1px solid rgba(184,146,42,0.12)`,
      }}>
        <h1 style={{
          fontFamily: `'Bebas Neue', sans-serif`,
          fontSize: 'clamp(36px, 7vw, 68px)',
          color: NOIR, margin: '0 0 8px',
        }}>
          Candidature partenaire
        </h1>
        <p style={{ color: 'rgba(14,12,9,0.55)', fontSize: 14 }}>
          {`3 étapes · Moins de 5 minutes · Sans engagement`}
        </p>

        {/* Progress dots */}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 24 }}>
          {[1, 2, 3].map(n => (
            <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: step >= n ? OR : 'transparent',
                border: `2px solid ${step >= n ? OR : 'rgba(14,12,9,0.08)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: 14,
                color: step >= n ? NOIR : 'rgba(14,12,9,0.4)',
              }}>
                {step > n ? '✓' : n}
              </div>
              {n < 3 && (
                <div style={{
                  width: 40, height: 2,
                  background: step > n ? OR : 'rgba(14,12,9,0.08)',
                }} />
              )}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 8 }}>
          {['Identité', 'Profil', 'Motivation'].map((label, i) => (
            <div key={label} style={{
              width: 80, textAlign: 'center',
              color: step === i + 1 ? OR : 'rgba(14,12,9,0.35)',
              fontSize: 11, fontWeight: 600, letterSpacing: 0.5,
            }}>
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <div style={{ maxWidth: 620, margin: '0 auto', padding: '48px 24px 80px' }}>
        <div style={{
          background: CARD, borderRadius: 16, padding: '36px 32px',
          border: `1px solid rgba(14,12,9,0.08)`,
        }}>

          {/* ── STEP 1 ─── */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <h2 style={{ fontFamily: `'Bebas Neue', sans-serif`, fontSize: 28, color: OR, margin: 0 }}>
                Étape 1 — Identité
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={labelStyle}>Prénom *</label>
                  <input
                    type="text"
                    value={form.prenom}
                    onChange={e => set('prenom', e.target.value)}
                    placeholder="Diane"
                    style={inputStyle}
                  />
                  {fieldErr('prenom')}
                </div>
                <div>
                  <label style={labelStyle}>Nom *</label>
                  <input
                    type="text"
                    value={form.nom}
                    onChange={e => set('nom', e.target.value)}
                    placeholder="Mbaye"
                    style={inputStyle}
                  />
                  {fieldErr('nom')}
                </div>
              </div>

              <div>
                <label style={labelStyle}>Téléphone * (format canadien)</label>
                <input
                  type="tel"
                  value={form.telephone}
                  onChange={e => set('telephone', e.target.value)}
                  placeholder="514-555-1234"
                  style={inputStyle}
                />
                {fieldErr('telephone')}
              </div>

              <div>
                <label style={labelStyle}>Email (optionnel)</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => set('email', e.target.value)}
                  placeholder="diane@exemple.com"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Ville *</label>
                <select
                  value={form.ville}
                  onChange={e => set('ville', e.target.value)}
                  style={inputStyle}
                >
                  <option value="">Sélectionner une ville...</option>
                  {VILLES_OPTIONS.map(v => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
                {fieldErr('ville')}
              </div>

              <div>
                <label style={labelStyle}>Langue préférée</label>
                <select
                  value={form.langue}
                  onChange={e => set('langue', e.target.value)}
                  style={inputStyle}
                >
                  {LANGUES_OPTIONS.map(l => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* ── STEP 2 ─── */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <h2 style={{ fontFamily: `'Bebas Neue', sans-serif`, fontSize: 28, color: OR, margin: 0 }}>
                Étape 2 — Profil
              </h2>

              <div>
                <label style={{ ...labelStyle, marginBottom: 12 }}>Spécialités * (plusieurs possibles)</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 8 }}>
                  {SPECIALITES_OPTIONS.map(s => (
                    <label key={s} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={form.specialites.includes(s)}
                        onChange={() => toggleArr('specialites', s)}
                        style={{ accentColor: OR, width: 16, height: 16 }}
                      />
                      <span style={{ color: NOIR, fontSize: 13 }}>{s}</span>
                    </label>
                  ))}
                </div>
                {fieldErr('specialites')}
              </div>

              <div>
                <label style={labelStyle}>
                  {`Années d'expérience : `}<strong style={{ color: OR }}>{form.experience === 20 ? '20+' : form.experience} ans</strong>
                </label>
                <input
                  type="range"
                  min={0}
                  max={20}
                  value={form.experience}
                  onChange={e => set('experience', Number(e.target.value))}
                  style={{ width: '100%', accentColor: OR }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(14,12,9,0.4)', fontSize: 11, marginTop: 4 }}>
                  <span>0 an</span>
                  <span>10 ans</span>
                  <span>20+ ans</span>
                </div>
              </div>

              <div>
                <label style={{ ...labelStyle, marginBottom: 12 }}>Mode de travail préféré *</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {['Domicile client', 'Déplacement', 'Salon Kadio', 'Mixte'].map(m => (
                    <label key={m} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="modeAvec"
                        value={m}
                        checked={form.modeAvec === m}
                        onChange={() => set('modeAvec', m)}
                        style={{ accentColor: OR, width: 16, height: 16 }}
                      />
                      <span style={{ color: NOIR, fontSize: 14 }}>{m}</span>
                    </label>
                  ))}
                </div>
                {fieldErr('modeAvec')}
              </div>

              <div>
                <label style={{ ...labelStyle, marginBottom: 12 }}>Voiture personnelle *</label>
                <div style={{ display: 'flex', gap: 20 }}>
                  {['Oui', 'Non'].map(v => (
                    <label key={v} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="voiture"
                        value={v}
                        checked={form.voiture === v}
                        onChange={() => set('voiture', v)}
                        style={{ accentColor: OR, width: 16, height: 16 }}
                      />
                      <span style={{ color: NOIR, fontSize: 14 }}>{v}</span>
                    </label>
                  ))}
                </div>
                {fieldErr('voiture')}
              </div>

              <div>
                <label style={{ ...labelStyle, marginBottom: 12 }}>Disponibilités</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {JOURS.map(j => (
                    <button
                      key={j}
                      type="button"
                      onClick={() => toggleArr('disponibilites', j)}
                      style={{
                        padding: '7px 16px', borderRadius: 20, fontSize: 13, fontWeight: 500,
                        border: `1.5px solid ${form.disponibilites.includes(j) ? OR : 'rgba(14,12,9,0.08)'}`,
                        background: form.disponibilites.includes(j) ? OR : 'transparent',
                        color: form.disponibilites.includes(j) ? NOIR : CREME,
                        cursor: 'pointer',
                      }}
                    >
                      {j}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 3 ─── */}
          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <h2 style={{ fontFamily: `'Bebas Neue', sans-serif`, fontSize: 28, color: OR, margin: 0 }}>
                Étape 3 — Motivation
              </h2>

              <div>
                <label style={labelStyle}>
                  Motivation * — {form.motivation.length}/500
                </label>
                <textarea
                  value={form.motivation}
                  onChange={e => set('motivation', e.target.value.slice(0, 500))}
                  placeholder={`Dis-nous pourquoi tu veux rejoindre Kadio et ce que tu apportes à la communauté...`}
                  rows={5}
                  style={{ ...inputStyle, resize: 'vertical', minHeight: 110, lineHeight: 1.6 }}
                />
                {fieldErr('motivation')}
              </div>

              <div>
                <label style={labelStyle}>Instagram (optionnel)</label>
                <input
                  type="text"
                  value={form.instagram}
                  onChange={e => set('instagram', e.target.value)}
                  placeholder="@ton_handle"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>TikTok (optionnel)</label>
                <input
                  type="text"
                  value={form.tiktok}
                  onChange={e => set('tiktok', e.target.value)}
                  placeholder="@ton_tiktok"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>{`Comment as-tu entendu parler de Kadio ? *`}</label>
                <select
                  value={form.reference}
                  onChange={e => set('reference', e.target.value)}
                  style={inputStyle}
                >
                  <option value="">Sélectionner...</option>
                  {REFERENCES.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
                {fieldErr('reference')}
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32, gap: 12 }}>
            {step > 1 ? (
              <button
                onClick={handleBack}
                style={{
                  padding: '12px 24px', background: 'transparent', color: NOIR,
                  border: `1.5px solid rgba(14,12,9,0.25)`, borderRadius: 8,
                  fontSize: 14, fontWeight: 600, cursor: 'pointer',
                }}
              >
                ← Précédent
              </button>
            ) : (
              <div />
            )}
            <button
              onClick={handleNext}
              style={{
                padding: '12px 32px', background: OR, color: NOIR,
                border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: 'pointer',
              }}
            >
              {step === 3 ? `Envoyer ma candidature` : `Suivant →`}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
