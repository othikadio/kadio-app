import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import '@/i18n/index'
import App from './App.jsx'

// ── Service Worker Registration ───────────────────────────────────
// Register SW for PWA functionality (caching + push notifications)
// In production: register normally
// In development: you can uncomment to test, but may cause stale cache issues

if ('serviceWorker' in navigator) {
  // Determine if we're in production or development
  const isDevelopment = import.meta.env.DEV

  if (isDevelopment) {
    // In dev: optionally unregister to avoid cache issues
    // Uncomment the lines below if you want clean slate during development
    // navigator.serviceWorker.getRegistrations().then(regs =>
    //   regs.forEach(r => r.unregister())
    // )

    // Or register with cache-busting for development
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      }).then(reg => {
        console.log('Service Worker registered (dev mode)')
        // Force update check on every page load
        reg.update()
      }).catch(err => {
        console.log('Service Worker registration failed:', err)
      })
    })
  } else {
    // In production: register and let browser handle updates
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      }).then(reg => {
        console.log('Service Worker registered (production)')
      }).catch(err => {
        console.error('Service Worker registration failed:', err)
      })
    })
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
