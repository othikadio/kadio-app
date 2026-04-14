import { useState, useEffect } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { OR, CREME, NOIR, CARD, BORDER_OR, formatDate } from '@/lib/utils'

/**
 * QRDisplay — affiche le code QR d'un RDV côté client
 * Props: rdv { code_qr, service, date_rdv, heure_debut }
 */
export default function QRDisplay({ rdv }) {
  const [fullscreen, setFullscreen] = useState(false)
  const wakeLockRef = { current: null }

  async function openFullscreen() {
    setFullscreen(true)
    // Tenter de garder l'écran allumé
    if ('wakeLock' in navigator) {
      try {
        wakeLockRef.current = await navigator.wakeLock.request('screen')
      } catch (_) {}
    }
  }

  function closeFullscreen() {
    setFullscreen(false)
    if (wakeLockRef.current) {
      wakeLockRef.current.release().catch(() => {})
      wakeLockRef.current = null
    }
  }

  useEffect(() => {
    return () => {
      if (wakeLockRef.current) {
        wakeLockRef.current.release().catch(() => {})
      }
    }
  }, [])

  return (
    <>
      {/* ── Affichage inline ── */}
      <div style={{
        background: CARD,
        border: `2px solid ${OR}`,
        borderRadius: '16px',
        padding: '20px 16px',
        textAlign: 'center',
        fontFamily: `'DM Sans', sans-serif`,
      }}>
        <p style={{ color: 'rgba(14,12,9,0.45)', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 14px' }}>
          Code QR RDV
        </p>

        {/* QR image */}
        <div style={{ display: 'inline-block', padding: '10px', background: '#fff', borderRadius: '10px', marginBottom: '14px' }}>
          <QRCodeCanvas
            value={rdv.code_qr}
            size={180}
            bgColor="#ffffff"
            fgColor="#0E0C09"
            level="M"
            includeMargin={false}
          />
        </div>

        {/* Infos RDV */}
        <p style={{ margin: '0 0 4px', color: NOIR, fontWeight: 600, fontSize: '14px' }}>
          {rdv.service?.nom || rdv.service}
        </p>
        <p style={{ margin: '0 0 14px', color: 'rgba(14,12,9,0.45)', fontSize: '12px' }}>
          {formatDate(rdv.date_rdv)} · {rdv.heure_debut}
        </p>

        {/* Code texte */}
        <div style={{
          fontFamily: 'monospace',
          fontSize: '13px',
          color: OR,
          letterSpacing: '0.08em',
          padding: '8px 12px',
          background: 'rgba(184,146,42,0.07)',
          borderRadius: '8px',
          border: `1px dashed rgba(184,146,42,0.3)`,
          marginBottom: '14px',
          wordBreak: 'break-all',
        }}>
          {rdv.code_qr}
        </div>

        <button
          onClick={openFullscreen}
          style={{
            width: '100%',
            padding: '10px',
            background: OR,
            color: NOIR,
            border: 'none',
            borderRadius: '10px',
            fontWeight: 700,
            fontSize: '14px',
            cursor: 'pointer',
            fontFamily: `'DM Sans', sans-serif`,
          }}
        >
          ⛶ Agrandir
        </button>
      </div>

      {/* ── Fullscreen modal ── */}
      {fullscreen && (
        <div
          onClick={closeFullscreen}
          style={{
            position: 'fixed', inset: 0, zIndex: 200,
            background: '#000',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: '24px',
          }}
        >
          <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: '380px', textAlign: 'center' }}>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '20px', fontFamily: `'DM Sans', sans-serif` }}>
              Montrez ce code à votre coiffeuse
            </p>

            {/* Grand QR sur fond blanc */}
            <div style={{ display: 'inline-block', padding: '16px', background: '#fff', borderRadius: '16px', marginBottom: '20px' }}>
              <QRCodeCanvas
                value={rdv.code_qr}
                size={260}
                bgColor="#ffffff"
                fgColor="#0E0C09"
                level="M"
                includeMargin={false}
              />
            </div>

            <p style={{ margin: '0 0 6px', color: '#fff', fontWeight: 700, fontSize: '16px', fontFamily: `'DM Sans', sans-serif` }}>
              {rdv.service?.nom || rdv.service}
            </p>
            <p style={{ margin: '0 0 20px', color: 'rgba(255,255,255,0.5)', fontSize: '13px', fontFamily: `'DM Sans', sans-serif` }}>
              {formatDate(rdv.date_rdv)} · {rdv.heure_debut}
            </p>

            <div style={{
              fontFamily: 'monospace',
              fontSize: '15px',
              color: OR,
              letterSpacing: '0.1em',
              marginBottom: '24px',
            }}>
              {rdv.code_qr}
            </div>

            <button
              onClick={closeFullscreen}
              style={{
                width: '100%',
                padding: '14px',
                background: 'transparent',
                border: '1.5px solid rgba(255,255,255,0.2)',
                borderRadius: '12px',
                color: 'rgba(255,255,255,0.7)',
                fontWeight: 600,
                fontSize: '15px',
                cursor: 'pointer',
                fontFamily: `'DM Sans', sans-serif`,
              }}
            >
              ✕ Fermer
            </button>
          </div>
        </div>
      )}
    </>
  )
}
