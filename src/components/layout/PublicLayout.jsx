import { useState, useEffect } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { OR, CREME, NOIR } from '@/lib/utils'
import Logo from '@/components/ui/Logo'
import LanguageSwitcher from '@/components/ui/LanguageSwitcher'
import PWAInstallPrompt from '@/components/ui/PWAInstallPrompt'

const BLACK  = '#0E0C09'
const WHITE  = '#FAFAF8'
const IVOIRE = '#F5F0E8'
const GOLD   = '#B8922A'
const MUTED  = 'rgba(14,12,9,0.45)'
const BORDER = 'rgba(14,12,9,0.08)'

const NAV = [
  { to: '/',                  label: 'Accueil' },
  { to: '/comment-ca-marche', label: `Comment ça marche` },
  { to: '/forfaits',          label: 'Forfaits' },
  { to: '/service-vip',       label: 'Service VIP' },
  { to: '/rejoindre',         label: 'Rejoindre' },
  { to: '/blog',              label: 'Blog' },
]

export default function PublicLayout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Navbar toujours claire — fond blanc translucide
  const navBg = scrolled ? 'rgba(250,250,248,0.97)' : 'rgba(250,250,248,0.85)'
  const navBorder = scrolled ? BORDER : 'transparent'

  const navLinkStyle = ({ isActive }) => ({
    fontSize: '12px', fontWeight: 500,
    textDecoration: 'none',
    color: isActive ? BLACK : MUTED,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    transition: 'color 0.3s',
    fontFamily: `'DM Sans', sans-serif`,
  })

  return (
    <div style={{ minHeight: '100vh', background: WHITE, color: BLACK, fontFamily: `'DM Sans', sans-serif` }}>

      {/* ── Navbar ── */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: navBg, backdropFilter: 'blur(16px)',
        borderBottom: `1px solid ${navBorder}`,
        transition: 'background 0.4s, border-color 0.4s',
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          <Link to="/" style={{ textDecoration: 'none' }}>
            <Logo variant="dark" size="md" />
          </Link>

          {/* Desktop nav */}
          <nav style={{ display: 'flex', gap: '28px', alignItems: 'center' }} className="hidden md:flex">
            {NAV.map(({ to, label }) => (
              <NavLink key={to} to={to} end={to === '/'} style={navLinkStyle}>{label}</NavLink>
            ))}
          </nav>

          {/* Desktop actions */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }} className="hidden md:flex">
            <Link to="/connexion" style={{
              fontSize: '11px', color: MUTED, textDecoration: 'none',
              padding: '8px 16px', border: `1px solid rgba(14,12,9,0.15)`,
              borderRadius: 0, letterSpacing: '0.08em', textTransform: 'uppercase',
            }}>
              Mon espace
            </Link>
            <Link to="/candidature" style={{
              background: BLACK, color: WHITE,
              padding: '9px 18px', borderRadius: 0,
              fontSize: '11px', fontWeight: 600, textDecoration: 'none',
              letterSpacing: '0.08em', textTransform: 'uppercase',
            }}>
              Devenir partenaire
            </Link>
          </div>

          {/* Hamburger mobile */}
          <button
            onClick={() => setMenuOpen(o => !o)}
            className="md:hidden"
            style={{ background: 'none', border: 'none', color: BLACK, cursor: 'pointer', padding: '6px' }}
            aria-label="Menu"
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              {menuOpen
                ? <><line x1="3" y1="3" x2="19" y2="19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="19" y1="3" x2="3" y2="19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>
                : <><line x1="3" y1="7" x2="19" y2="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="3" y1="15" x2="19" y2="15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>
              }
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div style={{ background: WHITE, borderTop: `1px solid ${BORDER}`, padding: '20px 24px' }}>
            {NAV.map(({ to, label }) => (
              <NavLink key={to} to={to} end={to === '/'} onClick={() => setMenuOpen(false)}
                style={({ isActive }) => ({
                  display: 'block', padding: '12px 0', fontSize: '13px', fontWeight: 500,
                  textDecoration: 'none', letterSpacing: '0.06em', textTransform: 'uppercase',
                  color: isActive ? BLACK : MUTED,
                  borderBottom: `1px solid ${BORDER}`,
                })}>
                {label}
              </NavLink>
            ))}
            <div style={{ paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link to="/connexion" onClick={() => setMenuOpen(false)} style={{
                textAlign: 'center', padding: '12px',
                border: `1px solid rgba(14,12,9,0.15)`, borderRadius: 0,
                color: BLACK, textDecoration: 'none', fontSize: '12px',
                letterSpacing: '0.08em', textTransform: 'uppercase',
              }}>
                Mon espace
              </Link>
              <Link to="/candidature" onClick={() => setMenuOpen(false)} style={{
                textAlign: 'center', padding: '12px',
                background: BLACK, borderRadius: 0,
                color: WHITE, textDecoration: 'none', fontSize: '12px',
                fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase',
              }}>
                Devenir partenaire
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ── Contenu ── */}
      <main style={{ paddingTop: '64px' }}>
        <Outlet />
      </main>

      {/* ── Footer minimaliste ivoire ── */}
      <footer style={{ background: IVOIRE, borderTop: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '64px 24px 48px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px' }}>
          <div>
            <Logo variant="dark" size="sm" style={{ marginBottom: '16px' }} />
            <p style={{ fontSize: '13px', color: MUTED, lineHeight: 1.7 }}>
              Coiffure & Esthétique<br />Longueuil, Québec
            </p>
          </div>
          <div>
            <h3 style={{ color: BLACK, marginBottom: '14px', fontSize: '11px', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase' }}>Navigation</h3>
            {NAV.map(({ to, label }) => (
              <Link key={to} to={to} style={{ display: 'block', fontSize: '13px', color: MUTED, textDecoration: 'none', marginBottom: '8px' }}>{label}</Link>
            ))}
          </div>
          <div>
            <h3 style={{ color: BLACK, marginBottom: '14px', fontSize: '11px', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase' }}>Espaces</h3>
            {[
              { to: '/connexion',   label: 'Espace client' },
              { to: '/connexion',   label: 'Portail partenaire' },
              { to: '/candidature', label: 'Devenir partenaire' },
            ].map(({ to, label }) => (
              <Link key={label} to={to} style={{ display: 'block', fontSize: '13px', color: MUTED, textDecoration: 'none', marginBottom: '8px' }}>{label}</Link>
            ))}
          </div>
          <div>
            <h3 style={{ color: BLACK, marginBottom: '14px', fontSize: '11px', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase' }}>Contact</h3>
            <p style={{ fontSize: '13px', color: MUTED, lineHeight: 1.7 }}>
              615, rue Antoinette-Robidoux<br />Local 100, Longueuil (QC)<br />J4J 2V8
            </p>
            <a href="tel:5149195970" style={{ display: 'block', marginTop: '10px', fontSize: '13px', color: BLACK, textDecoration: 'none' }}>514-919-5970</a>
          </div>
        </div>
        <div style={{ borderTop: `1px solid ${BORDER}`, padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <span style={{ fontSize: '11px', color: MUTED, letterSpacing: '0.04em' }}>{`© 2026 Kadio Coiffure & Esthétique`}</span>
          <LanguageSwitcher />
        </div>
      </footer>

      <PWAInstallPrompt />

      {/* ── WhatsApp flottant ── */}
      <a href="https://wa.me/15149195970" target="_blank" rel="noopener noreferrer"
        style={{
          position: 'fixed', bottom: '24px', right: '24px', zIndex: 200,
          width: '52px', height: '52px', background: '#25D366', borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 2px 12px rgba(0,0,0,0.15)', textDecoration: 'none',
        }}
        aria-label="WhatsApp">
        <svg viewBox="0 0 24 24" fill="white" width="24" height="24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </div>
  )
}
