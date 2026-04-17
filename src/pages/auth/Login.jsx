import { useState, useRef, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { OR, CREME, NOIR, CARD } from '@/lib/utils'
import { useAuthStore } from '@/stores/authStore'

// Mode demo activé tant que Supabase n'est pas en place
const IS_DEV = true

const inputStyle = {
  width: '100%', padding: '14px 16px', background: `rgba(255,255,255,0.05)`,
  border: `1px solid rgba(14,12,9,0.08)`, borderRadius: '10px',
  color: NOIR, fontSize: '16px', fontFamily: `'DM Sans', sans-serif`,
  outline: 'none', boxSizing: 'border-box', letterSpacing: '0.05em',
}
const btnPrimary = {
  width: '100%', padding: '14px', background: OR, color: NOIR,
  border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: 700,
  cursor: 'pointer', fontFamily: `'DM Sans', sans-serif`, letterSpacing: '0.03em',
}
const btnGhost = {
  background: 'none', border: 'none', cursor: 'pointer',
  fontFamily: `'DM Sans', sans-serif`,
}

function formatPhone(raw) {
  const d = raw.replace(/\D/g, '').slice(0, 10)
  if (d.length <= 3) return d
  if (d.length <= 6) return `${d.slice(0,3)}-${d.slice(3)}`
  return `${d.slice(0,3)}-${d.slice(3,6)}-${d.slice(6)}`
}

function OTPInput({ value, onChange, disabled }) {
  const inputs = useRef([])
  const digits = (value + '      ').slice(0, 6).split('')

  function handleChange(i, e) {
    const v = e.target.value.replace(/\D/g, '').slice(-1)
    const arr = (value + '      ').slice(0, 6).split('')
    arr[i] = v
    onChange(arr.join('').trimEnd().replace(/ /g, ''))
    if (v && i < 5) inputs.current[i + 1]?.focus()
  }

  function handleKey(i, e) {
    if (e.key === 'Backspace') {
      const arr = (value + '      ').slice(0, 6).split('')
      if (!arr[i] || arr[i] === ' ') {
        if (i > 0) inputs.current[i - 1]?.focus()
      } else {
        arr[i] = ''
        onChange(arr.join('').trimEnd().replace(/ /g, ''))
      }
      return
    }
    if (e.key === 'ArrowLeft' && i > 0) inputs.current[i - 1]?.focus()
    if (e.key === 'ArrowRight' && i < 5) inputs.current[i + 1]?.focus()
  }

  function handlePaste(e) {
    const p = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    onChange(p)
    inputs.current[Math.min(p.length, 5)]?.focus()
    e.preventDefault()
  }

  return (
    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
      {[0,1,2,3,4,5].map(i => {
        const d = value[i] || ''
        return (
          <input key={i} ref={el => inputs.current[i] = el}
            type="text" inputMode="numeric" maxLength={1}
            value={d} disabled={disabled}
            onChange={e => handleChange(i, e)}
            onKeyDown={e => handleKey(i, e)}
            onPaste={handlePaste}
            style={{
              width: '44px', height: '52px', textAlign: 'center',
              background: d ? `rgba(14,12,9,0.08)` : `rgba(255,255,255,0.05)`,
              border: `1.5px solid ${d ? OR : `rgba(14,12,9,0.08)`}`,
              borderRadius: '10px', color: NOIR, fontSize: '22px', fontWeight: 700,
              fontFamily: `'DM Sans', sans-serif`, outline: 'none',
              transition: 'border-color 0.15s, background 0.15s',
            }}
          />
        )
      })}
    </div>
  )
}

export default function Login() {
  const navigate = useNavigate()
  const { requestOTP, verifyOTP } = useAuthStore()

  const [step, setStep]       = useState(1)
  const [phone, setPhone]     = useState('')
  const [otp, setOtp]         = useState('')
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const [devCode, setDevCode] = useState(null)
  const [focusPhone, setFocusPhone] = useState(false)
  const [resendCd, setResendCd] = useState(0)

  useEffect(() => {
    if (resendCd <= 0) return
    const t = setTimeout(() => setResendCd(r => r - 1), 1000)
    return () => clearTimeout(t)
  }, [resendCd])

  // Auto-submit quand 6 chiffres saisis
  useEffect(() => {
    if (otp.length === 6) handleVerify()
  }, [otp])

  async function handleSendOTP(e) {
    e.preventDefault()
    const digits = phone.replace(/\D/g, '')
    if (digits.length < 10) { setError(`Numéro incomplet`); return }
    setError(''); setLoading(true)
    await new Promise(r => setTimeout(r, 600))
    const result = requestOTP(phone)
    if (IS_DEV) setDevCode(result.simCode)
    setStep(2); setResendCd(30); setLoading(false)
  }

  async function handleVerify() {
    if (otp.length < 6) return
    setError(''); setLoading(true)
    await new Promise(r => setTimeout(r, 500))
    const result = verifyOTP(otp)
    setLoading(false)
    if (!result.ok) { setError(result.error); setOtp(''); return }
    navigate(result.redirectTo)
  }

  function handleResend() {
    if (resendCd > 0) return
    setOtp(''); setError('')
    const result = requestOTP(phone)
    if (IS_DEV) setDevCode(result.simCode)
    setResendCd(30)
  }

  return (
    <div style={{ color: NOIR, fontFamily: `'DM Sans', sans-serif` }}>

      {/* Étape indicator */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '28px', justifyContent: 'center' }}>
        {[1, 2].map(n => (
          <div key={n} style={{
            width: n === step ? '24px' : '8px', height: '8px', borderRadius: '4px',
            background: n <= step ? OR : `rgba(14,12,9,0.08)`,
            transition: 'all 0.3s ease',
          }} />
        ))}
      </div>

      {step === 1 && (
        <form onSubmit={handleSendOTP}>
          <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '6px', textAlign: 'center' }}>Accéder à mon espace</h2>
          <p style={{ color: `rgba(14,12,9,0.45)`, fontSize: '13px', textAlign: 'center', marginBottom: '28px' }}>
            Entrez votre numéro — abonné ou non, vous êtes les bienvenus.
          </p>

          <label style={{ display: 'block', fontSize: '11px', color: `rgba(14,12,9,0.4)`, marginBottom: '8px', letterSpacing: '0.08em' }}>TÉLÉPHONE</label>
          <div style={{ position: 'relative', marginBottom: '16px' }}>
            <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: `rgba(14,12,9,0.35)`, fontSize: '14px', pointerEvents: 'none' }}>+1</span>
            <input
              type="tel" autoFocus required
              value={phone}
              onChange={e => { setPhone(formatPhone(e.target.value)); setError('') }}
              onFocus={() => setFocusPhone(true)}
              onBlur={() => setFocusPhone(false)}
              placeholder="514-xxx-xxxx"
              style={{ ...inputStyle, paddingLeft: '38px', ...(focusPhone ? { borderColor: OR, background: `rgba(184,146,42,0.04)` } : {}) }}
            />
          </div>

          {error && <p style={{ color: '#F87171', fontSize: '13px', marginBottom: '12px', textAlign: 'center' }}>{error}</p>}

          <button type="submit" disabled={loading} style={{ ...btnPrimary, opacity: loading ? 0.7 : 1 }}>
            {loading ? `Envoi…` : `Recevoir le code SMS`}
          </button>

          {/* Connexions rapides DEV */}
          {IS_DEV && (
            <div style={{ marginTop: '24px', padding: '14px', background: `rgba(184,146,42,0.05)`, borderRadius: '10px', border: `1px solid rgba(184,146,42,0.12)` }}>
              <p style={{ fontSize: '11px', color: OR, marginBottom: '10px', fontWeight: 700, letterSpacing: '0.05em' }}>⚡ CONNEXION RAPIDE — DEV</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                {[
                  ['514-919-5970', 'Othi', 'Admin + Client + Employé'],
                  ['514-000-0001', 'Aminata', 'Client abonnée'],
                  ['514-000-0002', 'Diane', 'Partenaire + Client'],
                  ['514-000-0003', 'Marcus', 'Employé + Client'],
                  ['514-000-0004', 'Jean', 'Fournisseur'],
                  ['514-999-9999', 'Inconnu', 'Nouveau compte'],
                ].map(([num, name, desc]) => (
                  <button key={num} type="button" onClick={() => setPhone(num)}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 10px', background: phone === num ? `rgba(14,12,9,0.08)` : 'transparent', border: `1px solid ${phone === num ? OR : `rgba(14,12,9,0.08)`}`, borderRadius: '7px', cursor: 'pointer', transition: 'all 0.15s' }}>
                    <span style={{ color: OR, fontSize: '13px', fontWeight: 600 }}>{num}</span>
                    <span style={{ color: `rgba(14,12,9,0.5)`, fontSize: '11px' }}>{name} · {desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: `rgba(14,12,9,0.3)` }}>
            Nouveau sur Kadio ?{' '}
            <Link to="/inscription" style={{ color: OR, textDecoration: 'none' }}>Créer un compte</Link>
          </p>
        </form>
      )}

      {step === 2 && (
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '6px', textAlign: 'center' }}>Code de vérification</h2>
          <p style={{ color: `rgba(14,12,9,0.45)`, fontSize: '13px', textAlign: 'center', marginBottom: '28px' }}>
            Code envoyé au <span style={{ color: OR }}>+1 {phone}</span>
          </p>

          {/* Code simulé DEV */}
          {IS_DEV && devCode && (
            <div style={{ textAlign: 'center', marginBottom: '24px', padding: '14px', background: `rgba(184,146,42,0.06)`, borderRadius: '10px', border: `1px solid rgba(14,12,9,0.08)` }}>
              <p style={{ fontSize: '11px', color: OR, marginBottom: '8px', fontWeight: 700, letterSpacing: '0.05em' }}>⚡ CODE SIMULÉ — DEV</p>
              <p style={{ fontSize: '32px', fontWeight: 700, letterSpacing: '0.35em', color: NOIR, margin: '0' }}>{devCode}</p>
              <button type="button" onClick={() => setOtp(devCode)}
                style={{ ...btnGhost, marginTop: '8px', fontSize: '12px', color: OR, textDecoration: 'underline' }}>
                Remplir automatiquement
              </button>
            </div>
          )}

          <div style={{ marginBottom: '24px' }}>
            <OTPInput value={otp} onChange={v => { setOtp(v); setError('') }} disabled={loading} />
          </div>

          {error && <p style={{ color: '#F87171', fontSize: '13px', marginBottom: '16px', textAlign: 'center' }}>{error}</p>}

          <button onClick={handleVerify} disabled={otp.length < 6 || loading}
            style={{ ...btnPrimary, opacity: (otp.length < 6 || loading) ? 0.5 : 1, marginBottom: '16px' }}>
            {loading ? `Vérification…` : `Confirmer`}
          </button>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button onClick={() => { setStep(1); setOtp(''); setError('') }}
              style={{ ...btnGhost, color: `rgba(14,12,9,0.4)`, fontSize: '13px' }}>
              ← Modifier le numéro
            </button>
            <button onClick={handleResend} disabled={resendCd > 0}
              style={{ ...btnGhost, fontSize: '13px', color: resendCd > 0 ? `rgba(14,12,9,0.3)` : OR, cursor: resendCd > 0 ? 'default' : 'pointer' }}>
              {resendCd > 0 ? `Renvoyer (${resendCd}s)` : `Renvoyer`}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
