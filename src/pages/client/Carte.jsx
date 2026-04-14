import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { OR, CREME, NOIR, CARD, initiales, haversineKm } from '@/lib/utils'
import { usePartenairesPublic } from '@/hooks/usePartenaires'
import MapView from '@/components/ui/MapView'

const SPECIALITES = ['Tous', 'Tresses', 'Knotless', 'Locs', 'Barbier', 'Soins']
const NOTES_MIN = [{ label: 'Tous', val: 0 }, { label: '4.0+', val: 4.0 }, { label: '4.5+', val: 4.5 }]
const DISTANCES = [{ label: 'Tous', val: 9999 }, { label: '<10 km', val: 10 }, { label: '<5 km', val: 5 }]

const CLIENT_LAT = 45.5315
const CLIENT_LNG = -73.5180

export default function ClientCarte() {
  const navigate = useNavigate()
  const [specialite, setSpecialite] = useState('Tous')
  const [noteMin, setNoteMin] = useState(0)
  const [distMax, setDistMax] = useState(9999)
  const [dispoOnly, setDispoOnly] = useState(false)
  const [selectedId, setSelectedId] = useState(null)

  const { data: partenaires = [], loading, error } = usePartenairesPublic()

  const filteredIds = partenaires.filter(p => {
    if (specialite !== 'Tous' && !p.specialites.some(s => s.toLowerCase() === specialite.toLowerCase())) return false
    if (p.note < noteMin) return false
    if (dispoOnly && !p.disponible) return false
    const dist = haversineKm(CLIENT_LAT, CLIENT_LNG, p.lat, p.lng)
    if (dist > distMax) return false
    return true
  }).map(p => p.id)

  const selectedPartenaire = selectedId ? partenaires.find(p => p.id === selectedId) : null

  return (
    <div style={{ fontFamily: `'DM Sans', sans-serif`, background: CREME, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <div style={{ padding: '20px 20px 12px', background: CREME, borderBottom: '1px solid rgba(184,146,42,0.12)' }}>
        <h1 style={{ color: NOIR, fontSize: 20, fontWeight: 700, margin: 0 }}>Trouvez votre coiffeur</h1>
        <p style={{ color: 'rgba(14,12,9,0.5)', fontSize: 13, margin: '4px 0 0' }}>Partenaires certifiés Kadio près de vous</p>
      </div>

      {/* Filters */}
      <div style={{ padding: '12px 16px', background: CREME, borderBottom: '1px solid rgba(14,12,9,0.08)', display: 'flex', flexDirection: 'column', gap: 10 }}>

        {/* Spécialité */}
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
          {SPECIALITES.map(s => (
            <button
              key={s}
              onClick={() => setSpecialite(s)}
              style={{
                padding: '6px 14px',
                borderRadius: 20,
                border: `1.5px solid ${specialite === s ? OR : 'rgba(14,12,9,0.08)'}`,
                background: specialite === s ? OR : 'transparent',
                color: specialite === s ? NOIR : CREME,
                fontWeight: 600,
                fontSize: 12,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Row 2: Note + Distance + Dispo */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Note min */}
          <div style={{ display: 'flex', gap: 4 }}>
            {NOTES_MIN.map(n => (
              <button
                key={n.label}
                onClick={() => setNoteMin(n.val)}
                style={{
                  padding: '4px 10px',
                  borderRadius: 14,
                  border: `1.5px solid ${noteMin === n.val ? OR : 'rgba(184,146,42,0.25)'}`,
                  background: noteMin === n.val ? 'rgba(14,12,9,0.08)' : 'transparent',
                  color: noteMin === n.val ? OR : 'rgba(14,12,9,0.6)',
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {n.label}
              </button>
            ))}
          </div>

          {/* Distance */}
          <div style={{ display: 'flex', gap: 4 }}>
            {DISTANCES.map(d => (
              <button
                key={d.label}
                onClick={() => setDistMax(d.val)}
                style={{
                  padding: '4px 10px',
                  borderRadius: 14,
                  border: `1.5px solid ${distMax === d.val ? OR : 'rgba(184,146,42,0.25)'}`,
                  background: distMax === d.val ? 'rgba(14,12,9,0.08)' : 'transparent',
                  color: distMax === d.val ? OR : 'rgba(14,12,9,0.6)',
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {d.label}
              </button>
            ))}
          </div>

          {/* Dispo toggle */}
          <button
            onClick={() => setDispoOnly(!dispoOnly)}
            style={{
              padding: '4px 12px',
              borderRadius: 14,
              border: `1.5px solid ${dispoOnly ? '#22c55e' : 'rgba(184,146,42,0.25)'}`,
              background: dispoOnly ? 'rgba(34,197,94,0.15)' : 'transparent',
              color: dispoOnly ? '#22c55e' : 'rgba(14,12,9,0.6)',
              fontSize: 11,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Dispo maintenant
          </button>
        </div>
      </div>

      {/* Map */}
      <div style={{ flex: 1, padding: '8px 12px' }}>
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 'calc(100vh - 220px)' }}>
            <p style={{ color: 'rgba(14,12,9,0.5)' }}>Chargement de la carte...</p>
          </div>
        ) : error ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 'calc(100vh - 220px)' }}>
            <p style={{ color: '#dc2626' }}>Erreur lors du chargement</p>
          </div>
        ) : (
          <MapView
            partenaires={partenaires.filter(p => filteredIds.includes(p.id))}
            height="calc(100vh - 220px)"
            onMarkerClick={p => setSelectedId(prev => prev === p.id ? null : p.id)}
          />
        )}
      </div>

      {/* Slide-up fiche rapide */}
      {selectedPartenaire && (
        <div style={{
          position: 'fixed',
          bottom: 70,
          left: 0,
          right: 0,
          background: CARD,
          borderTop: `2px solid ${OR}`,
          borderRadius: '20px 20px 0 0',
          padding: '20px 20px 24px',
          zIndex: 50,
          boxShadow: '0 -8px 32px rgba(0,0,0,0.5)',
          fontFamily: `'DM Sans', sans-serif`,
        }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            {/* Photo placeholder */}
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              background: `rgba(14,12,9,0.08)`,
              border: `2px solid ${OR}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: 18, color: OR,
              flexShrink: 0,
            }}>
              {initiales(selectedPartenaire.prenom, selectedPartenaire.nom)}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ color: NOIR, fontWeight: 700, fontSize: 17 }}>
                  {selectedPartenaire.prenom} {selectedPartenaire.nom}
                </span>
                {selectedPartenaire.disponible ? (
                  <span style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e', fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 10, border: '1px solid rgba(34,197,94,0.3)' }}>
                    Disponible
                  </span>
                ) : (
                  <span style={{ background: 'rgba(107,114,128,0.15)', color: '#9ca3af', fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 10 }}>
                    Occupé
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <span style={{ color: OR, fontSize: 13, fontWeight: 600 }}>⭐ {selectedPartenaire.note}</span>
                <span style={{ color: 'rgba(14,12,9,0.5)', fontSize: 12 }}>{selectedPartenaire.ville}</span>
              </div>

              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 4 }}>
                {selectedPartenaire.specialites.map(s => (
                  <span key={s} style={{ background: 'rgba(14,12,9,0.08)', color: OR, fontSize: 11, padding: '2px 8px', borderRadius: 8, fontWeight: 500 }}>
                    {s}
                  </span>
                ))}
              </div>

              <div style={{ color: 'rgba(14,12,9,0.45)', fontSize: 11 }}>
                Durée moyenne : 2h–3h
              </div>
            </div>
          </div>

          <div style={{ marginTop: 16, display: 'flex', gap: 10 }}>
            <button
              onClick={() => setSelectedId(null)}
              style={{
                flex: 1,
                padding: '11px 0',
                border: `1.5px solid rgba(14,12,9,0.08)`,
                background: 'transparent',
                color: NOIR,
                borderRadius: 12,
                fontWeight: 600,
                fontSize: 14,
                cursor: 'pointer',
                fontFamily: `'DM Sans', sans-serif`,
              }}
            >
              Fermer
            </button>
            <button
              onClick={() => navigate(`/client/reserver/${selectedPartenaire.id}`)}
              style={{
                flex: 2,
                padding: '11px 0',
                background: OR,
                color: NOIR,
                border: 'none',
                borderRadius: 12,
                fontWeight: 700,
                fontSize: 14,
                cursor: 'pointer',
                fontFamily: `'DM Sans', sans-serif`,
              }}
            >
              Réserver
            </button>
          </div>
        </div>
      )}

      <div style={{ paddingBottom: 100 }} />
    </div>
  )
}
