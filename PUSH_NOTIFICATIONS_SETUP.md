# Push Notifications Setup for Kadio PWA

This document describes the push notification infrastructure for the Kadio Coiffure PWA.

## Overview

The Kadio PWA uses **Web Push API** with **Firebase Cloud Messaging (FCM)** to send push notifications to users. The system is designed to work offline and across all modern browsers.

### Notification Types

The system supports 5 categories of notifications:

1. **rdv_reminder** — Appointment reminders (24 hours before)
2. **rdv_confirmed** — Booking confirmation notifications
3. **formation_complete** — Training/formation completion
4. **promo** — Special offers and promotions
5. **system** — General system messages

---

## Architecture

### Client-Side Components

```
src/utils/pushNotifications.js
├── requestNotificationPermission()
├── getFCMToken()
├── subscribeToPush(userId, supabaseClient)
├── unsubscribeFromPush(userId, supabaseClient)
├── isSubscribedToPush()
└── Helper utilities

src/hooks/usePushNotifications.js
├── Manages push subscription lifecycle
├── Integrates with auth state
└── Returns: { subscribed, loading, error, subscribe, unsubscribe, sendTest }

src/components/ui/PushPermissionBanner.jsx
├── Dismissible banner requesting push permission
├── Shows after first login
└── Uses Kadio design system (OR=#B8922A)

src/components/ui/PushNotificationSettings.jsx
├── User settings panel for managing notifications
├── Toggle subscription on/off
└── Shows subscription status

public/sw.js (Service Worker)
├── Registers with installation
├── Handles push events ('push')
├── Handles notification clicks ('notificationclick')
├── Handles notification close ('notificationclose')
└── Routes clicks to appropriate app pages
```

### Server-Side Components

```
supabase/functions/send-push-notification/index.ts
├── Edge Function for sending notifications
├── Retrieves user push subscription from database
├── Sends via Web Push Protocol
└── Logs notification delivery
```

### Database Schema

The `users` table must include:

```sql
-- Push notification fields
push_token TEXT -- FCM endpoint (can be null)
push_subscription JSONB -- { endpoint, auth, p256dh }
push_enabled BOOLEAN DEFAULT false
push_subscribed_at TIMESTAMP
push_unsubscribed_at TIMESTAMP
```

---

## Setup Instructions

### Step 1: Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project (or create a new one)
3. Navigate to **Project Settings** → **Cloud Messaging** tab
4. Copy the **Server API Key** and **VAPID Key**
5. Save the VAPID key to your `.env.local`:

```env
VITE_FIREBASE_VAPID_KEY=Bxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Step 2: Environment Setup

Add to `.env.local`:

```env
# Firebase Configuration
VITE_FIREBASE_VAPID_KEY=Bxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Step 3: Service Worker Registration

The service worker is automatically registered in `src/main.jsx`:

- **Development**: Registers with cache updates on each page load
- **Production**: Standard service worker registration

To verify registration:

```javascript
// In browser console
navigator.serviceWorker.getRegistrations().then(regs => {
  console.log('Active service workers:', regs)
})
```

### Step 4: Database Migration

Run this migration on your Supabase project:

```sql
-- Add push notification columns to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS push_token TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS push_subscription JSONB;
ALTER TABLE users ADD COLUMN IF NOT EXISTS push_enabled BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS push_subscribed_at TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS push_unsubscribed_at TIMESTAMP;

-- Add index for efficient queries
CREATE INDEX IF NOT EXISTS idx_users_push_enabled 
  ON users(id) WHERE push_enabled = true;
```

### Step 5: Integration in Your App

#### Show Permission Banner on Login

```jsx
import PushPermissionBanner from '@/components/ui/PushPermissionBanner'

export default function ClientLayout() {
  return (
    <>
      <PushPermissionBanner 
        onPermissionRequested={(status) => {
          console.log('Permission status:', status)
        }}
      />
      {/* Rest of layout */}
    </>
  )
}
```

#### Add Settings Panel

```jsx
import PushNotificationSettings from '@/components/ui/PushNotificationSettings'

export default function ProfileSettings() {
  return (
    <div>
      <h2>Paramètres</h2>
      <PushNotificationSettings />
    </div>
  )
}
```

#### Programmatic Subscription

```jsx
import { usePushNotifications } from '@/hooks/usePushNotifications'
import { createClient } from '@supabase/supabase-js'

export default function MyComponent() {
  const { subscribe, subscribed, loading } = usePushNotifications()
  const supabaseClient = createClient(url, key)

  const handleSubscribe = async () => {
    await subscribe(supabaseClient)
  }

  return (
    <button onClick={handleSubscribe} disabled={loading || subscribed}>
      {subscribed ? 'Already subscribed' : 'Enable notifications'}
    </button>
  )
}
```

---

## Sending Notifications from Server

### Via Supabase Edge Function

```javascript
// Call from your backend
const response = await supabase.functions.invoke('send-push-notification', {
  body: {
    userId: 'user-uuid',
    title: 'Rappel RDV',
    body: 'Votre rendez-vous est demain à 14h00',
    type: 'rdv_reminder',
    data: {
      rdvId: 'rdv-uuid',
      url: '/client/rdv/rdv-uuid',
    },
  },
})
```

### Via Node.js (Backend)

```javascript
// Install: npm install web-push
import webpush from 'web-push'

// Set your VAPID keys
webpush.setVapidDetails(
  'mailto:support@kadio.ca',
  process.env.FIREBASE_VAPID_KEY,
  process.env.FIREBASE_VAPID_PRIVATE_KEY,
)

// Send notification
const subscription = {
  endpoint: user.push_subscription.endpoint,
  keys: {
    auth: user.push_subscription.auth,
    p256dh: user.push_subscription.p256dh,
  },
}

const payload = {
  notification: {
    title: 'Rappel RDV',
    body: 'Votre rendez-vous est demain',
    icon: '/icons/icon-192.png',
  },
  data: {
    type: 'rdv_reminder',
    rdvId: 'rdv-uuid',
  },
}

await webpush.sendNotification(subscription, JSON.stringify(payload))
```

---

## User Experience

### Permission Flow

1. User logs in to the app
2. PushPermissionBanner appears (top of layout)
3. User clicks "Recevoir les notifications"
4. Browser shows native permission prompt
5. If approved:
   - Service worker gets subscription
   - Subscription saved to Supabase
   - Banner dismisses
6. User can later change preference in Settings

### Notification Click Behavior

When a user clicks a notification:

- **rdv_reminder / rdv_confirmed**: Opens `/client/rdv` or specific RDV
- **formation_complete**: Opens `/employe/formations` or specific formation
- **promo**: Opens `/client/offres`
- **system**: Opens home page

### Notification Styling

All notifications use:
- Kadio icon: `/icons/icon-192.png`
- Title: "Kadio Coiffure"
- Body: Custom message
- Badge: Salon logo
- Require interaction: `true` for reminders, `false` for others

---

## Testing

### Test Permission Request

```javascript
// In browser console
import { requestNotificationPermission } from '@/utils/pushNotifications'

await requestNotificationPermission()
// Check Notification.permission
console.log(Notification.permission) // 'granted', 'denied', or 'default'
```

### Send Test Notification

```javascript
import { sendTestNotification } from '@/utils/pushNotifications'

await sendTestNotification()
// Check browser notifications
```

### Test Service Worker

```javascript
// Verify SW is registered
navigator.serviceWorker.ready.then(reg => {
  console.log('Service Worker active:', reg)
})

// Trigger push event (testing)
navigator.serviceWorker.controller?.postMessage({
  type: 'PUSH_TEST',
  data: {
    title: 'Test',
    body: 'Test notification',
  },
})
```

### Mock Push Notification (Dev)

In your service worker test:

```javascript
const event = new PushEvent('push', {
  data: new Blob([
    JSON.stringify({
      title: 'Test Title',
      body: 'Test Body',
      type: 'system',
    }),
  ]),
})
self.dispatchEvent(event)
```

---

## Browser Support

| Browser | Desktop | Mobile | Web Push |
|---------|---------|--------|----------|
| Chrome | ✓ | ✓ | ✓ |
| Firefox | ✓ | ✓ | ✓ |
| Safari | ⚠️ | ✓ | ✓ (iOS 16.1+) |
| Edge | ✓ | ✓ | ✓ |

**Note**: Safari support is limited. Use `isPushSupported()` to gracefully handle unsupported browsers.

---

## Troubleshooting

### Permission Denied by Browser

- User previously denied permission
- Clear browser site settings: Settings → Privacy → Cookies and site data
- Try again in incognito mode

### Service Worker Not Registering

```javascript
// Check registration status
navigator.serviceWorker.getRegistrations().then(regs => {
  console.log('SW registrations:', regs)
  regs.forEach(reg => {
    console.log('Scope:', reg.scope)
    console.log('State:', reg.active?.state)
  })
})
```

### Push Events Not Received

1. Verify `push_enabled` is `true` in database
2. Check `push_subscription` contains valid endpoint
3. Verify VAPID key is correct in `.env`
4. Check browser console for Service Worker errors
5. Ensure app is running on HTTPS (required for push notifications)

### VAPID Key Errors

- If error about VAPID: Regenerate key in Firebase Console
- Update `.env.local` with new VAPID key
- Clear browser cache and reload

---

## Security Considerations

1. **VAPID Keys**: Never expose private VAPID key in client code
2. **Subscriptions**: Validate user owns subscription before sending
3. **User Data**: Don't include sensitive data in notification body (shown in notification center)
4. **HTTPS Only**: Push notifications require secure context (HTTPS)
5. **Expiration**: Monitor subscription expiration and refresh periodically

---

## Production Deployment

1. Generate production VAPID keys in Firebase Console
2. Add to production environment:
   - Vercel: Project Settings → Environment Variables
   - Or your hosting platform
3. Ensure Supabase Edge Function is deployed
4. Test notification delivery before launch
5. Monitor push failure rates in Firebase Console

---

## References

- [Web Push Protocol (RFC 8188)](https://datatracker.ietf.org/doc/html/rfc8188)
- [Push API (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/Push_API)
- [Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging/webpush)
- [Service Workers (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)

---

## Support

For issues or questions about push notifications, contact:
- Kadio: support@kadio.ca
- Firebase Support: https://firebase.google.com/support
