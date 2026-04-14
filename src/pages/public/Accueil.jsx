import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { OR, CREME, NOIR } from '@/lib/utils'
import { TEMOIGNAGES, STATS, FORFAITS } from '@/data/mockPublic'
import { usePartenairesPublic } from '@/hooks/usePartenaires'
import { useServicesPublic } from '@/hooks/useServices'
import { useArticles } from '@/hooks/useArticles'
import MapView from '@/components/ui/MapView'

/* ─── Palette locale ─────────────────────────────────────────── */
const WHITE  = '#FAFAF8'
const IVOIRE = '#F5F0E8'
const BLACK  = '#0E0C09'
const GOLD   = '#B8922A'
const MUTED  = 'rgba(14,12,9,0.45)'
const BORDER = 'rgba(14,12,9,0.08)'

/* ─── Galerie ────────────────────────────────────────────────── */
const GALERIE = [
  { src: '/gallery/knotless-long.jpg',      legende: 'Knotless Braids · Long',       h: 350 },
  { src: '/gallery/cornrows-enfant.jpg',     legende: 'Cornrows · Bébé curls',        h: 280 },
  { src: '/gallery/waves-homme.jpg',         legende: 'Waves & Cornrows · Homme',     h: 320 },
  { src: '/gallery/coupe-courte-design.jpg', legende: 'Coupe courte · Design',        h: 300 },
  { src: '/gallery/locs-homme.jpg',          legende: 'Locs naturels · Homme',        h: 340 },
  { src: '/gallery/tresse-geometrique.jpg',  legende: 'Tresses géométriques · Homme', h: 360 },
]

/* ─── Lightbox ───────────────────────────────────────────────── */
function Lightbox({ photos, index, onClose, onPrev, onNext }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, onPrev, onNext])

  const photo = photos[index]
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(14,12,9,0.94)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <button onClick={onClose} style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: `1px solid rgba(250,250,248,0.2)`, color: WHITE, borderRadius: '50%', width: 44, height: 44, fontSize: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
      <button onClick={(e) => { e.stopPropagation(); onPrev() }} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', background: 'none', border: `1px solid rgba(250,250,248,0.2)`, color: WHITE, borderRadius: '50%', width: 48, height: 48, fontSize: 22, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>←</button>
      <div onClick={(e) => e.stopPropagation()} style={{ maxWidth: '90vw', textAlign: 'center' }}>
        <img src={photo.src} alt={photo.legende} style={{ maxHeight: '80vh', maxWidth: '90vw', borderRadius: 4, objectFit: 'contain', display: 'block' }} />
        <div style={{ color: WHITE, fontWeight: 500, fontSize: 15, marginTop: 16, letterSpacing: '0.02em' }}>{photo.legende}</div>
        <div style={{ color: 'rgba(250,250,248,0.35)', fontSize: 12, marginTop: 4 }}>{index + 1} / {photos.length}</div>
      </div>
      <button onClick={(e) => { e.stopPropagation(); onNext() }} style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', background: 'none', border: `1px solid rgba(250,250,248,0.2)`, color: WHITE, borderRadius: '50%', width: 48, height: 48, fontSize: 22, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>→</button>
    </div>
  )
}

/* ─── Services avec prix régulier vs abonné ──────────────────── */
const SERVICES_ACCUEIL = [
  { nom: 'Knotless braids',      cat: 'Tresses', abonne: 'Inclus', forfait: 'Knotless Signature · 110$/mois' },
  { nom: 'Tresses classiques',   cat: 'Tresses', abonne: 'Inclus', forfait: 'Tresses Essentiel · 75$/mois' },
  { nom: 'Locs installation',    cat: 'Locs',    abonne: 'Inclus', forfait: 'Locs Premium · 90$/mois' },
  { nom: 'Locs entretien',       cat: 'Locs',    abonne: 'Inclus', forfait: 'Locs Mensuel · 60$/mois' },
  { nom: 'Coupe homme fade',     cat: 'Barbier', abonne: 'Inclus', forfait: 'Barbier Essentiel · 29$/mois' },
  { nom: 'Tissage simple',       cat: 'Tissage', abonne: '-25%',   forfait: 'Tout Compris · 149$/mois' },
  { nom: 'Coupes enfant (−12)',  cat: 'Enfants', abonne: 'Inclus', forfait: 'Famille Enfants · 55$/mois' },
  { nom: 'Soin cuir chevelu',    cat: 'Soins',   abonne: '-25%',   forfait: 'Tout Compris · 149$/mois' },
]

const FORFAITS_TOP = FORFAITS.filter(f => f.populaire).concat(
  FORFAITS.filter(f => !f.populaire && f.cat === 'Barbier').slice(0, 1)
).slice(0, 3)


/* ═══════════════════════════════════════════════════════════════
   PAGE D'ACCUEIL
   Style : luxe minimaliste — fond ivoire/blanc — Dior · Zara
   ═══════════════════════════════════════════════════════════════ */
export default function Accueil() {
  const navigate = useNavigate()
  const { data: partenaires } = usePartenairesPublic()
  const { data: services } = useServicesPublic()
  const { data: articles } = useArticles()
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const closeLightbox = useCallback(() => setLightboxIndex(null), [])
  const prevPhoto = useCallback(() => setLightboxIndex(i => (i - 1 + GALERIE.length) % GALERIE.length), [])
  const nextPhoto = useCallback(() => setLightboxIndex(i => (i + 1) % GALERIE.length), [])

  return (
    <div style={{ overflowX: 'hidden' }}>
      {lightboxIndex !== null && (
        <Lightbox photos={GALERIE} index={lightboxIndex} onClose={closeLightbox} onPrev={prevPhoto} onNext={nextPhoto} />
      )}
      <style>{`
        @keyframes scrollBand { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        .galerie-grid { columns: 3; column-gap: 16px; }
        @media (max-width: 640px) { .galerie-grid { columns: 2; } }
        .galerie-item { break-inside: avoid; margin-bottom: 16px; }
        .galerie-item:hover .galerie-img { transform: scale(1.02); }
      `}</style>


      {/* ══════════════════════════════════════════════════════════
          SECTION 1 — HERO · Fond blanc · KADIO en grand noir
          ══════════════════════════════════════════════════════════ */}
      <section style={{
        minHeight: '100vh',
        background: WHITE,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center',
        padding: '0 24px',
        position: 'relative',
      }}>
        <h1 style={{
          fontFamily: `'Cormorant Garamond', serif`,
          fontWeight: 400,
          fontSize: 'clamp(72px, 18vw, 200px)',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          textIndent: '0.14em',
          color: BLACK,
          margin: 0,
          lineHeight: 0.9,
          animation: 'fadeIn 1.2s ease',
        }}>
          KADIO
        </h1>

        <div style={{ width: 60, height: 1, background: BLACK, margin: '32px auto', opacity: 0.2 }} />

        <p style={{
          fontFamily: `'Cormorant Garamond', serif`,
          fontSize: 'clamp(16px, 2.8vw, 24px)',
          color: BLACK,
          maxWidth: 600,
          lineHeight: 1.5,
          margin: 0,
          fontWeight: 300,
          letterSpacing: '0.02em',
          animation: 'slideUp 1s ease 0.3s both',
        }}>
          L'excellence de la coiffure afro<br />
          maintenant accessible partout au Québec
        </p>

        {/* ── 4 parcours directement sous le sous-titre ── */}
        <div style={{
          marginTop: 40, width: '100%', maxWidth: 900, animation: 'slideUp 1s ease 0.6s both',
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1,
          background: 'rgba(14,12,9,0.06)',
        }}>
          {[
            { icon: '✂', iconBg: BLACK, iconColor: WHITE, label: 'Je suis client', desc: 'Réservez une coiffeuse certifiée', cta: 'Réserver', route: '/connexion', ctaBorder: BLACK },
            { icon: '♛', iconBg: GOLD, iconColor: WHITE, label: 'Je suis abonné', desc: 'Accédez à tout le réseau partout au Québec', cta: 'Mon espace', route: '/client', ctaBorder: GOLD },
            { icon: '★', iconBg: 'transparent', iconColor: GOLD, label: 'Coiffeur(se) / Emploi', desc: 'Rejoignez le réseau ou postulez au salon', cta: 'Rejoindre', route: '/rejoindre', ctaBorder: GOLD },
            { icon: '📦', iconBg: 'transparent', iconColor: GOLD, label: 'Je suis fournisseur', desc: 'Photos requises · Livraison partout au Québec · Commandes autonomes', cta: 'Devenir fournisseur', route: '/fournisseur', ctaBorder: GOLD },
          ].map(p => (
            <div key={p.label} onClick={() => navigate(p.route)} style={{
              background: WHITE, padding: '28px 16px', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
              transition: 'background 0.3s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = IVOIRE}
            onMouseLeave={e => e.currentTarget.style.background = WHITE}
            >
              <div style={{
                width: 40, height: 40, borderRadius: '50%',
                background: p.iconBg === 'transparent' ? 'transparent' : p.iconBg,
                border: p.iconBg === 'transparent' ? `1.5px solid ${p.iconColor}` : 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ color: p.iconBg === 'transparent' ? p.iconColor : p.iconColor, fontSize: 16 }}>{p.icon}</span>
              </div>
              <div style={{ fontSize: 13, fontWeight: 500, color: BLACK, fontFamily: `'Cormorant Garamond', serif`, textAlign: 'center' }}>{p.label}</div>
              <div style={{ fontSize: 11, color: MUTED, textAlign: 'center', lineHeight: 1.4 }}>{p.desc}</div>
              <span style={{ fontSize: 10, color: BLACK, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', borderBottom: `1px solid ${p.ctaBorder}`, paddingBottom: 1, marginTop: 2 }}>{p.cta}</span>
            </div>
          ))}
        </div>

        {/* Preuve sociale sous les parcours */}
        <div style={{
          marginTop: 28, display: 'flex', gap: 24, flexWrap: 'wrap',
          justifyContent: 'center', alignItems: 'center',
          animation: 'slideUp 1s ease 0.9s both',
        }}>
          <span style={{ fontSize: 13, color: MUTED, letterSpacing: '0.02em' }}>★ 4.4/5 Google</span>
          <span style={{ color: 'rgba(14,12,9,0.15)' }}>|</span>
          <span style={{ fontSize: 13, color: MUTED, letterSpacing: '0.02em' }}>500+ clients</span>
          <span style={{ color: 'rgba(14,12,9,0.15)' }}>|</span>
          <span style={{ fontSize: 13, color: MUTED, letterSpacing: '0.02em' }}>10+ coiffeurs certifiés</span>
        </div>

        <div style={{
          position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
          animation: 'fadeIn 1.5s ease 1.2s both',
        }}>
          <div style={{ width: 1, height: 48, background: BLACK, opacity: 0.12 }} />
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════════
          BANDEAU DÉFILANT — villes
          ══════════════════════════════════════════════════════════ */}
      <div style={{
        overflow: 'hidden',
        borderTop: `1px solid ${BORDER}`,
        borderBottom: `1px solid ${BORDER}`,
        background: WHITE,
        padding: '14px 0',
      }}>
        <div style={{ display: 'flex', width: 'max-content', animation: 'scrollBand 22s linear infinite' }}>
          {[0, 1, 2, 3].map(i => (
            <span key={i} style={{ color: BLACK, fontSize: 12, fontWeight: 400, letterSpacing: '0.2em', whiteSpace: 'nowrap', padding: '0 40px', textTransform: 'uppercase', opacity: 0.35 }}>
              Longueuil · Montréal · Laval · Brossard · Québec · Gatineau · Sherbrooke ·
            </span>
          ))}
        </div>
      </div>


      {/* ══════════════════════════════════════════════════════════
          SECTION 2 — CE QU'ON OFFRE · Fond ivoire
          ══════════════════════════════════════════════════════════ */}
      <section style={{ background: IVOIRE, padding: '100px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ color: GOLD, fontSize: 11, fontWeight: 500, letterSpacing: '0.25em', textTransform: 'uppercase', margin: '0 0 16px' }}>L'écosystème</p>
            <h2 style={{ fontFamily: `'Cormorant Garamond', serif`, fontSize: 'clamp(32px, 5vw, 52px)', color: BLACK, margin: 0, fontWeight: 300, letterSpacing: '0.02em' }}>
              Trois piliers, une vision
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 1, background: 'rgba(14,12,9,0.06)' }}>
            {[
              { titre: 'Salon Kadio', lieu: 'Longueuil', desc: `Coiffure afro, locs, tresses, barbier, soins végétaux. L'expérience en personne.` },
              { titre: 'Kadio Network', lieu: 'Grand Montréal', desc: `10+ coiffeurs certifiés. Même standards. Même application. Partout au Québec.` },
              { titre: 'Kadio Végétal', lieu: 'Soins naturels', desc: `Chébé, moringa, ghassoul, aloe vera. Préparés devant vous. Zéro chimie.` },
            ].map((item) => (
              <div key={item.titre} style={{
                padding: '48px 36px', background: IVOIRE,
                display: 'flex', flexDirection: 'column', gap: 16,
              }}>
                <p style={{ color: GOLD, fontSize: 11, fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', margin: 0 }}>{item.lieu}</p>
                <h3 style={{ fontSize: 24, color: BLACK, margin: 0, fontWeight: 400, fontFamily: `'Cormorant Garamond', serif`, letterSpacing: '0.02em' }}>{item.titre}</h3>
                <p style={{ color: MUTED, fontSize: 14, lineHeight: 1.7, margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════════
          SECTION 3 — SERVICES · Prix régulier vs Abonné
          ══════════════════════════════════════════════════════════ */}
      <section style={{ background: WHITE, padding: '100px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ color: MUTED, fontSize: 11, fontWeight: 500, letterSpacing: '0.25em', textTransform: 'uppercase', margin: '0 0 16px' }}>Au salon</p>
            <h2 style={{ fontFamily: `'Cormorant Garamond', serif`, fontSize: 'clamp(32px, 5vw, 52px)', color: BLACK, margin: 0, fontWeight: 300, letterSpacing: '0.02em' }}>
              Nos services
            </h2>
            <p style={{ color: MUTED, fontSize: 14, marginTop: 16 }}>Pourquoi payer plein prix ? Avec un abonnement, vos services sont inclus.</p>
          </div>

          {/* En-tête colonnes */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr auto auto',
            gap: 16, padding: '12px 28px',
            borderBottom: `2px solid ${BLACK}`, marginBottom: 0,
          }}>
            <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: MUTED }}>Service</div>
            <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: MUTED, textAlign: 'right', minWidth: 80 }}>Prix régulier</div>
            <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: GOLD, textAlign: 'right', minWidth: 100 }}>Abonné</div>
          </div>

          {/* Liste services */}
          {SERVICES_ACCUEIL.map(sv => {
            const data = services.find(s => s.nom === sv.nom || s.nom.toLowerCase().includes(sv.nom.toLowerCase())) || {}
            const prixSalon = data.salon || 0
            const isInclus = sv.abonne === 'Inclus'
            return (
              <div key={sv.nom} style={{
                display: 'grid', gridTemplateColumns: '1fr auto auto',
                gap: 16, padding: '20px 28px', alignItems: 'center',
                borderBottom: `1px solid ${BORDER}`,
              }}>
                <div>
                  <div style={{ color: BLACK, fontWeight: 500, fontSize: 15 }}>{sv.nom}</div>
                  <div style={{ color: MUTED, fontSize: 12, marginTop: 2 }}>{sv.cat}</div>
                </div>
                <div style={{ textAlign: 'right', minWidth: 80 }}>
                  <div style={{
                    color: MUTED, fontWeight: 500, fontSize: 16,
                    textDecoration: isInclus ? 'line-through' : 'none',
                    opacity: isInclus ? 0.5 : 1,
                  }}>{prixSalon} $</div>
                </div>
                <div style={{ textAlign: 'right', minWidth: 100 }}>
                  {isInclus ? (
                    <div style={{
                      display: 'inline-block', background: BLACK, color: WHITE,
                      padding: '4px 12px', fontSize: 12, fontWeight: 600,
                      letterSpacing: '0.06em', textTransform: 'uppercase',
                    }}>Inclus</div>
                  ) : (
                    <div style={{
                      display: 'inline-block', border: `1px solid ${GOLD}`, color: GOLD,
                      padding: '4px 12px', fontSize: 12, fontWeight: 600,
                      letterSpacing: '0.06em',
                    }}>{sv.abonne}</div>
                  )}
                </div>
              </div>
            )
          })}

          {/* Bannière économies */}
          <div style={{
            marginTop: 32, padding: '24px 28px',
            background: IVOIRE, display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', flexWrap: 'wrap', gap: 16,
          }}>
            <div>
              <div style={{ color: BLACK, fontWeight: 500, fontSize: 15 }}>Économisez jusqu'à 100% sur vos services</div>
              <div style={{ color: MUTED, fontSize: 13, marginTop: 4 }}>Abonnements à partir de 29$/mois · Annulez quand vous voulez</div>
            </div>
            <button onClick={() => navigate('/forfaits')} style={{
              padding: '12px 32px', background: BLACK, color: WHITE,
              border: 'none', borderRadius: 0, fontSize: 12,
              fontWeight: 500, cursor: 'pointer', letterSpacing: '0.1em', textTransform: 'uppercase',
              flexShrink: 0,
            }}>
              Voir les forfaits
            </button>
          </div>

          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <button onClick={() => navigate('/forfaits')} style={{
              padding: '14px 40px', background: 'transparent', color: BLACK,
              border: `1px solid ${BLACK}`, borderRadius: 0, fontSize: 12,
              fontWeight: 500, cursor: 'pointer', letterSpacing: '0.12em', textTransform: 'uppercase',
            }}>
              Tous les services et tarifs
            </button>
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════════
          SECTION 4 — GALERIE · Fond ivoire
          ══════════════════════════════════════════════════════════ */}
      <section style={{ padding: '100px 24px', background: IVOIRE }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ color: GOLD, fontSize: 11, fontWeight: 500, letterSpacing: '0.25em', textTransform: 'uppercase', margin: '0 0 16px' }}>Portfolio</p>
            <h2 style={{ fontFamily: `'Cormorant Garamond', serif`, fontSize: 'clamp(32px, 5vw, 52px)', color: BLACK, margin: 0, fontWeight: 300, letterSpacing: '0.02em' }}>
              Notre travail
            </h2>
          </div>

          <div className="galerie-grid">
            {GALERIE.map((photo, idx) => (
              <div key={idx} className="galerie-item" onClick={() => setLightboxIndex(idx)} style={{ cursor: 'pointer', overflow: 'hidden', position: 'relative', display: 'block' }}>
                <img className="galerie-img" src={photo.src} alt={photo.legende} style={{ width: '100%', height: photo.h, objectFit: 'cover', display: 'block', transition: 'transform 0.5s ease' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(14,12,9,0.6) 0%, transparent 50%)' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px', color: WHITE, fontWeight: 400, fontSize: 13, letterSpacing: '0.03em' }}>
                  {photo.legende}
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <a href="https://www.instagram.com/kadiocoiffure" target="_blank" rel="noopener noreferrer" style={{
              display: 'inline-block', padding: '14px 40px',
              background: 'transparent', color: BLACK,
              border: `1px solid ${BLACK}`, borderRadius: 0,
              fontSize: 12, fontWeight: 500, textDecoration: 'none',
              letterSpacing: '0.12em', textTransform: 'uppercase',
            }}>
              Instagram @kadiocoiffure
            </a>
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════════
          SECTION 5 — FORFAITS · Psychologie de conversion
          Ancrage prix · Urgence · Social proof · Recommandation
          ══════════════════════════════════════════════════════════ */}
      <section style={{ background: WHITE, padding: '100px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <p style={{ color: GOLD, fontSize: 11, fontWeight: 500, letterSpacing: '0.25em', textTransform: 'uppercase', margin: '0 0 16px' }}>Abonnements</p>
            <h2 style={{ fontFamily: `'Cormorant Garamond', serif`, fontSize: 'clamp(32px, 5vw, 52px)', color: BLACK, margin: 0, fontWeight: 300, letterSpacing: '0.02em' }}>
              Choisissez votre forfait
            </h2>
            <p style={{ color: MUTED, fontSize: 15, marginTop: 16, maxWidth: 500, margin: '16px auto 0' }}>
              Sans engagement · Annulez à tout moment · Économies dès le 1er mois
            </p>
          </div>

          {/* Social proof bandeau */}
          <div style={{ textAlign: 'center', marginBottom: 48, display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 13, color: MUTED }}>✓ 312 abonnés actifs</span>
            <span style={{ fontSize: 13, color: MUTED }}>✓ 97% de satisfaction</span>
            <span style={{ fontSize: 13, color: MUTED }}>✓ 0$ de frais d'annulation</span>
          </div>

          {/* Grille 3 forfaits — le milieu est "recommandé" */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 0 }}>

            {/* ── FORFAIT 1 : Barbier Essentiel ── */}
            <div style={{
              padding: '44px 32px', border: `1px solid ${BORDER}`,
              display: 'flex', flexDirection: 'column', gap: 20, background: WHITE,
            }}>
              <div>
                <p style={{ color: MUTED, fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', margin: '0 0 8px' }}>Barbier</p>
                <h3 style={{ color: BLACK, fontSize: 22, fontWeight: 500, margin: '0 0 6px', fontFamily: `'Cormorant Garamond', serif` }}>Barbier Essentiel</h3>
                <p style={{ color: MUTED, fontSize: 13, margin: 0, lineHeight: 1.5 }}>2 coupes par mois, idéal pour garder votre style</p>
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <span style={{ fontSize: 44, fontWeight: 300, color: BLACK, fontFamily: `'Cormorant Garamond', serif` }}>29</span>
                  <span style={{ color: MUTED, fontSize: 14 }}>$/mois</span>
                </div>
                {/* Ancrage : prix sans abonnement */}
                <div style={{ color: MUTED, fontSize: 12, marginTop: 4 }}>
                  <span style={{ textDecoration: 'line-through' }}>70 $/mois</span> sans abonnement
                </div>
                {/* Économie calculée */}
                <div style={{ color: GOLD, fontSize: 12, fontWeight: 600, marginTop: 4, letterSpacing: '0.04em' }}>
                  Vous économisez 41$/mois
                </div>
              </div>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
                {['2 coupes fade ou dégradé', 'Booking prioritaire', 'Rappels SMS automatiques', 'Annulation gratuite'].map(item => (
                  <li key={item} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: BLACK }}>
                    <span style={{ color: GOLD, fontSize: 14, flexShrink: 0 }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <button onClick={() => navigate('/forfaits')} style={{
                padding: '14px', background: 'transparent', color: BLACK,
                border: `1px solid ${BLACK}`, borderRadius: 0, fontSize: 12,
                fontWeight: 500, cursor: 'pointer', letterSpacing: '0.1em', textTransform: 'uppercase',
              }}>
                Commencer
              </button>
            </div>

            {/* ── FORFAIT 2 : Knotless Signature — RECOMMANDÉ ── */}
            <div style={{
              padding: '44px 32px', border: `2px solid ${GOLD}`,
              display: 'flex', flexDirection: 'column', gap: 20, background: WHITE,
              position: 'relative', transform: 'scale(1.02)', zIndex: 2,
              boxShadow: '0 8px 40px rgba(184,146,42,0.10)',
            }}>
              {/* Badge recommandé */}
              <div style={{
                position: 'absolute', top: -1, left: 0, right: 0,
                background: GOLD, color: WHITE, textAlign: 'center',
                fontSize: 11, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase',
                padding: '6px 0',
              }}>
                ★ Recommandé — Le plus populaire
              </div>
              <div style={{ marginTop: 20 }}>
                <p style={{ color: GOLD, fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', margin: '0 0 8px' }}>Tresses</p>
                <h3 style={{ color: BLACK, fontSize: 22, fontWeight: 500, margin: '0 0 6px', fontFamily: `'Cormorant Garamond', serif` }}>Knotless Signature</h3>
                <p style={{ color: MUTED, fontSize: 13, margin: 0, lineHeight: 1.5 }}>1 session knotless par mois + consultation style</p>
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <span style={{ fontSize: 44, fontWeight: 300, color: BLACK, fontFamily: `'Cormorant Garamond', serif` }}>110</span>
                  <span style={{ color: MUTED, fontSize: 14 }}>$/mois</span>
                </div>
                <div style={{ color: MUTED, fontSize: 12, marginTop: 4 }}>
                  <span style={{ textDecoration: 'line-through' }}>140 $/mois</span> sans abonnement
                </div>
                <div style={{ color: GOLD, fontSize: 12, fontWeight: 600, marginTop: 4, letterSpacing: '0.04em' }}>
                  Vous économisez 30$/mois + consultation gratuite
                </div>
              </div>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
                {['1 session knotless braids', 'Consultation style personnalisée', 'Priorité booking VIP', 'Rappels SMS automatiques', '15% de réduction sur les extras', 'Partenaire dédié'].map(item => (
                  <li key={item} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: BLACK }}>
                    <span style={{ color: GOLD, fontSize: 14, flexShrink: 0 }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <button onClick={() => navigate('/forfaits')} style={{
                padding: '14px', background: GOLD, color: WHITE,
                border: 'none', borderRadius: 0, fontSize: 12,
                fontWeight: 600, cursor: 'pointer', letterSpacing: '0.1em', textTransform: 'uppercase',
              }}>
                Choisir ce forfait
              </button>
            </div>

            {/* ── FORFAIT 3 : Tout Compris ── */}
            <div style={{
              padding: '44px 32px', border: `1px solid ${BORDER}`,
              display: 'flex', flexDirection: 'column', gap: 20, background: WHITE,
            }}>
              <div>
                <p style={{ color: MUTED, fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', margin: '0 0 8px' }}>Tous services</p>
                <h3 style={{ color: BLACK, fontSize: 22, fontWeight: 500, margin: '0 0 6px', fontFamily: `'Cormorant Garamond', serif` }}>Tout Compris</h3>
                <p style={{ color: MUTED, fontSize: 13, margin: 0, lineHeight: 1.5 }}>Accès illimité à tous les services Kadio</p>
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <span style={{ fontSize: 44, fontWeight: 300, color: BLACK, fontFamily: `'Cormorant Garamond', serif` }}>149</span>
                  <span style={{ color: MUTED, fontSize: 14 }}>$/mois</span>
                </div>
                <div style={{ color: MUTED, fontSize: 12, marginTop: 4 }}>
                  <span style={{ textDecoration: 'line-through' }}>350+ $/mois</span> sans abonnement
                </div>
                <div style={{ color: GOLD, fontSize: 12, fontWeight: 600, marginTop: 4, letterSpacing: '0.04em' }}>
                  Vous économisez 200+$/mois
                </div>
              </div>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
                {['Services au choix illimités*', 'Priorité absolue sur tous les créneaux', 'Partenaire dédié attitré', '25% de réduction sur les extras', 'Rappels SMS automatiques', '*fair use : 1 service/semaine max'].map((item, idx) => (
                  <li key={item} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: idx === 5 ? MUTED : BLACK, fontStyle: idx === 5 ? 'italic' : 'normal' }}>
                    <span style={{ color: idx === 5 ? MUTED : GOLD, fontSize: 14, flexShrink: 0 }}>{idx === 5 ? '' : '✓'}</span>
                    {item}
                  </li>
                ))}
              </ul>
              <button onClick={() => navigate('/forfaits')} style={{
                padding: '14px', background: BLACK, color: WHITE,
                border: 'none', borderRadius: 0, fontSize: 12,
                fontWeight: 500, cursor: 'pointer', letterSpacing: '0.1em', textTransform: 'uppercase',
              }}>
                Commencer
              </button>
            </div>
          </div>

          {/* Garantie — réduction de risque */}
          <div style={{
            marginTop: 40, padding: '28px 32px', background: IVOIRE,
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 15, color: BLACK, fontWeight: 500, marginBottom: 6 }}>
              Garantie satisfait ou remboursé 30 jours
            </div>
            <div style={{ fontSize: 13, color: MUTED, lineHeight: 1.6 }}>
              Pas satisfait ? On vous rembourse intégralement. Sans question. Sans délai.
            </div>
          </div>

          {/* Urgence douce */}
          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <p style={{ fontSize: 13, color: MUTED, fontStyle: 'italic' }}>
              🔒 Places limitées par quartier pour garantir la qualité du service
            </p>
          </div>

          {/* Lien vers tous les forfaits */}
          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <button onClick={() => navigate('/forfaits')} style={{
              padding: '14px 40px', background: 'transparent', color: BLACK,
              border: `1px solid ${BLACK}`, borderRadius: 0, fontSize: 12,
              fontWeight: 500, cursor: 'pointer', letterSpacing: '0.12em', textTransform: 'uppercase',
            }}>
              Voir tous les 9 forfaits
            </button>
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════════
          SECTION 6 — RÉSEAU / CARTE · Fond ivoire
          ══════════════════════════════════════════════════════════ */}
      <section style={{ background: IVOIRE, padding: '100px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <p style={{ color: GOLD, fontSize: 11, fontWeight: 500, letterSpacing: '0.25em', textTransform: 'uppercase', margin: '0 0 16px' }}>Réseau</p>
            <h2 style={{ fontFamily: `'Cormorant Garamond', serif`, fontSize: 'clamp(32px, 5vw, 52px)', color: BLACK, margin: 0, fontWeight: 300, letterSpacing: '0.02em' }}>
              Nos partenaires certifiés
            </h2>
          </div>
          <MapView partenaires={partenaires} height="420px" />
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════════
          SECTION 7 — TIRAGE VOITURE · Fond blanc, accent doré
          ══════════════════════════════════════════════════════════ */}
      <section style={{ background: WHITE, padding: '100px 24px', borderTop: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ color: GOLD, fontSize: 11, fontWeight: 500, letterSpacing: '0.25em', textTransform: 'uppercase', margin: '0 0 16px' }}>Tirage 2026</p>
          <h2 style={{ fontFamily: `'Cormorant Garamond', serif`, fontSize: 'clamp(32px, 5vw, 48px)', color: BLACK, margin: '0 0 20px', fontWeight: 300, lineHeight: 1.15, letterSpacing: '0.02em' }}>
            Gagnez une voiture
          </h2>
          <p style={{ color: MUTED, fontSize: 15, lineHeight: 1.7, marginBottom: 36 }}>
            1 ticket = 20$ · 3 tickets = 50$ · Chaque coiffure au salon = 1 ticket gratuit
          </p>
          <div style={{ display: 'flex', gap: 40, justifyContent: 'center', marginBottom: 40 }}>
            <div>
              <div style={{ fontSize: 36, fontWeight: 300, color: BLACK, fontFamily: `'Cormorant Garamond', serif` }}>247</div>
              <div style={{ fontSize: 11, color: MUTED, letterSpacing: '0.1em', textTransform: 'uppercase' }}>participants</div>
            </div>
            <div>
              <div style={{ fontSize: 36, fontWeight: 300, color: BLACK, fontFamily: `'Cormorant Garamond', serif` }}>5 000</div>
              <div style={{ fontSize: 11, color: MUTED, letterSpacing: '0.1em', textTransform: 'uppercase' }}>objectif</div>
            </div>
          </div>
          <div style={{ background: 'rgba(14,12,9,0.06)', height: 2, marginBottom: 36 }}>
            <div style={{ width: '4.94%', height: '100%', background: GOLD, transition: 'width 1s' }} />
          </div>
          <button onClick={() => navigate('/tirage')} style={{
            padding: '14px 40px', background: BLACK, color: WHITE,
            border: 'none', borderRadius: 0, fontSize: 12,
            fontWeight: 500, cursor: 'pointer', letterSpacing: '0.12em', textTransform: 'uppercase',
          }}>
            Participer
          </button>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════════
          SECTION 8 — TÉMOIGNAGES · Fond ivoire
          ══════════════════════════════════════════════════════════ */}
      <section style={{ background: IVOIRE, padding: '100px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ color: GOLD, fontSize: 11, fontWeight: 500, letterSpacing: '0.25em', textTransform: 'uppercase', margin: '0 0 16px' }}>Témoignages</p>
            <h2 style={{ fontFamily: `'Cormorant Garamond', serif`, fontSize: 'clamp(32px, 5vw, 52px)', color: BLACK, margin: 0, fontWeight: 300, letterSpacing: '0.02em' }}>
              Ils nous font confiance
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 1, background: 'rgba(14,12,9,0.06)' }}>
            {TEMOIGNAGES.map((t) => (
              <div key={t.nom} style={{
                padding: '36px 32px', background: IVOIRE,
                display: 'flex', flexDirection: 'column', gap: 16,
              }}>
                <p style={{ color: BLACK, fontSize: 14, lineHeight: 1.7, margin: 0, fontStyle: 'italic', opacity: 0.8 }}>
                  "{t.texte}"
                </p>
                <div style={{ marginTop: 'auto' }}>
                  <div style={{ color: BLACK, fontWeight: 500, fontSize: 14 }}>{t.nom}</div>
                  <div style={{ color: MUTED, fontSize: 12, marginTop: 2 }}>{t.ville}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════════
          STATS · Fond blanc
          ══════════════════════════════════════════════════════════ */}
      <section style={{ background: WHITE, padding: '80px 24px', borderTop: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 40, textAlign: 'center' }}>
          {STATS.map(s => (
            <div key={s.label}>
              <div style={{ fontFamily: `'Cormorant Garamond', serif`, fontSize: 'clamp(48px, 8vw, 72px)', color: BLACK, lineHeight: 1, marginBottom: 8, fontWeight: 300 }}>{s.valeur}</div>
              <div style={{ color: MUTED, fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════════
          CTA FINAL · Luxe épuré (parcours déjà dans le hero)
          ══════════════════════════════════════════════════════════ */}
      <section style={{ background: IVOIRE, padding: '120px 24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 1, height: 60, background: GOLD, opacity: 0.25 }} />

        <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ color: GOLD, fontSize: 11, fontWeight: 500, letterSpacing: '0.25em', textTransform: 'uppercase', margin: '0 0 20px' }}>
            Votre place vous attend
          </p>
          <h2 style={{
            fontFamily: `'Cormorant Garamond', serif`,
            fontSize: 'clamp(32px, 6vw, 56px)', color: BLACK,
            margin: '0 0 16px', fontWeight: 300, lineHeight: 1.1, letterSpacing: '0.02em',
          }}>
            Prêt à commencer ?
          </h2>
          <p style={{ color: MUTED, fontSize: 16, lineHeight: 1.6, maxWidth: 480, margin: '0 auto 40px' }}>
            Un réseau bâti sur l'excellence, la confiance et la fierté de nos cultures afro.
          </p>

          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 32 }}>
            <button onClick={() => navigate('/connexion')} style={{
              padding: '14px 40px', background: BLACK, color: WHITE,
              border: 'none', borderRadius: 0, fontSize: 12,
              fontWeight: 500, cursor: 'pointer', letterSpacing: '0.12em', textTransform: 'uppercase',
            }}>
              Réserver maintenant
            </button>
            <button onClick={() => navigate('/rejoindre')} style={{
              padding: '14px 40px', background: 'transparent', color: BLACK,
              border: `1px solid ${BLACK}`, borderRadius: 0, fontSize: 12,
              fontWeight: 500, cursor: 'pointer', letterSpacing: '0.12em', textTransform: 'uppercase',
            }}>
              Devenir partenaire
            </button>
          </div>

          <div style={{ padding: '16px 24px', background: 'rgba(184,146,42,0.06)', display: 'inline-block' }}>
            <span style={{ fontSize: 13, color: BLACK, letterSpacing: '0.02em' }}>
              🔒 Places limitées par quartier — <strong>6 places restantes</strong> à Longueuil
            </span>
          </div>
        </div>
      </section>
    </div>
  )
}
