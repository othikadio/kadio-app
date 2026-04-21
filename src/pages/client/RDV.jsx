import { useState } from 'react'
import { OR, CREME, NOIR, CARD, formatDate, formatDateShort, statutColor, initiales } from '@/lib/utils'
import { useRdvClient } from '@/hooks'
import QRDisplay from '@/components/ui/QRDisplay'

const LIEU_ICON = {
  domicile_client: '🏠',
  salon_kadio:     '💈',
  deplacement:     '🚗',
}

function Stars({ note, size = 14 }) {
  const full = Math.round(note || 0)
  return (
    <span style={{ fontSize: size, letterSpacing: 1 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} style={{ color: i < full ? OR : 'rgba(14,12,9,0.08)' }}>★</span>
      ))}
    </span>
  )
}

function StatutBadge({ statut }) {
  const color = statutColor(statut)
  const labels = {
    confirme: 'Confirmé',
    en_attente: 'En attente',
    termine: 'Terminé',
    annule: 'Annulé',
    no_show: 'No-show',
  }
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 10px',
      borderRadius: 20,
      fontSize: 11,
      fontWeight: 700,
      color,
      background: `${color}18`,
      border: `1px solid ${color}40`,
      textTransform: 'capitalize',
    }}>
      {labels[statut] || statut}
    </span>
  )
}

function QRModal({ rdv, onClose }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(14,12,9,0.95)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: 32,
        fontFamily: `'DM Sans', sans-serif`,
        overflowY: 'auto',
      }}
    >
      <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: 360 }}>
        <QRDisplay rdv={rdv} />
        <button
          onClick={onClose}
          style={{
            marginTop: 16,
            width: '100%',
            padding: '13px 0',
            background: 'transparent',
            border: `1.5px solid rgba(14,12,9,0.08)`,
            borderRadius: 12,
            color: NOIR,
            fontWeight: 600,
            fontSize: 15,
            cursor: 'pointer',
            fontFamily: `'DM Sans', sans-serif`,
          }}
        >
          ✕ Fermer
        </button>
      </div>
    </div>
  )
}

function InlineRating({ rdvId, onSubmit }) {
  const [hovered, setHovered] = useState(0)
  const [selected, setSelected] = useState(0)
  const [submitted, setSubmitted] = useState(false)

  if (submitted) {
    return <span style={{ color: '#22c55e', fontSize: 12 }}>✓ Avis soumis, merci !</span>
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ color: 'rgba(14,12,9,0.5)', fontSize: 12 }}>Note :</span>
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          onMouseEnter={() => setHovered(i + 1)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => setSelected(i + 1)}
          style={{
            fontSize: 20,
            cursor: 'pointer',
            color: i < (hovered || selected) ? OR : 'rgba(14,12,9,0.08)',
          }}
        >
          ★
        </span>
      ))}
      {selected > 0 && (
        <button
          onClick={() => { setSubmitted(true); onSubmit(selected) }}
          style={{
            padding: '4px 12px',
            background: OR,
            color: NOIR,
            border: 'none',
            borderRadius: 8,
            fontWeight: 700,
            fontSize: 12,
            cursor: 'pointer',
            fontFamily: `'DM Sans', sans-serif`,
          }}
        >
          Envoyer
        </button>
      )}
    </div>
  )
}

export default function ClientRDV() {
  const { data: rdvList, loading } = useRdvClient('client-aminata')
  const [qrRdv, setQrRdv] = useState(null)
  const [cancelConfirm, setCancelConfirm] = useState(null)
  const [cancelledIds, setCancelledIds] = useState([])

  if (loading) {
    return <div style={{ fontFamily: `'DM Sans', sans-serif`, background: CREME, minHeight: '100vh', padding: '32px 16px', textAlign: 'center', color: 'rgba(14,12,9,0.4)' }}>Chargement...</div>
  }

  const upcoming = rdvList.filter(r =>
    (r.statut === 'confirme' || r.statut === 'en_attente') && !cancelledIds.includes(r.id)
  )
  const past = rdvList.filter(r =>
    r.statut === 'termine' || r.statut === 'annule' || r.statut === 'no_show' || cancelledIds.includes(r.id)
  )

  function handleCancel(rdv) {
    setCancelConfirm(rdv)
  }

  function confirmCancel() {
    if (cancelConfirm) {
      setCancelledIds(ids => [...ids, cancelConfirm.id])
      setCancelConfirm(null)
    }
  }

  return (
    <div style={{ fontFamily: `'DM Sans', sans-serif`, background: CREME, minHeight: '100vh', paddingBottom: 100 }}>

      {qrRdv && <QRModal rdv={qrRdv} onClose={() => setQrRdv(null)} />}

      {/* Cancel confirm overlay */}
      {cancelConfirm && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 90,
          background: 'rgba(14,12,9,0.85)',
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
          fontFamily: `'DM Sans', sans-serif`,
        }}>
          <div style={{
            background: CARD,
            border: `1.5px solid rgba(14,12,9,0.08)`,
            borderRadius: '20px 20px 0 0',
            padding: '28px 24px 36px',
            width: '100%',
            maxWidth: 480,
          }}>
            <h3 style={{ color: NOIR, fontSize: 17, fontWeight: 700, marginBottom: 8 }}>
              Annuler ce rendez-vous ?
            </h3>
            <p style={{ color: 'rgba(14,12,9,0.5)', fontSize: 13, marginBottom: 20 }}>
              {cancelConfirm.service.nom} · {formatDateShort(cancelConfirm.date_rdv)} à {cancelConfirm.heure_debut}
            </p>
            <p style={{ color: '#f59e0b', fontSize: 12, marginBottom: 20, padding: '8px 12px', background: 'rgba(245,158,11,0.08)', borderRadius: 8, border: '1px solid rgba(245,158,11,0.2)' }}>
              ⚠️ Le dépôt de {cancelConfirm.depot_paye} $ peut ne pas être remboursé selon la politique d'annulation.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setCancelConfirm(null)}
                style={{
                  flex: 1, padding: '12px 0', background: 'transparent',
                  border: `1.5px solid rgba(14,12,9,0.08)`, borderRadius: 12,
                  color: NOIR, fontWeight: 600, fontSize: 14, cursor: 'pointer',
                  fontFamily: `'DM Sans', sans-serif`,
                }}
              >
                Garder le RDV
              </button>
              <button
                onClick={confirmCancel}
                style={{
                  flex: 1, padding: '12px 0', background: '#ef4444',
                  border: 'none', borderRadius: 12,
                  color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer',
                  fontFamily: `'DM Sans', sans-serif`,
                }}
              >
                Pas maintenant
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ padding: '24px 20px 16px', borderBottom: '1px solid rgba(14,12,9,0.08)' }}>
        <h1 style={{ color: NOIR, fontSize: 22, fontWeight: 700, margin: 0 }}>
          Mes rendez-vous
        </h1>
      </div>

      <div style={{ padding: '20px 16px' }}>

        {/* Upcoming */}
        {upcoming.length > 0 && (
          <div style={{ marginBottom: 28 }}>
            <h2 style={{ color: OR, fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 14 }}>
              À venir ({upcoming.length})
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {upcoming.map(rdv => (
                <RDVCard
                  key={rdv.id}
                  rdv={rdv}
                  onQR={() => setQrRdv(rdv)}
                  onCancel={() => handleCancel(rdv)}
                  showActions
                />
              ))}
            </div>
          </div>
        )}

        {upcoming.length === 0 && (
          <div style={{ textAlign: 'center', padding: '32px 0', marginBottom: 28 }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>📅</div>
            <p style={{ color: 'rgba(14,12,9,0.4)', fontSize: 14 }}>
              Aucun rendez-vous à venir
            </p>
          </div>
        )}

        {/* Past */}
        {past.length > 0 && (
          <div>
            <h2 style={{ color: 'rgba(14,12,9,0.4)', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 14 }}>
              Historique récent
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {past.map(rdv => (
                <RDVCardPast key={rdv.id} rdv={rdv} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function RDVCard({ rdv, onQR, onCancel, showActions }) {
  return (
    <div style={{
      background: CARD,
      border: `1.5px solid rgba(14,12,9,0.08)`,
      borderRadius: 14,
      padding: '16px 16px',
      fontFamily: `'DM Sans', sans-serif`,
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
        <div>
          <div style={{ color: NOIR, fontWeight: 700, fontSize: 15, marginBottom: 4 }}>
            {rdv.service.nom}
          </div>
          <StatutBadge statut={rdv.statut} />
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ color: OR, fontWeight: 700, fontSize: 16 }}>{rdv.prix_total} $</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 14 }}>📅</span>
          <span style={{ color: 'rgba(14,12,9,0.7)', fontSize: 13 }}>
            {formatDate(rdv.date_rdv)} · {rdv.heure_debut}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 14 }}>{LIEU_ICON[rdv.lieu] || '📍'}</span>
          <span style={{ color: 'rgba(14,12,9,0.7)', fontSize: 13 }}>
            {rdv.lieu === 'domicile_client' ? `Chez vous` : rdv.lieu === 'au_salon' ? 'Salon Kadio' : `Déplacement`}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <div style={{
          width: 30, height: 30, borderRadius: '50%',
          background: 'rgba(14,12,9,0.08)', border: `1.5px solid rgba(14,12,9,0.08)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 700, fontSize: 11, color: OR, flexShrink: 0,
        }}>
          {initiales(rdv.partenaire.prenom, rdv.partenaire.nom)}
        </div>
        <span style={{ color: 'rgba(14,12,9,0.7)', fontSize: 13 }}>
          {rdv.partenaire.prenom} {rdv.partenaire.nom}
        </span>
        <Stars note={rdv.partenaire.note} size={12} />
      </div>

      {showActions && (
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={onQR}
            style={{
              flex: 1,
              padding: '9px 0',
              background: 'rgba(14,12,9,0.08)',
              border: `1px solid rgba(14,12,9,0.08)`,
              borderRadius: 10,
              color: OR,
              fontWeight: 600,
              fontSize: 13,
              cursor: 'pointer',
              fontFamily: `'DM Sans', sans-serif`,
            }}
          >
            QR Code
          </button>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: '9px 0',
              background: 'transparent',
              border: `1px solid rgba(239,68,68,0.3)`,
              borderRadius: 10,
              color: '#ef4444',
              fontWeight: 600,
              fontSize: 13,
              cursor: 'pointer',
              fontFamily: `'DM Sans', sans-serif`,
            }}
          >
            Pas maintenant
          </button>
        </div>
      )}
    </div>
  )
}

function RDVCardPast({ rdv }) {
  const [showRating, setShowRating] = useState(false)
  const isCancelled = rdv.statut === 'annule' || rdv.statut === 'no_show'

  return (
    <div style={{
      background: CARD,
      border: `1px solid rgba(184,146,42,0.08)`,
      borderRadius: 12,
      padding: '12px 14px',
      opacity: isCancelled ? 0.65 : 1,
      fontFamily: `'DM Sans', sans-serif`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <div>
          <span style={{ color: NOIR, fontWeight: 600, fontSize: 13 }}>{rdv.service.nom}</span>
          <span style={{ color: 'rgba(14,12,9,0.35)', fontSize: 12, marginLeft: 8 }}>
            {formatDateShort(rdv.date_rdv)}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <StatutBadge statut={rdv.statut} />
          <span style={{ color: 'rgba(14,12,9,0.5)', fontSize: 13, fontWeight: 600 }}>
            {rdv.prix_total} $
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ color: 'rgba(14,12,9,0.4)', fontSize: 12 }}>
          {rdv.partenaire.prenom} {rdv.partenaire.nom}
        </span>
        {rdv.statut === 'termine' && (
          rdv.avis_laisse
            ? <Stars note={rdv.note_client} size={14} />
            : (
              showRating
                ? <InlineRatingSmall onDone={() => setShowRating(false)} />
                : (
                  <button
                    onClick={() => setShowRating(true)}
                    style={{
                      background: 'none', border: `1px solid rgba(14,12,9,0.08)`,
                      borderRadius: 8, padding: '4px 10px',
                      color: OR, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                      fontFamily: `'DM Sans', sans-serif`,
                    }}
                  >
                    Laisser un avis
                  </button>
                )
            )
        )}
      </div>

      {showRating && (
        <div style={{ marginTop: 10 }}>
          <InlineRatingFull onDone={() => setShowRating(false)} />
        </div>
      )}
    </div>
  )
}

function InlineRatingSmall({ onDone }) {
  return (
    <span style={{ color: 'rgba(14,12,9,0.4)', fontSize: 12 }}>…</span>
  )
}

function InlineRatingFull({ onDone }) {
  const [hovered, setHovered] = useState(0)
  const [selected, setSelected] = useState(0)
  const [commentaire, setCommentaire] = useState('')
  const [submitted, setSubmitted] = useState(false)

  if (submitted) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <span style={{ color: '#22c55e', fontSize: 13, fontWeight: 600 }}>✓ Merci pour votre avis !</span>
        {selected >= 4 && (
          <a
            href="https://g.page/r/kadio-coiffure/review"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: '#4285F4', color: '#fff', borderRadius: 8, fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>
            ⭐ Laisser un avis Google
          </a>
        )}
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ fontSize: 12, color: 'rgba(14,12,9,0.6)', fontWeight: 600 }}>Comment s'est passé votre soin ?</div>
      <div style={{ display: 'flex', gap: 6 }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            onMouseEnter={() => setHovered(i + 1)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => setSelected(i + 1)}
            style={{ fontSize: 26, cursor: 'pointer', color: i < (hovered || selected) ? OR : 'rgba(14,12,9,0.08)' }}
          >
            ★
          </span>
        ))}
      </div>
      {selected > 0 && (
        <>
          <textarea
            value={commentaire}
            onChange={e => setCommentaire(e.target.value)}
            placeholder="Un commentaire (optionnel)…"
            rows={2}
            style={{ width: '100%', background: CREME, border: `1px solid rgba(14,12,9,0.08)`, borderRadius: 8, padding: '8px 10px', color: NOIR, fontFamily: `'DM Sans', sans-serif`, fontSize: 13, resize: 'none', boxSizing: 'border-box' }}
          />
          <button
            onClick={() => setSubmitted(true)}
            style={{ padding: '9px 0', background: OR, color: NOIR, border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: `'DM Sans', sans-serif` }}
          >
            Soumettre mon avis
          </button>
        </>
      )}
    </div>
  )
}

