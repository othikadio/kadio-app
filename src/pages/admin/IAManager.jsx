import { useState, useRef, useEffect, useCallback } from 'react'
import { OR, CREME, NOIR, IVOIRE, SABLE, CARD, MUTED, BORDER_OR, formatMontant, formatDate } from '@/lib/utils'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

// ─── Configuration ──────────────────────────────────────────
const EDGE_FN_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ia-assistant`

// ─── Agents spécialisés ─────────────────────────────────────
const AGENTS = [
  { id: 'directrice', nom: 'KADIO IA', role: 'Directrice Générale', icon: '👑', color: OR, desc: 'Supervise tout, prend les décisions stratégiques', status: 'active' },
  { id: 'marketing', nom: 'Agent Marketing', role: 'Marketing & Réseaux', icon: '📣', color: '#E4405F', desc: 'Instagram, TikTok, Facebook, Pinterest, Google', status: 'active' },
  { id: 'clients', nom: 'Agent Clients', role: 'Service Client', icon: '💬', color: '#25D366', desc: 'WhatsApp, SMS, DMs, satisfaction', status: 'active' },
  { id: 'rdv', nom: 'Agent RDV', role: 'Calendrier & Réservations', icon: '📅', color: '#60a5fa', desc: 'Gestion des rendez-vous, rappels, annulations', status: 'active' },
  { id: 'finance', nom: 'Agent Finance', role: 'Budget & Transactions', icon: '💰', color: '#22c55e', desc: 'Dépenses, revenus, Stripe, virements', status: 'active' },
  { id: 'rh', nom: 'Agent RH', role: 'Employes & Partenaires', icon: '👥', color: '#8b5cf6', desc: 'Recrutement, formation, performance', status: 'active' },
  { id: 'contenu', nom: 'Agent Contenu', role: 'Blog & Formation', icon: '✍️', color: '#f59e0b', desc: 'Articles, vidéos, modules de formation', status: 'active' },
  { id: 'technique', nom: 'Agent Technique', role: 'Site & Bugs', icon: '🔧', color: '#ef4444', desc: 'Monitoring, corrections, améliorations', status: 'active' },
]

// ─── Départements du salon ──────────────────────────────────
const DEPARTMENTS = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊', table: null, desc: 'Vue générale' },
  { id: 'calendrier', label: 'Calendrier', icon: '📅', table: 'rendez_vous', desc: 'RDV du jour' },
  { id: 'clients', label: 'Clients', icon: '👥', table: 'clients', desc: 'Base clients' },
  { id: 'employes', label: 'Employés', icon: '💼', table: 'employes', desc: 'Équipe' },
  { id: 'partenaires', label: 'Partenaires', icon: '🤝', table: 'partenaires', desc: 'Coiffeuses' },
  { id: 'candidats', label: 'Candidats', icon: '📋', table: 'candidatures', desc: 'Recrutement' },
  { id: 'fournisseurs', label: 'Fournisseurs', icon: '📦', table: 'fournisseurs', desc: 'Approvisionnement' },
  { id: 'services', label: 'Services', icon: '✂️', table: 'services', desc: 'Catalogue' },
  { id: 'produits', label: 'Produits', icon: '🧴', table: 'produits', desc: 'Inventaire' },
  { id: 'chaises', label: 'Chaises', icon: '💺', table: 'chaises', desc: 'Locations' },
  { id: 'transactions', label: 'Transactions', icon: '💰', table: 'portefeuille_transactions', desc: 'Finances' },
  { id: 'sms', label: 'SMS', icon: '💬', table: 'sms_logs', desc: 'Communications' },
  { id: 'formation', label: 'Formation', icon: '🎓', table: 'formation_modules', desc: 'Apprentissage' },
  { id: 'blog', label: 'Blog', icon: '📝', table: 'articles', desc: 'Contenu' },
]

// ─── Styles ─────────────────────────────────────────────────
const cardStyle = { background: '#fff', borderRadius: '14px', border: '1px solid rgba(14,12,9,0.06)', overflow: 'hidden' }
const sectionTitle = { fontSize: '13px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: MUTED, marginBottom: '12px' }
const chipStyle = (color) => ({ display: 'inline-block', padding: '3px 10px', borderRadius: '99px', fontSize: '11px', fontWeight: 600, background: `${color}18`, color, whiteSpace: 'nowrap' })
const btnPrimary = { background: NOIR, color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '12px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }
const btnSecondary = { background: 'rgba(14,12,9,0.04)', color: NOIR, border: 'none', padding: '10px 20px', borderRadius: '12px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }

// ─── Hook: Fetch données Supabase ───────────────────────────
function useSalonData() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setData(getMockData())
      setLoading(false)
      return
    }
    try {
      const today = new Date().toISOString().split('T')[0]
      const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString()

      const [clients, partenaires, employes, services, rdvToday, rdvWeek, transactions, abonnements, candidatures, smsLogs, chaises, fournisseurs, articles] = await Promise.all([
        supabase.from('clients').select('id, prenom, nom, telephone, created_at', { count: 'exact' }).order('created_at', { ascending: false }).limit(20),
        supabase.from('partenaires').select('id, prenom, nom, specialites, statut, disponible, niveau, ville').eq('statut', 'actif'),
        supabase.from('employes').select('id, prenom, nom, role_employe, statut').eq('statut', 'actif'),
        supabase.from('services').select('id, nom, prix, duree_min, categorie, actif').eq('actif', true),
        supabase.from('rendez_vous').select('id, date_rdv, heure, statut, service:services(nom, prix), client:clients(prenom, nom), partenaire:partenaires(prenom, nom)').eq('date_rdv', today).order('heure'),
        supabase.from('rendez_vous').select('id, statut, created_at').gte('created_at', weekAgo),
        supabase.from('portefeuille_transactions').select('id, montant, type, description, created_at').gte('created_at', weekAgo).order('created_at', { ascending: false }).limit(15),
        supabase.from('abonnements').select('id, statut').eq('statut', 'actif'),
        supabase.from('candidatures').select('id, prenom, nom, statut, created_at').order('created_at', { ascending: false }).limit(10),
        supabase.from('sms_logs').select('id, destinataire, contenu, statut, created_at').order('created_at', { ascending: false }).limit(10),
        supabase.from('chaises').select('id, nom, statut, partenaire:partenaires(prenom)'),
        supabase.from('fournisseurs').select('id, entreprise, statut'),
        supabase.from('articles').select('id, titre, statut, created_at').order('created_at', { ascending: false }).limit(5),
      ])

      const revenuSemaine = (transactions.data || []).filter(t => t.type === 'credit').reduce((s, t) => s + (t.montant || 0), 0)

      setData({
        clients: clients.data || [],
        totalClients: clients.count || clients.data?.length || 0,
        partenaires: partenaires.data || [],
        employes: employes.data || [],
        services: services.data || [],
        rdvToday: rdvToday.data || [],
        rdvWeek: rdvWeek.data || [],
        transactions: transactions.data || [],
        abonnements: abonnements.data || [],
        candidatures: candidatures.data || [],
        smsLogs: smsLogs.data || [],
        chaises: chaises.data || [],
        fournisseurs: fournisseurs.data || [],
        articles: articles.data || [],
        revenuSemaine,
      })
    } catch (e) {
      console.error('Erreur chargement données:', e)
      setData(getMockData())
    }
    setLoading(false)
  }, [])

  useEffect(() => { refresh() }, [refresh])
  return { data, loading, refresh }
}

function getMockData() {
  return {
    clients: [], totalClients: 0, partenaires: [], employes: [], services: [],
    rdvToday: [], rdvWeek: [], transactions: [], abonnements: [],
    candidatures: [], smsLogs: [], chaises: [], fournisseurs: [], articles: [],
    revenuSemaine: 0,
  }
}

// ─── Hook: Speech ───────────────────────────────────────────
function useSpeech() {
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const recognitionRef = useRef(null)
  const synthRef = useRef(window.speechSynthesis)

  const startListening = useCallback((onResult) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) return null

    const recognition = new SpeechRecognition()
    recognition.lang = 'fr-CA'
    recognition.interimResults = false
    recognition.maxAlternatives = 1
    recognition.continuous = false

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript
      onResult(text)
      setIsListening(false)
    }
    recognition.onerror = () => setIsListening(false)
    recognition.onend = () => setIsListening(false)

    recognitionRef.current = recognition
    recognition.start()
    setIsListening(true)
    return recognition
  }, [])

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop()
    setIsListening(false)
  }, [])

  const speak = useCallback((text) => {
    if (!synthRef.current) return
    synthRef.current.cancel()
    // Nettoyer le texte (enlever emojis, markdown)
    const clean = text.replace(/[^\p{L}\p{N}\p{P}\p{Z}]/gu, '').replace(/\*\*/g, '').replace(/\n+/g, '. ').slice(0, 500)
    const utterance = new SpeechSynthesisUtterance(clean)
    utterance.lang = 'fr-CA'
    utterance.rate = 1.05
    utterance.pitch = 1.0
    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)
    synthRef.current.speak(utterance)
  }, [])

  const stopSpeaking = useCallback(() => {
    synthRef.current?.cancel()
    setIsSpeaking(false)
  }, [])

  return { isListening, isSpeaking, startListening, stopListening, speak, stopSpeaking }
}

// ─── Chat avec IA (Edge Function ou fallback) ───────────────
async function sendToIA(message, history) {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    const res = await fetch(EDGE_FN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session?.access_token || import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({ message, conversationHistory: history }),
    })
    const data = await res.json()
    if (data.fallback || data.error) return { reply: null, fallback: true }
    return data
  } catch {
    return { reply: null, fallback: true }
  }
}

function getFallbackResponse(msg) {
  const l = msg.toLowerCase()
  if (l.includes('rdv') || l.includes('rendez') || l.includes('calendrier'))
    return `Je vois ta demande concernant les RDV. Voici ce que je peux faire:\n\n• Consulter les RDV du jour et de la semaine\n• Envoyer des rappels automatiques aux clients\n• Identifier les créneaux vides et proposer des promotions flash\n• Gérer les annulations et reprogrammer\n\nDis-moi ce que tu veux que je fasse exactement.`
  if (l.includes('client') || l.includes('fidel'))
    return `Pour la gestion clients, voici mes capacités:\n\n• Analyser la satisfaction et les retours\n• Segmenter la base (fidèles, inactifs, nouveaux)\n• Programmer des campagnes SMS personnalisées\n• Gérer le programme de parrainage\n• Envoyer des rappels de rendez-vous\n\nQuel aspect veux-tu qu'on travaille?`
  if (l.includes('employ') || l.includes('equipe') || l.includes('partena') || l.includes('coiffeu'))
    return `Gestion de l'équipe — voici ce que je surveille:\n\n• Performance de chaque partenaire/employé\n• Disponibilités et plannings\n• Candidatures en attente de traitement\n• Formation et progression\n• Commissions et virements\n\nTu veux un rapport détaillé ou une action spécifique?`
  if (l.includes('market') || l.includes('instagram') || l.includes('tiktok') || l.includes('reseaux') || l.includes('pub'))
    return `Stratégie marketing en cours:\n\n• Publication programmée sur toutes les plateformes\n• Campagnes pub Meta & Google Ads actives\n• Monitoring des commentaires et DMs\n• Création de contenu (Reels, Stories, TikToks)\n• Gestion des avis Google Business\n\nBudget actuel: 100-300$/semaine. Qu'est-ce que tu veux prioriser?`
  if (l.includes('budget') || l.includes('finance') || l.includes('argent') || l.includes('transaction'))
    return `Finances et budget:\n\n• Budget hebdomadaire: alloué et suivi en temps réel\n• Transactions Stripe surveillées\n• Commissions partenaires calculées automatiquement\n• Virements programmés\n• Rapports de performance ROI\n\nTu veux voir les détails ou ajuster le budget?`
  if (l.includes('bug') || l.includes('erreur') || l.includes('site') || l.includes('technique'))
    return `Monitoring technique activé:\n\n• Je surveille les erreurs du site en continu\n• Tests automatiques des pages principales\n• Vérification des formulaires et du processus de réservation\n• Monitoring de la vitesse de chargement\n• Alertes si un service tombe\n\nJe corrige automatiquement les problèmes que je peux résoudre et je te signale le reste.`
  if (l.includes('sms') || l.includes('message') || l.includes('whatsapp') || l.includes('communic'))
    return `Communications en cours:\n\n• Rappels RDV envoyés automatiquement 24h avant\n• Réponses WhatsApp & DMs en temps réel\n• Campagnes SMS ciblées (promotions, relance inactifs)\n• Gestion des avis (Google, Facebook)\n\nTout est automatisé. Tu veux envoyer un message spécifique?`
  if (l.includes('formation') || l.includes('candidat') || l.includes('recrute'))
    return `Formation & Recrutement:\n\n• Modules de formation pour les nouvelles coiffeuses\n• Suivi de la progression des candidats\n• Évaluation automatique des quiz\n• Processus d'intégration guidé\n\nJe peux créer du nouveau contenu de formation ou évaluer les candidatures en attente.`
  if (l.includes('strateg') || l.includes('plan') || l.includes('objectif') || l.includes('croi'))
    return `Voici ma vision stratégique pour Kadio:\n\n• Court terme: Optimiser le taux de remplissage des créneaux\n• Moyen terme: Doubler la base client via marketing digital\n• Long terme: Expansion du réseau de partenaires\n\nPriorités immédiates:\n1. Augmenter les avis Google (objectif: 100 avis 5 étoiles)\n2. Campagne été avec promotions ciblées\n3. Programme ambassadeur avec les meilleures clientes\n\nOn en discute?`
  return `Bien reçu! En tant que directrice IA de Kadio, je gère:\n\n• Les RDV et le calendrier\n• Les clients et la fidélisation\n• Les partenaires et employés\n• Le marketing sur toutes les plateformes\n• Le budget et les finances\n• Le contenu et la formation\n• Le monitoring technique du site\n\nJe suis opérationnelle 24/7. Donne-moi tes directives et je m'exécute!`
}

// ═══════════════════════════════════════════════════════════════
// ─── COMPOSANT PRINCIPAL ────────────────────────────────────
// ═══════════════════════════════════════════════════════════════
export default function IAManager() {
  const [activeTab, setActiveTab] = useState('command')
  const [selectedAgent, setSelectedAgent] = useState('directrice')
  const [chatMessages, setChatMessages] = useState([
    { role: 'ia', text: `Bonjour Othi! Je suis KADIO IA, ta directrice générale virtuelle. Je supervise tout le salon en temps réel.\n\nMes 7 agents spécialisés sont actifs:\n• Marketing, Clients, RDV, Finance, RH, Contenu, Technique\n\nJe peux te parler en vocal — appuie sur le micro. Qu'est-ce qu'on attaque aujourd'hui?`, agent: 'directrice' },
  ])
  const [chatInput, setChatInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const [voiceMode, setVoiceMode] = useState(false)
  const [autoSpeak, setAutoSpeak] = useState(false)
  const [deptView, setDeptView] = useState(null)
  const [deptData, setDeptData] = useState(null)
  const [deptLoading, setDeptLoading] = useState(false)
  const [activityLog, setActivityLog] = useState([
    { time: new Date().toLocaleTimeString('fr-CA', { hour: '2-digit', minute: '2-digit' }), agent: 'directrice', action: 'Système IA démarré — tous les agents actifs', type: 'system' },
  ])
  const chatEndRef = useRef(null)
  const inputRef = useRef(null)
  const { data: salonData, loading: salonLoading, refresh: refreshData } = useSalonData()
  const { isListening, isSpeaking, startListening, stopListening, speak, stopSpeaking } = useSpeech()

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [chatMessages])

  // ── Charger données d'un département ──
  const loadDeptData = async (dept) => {
    if (!dept.table || !isSupabaseConfigured) return
    setDeptLoading(true)
    try {
      const { data, error } = await supabase.from(dept.table).select('*').order('created_at', { ascending: false }).limit(50)
      if (!error) setDeptData(data)
    } catch (e) { console.error(e) }
    setDeptLoading(false)
  }

  // ── Envoyer un message ──
  const handleSend = async (text) => {
    const msg = (text || chatInput).trim()
    if (!msg) return
    setChatInput('')
    setChatMessages(prev => [...prev, { role: 'user', text: msg }])
    setChatLoading(true)

    // Log l'activité
    const now = new Date().toLocaleTimeString('fr-CA', { hour: '2-digit', minute: '2-digit' })
    setActivityLog(prev => [{ time: now, agent: selectedAgent, action: `Message reçu: "${msg.slice(0, 60)}${msg.length > 60 ? '...' : ''}"`, type: 'message' }, ...prev].slice(0, 50))

    // Essayer l'Edge Function, sinon fallback
    const result = await sendToIA(msg, chatMessages.filter(m => m.role !== 'system').slice(-10).map(m => ({ role: m.role === 'ia' ? 'assistant' : 'user', content: m.text })))

    let reply = result.reply || getFallbackResponse(msg)
    const agent = selectedAgent

    setChatMessages(prev => [...prev, { role: 'ia', text: reply, agent }])
    setChatLoading(false)

    // Log la réponse
    setActivityLog(prev => [{ time: new Date().toLocaleTimeString('fr-CA', { hour: '2-digit', minute: '2-digit' }), agent, action: `Réponse envoyée (${reply.length} car.)`, type: 'response' }, ...prev].slice(0, 50))

    // Lecture vocale si activé
    if (autoSpeak) speak(reply)
  }

  // ── Voice input ──
  const handleVoice = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening((text) => {
        setChatInput(text)
        // En mode vocal, envoyer directement
        if (voiceMode) {
          setTimeout(() => handleSend(text), 300)
        }
      })
    }
  }

  // ── Tabs ──
  const tabs = [
    { id: 'command', label: 'Command Center', icon: '🎛️' },
    { id: 'chat', label: 'Chat Vocal', icon: '🎙️' },
    { id: 'agents', label: 'Agents', icon: '🤖' },
    { id: 'departements', label: 'Départements', icon: '🏢' },
    { id: 'activites', label: 'Journal', icon: '📋' },
  ]

  // ── Stats rapides ──
  const stats = salonData ? [
    { label: 'Clients', value: salonData.totalClients || salonData.clients.length, icon: '👥', color: '#60a5fa' },
    { label: 'RDV aujourd\'hui', value: salonData.rdvToday.length, icon: '📅', color: OR },
    { label: 'RDV semaine', value: salonData.rdvWeek.length, icon: '📊', color: '#22c55e' },
    { label: 'Partenaires actifs', value: salonData.partenaires.length, icon: '🤝', color: '#8b5cf6' },
    { label: 'Revenus semaine', value: formatMontant(salonData.revenuSemaine), icon: '💰', color: '#22c55e' },
    { label: 'Abonnés actifs', value: salonData.abonnements.length, icon: '💳', color: '#f59e0b' },
  ] : []

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* ── Header ── */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '6px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: `linear-gradient(135deg, ${OR}, #D4A82A)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', boxShadow: '0 4px 12px rgba(184,146,42,0.3)' }}>👑</div>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0, fontFamily: `'Cormorant Garamond', serif`, letterSpacing: '0.02em' }}>KADIO IA — Command Center</h1>
            <p style={{ fontSize: '12px', color: MUTED, margin: 0 }}>8 agents actifs — Gestion 100% automatisée du salon</p>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button onClick={refreshData} style={{ ...btnSecondary, padding: '8px 14px', fontSize: '12px' }}>↻ Actualiser</button>
            <span style={chipStyle('#22c55e')}>● Système actif</span>
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', overflowX: 'auto', paddingBottom: '4px' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            style={{
              padding: '9px 16px', borderRadius: '10px', border: 'none', cursor: 'pointer',
              fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap', transition: 'all 0.15s',
              background: activeTab === t.id ? NOIR : 'rgba(14,12,9,0.04)',
              color: activeTab === t.id ? '#fff' : NOIR,
            }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* ── TAB: Command Center ── */}
      {/* ═══════════════════════════════════════════════════════ */}
      {activeTab === 'command' && (
        <div>
          {/* KPIs temps réel */}
          {salonLoading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: MUTED }}>Chargement des données...</div>
          ) : (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '10px', marginBottom: '20px' }}>
                {stats.map(s => (
                  <div key={s.label} style={{ ...cardStyle, padding: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '18px' }}>{s.icon}</span>
                    </div>
                    <div style={{ fontSize: '22px', fontWeight: 700 }}>{s.value}</div>
                    <div style={{ fontSize: '11px', color: MUTED }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Agents actifs */}
              <div style={{ marginBottom: '20px' }}>
                <div style={sectionTitle}>Agents IA Actifs</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
                  {AGENTS.map(a => (
                    <div key={a.id} onClick={() => { setSelectedAgent(a.id); setActiveTab('chat') }}
                      style={{ ...cardStyle, padding: '14px', cursor: 'pointer', transition: 'all 0.15s', border: `1px solid ${selectedAgent === a.id ? a.color : 'rgba(14,12,9,0.06)'}` }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                        <span style={{ fontSize: '22px' }}>{a.icon}</span>
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: 700 }}>{a.nom}</div>
                          <div style={{ fontSize: '11px', color: MUTED }}>{a.role}</div>
                        </div>
                      </div>
                      <div style={{ fontSize: '11px', color: MUTED, marginBottom: '6px' }}>{a.desc}</div>
                      <span style={chipStyle('#22c55e')}>● Actif</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Layout 2 colonnes: RDV du jour + Activité récente */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="ia-grid-2col">
                {/* RDV du jour */}
                <div style={cardStyle}>
                  <div style={{ padding: '14px 18px 10px', borderBottom: '1px solid rgba(14,12,9,0.06)' }}>
                    <div style={sectionTitle}>RDV Aujourd'hui ({salonData.rdvToday.length})</div>
                  </div>
                  <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
                    {salonData.rdvToday.length === 0 ? (
                      <div style={{ padding: '30px', textAlign: 'center', color: MUTED, fontSize: '13px' }}>Aucun RDV aujourd'hui</div>
                    ) : salonData.rdvToday.map(r => (
                      <div key={r.id} style={{ padding: '10px 18px', borderBottom: '1px solid rgba(14,12,9,0.04)', display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: OR, minWidth: '45px' }}>{r.heure?.slice(0, 5)}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '13px', fontWeight: 600 }}>{r.client?.prenom} {r.client?.nom}</div>
                          <div style={{ fontSize: '11px', color: MUTED }}>{r.service?.nom} — {r.partenaire?.prenom}</div>
                        </div>
                        <span style={chipStyle(r.statut === 'confirme' ? '#22c55e' : r.statut === 'annule' ? '#ef4444' : '#f59e0b')}>{r.statut}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Journal d'activité IA */}
                <div style={cardStyle}>
                  <div style={{ padding: '14px 18px 10px', borderBottom: '1px solid rgba(14,12,9,0.06)' }}>
                    <div style={sectionTitle}>Journal IA (temps réel)</div>
                  </div>
                  <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
                    {activityLog.map((a, i) => (
                      <div key={i} style={{ padding: '8px 18px', borderBottom: '1px solid rgba(14,12,9,0.03)', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                        <span style={{ fontSize: '10px', color: MUTED, minWidth: '40px', paddingTop: '2px' }}>{a.time}</span>
                        <span style={{ fontSize: '14px' }}>{AGENTS.find(ag => ag.id === a.agent)?.icon || '🤖'}</span>
                        <div style={{ fontSize: '12px', color: NOIR, flex: 1 }}>{a.action}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Chat rapide en bas */}
              <div style={{ ...cardStyle, marginTop: '16px', padding: '14px 18px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                <span style={{ fontSize: '20px' }}>💬</span>
                <input
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  placeholder="Donne une directive rapide à l'IA..."
                  style={{ flex: 1, padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(14,12,9,0.1)', fontSize: '13px', outline: 'none', fontFamily: 'inherit', background: IVOIRE }}
                />
                <button onClick={() => handleVoice()} style={{ ...btnSecondary, padding: '10px 14px', fontSize: '16px', background: isListening ? '#ef444420' : undefined, color: isListening ? '#ef4444' : undefined }}>
                  {isListening ? '⏹' : '🎙️'}
                </button>
                <button onClick={() => handleSend()} style={{ ...btnPrimary, padding: '10px 18px' }}>Envoyer</button>
              </div>
            </>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════ */}
      {/* ── TAB: Chat Vocal ── */}
      {/* ═══════════════════════════════════════════════════════ */}
      {activeTab === 'chat' && (
        <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column', height: 'calc(100vh - 220px)', minHeight: '500px' }}>
          {/* Chat header */}
          <div style={{ padding: '14px 18px', borderBottom: '1px solid rgba(14,12,9,0.06)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `linear-gradient(135deg, ${AGENTS.find(a => a.id === selectedAgent)?.color || OR}, ${OR})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
              {AGENTS.find(a => a.id === selectedAgent)?.icon || '👑'}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '14px', fontWeight: 700 }}>{AGENTS.find(a => a.id === selectedAgent)?.nom || 'KADIO IA'}</div>
              <div style={{ fontSize: '11px', color: '#22c55e' }}>● En ligne — {AGENTS.find(a => a.id === selectedAgent)?.role}</div>
            </div>
            {/* Agent selector */}
            <select value={selectedAgent} onChange={e => setSelectedAgent(e.target.value)}
              style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid rgba(14,12,9,0.1)', fontSize: '12px', background: IVOIRE, outline: 'none', cursor: 'pointer' }}>
              {AGENTS.map(a => <option key={a.id} value={a.id}>{a.icon} {a.nom}</option>)}
            </select>
            {/* Voice mode toggle */}
            <button onClick={() => { setVoiceMode(!voiceMode); setAutoSpeak(!autoSpeak) }}
              style={{ ...voiceMode ? { ...btnPrimary, background: OR } : btnSecondary, padding: '6px 12px', fontSize: '12px' }}>
              {voiceMode ? '🎙️ Vocal ON' : '🔇 Vocal OFF'}
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {chatMessages.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', gap: '8px' }}>
                {m.role === 'ia' && (
                  <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: `linear-gradient(135deg, ${AGENTS.find(a => a.id === (m.agent || selectedAgent))?.color || OR}, ${OR})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0 }}>
                    {AGENTS.find(a => a.id === (m.agent || selectedAgent))?.icon || '👑'}
                  </div>
                )}
                <div style={{ maxWidth: '80%' }}>
                  {m.role === 'ia' && m.agent && (
                    <div style={{ fontSize: '10px', color: MUTED, marginBottom: '3px', fontWeight: 600 }}>{AGENTS.find(a => a.id === m.agent)?.nom}</div>
                  )}
                  <div style={{
                    padding: '12px 16px', borderRadius: '14px',
                    background: m.role === 'user' ? NOIR : IVOIRE,
                    color: m.role === 'user' ? '#fff' : NOIR,
                    fontSize: '13px', lineHeight: '1.55', whiteSpace: 'pre-line',
                  }}>
                    {m.text}
                  </div>
                  {m.role === 'ia' && (
                    <button onClick={() => speak(m.text)}
                      style={{ background: 'none', border: 'none', fontSize: '11px', color: MUTED, cursor: 'pointer', padding: '4px 0', marginTop: '2px' }}>
                      {isSpeaking ? '⏹ Arrêter' : '🔊 Écouter'}
                    </button>
                  )}
                </div>
              </div>
            ))}
            {chatLoading && (
              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: `linear-gradient(135deg, ${OR}, #D4A82A)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0 }}>👑</div>
                <div style={{ padding: '12px 16px', borderRadius: '14px', background: IVOIRE, fontSize: '13px', color: MUTED }}>
                  <span className="ia-pulse">Réflexion en cours...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick prompts */}
          <div style={{ padding: '8px 18px 0', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {[
              'Résumé du jour', 'Rappels clients à envoyer', 'Performance de la semaine',
              'Stratégie marketing cette semaine', 'Candidatures en attente', 'Bugs à corriger',
              'Idées de contenu', 'État des partenaires',
            ].map(q => (
              <button key={q} onClick={() => { handleSend(q) }}
                style={{ padding: '6px 12px', borderRadius: '99px', border: '1px solid rgba(14,12,9,0.1)', background: '#fff', fontSize: '11px', fontWeight: 500, cursor: 'pointer', color: NOIR }}>
                {q}
              </button>
            ))}
          </div>

          {/* Input + Voice */}
          <div style={{ padding: '12px 18px 16px', display: 'flex', gap: '8px', alignItems: 'center' }}>
            {/* Gros bouton micro en mode vocal */}
            <button onClick={handleVoice}
              style={{
                width: isListening ? '56px' : '44px', height: isListening ? '56px' : '44px',
                borderRadius: '50%', border: 'none', cursor: 'pointer', flexShrink: 0,
                background: isListening ? '#ef4444' : `linear-gradient(135deg, ${OR}, #D4A82A)`,
                color: '#fff', fontSize: isListening ? '22px' : '18px',
                boxShadow: isListening ? '0 0 20px rgba(239,68,68,0.4)' : '0 2px 8px rgba(184,146,42,0.3)',
                transition: 'all 0.2s',
                animation: isListening ? 'ia-pulse-ring 1.5s infinite' : 'none',
              }}>
              {isListening ? '⏹' : '🎙️'}
            </button>
            <input
              ref={inputRef}
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder={isListening ? 'Écoute en cours...' : voiceMode ? 'Parle ou écris ta directive...' : 'Écris ta directive...'}
              style={{ flex: 1, padding: '12px 16px', borderRadius: '12px', border: `1px solid ${isListening ? '#ef4444' : 'rgba(14,12,9,0.1)'}`, fontSize: '13px', outline: 'none', fontFamily: 'inherit', background: IVOIRE, transition: 'border-color 0.2s' }}
            />
            <button onClick={() => handleSend()} disabled={chatLoading}
              style={{ ...btnPrimary, padding: '12px 20px', opacity: chatLoading ? 0.5 : 1 }}>
              Envoyer
            </button>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════ */}
      {/* ── TAB: Agents ── */}
      {/* ═══════════════════════════════════════════════════════ */}
      {activeTab === 'agents' && (
        <div>
          <div style={sectionTitle}>Équipe d'agents IA — 8 spécialistes</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '14px' }}>
            {AGENTS.map(a => (
              <div key={a.id} style={{ ...cardStyle, padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '12px' }}>
                  <div style={{ width: '50px', height: '50px', borderRadius: '14px', background: `${a.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px' }}>{a.icon}</div>
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: 700 }}>{a.nom}</div>
                    <div style={{ fontSize: '12px', color: MUTED }}>{a.role}</div>
                  </div>
                </div>
                <div style={{ fontSize: '13px', color: NOIR, marginBottom: '12px', lineHeight: '1.5' }}>{a.desc}</div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span style={chipStyle('#22c55e')}>● Actif</span>
                  <button onClick={() => { setSelectedAgent(a.id); setActiveTab('chat') }}
                    style={{ ...btnSecondary, padding: '6px 14px', fontSize: '12px', marginLeft: 'auto' }}>
                    💬 Discuter
                  </button>
                </div>

                {/* Responsabilités */}
                <div style={{ marginTop: '12px', padding: '10px', background: IVOIRE, borderRadius: '8px', fontSize: '12px', color: MUTED, lineHeight: '1.5' }}>
                  {a.id === 'directrice' && 'Supervise tous les agents, prend les décisions stratégiques, rend compte à Othi, coordonne les priorités.'}
                  {a.id === 'marketing' && 'Publie sur Instagram, TikTok, Facebook, Pinterest. Gère les campagnes Meta/Google Ads. Crée le contenu visuel.'}
                  {a.id === 'clients' && 'Répond aux messages WhatsApp/SMS/DMs. Gère la satisfaction. Programme les rappels RDV. Fidélisation.'}
                  {a.id === 'rdv' && 'Gère le calendrier, confirme les RDV, gère les annulations, optimise les créneaux, envoie les rappels.'}
                  {a.id === 'finance' && 'Suit les revenus, gère le budget pub, calcule les commissions, programme les virements, rapports financiers.'}
                  {a.id === 'rh' && 'Évalue les candidatures, suit la formation, gère les plannings employés/partenaires, évalue la performance.'}
                  {a.id === 'contenu' && 'Rédige les articles de blog, crée les modules de formation, produit le contenu éducatif, gère les newsletters.'}
                  {a.id === 'technique' && 'Surveille le site 24/7, détecte les bugs, optimise la vitesse, teste les fonctionnalités, alerte sur les erreurs.'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════ */}
      {/* ── TAB: Départements ── */}
      {/* ═══════════════════════════════════════════════════════ */}
      {activeTab === 'departements' && (
        <div>
          {!deptView ? (
            <>
              <div style={sectionTitle}>Tous les départements du salon</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '10px' }}>
                {DEPARTMENTS.map(d => (
                  <div key={d.id} onClick={() => { setDeptView(d); if (d.table) loadDeptData(d) }}
                    style={{ ...cardStyle, padding: '18px', cursor: 'pointer', textAlign: 'center', transition: 'all 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>{d.icon}</div>
                    <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '2px' }}>{d.label}</div>
                    <div style={{ fontSize: '11px', color: MUTED }}>{d.desc}</div>
                    {salonData && d.table && (
                      <div style={{ marginTop: '8px', fontSize: '18px', fontWeight: 700, color: OR }}>
                        {d.table === 'clients' && salonData.totalClients}
                        {d.table === 'partenaires' && salonData.partenaires.length}
                        {d.table === 'employes' && salonData.employes.length}
                        {d.table === 'services' && salonData.services.length}
                        {d.table === 'rendez_vous' && salonData.rdvToday.length}
                        {d.table === 'candidatures' && salonData.candidatures.length}
                        {d.table === 'fournisseurs' && salonData.fournisseurs.length}
                        {d.table === 'chaises' && salonData.chaises.length}
                        {d.table === 'portefeuille_transactions' && salonData.transactions.length}
                        {d.table === 'sms_logs' && salonData.smsLogs.length}
                        {d.table === 'articles' && salonData.articles.length}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div>
              <button onClick={() => { setDeptView(null); setDeptData(null) }}
                style={{ ...btnSecondary, marginBottom: '16px', fontSize: '12px' }}>
                ← Retour aux départements
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <span style={{ fontSize: '32px' }}>{deptView.icon}</span>
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0 }}>{deptView.label}</h2>
                  <p style={{ fontSize: '12px', color: MUTED, margin: 0 }}>{deptView.desc} — Géré par l'IA</p>
                </div>
                <button onClick={() => { setSelectedAgent(deptView.id === 'calendrier' ? 'rdv' : deptView.id === 'transactions' ? 'finance' : 'directrice'); setActiveTab('chat') }}
                  style={{ ...btnPrimary, marginLeft: 'auto', fontSize: '12px', padding: '8px 16px' }}>
                  💬 Discuter avec l'IA
                </button>
              </div>

              {deptLoading ? (
                <div style={{ textAlign: 'center', padding: '40px', color: MUTED }}>Chargement...</div>
              ) : deptData ? (
                <div style={cardStyle}>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                      <thead>
                        <tr style={{ background: IVOIRE }}>
                          {Object.keys(deptData[0] || {}).slice(0, 6).map(k => (
                            <th key={k} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 600, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: MUTED, borderBottom: '1px solid rgba(14,12,9,0.08)' }}>{k}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {deptData.slice(0, 30).map((row, i) => (
                          <tr key={i} style={{ borderBottom: '1px solid rgba(14,12,9,0.04)' }}>
                            {Object.values(row).slice(0, 6).map((v, j) => (
                              <td key={j} style={{ padding: '10px 14px', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {typeof v === 'object' ? JSON.stringify(v)?.slice(0, 50) : String(v ?? '—').slice(0, 60)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {deptData.length === 0 && <div style={{ padding: '30px', textAlign: 'center', color: MUTED }}>Aucune donnée</div>}
                  <div style={{ padding: '12px 18px', borderTop: '1px solid rgba(14,12,9,0.06)', fontSize: '12px', color: MUTED }}>
                    {deptData.length} entrées affichées
                  </div>
                </div>
              ) : (
                <div style={{ ...cardStyle, padding: '40px', textAlign: 'center', color: MUTED }}>
                  Ce département est géré par l'IA. Utilise le chat pour interagir.
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════ */}
      {/* ── TAB: Journal d'activité ── */}
      {/* ═══════════════════════════════════════════════════════ */}
      {activeTab === 'activites' && (
        <div style={cardStyle}>
          <div style={{ padding: '16px 18px 12px', borderBottom: '1px solid rgba(14,12,9,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={sectionTitle}>Journal d'activité IA — Temps réel</div>
            <span style={{ fontSize: '12px', color: MUTED }}>{activityLog.length} actions</span>
          </div>
          {activityLog.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: MUTED }}>Aucune activité enregistrée</div>
          ) : (
            activityLog.map((a, i) => (
              <div key={i} style={{ padding: '12px 18px', borderBottom: '1px solid rgba(14,12,9,0.04)', display: 'flex', gap: '12px', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', color: MUTED, minWidth: '48px', fontFamily: 'monospace' }}>{a.time}</span>
                <span style={{ fontSize: '18px' }}>{AGENTS.find(ag => ag.id === a.agent)?.icon || '🤖'}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px' }}>{a.action}</div>
                  <div style={{ fontSize: '11px', color: MUTED }}>{AGENTS.find(ag => ag.id === a.agent)?.nom || 'Système'}</div>
                </div>
                <span style={chipStyle(a.type === 'system' ? '#60a5fa' : a.type === 'response' ? '#22c55e' : '#f59e0b')}>{a.type}</span>
              </div>
            ))
          )}
        </div>
      )}

      {/* ── Responsive + animations ── */}
      <style>{`
        @media (max-width: 768px) {
          .ia-grid-2col { grid-template-columns: 1fr !important; }
        }
        @keyframes ia-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        .ia-pulse { animation: ia-pulse 1s infinite; }
        @keyframes ia-pulse-ring {
          0% { box-shadow: 0 0 0 0 rgba(239,68,68,0.4); }
          70% { box-shadow: 0 0 0 15px rgba(239,68,68,0); }
          100% { box-shadow: 0 0 0 0 rgba(239,68,68,0); }
        }
      `}</style>
    </div>
  )
}
