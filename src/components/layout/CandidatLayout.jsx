import { NavLink, Outlet } from 'react-router-dom'
import { OR, CREME, NOIR } from '@/lib/utils'

const NAV = [
  { to: '/candidat/statut',    icon: '📋', label: 'Statut' },
  { to: '/candidat/formation', icon: '🎓', label: 'Formation' },
  { to: '/candidat/certificat',icon: '🏆', label: 'Certificat' },
]

export default function CandidatLayout() {
  return (
    <div style={{ minHeight: '100vh', background: CREME, color: NOIR, fontFamily: `'DM Sans', sans-serif`, paddingBottom: '70px' }}>
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: `rgba(250,250,248,0.96)`, backdropFilter: 'blur(10px)', borderBottom: `1px solid rgba(14,12,9,0.08)`, padding: '0 16px' }}>
        <div style={{ height: '56px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontFamily: `'Cormorant Garamond', serif`, fontWeight: 400, fontSize: '18px', letterSpacing: '0.08em', textTransform: 'uppercase', textIndent: '0.08em', color: '#B8922A', display: 'inline-block' }}>KADIO</span>
        </div>
      </header>
      <main><Outlet /></main>
      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100, background: `rgba(250,250,248,0.97)`, backdropFilter: 'blur(12px)', borderTop: `1px solid rgba(14,12,9,0.08)`, display: 'flex' }}>
        {NAV.map(({ to, icon, label }) => (
          <NavLink key={to} to={to}
            style={({ isActive }) => ({ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '8px 4px 10px', textDecoration: 'none', gap: '3px', borderTop: `2px solid ${isActive ? OR : 'transparent'}`, color: isActive ? OR : `rgba(14,12,9,0.45)` })}>
            <span style={{ fontSize: '19px', lineHeight: 1 }}>{icon}</span>
            <span style={{ fontSize: '10px', fontWeight: 500 }}>{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
