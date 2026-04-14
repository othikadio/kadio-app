import { useEffect, useRef, useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import { OR, CREME, CARD } from '@/lib/utils'

let instanceCount = 0

/**
 * QRScanner — Composant scanner caméra pour partenaires et employés
 * Props:
 *   onScan(code: string) — appelé quand un code est détecté
 *   onFallback()         — appelé si la caméra est refusée/indisponible
 */
export default function QRScanner({ onScan, onFallback }) {
  const [status, setStatus] = useState('loading') // loading | ready | error
  const scannerRef = useRef(null)
  const divId = useRef(`kadio-qr-${++instanceCount}`)
  const scannedRef = useRef(false)

  useEffect(() => {
    let scanner = null
    let unmounted = false

    async function startScanner() {
      try {
        scanner = new Html5Qrcode(divId.current, { verbose: false })
        scannerRef.current = scanner
        await scanner.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 220, height: 220 }, aspectRatio: 1.0 },
          (decodedText) => {
            if (unmounted || scannedRef.current) return
            scannedRef.current = true
            if (navigator.vibrate) navigator.vibrate(100)
            onScan(decodedText)
          },
          () => {} // erreurs par frame — ignorées
        )
        if (!unmounted) setStatus('ready')
      } catch (_) {
        if (!unmounted) {
          setStatus('error')
          onFallback?.()
        }
      }
    }

    startScanner()

    return () => {
      unmounted = true
      if (scanner) {
        scanner.stop()
          .then(() => scanner.clear())
          .catch(() => {})
      }
    }
  }, [])

  if (status === 'error') return null

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '280px', margin: '0 auto' }}>

      {/* Loading overlay */}
      {status === 'loading' && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 2,
          background: CARD,
          borderRadius: '16px',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: '12px',
          border: `1px solid rgba(184,146,42,0.15)`,
          aspectRatio: '1',
        }}>
          <div style={{
            width: '32px', height: '32px',
            border: `2px solid rgba(184,146,42,0.2)`,
            borderTop: `2px solid ${OR}`,
            borderRadius: '50%',
            animation: 'spin 0.7s linear infinite',
          }} />
          <span style={{ color: 'rgba(14,12,9,0.45)', fontSize: '13px', fontFamily: `'DM Sans', sans-serif` }}>
            {`Accès caméra…`}
          </span>
        </div>
      )}

      {/* html5-qrcode mount point */}
      <div
        id={divId.current}
        style={{
          width: '100%',
          borderRadius: '16px',
          overflow: 'hidden',
          aspectRatio: '1',
          background: '#000',
        }}
      />

      {/* Coins dorés overlay */}
      {status === 'ready' && ['tl', 'tr', 'bl', 'br'].map(pos => {
        const isTop  = pos.startsWith('t')
        const isLeft = pos.endsWith('l')
        return (
          <div key={pos} style={{
            position: 'absolute',
            top:    isTop  ? '20px' : 'auto',
            bottom: isTop  ? 'auto' : '20px',
            left:   isLeft ? '20px' : 'auto',
            right:  isLeft ? 'auto' : '20px',
            width: '28px', height: '28px',
            borderTop:    isTop  ? `3px solid ${OR}` : 'none',
            borderBottom: isTop  ? 'none' : `3px solid ${OR}`,
            borderLeft:   isLeft ? `3px solid ${OR}` : 'none',
            borderRight:  isLeft ? 'none' : `3px solid ${OR}`,
            zIndex: 3,
          }} />
        )
      })}
    </div>
  )
}
