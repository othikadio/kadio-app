import { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

/* ─── Salon Kadio — coordonnées fixes ─────────────────────────── */
const SALON = {
  nom: 'Salon Kadio',
  adresse: '615 rue Antoinette-Robidoux, Local 100, Longueuil',
  lat: 45.5197,
  lng: -73.4977,
}

/* ─── Style carte minimaliste (tons clairs) ───────────────────── */
const MAP_STYLES = [
  { elementType: 'geometry', stylers: [{ color: '#f5f0e8' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#fafaf8' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#6b6560' }] },
  { featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{ color: '#ede7dc' }] },
  { featureType: 'administrative.land_parcel', elementType: 'labels.text.fill', stylers: [{ color: '#ae9e90' }] },
  { featureType: 'landscape.natural', elementType: 'geometry', stylers: [{ color: '#f0ebe3' }] },
  { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#ede7dc' }] },
  { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#93817c' }] },
  { featureType: 'poi.park', elementType: 'geometry.fill', stylers: [{ color: '#e5dfd5' }] },
  { featureType: 'poi.park', elementType: 'labels.text.fill', stylers: [{ color: '#9e9389' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#fafaf8' }] },
  { featureType: 'road.arterial', elementType: 'geometry', stylers: [{ color: '#fafaf8' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#ede7dc' }] },
  { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#ddd6ca' }] },
  { featureType: 'road.local', elementType: 'labels.text.fill', stylers: [{ color: '#9e9389' }] },
  { featureType: 'transit.line', elementType: 'geometry', stylers: [{ color: '#ede7dc' }] },
  { featureType: 'transit.station', elementType: 'geometry', stylers: [{ color: '#ede7dc' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#ddd6ca' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#9e9389' }] },
]

/* ─── Chargement du script Google Maps ────────────────────────── */
let loadPromise = null
function loadGoogleMaps() {
  if (loadPromise) return loadPromise
  if (window.google?.maps) return Promise.resolve()
  loadPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=maps,marker&v=beta`
    script.async = true
    script.defer = true
    script.onload = resolve
    script.onerror = reject
    document.head.appendChild(script)
  })
  return loadPromise
}

/* ─── Composant InfoWindow personnalisé ───────────────────────── */
function createInfoContent(data, isSalon = false) {
  const container = document.createElement('div')
  container.style.cssText = `font-family: 'DM Sans', sans-serif; min-width: 200px; padding: 4px;`

  if (isSalon) {
    container.innerHTML = `
      <div style="font-weight: 600; font-size: 15px; color: #0E0C09; margin-bottom: 4px; font-family: 'Cormorant Garamond', serif; letter-spacing: 0.04em;">
        ${data.nom}
      </div>
      <div style="font-size: 12px; color: rgba(14,12,9,0.5); margin-bottom: 12px; line-height: 1.4;">
        ${data.adresse}
      </div>
      <a href="/connexion" style="
        display: block; text-align: center; padding: 8px 16px;
        background: #0E0C09; color: #FAFAF8; text-decoration: none;
        font-weight: 500; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase;
      ">Réserver</a>
    `
  } else {
    const stars = '★'.repeat(Math.round(data.note))
    container.innerHTML = `
      <div style="font-weight: 600; font-size: 15px; color: #0E0C09; margin-bottom: 2px;">
        ${data.prenom} ${data.nom}
      </div>
      <div style="font-size: 12px; color: rgba(14,12,9,0.45); margin-bottom: 2px;">${data.ville}</div>
      <div style="font-size: 11px; color: rgba(14,12,9,0.35); margin-bottom: 10px;">
        ${data.specialites.join(' · ')}
      </div>
      <div style="margin-bottom: 12px; display: flex; align-items: center; gap: 6px;">
        <span style="color: #B8922A; font-size: 12px;">${stars}</span>
        <span style="font-size: 12px; color: rgba(14,12,9,0.5);">${data.note}/5</span>
        <span style="margin-left: auto; font-size: 11px; color: ${data.disponible ? '#16a34a' : '#9ca3af'}; font-weight: 500;">
          ${data.disponible ? '● Disponible' : '● Occupé'}
        </span>
      </div>
      <a href="/connexion" style="
        display: block; text-align: center; padding: 8px 16px;
        background: #0E0C09; color: #FAFAF8; text-decoration: none;
        font-weight: 500; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase;
      ">Réserver</a>
    `
  }
  return container
}


/* ═════════════════════════════════════════════════════════════════
   MapView — Google Maps
   ═════════════════════════════════════════════════════════════════ */
export default function MapView({ partenaires = [], height = '420px', onMarkerClick }) {
  const mapRef = useRef(null)
  const mapInstance = useRef(null)
  const markersRef = useRef([])
  const infoRef = useRef(null)
  const [loaded, setLoaded] = useState(false)
  const navigate = useNavigate()

  // Charger Google Maps
  useEffect(() => {
    loadGoogleMaps().then(() => setLoaded(true)).catch(console.error)
  }, [])

  // Initialiser la carte
  useEffect(() => {
    if (!loaded || !mapRef.current || mapInstance.current) return

    const map = new google.maps.Map(mapRef.current, {
      center: { lat: 45.5316, lng: -73.5180 },
      zoom: 11,
      styles: MAP_STYLES,
      disableDefaultUI: true,
      zoomControl: true,
      zoomControlOptions: { position: google.maps.ControlPosition.RIGHT_CENTER },
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    })

    mapInstance.current = map
    infoRef.current = new google.maps.InfoWindow()
  }, [loaded])

  // Ajouter les marqueurs
  useEffect(() => {
    if (!mapInstance.current) return
    const map = mapInstance.current

    // Nettoyer anciens marqueurs
    markersRef.current.forEach(m => m.setMap(null))
    markersRef.current = []

    const bounds = new google.maps.LatLngBounds()

    // ── Marqueur Salon ──
    const salonMarker = new google.maps.Marker({
      position: { lat: SALON.lat, lng: SALON.lng },
      map,
      title: SALON.nom,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 12,
        fillColor: '#B8922A',
        fillOpacity: 1,
        strokeColor: '#0E0C09',
        strokeWeight: 2,
      },
      zIndex: 10,
    })
    salonMarker.addListener('click', () => {
      infoRef.current.setContent(createInfoContent(SALON, true))
      infoRef.current.open(map, salonMarker)
    })
    markersRef.current.push(salonMarker)
    bounds.extend({ lat: SALON.lat, lng: SALON.lng })

    // ── Marqueurs partenaires ──
    partenaires.forEach(p => {
      const marker = new google.maps.Marker({
        position: { lat: p.lat, lng: p.lng },
        map,
        title: `${p.prenom} ${p.nom}`,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: '#FAFAF8',
          fillOpacity: 1,
          strokeColor: '#B8922A',
          strokeWeight: 2,
        },
        zIndex: 5,
      })

      marker.addListener('click', () => {
        if (onMarkerClick) onMarkerClick(p)
        infoRef.current.setContent(createInfoContent(p, false))
        infoRef.current.open(map, marker)
      })

      markersRef.current.push(marker)
      bounds.extend({ lat: p.lat, lng: p.lng })
    })

    // Ajuster la vue
    if (partenaires.length > 0) {
      map.fitBounds(bounds, { top: 40, right: 40, bottom: 40, left: 40 })
    }
  }, [loaded, partenaires, onMarkerClick])

  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      <div ref={mapRef} style={{ height, width: '100%' }} />

      {/* Chargement */}
      {!loaded && (
        <div style={{
          position: 'absolute', inset: 0,
          background: '#F5F0E8',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'rgba(14,12,9,0.35)', fontSize: 13, letterSpacing: '0.06em',
        }}>
          Chargement de la carte…
        </div>
      )}

      {/* Légende */}
      <div style={{
        position: 'absolute', bottom: 16, left: 12, zIndex: 10,
        background: 'rgba(250,250,248,0.95)', padding: '8px 14px',
        display: 'flex', gap: 16, fontSize: 12, color: '#0E0C09',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(14,12,9,0.06)',
        pointerEvents: 'none',
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#B8922A', display: 'inline-block', flexShrink: 0 }} />
          Salon Kadio
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#FAFAF8', border: '2px solid #B8922A', display: 'inline-block', flexShrink: 0 }} />
          Partenaires certifiés
        </span>
      </div>
    </div>
  )
}
