import { useNavigate } from 'react-router-dom'
import { OR, CREME, NOIR, CARD } from '@/lib/utils'

const MUTED = 'rgba(14,12,9,0.5)'
const GREEN = '#2D5A27'
const GREEN_LIGHT = '#4A7C59'

const PROTOCOLES = [
  {
    nom: 'Bain d\'huiles chaudes',
    ingredients: ['Ricin', 'Coco', 'Argan', 'Jojoba'],
    duration: '45 min',
    price: '$45–65',
    icon: '🫙',
    desc: 'Mélange riche d\'huiles naturelles pour nourrir en profondeur'
  },
  {
    nom: 'Masque protéiné végétal',
    ingredients: ['Spiruline', 'Henné neutre', 'Avocat'],
    duration: '50 min',
    price: '$55–75',
    icon: '🥑',
    desc: 'Protéine naturelle pour renforcer et fortifier'
  },
  {
    nom: 'Détox capillaire',
    ingredients: ['Argile verte', 'Vinaigre de cidre', 'Romarin'],
    duration: '40 min',
    price: '$45–60',
    icon: '🌿',
    desc: 'Purifie et élimine les résidus chimiques accumulés'
  },
  {
    nom: 'Soin anti-casse',
    ingredients: ['Kératine végétale', 'Aloe vera', 'Beurre de karité'],
    duration: '50 min',
    price: '$55–75',
    icon: '✨',
    desc: 'Renforce et prévient la casse pour des cheveux sains'
  },
  {
    nom: 'Hydratation profonde',
    ingredients: ['Glycérine végétale', 'Miel', 'Huile d\'olive'],
    duration: '45 min',
    price: '$50–70',
    icon: '💧',
    desc: 'Réhydrate et restaure l\'élasticité naturelle'
  },
  {
    nom: 'Stimulation pousse',
    ingredients: ['Huile de moutarde', 'Ortie', 'Fenugrec'],
    duration: '60 min',
    price: '$65–85',
    icon: '🌱',
    desc: 'Stimule la croissance et la vitalité du cuir chevelu'
  }
]

const INGREDIENTS = [
  { nom: 'Huile de ricin', benefit: 'Nourrit en profondeur et renforce', icon: '🫙' },
  { nom: 'Beurre de karité', benefit: 'Hydrate et protège la fibre capillaire', icon: '✨' },
  { nom: 'Huile d\'argan', benefit: 'Lisse et donne de la brillance', icon: '✨' },
  { nom: 'Aloe vera', benefit: 'Apaise le cuir chevelu irrité', icon: '💚' },
  { nom: 'Romarin', benefit: 'Stimule la circulation et la pousse', icon: '🌿' },
  { nom: 'Henné', benefit: 'Colore naturellement sans chimie', icon: '🍃' },
  { nom: 'Spiruline', benefit: 'Riche en protéines et minéraux', icon: '💙' },
  { nom: 'Huile de coco', benefit: 'Légère, hydratante et délicieuse au parfum', icon: '🥥' },
  { nom: 'Miel', benefit: 'Hydrate et apaise les inflammations', icon: '🍯' },
  { nom: 'Huile d\'olive', benefit: 'Antioxydante et régénérante', icon: '🫒' },
]

export default function KadioVegetal() {
  const navigate = useNavigate()

  return (
    <div style={{ background: CREME, color: NOIR, fontFamily: `'DM Sans', sans-serif`, paddingBottom: 80 }}>

      {/* ── Hero ── */}
      <section style={{
        minHeight: '70vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', textAlign: 'center',
        padding: '80px 24px 60px',
        background: `radial-gradient(ellipse at 50% 30%, rgba(45,90,39,0.12) 0%, transparent 65%)`,
      }}>
        <div style={{ fontSize: 13, color: GREEN, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 16 }}>
          Protocole naturel
        </div>
        <h1 style={{ fontFamily: `'Bebas Neue', sans-serif`, fontSize: 'clamp(42px, 8vw, 80px)', color: GREEN, margin: '0 0 16px', lineHeight: 0.95 }}>
          Kadio Végétal
        </h1>
        <p style={{ fontSize: 'clamp(16px, 2.5vw, 20px)', color: NOIR, maxWidth: 560, lineHeight: 1.55, marginBottom: 12 }}>
          Soins cheveux 100% naturels et bio-sourcés pour une beauté respectueuse de votre nature
        </p>
        <p style={{ fontSize: 14, color: MUTED, maxWidth: 480, lineHeight: 1.6, marginBottom: 40 }}>
          Zéro produit chimique. Zéro silicones. Zéro appauvrissement. Que la puissance de la nature pour sublimer vos cheveux.
        </p>
        <button
          onClick={() => navigate('/connexion')}
          style={{ padding: '16px 40px', background: GREEN, color: CREME, border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer', letterSpacing: 0.5 }}>
          Réserver mon soin →
        </button>
      </section>

      {/* ── Philosophie ── */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '70px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ color: GREEN, fontSize: 12, fontWeight: 600, letterSpacing: '0.2em', marginBottom: 12 }}>NOTRE PHILOSOPHIE</div>
          <h2 style={{ fontFamily: `'Bebas Neue', sans-serif`, fontSize: 'clamp(28px, 5vw, 44px)', color: NOIR, margin: 0 }}>
            Pourquoi choisir le naturel
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
          {[
            { icon: '🌿', title: 'Aucune chimie agressive', desc: 'Pas de sulfates, parabènes ni silicones qui appauvrissent' },
            { icon: '🧠', title: 'Cuir chevelu sain', desc: 'Formules douces qui respectent le pH naturel' },
            { icon: '✨', title: 'Texture naturelle célébrée', desc: 'Renforce vos boucles et votre ondulation native' },
            { icon: '🌍', title: 'Impact écologique réduit', desc: 'Ingrédients bio et emballage éco-responsable' },
            { icon: '💚', title: 'Résultats durables', desc: 'Des cheveux plus forts, brillants et sains à long terme' },
            { icon: '🪴', title: 'Tradition et science', desc: 'Recettes ancestrales revisitées par la science moderne' },
          ].map(item => (
            <div key={item.title} style={{ background: CARD, borderRadius: 14, padding: '24px', border: `1px solid rgba(45,90,39,0.12)`, textAlign: 'center' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>{item.icon}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: GREEN, marginBottom: 8 }}>{item.title}</div>
              <div style={{ fontSize: 13, color: MUTED, lineHeight: 1.5 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Protocoles ── */}
      <section style={{ background: CARD, padding: '70px 24px', borderTop: `1px solid rgba(45,90,39,0.12)`, borderBottom: `1px solid rgba(45,90,39,0.12)` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ color: GREEN, fontSize: 12, fontWeight: 600, letterSpacing: '0.2em', marginBottom: 12 }}>NOS SOINS</div>
            <h2 style={{ fontFamily: `'Bebas Neue', sans-serif`, fontSize: 'clamp(28px, 5vw, 44px)', color: NOIR, margin: 0 }}>
              Nos protocoles naturels
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
            {PROTOCOLES.map(p => (
              <div key={p.nom} style={{ background: CREME, borderRadius: 14, padding: '24px', border: `1px solid rgba(45,90,39,0.1)`, display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>{p.icon}</div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: GREEN, marginBottom: 8 }}>{p.nom}</h3>
                <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.5, marginBottom: 16 }}>{p.desc}</p>
                <div style={{ fontSize: 12, color: NOIR, marginBottom: 12 }}>
                  <div style={{ fontWeight: 600, marginBottom: 6 }}>Ingrédients:</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {p.ingredients.map(ing => (
                      <span key={ing} style={{ background: 'rgba(45,90,39,0.08)', color: GREEN, padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 500 }}>
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>
                <div style={{ fontSize: 12, color: MUTED, marginBottom: 12, borderTop: `1px solid rgba(45,90,39,0.1)`, paddingTop: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>⏱ {p.duration}</span>
                    <span style={{ fontWeight: 600, color: GREEN }}>{p.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Ingrédients vedettes ── */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '70px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ color: GREEN, fontSize: 12, fontWeight: 600, letterSpacing: '0.2em', marginBottom: 12 }}>NOTRE ARSENAL</div>
          <h2 style={{ fontFamily: `'Bebas Neue', sans-serif`, fontSize: 'clamp(28px, 5vw, 44px)', color: NOIR, margin: 0 }}>
            Les ingrédients vedettes
          </h2>
          <p style={{ fontSize: 14, color: MUTED, marginTop: 16, maxWidth: 600, margin: '16px auto 0' }}>
            Chaque ingrédient sélectionné pour ses propriétés exceptionnelles et son respect de votre bien-être.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
          {INGREDIENTS.map(ing => (
            <div key={ing.nom} style={{ background: 'rgba(45,90,39,0.04)', borderRadius: 12, padding: '20px 16px', border: `1px solid rgba(45,90,39,0.1)`, textAlign: 'center' }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>{ing.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: GREEN, marginBottom: 6 }}>{ing.nom}</div>
              <div style={{ fontSize: 12, color: MUTED, lineHeight: 1.4 }}>{ing.benefit}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Résultats & Temoignages ── */}
      <section style={{ background: CARD, padding: '70px 24px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ color: GREEN, fontSize: 12, fontWeight: 600, letterSpacing: '0.2em', marginBottom: 12 }}>CE QUE NOS CLIENTES DISENT</div>
            <h2 style={{ fontFamily: `'Bebas Neue', sans-serif`, fontSize: 'clamp(28px, 5vw, 44px)', color: NOIR, margin: 0 }}>
              Transformation visible
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {[
              { stat: '92%', label: 'Satisfaction client', detail: 'Après un protocole Kadio Végétal' },
              { stat: '3.2×', label: 'Plus de brillance', detail: 'Mesurée après 4 semaines régulières' },
              { stat: '75%', label: 'Moins de casse', detail: 'Résultats sur 3 mois de suivi' },
              { stat: '4.8★', label: 'Note moyenne', detail: 'Sur la base de 200+ avis clients' },
            ].map(item => (
              <div key={item.stat} style={{ background: CREME, borderRadius: 14, padding: '24px', border: `1px solid rgba(45,90,39,0.08)`, textAlign: 'center' }}>
                <div style={{ fontSize: 'clamp(28px, 5vw, 40px)', fontWeight: 800, color: GREEN, marginBottom: 8 }}>
                  {item.stat}
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: NOIR, marginBottom: 6 }}>{item.label}</div>
                <div style={{ fontSize: 12, color: MUTED }}>{item.detail}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 40, padding: '28px', background: 'rgba(45,90,39,0.06)', borderRadius: 14, borderLeft: `4px solid ${GREEN}` }}>
            <p style={{ fontSize: 14, color: NOIR, lineHeight: 1.7, margin: 0, fontStyle: 'italic' }}>
              "Après des années à utiliser des produits chimiques, j'ai découvert Kadio Végétal. Mes cheveux ont retrouvé leur souplesse naturelle, et j'adore savoir que je ne mets rien de toxique dedans. Ma texture de boucles a complètement changé — c'est incroyable."
            </p>
            <p style={{ fontSize: 12, color: MUTED, marginTop: 12, margin: '12px 0 0 0' }}>— Aïssatou B., Longueuil</p>
          </div>
        </div>
      </section>

      {/* ── CTA final ── */}
      <section style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center', padding: '70px 24px' }}>
        <h2 style={{ fontFamily: `'Bebas Neue', sans-serif`, fontSize: 'clamp(28px, 5vw, 44px)', color: NOIR, margin: '0 0 16px' }}>
          Prêt(e) à découvrir Kadio Végétal?
        </h2>
        <p style={{ color: MUTED, fontSize: 15, marginBottom: 32, maxWidth: 600, margin: '0 auto 32px' }}>
          Consultez nos spécialistes en ligne ou en salon pour trouver le protocole idéal pour votre type de cheveux.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/connexion')}
            style={{ padding: '16px 40px', background: GREEN, color: CREME, border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer', letterSpacing: 0.5 }}>
            Réserver un soin →
          </button>
          <button
            onClick={() => navigate('/candidature')}
            style={{ padding: '16px 40px', background: 'transparent', color: GREEN, border: `2px solid ${GREEN}`, borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer', letterSpacing: 0.5 }}>
            Nous rejoindre
          </button>
        </div>
      </section>

    </div>
  )
}
