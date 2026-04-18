// ── Kadio Service Worker ─────────────────────────────────────────
// Stratégie : network-first pour navigation, cache-first pour assets
// Gère notifications push via FCM

const CACHE_NAME = 'kadio-v1'

const STATIC_PRECACHE = [
  '/',
  '/index.html',
]

// Configuration de notification
const NOTIFICATION_CONFIG = {
  rdv_reminder: {
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    requireInteraction: true,
  },
  rdv_confirmed: {
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    requireInteraction: false,
  },
  formation_complete: {
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    requireInteraction: false,
  },
  promo: {
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    requireInteraction: false,
  },
  system: {
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    requireInteraction: false,
  },
}

// ── Install : précache ────────────────────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_PRECACHE))
      .then(() => self.skipWaiting())
  )
})

// ── Activate : purge anciens caches ──────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  )
})

// ── Push Notifications ───────────────────────────────────────────
self.addEventListener('push', event => {
  let notificationData = {
    title: 'Kadio Coiffure',
    options: {
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
      requireInteraction: false,
    },
  }

  try {
    if (event.data) {
      const data = event.data.json()
      notificationData.title = data.title || notificationData.title
      notificationData.options = {
        ...notificationData.options,
        body: data.body || '',
        tag: data.tag || 'kadio-notification',
        data: data.data || {},
      }

      // Appliquer la config spécifique par type
      const type = data.type || 'system'
      const typeConfig = NOTIFICATION_CONFIG[type] || NOTIFICATION_CONFIG.system
      notificationData.options = {
        ...notificationData.options,
        ...typeConfig,
      }
    }
  } catch (error) {
    console.error('Error parsing push data:', error)
  }

  event.waitUntil(
    self.registration.showNotification(
      notificationData.title,
      notificationData.options
    )
  )
})

// ── Notification Click ───────────────────────────────────────────
self.addEventListener('notificationclick', event => {
  event.notification.close()

  const urlToOpen = event.notification.data?.url || '/'
  const notificationType = event.notification.data?.type || 'system'

  // Déterminer la route selon le type de notification
  let route = '/'
  switch (notificationType) {
    case 'rdv_reminder':
    case 'rdv_confirmed':
      route = event.notification.data?.rdvId
        ? `/client/rdv/${event.notification.data.rdvId}`
        : '/client/rdv'
      break
    case 'formation_complete':
      route = event.notification.data?.formationId
        ? `/employe/formations/${event.notification.data.formationId}`
        : '/employe/formations'
      break
    case 'promo':
      route = '/client/offres'
      break
    default:
      route = urlToOpen
  }

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(windowClients => {
      // Chercher une fenêtre existante
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i]
        if (client.url === route && 'focus' in client) {
          return client.focus()
        }
      }

      // Sinon, ouvrir une nouvelle fenêtre
      if (clients.openWindow) {
        return clients.openWindow(route)
      }
    })
  )
})

// ── Notification Close ───────────────────────────────────────────
self.addEventListener('notificationclose', event => {
  // Log ou tracker : utilisateur a fermé la notification
  console.log('Notification fermée:', event.notification.tag)
})

// ── Fetch ─────────────────────────────────────────────────────────
self.addEventListener('fetch', event => {
  const { request } = event
  if (!request.url.startsWith('http')) return
  if (request.url.includes('fonts.googleapis') || request.url.includes('fonts.gstatic')) {
    // Cache-first pour fonts Google
    event.respondWith(
      caches.match(request).then(cached => cached || fetch(request).then(res => {
        const clone = res.clone()
        caches.open(CACHE_NAME).then(c => c.put(request, clone))
        return res
      }))
    )
    return
  }

  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return

  if (request.mode === 'navigate') {
    // Network-first pour navigation → fallback /index.html pour SPA
    event.respondWith(
      fetch(request)
        .then(res => {
          const clone = res.clone()
          caches.open(CACHE_NAME).then(c => c.put(request, clone))
          return res
        })
        .catch(() => caches.match('/index.html'))
    )
  } else {
    // Cache-first pour assets statiques (JS, CSS, images, fonts locaux)
    event.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached
        return fetch(request).then(res => {
          if (res.ok && res.type !== 'opaque') {
            const clone = res.clone()
            caches.open(CACHE_NAME).then(c => c.put(request, clone))
          }
          return res
        }).catch(() => cached || new Response('', { status: 503 }))
      })
    )
  }
})
