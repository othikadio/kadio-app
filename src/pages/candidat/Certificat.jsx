import { useNavigate } from 'react-router-dom'
import { useFormationModules, useCandidature } from '@/hooks'
import { OR, CREME, NOIR, CARD, formatDate } from '@/lib/utils'

export default function CandidatCertificat() {
  const navigate = useNavigate()
  const { data: modules = [], loading: loadingModules } = useFormationModules()
  const { data: candidature, loading: loadingCandidature } = useCandidature('514-777-0001')
  const c = candidature
  const completed = modules.filter(m => m.statut === 'complete').length
  const allComplete = modules.length > 0 && modules.every(m => m.statut === 'complete')

  if (loadingModules || loadingCandidature) {
    return <div className="p-8 text-center text-zinc-400">Chargement...</div>
  }

  if (!allComplete) {
    return (
      <div style={{
        fontFamily: `'DM Sans', sans-serif`,
        background: CREME, minHeight: '100vh',
        color: NOIR, paddingBottom: '100px',
      }}>
        {/* Header */}
        <div style={{ padding: '24px 20px 0' }}>
          <h1 style={{ margin: 0, fontSize: '22px', fontWeight: '700', color: NOIR }}>
            {`Mon certificat`}
          </h1>
        </div>

        <div style={{ padding: '20px', maxWidth: '520px', margin: '0 auto' }}>
          {/* Locked card */}
          <div style={{
            background: CARD, border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px', padding: '36px 24px',
            textAlign: 'center', marginBottom: '20px',
          }}>
            <div style={{ fontSize: '52px', marginBottom: '16px' }}>🔒</div>
            <div style={{ fontSize: '20px', fontWeight: '700', color: NOIR, marginBottom: '8px' }}>
              {`Certificat non disponible`}
            </div>
            <div style={{
              display: 'inline-block',
              background: 'rgba(14,12,9,0.08)', border: `1px solid rgba(14,12,9,0.08)`,
              borderRadius: '20px', padding: '5px 14px',
              fontSize: '13px', color: OR, fontWeight: '600', marginBottom: '16px',
            }}>
              {`${completed}/${modules.length} modules complétés`}
            </div>
            <div style={{ fontSize: '14px', color: 'rgba(14,12,9,0.6)', lineHeight: '1.6', marginBottom: '24px' }}>
              {`Complétez les ${modules.length} modules de formation pour obtenir votre certificat.`}
            </div>
            <button
              onClick={() => navigate('/candidat/formation')}
              style={{
                background: OR, color: NOIR, border: 'none', borderRadius: '10px',
                padding: '13px 24px', width: '100%',
                fontSize: '15px', fontWeight: '700', cursor: 'pointer',
                fontFamily: `'DM Sans', sans-serif`,
              }}
            >
              {`Aller à la formation`}
            </button>
          </div>

          {/* Module progress list */}
          <div style={{ background: CARD, borderRadius: '14px', padding: '20px' }}>
            <div style={{ fontSize: '13px', fontWeight: '600', color: OR, marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {`Progression des modules`}
            </div>
            {modules.map(m => {
              const isComplete = m.statut === 'complete'
              const isLocked = m.statut === 'verrouille'
              const isActif = m.statut === 'en_cours' || m.statut === 'disponible'
              return (
                <div key={m.id} style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '10px 0',
                  borderBottom: m.id < modules.length ? '1px solid rgba(255,255,255,0.06)' : 'none',
                }}>
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                    background: isComplete ? '#10B981' : isActif ? 'rgba(14,12,9,0.08)' : 'rgba(255,255,255,0.1)',
                    border: isActif ? `1px solid ${OR}` : 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '13px',
                  }}>
                    {isComplete ? '✓' : isLocked ? '🔒' : '…'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', color: isLocked ? 'rgba(14,12,9,0.35)' : CREME }}>
                      {`Module ${m.id} — ${m.titre}`}
                    </div>
                    {isComplete && m.score && (
                      <div style={{ fontSize: '12px', color: '#10B981' }}>{`Score : ${m.score}%`}</div>
                    )}
                    {isActif && (
                      <div style={{ fontSize: '12px', color: OR }}>{`En cours`}</div>
                    )}
                    {isLocked && (
                      <div style={{ fontSize: '12px', color: 'rgba(14,12,9,0.3)' }}>{`Verrouillé`}</div>
                    )}
                  </div>
                  {isComplete && (
                    <div style={{ fontSize: '11px', color: '#10B981', fontWeight: '700' }}>✓</div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  // ── All modules complete: show certificate ──
  return (
    <div style={{
      fontFamily: `'DM Sans', sans-serif`,
      background: CREME, minHeight: '100vh',
      color: NOIR, paddingBottom: '100px',
    }}>
      <div style={{ padding: '24px 20px 0' }}>
        <h1 style={{ margin: 0, fontSize: '22px', fontWeight: '700', color: NOIR }}>
          {`Mon certificat`}
        </h1>
      </div>

      <div style={{ padding: '20px', maxWidth: '520px', margin: '0 auto' }}>

        {/* Certificate card */}
        <div style={{
          background: CARD,
          border: `2px solid ${OR}`,
          borderRadius: '16px',
          padding: '4px',
          marginBottom: '24px',
        }}>
          <div style={{
            border: '1px solid rgba(14,12,9,0.08)',
            borderRadius: '13px',
            padding: '32px 28px',
            textAlign: 'center',
          }}>
            {/* Header */}
            <div style={{
              fontSize: '22px', fontWeight: '900', color: OR,
              letterSpacing: '0.08em', marginBottom: '4px',
              fontFamily: `'DM Sans', sans-serif`,
            }}>
              {`KADIO COIFFURE & ESTHÉTIQUE`}
            </div>
            <div style={{
              fontSize: '11px', color: 'rgba(184,146,42,0.7)',
              letterSpacing: '0.15em', fontVariant: 'small-caps',
              textTransform: 'uppercase', marginBottom: '20px',
            }}>
              {`CERTIFICAT DE PARTENAIRE CERTIFIÉ(E)`}
            </div>

            {/* Divider */}
            <div style={{
              height: '1px', background: `linear-gradient(90deg, transparent, ${OR}, transparent)`,
              marginBottom: '20px',
            }} />

            <div style={{ fontSize: '12px', color: 'rgba(14,12,9,0.45)', marginBottom: '8px', letterSpacing: '0.05em' }}>
              {`Décerné à`}
            </div>
            <div style={{
              fontSize: '28px', fontWeight: '800', color: NOIR,
              marginBottom: '8px', fontFamily: `'DM Sans', sans-serif`,
            }}>
              {`${c?.prenom} ${c?.nom}`}
            </div>
            <div style={{ fontSize: '14px', color: OR, marginBottom: '6px' }}>
              {c?.specialites?.join(' · ')}
            </div>
            <div style={{ fontSize: '13px', color: 'rgba(14,12,9,0.45)', marginBottom: '20px' }}>
              {`Certifié(e) le ${formatDate(c?.date_acceptation)}`}
            </div>

            <div style={{ fontSize: '32px', marginBottom: '20px' }}>🏆</div>

            {/* Divider */}
            <div style={{
              height: '1px', background: `linear-gradient(90deg, transparent, ${OR}, transparent)`,
              marginBottom: '20px',
            }} />

            {/* QR verification */}
            <div style={{
              border: '1px solid rgba(14,12,9,0.08)', borderRadius: '8px',
              padding: '10px 16px', display: 'inline-block',
            }}>
              <div style={{ fontSize: '11px', color: 'rgba(14,12,9,0.4)', marginBottom: '4px' }}>
                {`Vérification`}
              </div>
              <div style={{
                fontFamily: 'monospace', fontSize: '13px', color: OR,
                letterSpacing: '0.05em',
              }}>
                {`KADIO-CERT-MARIAM-001`}
              </div>
            </div>

            <div style={{ marginTop: '16px', fontSize: '12px', color: 'rgba(14,12,9,0.35)' }}>
              {`Vérifié par Othi Kadio · kadio.ca`}
            </div>
          </div>
        </div>

        {/* Congratulations */}
        <div style={{
          background: 'rgba(184,146,42,0.08)', border: `1px solid rgba(14,12,9,0.08)`,
          borderRadius: '14px', padding: '24px', textAlign: 'center', marginBottom: '16px',
        }}>
          <div style={{ fontSize: '36px', marginBottom: '10px' }}>🎉</div>
          <div style={{ fontSize: '20px', fontWeight: '700', color: NOIR, marginBottom: '6px' }}>
            {`Félicitations !`}
          </div>
          <div style={{ fontSize: '14px', color: 'rgba(14,12,9,0.65)', marginBottom: '20px' }}>
            {`Vous êtes maintenant Partenaire Kadio certifié(e)`}
          </div>
          <button
            onClick={() => navigate('/partenaire/accueil')}
            style={{
              background: OR, color: NOIR, border: 'none', borderRadius: '10px',
              padding: '13px 24px', width: '100%',
              fontSize: '15px', fontWeight: '700', cursor: 'pointer',
              fontFamily: `'DM Sans', sans-serif`,
            }}
          >
            {`Accéder à mon espace partenaire →`}
          </button>
        </div>

      </div>
    </div>
  )
}
