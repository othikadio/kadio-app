import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { OR, CREME, NOIR, CARD, initiales } from '@/lib/utils'
import { useAuthStore } from '@/stores/authStore'

const LANGUES = [
  { code: 'fr', label: 'Français' },
  { code: 'en', label: 'English' },
  { code: 'wo', label: 'Wolof' },
  { code: 'ml', label: 'Malinké' },
  { code: 'di', label: 'Dioula' },
  { code: 'ht', label: 'Créole haïtien' },
  { code: 'ff', label: 'Fulfuldé' },
  { code: 'bm', label: 'Bambara' },
  { code: 'ln', label: 'Lingala' },
  { code: 'yo', label: 'Yoruba' },
  { code: 'ew', label: 'Ewondo' },
]

function Toggle({ checked, onChange, label }) {
  return (
    <div
      onClick={() => onChange(!checked)}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 0',
        cursor: 'pointer',
      }}
    >
      <span style={{ color: NOIR, fontSize: 14 }}>{label}</span>
      <div style={{
        width: 44, height: 24, borderRadius: 12,
        background: checked ? OR : 'rgba(14,12,9,0.08)',
        border: `1.5px solid ${checked ? OR : 'rgba(184,146,42,0.25)'}`,
        position: 'relative',
        transition: 'background 0.2s',
        flexShrink: 0,
      }}>
        <div style={{
          position: 'absolute',
          top: 2, left: checked ? 22 : 2,
          width: 16, height: 16, borderRadius: '50%',
          background: checked ? NOIR : 'rgba(14,12,9,0.4)',
          transition: 'left 0.2s',
        }} />
      </div>
    </div>
  )
}

export default function ClientProfil() {
  const navigate = useNavigate()
  const { user, client, logout } = useAuthStore()

  const [prenom, setPrenom] = useState(user?.prenom || '')
  const [nom, setNom] = useState(user?.nom || '')
  const [email, setEmail] = useState(user?.email || '')
  const [langue, setLangue] = useState(user?.langue || 'fr')
  const [saved, setSaved] = useState(false)

  const [smsRappel24, setSmsRappel24] = useState(true)
  const [smsRappel2h, setSmsRappel2h] = useState(true)
  const [smsPromos, setSmsPromos] = useState(false)

  const [showPin, setShowPin] = useState(false)
  const [pinActuel, setPinActuel] = useState('')
  const [pinNouv, setPinNouv] = useState('')
  const [pinConf, setPinConf] = useState('')
  const [pinMsg, setPinMsg] = useState('')

  const [codeCopied, setCodeCopied] = useState(false)
  const [logoutConfirm, setLogoutConfirm] = useState(false)

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  function handlePinSave() {
    if (!pinActuel || !pinNouv || !pinConf) {
      setPinMsg('Tous les champs sont requis')
      return
    }
    if (pinNouv !== pinConf) {
      setPinMsg('Les PINs ne correspondent pas')
      return
    }
    if (pinNouv.length < 4) {
      setPinMsg('Le PIN doit avoir au moins 4 chiffres')
      return
    }
    setPinMsg('✓ PIN mis à jour avec succès')
    setPinActuel('')
    setPinNouv('')
    setPinConf('')
    setTimeout(() => { setPinMsg(''); setShowPin(false) }, 2000)
  }

  function handleCopyCode() {
    if (client?.code_parrainage) {
      navigator.clipboard.writeText(client.code_parrainage)
      setCodeCopied(true)
      setTimeout(() => setCodeCopied(false), 2000)
    }
  }

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <div style={{ fontFamily: `'DM Sans', sans-serif`, background: CREME, minHeight: '100vh', paddingBottom: 100 }}>

      {/* Logout confirm overlay */}
      {logoutConfirm && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 90,
          background: 'rgba(14,12,9,0.85)',
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
          fontFamily: `'DM Sans', sans-serif`,
        }}>
          <div style={{
            background: CARD, border: '1.5px solid rgba(14,12,9,0.08)',
            borderRadius: '20px 20px 0 0',
            padding: '28px 24px 36px', width: '100%', maxWidth: 480,
          }}>
            <h3 style={{ color: NOIR, fontSize: 17, fontWeight: 700, marginBottom: 8 }}>
              Se déconnecter ?
            </h3>
            <p style={{ color: 'rgba(14,12,9,0.5)', fontSize: 13, marginBottom: 20 }}>
              Vous devrez vous reconnecter avec votre numéro de téléphone.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setLogoutConfirm(false)}
                style={{
                  flex: 1, padding: '12px 0', background: 'transparent',
                  border: '1.5px solid rgba(14,12,9,0.08)', borderRadius: 12,
                  color: NOIR, fontWeight: 600, fontSize: 14, cursor: 'pointer',
                  fontFamily: `'DM Sans', sans-serif`,
                }}
              >
                Pas maintenant
              </button>
              <button
                onClick={handleLogout}
                style={{
                  flex: 1, padding: '12px 0', background: '#ef4444',
                  border: 'none', borderRadius: 12,
                  color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer',
                  fontFamily: `'DM Sans', sans-serif`,
                }}
              >
                Déconnecter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ padding: '24px 20px 16px', borderBottom: '1px solid rgba(14,12,9,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 52, height: 52, borderRadius: '50%',
            background: 'rgba(184,146,42,0.12)',
            border: `2px solid ${OR}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: 20, color: OR,
          }}>
            {initiales(user?.prenom, user?.nom)}
          </div>
          <div>
            <h1 style={{ color: NOIR, fontSize: 20, fontWeight: 700, margin: 0 }}>Mon profil</h1>
            <p style={{ color: 'rgba(14,12,9,0.45)', fontSize: 13, margin: '2px 0 0' }}>
              {user?.telephone}
            </p>
          </div>
        </div>
      </div>

      <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Info form */}
        <div style={{ background: CARD, border: '1px solid rgba(184,146,42,0.12)', borderRadius: 16, padding: '18px 16px' }}>
          <h2 style={{ color: 'rgba(14,12,9,0.5)', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 16, marginTop: 0 }}>
            Informations personnelles
          </h2>

          <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
            <div style={{ flex: 1 }}>
              <label style={{ color: 'rgba(14,12,9,0.5)', fontSize: 12, display: 'block', marginBottom: 6 }}>
                Prénom *
              </label>
              <input
                value={prenom}
                onChange={e => setPrenom(e.target.value)}
                style={{
                  width: '100%', padding: '10px 12px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(14,12,9,0.08)',
                  borderRadius: 10, color: NOIR, fontSize: 14,
                  fontFamily: `'DM Sans', sans-serif`,
                  boxSizing: 'border-box',
                  outline: 'none',
                }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ color: 'rgba(14,12,9,0.5)', fontSize: 12, display: 'block', marginBottom: 6 }}>
                Nom *
              </label>
              <input
                value={nom}
                onChange={e => setNom(e.target.value)}
                style={{
                  width: '100%', padding: '10px 12px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(14,12,9,0.08)',
                  borderRadius: 10, color: NOIR, fontSize: 14,
                  fontFamily: `'DM Sans', sans-serif`,
                  boxSizing: 'border-box',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={{ color: 'rgba(14,12,9,0.5)', fontSize: 12, display: 'block', marginBottom: 6 }}>
              Téléphone 🔒
            </label>
            <div style={{
              width: '100%', padding: '10px 12px',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(14,12,9,0.08)',
              borderRadius: 10, color: 'rgba(14,12,9,0.4)', fontSize: 14,
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <span>🔒</span>
              <span>{user?.telephone || '514-000-0001'}</span>
            </div>
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={{ color: 'rgba(14,12,9,0.5)', fontSize: 12, display: 'block', marginBottom: 6 }}>
              Courriel (optionnel)
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="votre@email.com"
              style={{
                width: '100%', padding: '10px 12px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(14,12,9,0.08)',
                borderRadius: 10, color: NOIR, fontSize: 14,
                fontFamily: `'DM Sans', sans-serif`,
                boxSizing: 'border-box',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ marginBottom: 18 }}>
            <label style={{ color: 'rgba(14,12,9,0.5)', fontSize: 12, display: 'block', marginBottom: 6 }}>
              Langue préférée
            </label>
            <select
              value={langue}
              onChange={e => setLangue(e.target.value)}
              style={{
                width: '100%', padding: '10px 12px',
                background: '#F5F0E8',
                border: '1px solid rgba(14,12,9,0.08)',
                borderRadius: 10, color: NOIR, fontSize: 14,
                fontFamily: `'DM Sans', sans-serif`,
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              {LANGUES.map(l => (
                <option key={l.code} value={l.code}>{l.label}</option>
              ))}
            </select>
          </div>

          {saved && (
            <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 8, padding: '8px 12px', color: '#4ade80', fontSize: 13, fontWeight: 600, marginBottom: 12 }}>
              ✓ Profil enregistré avec succès
            </div>
          )}

          <button
            onClick={handleSave}
            style={{
              width: '100%', padding: '12px 0',
              background: OR, color: NOIR,
              border: 'none', borderRadius: 12,
              fontWeight: 700, fontSize: 15, cursor: 'pointer',
              fontFamily: `'DM Sans', sans-serif`,
            }}
          >
            Enregistrer
          </button>
        </div>

        {/* SMS prefs */}
        <div style={{ background: CARD, border: '1px solid rgba(184,146,42,0.12)', borderRadius: 16, padding: '18px 16px' }}>
          <h2 style={{ color: 'rgba(14,12,9,0.5)', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4, marginTop: 0 }}>
            Préférences SMS
          </h2>
          <Toggle checked={smsRappel24} onChange={setSmsRappel24} label="Rappel 24h avant" />
          <div style={{ height: 1, background: 'rgba(184,146,42,0.08)' }} />
          <Toggle checked={smsRappel2h} onChange={setSmsRappel2h} label="Rappel 2h avant" />
          <div style={{ height: 1, background: 'rgba(184,146,42,0.08)' }} />
          <Toggle checked={smsPromos} onChange={setSmsPromos} label="Promos et offres spéciales" />
        </div>

        {/* Sécurité PIN */}
        <div style={{ background: CARD, border: '1px solid rgba(184,146,42,0.12)', borderRadius: 16, padding: '18px 16px' }}>
          <h2 style={{ color: 'rgba(14,12,9,0.5)', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 12, marginTop: 0 }}>
            Sécurité
          </h2>
          <button
            onClick={() => setShowPin(!showPin)}
            style={{
              width: '100%', padding: '12px 16px',
              background: 'transparent',
              border: '1px solid rgba(14,12,9,0.08)',
              borderRadius: 10, color: NOIR,
              fontWeight: 600, fontSize: 14, cursor: 'pointer',
              fontFamily: `'DM Sans', sans-serif`,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}
          >
            <span>Changer mon PIN</span>
            <span style={{ color: OR }}>{showPin ? '▲' : '▼'}</span>
          </button>

          {showPin && (
            <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <PinInput label="PIN actuel" value={pinActuel} onChange={setPinActuel} />
              <PinInput label="Nouveau PIN" value={pinNouv} onChange={setPinNouv} />
              <PinInput label="Confirmer le nouveau PIN" value={pinConf} onChange={setPinConf} />
              {pinMsg && (
                <div style={{
                  padding: '8px 12px', borderRadius: 8, fontSize: 13, fontWeight: 600,
                  color: pinMsg.startsWith('✓') ? '#4ade80' : '#f87171',
                  background: pinMsg.startsWith('✓') ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                  border: `1px solid ${pinMsg.startsWith('✓') ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
                }}>
                  {pinMsg}
                </div>
              )}
              <button
                onClick={handlePinSave}
                style={{
                  padding: '11px 0', background: OR, color: NOIR,
                  border: 'none', borderRadius: 10,
                  fontWeight: 700, fontSize: 14, cursor: 'pointer',
                  fontFamily: `'DM Sans', sans-serif`,
                }}
              >
                Mettre à jour le PIN
              </button>
            </div>
          )}
        </div>

        {/* Code parrainage */}
        {client?.code_parrainage && (
          <div style={{ background: CARD, border: '1px solid rgba(184,146,42,0.12)', borderRadius: 16, padding: '18px 16px' }}>
            <h2 style={{ color: 'rgba(14,12,9,0.5)', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 12, marginTop: 0 }}>
              Code de parrainage
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                flex: 1, padding: '10px 14px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(14,12,9,0.08)',
                borderRadius: 10,
                fontFamily: 'monospace', fontWeight: 700,
                color: OR, fontSize: 15, letterSpacing: '0.08em',
              }}>
                {client.code_parrainage}
              </div>
              <button
                onClick={handleCopyCode}
                style={{
                  padding: '10px 14px',
                  background: codeCopied ? 'rgba(34,197,94,0.15)' : 'rgba(14,12,9,0.08)',
                  border: `1px solid ${codeCopied ? 'rgba(34,197,94,0.4)' : 'rgba(184,146,42,0.25)'}`,
                  borderRadius: 10,
                  color: codeCopied ? '#22c55e' : OR,
                  fontWeight: 700, fontSize: 13, cursor: 'pointer',
                  fontFamily: `'DM Sans', sans-serif`,
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s',
                }}
              >
                {codeCopied ? '✓ Copié' : 'Copier'}
              </button>
            </div>
          </div>
        )}

        {/* Déconnexion */}
        <button
          onClick={() => setLogoutConfirm(true)}
          style={{
            width: '100%', padding: '14px 0',
            background: 'transparent',
            border: '1.5px solid rgba(239,68,68,0.4)',
            borderRadius: 12,
            color: '#ef4444',
            fontWeight: 700, fontSize: 15, cursor: 'pointer',
            fontFamily: `'DM Sans', sans-serif`,
          }}
        >
          Se déconnecter
        </button>
      </div>
    </div>
  )
}

function PinInput({ label, value, onChange }) {
  return (
    <div>
      <label style={{ color: 'rgba(14,12,9,0.5)', fontSize: 12, display: 'block', marginBottom: 6 }}>
        {label}
      </label>
      <input
        type="password"
        inputMode="numeric"
        maxLength={6}
        value={value}
        onChange={e => onChange(e.target.value.replace(/\D/g, ''))}
        placeholder="••••"
        style={{
          width: '100%', padding: '10px 12px',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(14,12,9,0.08)',
          borderRadius: 10, color: NOIR, fontSize: 16,
          fontFamily: `'DM Sans', sans-serif`,
          boxSizing: 'border-box', outline: 'none',
          letterSpacing: '0.2em',
        }}
      />
    </div>
  )
}
