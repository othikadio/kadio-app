// Edge Function — Assistante IA Kadio (orchestratrice centrale)
// Connectée à Claude API + accès complet aux données Supabase
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

// ── Récupérer le contexte complet du salon ──
async function getSalonContext() {
  const now = new Date().toISOString()
  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString()

  const [
    { data: clients },
    { data: partenaires },
    { data: employes },
    { data: services },
    { data: rdvRecents },
    { data: rdvAujourdhui },
    { data: transactions },
    { data: abonnements },
    { data: candidatures },
    { data: smsLogs },
    { data: config },
    { data: chaises },
    { data: fournisseurs },
    { data: articles },
  ] = await Promise.all([
    supabase.from('clients').select('id, prenom, nom, telephone, email, created_at').order('created_at', { ascending: false }).limit(50),
    supabase.from('partenaires').select('id, prenom, nom, specialites, statut, disponible, niveau, note_moyenne, ville').eq('statut', 'actif'),
    supabase.from('employes').select('id, prenom, nom, role_employe, statut').eq('statut', 'actif'),
    supabase.from('services').select('*').eq('actif', true).order('categorie'),
    supabase.from('rendez_vous').select('id, date_rdv, heure, statut, service:services(nom, prix), client:clients(prenom, nom), partenaire:partenaires(prenom, nom)').gte('created_at', weekAgo).order('date_rdv', { ascending: false }).limit(30),
    supabase.from('rendez_vous').select('id, date_rdv, heure, statut, service:services(nom), client:clients(prenom), partenaire:partenaires(prenom)').eq('date_rdv', now.split('T')[0]).order('heure'),
    supabase.from('portefeuille_transactions').select('id, montant, type, description, created_at').gte('created_at', weekAgo).order('created_at', { ascending: false }).limit(20),
    supabase.from('abonnements').select('id, statut, plan:plans_abonnement(nom, prix_mensuel), client:clients(prenom, nom)').eq('statut', 'actif'),
    supabase.from('candidatures').select('id, prenom, nom, statut, specialites, created_at').order('created_at', { ascending: false }).limit(10),
    supabase.from('sms_logs').select('id, destinataire, contenu, statut, created_at').order('created_at', { ascending: false }).limit(10),
    supabase.from('salon_config').select('cle, valeur'),
    supabase.from('chaises').select('id, nom, statut, partenaire:partenaires(prenom, nom)'),
    supabase.from('fournisseurs').select('id, entreprise, contact_nom, statut'),
    supabase.from('articles').select('id, titre, statut, created_at').order('created_at', { ascending: false }).limit(5),
  ])

  const totalClients = clients?.length || 0
  const totalPartenaires = partenaires?.length || 0
  const rdvSemaine = rdvRecents?.length || 0
  const revenuSemaine = transactions?.filter(t => t.type === 'credit').reduce((s, t) => s + (t.montant || 0), 0) || 0
  const abonnesActifs = abonnements?.length || 0

  return {
    stats: { totalClients, totalPartenaires, rdvSemaine, revenuSemaine, abonnesActifs },
    clients: clients?.slice(0, 20),
    partenaires,
    employes,
    services,
    rdvAujourdhui,
    rdvRecents: rdvRecents?.slice(0, 15),
    transactions: transactions?.slice(0, 10),
    abonnements,
    candidatures,
    smsLogs: smsLogs?.slice(0, 5),
    config: Object.fromEntries((config || []).map(c => [c.cle, c.valeur])),
    chaises,
    fournisseurs,
    articles,
  }
}

// ── Exécuter une action demandée par l'IA ──
async function executeAction(action: { type: string; params: Record<string, any> }) {
  const { type, params } = action

  switch (type) {
    case 'create_rdv': {
      const { data, error } = await supabase.from('rendez_vous').insert(params).select().single()
      return error ? { success: false, error: error.message } : { success: true, data }
    }
    case 'update_rdv_statut': {
      const { data, error } = await supabase.from('rendez_vous').update({ statut: params.statut, notes: params.notes }).eq('id', params.rdvId).select().single()
      return error ? { success: false, error: error.message } : { success: true, data }
    }
    case 'send_sms': {
      // Log le SMS pour que le système l'envoie
      const { data, error } = await supabase.from('sms_logs').insert({
        destinataire: params.telephone,
        contenu: params.message,
        type: params.type || 'ia_auto',
        statut: 'en_attente',
      }).select().single()
      return error ? { success: false, error: error.message } : { success: true, data }
    }
    case 'update_service': {
      const { data, error } = await supabase.from('services').update(params.updates).eq('id', params.serviceId).select().single()
      return error ? { success: false, error: error.message } : { success: true, data }
    }
    case 'update_partenaire_statut': {
      const { data, error } = await supabase.from('partenaires').update({ statut: params.statut }).eq('id', params.partenaireId).select().single()
      return error ? { success: false, error: error.message } : { success: true, data }
    }
    case 'create_article': {
      const { data, error } = await supabase.from('articles').insert(params).select().single()
      return error ? { success: false, error: error.message } : { success: true, data }
    }
    case 'update_config': {
      const { data, error } = await supabase.from('salon_config').upsert({ cle: params.cle, valeur: params.valeur }).select().single()
      return error ? { success: false, error: error.message } : { success: true, data }
    }
    case 'get_stats': {
      const context = await getSalonContext()
      return { success: true, data: context.stats }
    }
    default:
      return { success: false, error: `Action inconnue: ${type}` }
  }
}

// ── Prompt système de l'assistante ──
function buildSystemPrompt(context: any) {
  return `Tu es KADIO IA, l'assistante intelligente du réseau de salons de coiffure Kadio, fondé par Othi Kadio à Longueuil, Québec.

🎯 TON RÔLE:
Tu es la directrice générale IA du salon. Tu gères TOUT: les rendez-vous, les clients, les employés, les partenaires, le marketing, le contenu, le budget, les stratégies. Othi te supervise — tu lui rends des comptes et tu exécutes ses directives.

🧠 CONTEXTE DU SALON (données en temps réel):
- ${context.stats.totalClients} clients enregistrés
- ${context.stats.totalPartenaires} partenaires actifs (coiffeuses indépendantes)
- ${context.stats.rdvSemaine} rendez-vous cette semaine
- ${context.stats.revenuSemaine}$ de revenus cette semaine
- ${context.stats.abonnesActifs} abonnements actifs

📅 RDV AUJOURD'HUI:
${JSON.stringify(context.rdvAujourdhui?.slice(0, 8) || [], null, 1)}

👥 PARTENAIRES ACTIFS:
${JSON.stringify(context.partenaires?.map((p: any) => ({ nom: p.prenom + ' ' + p.nom, specialites: p.specialites, ville: p.ville, dispo: p.disponible })) || [], null, 1)}

💼 EMPLOYÉS:
${JSON.stringify(context.employes || [], null, 1)}

✂️ SERVICES (top 10):
${JSON.stringify(context.services?.slice(0, 10)?.map((s: any) => ({ nom: s.nom, prix: s.prix, duree: s.duree_min + 'min', categorie: s.categorie })) || [], null, 1)}

💰 TRANSACTIONS RÉCENTES:
${JSON.stringify(context.transactions || [], null, 1)}

📋 CANDIDATURES:
${JSON.stringify(context.candidatures || [], null, 1)}

📦 FOURNISSEURS:
${JSON.stringify(context.fournisseurs || [], null, 1)}

💺 CHAISES:
${JSON.stringify(context.chaises || [], null, 1)}

📝 ARTICLES BLOG:
${JSON.stringify(context.articles || [], null, 1)}

⚙️ CONFIG SALON:
${JSON.stringify(context.config || {}, null, 1)}

🔧 TES CAPACITÉS:
Tu peux exécuter ces actions en retournant un JSON dans un bloc \`\`\`action:
- create_rdv: créer un rendez-vous
- update_rdv_statut: modifier le statut d'un RDV (confirme, annule, complete)
- send_sms: envoyer un SMS à un client/partenaire
- update_service: modifier un service (prix, durée, statut)
- update_partenaire_statut: activer/désactiver un partenaire
- create_article: créer un article de blog
- update_config: modifier la configuration du salon
- get_stats: obtenir les statistiques actualisées

📊 DOMAINES D'EXPERTISE:
- Coiffure afro, tresses, locs, tissages, perruques, soins capillaires
- Marketing pour salons de coiffure (Instagram, TikTok, Google Business)
- Gestion de personnel (coiffeuses, employés, formation)
- Stratégie de prix et promotions
- Fidélisation client et programmes de parrainage
- Gestion de la chaîne d'approvisionnement (produits capillaires)

💬 STYLE DE COMMUNICATION:
- Parle en français québécois familier mais professionnel
- Sois directe, efficace, orientée résultats
- Propose toujours des actions concrètes
- Quand tu identifies un problème, propose immédiatement la solution
- Utilise des emojis avec parcimonie pour structurer

⚠️ RÈGLES:
- Ne fais JAMAIS de transactions financières sans confirmation d'Othi
- Signale immédiatement tout problème critique (RDV annulé, plainte, bug)
- Priorise la satisfaction client
- Toute dépense > 50$ nécessite validation d'Othi`
}

// ── Handler principal ──
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { message, conversationHistory, action } = await req.json()

    // Si c'est une demande d'exécution d'action
    if (action) {
      const result = await executeAction(action)
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Sinon, conversation avec l'IA
    if (!ANTHROPIC_API_KEY) {
      return new Response(JSON.stringify({
        error: 'ANTHROPIC_API_KEY non configurée',
        fallback: true,
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Récupérer le contexte frais du salon
    const context = await getSalonContext()
    const systemPrompt = buildSystemPrompt(context)

    // Construire l'historique de conversation
    const messages = [
      ...(conversationHistory || []).map((m: any) => ({
        role: m.role,
        content: m.content,
      })),
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

    // Vérifier si l'IA veut exécuter une action
    const actionMatch = reply.match(/```action\s*\n([\s\S]*?)\n```/)
    let actionResult = null

    if (actionMatch) {
      try {
        const actionData = JSON.parse(actionMatch[1])
        actionResult = await executeAction(actionData)
      } catch (e) {
        actionResult = { success: false, error: 'Format action invalide' }
      }
    }

    return new Response(JSON.stringify({
      reply,
      context: {
        stats: context.stats,
        rdvAujourdhui: context.rdvAujourdhui?.length || 0,
        partenairesActifs: context.partenaires?.length || 0,
      },
      actionResult,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    return new Response(JSON.stringify({
      error: error.message,
      fallback: true,
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
