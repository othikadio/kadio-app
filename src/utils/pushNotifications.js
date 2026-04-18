/**
 * Push Notifications Utility
 * Handles FCM push notifications for Kadio PWA
 * Requires VITE_FIREBASE_VAPID_KEY in .env
 */

const PUSH_NOTIFICATION_TAG = 'kadio-push'

/**
 * Check if browser supports push notifications
 */
export function isPushSupported() {
  return (
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window
  )
}

/**
 * Request push notification permission from user
 * Returns permission status: 'granted', 'denied', or 'default'
 */
export async function requestNotificationPermission() {
  if (!isPushSupported()) {
    console.warn('Push notifications not supported in this browser')
    return 'unsupported'
  }

  if (Notification.permission === 'granted') {
    return 'granted'
  }

  if (Notification.permission === 'denied') {
    return 'denied'
  }

  try {
    const permission = await Notification.requestPermission()
    return permission
  } catch (error) {
    console.error('Error requesting notification permission:', error)
    return 'error'
  }
}

/**
 * Get or create FCM token for this device
 * Requires service worker to be registered
 */
export async function getFCMToken() {
  try {
    if (!isPushSupported()) {
      throw new Error('Push notifications not supported')
    }

    const registration = await navigator.serviceWorker.ready

    // Check if subscription already exists
    const existingSubscription = await registration.pushManager.getSubscription()
    if (existingSubscription) {
      console.log('Using existing push subscription')
      return serializeSubscription(existingSubscription)
    }

    // Create new subscription
    const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY
    if (!vapidKey) {
      throw new Error('VITE_FIREBASE_VAPID_KEY not configured in environment')
    }

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidKey),
    })

    console.log('Created new push subscription')
    return serializeSubscription(subscription)
  } catch (error) {
    console.error('Error getting FCM token:', error)
    throw error
  }
}

/**
 * Subscribe user to push notifications
 * Saves subscription endpoint and keys to Supabase user profile
 */
export async function subscribeToPush(userId, supabaseClient) {
  try {
    // Request permission first
    const permission = await requestNotificationPermission()
    if (permission !== 'granted') {
      throw new Error(`Permission not granted: ${permission}`)
    }

    // Get FCM token
    const token = await getFCMToken()

    // Save to Supabase user profile
    const { error } = await supabaseClient
      .from('users')
      .update({
        push_token: token.endpoint,
        push_subscription: {
          endpoint: token.endpoint,
          auth: token.auth,
          p256dh: token.p256dh,
        },
        push_enabled: true,
        push_subscribed_at: new Date().toISOString(),
      })
      .eq('id', userId)

    if (error) throw error

    console.log('Successfully subscribed to push notifications')
    return token
  } catch (error) {
    console.error('Error subscribing to push notifications:', error)
    throw error
  }
}

/**
 * Unsubscribe from push notifications
 * Removes subscription from device and marks as disabled in Supabase
 */
export async function unsubscribeFromPush(userId, supabaseClient) {
  try {
    const registration = await navigator.serviceWorker.ready
    const subscription = await registration.pushManager.getSubscription()

    if (subscription) {
      await subscription.unsubscribe()
      console.log('Unsubscribed from push notifications')
    }

    // Update Supabase
    if (supabaseClient && userId) {
      const { error } = await supabaseClient
        .from('users')
        .update({
          push_enabled: false,
          push_unsubscribed_at: new Date().toISOString(),
        })
        .eq('id', userId)

      if (error) console.error('Error updating push status in database:', error)
    }
  } catch (error) {
    console.error('Error unsubscribing from push notifications:', error)
    throw error
  }
}

/**
 * Check if user is currently subscribed to push notifications
 */
export async function isSubscribedToPush() {
  try {
    if (!isPushSupported()) return false

    const registration = await navigator.serviceWorker.ready
    const subscription = await registration.pushManager.getSubscription()
    return subscription !== null
  } catch (error) {
    console.error('Error checking push subscription:', error)
    return false
  }
}

/**
 * Request permission if not already dismissed
 * Used by PushPermissionBanner component
 * Checks localStorage to avoid re-asking if user dismissed
 */
export function shouldShowPushPermissionBanner() {
  // Don't show if already subscribed
  if (Notification.permission === 'granted') {
    return false
  }

  // Don't show if user already dismissed
  const dismissed = localStorage.getItem('kadio_push_permission_dismissed')
  if (dismissed === 'true') {
    return false
  }

  // Only show if browser supports it
  return isPushSupported()
}

/**
 * Mark push permission banner as dismissed
 */
export function dismissPushPermissionBanner() {
  localStorage.setItem('kadio_push_permission_dismissed', 'true')
}

/**
 * Send a test notification (for development)
 * Requires service worker to be running
 */
export async function sendTestNotification() {
  try {
    const registration = await navigator.serviceWorker.ready
    const options = {
      body: 'Ceci est une notification de test',
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
      tag: PUSH_NOTIFICATION_TAG,
      requireInteraction: false,
      data: {
        url: '/',
        type: 'test',
      },
    }

    if ('showNotification' in registration) {
      await registration.showNotification('Kadio Test', options)
    } else {
      // Fallback for browsers that don't support this API
      new Notification('Kadio Test', options)
    }
  } catch (error) {
    console.error('Error sending test notification:', error)
  }
}

// ─────────────────────────────────────────────────────────────────
// ── Helper Functions ────────────────────────────────────────────

/**
 * Convert VAPID key from base64 to Uint8Array
 */
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }

  return outputArray
}

/**
 * Serialize subscription object for storage/transmission
 */
function serializeSubscription(subscription) {
  return {
    endpoint: subscription.endpoint,
    auth: subscription.getKey ? btoa(String.fromCharCode.apply(null, new Uint8Array(subscription.getKey('auth')))) : null,
    p256dh: subscription.getKey ? btoa(String.fromCharCode.apply(null, new Uint8Array(subscription.getKey('p256dh')))) : null,
  }
}
