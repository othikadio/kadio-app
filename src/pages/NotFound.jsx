import { Link } from 'react-router-dom'
import { NOIR, CREME, OR } from '@/lib/utils'

export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', background: CREME, color: NOIR, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: `'DM Sans', sans-serif`, gap: '16px' }}>
      <span style={{ fontFamily: `'Bebas Neue', sans-serif`, fontSize: '80px', color: OR, lineHeight: 1 }}>404</span>
      <p style={{ color: `rgba(14,12,9,0.45)`, fontSize: '14px' }}>Page introuvable</p>
      <Link to="/" style={{ color: OR, fontSize: '13px' }}>Retour à l&apos;accueil</Link>
    </div>
  )
}
