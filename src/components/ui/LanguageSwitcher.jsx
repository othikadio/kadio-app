import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { LANGUAGES } from '@/i18n/index'
import { OR, NOIR, CREME, CARD, BORDER_OR } from '@/lib/utils'

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  const current = LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES[0]

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function select(code) {
    i18n.changeLanguage(code)
    localStorage.setItem('kadio-lang', code)
    setOpen(false)
  }

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          background: 'none', border: `1px solid ${BORDER_OR}`, borderRadius: '8px',
          color: NOIR, cursor: 'pointer', padding: '6px 10px',
          fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px',
          fontFamily: `'DM Sans', sans-serif`,
        }}
        aria-label="Changer de langue"
      >
        <span>{current.flag}</span>
        <span style={{ maxWidth: '64px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{current.label}</span>
        <span style={{ fontSize: '10px', opacity: 0.6 }}>{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div style={{
          position: 'absolute', bottom: '110%', left: 0, zIndex: 400,
          background: CARD, border: `1px solid ${BORDER_OR}`, borderRadius: '12px',
          minWidth: '160px', overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        }}>
          {LANGUAGES.map(lang => (
            <button
              key={lang.code}
              onClick={() => select(lang.code)}
              style={{
                width: '100%', background: lang.code === i18n.language ? `rgba(184,146,42,0.12)` : 'none',
                border: 'none', borderBottom: `1px solid rgba(184,146,42,0.07)`,
                color: lang.code === i18n.language ? OR : NOIR,
                cursor: 'pointer', padding: '10px 14px', fontSize: '13px', fontWeight: lang.code === i18n.language ? 700 : 400,
                display: 'flex', alignItems: 'center', gap: '8px', textAlign: 'left',
                fontFamily: `'DM Sans', sans-serif`,
              }}
            >
              <span>{lang.flag}</span>
              <span>{lang.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
