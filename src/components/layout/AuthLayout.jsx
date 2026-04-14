import { Link, Outlet } from 'react-router-dom'
import { NOIR, CREME } from '@/lib/utils'

export default function AuthLayout() {
  return (
    <div style={{ minHeight: '100vh', background: CREME, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: `'DM Sans', sans-serif` }}>
      <Link to="/" style={{ fontFamily: `'Cormorant Garamond', serif`, fontWeight: 400, fontSize: '32px', letterSpacing: '0.08em', textTransform: 'uppercase', textIndent: '0.08em', color: '#B8922A', textDecoration: 'none', display: 'inline-block', marginBottom: '32px' }}>
        KADIO
      </Link>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        <Outlet />
      </div>
      <p style={{ marginTop: '32px', fontSize: '12px', color: `rgba(14,12,9,0.45)`, textAlign: 'center' }}>
        {`© 2026 Kadio Coiffure & Esthétique`}
      </p>
    </div>
  )
}
