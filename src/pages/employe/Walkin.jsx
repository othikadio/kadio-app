import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRdvEmploye } from '@/hooks'
import { OR, CREME, NOIR, CARD, formatMontant } from '@/lib/utils'

const TODAY = '2026-03-28'

const SERVICES = [
  { nom: 'Coupe homme fade', prix: 35 },
  { nom: 'Coupe dégradé', prix: 40 },
  { nom: 'Barbe complète', prix: 25 },
  { nom: 'Coupe enfant', prix: 25 },
  { nom: 'Coupe + barbe', prix: 55 },
]

function getCurrentTime() {
  const now = new Date()
  const h = String(now.getHours()).padStart(2, '0')
  const m = String(now.getMinutes()).padStart(2, '0')
  return `${h}:${m}`
}

const inputStyle = {
  width: '100%',
  background: CARD,
  border: `1px solid rgba(184,146,42,0.25)`,
  borderRadius: '10px',
  padding: '12px 14px',
  color: NOIR,
  fontFamily: `'DM Sans', sans-serif`,
  fontSize: '14px',
  boxSizing: 'border-box',
  outline: 'none',
}

const labelStyle = {
  fontSize: '12px',
  color: `rgba(14,12,9,0.5)`,
  display: 'block',
  marginBottom: '6px',
  fontWeight: 600,
}

export default function EmployeWalkin() {
  const navigate = useNavigate()
  const { data: rdvList = [], loading: loadingRdv } = useRdvEmploye('emp-marcus')
  const [prenom, setPrenom] = useState('')
  const [telephone, setTelephone] = useState('')
  const [service, setService] = useState(SERVICES[0].nom)
  const [heure, setHeure] = useState(getCurrentTime)
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(null)

  const todayWalkIns = rdvList.filter(r => r.walk_in && r.date_rdv === TODAY)

  if (loadingRdv) {
    return <div className="p-8 text-center text-zinc-400">Chargement...</div>
  }

  const selectedService = SERVICES.find(s => s.nom === service) || SERVICES[0]
  const commission = selectedService.prix * 0.5

  function handleSubmit() {
    if (!prenom.trim() || !service) return
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSuccess({ prenom: prenom.trim(), service, heure, commission })
    }, 500)
  }

  function reset() {
    setPrenom('')
    setTelephone('')
    setService(SERVICES[0].nom)
    setHeure(getCurrentTime())
    setNote('')
    setSuccess(null)
  }

  return (
    <div style={{
      fontFamily: `'DM Sans', sans-serif`,
      color: NOIR,
      padding: '16px',
      paddingBottom: '100px',
    }}>
      <div style={{ fontSize: '20px', fontWeight: 700, marginBottom: '20px' }}>
        Nouveau walk-in
      </div>

      {/* ── Success card ── */}
      {success ? (
        <div>
          <div style={{
            background: 'rgba(34,197,94,0.1)',
            border: `1px solid rgba(34,197,94,0.3)`,
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '20px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '36px', marginBottom: '8px' }}>✅</div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#22c55e', marginBottom: '16px' }}>
              Walk-in créé !
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', textAlign: 'left', marginBottom: '14px' }}>
              <div>
                <div style={{ fontSize: '11px', color: `rgba(14,12,9,0.45)`, marginBottom: '2px' }}>Client</div>
                <div style={{ fontSize: '13px', fontWeight: 600 }}>{success.prenom}</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: `rgba(14,12,9,0.45)`, marginBottom: '2px' }}>Heure</div>
                <div style={{ fontSize: '13px', fontWeight: 600 }}>{success.heure}</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: `rgba(14,12,9,0.45)`, marginBottom: '2px' }}>Service</div>
                <div style={{ fontSize: '13px', fontWeight: 600 }}>{success.service}</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: `rgba(14,12,9,0.45)`, marginBottom: '2px' }}>Commission estimée</div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: OR }}>{formatMontant(success.commission)}</div>
              </div>
            </div>

            <div style={{
              background: 'rgba(139,92,246,0.15)',
              border: '1px solid rgba(139,92,246,0.3)',
              borderRadius: '8px',
              padding: '8px 12px',
              fontSize: '12px',
              color: '#a78bfa',
              textAlign: 'center',
            }}>
              Badge WALK-IN violet ajouté au RDV
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button onClick={reset} style={{
              background: OR, color: NOIR, border: 'none', borderRadius: '10px',
              padding: '14px', fontSize: '15px', fontWeight: 700, cursor: 'pointer',
              fontFamily: `'DM Sans', sans-serif`,
            }}>
              Créer un autre walk-in
            </button>
            <button onClick={() => navigate('/employe/calendrier')} style={{
              background: 'transparent', color: NOIR,
              border: `1px solid rgba(14,12,9,0.2)`, borderRadius: '10px',
              padding: '14px', fontSize: '15px', fontWeight: 700, cursor: 'pointer',
              fontFamily: `'DM Sans', sans-serif`,
            }}>
              Voir l&apos;agenda
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* ── Form ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>

            <div>
              <label style={labelStyle}>Prénom client *</label>
              <input
                value={prenom}
                onChange={e => setPrenom(e.target.value)}
                placeholder="Prénom"
                autoFocus
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Téléphone</label>
              <input
                type="tel"
                value={telephone}
                onChange={e => setTelephone(e.target.value)}
                placeholder="514-xxx-xxxx"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Service *</label>
              <select
                value={service}
                onChange={e => setService(e.target.value)}
                style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}
              >
                {SERVICES.map(s => (
                  <option key={s.nom} value={s.nom}>{s.nom} — {s.prix} $</option>
                ))}
              </select>
            </div>

            <div>
              <label style={labelStyle}>Heure</label>
              <input
                type="time"
                value={heure}
                onChange={e => setHeure(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Note (optionnel)</label>
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                rows={2}
                placeholder="Note optionnelle…"
                style={{ ...inputStyle, resize: 'vertical' }}
              />
            </div>

            {/* Commission preview */}
            <div style={{
              background: `rgba(184,146,42,0.07)`,
              border: `1px solid rgba(14,12,9,0.08)`,
              borderRadius: '10px',
              padding: '12px 14px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <span style={{ fontSize: '13px', color: `rgba(14,12,9,0.6)` }}>Commission estimée (50%)</span>
              <span style={{ fontSize: '15px', fontWeight: 700, color: OR }}>{formatMontant(commission)}</span>
            </div>

            <button
              onClick={handleSubmit}
              disabled={!prenom.trim() || loading}
              style={{
                background: prenom.trim() && !loading ? OR : 'rgba(14,12,9,0.08)',
                color: prenom.trim() && !loading ? NOIR : `rgba(14,12,9,0.3)`,
                border: 'none', borderRadius: '10px', padding: '14px',
                fontSize: '15px', fontWeight: 700,
                cursor: prenom.trim() && !loading ? 'pointer' : 'default',
                fontFamily: `'DM Sans', sans-serif`,
              }}
            >
              {loading ? `Création…` : `Créer le walk-in`}
            </button>
          </div>

          {/* ── Today's walk-ins ── */}
          {todayWalkIns.length > 0 && (
            <div>
              <div style={{
                fontSize: '13px', fontWeight: 700, color: `rgba(14,12,9,0.4)`,
                textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px',
              }}>
                {`Walk-ins d'aujourd'hui`}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {todayWalkIns.map(rdv => (
                  <div key={rdv.id} style={{
                    background: CARD,
                    borderRadius: '12px',
                    padding: '12px 14px',
                    border: `1px solid rgba(139,92,246,0.25)`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  }}>
                    <span style={{ fontSize: '18px' }}>🚶</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '2px' }}>
                        {rdv.client.prenom}
                        <span style={{
                          marginLeft: '8px', fontSize: '10px', fontWeight: 700,
                          background: 'rgba(139,92,246,0.2)', color: '#a78bfa',
                          padding: '2px 7px', borderRadius: '999px',
                        }}>Walk-in</span>
                      </div>
                      <div style={{ fontSize: '12px', color: `rgba(14,12,9,0.5)` }}>
                        {rdv.service.nom} · {rdv.heure_debut}
                      </div>
                    </div>
                    <div style={{
                      fontSize: '11px', fontWeight: 700, color: '#22c55e',
                      background: 'rgba(34,197,94,0.12)', padding: '3px 8px', borderRadius: '999px',
                    }}>
                      Confirmé
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
