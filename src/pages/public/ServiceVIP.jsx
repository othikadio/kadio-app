import { useNavigate } from 'react-router-dom'
import { OR, CREME, NOIR, CARD } from '@/lib/utils'

const MUTED = 'rgba(14,12,9,0.5)'

const BOISSONS = [
  { nom: 'Eau infusée menthe-citron', desc: 'Fraîche, préparée à la demande', icon: '🫙' },
  { nom: 'Jus de bissap maison', desc: 'Fleur d\'hibiscus — recette de famille', icon: '🌺' },
  { nom: 'Ginger shot', desc: 'Gingembre frais pressé', icon: '🫚' },
  { nom: 'Tisane bien-être', desc: 'Rooibos, camomille, lavande', icon: '🍵' },
  { nom: 'Eau pétillante premium', icon: '✨', desc: 'Perrier ou San Pellegrino' },
  { nom: 'Smoothie tropical', desc: 'Mangue, ananas, lait de coco', icon: '🥭' },
  { nom: 'Café grain d\'or', desc: 'Espresso ou allongé, moka éthiopien', icon: '☕' },
  { nom: 'Chocolat chaud artisanal', desc: 'Cacao 70% — hiver uniquement', icon: '🍫' },
  { nom: 'Mocktail Kadio', desc: 'Notre signature — surprise du chef', icon: '🥂' },
]

const ENGAGEMENTS = [
  { icon: '🕐', titre: 'Ponctualité garantie', desc: 'Votre coiffeur arrive à l\'heure, ou vous recevez 10 $ de crédit.' },
  { icon: '🌿', titre: 'Produits 100% naturels', desc: 'Aucun produit chimique agressif. Certifié vegan et cruelty-free.' },
  { icon: '🤫', titre: 'Espace intimiste', desc: 'Musique douce, lumières tamisées. Votre moment rien qu\'à vous.' },
  { icon: '📱', titre: 'SMS de rappel', desc: '48h et 2h avant le RDV — plus jamais de rendez-vous oublié.' },
  { icon: '🔄', titre: 'Retouche gratuite', desc: 'Pas satisfait(e) ? On revient corriger gratuitement sous 7 jours.' },
  { icon: '🔒', titre: 'Paiement sécurisé', desc: 'Dépôt Square chiffré. Jamais de surprise sur votre facture.' },
]

export default function ServiceVIP() {
  const navigate = useNavigate()

  return (
    <div style={{ background: CREME, color: NOIR, fontFamily: `'DM Sans', sans-serif`, paddingBottom: 80 }}>

      {/* ── Hero ── */}
      <section style={{
        minHeight: '70vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', textAlign: 'center',
        padding: '80px 24px 60px',
        background: `radial-gradient(ellipse at 50% 30%, rgba(184,146,42,0.12) 0%, transparent 65%)`,
      }}>
        <div style={{ fontSize: 13, color: OR, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 16 }}>
          Expérience Kadio
        </div>
        <h1 style={{ fontFamily: `'Bebas Neue', sans-serif`, fontSize: 'clamp(42px, 8vw, 80px)', color: OR, margin: '0 0 16px', lineHeight: 0.95 }}>
          Service VIP
        </h1>
        <p style={{ fontSize: 'clamp(16px, 2.5vw, 20px)', color: NOIR, maxWidth: 560, lineHeight: 1.55, marginBottom: 12 }}>
          Parce que vous méritez plus qu'une coupe. Vous méritez un moment.
        </p>
        <p style={{ fontSize: 14, color: MUTED, maxWidth: 480, lineHeight: 1.6, marginBottom: 40 }}>
          Chaque RDV inclut une boisson de votre choix, une ambiance soignée, et un coiffeur certifié qui prend le temps de vous écouter.
        </p>
        <button
          onClick={() => navigate('/connexion')}
          style={{ padding: '16px 40px', background: OR, color: NOIR, border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer', letterSpacing: 0.5 }}>
          Réserver mon expérience →
        </button>
      </section>

      {/* ── Boissons ── */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '70px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ color: OR, fontSize: 12, fontWeight: 600, letterSpacing: '0.2em', marginBottom: 12 }}>INCLUS DANS CHAQUE RDV</div>
          <h2 style={{ fontFamily: `'Bebas Neue', sans-serif`, fontSize: 'clamp(28px, 5vw, 44px)', color: NOIR, margin: 0 }}>
            Votre boisson offerte
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
          {BOISSONS.map(b => (
            <div key={b.nom} style={{ background: CARD, borderRadius: 14, padding: '20px 18px', border: `1px solid rgba(184,146,42,0.12)`, display: 'flex', alignItems: 'flex-start', gap: 14 }}>
              <span style={{ fontSize: 28, flexShrink: 0 }}>{b.icon}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: NOIR, marginBottom: 4 }}>{b.nom}</div>
                <div style={{ fontSize: 12, color: MUTED, lineHeight: 1.4 }}>{b.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Ambiance ── */}
      <section style={{ background: CARD, padding: '70px 24px', borderTop: `1px solid rgba(184,146,42,0.12)`, borderBottom: `1px solid rgba(184,146,42,0.12)` }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ color: OR, fontSize: 12, fontWeight: 600, letterSpacing: '0.2em', marginBottom: 12 }}>AMBIANCE</div>
          <h2 style={{ fontFamily: `'Bebas Neue', sans-serif`, fontSize: 'clamp(28px, 5vw, 44px)', color: NOIR, margin: '0 0 24px' }}>
            Un espace pensé pour vous
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            {[
              { icon: '🎵', label: 'Playlist afro-soul curatée', detail: 'Aucune publicité, que de la musique' },
              { icon: '💡', label: 'Lumières ajustables', detail: 'Ambiente douce ou vive selon le service' },
              { icon: '🌡️', label: 'Température confortable', detail: 'Chauffage / clim selon la saison' },
              { icon: '📵', label: 'Zone de déconnexion', detail: 'Votre heure à vous — 100% sans stress' },
            ].map(a => (
              <div key={a.label} style={{ background: CREME, borderRadius: 12, padding: '18px', border: `1px solid rgba(184,146,42,0.08)` }}>
                <div style={{ fontSize: 26, marginBottom: 10 }}>{a.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: NOIR, marginBottom: 4 }}>{a.label}</div>
                <div style={{ fontSize: 12, color: MUTED }}>{a.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Engagements ── */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '70px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ color: OR, fontSize: 12, fontWeight: 600, letterSpacing: '0.2em', marginBottom: 12 }}>NOS PROMESSES</div>
          <h2 style={{ fontFamily: `'Bebas Neue', sans-serif`, fontSize: 'clamp(28px, 5vw, 44px)', color: NOIR, margin: 0 }}>
            6 engagements Kadio
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          {ENGAGEMENTS.map(e => (
            <div key={e.titre} style={{ background: CARD, borderRadius: 14, padding: '22px 20px', border: `1px solid rgba(14,12,9,0.08)`, display: 'flex', gap: 16 }}>
              <span style={{ fontSize: 28, flexShrink: 0 }}>{e.icon}</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: OR, marginBottom: 6 }}>{e.titre}</div>
                <div style={{ fontSize: 13, color: MUTED, lineHeight: 1.5 }}>{e.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA final ── */}
      <section style={{ textAlign: 'center', padding: '40px 24px 20px' }}>
        <h2 style={{ fontFamily: `'Bebas Neue', sans-serif`, fontSize: 'clamp(28px, 5vw, 44px)', color: NOIR, margin: '0 0 16px' }}>
          Vous le méritez.
        </h2>
        <p style={{ color: MUTED, fontSize: 15, marginBottom: 28 }}>Réservez en 60 secondes. Annulation gratuite jusqu'à 24h avant.</p>
        <button
          onClick={() => navigate('/connexion')}
          style={{ padding: '16px 44px', background: OR, color: NOIR, border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
          Prendre rendez-vous →
        </button>
      </section>
    </div>
  )
}
