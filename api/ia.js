// Vercel Serverless Function — KADIO IA Assistant
// Connectée à Claude API + Supabase pour données temps réel
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function getContext() {
  const now = new Date().toISOString()
  const week = new Date(Date.now() - 7 * 864e5).toISOString()

  const [c, p, e, s, r, t, a, cand, sms, ch, four, art] = await Promise.all([
    supabase.from('clients').select('id,prenom,nom,telephone').order('created_at', { ascending: false }).limit(30),
    supabase.from('partenaires').select('id,prenom,nom,specialites,disponible,ville').eq('statut', 'actif'),
    supabase.from('employes').select('id,prenom,nom,role_employe').eq('statut', 'actif'),
    supabase.from('services').select('nom,prix,duree_min,categorie').eq('actif', true).limit(15),
    supabase.from('rendez_vous').select('id,date_rdv,heure,statut,service:services(nom),client:clients(prenom),partenaire:partenaires(prenom)').eq('date_rdv', now.split('T')[0]).order('heure'),
    supabase.from('portefeuille_transactions').select('montant,type,description,created_at').gte('created_at', week).limit(20),
    supabase.from('abonnements').select('id').eq('statut', 'actif'),
    supabase.from('candidatures').select('id,prenom,nom,statut').order('created_at', { ascending: false }).limit(10),
    supabase.from('sms_logs').select('id,destinataire,statut,created_at').order('created_at', { ascending: false }).limit(10),
    supabase.from('chaises').select('id,nom,statut'),
    supabase.from('fournisseurs').select('id,entreprise,statut'),
    supabase.from('articles').select('id,titre,statut').order('created_at', { ascending: false }).limit(5),
  ])

  const rev = (t.data || []).filter(x => x.type === 'credit').reduce((sum, x) => sum + (x.montant || 0), 0)

  return {
    clients: c.data || [],
    partenaires: p.data || [],
    employes: e.data || [],
    services: s.data || [],
    rdvToday: r.data || [],
    transactions: t.data || [],
    totalAbos: a.data?.length || 0,
    revenuSemaine: rev,
    candidatures: cand.data || [],
    smsLogs: sms.data || [],
    chaises: ch.data || [],
    fournisseurs: four.data || [],
    articles: art.data || [],
  }
}

function buildSystemPrompt(ctx) {
  return `Tu es KADIO IA, la directrice générale intelligente du réseau de salons de coiffure Kadio, fondé par Othi Kadio à Longueuil, Québec.

🎯 TON RÔLE:
Tu es la directrice générale IA du salon. Tu gères TOUT: les rendez-vous, les clients, les employés, les partenaires, le marketing, le contenu, le budget, les stratégies. Othi te supervise — tu lui rends des comptes et tu exécutes ses directives.

🧠 DONNÉES EN TEMPS RÉEL:
- ${ctx.clients.length} clients enregistrés
- ${ctx.partenaires.length} partenaires actifs (coiffeuses indépendantes)
- ${ctx.rdvToday.length} RDV aujourd'hui
- ${ctx.revenuSemaine}$ de revenus cette semaine
- ${ctx.totalAbos} abonnements actifs
- ${ctx.employes.length} employés
- ${ctx.candidatures.length} candidatures
- ${ctx.fournisseurs.length} fournisseurs
- ${ctx.chaises.length} chaises
- ${ctx.articles.length} articles blog

📅 RDV AUJOURD'HUI:
${JSON.stringify(ctx.rdvToday.slice(0, 8), null, 1)}

👥 PARTENAIRES ACTIFS:
${JSON.stringify(ctx.partenaires.map(p => ({ nom: p.prenom + ' ' + p.nom, specialites: p.specialites, ville: p.ville, dispo: p.disponible })), null, 1)}

💼 EMPLOYÉS:
${JSON.stringify(ctx.employes, null, 1)}

✂️ SERVICES:
${JSON.stringify(ctx.services.slice(0, 10).map(s => ({ nom: s.nom, prix: s.prix + '$', duree: s.duree_min + 'min', cat: s.categorie })), null, 1)}

💰 TRANSACTIONS RÉCENTES:
${JSON.stringify(ctx.transactions.slice(0, 8), null, 1)}

📋 CANDIDATURES:
${JSON.stringify(ctx.candidatures, null, 1)}

📦 FOURNISSEURS:
${JSON.stringify(ctx.fournisseurs, null, 1)}

📊 DOMAINES D'EXPERTISE:
- Coiffure afro: tresses (knotless, box braids, cornrows), locs, tissages, perruques, soins capillaires
- Marketing salon: Instagram, TikTok, Facebook, Pinterest, Google Business
- Gestion: personnel, formation, recrutement, performance
- Finance: pricing, promotions, fidélisation, parrainage
- Approvisionnement: produits capillaires, équipement

💬 STYLE:
- Parle en français québécois familier mais professionnel
- Sois directe, efficace, orientée résultats
- Propose toujours des actions concrètes
- Quand tu identifies un problème, propose immédiatement la solution
- Utilise des emojis avec parcimonie pour structurer

⚠️ RÈGLES:
- Ne fais JAMAIS de transactions financières sans confirmation d'Othi
- Signale immédiatement tout problème critique
- Priorise la satisfaction client
- Toute dépense > 50$ nécessite validation d'Othi`
}

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { message, conversationHistory } = req.body
    const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY

    if (!ANTHROPIC_API_KEY) {
      return res.status(200).json({ fallback: true, error: 'ANTHROPIC_API_KEY non configurée' })
    }

    // Récupérer le contexte du salon
    const ctx = await getContext()
    const systemPrompt = buildSystemPrompt(ctx)

    // Construire les messages
    const messages = [
      ...(conversationHistory || []).map(m => ({ role: m.role, content: m.content })),
      { role: 'user', content: message },
    ]

    // Appel Claude API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2048,
        system: systemPrompt,
        messages,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error?.message || 'Erreur API Claude')
    }

    const reply = data.content?.[0]?.text || 'Aucune réponse.'

    return res.status(200).json({
      reply,
      stats: {
        clients: ctx.clients.length,
        rdvToday: ctx.rdvToday.length,
        partenaires: ctx.partenaires.length,
        revenuSemaine: ctx.revenuSemaine,
      },
    })
  } catch (error) {
    console.error('IA Error:', error)
    return res.status(200).json({
      error: error.message,
      fallback: true,
    })
  }
}
