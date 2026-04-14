import { useAuthStore } from '@/stores/authStore'
import { usePartenaireProfil } from '@/hooks'
import { OR, CREME, NOIR, CARD } from '@/lib/utils'

const CONDITIONS_ELITE = [
  { label: '100 services rendus', done: true, detail: '87/100' },
  { label: 'Note ≥ 4.7', done: true, detail: '4.8 ✓' },
  { label: `6 mois d'ancienneté`, done: true, detail: 'OK ✓' },
  { label: 'Certification formation avancée', done: false, detail: 'En cours' },
]

function niveauBadgeStyle(niveau) {
  if (niveau === 'certifie') return { background: `rgba(14,12,9,0.08)`, color: OR, border: `1px solid ${OR}` }
  if (niveau === 'elite') return { background: 'rgba(139,92,246,0.15)', color: '#8B5CF6', border: '1px solid #8B5CF6' }
  if (niveau === 'ambassadeur') return { background: 'linear-gradient(135deg,rgba(14,12,9,0.08),rgba(139,92,246,0.2))', color: OR, border: `1px solid ${OR}` }
  return { background: 'rgba(107,114,128,0.2)', color: '#9ca3af', border: '1px solid #6b7280' }
}

function niveauLabel(n) {
  const MAP = { certifie: 'Certifié ✓', elite: 'Élite ★', ambassadeur: 'Ambassadeur 👑', partenaire: 'Partenaire' }
  return MAP[n] || n
}

export default function PartenaireCertificat() {
  const { partenaire } = useAuthStore()
  const userId = partenaire?.user_id || 'usr-diane'

  const { data: profil, loading } = usePartenaireProfil(userId)

  if (loading) {
    return <div style={{ fontFamily: `'DM Sans', sans-serif`, color: NOIR, padding: '16px', textAlign: 'center' }}>Chargement...</div>
  }

  const p = profil || {}
  const progression = Math.min(100, Math.round((p.total_services || 87) / 100 * 100))
  const badgeStyle = niveauBadgeStyle(p.niveau)

  return (
    <div style={{ fontFamily: `'DM Sans', sans-serif`, color: NOIR, padding: '16px', paddingBottom: '100px' }}>
      <div style={{ fontSize: '20px', fontWeight: 700, marginBottom: '20px' }}>Mon certificat</div>

      {/* Certificate card */}
      <div style={{
        background: CARD, border: `2px solid ${OR}`,
        borderRadius: '16px', padding: '24px 20px',
        marginBottom: '20px', position: 'relative', overflow: 'hidden',
      }}>
        {/* Gold glow */}
        <div style={{
          position: 'absolute', top: '-40px', right: '-40px',
          width: '150px', height: '150px', borderRadius: '50%',
          background: `radial-gradient(circle, rgba(184,146,42,0.08) 0%, transparent 70%)`,
        }} />

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <div style={{
            fontFamily: `'Bebas Neue', sans-serif`, fontSize: '28px',
            color: OR, letterSpacing: '0.3em',
          }}>
            KADIO COIFFURE
          </div>
          <div style={{
            fontSize: '11px', letterSpacing: '0.15em', color: `rgba(184,146,42,0.7)`,
            fontWeight: 600, marginTop: '4px',
          }}>
            CERTIFICAT DE PARTENAIRE CERTIFIÉ
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: `linear-gradient(90deg, transparent, ${OR}, transparent)`, marginBottom: '16px' }} />

        {/* Name */}
        <div style={{ textAlign: 'center', marginBottom: '12px' }}>
          <div style={{ fontSize: '26px', fontWeight: 700, color: NOIR }}>
            {p.prenom} {p.nom}
          </div>
          <div style={{ fontSize: '13px', color: `rgba(184,146,42,0.7)`, marginTop: '4px' }}>
            {(p.specialites || ['Tresses', 'Knotless', 'Locs']).join(' · ')}
          </div>
        </div>

        {/* Date */}
        <div style={{ textAlign: 'center', fontSize: '12px', color: `rgba(14,12,9,0.5)`, marginBottom: '16px' }}>
          Certifié(e) depuis le 1er janvier 2026
        </div>

        {/* Seal */}
        <div style={{ textAlign: 'center', fontSize: '36px', marginBottom: '16px' }}>🏆</div>

        {/* QR code placeholder */}
        <div style={{
          display: 'flex', justifyContent: 'center', marginBottom: '16px',
        }}>
          <div style={{
            fontFamily: 'monospace', fontSize: '12px', color: OR,
            background: `rgba(184,146,42,0.08)`, padding: '8px 14px',
            borderRadius: '8px', border: `1px solid rgba(184,146,42,0.25)`,
            letterSpacing: '0.05em',
          }}>
            KADIO-CERT-DIANE-001
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: `linear-gradient(90deg, transparent, ${OR}, transparent)`, marginBottom: '12px' }} />

        {/* Footer */}
        <div style={{ textAlign: 'center', fontSize: '10px', color: `rgba(184,146,42,0.5)`, letterSpacing: '0.1em' }}>
          KADIO COIFFURE &amp; ESTHÉTIQUE · kadio.ca
        </div>

        {/* Statut badge */}
        <div style={{ position: 'absolute', top: '16px', right: '16px' }}>
          <span style={{
            fontSize: '10px', fontWeight: 700, padding: '3px 10px', borderRadius: '999px',
            background: p.certificat_actif ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
            color: p.certificat_actif ? '#22c55e' : '#ef4444',
            border: `1px solid ${p.certificat_actif ? '#22c55e' : '#ef4444'}`,
          }}>
            {p.certificat_actif ? 'ACTIF' : 'SUSPENDU'}
          </span>
        </div>
      </div>

      {/* Niveau badge */}
      <div style={{ background: CARD, borderRadius: '14px', padding: '16px', marginBottom: '16px', border: `1px solid rgba(14,12,9,0.08)` }}>
        <div style={{ fontSize: '13px', color: `rgba(14,12,9,0.5)`, marginBottom: '10px' }}>Niveau actuel</div>
        <span style={{
          ...badgeStyle,
          fontSize: '14px', fontWeight: 700, padding: '6px 16px', borderRadius: '999px',
          display: 'inline-block',
        }}>
          {niveauLabel(p.niveau)}
        </span>
      </div>

      {/* Progression vers Elite */}
      <div style={{ background: CARD, borderRadius: '14px', padding: '16px', border: `1px solid rgba(14,12,9,0.08)` }}>
        <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '14px', color: OR }}>
          Progression vers Élite ★
        </div>

        {/* Conditions */}
        {CONDITIONS_ELITE.map((c, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <span style={{ fontSize: '16px', flexShrink: 0 }}>{c.done ? '✅' : '❌'}</span>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: '13px', color: c.done ? CREME : `rgba(14,12,9,0.5)` }}>{c.label}</span>
              <span style={{ fontSize: '12px', color: c.done ? '#22c55e' : '#f59e0b', marginLeft: '8px' }}>
                ({c.detail})
              </span>
            </div>
          </div>
        ))}

        {/* Progress bar */}
        <div style={{ marginTop: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '12px', color: `rgba(14,12,9,0.5)` }}>Progression globale</span>
            <span style={{ fontSize: '12px', fontWeight: 700, color: OR }}>{progression}%</span>
          </div>
          <div style={{ height: '8px', background: `rgba(14,12,9,0.08)`, borderRadius: '999px', overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: `${progression}%`,
              background: `linear-gradient(90deg, ${OR}, rgba(184,146,42,0.6))`,
              borderRadius: '999px', transition: 'width 0.5s',
            }} />
          </div>
        </div>
      </div>
    </div>
  )
}
