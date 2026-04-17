import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFormationModules } from '@/hooks'
import { OR, CREME, NOIR, CARD, formatDate } from '@/lib/utils'

function ModuleCard({ module, navigate, expanded, onToggle }) {
  const isVerrouille = module.statut === 'verrouille'
  const isComplete = module.statut === 'complete'
  const isActif = module.statut === 'en_cours' || module.statut === 'disponible'

  return (
    <div style={{
      background: CARD,
      border: isComplete
        ? '1px solid rgba(16,185,129,0.4)'
        : isActif
          ? `1px solid ${OR}`
          : '1px solid rgba(255,255,255,0.07)',
      borderRadius: '14px',
      padding: '20px',
      opacity: isVerrouille ? 0.5 : 1,
      marginBottom: '12px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Badge top-right */}
      {isComplete && (
        <div style={{
          position: 'absolute', top: '14px', right: '14px',
          background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.4)',
          borderRadius: '20px', padding: '3px 10px',
          fontSize: '11px', fontWeight: '700', color: '#10B981',
        }}>
          {`✓ Complété`}
        </div>
      )}
      {isVerrouille && (
        <div style={{
          position: 'absolute', top: '14px', right: '14px',
          fontSize: '18px',
        }}>
          🔒
        </div>
      )}
      {isActif && (
        <div style={{
          position: 'absolute', top: '14px', right: '14px',
          background: 'rgba(14,12,9,0.08)', border: `1px solid rgba(184,146,42,0.4)`,
          borderRadius: '20px', padding: '3px 10px',
          fontSize: '11px', fontWeight: '700', color: OR,
        }}>
          {`En cours`}
        </div>
      )}

      {/* Icon + title — clickable to expand */}
      <div
        onClick={() => !isVerrouille && onToggle && onToggle(module.id)}
        style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', paddingRight: '90px', cursor: isVerrouille ? 'default' : 'pointer' }}
      >
        <div style={{
          fontSize: '24px',
          width: '44px', height: '44px', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(255,255,255,0.05)', borderRadius: '10px',
        }}>
          {module.icon}
        </div>
        <div>
          <div style={{ fontSize: '16px', fontWeight: '700', color: NOIR }}>
            {`Module ${module.id} — ${module.titre}`}
          </div>
          <div style={{ fontSize: '12px', color: 'rgba(14,12,9,0.45)', marginTop: '1px' }}>
            {`${module.duree_minutes} min`}
            {module.video && ` · Vidéo ${module.video.duree}`}
          </div>
        </div>
      </div>

      {/* Description */}
      <div style={{ fontSize: '13px', color: 'rgba(14,12,9,0.6)', lineHeight: '1.5', marginBottom: '14px' }}>
        {module.description}
      </div>

      {/* ── Contenu expandable : vidéo + points clés ── */}
      {expanded && !isVerrouille && (
        <div style={{ marginBottom: '14px' }}>
          {/* Vidéo formative */}
          {module.video && (
            <div style={{
              background: 'rgba(14,12,9,0.04)', border: '1px solid rgba(14,12,9,0.08)',
              borderRadius: '12px', padding: '14px', marginBottom: '12px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <span style={{ fontSize: '20px' }}>🎬</span>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: NOIR }}>{module.video.titre}</div>
                  <div style={{ fontSize: '11px', color: 'rgba(14,12,9,0.45)' }}>{module.video.duree}</div>
                </div>
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(14,12,9,0.55)', lineHeight: 1.5, marginBottom: '10px' }}>
                {module.video.description}
              </div>
              {module.video.url ? (
                <a href={module.video.url} target="_blank" rel="noopener noreferrer"
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    background: OR, color: NOIR, border: 'none', borderRadius: '10px',
                    padding: '10px 16px', textDecoration: 'none', fontWeight: 700, fontSize: '13px',
                    fontFamily: `'DM Sans', sans-serif`,
                  }}>
                  ▶ Regarder la vidéo
                </a>
              ) : (
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  background: 'rgba(184,146,42,0.1)', border: `1px dashed ${OR}`,
                  borderRadius: '10px', padding: '24px 16px', color: OR, fontSize: '13px', fontWeight: 600,
                }}>
                  🎥 Vidéo bientôt disponible
                </div>
              )}
            </div>
          )}

          {/* Points clés du module */}
          {module.contenu && module.contenu.length > 0 && (
            <div style={{
              background: 'rgba(184,146,42,0.05)', border: '1px solid rgba(184,146,42,0.15)',
              borderRadius: '12px', padding: '14px',
            }}>
              <div style={{ fontSize: '12px', fontWeight: '700', color: OR, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Points clés à retenir
              </div>
              {module.contenu.map((point, i) => (
                <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: i < module.contenu.length - 1 ? '8px' : 0 }}>
                  <span style={{ color: OR, fontSize: '12px', fontWeight: 700, flexShrink: 0 }}>{i + 1}.</span>
                  <span style={{ color: 'rgba(14,12,9,0.65)', fontSize: '12px', lineHeight: 1.5 }}>{point}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Expand/collapse button for active modules */}
      {!isVerrouille && !expanded && (module.video || module.contenu) && (
        <button onClick={() => onToggle && onToggle(module.id)}
          style={{
            background: 'transparent', border: '1px solid rgba(14,12,9,0.1)',
            borderRadius: '8px', padding: '6px 12px', fontSize: '12px',
            color: 'rgba(14,12,9,0.5)', cursor: 'pointer', marginBottom: '10px',
            fontFamily: `'DM Sans', sans-serif`, fontWeight: 600,
          }}>
          📖 Voir le contenu du module
        </button>
      )}

      {/* Complete info */}
      {isComplete && (
        <div style={{ display: 'flex', gap: '16px', marginBottom: '14px' }}>
          <div style={{ fontSize: '13px', color: '#10B981', fontWeight: '600' }}>
            {`Score : ${module.score}%`}
          </div>
          {module.date_complete && (
            <div style={{ fontSize: '13px', color: 'rgba(14,12,9,0.45)' }}>
              {formatDate(module.date_complete)}
            </div>
          )}
        </div>
      )}

      {/* Locked message */}
      {isVerrouille && (
        <div style={{ fontSize: '12px', color: 'rgba(14,12,9,0.4)', marginBottom: '10px' }}>
          {`Complétez le module précédent pour déverrouiller`}
        </div>
      )}

      {/* Buttons */}
      {isActif && (
        <button
          onClick={() => navigate(`/candidat/quiz/${module.id}`)}
          style={{
            background: OR, color: NOIR,
            border: 'none', borderRadius: '10px',
            padding: '11px 20px', width: '100%',
            fontSize: '14px', fontWeight: '700', cursor: 'pointer',
            fontFamily: `'DM Sans', sans-serif`,
          }}
        >
          {`Passer l'examen →`}
        </button>
      )}
      {isComplete && (
        <button
          onClick={() => navigate(`/candidat/quiz/${module.id}`)}
          style={{
            background: 'transparent',
            border: '1px solid rgba(14,12,9,0.2)',
            color: 'rgba(14,12,9,0.6)',
            borderRadius: '10px', padding: '10px 20px', width: '100%',
            fontSize: '14px', fontWeight: '600', cursor: 'pointer',
            fontFamily: `'DM Sans', sans-serif`,
          }}
        >
          {`Revoir l'examen`}
        </button>
      )}
    </div>
  )
}

export default function CandidatFormation() {
  const navigate = useNavigate()
  const { data: modules = [], loading } = useFormationModules()
  const [expandedId, setExpandedId] = useState(null)
  const completed = modules.filter(m => m.statut === 'complete').length
  const total = modules.length
  const pct = total > 0 ? (completed / total) * 100 : 0

  if (loading) {
    return <div className="p-8 text-center text-zinc-400">Chargement...</div>
  }

  return (
    <div style={{
      fontFamily: `'DM Sans', sans-serif`,
      background: CREME, minHeight: '100vh',
      color: NOIR, paddingBottom: '100px',
    }}>
      {/* Header */}
      <div style={{ padding: '24px 20px 0' }}>
        <h1 style={{ margin: 0, fontSize: '22px', fontWeight: '700', color: NOIR }}>
          {`Formation Kadio`}
        </h1>
      </div>

      <div style={{ padding: '20px', maxWidth: '520px', margin: '0 auto' }}>

        {/* Barre de progression globale */}
        <div style={{
          background: CARD, borderRadius: '14px', padding: '20px', marginBottom: '20px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div style={{ fontSize: '14px', fontWeight: '600', color: NOIR }}>
              {`Progression`}
            </div>
            <div style={{ fontSize: '14px', fontWeight: '700', color: OR }}>
              {`${completed} / ${total} modules complétés`}
            </div>
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.08)', borderRadius: '99px',
            height: '10px', overflow: 'hidden',
          }}>
            <div style={{
              height: '100%', borderRadius: '99px',
              background: OR,
              width: `${pct}%`,
              transition: 'width 0.6s ease',
            }} />
          </div>
          <div style={{ fontSize: '12px', color: 'rgba(14,12,9,0.45)', marginTop: '8px' }}>
            {pct < 100
              ? `${100 - pct}% restant pour obtenir votre certificat`
              : `Tous les modules sont complétés !`}
          </div>
        </div>

        {/* Module cards */}
        {modules.map(module => (
          <ModuleCard
            key={module.id}
            module={module}
            navigate={navigate}
            expanded={expandedId === module.id}
            onToggle={(id) => setExpandedId(prev => prev === id ? null : id)}
          />
        ))}

        {/* Footer note */}
        <div style={{
          background: 'rgba(184,146,42,0.07)', border: '1px solid rgba(14,12,9,0.08)',
          borderRadius: '12px', padding: '14px 16px', marginTop: '8px',
        }}>
          <div style={{ fontSize: '13px', color: 'rgba(14,12,9,0.7)', marginBottom: '4px' }}>
            {`📋 Score minimum requis : 80% pour valider chaque module`}
          </div>
          <div style={{ fontSize: '12px', color: 'rgba(14,12,9,0.45)' }}>
            {`En cas d'échec, réessai disponible après 7 jours`}
          </div>
        </div>

      </div>
    </div>
  )
}
