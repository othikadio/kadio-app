import { useNavigate } from 'react-router-dom'
import { OR, CREME, NOIR, CARD } from '@/lib/utils'

const MUTED = 'rgba(14,12,9,0.5)'

const TICKETS = [
  { id: 't1', titre: '1 ticket',          prix: '20 $',    badge: null,          action: 'Acheter',   highlight: false, subtitle: 'Votre première chance. Simple et accessible.' },
  { id: 't2', titre: '3 tickets',         prix: '50 $',    badge: 'RECOMMANDÉ',  action: 'Acheter',   highlight: true,  subtitle: '3× plus de chances de gagner. Choix de 73% des participants.' },
  { id: 't3', titre: 'Coiffure au salon', prix: '+1 gratuit', badge: null,        action: 'Réserver',  highlight: false, subtitle: 'Prenez soin de vos cheveux ET participez. Double bénéfice.' },
  { id: 't4', titre: 'Abonnement mensuel',prix: '+3 gratuits',badge: null,        action: `S'abonner`, highlight: false, subtitle: 'La meilleure valeur. Économisez sur vos coiffures ET maximisez vos chances.' },
]

const PARTICIPANTS  = 247
const OBJECTIF      = 5000
const PROGRESSION   = Math.round((PARTICIPANTS / OBJECTIF) * 100 * 100) / 100

const VILLES_RECENTES = ['Longueuil', 'Montréal', 'Brossard', 'Laval', 'Saint-Hubert']

function joursRestants() {
  const tirage = new Date('2026-12-20')
  const auj = new Date()
  return Math.max(0, Math.ceil((tirage - auj) / (1000 * 60 * 60 * 24)))
}

export default function Tirage() {
  const navigate = useNavigate()
  const jours = joursRestants()
  const villeRecente = VILLES_RECENTES[Math.floor(Math.random() * VILLES_RECENTES.length)]

  return (
    <div style={{ background: CREME, color: NOIR, minHeight: '100vh', paddingBottom: '80px' }}>

      {/* ── HEADER ─────────────────────────────────────────────── */}
      <div style={{ background: `linear-gradient(135deg, rgba(184,146,42,0.18) 0%, rgba(184,146,42,0.04) 100%)`, borderBottom: `1px solid rgba(184,146,42,0.25)`, padding: '48px 24px 40px', textAlign: 'center' }}>
        <button onClick={() => navigate(-1)} style={{ position: 'absolute', left: 20, top: 20, background: 'none', border: 'none', color: MUTED, fontSize: 22, cursor: 'pointer', padding: '8px' }}>
          ←
        </button>
        <div style={{ fontSize: 56, marginBottom: 12 }}>🚗</div>
        <div style={{ color: OR, fontSize: 11, fontWeight: 600, letterSpacing: 3, marginBottom: 12 }}>TIRAGE KADIO 2026</div>
        <h1 style={{ fontFamily: `'Bebas Neue', sans-serif`, fontSize: 'clamp(28px, 7vw, 56px)', color: NOIR, margin: '0 0 12px', lineHeight: 1.05, maxWidth: 700, marginLeft: 'auto', marginRight: 'auto' }}>
          Quelqu'un va gagner cette voiture en décembre. Pourquoi pas vous ?
        </h1>
        <p style={{ color: MUTED, fontSize: 15, marginBottom: 0 }}>
          Toyota Corolla 2026 · Valeur 28 000 $ · Tirage le 20 décembre 2026
        </p>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 24px' }}>

        {/* ── GRAND PRIX ─────────────────────────────────────── */}
        <div style={{ background: CARD, border: `1px solid rgba(14,12,9,0.08)`, borderRadius: 20, padding: '32px 28px', marginTop: 32, marginBottom: 32, textAlign: 'center' }}>
          <div style={{ fontSize: 64, marginBottom: 12 }}>🚗</div>
          <h2 style={{ fontFamily: `'Bebas Neue', sans-serif`, fontSize: 40, color: OR, margin: '0 0 4px' }}>Toyota Corolla 2026</h2>
          <p style={{ color: MUTED, fontSize: 14, margin: 0 }}>Valeur estimée : 28 000 $</p>
        </div>

        {/* ── COMPTEUR + BARRE ───────────────────────────────── */}
        <div style={{ background: CARD, borderRadius: 16, padding: '24px', marginBottom: 32, border: `1px solid rgba(14,12,9,0.08)` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div style={{ fontSize: 36, fontWeight: 800, color: OR }}>{PARTICIPANTS.toLocaleString('fr-CA')}</div>
              <div style={{ color: MUTED, fontSize: 13 }}>participants actifs</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: MUTED, fontSize: 14 }}>Objectif</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: NOIR }}>{OBJECTIF.toLocaleString('fr-CA')}</div>
            </div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 999, height: 12, overflow: 'hidden', marginBottom: 8 }}>
            <div style={{ width: `${PROGRESSION}%`, height: '100%', background: `linear-gradient(90deg, ${OR}, #f5c842)`, borderRadius: 999, transition: 'width 1s' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: MUTED }}>
            <span>{PROGRESSION}% atteint</span>
            <span>Il manque {(OBJECTIF - PARTICIPANTS).toLocaleString('fr-CA')} participants</span>
          </div>
        </div>

        {/* Countdown + social proof */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 32 }}>
          <div style={{ background: CARD, borderRadius: 12, padding: '14px 16px', border: '1px solid rgba(14,12,9,0.08)', textAlign: 'center' }}>
            <div style={{ color: OR, fontSize: 28, fontWeight: 800, fontFamily: `'Bebas Neue', sans-serif` }}>{jours}</div>
            <div style={{ color: MUTED, fontSize: 12 }}>⏰ jours restants</div>
          </div>
          <div style={{ background: CARD, borderRadius: 12, padding: '14px 16px', border: '1px solid rgba(14,12,9,0.08)', textAlign: 'center' }}>
            <div style={{ color: '#22c55e', fontSize: 13, fontWeight: 600, marginBottom: 2 }}>👥 Dernière inscription</div>
            <div style={{ color: MUTED, fontSize: 12 }}>vient de {villeRecente}</div>
          </div>
        </div>

        {/* ── DATE DU TIRAGE ─────────────────────────────────── */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ color: MUTED, fontSize: 13, marginBottom: 4 }}>Date du tirage</div>
          <div style={{ fontFamily: `'Bebas Neue', sans-serif`, fontSize: 'clamp(32px, 6vw, 52px)', color: OR, lineHeight: 1 }}>
            20 DÉCEMBRE 2026
          </div>
        </div>

        {/* ── TICKETS ────────────────────────────────────────── */}
        <h2 style={{ fontSize: 20, fontWeight: 700, color: NOIR, marginBottom: 20 }}>Obtenir des tickets</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16, marginBottom: 40 }}>
          {TICKETS.map(t => (
            <div key={t.id} style={{ background: CARD, borderRadius: 14, padding: '24px 20px', border: `1.5px solid ${t.highlight ? OR : 'rgba(14,12,9,0.08)'}`, position: 'relative', display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', textAlign: 'center' }}>
              {t.badge && (
                <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: '#ef4444', color: '#fff', fontSize: 11, fontWeight: 700, padding: '3px 14px', borderRadius: 20, whiteSpace: 'nowrap' }}>
                  {t.badge}
                </div>
              )}
              <div style={{ fontSize: 18, fontWeight: 700, color: NOIR }}>{t.titre}</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: OR }}>{t.prix}</div>
              <div style={{ fontSize: 12, color: MUTED, lineHeight: 1.5 }}>{t.subtitle}</div>
              <button onClick={() => navigate('/connexion')} style={{ width: '100%', padding: '11px', background: t.highlight ? OR : 'transparent', color: t.highlight ? NOIR : OR, border: `1.5px solid ${OR}`, borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                {t.action}
              </button>
            </div>
          ))}
        </div>

        {/* ── RÈGLEMENT ──────────────────────────────────────── */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid rgba(255,255,255,0.07)`, borderRadius: 12, padding: '20px 24px', marginBottom: 32 }}>
          <div style={{ fontSize: 12, color: MUTED, lineHeight: 1.7 }}>
            <strong style={{ color: 'rgba(14,12,9,0.6)' }}>Mentions légales :</strong>{` `}
            Tirage régi par la Régie des alcools, des courses et des jeux (RACJ) — Québec. Un seul gagnant tiré au sort parmi les participants admissibles. Les tickets sont attribués aux membres Kadio inscrits et en règle au moment du tirage. Aucune valeur monétaire de remplacement. Résidents du Québec seulement, 18 ans et plus.
          </div>
        </div>

        {/* ── FOMO ───────────────────────────────────────────── */}
        <div style={{ background: CARD, borderRadius: 14, padding: '24px 20px', marginBottom: 32, border: '1px solid rgba(14,12,9,0.08)', textAlign: 'center' }}>
          <div style={{ fontSize: 24, marginBottom: 12 }}>🤔</div>
          <p style={{ color: NOIR, fontSize: 15, lineHeight: 1.7, margin: '0 0 8px' }}>
            Vous hésitez ? Pensez-y — <strong style={{ color: OR }}>20$ c'est le prix d'un café par semaine pendant un mois.</strong>
          </p>
          <p style={{ color: MUTED, fontSize: 14, margin: 0, fontStyle: 'italic' }}>
            La personne qui va gagner cette voiture a cliqué sur ce bouton.
          </p>
        </div>

        {/* ── CTA ────────────────────────────────────────────── */}
        <div style={{ textAlign: 'center' }}>
          <button onClick={() => navigate('/connexion')} style={{ padding: '14px 40px', background: OR, color: NOIR, border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
            Créer mon compte et participer
          </button>
        </div>

      </div>
    </div>
  )
}
