import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { OR, CREME, NOIR, CARD, initiales, haversineKm } from '@/lib/utils'
import { usePartenairesPublic } from '@/hooks/usePartenaires'
import { useDispoStore } from '@/stores/dispoStore'

const CLIENT_LAT = 45.5315
const CLIENT_LNG = -73.5180

const MODE_LABELS = {
  au_salon:              { icon: '🏠', label: 'Au salon Kadio',          desc: 'Prix salon — chaise incluse' },
  chez_coiffeur:         { icon: '✂️', label: 'Chez le coiffeur',        desc: 'Tu te déplaces chez le coiffeur' },
  deplacement_voiture:   { icon: '🚗', label: 'Déplacement voiture',    desc: 'Le coiffeur vient chez toi en voiture' },
  deplacement_transport: { icon: '🚌', label: 'Déplacement transport',  desc: 'Le coiffeur vient en transport' },
  mode_mixte:            { icon: '🔄', label: 'Mode flexible',          desc: 'Le coiffeur choisit selon dispo' },
}

const NIVEAU_COLORS = {
  Partenaire:  { bg: 'rgba(14,12,9,0.08)', color: 'rgba(14,12,9,0.6)' },
  'Certifié':  { bg: 'rgba(184,146,42,0.12)', color: OR },
  'Élite':     { bg: 'rgba(34,197,94,0.12)', color: '#22c55e' },
  Ambassadeur: { bg: 'rgba(147,51,234,0.12)', color: '#9333ea' },
}

export default function FichePartenaire() {
  const { partenaireId } = useParams()
  const navigate = useNavigate()
  const { data: partenaires = [] } = usePartenairesPublic()
  const dispos = useDispoStore(s => s.dispos)

  const p = partenaires.find(x => x.id === partenaireId)
  if (!p) {
    return (
      <div style={{ fontFamily: `'DM Sans', sans-serif`, padding: 40, textAlign: 'center', color: 'rgba(14,12,9,0.5)' }}>
        Partenaire non trouvé
      </div>
    )
  }

  const disponible = dispos[p.id] ?? p.disponible
  const dist = haversineKm(CLIENT_LAT, CLIENT_LNG, p.lat, p.lng)
  const niv = NIVEAU_COLORS[p.niveau] || NIVEAU_COLORS['Partenaire']
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}`

  const [showAllAvis, setShowAllAvis] = useState(false)
  const avisToShow = showAllAvis ? (p.avis || []) : (p.avis || []).slice(0, 2)

  return (
    <div style={{ fontFamily: `'DM Sans', sans-serif`, background: CREME, minHeight: '100vh', paddingBottom: 120 }}>

      {/* Header */}
      <div style={{ padding: '16px 16px 0', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <button onClick={() => navigate(-1)}
          style={{ background: 'none', border: 'none', color: OR, fontSize: 22, cursor: 'pointer', padding: 4 }}>
          ←
        </button>
        <span style={{ color: NOIR, fontSize: 16, fontWeight: 700 }}>Profil coiffeur</span>
      </div>

      {/* Carte profil */}
      <div style={{ margin: '0 16px', background: CARD, borderRadius: 16, border: `1.5px solid ${OR}`, padding: '20px 18px', marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          {/* Avatar */}
          <div style={{
            width: 64, height: 64, borderRadius: '50%', flexShrink: 0,
            background: disponible ? 'rgba(34,197,94,0.1)' : 'rgba(14,12,9,0.06)',
            border: `3px solid ${disponible ? '#22c55e' : '#d1d5db'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: 22, color: disponible ? '#22c55e' : '#9ca3af',
          }}>
            {initiales(p.prenom, p.nom)}
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ color: NOIR, fontWeight: 700, fontSize: 20 }}>{p.prenom} {p.nom}</span>
              <span style={{ background: niv.bg, color: niv.color, fontSize: 10, fontWeight: 700, padding: '2px 10px', borderRadius: 10 }}>
                {p.niveau}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4, flexWrap: 'wrap' }}>
              <span style={{ color: OR, fontWeight: 700, fontSize: 14 }}>⭐ {p.note}</span>
              <span style={{ color: 'rgba(14,12,9,0.4)', fontSize: 12 }}>({p.nb_avis} avis)</span>
              <span style={{ color: 'rgba(14,12,9,0.35)', fontSize: 12 }}>· {dist.toFixed(1)} km</span>
            </div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 6,
              background: disponible ? 'rgba(34,197,94,0.12)' : 'rgba(107,114,128,0.12)',
              color: disponible ? '#22c55e' : '#9ca3af',
              fontSize: 12, fontWeight: 600, padding: '3px 10px', borderRadius: 10,
            }}>
              ● {disponible ? 'En ligne maintenant' : 'Hors ligne'}
            </div>
          </div>
        </div>

        {/* Bio */}
        {p.bio && (
          <p style={{ color: 'rgba(14,12,9,0.65)', fontSize: 13, lineHeight: 1.5, marginTop: 14, marginBottom: 0 }}>
            {p.bio}
          </p>
        )}
      </div>

      {/* Stats rapides */}
      <div style={{ margin: '0 16px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 16 }}>
        {[
          { label: 'Services', value: p.services_rendus || '—' },
          { label: 'Réponse', value: p.temps_reponse || '—' },
          { label: 'Ville', value: p.ville },
        ].map((s, i) => (
          <div key={i} style={{ background: CARD, borderRadius: 10, padding: '10px 12px', textAlign: 'center', border: '1px solid rgba(14,12,9,0.06)' }}>
            <div style={{ color: OR, fontWeight: 700, fontSize: 16 }}>{s.value}</div>
            <div style={{ color: 'rgba(14,12,9,0.45)', fontSize: 11 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Spécialités */}
      <div style={{ margin: '0 16px 16px' }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: NOIR, marginBottom: 8 }}>Spécialités</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {p.specialites.map(s => (
            <span key={s} style={{ background: 'rgba(184,146,42,0.1)', color: OR, fontSize: 12, fontWeight: 600, padding: '4px 12px', borderRadius: 8 }}>{s}</span>
          ))}
        </div>
      </div>

      {/* Langues */}
      {p.langues && (
        <div style={{ margin: '0 16px 16px' }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: NOIR, marginBottom: 8 }}>Langues</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {p.langues.map(l => (
              <span key={l} style={{ background: 'rgba(14,12,9,0.06)', color: 'rgba(14,12,9,0.7)', fontSize: 12, fontWeight: 500, padding: '4px 12px', borderRadius: 8 }}>{l}</span>
            ))}
          </div>
        </div>
      )}

      {/* Modes de travail */}
      {p.modes_travail && (
        <div style={{ margin: '0 16px 16px' }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: NOIR, marginBottom: 8 }}>Modes de travail</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {p.modes_travail.map(m => {
              const info = MODE_LABELS[m] || { icon: '📍', label: m, desc: '' }
              return (
                <div key={m} style={{ display: 'flex', alignItems: 'center', gap: 10, background: CARD, borderRadius: 10, padding: '10px 14px', border: '1px solid rgba(14,12,9,0.06)' }}>
                  <span style={{ fontSize: 20 }}>{info.icon}</span>
                  <div>
                    <div style={{ color: NOIR, fontSize: 13, fontWeight: 600 }}>{info.label}</div>
                    <div style={{ color: 'rgba(14,12,9,0.45)', fontSize: 11 }}>{info.desc}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Localisation + Itinéraire */}
      <div style={{ margin: '0 16px 16px' }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: NOIR, marginBottom: 8 }}>Localisation</div>
        <div style={{ background: CARD, borderRadius: 12, padding: '14px 16px', border: '1px solid rgba(14,12,9,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12 }}>
            <span style={{ fontSize: 18, flexShrink: 0 }}>📍</span>
            <div>
              <div style={{ color: NOIR, fontSize: 13, fontWeight: 600 }}>{p.ville}</div>
              <div style={{ color: 'rgba(14,12,9,0.5)', fontSize: 12, marginTop: 2 }}>{p.adresse || 'Adresse sur demande'}</div>
              <div style={{ color: 'rgba(14,12,9,0.35)', fontSize: 11, marginTop: 2 }}>À {dist.toFixed(1)} km de vous</div>
            </div>
          </div>
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)',
              borderRadius: 10, padding: '10px 16px', textDecoration: 'none',
              color: '#3b82f6', fontWeight: 600, fontSize: 13,
            }}
          >
            🗺️ Voir l'itinéraire sur Google Maps
          </a>
        </div>
      </div>

      {/* Avis clients */}
      {p.avis && p.avis.length > 0 && (
        <div style={{ margin: '0 16px 16px' }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: NOIR, marginBottom: 8 }}>Avis clients</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {avisToShow.map((a, i) => (
              <div key={i} style={{ background: CARD, borderRadius: 10, padding: '12px 14px', border: '1px solid rgba(14,12,9,0.06)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ color: NOIR, fontWeight: 600, fontSize: 13 }}>{a.client}</span>
                  <span style={{ color: OR, fontSize: 12, fontWeight: 600 }}>{'★'.repeat(a.note)}{'☆'.repeat(5 - a.note)}</span>
                </div>
                <p style={{ color: 'rgba(14,12,9,0.6)', fontSize: 12, lineHeight: 1.5, margin: '4px 0 0' }}>{a.texte}</p>
                <div style={{ color: 'rgba(14,12,9,0.3)', fontSize: 11, marginTop: 4 }}>{a.date}</div>
              </div>
            ))}
          </div>
          {p.avis.length > 2 && !showAllAvis && (
            <button onClick={() => setShowAllAvis(true)}
              style={{ background: 'none', border: 'none', color: OR, fontSize: 13, fontWeight: 600, cursor: 'pointer', marginTop: 8, padding: 0 }}>
              Voir tous les avis ({p.avis.length}) →
            </button>
          )}
        </div>
      )}

      {/* Info abonnés */}
      <div style={{ margin: '0 16px 20px', background: 'rgba(184,146,42,0.07)', border: `1px solid rgba(184,146,42,0.2)`, borderRadius: 12, padding: '12px 16px' }}>
        <div style={{ fontSize: 12, color: OR, fontWeight: 700, marginBottom: 2 }}>💎 Abonnés Kadio</div>
        <div style={{ fontSize: 12, color: 'rgba(14,12,9,0.6)', lineHeight: 1.4 }}>
          Les abonnés ont accès à tout le réseau Kadio partout au Québec avec des tarifs préférentiels.
        </div>
      </div>

      {/* Bouton réserver — sticky */}
      <div style={{
        position: 'fixed', bottom: 64, left: 0, right: 0, zIndex: 50,
        padding: '12px 16px', background: `linear-gradient(transparent, ${CREME} 20%)`,
      }}>
        <button
          onClick={() => navigate(`/client/reserver/${p.id}`)}
          disabled={!disponible}
          style={{
            width: '100%', padding: '15px 0', borderRadius: 14, border: 'none',
            background: disponible ? OR : 'rgba(14,12,9,0.1)',
            color: disponible ? NOIR : 'rgba(14,12,9,0.3)',
            fontWeight: 700, fontSize: 16, cursor: disponible ? 'pointer' : 'default',
            fontFamily: `'DM Sans', sans-serif`,
            boxShadow: disponible ? '0 4px 20px rgba(184,146,42,0.3)' : 'none',
          }}
        >
          {disponible ? 'Réserver maintenant' : 'Indisponible — Revenez plus tard'}
        </button>
      </div>
    </div>
  )
}
