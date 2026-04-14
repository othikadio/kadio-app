import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { OR, CREME, NOIR, CARD } from '@/lib/utils'
import { useAuthStore } from '@/stores/authStore'

const NAV_SECTIONS = [
  {
    label: `Vue d'ensemble`,
    items: [
      { to: '/admin/dashboard',   icon: '📊', label: 'Dashboard' },
      { to: '/admin/calendrier',  icon: '📅', label: 'Calendrier' },
    ],
  },
  {
    label: 'Personnes',
    items: [
      { to: '/admin/clients',     icon: '👥', label: 'Clients' },
      { to: '/admin/employes',    icon: '💼', label: 'Employés' },
      { to: '/admin/partenaires', icon: '🤝', label: 'Partenaires' },
      { to: '/admin/candidats',   icon: '📋', label: 'Candidats' },
      { to: '/admin/fournisseurs',icon: '📦', label: 'Fournisseurs' },
    ],
  },
  {
    label: 'Services & Produits',
    items: [
      { to: '/admin/services',    icon: '✂️',  label: 'Services' },
      { to: '/admin/produits',    icon: '🧴',  label: 'Produits' },
      { to: '/admin/chaises',     icon: '💺',  label: 'Chaises' },
    ],
  },
  {
    label: 'Finance',
    items: [
      { to: '/admin/transactions',icon: '💰', label: 'Transactions' },
      { to: '/admin/abonnements', icon: '💳', label: 'Abonnements' },
      { to: '/admin/virements',   icon: '🏦', label: 'Virements' },
    ],
  },
  {
    label: 'Contenu',
    items: [
      { to: '/admin/blog',        icon: '📝', label: 'Blog' },
      { to: '/admin/sms',         icon: '💬', label: 'SMS' },
      { to: '/admin/formation',   icon: '🎓', label: 'Formation' },
    ],
  },
  {
    label: 'Système',
    items: [
      { to: '/admin/config',      icon: '⚙️',  label: 'Configuration' },
      { to: '/admin/stats',       icon: '📈', label: 'Stats avancées' },
    ],
  },
]

const SIDEBAR_W = 240

export default function AdminLayout() {
  const { user } = useAuthStore()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const navigate = useNavigate()

  const SidebarContent = () => (
    <div style={{ padding: '16px 0', overflowY: 'auto', height: '100%' }}>
      {NAV_SECTIONS.map(({ label, items }) => (
        <div key={label} style={{ marginBottom: '8px' }}>
          <div style={{ padding: '6px 20px', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', color: `rgba(14,12,9,0.45)`, textTransform: 'uppercase' }}>{label}</div>
          {items.map(({ to, icon, label: lbl }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setDrawerOpen(false)}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '9px 20px', textDecoration: 'none', fontSize: '13px', fontWeight: 500,
                color: isActive ? OR : `rgba(14,12,9,0.7)`,
                background: isActive ? `rgba(184,146,42,0.08)` : 'transparent',
                borderRight: isActive ? `3px solid ${OR}` : '3px solid transparent',
                transition: 'all 0.15s',
              })}>
              <span style={{ fontSize: '15px', width: '20px', textAlign: 'center' }}>{icon}</span>
              {lbl}
            </NavLink>
          ))}
        </div>
      ))}
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: CREME, color: NOIR, fontFamily: `'DM Sans', sans-serif`, display: 'flex' }}>

      {/* ── Sidebar desktop ── */}
      <aside style={{ width: `${SIDEBAR_W}px`, minHeight: '100vh', background: `#F5F0E8`, borderRight: `1px solid rgba(14,12,9,0.08)`, position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 40, display: 'flex', flexDirection: 'column' }}
        className="admin-sidebar-desktop">
        <div style={{ padding: '18px 20px', borderBottom: `1px solid rgba(14,12,9,0.08)`, flexShrink: 0 }}>
          <div style={{ fontFamily: `'Cormorant Garamond', serif`, fontWeight: 400, fontSize: '18px', letterSpacing: '0.08em', textTransform: 'uppercase', textIndent: '0.08em', color: '#B8922A', display: 'inline-block' }}>KADIO</div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <SidebarContent />
        </div>
        <div style={{ padding: '14px 20px', borderTop: `1px solid rgba(14,12,9,0.08)`, fontSize: '12px', color: `rgba(14,12,9,0.45)` }}>
          {user?.prenom || `Admin`}
        </div>
      </aside>

      {/* ── Mobile drawer overlay ── */}
      {drawerOpen && (
        <div
          onClick={() => setDrawerOpen(false)}
          style={{ position: 'fixed', inset: 0, zIndex: 80, background: `rgba(0,0,0,0.6)`, backdropFilter: 'blur(4px)' }}
        />
      )}

      {/* ── Mobile drawer ── */}
      <aside style={{
        position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 90,
        width: `${SIDEBAR_W}px`, background: `#F5F0E8`,
        borderRight: `1px solid rgba(14,12,9,0.08)`,
        transform: drawerOpen ? 'translateX(0)' : `translateX(-${SIDEBAR_W}px)`,
        transition: 'transform 0.25s ease',
        display: 'flex', flexDirection: 'column',
      }}
        className="admin-sidebar-mobile">
        <div style={{ padding: '18px 20px', borderBottom: `1px solid rgba(14,12,9,0.08)`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: `'Cormorant Garamond', serif`, fontWeight: 400, fontSize: '18px', letterSpacing: '0.08em', textTransform: 'uppercase', textIndent: '0.08em', color: '#B8922A', display: 'inline-block' }}>KADIO</span>
          <button onClick={() => setDrawerOpen(false)} style={{ background: 'none', border: 'none', color: NOIR, fontSize: '18px', cursor: 'pointer', padding: '4px' }}>✕</button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <SidebarContent />
        </div>
      </aside>

      {/* ── Main content ── */}
      <div style={{ flex: 1, marginLeft: `${SIDEBAR_W}px`, minHeight: '100vh', display: 'flex', flexDirection: 'column' }} className="admin-main">

        {/* Top bar (mobile only) */}
        <header style={{ position: 'sticky', top: 0, zIndex: 30, background: `rgba(250,250,248,0.96)`, backdropFilter: 'blur(10px)', borderBottom: `1px solid rgba(14,12,9,0.08)`, padding: '0 16px' }}
          className="admin-topbar-mobile">
          <div style={{ height: '52px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => setDrawerOpen(true)}
              style={{ background: 'none', border: 'none', color: NOIR, fontSize: '20px', cursor: 'pointer', padding: '4px 8px 4px 0' }}>
              ☰
            </button>
            <span style={{ fontFamily: `'Cormorant Garamond', serif`, fontWeight: 400, fontSize: '18px', letterSpacing: '0.08em', textTransform: 'uppercase', textIndent: '0.08em', color: '#B8922A', display: 'inline-block' }}>KADIO</span>
          </div>
        </header>

        <main style={{ flex: 1 }}><Outlet /></main>
      </div>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .admin-sidebar-desktop { display: none !important; }
          .admin-main { margin-left: 0 !important; }
          .admin-topbar-mobile { display: block; }
        }
        @media (min-width: 769px) {
          .admin-sidebar-mobile { display: none !important; }
          .admin-topbar-mobile { display: none; }
        }
      `}</style>
    </div>
  )
}
