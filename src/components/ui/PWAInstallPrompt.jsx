import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { OR, NOIR, CREME, CARD } from '@/lib/utils'

export default function PWAInstallPrompt() {
  const { t } = useTranslation()
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem('pwa-dismissed')) return

    const handler = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setVisible(true)
    }

    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  if (!visible) return null

  function dismiss() {
    sessionStorage.setItem('pwa-dismissed', '1')
    setVisible(false)
  }

  async function install() {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      sessionStorage.setItem('pwa-dismissed', '1')
    }
    setVisible(false)
    setDeferredPrompt(null)
  }

  return (
    <div style={{
      position: 'fixed', bottom: '88px', left: '12px', right: '12px', zIndex: 300,
      background: CARD, border: `1px solid rgba(184,146,42,0.35)`,
      borderRadius: '14px', padding: '14px 16px',
      display: 'flex', alignItems: 'center', gap: '12px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
    }}>
      <div style={{ fontSize: '28px', flexShrink: 0 }}>📲</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: '0 0 2px', fontSize: '13px', fontWeight: 700, color: OR }}>{t('pwa.installer')}</p>
        <p style={{ margin: 0, fontSize: '11px', color: `rgba(14,12,9,0.45)`, lineHeight: 1.4 }}>{t('pwa.installer_desc')}</p>
      </div>
      <button onClick={dismiss}
        style={{ background: 'none', border: 'none', color: `rgba(14,12,9,0.35)`, fontSize: '18px', cursor: 'pointer', padding: '4px', flexShrink: 0, lineHeight: 1 }}>
        ✕
      </button>
      <button onClick={install}
        style={{ background: OR, color: NOIR, border: 'none', borderRadius: '8px', padding: '8px 14px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', flexShrink: 0, fontFamily: `'DM Sans', sans-serif` }}>
        {t('pwa.installer_btn')}
      </button>
    </div>
  )
}
