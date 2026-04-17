import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { useDispoStore } from '@/stores/dispoStore'
import { useRdvPartenaire, usePartenaireProfil } from '@/hooks'
import { OR, CREME, NOIR, CARD, formatMontant, statutColor } from '@/lib/utils'

const TODAY = '2026-03-27'

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return `Bonne matinée`
  if (h < 18) return `Bon après-midi`
  return `Bonne soirée`
}

function formatHeure(h) {
  return h ? h.slice(0, 5) : '—'
}

function statutLabel(s) {
  const MAP = { confirme: 'Confirmé', en_cours: 'En cours', termine: 'Terminé', annule: 'Annulé' }
  return MAP[s] || s
}

export default function PartenaireAccueil() {
  const { partenaire } = useAuthStore()
  const navigate = useNavigate()
  const partenaireId = partenaire?.id || 'part-diane'
  const userId = partenaire?.user_id || 'usr-diane'

  const { data: rdvData, loading: loadingRdv } = useRdvPartenaire(partenaireId)
  const [rdvList, setRdvList] = useState([])
  const { data: profil, loading: loadingProfil } = usePartenaireProfil(userId)

  useEffect(() => { if (rdvData) setRdvList(rdvData) }, [rdvData])

  // Dispo synchronisée via dispoStore (temps réel)
  const partId = partenaire?.id || partenaireId
  const disponible = useDispoStore(s => s.getDispo(partId))
  const toggleDispo = useDispoStore(s => s.toggleDispo)

  if (loadingRdv || loadingProfil) {
    return <div style={{ fontFamily: `'DM Sans', sans-serif`, color: NOIR, padding: '16px', textAlign: 'center' }}>Chargement...</div>
  }

  const p = profil || {}
  const todayRDV = (rdvList || []).filter(r => r.date_rdv === TODAY)
  const solde = p.portefeuille_solde ?? 0
  const note = p.note_moyenne ?? 0
  const revenus = 389.75

  function marquerTermine(id) {
    setRdvList(prev => prev.map(r => r.id === id ? { ...r, statut: 'termine' } : r))
  }

  const lieuIcon = (lieu) => {
    if (lieu === 'au_salon') return '🏠'
    if (lieu === 'chez_coiffeur') return '✂️'
    if (lieu === 'deplacement_voiture') return '🚗'
    if (lieu === 'deplacement_transport') return '🚌'
    if (lieu === 'mode_mixte') return '🔄'
    // legacy keys
    if (lieu === 'domicile_client') return '🚗'
    return '📍'
  }

  return (
    <div style={{ fontFamily: `'DM Sans', sans-serif`, color: NOIR, padding: '16px', paddingBottom: '100px' }}>

      {/* Vacances banner */}
      {p?.mode_vacances && (
        <div style={{ background: '#f59e0b', color: NOIR, borderRadius: '10px', padding: '10px 14px', marginBottom: '16px', fontWeight: 600, fontSize: '14px' }}>
          Mode vacances activé — Votre profil est masqué des recherches
        </div>
      )}

      {/* Header greeting + toggle */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
        <div>
          <div style={{ fontSize: '22px', fontWeight: 700 }}>
            {`Bonjour ${p?.prenom || 'Diane'} 👋`}
          </div>
          <div style={{ fontSize: '13px', color: `rgba(14,12,9,0.55)`, marginTop: '2px' }}>{getGreeting()}</div>
        </div>
        {/* Disponibilité toggle */}
        <button
          onClick={() => toggleDispo(partId)}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: disponible ? 'rgba(34,197,94,0.15)' : 'rgba(107,114,128,0.2)',
            border: `1px solid ${disponible ? '#22c55e' : '#6b7280'}`,
            borderRadius: '999px', padding: '8px 14px', cursor: 'pointer',
            color: disponible ? '#22c55e' : '#9ca3af', fontFamily: `'DM Sans', sans-serif`,
            fontSize: '13px', fontWeight: 600, transition: 'all 0.2s',
          }}>
          <span style={{
            width: '10px', height: '10px', borderRadius: '50%',
            background: disponible ? '#22c55e' : '#6b7280',
            display: 'inline-block',
          }} />
          {disponible ? 'Disponible' : 'Indisponible'}
        </button>
      </div>

      {/* KPI grid 2×2 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '24px' }}>
        {[
          { label: `RDV aujourd'hui`, value: todayRDV.length, color: OR },
          { label: 'Solde', value: formatMontant(solde), color: '#22c55e' },
          { label: 'Note', value: `⭐ ${note}`, color: OR },
          { label: 'Revenus ce mois', value: formatMontant(revenus), color: '#22c55e' },
        ].map((kpi, i) => (
          <div key={i} style={{ background: CARD, borderRadius: '12px', padding: '14px', border: `1px solid rgba(14,12,9,0.08)` }}>
            <div style={{ fontSize: '11px', color: `rgba(14,12,9,0.5)`, marginBottom: '6px' }}>{kpi.label}</div>
            <div style={{ fontSize: '20px', fontWeight: 700, color: kpi.color }}>{kpi.value}</div>
          </div>
        ))}
      </div>

      {/* Aujourd'hui section */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px', color: OR }}>{`Aujourd'hui`}</div>
        {todayRDV.length === 0 && (
          <div style={{ color: `rgba(14,12,9,0.4)`, fontSize: '14px', textAlign: 'center', padding: '20px' }}>
            Aucun RDV aujourd&apos;hui
          </div>
        )}
        {todayRDV.map(rdv => (
          <div key={rdv.id} style={{
            background: CARD, borderRadius: '12px', padding: '14px', marginBottom: '10px',
            border: `1px solid rgba(184,146,42,0.12)`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '15px' }}>
                  {formatHeure(rdv.heure_debut)} — {rdv.service.nom}
                </div>
                <div style={{ fontSize: '13px', color: `rgba(14,12,9,0.6)`, marginTop: '2px' }}>
                  {lieuIcon(rdv.lieu)} {rdv.client.prenom}
                  {rdv.adresse && ` · ${rdv.adresse.split(',')[0]}`}
                </div>
              </div>
              <span style={{
                fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '999px',
                background: `${statutColor(rdv.statut)}22`, color: statutColor(rdv.statut),
              }}>
                {statutLabel(rdv.statut)}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
              <div style={{ fontSize: '13px', color: '#22c55e', fontWeight: 600 }}>
                Commission : {formatMontant(rdv.commission)}
              </div>
              {rdv.statut === 'confirme' && (
                <button
                  onClick={() => navigate('/partenaire/scanner')}
                  style={{
                    background: OR, color: '#0E0C09', border: 'none', borderRadius: '8px',
                    padding: '7px 12px', fontSize: '12px', fontWeight: 700, cursor: 'pointer',
                    fontFamily: `'DM Sans', sans-serif`,
                  }}>
                  Scanner à l&apos;arrivée
                </button>
              )}
              {rdv.statut === 'en_cours' && (
                <button
                  onClick={() => marquerTermine(rdv.id)}
                  style={{
                    background: '#22c55e', color: '#0E0C09', border: 'none', borderRadius: '8px',
                    padding: '7px 12px', fontSize: '12px', fontWeight: 700, cursor: 'pointer',
                    fontFamily: `'DM Sans', sans-serif`,
                  }}>
                  Marquer terminé
                </button>
              )}
              {rdv.statut === 'termine' && (
                <span style={{ fontSize: '18px' }}>✅</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Accès rapide */}
      <div>
        <div style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px', color: OR }}>Accès rapide</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <button
            onClick={() => navigate('/partenaire/scanner')}
            style={{
              background: CARD, border: `1px solid ${OR}`, borderRadius: '12px',
              padding: '16px', color: OR, fontFamily: `'DM Sans', sans-serif`,
              fontSize: '14px', fontWeight: 700, cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
            }}>
            <span style={{ fontSize: '24px' }}>📷</span>
            Scanner QR
          </button>
          <button
            onClick={() => navigate('/partenaire/rdv')}
            style={{
              background: CARD, border: `1px solid rgba(14,12,9,0.08)`, borderRadius: '12px',
              padding: '16px', color: NOIR, fontFamily: `'DM Sans', sans-serif`,
              fontSize: '14px', fontWeight: 700, cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
            }}>
            <span style={{ fontSize: '24px' }}>📅</span>
            Mes RDV
          </button>
        </div>
      </div>

      {/* Liens vers autres modules */}
      <div style={{ marginTop: '24px' }}>
        <div style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px', color: OR }}>Mon espace</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
          {[
            { icon: '📆', label: 'Disponibilités', path: '/partenaire/disponibilites' },
            { icon: '💈', label: 'Réserver salon', path: '/partenaire/salon' },
            { icon: '🛍️', label: 'Matériel', path: '/partenaire/materiel' },
            { icon: '🏆', label: 'Certificat', path: '/partenaire/certificat' },
            { icon: '🌴', label: 'Vacances', path: '/partenaire/vacances' },
            { icon: '👤', label: 'Profil', path: '/partenaire/profil' },
          ].map(item => (
            <button key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                background: CARD, border: `1px solid rgba(14,12,9,0.08)`, borderRadius: '10px',
                padding: '12px 6px', color: NOIR, fontFamily: `'DM Sans', sans-serif`,
                fontSize: '11px', fontWeight: 600, cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
              }}>
              <span style={{ fontSize: '20px' }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
