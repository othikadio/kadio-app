import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { OR, CREME, NOIR, CARD, initiales, haversineKm } from '@/lib/utils'
import { usePartenairesPublic } from '@/hooks/usePartenaires'
import { useDispoStore } from '@/stores/dispoStore'
import MapLeaflet from '@/components/ui/MapLeaflet'

const SPECIALITES = ['Tous', 'Tresses', 'Knotless', 'Locs', 'Barbier', 'Coupes', 'Soins']
const CLIENT_LAT = 45.5315
const CLIENT_LNG = -73.5180

export default function ClientCarte() {
  const navigate = useNavigate()
  const { data: rawPartenaires = [], loading } = usePartenairesPublic()
  const dispos = useDispoStore(s => s.dispos)
  const subscribe = useDispoStore(s => s.subscribe)

  // Subscribe au realtime dès le montage
  useEffect(() => { subscribe() }, [subscribe])

  // Fusionner les dispos temps réel avec les données partenaires
  const partenaires = rawPartenaires.map(p => ({
    ...p,
    disponible: dispos[p.id] ?? p.disponible,
  }))

  const [specialite, setSpecialite] = useState('Tous')
  const [dispoOnly, setDispoOnly] = useState(false)
  const [selectedId, setSelectedId] = useState(null)
  const [panelOpen, setPanelOpen] = useState(false)
  const [searchText, setSearchText] = useState('')
  const panelRef = useRef(null)

  // Filtrer
  const filtered = partenaires.filter(p => {
    if (specialite !== 'Tous' && !p.specialites.some(s => s.toLowerCase() === specialite.toLowerCase())) return false
    if (dispoOnly && !p.disponible) return false
    if (searchText && !`${p.prenom} ${p.nom} ${p.ville}`.toLowerCase().includes(searchText.toLowerCase())) return false
    return true
  }).sort((a, b) => {
    // Disponibles en premier, puis par note
    if (a.disponible !== b.disponible) return b.disponible - a.disponible
    return b.note - a.note
  })

  const selected = selectedId ? partenaires.find(p => p.id === selectedId) : null
  const dispoCount = filtered.filter(p => p.disponible).length

  function handleMarkerClick(p) {
    setSelectedId(p.id)
    setPanelOpen(true)
  }

  function handleCardClick(p) {
    setSelectedId(p.id)
  }

  function handleReserver(p) {
    navigate(`/client/reserver/${p.id}`)
  }

  // Touch drag pour le panel
  const [dragY, setDragY] = useState(0)
  const startY = useRef(0)

  function onTouchStart(e) {
    startY.current = e.touches[0].clientY
  }
  function onTouchMove(e) {
    const diff = e.touches[0].clientY - startY.current
    setDragY(Math.max(0, diff))
  }
  function onTouchEnd() {
    if (dragY > 100) setPanelOpen(false)
    setDragY(0)
  }

  return (
    <div style={{ fontFamily: `'DM Sans', sans-serif`, background: CREME, height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>

      {/* Barre de recherche + filtres — flottante sur la carte */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
        background: `linear-gradient(${CREME}, ${CREME}ee, transparent)`,
        padding: '12px 12px 20px',
      }}>
        {/* Recherche */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
          <div style={{
            flex: 1, display: 'flex', alignItems: 'center', gap: 8,
            background: '#fff', borderRadius: 12, padding: '10px 14px',
            border: '1px solid rgba(14,12,9,0.08)',
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          }}>
            <span style={{ fontSize: 16, opacity: 0.4 }}>🔍</span>
            <input
              type="text"
              placeholder="Rechercher un coiffeur, une ville..."
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              style={{
                flex: 1, border: 'none', outline: 'none', background: 'transparent',
                fontFamily: `'DM Sans', sans-serif`, fontSize: 14, color: NOIR,
              }}
            />
          </div>
          {/* Toggle liste */}
          <button
            onClick={() => setPanelOpen(v => !v)}
            style={{
              background: panelOpen ? OR : '#fff', color: panelOpen ? '#fff' : NOIR,
              border: '1px solid rgba(14,12,9,0.08)', borderRadius: 12,
              padding: '10px 14px', cursor: 'pointer', fontFamily: `'DM Sans', sans-serif`,
              fontWeight: 600, fontSize: 13, boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
              display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            ☰ <span style={{ fontSize: 12 }}>{filtered.length}</span>
          </button>
        </div>

        {/* Filtres spécialités */}
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
          {SPECIALITES.map(s => (
            <button
              key={s}
              onClick={() => setSpecialite(s)}
              style={{
                padding: '6px 14px', borderRadius: 20, whiteSpace: 'nowrap', flexShrink: 0,
                border: `1.5px solid ${specialite === s ? OR : 'rgba(14,12,9,0.1)'}`,
                background: specialite === s ? OR : '#fff',
                color: specialite === s ? '#fff' : NOIR,
                fontWeight: 600, fontSize: 12, cursor: 'pointer',
                fontFamily: `'DM Sans', sans-serif`,
                boxShadow: specialite === s ? 'none' : '0 1px 4px rgba(0,0,0,0.04)',
              }}
            >
              {s}
            </button>
          ))}
          <button
            onClick={() => setDispoOnly(v => !v)}
            style={{
              padding: '6px 14px', borderRadius: 20, whiteSpace: 'nowrap', flexShrink: 0,
              border: `1.5px solid ${dispoOnly ? '#22c55e' : 'rgba(14,12,9,0.1)'}`,
              background: dispoOnly ? 'rgba(34,197,94,0.15)' : '#fff',
              color: dispoOnly ? '#22c55e' : NOIR,
              fontWeight: 600, fontSize: 12, cursor: 'pointer',
              fontFamily: `'DM Sans', sans-serif`,
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            }}
          >
            ● Dispo ({dispoCount})
          </button>
        </div>
      </div>

      {/* Carte Leaflet — plein écran */}
      <div style={{ flex: 1 }}>
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>🗺️</div>
              <p style={{ color: 'rgba(14,12,9,0.5)', fontSize: 14 }}>Chargement de la carte...</p>
            </div>
          </div>
        ) : (
          <MapLeaflet
            partenaires={filtered}
            height="100%"
            onMarkerClick={handleMarkerClick}
            selectedId={selectedId}
          />
        )}
      </div>

      {/* Panel slide-up — liste des partenaires */}
      <div
        ref={panelRef}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{
          position: 'absolute',
          bottom: 64, // au-dessus de la bottom nav
          left: 0, right: 0,
          background: CREME,
          borderRadius: '20px 20px 0 0',
          boxShadow: '0 -4px 24px rgba(0,0,0,0.12)',
          zIndex: 20,
          transition: dragY > 0 ? 'none' : 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
          transform: panelOpen
            ? `translateY(${dragY}px)`
            : `translateY(calc(100% - ${selected ? '200px' : '56px'}))`,
          maxHeight: 'calc(100vh - 140px)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Poignée drag */}
        <div
          style={{ padding: '10px 0 6px', textAlign: 'center', cursor: 'grab' }}
          onClick={() => setPanelOpen(v => !v)}
        >
          <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(14,12,9,0.15)', margin: '0 auto' }} />
        </div>

        {/* Header panel */}
        <div style={{ padding: '0 16px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: 15, fontWeight: 700, color: NOIR }}>
              {filtered.length} coiffeur{filtered.length > 1 ? 's' : ''}
            </span>
            <span style={{ fontSize: 12, color: 'rgba(14,12,9,0.45)', marginLeft: 6 }}>
              · {dispoCount} disponible{dispoCount > 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Liste scrollable */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 12px 16px' }}>
          {filtered.map(p => {
            const dist = haversineKm(CLIENT_LAT, CLIENT_LNG, p.lat, p.lng)
            const isSelected = selectedId === p.id
            return (
              <div
                key={p.id}
                onClick={() => handleCardClick(p)}
                style={{
                  background: isSelected ? `rgba(184,146,42,0.08)` : '#fff',
                  border: `1.5px solid ${isSelected ? OR : 'rgba(14,12,9,0.06)'}`,
                  borderRadius: 14,
                  padding: '14px 14px',
                  marginBottom: 8,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  boxShadow: isSelected ? `0 2px 12px rgba(184,146,42,0.15)` : '0 1px 4px rgba(0,0,0,0.03)',
                }}
              >
                <div style={{ display: 'flex', gap: 12 }}>
                  {/* Avatar */}
                  <div style={{
                    width: 48, height: 48, borderRadius: '50%', flexShrink: 0,
                    background: p.disponible ? `rgba(34,197,94,0.1)` : `rgba(14,12,9,0.06)`,
                    border: `2px solid ${p.disponible ? '#22c55e' : '#d1d5db'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: 16,
                    color: p.disponible ? '#22c55e' : '#9ca3af',
                  }}>
                    {initiales(p.prenom, p.nom)}
                  </div>

                  {/* Infos */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ fontWeight: 700, fontSize: 15, color: NOIR }}>
                        {p.prenom} {p.nom}
                      </div>
                      <div style={{
                        fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 10,
                        background: p.disponible ? 'rgba(34,197,94,0.12)' : 'rgba(107,114,128,0.12)',
                        color: p.disponible ? '#22c55e' : '#9ca3af',
                      }}>
                        {p.disponible ? '● En ligne' : '● Hors ligne'}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '4px 0' }}>
                      <span style={{ fontSize: 12, color: OR, fontWeight: 600 }}>★ {p.note}</span>
                      <span style={{ fontSize: 12, color: 'rgba(14,12,9,0.4)' }}>{p.ville}</span>
                      <span style={{ fontSize: 11, color: 'rgba(14,12,9,0.35)' }}>{dist.toFixed(1)} km</span>
                    </div>

                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      {p.specialites.map(s => (
                        <span key={s} style={{
                          background: `rgba(184,146,42,0.08)`, color: OR,
                          fontSize: 10, padding: '2px 7px', borderRadius: 6, fontWeight: 600,
                        }}>{s}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bouton réserver — visible seulement sur la carte sélectionnée */}
                {isSelected && (
                  <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                    <button
                      onClick={e => { e.stopPropagation(); handleReserver(p) }}
                      disabled={!p.disponible}
                      style={{
                        flex: 1, padding: '10px 0',
                        background: p.disponible ? OR : 'rgba(14,12,9,0.08)',
                        color: p.disponible ? '#fff' : 'rgba(14,12,9,0.3)',
                        border: 'none', borderRadius: 10,
                        fontWeight: 700, fontSize: 13, cursor: p.disponible ? 'pointer' : 'default',
                        fontFamily: `'DM Sans', sans-serif`,
                      }}
                    >
                      {p.disponible ? 'Réserver maintenant' : 'Indisponible'}
                    </button>
                  </div>
                )}
              </div>
            )
          })}

          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '32px 0', color: 'rgba(14,12,9,0.4)' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>🔍</div>
              <p style={{ fontSize: 14 }}>Aucun coiffeur trouvé</p>
              <p style={{ fontSize: 12 }}>Essayez un autre filtre ou une autre recherche</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
