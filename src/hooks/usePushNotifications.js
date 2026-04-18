import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/hooks/useAuth'
import {
  subscribeToPush,
  unsubscribeFromPush,
  isSubscribedToPush,
  isPushSupported,
  sendTestNotification,
} from '@/utils/pushNotifications'

/**
 * Hook: usePushNotifications
 * Manages push notification subscription lifecycle
 * Integrates with auth state and Supabase
 */
export function usePushNotifications() {
  const { user } = useAuth()
  const [subscribed, setSubscribed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Check subscription status on mount and when user changes
  useEffect(() => {
    if (!user || !isPushSupported()) return

    const checkSubscription = async () => {
      try {
        const isSubscribed = await isSubscribedToPush()
        setSubscribed(isSubscribed)
      } catch (err) {
        console.error('Error checking push subscription:', err)
      }
    }

    checkSubscription()
  }, [user])

  // Subscribe to push notifications
  const subscribe = useCallback(async (supabaseClient) => {
    if (!user || !supabaseClient) {
      setError('User not authenticated')
      return false
    }

    setLoading(true)
    setError(null)

    try {
      await subscribeToPush(user.id, supabaseClient)
      setSubscribed(true)
      return true
    } catch (err) {
      const message = err.message || 'Error subscribing to notifications'
      setError(message)
      console.error('Push subscription error:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [user])

  // Unsubscribe from push notifications
  const unsubscribe = useCallback(async (supabaseClient) => {
    if (!user) {
      setError('User not authenticated')
      return false
    }

    setLoading(true)
    setError(null)

    try {
      await unsubscribeFromPush(user.id, supabaseClient)
      setSubscribed(false)
      return true
    } catch (err) {
      const message = err.message || 'Error unsubscribing from notifications'
      setError(message)
      console.error('Push unsubscription error:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [user])

  // Send test notification (dev only)
  const sendTest = useCallback(async () => {
    try {
      await sendTestNotification()
    } catch (err) {
      console.error('Error sending test notification:', err)
      setError(err.message)
    }
  }, [])

  return {
    subscribed,
    loading,
    error,
    subscribe,
    unsubscribe,
    sendTest,
    supported: isPushSupported(),
  }
}
