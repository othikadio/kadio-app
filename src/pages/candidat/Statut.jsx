import { useNavigate } from 'react-router-dom'
import { useCandidature } from '@/hooks'
import { OR, CREME, NOIR, CARD, formatDate } from '@/lib/utils'

const STATUT_CONFIG = {
  en_attente: {
    icon: '⏳',
    label: `Candidature reçue`,
    message: `Votre dossier est en attente d'examen. Délai habituel : 48h.`,
    color: '#9CA3AF',
    bg: 'rgba(156,163,175,0.1)',
    border: 'rgba(156,163,175,0.3)',
  },
  en_revision: {
    icon: '🔍',
    label: `Candidature en révision`,
    message: `Notre équipe examine votre profil. On vous contacte bientôt.`,
    color: '#F59E0B',
    bg: 'rgba(245,158,11,0.1)',
    border: 'rgba(245,158,11,0.3)',
  },
  accepte: {
    icon: '✅',
    label: null,
    message: null,
    color: '#10B981',
    bg: 'rgba(16,185,129,0.1)',
    border: 'rgba(16,185,129,0.3)',
  },
  refuse: {
    icon: '❌',
    label: `Candidature non retenue`,
    message: `Nous n'avons pas pu retenir votre candidature pour le moment.`,
    color: '#EF4444',
    bg: 'rgba(239,68,68,0.1)',
    border: 'rgba(239,68,68,0.3)',
  },
}

function TimelineStep({ done, refused, label, date, isLast }) {
  const circleColor = done ? '#10B981' : refused ? '#EF4444' : 'rgba(255,255,255,0.15)'
  const textColor = done || refused ? CREME : 'rgba(14,12,9,0.4)'

  return (
    <div style={{ display: 'flex', gap: '16px', position: 'relative' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{
          width: '28px', height: '28px', borderRadius: '50%',
          background: circleColor,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '13px', flexShrink: 0, zIndex: 1,
          border: done || refused ? 'none' : '2px solid rgba(255,255,255,0.2)',
        }}>
          {done ? '✓' : refused ? '✗' : ''}
        </div>
        {!isLast && (
          <div style={{
            width: '2px', flex: 1, minHeight: '32px',
            background: done ? '#10B981' : 'rgba(255,255,255,0.1)',
            margin: '4px 0',
          }} />
        )}
      </div>
      <div style={{ paddingBottom: isLast ? 0 : '16px', paddingTop: '2px' }}>
        <div style={{ color: textColor, fontSize: '14px', fontWeight: '500' }}>{label}</div>
        {date && (
          <div style={{ color: 'rgba(14,12,9,0.5)', fontSize: '12px', marginTop: '2px' }}>
            {formatDate(date)}
          </div>
        )}
      </div>
    </div>
  )
}

export default function CandidatStatut() {
  const navigate = useNavigate()
  const { data: candidature, loading } = useCandidature('514-777-0001')
  const c = candidature

  if (loading) {
    return <div className="p-8 text-center text-zinc-400">Chargement...</div>
  }

  if (!c) {
    return (
      <div style={{
        fontFamily: `'DM Sans', sans-serif`,
        background: CREME, minHeight: '100vh',
        color: NOIR, paddingBottom: '100px',
      }}>
        <div style={{ padding: '24px 20px' }}>
          <h1 style={{ margin: 0, fontSize: '22px', fontWeight: '700', color: NOIR }}>
            Candidature introuvable
          </h1>
        </div>
      </div>
    )
  }

  const cfg = STATUT_CONFIG[c?.statut]

  const stepRevision = ['en_revision', 'accepte', 'refuse'].includes(c?.statut)
  const stepDecision = ['accepte', 'refuse'].includes(c?.statut)
  const stepFormation = false // only when all modules complete

  return (
    <div style={{
      fontFamily: `'DM Sans', sans-serif`,
      background: CREME, minHeight: '100vh',
      color: NOIR, paddingBottom: '100px',
    }}>
      {/* Header */}
      <div style={{ padding: '24px 20px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          <h1 style={{ margin: 0, fontSize: '22px', fontWeight: '700', color: NOIR }}>
            Ma candidature
          </h1>
          <div style={{
            background: 'rgba(184,146,42,0.12)', border: '1px solid rgba(14,12,9,0.08)',
            borderRadius: '20px', padding: '4px 12px', fontSize: '12px', color: OR,
          }}>
            Soumise le {formatDate(c.date_soumission)}
          </div>
        </div>
      </div>

      <div style={{ padding: '0 20px', maxWidth: '520px', margin: '0 auto' }}>

        {/* Grande carte statut */}
        <div style={{
          background: cfg.bg, border: `1px solid ${cfg.border}`,
          borderRadius: '16px', padding: '28px 24px', marginBottom: '24px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '48px', marginBottom: '12px', lineHeight: 1 }}>{cfg.icon}</div>

          {c?.statut === 'accepte' ? (
            <>
              <div style={{ fontSize: '20px', fontWeight: '700', color: '#10B981', marginBottom: '8px' }}>
                {`Félicitations, ${c?.prenom} !`}
              </div>
              <div style={{ fontSize: '14px', color: 'rgba(14,12,9,0.75)', marginBottom: '20px', lineHeight: '1.5' }}>
                {`Votre candidature a été acceptée. Complétez la formation pour obtenir votre certificat.`}
              </div>
              {/* Message admin */}
              <div style={{
                background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)',
                borderLeft: '3px solid #10B981',
                borderRadius: '8px', padding: '14px 16px', marginBottom: '20px',
                textAlign: 'left',
              }}>
                <div style={{ fontSize: '11px', color: '#10B981', fontWeight: '600', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Message de l'équipe Kadio
                </div>
                <div style={{ fontSize: '13px', color: 'rgba(14,12,9,0.85)', lineHeight: '1.6', fontStyle: 'italic' }}>
                  {`"${c?.message_admin}"`}
                </div>
              </div>
              <button
                onClick={() => navigate('/candidat/formation')}
                style={{
                  background: OR, color: NOIR, border: 'none',
                  borderRadius: '10px', padding: '13px 24px',
                  fontSize: '15px', fontWeight: '700', cursor: 'pointer',
                  fontFamily: `'DM Sans', sans-serif`, width: '100%',
                }}
              >
                {`Commencer la formation →`}
              </button>
            </>
          ) : c?.statut === 'refuse' ? (
            <>
              <div style={{ fontSize: '20px', fontWeight: '700', color: '#EF4444', marginBottom: '8px' }}>
                {cfg?.label}
              </div>
              <div style={{ fontSize: '14px', color: 'rgba(14,12,9,0.75)', marginBottom: '20px', lineHeight: '1.5' }}>
                {cfg?.message}
              </div>
              <button
                onClick={() => navigate('/candidature')}
                style={{
                  background: 'transparent', color: '#EF4444',
                  border: '1px solid #EF4444',
                  borderRadius: '10px', padding: '13px 24px',
                  fontSize: '15px', fontWeight: '600', cursor: 'pointer',
                  fontFamily: `'DM Sans', sans-serif`, width: '100%',
                }}
              >
                {`Soumettre une nouvelle candidature`}
              </button>
            </>
          ) : (
            <>
              <div style={{ fontSize: '20px', fontWeight: '700', color: cfg?.color, marginBottom: '8px' }}>
                {cfg?.label}
              </div>
              <div style={{ fontSize: '14px', color: 'rgba(14,12,9,0.75)', lineHeight: '1.5' }}>
                {cfg?.message}
              </div>
            </>
          )}
        </div>

        {/* Timeline */}
        <div style={{
          background: CARD, borderRadius: '16px', padding: '24px 20px', marginBottom: '24px',
        }}>
          <div style={{ fontSize: '13px', fontWeight: '600', color: OR, marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {`Suivi de candidature`}
          </div>
          <TimelineStep
            done={true}
            label={`Candidature soumise`}
            date={c?.date_soumission}
          />
          <TimelineStep
            done={stepRevision}
            label={`En révision`}
            date={c?.date_revision && stepRevision ? c?.date_revision : null}
          />
          <TimelineStep
            done={c?.statut === 'accepte'}
            refused={c?.statut === 'refuse'}
            label={`Décision`}
            date={c?.statut === 'accepte' ? c?.date_acceptation : null}
          />
          <TimelineStep
            done={stepFormation}
            label={`Formation & Certification`}
            isLast={true}
          />
        </div>

        {/* Contact */}
        <div style={{
          background: CARD, borderRadius: '16px', padding: '20px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '15px', fontWeight: '600', color: NOIR, marginBottom: '4px' }}>
            {`Des questions ?`}
          </div>
          <div style={{ fontSize: '13px', color: 'rgba(14,12,9,0.5)', marginBottom: '16px' }}>
            {`Notre équipe est là pour vous aider`}
          </div>
          <a
            href="https://wa.me/15149195970"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              border: '1px solid #25D366', color: '#25D366',
              borderRadius: '10px', padding: '11px 20px',
              fontSize: '14px', fontWeight: '600',
              textDecoration: 'none',
              fontFamily: `'DM Sans', sans-serif`,
            }}
          >
            {`📱 Contacter Othi sur WhatsApp`}
          </a>
        </div>

      </div>
    </div>
  )
}
