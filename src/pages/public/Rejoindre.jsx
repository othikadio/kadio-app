import { useNavigate } from 'react-router-dom'
import { OR, CREME, NOIR, CARD } from '@/lib/utils'

const PROBLEMES = [
  {
    icone: '👻',
    titre: 'Clients fantômes',
    desc: `Tu bloques 4h pour une cliente qui ne se présente pas. Sans acompte, tu perds ta journée et ton revenu.`,
  },
  {
    icone: '📱',
    titre: `WhatsApp hors de contrôle`,
    desc: `Gérer les rendez-vous, les rappels, les paiements par messages — c'est un deuxième travail à temps plein.`,
  },
  {
    icone: '💸',
    titre: `Revenu imprévisible`,
    desc: `Des semaines pleines, des semaines vides. Impossible de planifier ta vie avec des revenus aussi instables.`,
  },
  {
    icone: '🔍',
    titre: `Invisibilité en ligne`,
    desc: `Tes clientes viennent uniquement par bouche à oreille. Tu n'as aucune visibilité pour attirer de nouveaux clients.`,
  },
]

const AVANTAGES = [
  `Profil certifié avec badge officiel Kadio`,
  `Visible sur la carte publique dans ta ville`,
  `Acompte automatique à chaque réservation`,
  `Rappels SMS automatiques pour toi et le client`,
  `Agenda en ligne gérable depuis ton téléphone`,
  `Virement hebdomadaire garanti`,
  `75% du prix client · le maximum sur le marché`,
  `Support en 11 langues de la diaspora`,
  `4 modes de travail selon tes préférences`,
  `Zéro frais d'inscription ou d'activation`,
]

const TEMOIGNAGES_PARTENAIRES = [
  { prenom: 'Diane M.', ville: 'Longueuil', texte: `En 3 mois j'ai doublé mes revenus. L'app gère tout pour moi.` },
  { prenom: 'Rachel N.', ville: 'Brossard', texte: `Mes clients réservent à minuit. Je me réveille avec un agenda plein.` },
  { prenom: 'Fatou K.', ville: 'Saint-Hubert', texte: `La certification Kadio m'a donné la crédibilité que je cherchais.` },
]

const MODES_TRAVAIL = [
  {
    icone: '🏠',
    titre: `En salon chez Kadio`,
    desc: `Tu loues une chaise dans notre espace salon. Les prix appliqués sont ceux du salon Kadio. Idéal pour débuter ou avoir un espace professionnel sans les coûts fixes.`,
    taux: '50%',
    detail: `du prix salon · chaise incluse`,
    cle: 'au_salon',
  },
  {
    icone: '✂️',
    titre: `À domicile — chez toi`,
    desc: `Le client se déplace directement chez toi. C'est le mode le plus demandé. Tu travailles dans ton espace, à ton rythme.`,
    taux: '75%',
    detail: `du prix client`,
    cle: 'chez_coiffeur',
  },
  {
    icone: '🚗',
    titre: `Déplacement en voiture`,
    desc: `Tu te déplaces chez le client avec ton véhicule. Un barème kilométrique transparent s'applique selon la distance depuis ton point de départ.`,
    taux: '75%',
    detail: `du prix client · frais km remboursés`,
    cle: 'deplacement_voiture',
  },
  {
    icone: '🚌',
    titre: `Déplacement en transport`,
    desc: `Tu te déplaces chez le client en STM, RTL ou autre réseau public. Le titre de transport est inclus dans le calcul du tarif de déplacement.`,
    taux: '75%',
    detail: `du prix client · transport inclus`,
    cle: 'deplacement_transport',
  },
  {
    icone: '🔄',
    titre: `Mode mixte`,
    desc: `Tu choisis librement ton mode de travail selon chaque RDV. Tu peux combiner salon, domicile et déplacement selon ta disponibilité.`,
    taux: '75%',
    detail: `du prix client · variable selon mode`,
    cle: 'mode_mixte',
  },
]

const BAREME_DEPLACEMENT = [
  { tranche: '0 à 5 km',   membre: '8$',  nonMembre: '15$' },
  { tranche: '6 à 10 km',  membre: '12$', nonMembre: '20$' },
  { tranche: '11 à 20 km', membre: '18$', nonMembre: '30$' },
  { tranche: '21 à 30 km', membre: '25$', nonMembre: '40$' },
  { tranche: '31 km+',     membre: 'Sur entente', nonMembre: 'Sur entente' },
]

const NIVEAUX = [
  {
    badge: 'Partenaire',
    couleur: CREME,
    emoji: '🤝',
    criteres: [`Candidature acceptée`, `Profil complété`, `Première réservation effectuée`],
    avantages: [`Accès à la carte publique`, `Rappels SMS`, `Paiement hebdomadaire`],
  },
  {
    badge: 'Certifié',
    couleur: '#60a5fa',
    emoji: '✓',
    criteres: [`10+ avis positifs`, `Note moyenne ≥ 4.5`, `3 mois actifs`],
    avantages: [`Badge Certifié sur profil`, `Priorité dans les résultats`, `Accès aux événements Kadio`],
  },
  {
    badge: 'Élite',
    couleur: OR,
    emoji: '★',
    criteres: [`50+ avis`, `Note ≥ 4.8`, `6 mois actifs`, `0 no-show`],
    avantages: [`Badge Élite doré`, `Mise en avant sur la carte`, `Commission +2%`, `Mentorat nouveaux partenaires`],
  },
  {
    badge: 'Ambassadeur',
    couleur: '#a855f7',
    emoji: '👑',
    criteres: [`Statut Élite depuis 6 mois`, `2 partenaires parrainés actifs`, `Participation événements`],
    avantages: [`Badge Ambassadeur`, `Commission max`, `Contenu prioritaire`, `Accès bêta nouvelles fonctionnalités`],
  },
]

export default function Rejoindre() {
  const navigate = useNavigate()

  return (
    <div style={{ background: CREME, color: NOIR, minHeight: '100vh', fontFamily: `'Inter', sans-serif` }}>

      {/* ── HERO ─── */}
      <section style={{
        padding: '100px 24px 80px', textAlign: 'center',
        background: `radial-gradient(ellipse at 50% 0%, rgba(14,12,9,0.08) 0%, transparent 60%)`,
        borderBottom: `1px solid rgba(184,146,42,0.12)`,
      }}>
        <div style={{
          display: 'inline-block', background: 'rgba(14,12,9,0.08)', color: OR,
          borderRadius: 20, padding: '4px 14px', fontSize: 12, fontWeight: 600,
          letterSpacing: 2, marginBottom: 20,
        }}>
          DEVENIR PARTENAIRE
        </div>
        <h1 style={{
          fontFamily: `'Bebas Neue', sans-serif`,
          fontSize: 'clamp(40px, 8vw, 80px)',
          color: NOIR, margin: '0 0 16px', lineHeight: 1.0, letterSpacing: 0.5,
          maxWidth: 800, marginLeft: 'auto', marginRight: 'auto',
        }}>
          Gagnez plus. Travaillez à votre rythme.<br />
          <span style={{ color: OR }}>Sous votre nom.</span>
        </h1>
        <p style={{ color: 'rgba(14,12,9,0.65)', fontSize: 16, maxWidth: 520, margin: '0 auto 36px', lineHeight: 1.6 }}>
          {`Nos partenaires gagnent en moyenne 2 800$/mois. Sans patron. Sans horaire fixe.`}
        </p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/candidature')}
            style={{
              padding: '14px 36px', background: OR, color: NOIR,
              border: 'none', borderRadius: 8, fontSize: 16, fontWeight: 700, cursor: 'pointer',
            }}
          >
            Je veux rejoindre le réseau →
          </button>
          <a
            href="https://wa.me/5149195970"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '14px 32px', background: 'transparent', color: NOIR,
              border: `1.5px solid rgba(14,12,9,0.3)`, borderRadius: 8, fontSize: 15,
              fontWeight: 600, cursor: 'pointer', textDecoration: 'none',
              display: 'inline-flex', alignItems: 'center', gap: 8,
            }}
          >
            💬 WhatsApp
          </a>
        </div>
      </section>

      {/* ── 4 PROBLÈMES ─── */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ color: OR, fontSize: 12, fontWeight: 600, letterSpacing: 2, marginBottom: 12 }}>RÉALITÉ DU TERRAIN</div>
          <h2 style={{ fontFamily: `'Bebas Neue', sans-serif`, fontSize: 'clamp(28px,5vw,44px)', color: NOIR, margin: 0 }}>
            {`4 problèmes des coiffeurs indépendants`}
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
          {PROBLEMES.map(p => (
            <div key={p.titre} style={{
              background: CARD, borderRadius: 16, padding: '28px 22px',
              border: `1px solid rgba(184,146,42,0.12)`,
            }}>
              <div style={{ fontSize: 36, marginBottom: 14 }}>{p.icone}</div>
              <h3 style={{ color: NOIR, fontWeight: 700, fontSize: 16, margin: '0 0 10px' }}>{p.titre}</h3>
              <p style={{ color: 'rgba(14,12,9,0.65)', fontSize: 13, lineHeight: 1.6, margin: 0 }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 10 AVANTAGES ─── */}
      <section style={{ background: CARD, padding: '80px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ color: OR, fontSize: 12, fontWeight: 600, letterSpacing: 2, marginBottom: 12 }}>POURQUOI KADIO</div>
            <h2 style={{ fontFamily: `'Bebas Neue', sans-serif`, fontSize: 'clamp(28px,5vw,44px)', color: NOIR, margin: 0 }}>
              10 avantages Kadio
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
            {AVANTAGES.map((av, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'flex-start', gap: 12,
                background: CREME, borderRadius: 10, padding: '14px 16px',
                border: `1px solid rgba(14,12,9,0.08)`,
              }}>
                <div style={{
                  width: 24, height: 24, borderRadius: '50%', background: OR,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, marginTop: 1,
                }}>
                  <span style={{ color: NOIR, fontSize: 12, fontWeight: 700 }}>✓</span>
                </div>
                <span style={{ color: NOIR, fontSize: 14, lineHeight: 1.4 }}>{av}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BARÈME RÉALISTE ─── */}
      <section style={{ maxWidth: 800, margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ color: OR, fontSize: 12, fontWeight: 600, letterSpacing: 2, marginBottom: 12 }}>CALCUL CONCRET</div>
          <h2 style={{ fontFamily: `'Bebas Neue', sans-serif`, fontSize: 'clamp(26px,4vw,40px)', color: NOIR, margin: 0 }}>
            Exemple réaliste — 1 mois comme partenaire Kadio
          </h2>
        </div>
        <div style={{ background: CARD, borderRadius: 16, padding: '32px 28px', border: `1px solid rgba(14,12,9,0.08)` }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: `1px solid rgba(14,12,9,0.08)` }}>
              <div>
                <div style={{ color: NOIR, fontWeight: 600 }}>12 clients Kadio</div>
                <div style={{ color: 'rgba(14,12,9,0.5)', fontSize: 13 }}>Prix moyen 80$ · Commission 75%</div>
              </div>
              <div style={{ color: OR, fontFamily: `'Bebas Neue', sans-serif`, fontSize: 28 }}>720$</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: `1px solid rgba(14,12,9,0.08)` }}>
              <div>
                <div style={{ color: NOIR, fontWeight: 600 }}>2 conversions abonnement</div>
                <div style={{ color: 'rgba(14,12,9,0.5)', fontSize: 13 }}>Bonus 15$ chacune</div>
              </div>
              <div style={{ color: OR, fontFamily: `'Bebas Neue', sans-serif`, fontSize: 28 }}>+30$</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0 0' }}>
              <div>
                <div style={{ color: NOIR, fontWeight: 700, fontSize: 17 }}>Total du mois</div>
                <div style={{ color: 'rgba(14,12,9,0.5)', fontSize: 12 }}>Hors déplacements · Sans frais fixes</div>
              </div>
              <div style={{
                fontFamily: `'Bebas Neue', sans-serif`, fontSize: 52, color: OR, lineHeight: 1,
              }}>
                750$
              </div>
            </div>
          </div>
          <div style={{
            marginTop: 20, padding: '12px 16px', background: 'rgba(184,146,42,0.08)',
            borderRadius: 10, color: 'rgba(14,12,9,0.6)', fontSize: 13, lineHeight: 1.6,
          }}>
            📌 {`Basé sur 3 clients/semaine à domicile, service moyen knotless/tresses. Les résultats réels varient selon ta ville, tes spécialités et ta disponibilité.`}
          </div>
        </div>
      </section>

      {/* ── 4 MODES DE TRAVAIL ─── */}
      <section style={{ background: CARD, padding: '80px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ color: OR, fontSize: 12, fontWeight: 600, letterSpacing: 2, marginBottom: 12 }}>FLEXIBILITÉ</div>
            <h2 style={{ fontFamily: `'Bebas Neue', sans-serif`, fontSize: 'clamp(28px,5vw,44px)', color: NOIR, margin: 0 }}>
              4 modes de travail
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
            {MODES_TRAVAIL.map(m => (
              <div key={m.titre} style={{
                background: CREME, borderRadius: 16, padding: '28px 22px',
                border: `1px solid rgba(184,146,42,0.12)`,
                display: 'flex', flexDirection: 'column', gap: 12,
              }}>
                <span style={{ fontSize: 32 }}>{m.icone}</span>
                <h3 style={{ color: NOIR, fontWeight: 700, fontSize: 16, margin: 0 }}>{m.titre}</h3>
                <p style={{ color: 'rgba(14,12,9,0.65)', fontSize: 13, lineHeight: 1.6, margin: 0, flex: 1 }}>{m.desc}</p>
                <div style={{
                  background: 'rgba(14,12,9,0.08)', borderRadius: 8, padding: '8px 12px',
                  display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  <span style={{ fontFamily: `'Bebas Neue', sans-serif`, fontSize: 24, color: OR }}>{m.taux}</span>
                  <span style={{ color: 'rgba(14,12,9,0.6)', fontSize: 12 }}>{m.detail}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BARÈME DÉPLACEMENT ─── */}
      <section style={{ maxWidth: 800, margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ color: OR, fontSize: 12, fontWeight: 600, letterSpacing: 2, marginBottom: 10 }}>FRAIS DE DÉPLACEMENT</div>
          <h2 style={{ fontFamily: `'Bebas Neue', sans-serif`, fontSize: 'clamp(24px,4vw,36px)', color: NOIR, margin: '0 0 8px' }}>
            Barème transparent — frais au partenaire
          </h2>
          <p style={{ color: 'rgba(14,12,9,0.6)', fontSize: 14, margin: 0 }}>
            Ces frais s'ajoutent au prix du service. Ils vont entièrement au partenaire — pas à Kadio.
          </p>
        </div>
        <div style={{ background: CARD, borderRadius: 14, overflow: 'hidden', border: `1px solid rgba(14,12,9,0.08)` }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', borderBottom: `1px solid rgba(14,12,9,0.08)` }}>
            {['Distance', 'Membre', 'Non-membre'].map(h => (
              <div key={h} style={{ padding: '12px 16px', color: OR, fontSize: 11, fontWeight: 700, letterSpacing: 1 }}>{h.toUpperCase()}</div>
            ))}
          </div>
          {BAREME_DEPLACEMENT.map((row, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', borderBottom: i < BAREME_DEPLACEMENT.length - 1 ? `1px solid rgba(184,146,42,0.08)` : 'none' }}>
              <div style={{ padding: '12px 16px', color: NOIR, fontSize: 14 }}>{row.tranche}</div>
              <div style={{ padding: '12px 16px', color: '#22c55e', fontWeight: 700, fontSize: 14 }}>{row.membre}</div>
              <div style={{ padding: '12px 16px', color: 'rgba(14,12,9,0.6)', fontSize: 14 }}>{row.nonMembre}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── NIVEAUX ─── */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ color: OR, fontSize: 12, fontWeight: 600, letterSpacing: 2, marginBottom: 12 }}>PROGRESSION</div>
          <h2 style={{ fontFamily: `'Bebas Neue', sans-serif`, fontSize: 'clamp(28px,5vw,44px)', color: NOIR, margin: 0 }}>
            Évolue dans le réseau
          </h2>
          <p style={{ color: 'rgba(14,12,9,0.6)', marginTop: 10, fontSize: 14 }}>
            {`Chaque niveau débloque de nouveaux avantages et une meilleure visibilité`}
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
          {NIVEAUX.map((n) => (
            <div key={n.badge} style={{
              background: CARD, borderRadius: 16, padding: '28px 22px',
              border: `1px solid ${n.couleur}33`,
              position: 'relative',
            }}>
              <div style={{
                position: 'absolute', top: -1, left: -1, right: -1,
                height: 4, borderRadius: '16px 16px 0 0',
                background: n.couleur,
              }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <span style={{ fontSize: 24 }}>{n.emoji}</span>
                <div style={{ fontFamily: `'Bebas Neue', sans-serif`, fontSize: 22, color: n.couleur, letterSpacing: 1 }}>
                  {n.badge}
                </div>
              </div>
              <div style={{ marginBottom: 14 }}>
                <div style={{ color: 'rgba(14,12,9,0.5)', fontSize: 11, fontWeight: 600, letterSpacing: 1, marginBottom: 8 }}>CRITÈRES</div>
                {n.criteres.map(c => (
                  <div key={c} style={{ display: 'flex', alignItems: 'flex-start', gap: 6, marginBottom: 4 }}>
                    <span style={{ color: n.couleur, fontSize: 12, flexShrink: 0 }}>·</span>
                    <span style={{ color: 'rgba(14,12,9,0.7)', fontSize: 13 }}>{c}</span>
                  </div>
                ))}
              </div>
              <div>
                <div style={{ color: 'rgba(14,12,9,0.5)', fontSize: 11, fontWeight: 600, letterSpacing: 1, marginBottom: 8 }}>AVANTAGES</div>
                {n.avantages.map(a => (
                  <div key={a} style={{ display: 'flex', alignItems: 'flex-start', gap: 6, marginBottom: 4 }}>
                    <span style={{ color: n.couleur, fontSize: 12, flexShrink: 0 }}>✓</span>
                    <span style={{ color: NOIR, fontSize: 13 }}>{a}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── TÉMOIGNAGES ─── */}
      <section style={{ background: CARD, padding: '80px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={{ color: OR, fontSize: 12, fontWeight: 600, letterSpacing: 2, marginBottom: 12 }}>ILS NOUS FONT CONFIANCE</div>
            <h2 style={{ fontFamily: `'Bebas Neue', sans-serif`, fontSize: 'clamp(28px,5vw,44px)', color: NOIR, margin: 0 }}>
              Ce que disent nos partenaires
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
            {TEMOIGNAGES_PARTENAIRES.map(t => (
              <div key={t.prenom} style={{ background: CREME, borderRadius: 16, padding: '24px 20px', border: `1px solid rgba(14,12,9,0.08)` }}>
                <p style={{ color: NOIR, fontSize: 15, lineHeight: 1.6, margin: '0 0 16px', fontStyle: 'italic' }}>
                  "{t.texte}"
                </p>
                <div style={{ color: OR, fontWeight: 700, fontSize: 14 }}>{t.prenom}</div>
                <div style={{ color: 'rgba(14,12,9,0.5)', fontSize: 12 }}>{t.ville}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── URGENCE ─── */}
      <section style={{ maxWidth: 700, margin: '0 auto', padding: '60px 24px 0' }}>
        <div style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 14, padding: '24px 28px', textAlign: 'center' }}>
          <div style={{ fontSize: 28, marginBottom: 10 }}>⚡</div>
          <p style={{ color: '#ef4444', fontWeight: 700, fontSize: 16, margin: '0 0 6px' }}>
            Nous acceptons un nombre limité de partenaires par zone géographique.
          </p>
          <p style={{ color: 'rgba(14,12,9,0.65)', fontSize: 14, margin: 0 }}>
            Places disponibles dans votre secteur — ne laissez pas un autre coiffeur prendre votre zone.
          </p>
        </div>
      </section>

      {/* ── CTA ─── */}
      <section style={{
        padding: '80px 24px', textAlign: 'center',
        background: `linear-gradient(135deg, rgba(184,146,42,0.12) 0%, rgba(184,146,42,0.02) 100%)`,
        borderTop: `1px solid rgba(14,12,9,0.08)`,
        marginTop: 60,
      }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{
            fontFamily: `'Bebas Neue', sans-serif`,
            fontSize: 'clamp(32px,6vw,54px)',
            color: NOIR, margin: '0 0 12px',
          }}>
            15 minutes sans engagement
          </h2>
          <p style={{ color: 'rgba(14,12,9,0.65)', fontSize: 15, marginBottom: 32, lineHeight: 1.6 }}>
            {`Remplis le formulaire en 3 étapes. On te contacte dans 48h pour valider ton profil. Aucun engagement, aucun frais.`}
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/candidature')}
              style={{
                padding: '15px 36px', background: OR, color: NOIR,
                border: 'none', borderRadius: 8, fontSize: 16, fontWeight: 700, cursor: 'pointer',
              }}
            >
              Je veux rejoindre le réseau →
            </button>
            <a
              href="https://wa.me/5149195970"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '15px 28px', background: '#25D366', color: '#fff',
                border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 600,
                cursor: 'pointer', textDecoration: 'none',
                display: 'inline-flex', alignItems: 'center', gap: 8,
              }}
            >
              💬 WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
