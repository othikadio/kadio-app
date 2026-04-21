import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { OR, CREME, NOIR, CARD } from '@/lib/utils'
import { useAuthStore } from '@/stores/authStore'

const NAV = [
  { to: '/client/carte',      icon: '🗺️',  label: 'Carte' },
  { to: '/client/rdv',        icon: '📅',  label: 'Mes RDV' },
  { to: '/client/abonnement', icon: '💳',  label: 'Abonnement' },
  { to: '/client/fidelite',   icon: '⭐',  label: 'Fidélité' },
  { to: '/client/profil',     icon: '👤',  label: 'Profil' },
]

export default function ClientLayout() {
  const { client, user } = useAuthStore()

  return (
    <div style={{ minHeight: '100vh', background: CREME, color: NOIR, fontFamily: `'DM Sans', sans-serif`, paddingBottom: '70px' }}>

      {/* ── Header compact ── */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: `rgba(250,250,248,0.96)`, backdropFilter: 'blur(10px)', borderBottom: `1px solid rgba(14,12,9,0.08)`, padding: '0 16px' }}>
        <div style={{ height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: `'Cormorant Garamond', serif`, fontWeight: 400, fontSize: '18px', letterSpacing: '0.08em', textTransform: 'uppercase', textIndent: '0.08em', color: '#B8922A', display: 'inline-block' }}>KADIO</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {user?.is_abonne && (
              <span style={{ fontSize: '10px', background: `rgba(184,146,42,0.15)`, color: OR, padding: '3px 8px', borderRadius: '20px', fontWeight: 600 }}>ABONNÉ</span>
            )}
            <NavLink to="/client/profil" style={{ width: '32px', height: '32px', borderRadius: '50%', background: `rgba(184,146,42,0.15)`, border: `1px solid rgba(184,146,42,0.3)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', textDecoration: 'none' }}>
              👤
            </NavLink>
          </div>
        </div>
      </header>

      {/* ── Contenu ── */}
      <main>
        <Outlet />
      </main>

      {/* ── Bottom nav ── */}
      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100, background: `rgba(250,250,248,0.97)`, backdropFilter: 'blur(12px)', borderTop: `1px solid rgba(14,12,9,0.08)`, display: 'flex' }}>
        {NAV.map(({ to, icon, label }) => (
          <NavLink key={to} to={to}
            style={({ isActive }) => ({
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              padding: '8px 4px 10px', textDecoration: 'none', gap: '3px',
              borderTop: `2px solid ${isActive ? OR : 'transparent'}`,
              color: isActive ? OR : `rgba(14,12,9,0.45)`,
            })}>
            <span style={{ fontSize: '19px', lineHeight: 1 }}>{icon}</span>
            <span style={{ fontSize: '10px', fontWeight: 500 }}>{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
