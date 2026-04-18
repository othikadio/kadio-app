import { useState, useEffect } from 'react'
import { usePushNotifications } from '@/hooks/usePushNotifications'
import { useAuth } from '@/hooks/useAuth'
import { createClient } from '@supabase/supabase-js'

const OR = '#B8922A'
const CREME = '#FAFAF8'
const NOIR = '#0E0C09'

/**
 * PushNotificationSettings
 * Settings panel for users to manage push notifications
 * Shows subscription status and allows toggling notifications on/off
 */
export default function PushNotificationSettings() {
  const { user } = useAuth()
  const { subscribed, loading, error, subscribe, unsubscribe, supported } =
    usePushNotifications()

  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('info') // 'info', 'success', 'error'

  // Initialize Supabase client
  const supabaseClient = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY,
  )

  if (!supported) {
    return (
      <div style={{ padding: '16px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <p style={{ color: NOIR, fontSize: '14px', margin: 0 }}>
          Les notifications push ne sont pas supportées par votre navigateur.
        </p>
      </div>
    )
  }

  const handleToggle = async () => {
    setMessage('')
    setMessageType('info')

    try {
      if (subscribed) {
        const success = await unsubscribe(supabaseClient)
        if (success) {
          setMessage('Notifications désactivées.')
          setMessageType('success')
        }
      } else {
        const success = await subscribe(supabaseClient)
        if (success) {
          setMessage('Notifications activées avec succès!')
          setMessageType('success')
        }
      }
    } catch (err) {
      setMessage(error || 'Erreur lors du changement de préférence.')
      setMessageType('error')
    }
  }

  return (
    <div style={{ padding: '16px', backgroundColor: CREME, borderRadius: '8px' }}>
      <h3 style={{ color: NOIR, margin: '0 0 12px 0', fontSize: '16px', fontWeight: 600 }}>
        Notifications Push
      </h3>

      <div style={{ marginBottom: '16px' }}>
        <p style={{ color: NOIR, fontSize: '14px', margin: '0 0 8px 0' }}>
          <strong>État:</strong>{' '}
          <span style={{ color: subscribed ? '#10b981' : '#ef4444', fontWeight: 500 }}>
            {subscribed ? 'Activées' : 'Désactivées'}
          </span>
        </p>

        <p style={{ color: '#666', fontSize: '13px', margin: '0 0 12px 0' }}>
          Recevez des rappels de rendez-vous, confirmations et offres spéciales directement sur
          votre téléphone ou navigateur.
        </p>
      </div>

      {message && (
        <div
          style={{
            padding: '12px',
            marginBottom: '12px',
            borderRadius: '6px',
            fontSize: '13px',
            backgroundColor:
              messageType === 'success' ? '#d1fae5' : messageType === 'error' ? '#fee2e2' : '#e0e7ff',
            color:
              messageType === 'success'
                ? '#065f46'
                : messageType === 'error'
                  ? '#7f1d1d'
                  : '#3730a3',
            border: `1px solid ${
              messageType === 'success' ? '#a7f3d0' : messageType === 'error' ? '#fca5a5' : '#c7d2fe'
            }`,
          }}
        >
          {message}
        </div>
      )}

      <button
        onClick={handleToggle}
        disabled={loading}
        style={{
          padding: '10px 16px',
          backgroundColor: subscribed ? '#ef4444' : OR,
          color: CREME,
          border: 'none',
          borderRadius: '6px',
          fontFamily: '"DM Sans", sans-serif',
          fontSize: '14px',
          fontWeight: 600,
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.7 : 1,
          transition: 'all 200ms ease-in-out',
          minWidth: '160px',
        }}
      >
        {loading ? 'Chargement...' : subscribed ? 'Désactiver' : 'Activer'}
      </button>

      <div style={{ marginTop: '12px', fontSize: '12px', color: '#666' }}>
        <p style={{ margin: '0 0 6px 0' }}>
          <strong>Types de notifications:</strong>
        </p>
        <ul style={{ margin: 0, paddingLeft: '20px' }}>
          <li>Rappels de rendez-vous (24h avant)</li>
          <li>Confirmations de réservation</li>
          <li>Formations complétées</li>
          <li>Offres spéciales et promotions</li>
        </ul>
      </div>
    </div>
  )
}
