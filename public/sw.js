// ── Kadio Service Worker ─────────────────────────────────────────
// Stratégie : network-first pour navigation, cache-first pour assets

const CACHE_NAME = 'kadio-v1'

const STATIC_PRECACHE = [
  '/',
  '/index.html',
]

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
