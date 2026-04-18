import { useState, useEffect } from 'react'
import {
  requestNotificationPermission,
  shouldShowPushPermissionBanner,
  dismissPushPermissionBanner,
  isPushSupported,
} from '@/utils/pushNotifications'

const OR = '#B8922A'
const CREME = '#FAFAF8'
const NOIR = '#0E0C09'

/**
 * PushPermissionBanner
 * Dismissible banner asking users to enable push notifications
 * Shows after first login if:
 * - Browser supports push notifications
 * - User hasn't already granted permission
 * - User hasn't dismissed the banner
 */
export default function PushPermissionBanner({ onPermissionRequested }) {
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Check if we should show the banner
    if (shouldShowPushPermissionBanner()) {
      setShow(true)
    }
  }, [])

  const handleEnableNotifications = async () => {
    setLoading(true)
    try {
      const permission = await requestNotificationPermission()
      if (permission === 'granted') {
        setShow(false)
        onPermissionRequested?.('granted')
      } else {
        // User denied, dismiss banner
        dismissPushPermissionBanner()
        setShow(false)
        onPermissionRequested?.(permission)
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error)
      onPermissionRequested?.('error')
    } finally {
      setLoading(false)
    }
  }

  const handleDismiss = () => {
    dismissPushPermissionBanner()
    setShow(false)
  }

  if (!show || !isPushSupported()) {
    return null
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        padding: '12px 16px',
        backgroundColor: OR,
        color: CREME,
        borderRadius: '8px',
        marginBottom: '16px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        fontFamily: '"DM Sans", sans-serif',
        fontSize: '14px',
        fontWeight: 500,
      }}
    >
      <div style={{ flex: 1 }}>
        <p style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: 600 }}>
          Notifications activées
        </p>
        <p style={{ margin: 0, fontSize: '13px', opacity: 0.9 }}>
          Recevez les rappels de rendez-vous et les offres spéciales
        </p>
      </div>

      <button
        onClick={handleEnableNotifications}
        disabled={loading}
        style={{
          padding: '8px 16px',
          backgroundColor: CREME,
          color: OR,
          border: 'none',
          borderRadius: '6px',
          fontFamily: '"DM Sans", sans-serif',
          fontSize: '13px',
          fontWeight: 600,
          cursor: loading ? 'not-allowed' : 'pointer',
          whiteSpace: 'nowrap',
          opacity: loading ? 0.7 : 1,
          transition: 'opacity 200ms ease-in-out',
        }}
      >
        {loading ? 'Activation...' : 'Recevoir les notifications'}
      </button>

      <button
        onClick={handleDismiss}
        disabled={loading}
        style={{
          padding: '8px 12px',
          backgroundColor: 'transparent',
          color: CREME,
          border: `1px solid ${CREME}`,
          borderRadius: '6px',
          fontFamily: '"DM Sans", sans-serif',
          fontSize: '13px',
          fontWeight: 500,
          cursor: loading ? 'not-allowed' : 'pointer',
          whiteSpace: 'nowrap',
          opacity: loading ? 0.5 : 1,
          transition: 'opacity 200ms ease-in-out',
        }}
      >
        Plus tard
      </button>
    </div>
  )
}
