import { useState, useRef, useEffect } from 'react'
import { OR, CREME, NOIR, IVOIRE, SABLE, CARD, MUTED, BORDER_OR, formatMontant, formatDate } from '@/lib/utils'

// ─── Données simulées IA ─────────────────────────────────────
const IA_ACTIVITES = [
  { id: 1, type: 'post', platform: 'instagram', titre: 'Post Instagram — Tresses Knotless été 2026', statut: 'publié', date: '2026-04-21T09:00:00', resultat: '142 likes, 23 commentaires', icon: '📸' },
  { id: 2, type: 'reponse', platform: 'facebook', titre: 'Réponse à avis Google — ★★★★★ Mariam L.', statut: 'publié', date: '2026-04-21T08:30:00', resultat: 'Réponse personnalisée envoyée', icon: '💬' },
  { id: 3, type: 'sms', platform: 'twilio', titre: 'Rappels RDV demain — 8 clients', statut: 'envoyé', date: '2026-04-21T07:00:00', resultat: '8/8 livrés, 2 confirmations reçues', icon: '📱' },
  { id: 4, type: 'pub', platform: 'meta', titre: 'Campagne Meta — Forfait Été -20%', statut: 'actif', date: '2026-04-20T14:00:00', resultat: '2,340 impressions, 67 clics, 4.2$ CPC', icon: '📢' },
  { id: 5, type: 'post', platform: 'tiktok', titre: 'TikTok — Transformation locs en 30 sec', statut: 'programmé', date: '2026-04-22T12:00:00', resultat: 'Publication prévue demain midi', icon: '🎵' },
  { id: 6, type: 'post', platform: 'pinterest', titre: 'Pin — Catalogue coiffures mariage 2026', statut: 'publié', date: '2026-04-20T10:00:00', resultat: '89 enregistrements, 12 clics site', icon: '📌' },
  { id: 7, type: 'email', platform: 'email', titre: 'Newsletter — Nouveaux services VIP', statut: 'envoyé', date: '2026-04-19T09:00:00', resultat: '340 envois, 42% taux ouverture', icon: '✉️' },
  { id: 8, type: 'reponse', platform: 'whatsapp', titre: 'WhatsApp — 12 conversations clients', statut: 'traité', date: '2026-04-21T11:00:00', resultat: '12 réponses, 3 RDV confirmés', icon: '💬' },
]

const CALENDRIER_CONTENU = [
  { jour: 'Lun', date: '21 avr', posts: [{ platform: 'IG', titre: 'Tresses knotless', heure: '09:00', statut: 'publié' }, { platform: 'FB', titre: 'Promo abonnement', heure: '14:00', statut: 'publié' }] },
  { jour: 'Mar', date: '22 avr', posts: [{ platform: 'TK', titre: 'Transformation locs', heure: '12:00', statut: 'programmé' }, { platform: 'PIN', titre: 'Styles été', heure: '15:00', statut: 'programmé' }] },
  { jour: 'Mer', date: '23 avr', posts: [{ platform: 'IG', titre: 'Témoignage client', heure: '10:00', statut: 'brouillon' }, { platform: 'GB', titre: 'Post Google Business', heure: '11:00', statut: 'brouillon' }] },
  { jour: 'Jeu', date: '24 avr', posts: [{ platform: 'IG', titre: 'Reel avant/après', heure: '09:00', statut: 'brouillon' }, { platform: 'FB', titre: 'Astuce entretien', heure: '16:00', statut: 'brouillon' }] },
  { jour: 'Ven', date: '25 avr', posts: [{ platform: 'TK', titre: 'Journée au salon', heure: '12:00', statut: 'idée' }, { platform: 'IG', titre: 'Story vendredi', heure: '18:00', statut: 'idée' }] },
  { jour: 'Sam', date: '26 avr', posts: [{ platform: 'IG', titre: 'Weekend vibes', heure: '10:00', statut: 'idée' }] },
  { jour: 'Dim', date: '27 avr', posts: [{ platform: 'PIN', titre: 'Inspo mariage', heure: '14:00', statut: 'idée' }] },
]

const BUDGET_DATA = {
  total_semaine: 200,
  depense: 127.50,
  restant: 72.50,
  repartition: [
    { cat: 'Meta Ads', montant: 75, pct: 37.5, color: '#4267B2' },
    { cat: 'Google Ads', montant: 32.50, pct: 16.25, color: '#34A853' },
    { cat: 'Outils IA', montant: 15, pct: 7.5, color: OR },
    { cat: 'Contenu (Canva Pro)', montant: 5, pct: 2.5, color: '#7B2FF7' },
    { cat: 'Disponible', montant: 72.50, pct: 36.25, color: '#E5E5E5' },
  ],
}

const KPI = [
  { label: 'Nouveaux followers', valeur: '+47', delta: '+12%', icon: '👥', color: '#22c55e' },
  { label: 'RDV cette semaine', valeur: '23', delta: '+3', icon: '📅', color: OR },
  { label: 'Revenus semaine', valeur: '2,840 $', delta: '+8%', icon: '💰', color: '#22c55e' },
  { label: 'Messages traités', valeur: '64', delta: '100%', icon: '💬', color: '#60a5fa' },
  { label: 'Taux engagement', valeur: '4.8%', delta: '+0.6%', icon: '❤️', color: '#ef4444' },
  { label: 'Avis Google', valeur: '4.9/5', delta: '62 avis', icon: '⭐', color: '#f59e0b' },
]

const STRATEGIES_SUGGESTIONS = [
  { titre: 'Campagne Été 2026', desc: 'Lancer une promo -20% sur les forfaits été avec vidéo TikTok + Reels Instagram. Budget suggéré: 150$/sem pendant 4 semaines.', priorite: 'haute', roi_estime: '+35% RDV' },
  { titre: 'Programme Parrainage Boost', desc: 'Doubler les récompenses parrainage pendant 2 semaines pour augmenter la base client. Coût: 0$ (marge réduite temporaire).', priorite: 'moyenne', roi_estime: '+15 nouveaux clients' },
  { titre: 'Collaboration Influenceur Local', desc: 'Partenariat avec @NaturalHairMTL (12K followers) — échange service gratuit contre 3 posts + stories.', priorite: 'haute', roi_estime: '+200 followers, +8 RDV' },
  { titre: 'Google Business Optimization', desc: 'Ajouter 20 nouvelles photos, répondre à tous les avis, poster 3x/semaine sur Google Business pour monter dans les résultats locaux.', priorite: 'moyenne', roi_estime: '+25% visibilité locale' },
]

// ─── Styles helpers ──────────────────────────────────────────
const cardStyle = { background: '#fff', borderRadius: '14px', border: `1px solid rgba(14,12,9,0.06)`, overflow: 'hidden' }
const sectionTitle = { fontSize: '13px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: MUTED, marginBottom: '12px' }
const chipStyle = (color) => ({ display: 'inline-block', padding: '3px 10px', borderRadius: '99px', fontSize: '11px', fontWeight: 600, background: `${color}18`, color, whiteSpace: 'nowrap' })
const platformColor = { instagram: '#E4405F', facebook: '#4267B2', tiktok: '#010101', pinterest: '#E60023', whatsapp: '#25D366', google: '#34A853', meta: '#4267B2', twilio: '#F22F46', email: OR, gb: '#34A853' }
const platformLabel = { IG: '#E4405F', FB: '#4267B2', TK: '#010101', PIN: '#E60023', GB: '#34A853' }
const statutDot = { publié: '#22c55e', envoyé: '#22c55e', actif: '#60a5fa', programmé: '#f59e0b', traité: '#22c55e', brouillon: '#9ca3af', idée: '#d4d4d4' }

// ─── Composant principal ─────────────────────────────────────
export default function IAManager() {
  const [activeTab, setActiveTab] = useState('overview')
  const [chatMessages, setChatMessages] = useState([
    { role: 'ia', text: `Bonjour Othi 👋 Je suis ton assistante IA pour Kadio Coiffure. Je gère tes réseaux sociaux, la publicité, les réponses clients et le contenu. Qu'est-ce que tu veux qu'on travaille aujourd'hui ?` },
  ])
  const [chatInput, setChatInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const chatEndRef = useRef(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: '🏠' },
    { id: 'chat', label: 'Chat IA', icon: '🤖' },
    { id: 'contenu', label: 'Contenu', icon: '📅' },
    { id: 'budget', label: 'Budget', icon: '💰' },
    { id: 'activites', label: 'Activités', icon: '📋' },
    { id: 'strategies', label: 'Stratégies', icon: '🎯' },
  ]

  const handleSendChat = () => {
    if (!chatInput.trim()) return
    const userMsg = chatInput.trim()
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }])
    setChatInput('')
    setChatLoading(true)
    
    // Simulate IA response
    setTimeout(() => {
      let response = ''
      const lower = userMsg.toLowerCase()
      if (lower.includes('tresse') || lower.includes('knotless') || lower.includes('coiffure')) {
        response = `Bonne idée ! Pour les tresses knotless, je suggère:\n\n• Un Reel avant/après de 15 secondes pour Instagram\n• Un TikTok "Get Ready With Me" au salon\n• Un post carrousel avec 5 styles populaires\n• Un pin Pinterest avec les tarifs\n\nJe peux créer tout ce contenu cette semaine. Le meilleur moment pour poster: mardi 10h et jeudi 12h selon nos données d'engagement. Tu veux que je programme tout ça ?`
      } else if (lower.includes('promo') || lower.includes('réduction') || lower.includes('offre')) {
        response = `Pour une promo efficace, voici ma recommandation basée sur les performances passées:\n\n• -20% sur le premier RDV (convertit le mieux: 34% de conversion)\n• Forfait Été "3 pour 2" sur les tresses (excellent pour fidéliser)\n• Offre flash 48h sur Instagram Stories (crée l'urgence)\n\nBudget pub suggéré: 80$ sur Meta Ads ciblant Longueuil/Rive-Sud, femmes 18-45 ans intéressées par "natural hair". ROI estimé: 12 nouveaux RDV. On lance ?`
      } else if (lower.includes('budget') || lower.includes('argent') || lower.includes('dépense')) {
        response = `Voici le résumé budget cette semaine:\n\n• Budget total: 200$/semaine\n• Dépensé: 127.50$ (64%)\n• Meta Ads: 75$ → 67 clics, 4 RDV confirmés\n• Google Ads: 32.50$ → 23 clics, 2 RDV\n• Outils: 20$ (Canva Pro + scheduling)\n• Restant: 72.50$\n\nJe recommande d'utiliser le restant sur une campagne Meta "Lookalike" basée sur tes meilleurs clients. Ça devrait générer 5-8 RDV supplémentaires.`
      } else if (lower.includes('concurrent') || lower.includes('compétition')) {
        response = `J'ai analysé les 5 salons afro principaux dans la région Longueuil/Rive-Sud:\n\n1. Afro Style Salon — Fort en Instagram (2.3K followers), prix similaires\n2. Natural Queens — Nouveau, agressif en pub Meta\n3. Tresses & Cie — Bonne réputation Google (4.7/5, 89 avis)\n\nNotre avantage: meilleur rating Google (4.9/5), plus de services VIP, et le programme partenaire unique. Je suggère de renforcer notre présence TikTok (le moins compétitif) et d'augmenter nos avis Google pour creuser l'écart.`
      } else {
        response = `Bien reçu ! Je prends note de ta demande. Voici ce que je peux faire:\n\n• Créer du contenu sur mesure pour toutes tes plateformes\n• Analyser les performances et ajuster la stratégie\n• Gérer les réponses clients automatiquement\n• Lancer et optimiser des campagnes publicitaires\n• Proposer des stratégies de croissance\n\nDis-moi plus précisément ce que tu as en tête et je m'en occupe ! 💪`
      }
      setChatMessages(prev => [...prev, { role: 'ia', text: response }])
      setChatLoading(false)
    }, 1500)
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* ── Header ── */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: `linear-gradient(135deg, ${OR}, #D4A82A)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>🤖</div>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 700, margin: 0, fontFamily: `'Cormorant Garamond', serif`, letterSpacing: '0.02em' }}>Kadio IA Manager</h1>
            <p style={{ fontSize: '12px', color: MUTED, margin: 0 }}>Gestion automatisée par intelligence artificielle</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
          <span style={chipStyle('#22c55e')}>● IA Active</span>
          <span style={{ fontSize: '11px', color: MUTED }}>Dernière action: il y a 12 min</span>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', overflowX: 'auto', paddingBottom: '4px' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            style={{
              padding: '8px 14px', borderRadius: '10px', border: 'none', cursor: 'pointer',
              fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap', transition: 'all 0.15s',
              background: activeTab === t.id ? NOIR : 'rgba(14,12,9,0.04)',
              color: activeTab === t.id ? '#fff' : NOIR,
            }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* ── TAB: Vue d'ensemble ── */}
      {activeTab === 'overview' && (
        <div>
          {/* KPIs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px', marginBottom: '24px' }}>
            {KPI.map(k => (
              <div key={k.label} style={{ ...cardStyle, padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '20px' }}>{k.icon}</span>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: k.color }}>{k.delta}</span>
                </div>
                <div style={{ fontSize: '22px', fontWeight: 700 }}>{k.valeur}</div>
                <div style={{ fontSize: '11px', color: MUTED, marginTop: '2px' }}>{k.label}</div>
              </div>
            ))}
          </div>

          {/* Activités récentes + Chat rapide */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="ia-overview-grid">
            {/* Dernières activités */}
            <div style={cardStyle}>
              <div style={{ padding: '16px 18px 12px', borderBottom: '1px solid rgba(14,12,9,0.06)' }}>
                <div style={sectionTitle}>Dernières actions IA</div>
              </div>
              <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
                {IA_ACTIVITES.slice(0, 5).map(a => (
                  <div key={a.id} style={{ padding: '12px 18px', borderBottom: '1px solid rgba(14,12,9,0.04)', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '18px', flexShrink: 0, marginTop: '2px' }}>{a.icon}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '2px' }}>{a.titre}</div>
                      <div style={{ fontSize: '11px', color: MUTED }}>{a.resultat}</div>
                    </div>
                    <span style={chipStyle(statutDot[a.statut] || '#9ca3af')}>{a.statut}</span>
                  </div>
                ))}
              </div>
              <div style={{ padding: '10px 18px', borderTop: '1px solid rgba(14,12,9,0.06)' }}>
                <button onClick={() => setActiveTab('activites')} style={{ background: 'none', border: 'none', color: OR, fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>Voir toutes les activités →</button>
              </div>
            </div>

            {/* Stratégies suggérées */}
            <div style={cardStyle}>
              <div style={{ padding: '16px 18px 12px', borderBottom: '1px solid rgba(14,12,9,0.06)' }}>
                <div style={sectionTitle}>Stratégies proposées par l'IA</div>
              </div>
              <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
                {STRATEGIES_SUGGESTIONS.slice(0, 3).map((s, i) => (
                  <div key={i} style={{ padding: '12px 18px', borderBottom: '1px solid rgba(14,12,9,0.04)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 600 }}>{s.titre}</span>
                      <span style={chipStyle(s.priorite === 'haute' ? '#ef4444' : '#f59e0b')}>{s.priorite}</span>
                    </div>
                    <div style={{ fontSize: '12px', color: MUTED, marginBottom: '6px', lineHeight: '1.4' }}>{s.desc.slice(0, 100)}...</div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 600, color: '#22c55e' }}>ROI: {s.roi_estime}</span>
                      <button style={{ background: NOIR, color: '#fff', border: 'none', padding: '4px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>Approuver</button>
                      <button style={{ background: 'rgba(14,12,9,0.06)', color: NOIR, border: 'none', padding: '4px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>Modifier</button>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ padding: '10px 18px', borderTop: '1px solid rgba(14,12,9,0.06)' }}>
                <button onClick={() => setActiveTab('strategies')} style={{ background: 'none', border: 'none', color: OR, fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>Voir toutes les stratégies →</button>
              </div>
            </div>
          </div>

          {/* Budget résumé */}
          <div style={{ ...cardStyle, padding: '18px', marginTop: '16px' }}>
            <div style={sectionTitle}>Budget semaine — {BUDGET_DATA.depense}$ / {BUDGET_DATA.total_semaine}$</div>
            <div style={{ height: '16px', borderRadius: '99px', background: '#f0f0f0', overflow: 'hidden', display: 'flex' }}>
              {BUDGET_DATA.repartition.filter(r => r.cat !== 'Disponible').map((r, i) => (
                <div key={i} style={{ width: `${r.pct}%`, height: '100%', background: r.color }} title={`${r.cat}: ${r.montant}$`} />
              ))}
            </div>
            <div style={{ display: 'flex', gap: '16px', marginTop: '10px', flexWrap: 'wrap' }}>
              {BUDGET_DATA.repartition.map((r, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: r.color }} />
                  <span style={{ color: MUTED }}>{r.cat}</span>
                  <span style={{ fontWeight: 600 }}>{r.montant}$</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB: Chat IA ── */}
      {activeTab === 'chat' && (
        <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column', height: 'calc(100vh - 220px)', minHeight: '400px' }}>
          <div style={{ padding: '16px 18px', borderBottom: '1px solid rgba(14,12,9,0.06)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: `linear-gradient(135deg, ${OR}, #D4A82A)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>🤖</div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700 }}>Assistant IA Kadio</div>
              <div style={{ fontSize: '11px', color: '#22c55e' }}>● En ligne — Spécialiste coiffure afro & marketing</div>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {chatMessages.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', gap: '8px' }}>
                {m.role === 'ia' && <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: `linear-gradient(135deg, ${OR}, #D4A82A)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0 }}>🤖</div>}
                <div style={{
                  maxWidth: '80%', padding: '12px 16px', borderRadius: '14px',
                  background: m.role === 'user' ? NOIR : IVOIRE,
                  color: m.role === 'user' ? '#fff' : NOIR,
                  fontSize: '13px', lineHeight: '1.55', whiteSpace: 'pre-line',
                }}>
                  {m.text}
                </div>
              </div>
            ))}
            {chatLoading && (
              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: `linear-gradient(135deg, ${OR}, #D4A82A)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0 }}>🤖</div>
                <div style={{ padding: '12px 16px', borderRadius: '14px', background: IVOIRE, fontSize: '13px', color: MUTED }}>
                  <span style={{ animation: 'pulse 1s infinite' }}>Réflexion en cours...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick prompts */}
          <div style={{ padding: '8px 18px 0', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {['Idées posts cette semaine', 'Lancer une promo', 'Analyse concurrents', 'Résumé budget'].map(q => (
              <button key={q} onClick={() => { setChatInput(q); }}
                style={{ padding: '6px 12px', borderRadius: '99px', border: `1px solid rgba(14,12,9,0.1)`, background: '#fff', fontSize: '11px', fontWeight: 500, cursor: 'pointer', color: NOIR, transition: 'all 0.15s' }}>
                {q}
              </button>
            ))}
          </div>

          {/* Input */}
          <div style={{ padding: '12px 18px 16px', display: 'flex', gap: '8px' }}>
            <input
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSendChat()}
              placeholder="Discute stratégie, demande du contenu, pose des questions..."
              style={{ flex: 1, padding: '12px 16px', borderRadius: '12px', border: `1px solid rgba(14,12,9,0.1)`, fontSize: '13px', outline: 'none', fontFamily: 'inherit', background: IVOIRE }}
            />
            <button onClick={handleSendChat}
              style={{ padding: '12px 20px', borderRadius: '12px', border: 'none', background: NOIR, color: '#fff', fontSize: '13px', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
              Envoyer
            </button>
          </div>
        </div>
      )}

      {/* ── TAB: Contenu (Calendrier) ── */}
      {activeTab === 'contenu' && (
        <div>
          <div style={sectionTitle}>Calendrier éditorial — Semaine du 21 avril</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '10px' }}>
            {CALENDRIER_CONTENU.map(j => (
              <div key={j.jour} style={{ ...cardStyle, padding: '14px' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '2px' }}>{j.jour}</div>
                <div style={{ fontSize: '11px', color: MUTED, marginBottom: '10px' }}>{j.date}</div>
                {j.posts.map((p, i) => (
                  <div key={i} style={{ padding: '8px 10px', borderRadius: '8px', background: IVOIRE, marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '10px', fontWeight: 700, color: platformLabel[p.platform] || NOIR, background: `${platformLabel[p.platform] || NOIR}15`, padding: '1px 6px', borderRadius: '4px' }}>{p.platform}</span>
                      <span style={{ fontSize: '10px', color: MUTED }}>{p.heure}</span>
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: 500 }}>{p.titre}</div>
                    <div style={{ marginTop: '4px' }}>
                      <span style={{ ...chipStyle(statutDot[p.statut] || '#9ca3af'), fontSize: '10px', padding: '2px 7px' }}>{p.statut}</span>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Plateformes connectées */}
          <div style={{ ...cardStyle, padding: '18px', marginTop: '20px' }}>
            <div style={sectionTitle}>Plateformes connectées</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
              {[
                { nom: 'Instagram', icon: '📸', statut: 'À connecter', color: '#E4405F', desc: '@kadiocoiffure' },
                { nom: 'Facebook', icon: '👤', statut: 'À connecter', color: '#4267B2', desc: 'Kadio Coiffure' },
                { nom: 'TikTok', icon: '🎵', statut: 'À connecter', color: '#010101', desc: '@kadiocoiffure' },
                { nom: 'Pinterest', icon: '📌', statut: 'À connecter', color: '#E60023', desc: 'Kadio Coiffure' },
                { nom: 'Google Business', icon: '🏪', statut: 'À connecter', color: '#34A853', desc: 'Kadio Coiffure Longueuil' },
                { nom: 'WhatsApp', icon: '💬', statut: 'Actif', color: '#25D366', desc: 'Via Twilio' },
                { nom: 'SMS', icon: '📱', statut: 'Actif', color: '#F22F46', desc: 'Via Twilio' },
              ].map(p => (
                <div key={p.nom} style={{ padding: '12px', borderRadius: '10px', background: IVOIRE, display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '22px' }}>{p.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 600 }}>{p.nom}</div>
                    <div style={{ fontSize: '11px', color: MUTED }}>{p.desc}</div>
                  </div>
                  <span style={chipStyle(p.statut === 'Actif' ? '#22c55e' : '#f59e0b')}>{p.statut}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB: Budget ── */}
      {activeTab === 'budget' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '20px' }} className="ia-budget-grid">
            <div style={{ ...cardStyle, padding: '18px', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: MUTED, marginBottom: '4px' }}>Budget hebdomadaire</div>
              <div style={{ fontSize: '28px', fontWeight: 700 }}>{BUDGET_DATA.total_semaine}$</div>
            </div>
            <div style={{ ...cardStyle, padding: '18px', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: MUTED, marginBottom: '4px' }}>Dépensé</div>
              <div style={{ fontSize: '28px', fontWeight: 700, color: OR }}>{BUDGET_DATA.depense}$</div>
              <div style={{ fontSize: '11px', color: MUTED }}>{((BUDGET_DATA.depense / BUDGET_DATA.total_semaine) * 100).toFixed(0)}% utilisé</div>
            </div>
            <div style={{ ...cardStyle, padding: '18px', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: MUTED, marginBottom: '4px' }}>Restant</div>
              <div style={{ fontSize: '28px', fontWeight: 700, color: '#22c55e' }}>{BUDGET_DATA.restant}$</div>
            </div>
          </div>

          <div style={cardStyle}>
            <div style={{ padding: '16px 18px 12px' }}>
              <div style={sectionTitle}>Détail des dépenses</div>
            </div>
            {BUDGET_DATA.repartition.filter(r => r.cat !== 'Disponible').map((r, i) => (
              <div key={i} style={{ padding: '12px 18px', borderBottom: '1px solid rgba(14,12,9,0.04)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: r.color }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: 600 }}>{r.cat}</div>
                </div>
                <div style={{ fontSize: '14px', fontWeight: 700 }}>{r.montant}$</div>
                <div style={{ width: '100px', height: '6px', borderRadius: '99px', background: '#f0f0f0', overflow: 'hidden' }}>
                  <div style={{ height: '100%', borderRadius: '99px', background: r.color, width: `${(r.montant / BUDGET_DATA.total_semaine) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div style={{ ...cardStyle, padding: '18px', marginTop: '16px' }}>
            <div style={sectionTitle}>Recommandation IA</div>
            <div style={{ fontSize: '13px', lineHeight: '1.6', color: NOIR }}>
              <strong>Cette semaine:</strong> Le budget Meta Ads a le meilleur ROI (4 RDV pour 75$, soit 18.75$/RDV). Je recommande d'allouer les 72.50$ restants à une campagne "Lookalike Audience" ciblant des profils similaires à tes meilleures clientes. Estimation: 5-8 RDV supplémentaires.
            </div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
              <button style={{ background: NOIR, color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>Approuver</button>
              <button onClick={() => setActiveTab('chat')} style={{ background: 'rgba(14,12,9,0.06)', color: NOIR, border: 'none', padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>Discuter avec l'IA</button>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB: Activités ── */}
      {activeTab === 'activites' && (
        <div style={cardStyle}>
          <div style={{ padding: '16px 18px 12px' }}>
            <div style={sectionTitle}>Historique complet des actions IA</div>
          </div>
          {IA_ACTIVITES.map(a => (
            <div key={a.id} style={{ padding: '14px 18px', borderBottom: '1px solid rgba(14,12,9,0.04)', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '22px', flexShrink: 0 }}>{a.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '2px' }}>{a.titre}</div>
                <div style={{ fontSize: '12px', color: MUTED, marginBottom: '4px' }}>{a.resultat}</div>
                <div style={{ fontSize: '11px', color: MUTED }}>{new Date(a.date).toLocaleString('fr-CA', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                <span style={chipStyle(statutDot[a.statut] || '#9ca3af')}>{a.statut}</span>
                <span style={{ fontSize: '10px', color: platformColor[a.platform] || MUTED, fontWeight: 600, textTransform: 'uppercase' }}>{a.platform}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── TAB: Stratégies ── */}
      {activeTab === 'strategies' && (
        <div>
          <div style={sectionTitle}>Stratégies proposées par l'IA</div>
          {STRATEGIES_SUGGESTIONS.map((s, i) => (
            <div key={i} style={{ ...cardStyle, padding: '18px', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <span style={{ fontSize: '20px' }}>🎯</span>
                <span style={{ fontSize: '16px', fontWeight: 700 }}>{s.titre}</span>
                <span style={chipStyle(s.priorite === 'haute' ? '#ef4444' : '#f59e0b')}>Priorité {s.priorite}</span>
              </div>
              <div style={{ fontSize: '13px', color: NOIR, lineHeight: '1.6', marginBottom: '12px', paddingLeft: '30px' }}>{s.desc}</div>
              <div style={{ paddingLeft: '30px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#22c55e' }}>ROI estimé: {s.roi_estime}</span>
                <button style={{ background: NOIR, color: '#fff', border: 'none', padding: '8px 18px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>Approuver & Lancer</button>
                <button onClick={() => setActiveTab('chat')} style={{ background: 'rgba(14,12,9,0.06)', color: NOIR, border: 'none', padding: '8px 18px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>En discuter</button>
                <button style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>Refuser</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Responsive grid styles */}
      <style>{`
        @media (max-width: 768px) {
          .ia-overview-grid { grid-template-columns: 1fr !important; }
          .ia-budget-grid { grid-template-columns: 1fr !important; }
        }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>
    </div>
  )
}
