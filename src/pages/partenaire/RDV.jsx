import { useState } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { useRdvPartenaire } from '@/hooks'
import { OR, CREME, NOIR, CARD, formatMontant, formatDate, statutColor } from '@/lib/utils'

const TODAY = '2026-03-27'

const TABS = [
  { key: 'tous', label: 'Tous' },
  { key: 'aujourdhui', label: `Aujourd'hui` },
  { key: 'avenir', label: 'À venir' },
  { key: 'passes', label: 'Passés' },
  { key: 'annules', label: 'Annulés' },
]

function statutLabel(s) {
  const MAP = { confirme: 'Confirmé', en_cours: 'En cours', termine: 'Terminé', annule: 'Annulé' }
  return MAP[s] || s
}

function lieuLabel(lieu) {
  const MAP = {
    au_salon:              '🏠 Salon Kadio · 50%',
    chez_coiffeur:         '✂️ Chez le coiffeur · 75%',
    deplacement_voiture:   '🚗 Déplacement voiture · 75%',
    deplacement_transport: '🚌 Déplacement transport · 75%',
    mode_mixte:            '🔄 Mode mixte · 75%',
    // legacy
    domicile_client:       '🚗 Domicile client · 75%',
    salon_kadio:           '🏠 Salon Kadio · 50%',
  }
  return MAP[lieu] || lieu
}

function formatHeure(h) {
  return h ? h.slice(0, 5) : '—'
}

function StarRating({ value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: '6px' }}>
      {[1, 2, 3, 4, 5].map(star => (
        <button key={star} onClick={() => onChange(star)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: '22px', color: star <= value ? OR : 'rgba(14,12,9,0.2)',
            padding: '2px',
          }}>
          ★
        </button>
      ))}
    </div>
  )
}

function RDVCard({ rdv }) {
  const [expanded, setExpanded] = useState(false)
  const [note, setNote] = useState(0)
  const [commentaire, setCommentaire] = useState('')
  const [evaluated, setEvaluated] = useState(!!rdv.note_partenaire)

  return (
    <div style={{
      background: CARD, borderRadius: '12px', marginBottom: '10px',
      border: `1px solid rgba(184,146,42,0.12)`, overflow: 'hidden',
    }}>
      <button
        onClick={() => setExpanded(v => !v)}
        style={{
          width: '100%', background: 'none', border: 'none', cursor: 'pointer',
          padding: '14px', fontFamily: `'DM Sans', sans-serif`,
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
          textAlign: 'left',
        }}>
        <div>
          <div style={{ color: NOIR, fontWeight: 700, fontSize: '14px' }}>
            {formatDate(rdv.date_rdv)} · {formatHeure(rdv.heure_debut)}
          </div>
          <div style={{ color: `rgba(14,12,9,0.7)`, fontSize: '13px', marginTop: '3px' }}>
            {rdv.service.nom} — {rdv.client.prenom}
          </div>
          <div style={{ marginTop: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              fontSize: '11px', fontWeight: 600, padding: '2px 9px', borderRadius: '999px',
              background: `${statutColor(rdv.statut)}22`, color: statutColor(rdv.statut),
            }}>
              {statutLabel(rdv.statut)}
            </span>
            <span style={{ color: '#22c55e', fontSize: '12px', fontWeight: 600 }}>
              {formatMontant(rdv.commission)}
            </span>
          </div>
        </div>
        <span style={{ color: OR, fontSize: '16px', marginTop: '2px' }}>{expanded ? '▲' : '▼'}</span>
      </button>

      {expanded && (
        <div style={{ borderTop: `1px solid rgba(14,12,9,0.08)`, padding: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
            <div>
              <div style={{ fontSize: '11px', color: `rgba(14,12,9,0.45)`, marginBottom: '3px' }}>Lieu</div>
              <div style={{ fontSize: '13px' }}>{lieuLabel(rdv.lieu)}</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: `rgba(14,12,9,0.45)`, marginBottom: '3px' }}>Durée</div>
              <div style={{ fontSize: '13px' }}>{rdv.service.duree_minutes} min</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: `rgba(14,12,9,0.45)`, marginBottom: '3px' }}>Prix total</div>
              <div style={{ fontSize: '13px' }}>{formatMontant(rdv.prix_total)}</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: `rgba(14,12,9,0.45)`, marginBottom: '3px' }}>Commission</div>
              <div style={{ fontSize: '13px', color: '#22c55e', fontWeight: 700 }}>{formatMontant(rdv.commission)}</div>
            </div>
          </div>
          {rdv.adresse && (
            <div style={{ marginBottom: '10px' }}>
              <div style={{ fontSize: '11px', color: `rgba(14,12,9,0.45)`, marginBottom: '3px' }}>Adresse</div>
              <div style={{ fontSize: '13px' }}>{rdv.adresse}</div>
            </div>
          )}
          <div style={{ marginBottom: '12px' }}>
            <div style={{ fontSize: '11px', color: `rgba(14,12,9,0.45)`, marginBottom: '3px' }}>Code QR</div>
            <div style={{
              fontFamily: 'monospace', fontSize: '12px', color: OR,
              background: `rgba(184,146,42,0.08)`, padding: '6px 10px',
              borderRadius: '6px', display: 'inline-block',
            }}>
              {rdv.code_qr}
            </div>
          </div>
          {rdv.statut === 'confirme' && (
            <div style={{ fontSize: '12px', color: `rgba(14,12,9,0.5)`, fontStyle: 'italic' }}>
              Le client présentera ce code QR à l&apos;arrivée.
            </div>
          )}
          {rdv.statut === 'termine' && rdv.note_partenaire === null && !evaluated && (
            <div style={{
              marginTop: '12px', background: `rgba(184,146,42,0.06)`, borderRadius: '10px',
              padding: '12px', border: `1px solid rgba(14,12,9,0.08)`,
            }}>
              <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '10px', color: OR }}>Évaluer ce client</div>
              <StarRating value={note} onChange={setNote} />
              <textarea
                value={commentaire}
                onChange={e => setCommentaire(e.target.value)}
                placeholder="Commentaire optionnel..."
                rows={2}
                style={{
                  width: '100%', marginTop: '10px', background: '#FAFAF8',
                  border: `1px solid rgba(14,12,9,0.08)`, borderRadius: '8px',
                  padding: '8px 10px', color: NOIR, fontFamily: `'DM Sans', sans-serif`,
                  fontSize: '13px', resize: 'none', boxSizing: 'border-box',
                }}
              />
              <button
                onClick={() => { if (note > 0) setEvaluated(true) }}
                disabled={note === 0}
                style={{
                  marginTop: '10px',
                  background: note > 0 ? OR : 'rgba(14,12,9,0.08)',
                  color: note > 0 ? '#0E0C09' : `rgba(250,248,248,0.3)`,
                  border: 'none', borderRadius: '8px', padding: '8px 16px',
                  fontSize: '13px', fontWeight: 700,
                  cursor: note > 0 ? 'pointer' : 'default',
                  fontFamily: `'DM Sans', sans-serif`,
                }}>
                Soumettre
              </button>
            </div>
          )}
          {rdv.statut === 'termine' && (evaluated || rdv.note_partenaire !== null) && (
            <div style={{ marginTop: '10px', fontSize: '13px', color: '#22c55e' }}>
              ✓ Client évalué — {rdv.note_partenaire ?? note} ⭐
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function PartenaireRDV() {
  const { partenaire } = useAuthStore()
  const partenaireId = partenaire?.id || 'part-diane'

  const { data: rdvList, loading } = useRdvPartenaire(partenaireId)
  const [activeTab, setActiveTab] = useState('tous')

  if (loading) {
    return <div style={{ fontFamily: `'DM Sans', sans-serif`, color: NOIR, padding: '16px', textAlign: 'center' }}>Chargement...</div>
  }

  const filtered = (rdvList || []).filter(r => {
    if (activeTab === 'tous') return true
    if (activeTab === 'aujourdhui') return r.date_rdv === TODAY
    if (activeTab === 'avenir') return r.date_rdv > TODAY
    if (activeTab === 'passes') return r.date_rdv < TODAY && r.statut === 'termine'
    if (activeTab === 'annules') return r.statut === 'annule'
    return true
  })

  return (
    <div style={{ fontFamily: `'DM Sans', sans-serif`, color: NOIR, padding: '16px', paddingBottom: '100px' }}>
      <div style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px' }}>Mes RDV</div>
      <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', overflowX: 'auto', paddingBottom: '4px' }}>
        {TABS.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            style={{
              background: activeTab === tab.key ? OR : `rgba(14,12,9,0.08)`,
              color: activeTab === tab.key ? '#0E0C09' : `rgba(250,248,248,0.7)`,
              border: 'none', borderRadius: '999px', padding: '7px 14px',
              fontSize: '12px', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap',
              fontFamily: `'DM Sans', sans-serif`,
            }}>
            {tab.label}
          </button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', color: `rgba(14,12,9,0.4)`, padding: '40px 20px', fontSize: '14px' }}>
          Aucun RDV dans cette catégorie
        </div>
      ) : (
        filtered.map(rdv => <RDVCard key={rdv.id} rdv={rdv} />)
      )}
    </div>
  )
}
