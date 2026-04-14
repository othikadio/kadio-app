import { useNavigate } from 'react-router-dom'
import { OR, CREME, NOIR, CARD } from '@/lib/utils'

const ETAPES_CLIENTS = [
  {
    num: '01',
    titre: `Crée ton compte`,
    desc: `Inscription rapide avec ton numéro de téléphone. Tu reçois un code OTP par SMS pour valider. Pas besoin d'email.`,
    icone: '📱',
  },
  {
    num: '02',
    titre: `Trouve ta coiffeuse sur la carte`,
    desc: `Explore la carte interactive. Filtre par spécialité, ville, note et disponibilité. Lis les avis des autres clients.`,
    icone: '🗺️',
  },
  {
    num: '03',
    titre: `Réserve un créneau + paie`,
    desc: `Choisis ton jour et ton heure. Un acompte est prélevé à la réservation pour garantir ton rendez-vous.`,
    icone: '📅',
  },
  {
    num: '04',
    titre: `Reçois tes rappels SMS`,
    desc: `Tu reçois automatiquement un rappel 24h avant et un autre 2h avant ton rendez-vous. Plus jamais de no-show.`,
    icone: '💬',
  },
  {
    num: '05',
    titre: `Laisse un avis`,
    desc: `Après ton service, tu peux noter ta coiffeuse et laisser un commentaire. Ça aide toute la communauté.`,
    icone: '⭐',
  },
]

const ETAPES_PARTENAIRES = [
  {
    num: '01',
    titre: `Soumets ta candidature`,
    desc: `Remplis le formulaire en 3 étapes : identité, spécialités, motivation. Prend moins de 5 minutes.`,
    icone: '📝',
  },
  {
    num: '02',
    titre: `Validation de profil par Kadio`,
    desc: `Notre équipe vérifie ton profil sous 48h. On peut te demander des photos de tes réalisations.`,
    icone: '🔍',
  },
  {
    num: '03',
    titre: `Certification officielle`,
    desc: `Tu reçois ton badge Partenaire Certifié Kadio. Ton profil apparaît sur la carte publique.`,
    icone: '✅',
  },
  {
    num: '04',
    titre: `Active ton profil + agenda`,
    desc: `Configure tes disponibilités, tes services et tes tarifs. Tu contrôles tout depuis ton tableau de bord.`,
    icone: '⚙️',
  },
  {
    num: '05',
    titre: `Reçois tes virements chaque semaine`,
    desc: `Ta commission est virée chaque semaine sur ton compte. Pas de délai, pas de surprise.`,
    icone: '💸',
  },
]

const MODES_TRAVAIL = [
  {
    titre: `En salon chez Kadio`,
    desc: `Tu loues une chaise dans notre salon partenaire. Tu gardes 50% du prix client, sans frais fixes.`,
    detail: `50% du prix client · Chaise louée`,
    icone: '🏠',
  },
  {
    titre: `À domicile client`,
    desc: `Tu te déplaces chez le client. Le client prend en charge les frais de transport selon le barème Kadio.`,
    detail: `65% du prix client · Transport payé`,
    icone: '🚗',
  },
  {
    titre: `Déplacement voiture`,
    desc: `Tu utilises ton véhicule. Un barème kilométrique s'applique selon la distance parcourue.`,
    detail: `Barème km · Remboursement garanti`,
    icone: '🛣️',
  },
  {
    titre: `Transport en commun`,
    desc: `Tu te déplaces en STM ou RTL. Le titre de transport est inclus dans le tarif de déplacement.`,
    detail: `Transport inclus · Zones couvertes`,
    icone: '🚌',
  },
]

export default function CommentCaMarche() {
  const navigate = useNavigate()

  const sectionTitle = (label, titre, sous) => (
    <div style={{ textAlign: 'center', marginBottom: 52 }}>
      <div style={{
        display: 'inline-block', background: 'rgba(14,12,9,0.08)', color: OR,
        borderRadius: 20, padding: '4px 14px', fontSize: 12, fontWeight: 600,
        letterSpacing: 2, marginBottom: 14,
      }}>
        {label}
      </div>
      <h2 style={{
        fontFamily: `'Bebas Neue', sans-serif`,
        fontSize: 'clamp(28px, 5vw, 44px)',
        color: NOIR, margin: 0, letterSpacing: 1,
      }}>
        {titre}
      </h2>
      {sous && (
        <p style={{ color: 'rgba(14,12,9,0.6)', marginTop: 10, fontSize: 15, maxWidth: 520, margin: '10px auto 0' }}>
          {sous}
        </p>
      )}
    </div>
  )

  return (
    <div style={{ background: CREME, color: NOIR, minHeight: '100vh', fontFamily: `'Inter', sans-serif` }}>

      {/* ── HERO ─── */}
      <section style={{
        padding: '100px 24px 80px',
        textAlign: 'center',
        background: `radial-gradient(ellipse at 50% 0%, rgba(184,146,42,0.09) 0%, transparent 60%)`,
        borderBottom: `1px solid rgba(184,146,42,0.12)`,
      }}>
        <div style={{
          display: 'inline-block', background: 'rgba(14,12,9,0.08)', color: OR,
          borderRadius: 20, padding: '4px 14px', fontSize: 12, fontWeight: 600,
          letterSpacing: 2, marginBottom: 20,
        }}>
          GUIDE
        </div>
        <h1 style={{
          fontFamily: `'Bebas Neue', sans-serif`,
          fontSize: 'clamp(48px, 9vw, 96px)',
          color: NOIR, margin: '0 0 16px', lineHeight: 0.95, letterSpacing: 1,
        }}>
          Comment ça marche
        </h1>
        <p style={{ color: 'rgba(14,12,9,0.65)', fontSize: 16, maxWidth: 500, margin: '0 auto', lineHeight: 1.6 }}>
          {`Que tu sois client ou coiffeur, on t'explique tout en 5 étapes simples.`}
        </p>
      </section>

      {/* ── ÉTAPES CLIENTS ─── */}
      <section style={{ maxWidth: 900, margin: '0 auto', padding: '80px 24px' }}>
        {sectionTitle('CLIENTS', 'Pour les clients', `De la recherche au rendez-vous en quelques secondes`)}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {ETAPES_CLIENTS.map((e, idx) => (
            <div key={e.num} style={{ display: 'flex', gap: 24, alignItems: 'flex-start', position: 'relative' }}>
              {/* Timeline line */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                <div style={{
                  width: 52, height: 52, borderRadius: '50%',
                  background: `linear-gradient(135deg, ${OR}, #a88520)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: `'Bebas Neue', sans-serif`, fontSize: 20, color: NOIR,
                  zIndex: 1, flexShrink: 0,
                }}>
                  {e.num}
                </div>
                {idx < ETAPES_CLIENTS.length - 1 && (
                  <div style={{ width: 2, flex: 1, minHeight: 32, background: 'rgba(14,12,9,0.08)', margin: '4px 0' }} />
                )}
              </div>
              <div style={{
                background: CARD, borderRadius: 14, padding: '24px 24px',
                border: `1px solid rgba(184,146,42,0.12)`,
                marginBottom: idx < ETAPES_CLIENTS.length - 1 ? 8 : 0,
                flex: 1,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <span style={{ fontSize: 22 }}>{e.icone}</span>
                  <h3 style={{ color: NOIR, fontWeight: 700, fontSize: 17, margin: 0 }}>{e.titre}</h3>
                </div>
                <p style={{ color: 'rgba(14,12,9,0.65)', fontSize: 14, lineHeight: 1.6, margin: 0 }}>{e.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── ÉTAPES PARTENAIRES ─── */}
      <section style={{ background: CARD, padding: '80px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          {sectionTitle('PARTENAIRES', 'Pour les coiffeurs', `Du formulaire à ton premier virement en moins de 72h`)}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {ETAPES_PARTENAIRES.map((e, idx) => (
              <div key={e.num} style={{ display: 'flex', gap: 24, alignItems: 'flex-start', position: 'relative' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: '50%',
                    background: CREME, border: `2px solid ${OR}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: `'Bebas Neue', sans-serif`, fontSize: 20, color: OR,
                    zIndex: 1, flexShrink: 0,
                  }}>
                    {e.num}
                  </div>
                  {idx < ETAPES_PARTENAIRES.length - 1 && (
                    <div style={{ width: 2, flex: 1, minHeight: 32, background: 'rgba(14,12,9,0.08)', margin: '4px 0' }} />
                  )}
                </div>
                <div style={{
                  background: CREME, borderRadius: 14, padding: '24px 24px',
                  border: `1px solid rgba(184,146,42,0.12)`,
                  marginBottom: idx < ETAPES_PARTENAIRES.length - 1 ? 8 : 0,
                  flex: 1,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <span style={{ fontSize: 22 }}>{e.icone}</span>
                    <h3 style={{ color: NOIR, fontWeight: 700, fontSize: 17, margin: 0 }}>{e.titre}</h3>
                  </div>
                  <p style={{ color: 'rgba(14,12,9,0.65)', fontSize: 14, lineHeight: 1.6, margin: 0 }}>{e.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4 MODES DE TRAVAIL ─── */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          {sectionTitle('FLEXIBILITÉ', '4 modes de travail', `Tu choisis comment et où tu travailles`)}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
            {MODES_TRAVAIL.map(m => (
              <div key={m.titre} style={{
                background: CARD, borderRadius: 16, padding: '28px 22px',
                border: `1px solid rgba(184,146,42,0.12)`,
                display: 'flex', flexDirection: 'column', gap: 12,
              }}>
                <span style={{ fontSize: 32 }}>{m.icone}</span>
                <h3 style={{ color: NOIR, fontWeight: 700, fontSize: 16, margin: 0 }}>{m.titre}</h3>
                <p style={{ color: 'rgba(14,12,9,0.65)', fontSize: 13, lineHeight: 1.6, margin: 0, flex: 1 }}>{m.desc}</p>
                <div style={{
                  background: 'rgba(14,12,9,0.08)', borderRadius: 8, padding: '6px 12px',
                  color: OR, fontSize: 12, fontWeight: 600,
                }}>
                  {m.detail}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRANSPARENCE COMMISSIONS ─── */}
      <section style={{ background: CARD, padding: '80px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          {sectionTitle('TRANSPARENCE', 'Nos commissions', `Pas de surprise — voici exactement comment ça fonctionne`)}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            <div style={{
              background: CREME, borderRadius: 16, padding: '32px 28px',
              border: `2px solid ${OR}`,
            }}>
              <div style={{ color: OR, fontSize: 12, fontWeight: 600, letterSpacing: 2, marginBottom: 12 }}>CLIENT KADIO</div>
              <div style={{
                fontFamily: `'Bebas Neue', sans-serif`,
                fontSize: 64, color: OR, lineHeight: 1, marginBottom: 12,
              }}>
                65%
              </div>
              <div style={{ color: NOIR, fontWeight: 600, fontSize: 15, marginBottom: 8 }}>au partenaire</div>
              <p style={{ color: 'rgba(14,12,9,0.6)', fontSize: 13, lineHeight: 1.6, margin: 0 }}>
                {`Quand un client Kadio réserve ton service, tu gardes 65% du prix affiché. Le reste couvre la plateforme, les rappels SMS, le système de paiement et notre support.`}
              </p>
              <div style={{ marginTop: 16, padding: '10px 14px', background: 'rgba(184,146,42,0.08)', borderRadius: 8 }}>
                <div style={{ color: NOIR, fontSize: 13 }}>Exemple : service à 100$</div>
                <div style={{ color: OR, fontWeight: 700, fontSize: 15 }}>→ Tu reçois 65$</div>
              </div>
            </div>
            <div style={{
              background: CREME, borderRadius: 16, padding: '32px 28px',
              border: `1px solid rgba(14,12,9,0.08)`,
            }}>
              <div style={{ color: OR, fontSize: 12, fontWeight: 600, letterSpacing: 2, marginBottom: 12 }}>TON PROPRE CLIENT</div>
              <div style={{
                fontFamily: `'Bebas Neue', sans-serif`,
                fontSize: 64, color: OR, lineHeight: 1, marginBottom: 12,
              }}>
                72%
              </div>
              <div style={{ color: NOIR, fontWeight: 600, fontSize: 15, marginBottom: 8 }}>au partenaire</div>
              <p style={{ color: 'rgba(14,12,9,0.6)', fontSize: 13, lineHeight: 1.6, margin: 0 }}>
                {`Quand tu amènes ton propre client sur Kadio, tu gardes 72% du prix. Tu bénéficies quand même de tout le système : paiement, rappels, agenda et avis vérifiés.`}
              </p>
              <div style={{ marginTop: 16, padding: '10px 14px', background: 'rgba(184,146,42,0.08)', borderRadius: 8 }}>
                <div style={{ color: NOIR, fontSize: 13 }}>Exemple : service à 100$</div>
                <div style={{ color: OR, fontWeight: 700, fontSize: 15 }}>→ Tu reçois 72$</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ─── */}
      <section style={{
        padding: '80px 24px', textAlign: 'center',
        background: `linear-gradient(135deg, rgba(14,12,9,0.08) 0%, transparent 100%)`,
        borderTop: `1px solid rgba(14,12,9,0.08)`,
      }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <h2 style={{
            fontFamily: `'Bebas Neue', sans-serif`,
            fontSize: 'clamp(32px,6vw,52px)',
            color: NOIR, margin: '0 0 20px',
          }}>
            {`Tu as toutes les infos. Maintenant, agis.`}
          </h2>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/connexion')}
              style={{
                padding: '14px 32px', background: OR, color: NOIR,
                border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: 'pointer',
              }}
            >
              Créer mon compte
            </button>
            <button
              onClick={() => navigate('/rejoindre')}
              style={{
                padding: '14px 32px', background: 'transparent', color: OR,
                border: `1.5px solid ${OR}`, borderRadius: 8, fontSize: 15,
                fontWeight: 600, cursor: 'pointer',
              }}
            >
              Rejoindre le réseau
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
