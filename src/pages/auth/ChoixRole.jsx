import { useNavigate } from 'react-router-dom'
import { OR, CREME, NOIR } from '@/lib/utils'
import { useAuthStore } from '@/stores/authStore'

const ROLE_DISPLAY = {
  admin:       { icon: '⚙️',  label: 'Administration',   desc: `Gérer la plateforme Kadio`,              color: '#F59E0B' },
  client:      { icon: '💇',  label: 'Espace Client',     desc: `Réserver, gérer mes RDV et abonnement`,  color: '#10B981' },
  partenaire:  { icon: '✂️',  label: 'Espace Partenaire', desc: `Gérer mes rendez-vous et portefeuille`,   color: '#8B5CF6' },
  employe:     { icon: '💼',  label: 'Espace Employé',    desc: `Voir mon agenda et scanner les clients`,  color: '#3B82F6' },
  candidat:    { icon: '📋',  label: 'Ma Candidature',    desc: `Suivre mon processus de sélection`,       color: '#EC4899' },
  fournisseur: { icon: '📦',  label: 'Espace Fournisseur',desc: `Gérer mon catalogue et commandes`,        color: '#14B8A6' },
}

export default function ChoixRole() {
  const navigate = useNavigate()
  const { roles, setActiveRole, user } = useAuthStore()

  const activeRoles = roles.filter(r => r.statut === 'actif')

  function handleSelect(role) {
    const home = setActiveRole(role)
    navigate(home)
  }

  return (
    <div style={{ minHeight: '100vh', background: CREME, color: NOIR, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 24px', fontFamily: `'DM Sans', sans-serif` }}>

      <div style={{ fontFamily: `'Bebas Neue', sans-serif`, fontSize: '32px', color: OR, letterSpacing: '0.25em', marginBottom: '8px' }}>KADIO</div>

      <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '6px', textAlign: 'center' }}>
        Bonjour, {user?.prenom || `toi`} 👋
      </h2>
      <p style={{ color: `rgba(14,12,9,0.45)`, fontSize: '13px', marginBottom: '32px', textAlign: 'center' }}>
        Avec quel espace voulez-vous continuer ?
      </p>

      <div style={{ width: '100%', maxWidth: '420px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {activeRoles.map(({ role }) => {
          const d = ROLE_DISPLAY[role] || { icon: '👤', label: role, desc: '', color: OR }
          return (
            <button key={role} onClick={() => handleSelect(role)}
              style={{
                display: 'flex', alignItems: 'center', gap: '16px',
                padding: '18px 20px', background: `rgba(255,255,255,0.03)`,
                border: `1px solid rgba(255,255,255,0.08)`, borderRadius: '14px',
                cursor: 'pointer', textAlign: 'left', width: '100%',
                transition: 'all 0.15s',
                fontFamily: `'DM Sans', sans-serif`,
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = d.color; e.currentTarget.style.background = `${d.color}10` }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = `rgba(255,255,255,0.08)`; e.currentTarget.style.background = `rgba(255,255,255,0.03)` }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${d.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>
                {d.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '15px', fontWeight: 600, color: NOIR, marginBottom: '3px' }}>{d.label}</div>
                <div style={{ fontSize: '12px', color: `rgba(14,12,9,0.4)` }}>{d.desc}</div>
              </div>
              <span style={{ color: `rgba(14,12,9,0.25)`, fontSize: '18px' }}>›</span>
            </button>
          )
        })}
      </div>

      {activeRoles.length === 0 && (
        <p style={{ color: `rgba(14,12,9,0.4)`, fontSize: '14px', textAlign: 'center' }}>
          Aucun rôle actif trouvé.{' '}
          <button onClick={() => navigate('/connexion')} style={{ background: 'none', border: 'none', color: OR, cursor: 'pointer', fontSize: '14px' }}>
            Reconnectez-vous
          </button>
        </p>
      )}
    </div>
  )
}
