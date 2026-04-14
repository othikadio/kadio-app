import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { useRdvEmploye, useEmployeProfil } from '@/hooks'
import { MOCK_STATS_MARCUS } from '@/data/mockEmploye'
import { OR, CREME, NOIR, CARD, statutColor, formatHeure, formatMontant } from '@/lib/utils'

const TODAY = '2026-03-28'

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return `Bonne matinée`
  if (h < 18) return `Bon après-midi`
  return `Bonne soirée`
}

function statutAccentColor(statut) {
  if (statut === 'termine') return '#22c55e'
  if (statut === 'en_cours') return '#f59e0b'
  if (statut === 'confirme') return '#f59e0b'
  if (statut === 'annule') return '#ef4444'
  return '#6b7280'
}

export default function EmployeAccueil() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [disponible, setDisponible] = useState(true)
  const { data: rdvList = [], loading: loadingRdv } = useRdvEmploye('emp-marcus')
  const { data: profil, loading: loadingProfil } = useEmployeProfil('usr-marcus')

  if (loadingRdv || loadingProfil) {
    return <div className="p-8 text-center text-zinc-400">Chargement...</div>
  }

  const todayRdvs = rdvList
    .filter(r => r.date_rdv === TODAY)
    .sort((a, b) => a.heure_debut.localeCompare(b.heure_debut))

  const commissionAujourdhui = todayRdvs
    .filter(r => r.statut === 'termine' || r.statut === 'en_cours')
    .reduce((sum, r) => sum + r.commission, 0)

  return (
    <div style={{
      fontFamily: `'DM Sans', sans-serif`,
      color: NOIR,
      padding: '16px',
      paddingBottom: '100px',
    }}>

      {/* ── Header section ── */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '13px', color: `rgba(14,12,9,0.5)`, marginBottom: '4px' }}>
          {getGreeting()}
        </div>
        <div style={{ fontSize: '22px', fontWeight: 700, marginBottom: '4px' }}>
          Bonjour Marcus 👋
        </div>
        <div style={{ fontSize: '13px', color: `rgba(14,12,9,0.5)`, marginBottom: '14px' }}>
          Samedi 28 mars 2026
        </div>

        {/* Disponible toggle */}
        <div
          onClick={() => setDisponible(d => !d)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            background: disponible ? 'rgba(34,197,94,0.12)' : 'rgba(107,114,128,0.12)',
            border: `1px solid ${disponible ? 'rgba(34,197,94,0.35)' : 'rgba(107,114,128,0.3)'}`,
            borderRadius: '999px',
            padding: '8px 18px',
            cursor: 'pointer',
            userSelect: 'none',
          }}
        >
          <div style={{
            width: '36px',
            height: '20px',
            borderRadius: '999px',
            background: disponible ? '#22c55e' : '#6b7280',
            position: 'relative',
            transition: 'background 0.2s',
          }}>
            <div style={{
              position: 'absolute',
              top: '2px',
              left: disponible ? '18px' : '2px',
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              background: '#fff',
              transition: 'left 0.2s',
            }} />
          </div>
          <span style={{
            fontSize: '13px',
            fontWeight: 700,
            color: disponible ? '#22c55e' : '#6b7280',
          }}>
            {disponible ? `Disponible` : `Indisponible`}
          </span>
        </div>
      </div>

      {/* ── Bannière MVP ── */}
      {profil?.recompenses && (() => {
        const r = profil.recompenses
        const restant = 20 - r.services_mois
        if (restant <= 0) return null
        return (
          <div
            onClick={() => navigate('/employe/recompenses')}
            style={{
              background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.3)',
              borderRadius: '12px', padding: '12px 16px', marginBottom: '20px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer',
            }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#f59e0b' }}>
                🏆 Encore {restant} services pour le badge MVP (+75 $)
              </div>
              <div style={{ fontSize: '11px', color: `rgba(14,12,9,0.5)`, marginTop: '2px' }}>
                {r.services_mois}/20 services ce mois · Voir mes récompenses →
              </div>
            </div>
          </div>
        )
      })()}

      {/* ── KPI row ── */}
      <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', marginBottom: '24px', paddingBottom: '4px' }}>
        {[
          { label: `RDV aujourd'hui`, value: todayRdvs.length, suffix: '' },
          { label: `Commission aujourd'hui`, value: formatMontant(commissionAujourdhui), suffix: '' },
          { label: `Commission ce mois`, value: formatMontant(MOCK_STATS_MARCUS.commission_mois), suffix: '' },
        ].map(kpi => (
          <div key={kpi.label} style={{
            flex: '0 0 auto',
            minWidth: '130px',
            background: CARD,
            borderRadius: '14px',
            padding: '14px 16px',
            border: `1px solid rgba(14,12,9,0.08)`,
          }}>
            <div style={{ fontSize: '11px', color: `rgba(14,12,9,0.45)`, marginBottom: '6px', whiteSpace: 'nowrap' }}>
              {kpi.label}
            </div>
            <div style={{ fontSize: '20px', fontWeight: 700, color: OR }}>
              {kpi.value}
            </div>
          </div>
        ))}
      </div>

      {/* ── Section Aujourd'hui ── */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>
          {`Aujourd'hui`}
        </div>

        {todayRdvs.length === 0 ? (
          <div style={{
            background: CARD,
            borderRadius: '14px',
            padding: '24px',
            textAlign: 'center',
            color: `rgba(14,12,9,0.4)`,
            border: `1px solid rgba(14,12,9,0.08)`,
          }}>
            Aucun RDV aujourd&apos;hui
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {todayRdvs.map(rdv => (
              <div key={rdv.id} style={{
                background: CARD,
                borderRadius: '14px',
                overflow: 'hidden',
                border: `1px solid rgba(184,146,42,0.12)`,
                display: 'flex',
              }}>
                {/* Left accent bar */}
                <div style={{
                  width: '4px',
                  background: statutAccentColor(rdv.statut),
                  flexShrink: 0,
                }} />

                <div style={{ flex: 1, padding: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                    {/* Time */}
                    <div style={{ fontSize: '12px', color: `rgba(14,12,9,0.5)` }}>
                      {formatHeure(rdv.heure_debut)} — {formatHeure(rdv.heure_fin)}
                    </div>
                    {/* Statut badge */}
                    <div style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      color: statutColor(rdv.statut),
                      background: `${statutColor(rdv.statut)}18`,
                      padding: '3px 8px',
                      borderRadius: '999px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                    }}>
                      {rdv.statut === 'en_cours' ? `En cours` :
                       rdv.statut === 'confirme' ? `Confirmé` :
                       rdv.statut === 'termine' ? `Terminé` :
                       rdv.statut === 'annule' ? `Annulé` : rdv.statut}
                    </div>
                  </div>

                  {/* Service + prix */}
                  <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '4px' }}>
                    {rdv.service.nom}
                    <span style={{ fontWeight: 400, color: `rgba(14,12,9,0.5)`, fontSize: '13px', marginLeft: '8px' }}>
                      {rdv.service.prix} $
                    </span>
                  </div>

                  {/* Client + walk-in badge */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <span style={{ fontSize: '13px', color: `rgba(14,12,9,0.7)` }}>
                      {rdv.client.prenom}
                    </span>
                    {rdv.walk_in && (
                      <span style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        background: 'rgba(139,92,246,0.2)',
                        color: '#a78bfa',
                        padding: '2px 7px',
                        borderRadius: '999px',
                      }}>
                        Walk-in
                      </span>
                    )}
                  </div>

                  {/* Action button */}
                  {rdv.statut === 'confirme' && (
                    <button
                      onClick={() => navigate('/employe/scanner')}
                      style={{
                        background: OR,
                        color: NOIR,
                        border: 'none',
                        borderRadius: '8px',
                        padding: '8px 16px',
                        fontSize: '13px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        fontFamily: `'DM Sans', sans-serif`,
                      }}
                    >
                      Scanner
                    </button>
                  )}
                  {rdv.statut === 'en_cours' && (
                    <button
                      disabled
                      style={{
                        background: '#22c55e',
                        color: '#0E0C09',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '8px 16px',
                        fontSize: '13px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        fontFamily: `'DM Sans', sans-serif`,
                      }}
                    >
                      Terminer
                    </button>
                  )}
                  {rdv.statut === 'termine' && (
                    <button
                      disabled
                      style={{
                        background: 'rgba(34,197,94,0.15)',
                        color: '#22c55e',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '8px 16px',
                        fontSize: '13px',
                        fontWeight: 700,
                        cursor: 'default',
                        fontFamily: `'DM Sans', sans-serif`,
                      }}
                    >
                      ✓ Terminé
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Paramètres / Congés ── */}
      <div style={{ marginTop: '8px' }}>
        <div style={{ fontSize: '13px', color: `rgba(14,12,9,0.4)`, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
          Paramètres
        </div>
        <div
          onClick={() => navigate('/employe/conge')}
          style={{
            background: CARD,
            borderRadius: '12px',
            padding: '14px 16px',
            border: `1px solid rgba(184,146,42,0.12)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '18px' }}>🏖️</span>
            <span style={{ fontSize: '14px', fontWeight: 500 }}>Demandes de congé</span>
          </div>
          <span style={{ color: `rgba(14,12,9,0.3)`, fontSize: '16px' }}>›</span>
        </div>
      </div>

      {/* ── Floating Walk-in button ── */}
      <button
        onClick={() => navigate('/employe/walkin')}
        style={{
          position: 'fixed',
          bottom: '90px',
          right: '20px',
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          background: OR,
          color: NOIR,
          border: 'none',
          fontSize: '22px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 200,
          boxShadow: '0 4px 16px rgba(184,146,42,0.4)',
          fontFamily: `'DM Sans', sans-serif`,
        }}
        title="Nouveau walk-in"
      >
        ➕
      </button>
    </div>
  )
}
