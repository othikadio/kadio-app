import { useState } from 'react'
import { OR, CREME, NOIR, CARD, formatDate, statutColor } from '@/lib/utils'
import { MOCK_PARRAINAGE_AMINATA } from '@/data/mockClient'

const ETAPES = [
  { num: 1, titre: 'Partage ton code', desc: `Envoie ton code unique à tes amis par WhatsApp ou SMS` },
  { num: 2, titre: `Ton ami s'inscrit + réserve`, desc: `Il utilise ton code lors de sa première réservation` },
  { num: 3, titre: 'Tu gagnes 10 $ en crédit', desc: `Le crédit est ajouté à ton compte après son premier RDV terminé` },
  { num: 4, titre: 'Utilise tes crédits', desc: `Applique tes crédits sur ton prochain rendez-vous` },
]

function StatutBadge({ statut }) {
  const color = statutColor(statut)
  return (
    <span style={{
      display: 'inline-block', padding: '2px 8px', borderRadius: 20,
      fontSize: 10, fontWeight: 700, color,
      background: `${color}18`, border: `1px solid ${color}40`,
    }}>
      {statut.charAt(0).toUpperCase() + statut.slice(1)}
    </span>
  )
}

export default function ClientParrainage() {
  const data = MOCK_PARRAINAGE_AMINATA
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(data.code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const waMessage = encodeURIComponent(
    `Rejoins Kadio — la meilleure app de coiffure afro ! Utilise mon code ${data.code} pour ta première réservation. Télécharge l'app : https://kadio.ca`
  )
  const waLink = `https://wa.me/?text=${waMessage}`

  return (
    <div style={{ fontFamily: `'DM Sans', sans-serif`, background: CREME, minHeight: '100vh', paddingBottom: 100 }}>

      {/* Header */}
      <div style={{ padding: '24px 20px 16px', borderBottom: '1px solid rgba(14,12,9,0.08)' }}>
        <h1 style={{ color: NOIR, fontSize: 22, fontWeight: 700, margin: 0 }}>Programme de parrainage</h1>
        <p style={{ color: 'rgba(14,12,9,0.45)', fontSize: 13, margin: '4px 0 0' }}>
          Invite tes amis, gagne des crédits
        </p>
      </div>

      <div style={{ padding: '20px 16px' }}>

        {/* Credits banner */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(184,146,42,0.18) 0%, rgba(184,146,42,0.05) 100%)',
          border: `2px solid ${OR}`,
          borderRadius: 16,
          padding: '20px 20px',
          marginBottom: 20,
          textAlign: 'center',
        }}>
          <div style={{ color: 'rgba(14,12,9,0.5)', fontSize: 13, marginBottom: 6 }}>
            Crédits disponibles
          </div>
          <div style={{ color: OR, fontWeight: 800, fontSize: 42, lineHeight: 1.1 }}>
            {data.credits_disponibles * 10} $
          </div>
          <div style={{ color: 'rgba(14,12,9,0.4)', fontSize: 12, marginTop: 4 }}>
            {data.credits_disponibles} crédit{data.credits_disponibles > 1 ? 's' : ''} · 10 $/crédit
          </div>
        </div>

        {/* Code card */}
        <div style={{
          background: CARD,
          border: `1.5px solid rgba(14,12,9,0.08)`,
          borderRadius: 14,
          padding: '18px 18px',
          marginBottom: 20,
        }}>
          <div style={{ color: 'rgba(14,12,9,0.5)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>
            Votre code de parrainage
          </div>
          <div style={{
            fontFamily: 'monospace',
            fontSize: 24,
            fontWeight: 700,
            color: OR,
            letterSpacing: '0.12em',
            padding: '12px 0',
            borderTop: '1px dashed rgba(184,146,42,0.25)',
            borderBottom: '1px dashed rgba(184,146,42,0.25)',
            textAlign: 'center',
            marginBottom: 14,
          }}>
            {data.code}
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={handleCopy}
              style={{
                flex: 1,
                padding: '11px 0',
                background: copied ? 'rgba(34,197,94,0.15)' : 'rgba(14,12,9,0.08)',
                border: `1.5px solid ${copied ? 'rgba(34,197,94,0.4)' : 'rgba(14,12,9,0.08)'}`,
                borderRadius: 10,
                color: copied ? '#22c55e' : OR,
                fontWeight: 700,
                fontSize: 13,
                cursor: 'pointer',
                fontFamily: `'DM Sans', sans-serif`,
                transition: 'all 0.2s',
              }}
            >
              {copied ? '✓ Copié !' : 'Copier le code'}
            </button>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                flex: 1,
                padding: '11px 0',
                background: 'rgba(37,211,102,0.12)',
                border: '1.5px solid rgba(37,211,102,0.35)',
                borderRadius: 10,
                color: '#25D366',
                fontWeight: 700,
                fontSize: 13,
                cursor: 'pointer',
                fontFamily: `'DM Sans', sans-serif`,
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
              }}
            >
              WhatsApp
            </a>
          </div>
        </div>

        {/* Filleuls */}
        {data.filleuls.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h2 style={{ color: 'rgba(14,12,9,0.5)', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', margin: 0 }}>
                Mes filleuls ({data.filleuls.length})
              </h2>
              <span style={{ color: OR, fontSize: 13, fontWeight: 700 }}>
                +{data.total_gagne} $ gagnés
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {data.filleuls.map(f => (
                <div
                  key={f.id}
                  style={{
                    background: CARD,
                    border: '1px solid rgba(14,12,9,0.08)',
                    borderRadius: 12,
                    padding: '13px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ color: NOIR, fontWeight: 600, fontSize: 14, marginBottom: 4 }}>
                      {f.prenom}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <StatutBadge statut={f.statut} />
                      <span style={{ color: 'rgba(14,12,9,0.4)', fontSize: 11 }}>
                        Inscrit le {formatDate(f.date_inscription)}
                      </span>
                    </div>
                  </div>
                  <div style={{ color: '#22c55e', fontWeight: 700, fontSize: 15 }}>
                    +{f.credit_gagne} $
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4 étapes */}
        <div>
          <h2 style={{ color: 'rgba(14,12,9,0.5)', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 14 }}>
            Comment ça marche
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {ETAPES.map(e => (
              <div
                key={e.num}
                style={{
                  background: CARD,
                  border: '1px solid rgba(14,12,9,0.08)',
                  borderRadius: 12,
                  padding: '14px 16px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 14,
                }}
              >
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: 'rgba(14,12,9,0.08)',
                  border: `1.5px solid ${OR}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: OR, fontWeight: 800, fontSize: 14,
                  flexShrink: 0,
                }}>
                  {e.num}
                </div>
                <div>
                  <div style={{ color: NOIR, fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{e.titre}</div>
                  <div style={{ color: 'rgba(14,12,9,0.5)', fontSize: 13 }}>{e.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
