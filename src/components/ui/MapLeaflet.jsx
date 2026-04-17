// ── MapLeaflet — Carte Leaflet/OSM pour partenaires ──────────
import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { OR, NOIR } from '@/lib/utils'

const TILES = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
const ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'

// Salon Kadio — position fixe
const SALON = { lat: 45.5197, lng: -73.4977, nom: 'Salon Kadio' }

function createSalonIcon() {
  return L.divIcon({
    className: '',
    html: `<div style="width:32px;height:32px;background:${OR};border:3px solid #fff;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;color:#fff;">K</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  })
}

function createPartenaireIcon(disponible) {
  const bg = disponible ? '#22c55e' : '#9ca3af'
  const ring = disponible ? 'rgba(34,197,94,0.3)' : 'rgba(107,114,128,0.2)'
  return L.divIcon({
    className: '',
    html: `<div style="position:relative;">
      ${disponible ? `<div style="position:absolute;inset:-4px;background:${ring};border-radius:50%;animation:pulse 2s infinite;"></div>` : ''}
      <div style="position:relative;width:28px;height:28px;background:#fff;border:3px solid ${bg};border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.2);display:flex;align-items:center;justify-content:center;">
        <div style="width:10px;height:10px;background:${bg};border-radius:50%;"></div>
      </div>
    </div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  })
}

// Injecter le CSS d'animation pulse une seule fois
if (typeof document !== 'undefined' && !document.getElementById('leaflet-pulse-css')) {
  const style = document.createElement('style')
  style.id = 'leaflet-pulse-css'
  style.textContent = `@keyframes pulse{0%,100%{transform:scale(1);opacity:0.6}50%{transform:scale(1.5);opacity:0}}`
  document.head.appendChild(style)
}

export default function MapLeaflet({ partenaires = [], height = '100%', onMarkerClick, selectedId }) {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markersRef = useRef({})

  // Init map
  useEffect(() => {
    if (mapInstanceRef.current) return

    const map = L.map(mapRef.current, {
      center: [SALON.lat, SALON.lng],
      zoom: 11,
      zoomControl: false,
      attributionControl: false,
    })

    L.tileLayer(TILES, { attribution: ATTRIBUTION, maxZoom: 18 }).addTo(map)
    L.control.zoom({ position: 'topright' }).addTo(map)
    L.control.attribution({ position: 'bottomright', prefix: false }).addTo(map)

    // Salon marker
    L.marker([SALON.lat, SALON.lng], { icon: createSalonIcon() })
      .addTo(map)
      .bindPopup(`<div style="font-family:'DM Sans',sans-serif;text-align:center;"><strong style="color:${OR};">Salon Kadio</strong><br/><span style="font-size:12px;color:#666;">Longueuil</span></div>`)

    mapInstanceRef.current = map

    return () => {
      map.remove()
      mapInstanceRef.current = null
    }
  }, [])

  // Update partenaire markers
  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map) return

    // Remove old markers
    Object.values(markersRef.current).forEach(m => map.removeLayer(m))
    markersRef.current = {}

    // Add new markers
    partenaires.forEach(p => {
      const marker = L.marker([p.lat, p.lng], {
        icon: createPartenaireIcon(p.disponible),
      }).addTo(map)

      const popupContent = `
        <div style="font-family:'DM Sans',sans-serif;min-width:160px;">
          <div style="font-weight:700;font-size:14px;color:${NOIR};">${p.prenom} ${p.nom}</div>
          <div style="font-size:12px;color:#666;margin:2px 0 6px;">${p.ville}</div>
          <div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:6px;">
            ${p.specialites.map(s => `<span style="background:rgba(14,12,9,0.06);color:${OR};font-size:10px;padding:2px 6px;border-radius:6px;font-weight:600;">${s}</span>`).join('')}
          </div>
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <span style="color:${OR};font-weight:600;font-size:12px;">★ ${p.note}</span>
            <span style="font-size:11px;font-weight:600;color:${p.disponible ? '#22c55e' : '#9ca3af'};">● ${p.disponible ? 'Disponible' : 'Occupé'}</span>
          </div>
        </div>`
      marker.bindPopup(popupContent)

      marker.on('click', () => {
        if (onMarkerClick) onMarkerClick(p)
      })

      markersRef.current[p.id] = marker
    })

    // Fit bounds
    if (partenaires.length > 0) {
      const bounds = L.latLngBounds([
        [SALON.lat, SALON.lng],
        ...partenaires.map(p => [p.lat, p.lng]),
      ])
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 13 })
    }
  }, [partenaires, onMarkerClick])

  // Pan to selected partenaire
  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map || !selectedId) return
    const marker = markersRef.current[selectedId]
    if (marker) {
      map.flyTo(marker.getLatLng(), 14, { duration: 0.5 })
      marker.openPopup()
    }
  }, [selectedId])

  return <div ref={mapRef} style={{ width: '100%', height, borderRadius: '12px' }} />
}
