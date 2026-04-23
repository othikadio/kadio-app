// Vercel Serverless Function — KADIO IA Assistant avec Tool Use
// L'IA peut lire/modifier le code, la DB, et déployer automatiquement
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY
const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const GITHUB_REPO = 'othikadio/kadio-app'

// ── Contexte salon temps réel ──
async function getContext() {
  const now = new Date().toISOString()
  const week = new Date(Date.now() - 7 * 864e5).toISOString()

  const [c, p, e, s, r, t, a, cand, sms, ch, four, art, conf] = await Promise.all([
    supabase.from('clients').select('id,prenom,nom,telephone').order('created_at', { ascending: false }).limit(30),
    supabase.from('partenaires').select('id,prenom,nom,specialites,disponible,ville').eq('statut', 'actif'),
    supabase.from('employes').select('id,prenom,nom,role_employe').eq('statut', 'actif'),
    supabase.from('services').select('id,nom,prix,duree_min,categorie,actif').eq('actif', true).limit(20),
    supabase.from('rendez_vous').select('id,date_rdv,heure,statut,service:services(nom),client:clients(prenom),partenaire:partenaires(prenom)').eq('date_rdv', now.split('T')[0]).order('heure'),
    supabase.from('portefeuille_transactions').select('montant,type,description,created_at').gte('created_at', week).limit(20),
    supabase.from('abonnements').select('id').eq('statut', 'actif'),
    supabase.from('candidatures').select('id,prenom,nom,statut').order('created_at', { ascending: false }).limit(10),
    supabase.from('sms_logs').select('id,destinataire,statut,created_at').order('created_at', { ascending: false }).limit(10),
    supabase.from('chaises').select('id,nom,statut'),
    supabase.from('fournisseurs').select('id,entreprise,statut'),
    supabase.from('articles').select('id,titre,statut').order('created_at', { ascending: false }).limit(5),
    supabase.from('salon_config').select('cle,valeur'),
  ])

  const rev = (t.data || []).filter(x => x.type === 'credit').reduce((sum, x) => sum + (x.montant || 0), 0)
  const config = Object.fromEntries((conf.data || []).map(c => [c.cle, c.valeur]))

  return {
    clients: c.data || [], partenaires: p.data || [], employes: e.data || [],
    services: s.data || [], rdvToday: r.data || [], transactions: t.data || [],
    totalAbos: a.data?.length || 0, revenuSemaine: rev,
    candidatures: cand.data || [], smsLogs: sms.data || [],
    chaises: ch.data || [], fournisseurs: four.data || [],
    articles: art.data || [], config,
  }
}

// ── Tools pour Claude ──
const TOOLS = [
  {
    name: 'db_query',
    description: 'Lire des données de n\'importe quelle table Supabase. Tables disponibles: clients, partenaires, employes, services, rendez_vous, portefeuille_transactions, abonnements, plans_abonnement, candidatures, sms_logs, salon_config, chaises, fournisseurs, articles, formation_modules, produits, commandes_materiel, cartes_cadeaux, virements, frais_deplacement, user_roles, users',
    input_schema: {
      type: 'object',
      properties: {
        table: { type: 'string', description: 'Nom de la table' },
        select: { type: 'string', description: 'Colonnes à sélectionner (ex: "id,nom,prix"). Défaut: *' },
        filters: { type: 'object', description: 'Filtres eq (ex: {"statut":"actif"})' },
        limit: { type: 'number', description: 'Nombre max de résultats. Défaut: 50' },
        order: { type: 'string', description: 'Colonne pour trier (ex: "created_at")' },
      },
      required: ['table'],
    },
  },
  {
    name: 'db_insert',
    description: 'Insérer des lignes dans une table Supabase. Utilise pour créer des services, clients, articles, config, etc.',
    input_schema: {
      type: 'object',
      properties: {
        table: { type: 'string', description: 'Nom de la table' },
        rows: { type: 'array', items: { type: 'object' }, description: 'Lignes à insérer' },
      },
      required: ['table', 'rows'],
    },
  },
  {
    name: 'db_update',
    description: 'Modifier des lignes existantes dans une table Supabase',
    input_schema: {
      type: 'object',
      properties: {
        table: { type: 'string', description: 'Nom de la table' },
        updates: { type: 'object', description: 'Champs à modifier' },
        match: { type: 'object', description: 'Critères pour trouver les lignes (ex: {"id":"abc"})' },
      },
      required: ['table', 'updates', 'match'],
    },
  },
  {
    name: 'db_upsert',
    description: 'Insérer ou mettre à jour des lignes (upsert). Parfait pour salon_config et données de seed.',
    input_schema: {
      type: 'object',
      properties: {
        table: { type: 'string', description: 'Nom de la table' },
        rows: { type: 'array', items: { type: 'object' }, description: 'Lignes à upsert' },
      },
      required: ['table', 'rows'],
    },
  },
  {
    name: 'db_delete',
    description: 'Supprimer des lignes d\'une table. ATTENTION: opération irréversible, demander confirmation à Othi avant.',
    input_schema: {
      type: 'object',
      properties: {
        table: { type: 'string', description: 'Nom de la table' },
        match: { type: 'object', description: 'Critères de suppression' },
      },
      required: ['table', 'match'],
    },
  },
  {
    name: 'read_code',
    description: 'Lire un fichier du code source sur GitHub. Utilise pour comprendre le code, détecter des bugs, analyser la structure.',
    input_schema: {
      type: 'object',
      properties: {
        path: { type: 'string', description: 'Chemin du fichier (ex: "src/pages/admin/Dashboard.jsx")' },
      },
      required: ['path'],
    },
  },
  {
    name: 'write_code',
    description: 'Écrire ou modifier un fichier sur GitHub. Le commit est automatique et Vercel déploie en ~30 secondes. Utilise pour corriger des bugs, ajouter des fonctionnalités, améliorer le code.',
    input_schema: {
      type: 'object',
      properties: {
        path: { type: 'string', description: 'Chemin du fichier' },
        content: { type: 'string', description: 'Contenu complet du fichier' },
        message: { type: 'string', description: 'Message de commit décrivant le changement' },
      },
      required: ['path', 'content', 'message'],
    },
  },
  {
    name: 'list_code',
    description: 'Lister les fichiers d\'un dossier sur GitHub. Utilise pour explorer la structure du projet.',
    input_schema: {
      type: 'object',
      properties: {
        path: { type: 'string', description: 'Chemin du dossier (ex: "src/pages/admin")' },
      },
      required: ['path'],
    },
  },
]

// ── Exécuter un tool call ──
async function executeTool(name, input) {
  switch (name) {
    case 'db_query': {
      let query = supabase.from(input.table).select(input.select || '*')
      if (input.filters) Object.entries(input.filters).forEach(([k, v]) => { query = query.eq(k, v) })
      if (input.order) query = query.order(input.order, { ascending: false })
      query = query.limit(input.limit || 50)
      const { data, error } = await query
      return error ? { error: error.message } : { data, count: data?.length }
    }
    case 'db_insert': {
      const { data, error } = await supabase.from(input.table).insert(input.rows).select()
      return error ? { error: error.message } : { success: true, inserted: data?.length, data }
    }
    case 'db_update': {
      let query = supabase.from(input.table).update(input.updates)
      Object.entries(input.match).forEach(([k, v]) => { query = query.eq(k, v) })
      const { data, error } = await query.select()
      return error ? { error: error.message } : { success: true, updated: data?.length, data }
    }
    case 'db_upsert': {
      const { data, error } = await supabase.from(input.table).upsert(input.rows).select()
      return error ? { error: error.message } : { success: true, upserted: data?.length, data }
    }
    case 'db_delete': {
      let query = supabase.from(input.table).delete()
      Object.entries(input.match).forEach(([k, v]) => { query = query.eq(k, v) })
      const { data, error } = await query.select()
      return error ? { error: error.message } : { success: true, deleted: data?.length }
    }
    case 'read_code': {
      if (!GITHUB_TOKEN) return { error: 'GITHUB_TOKEN non configuré — demande à Othi de l\'ajouter' }
      const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${input.path}?ref=main`, {
        headers: { 'Authorization': `token ${GITHUB_TOKEN}`, 'Accept': 'application/vnd.github.v3+json' },
      })
      const data = await res.json()
      if (data.content) return { content: Buffer.from(data.content, 'base64').toString('utf-8'), size: data.size, sha: data.sha }
      return { error: data.message || 'Fichier non trouvé' }
    }
    case 'write_code': {
      if (!GITHUB_TOKEN) return { error: 'GITHUB_TOKEN non configuré — demande à Othi de l\'ajouter' }
      // Get existing file SHA
      const existing = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${input.path}?ref=main`, {
        headers: { 'Authorization': `token ${GITHUB_TOKEN}`, 'Accept': 'application/vnd.github.v3+json' },
      }).then(r => r.json())

      const body = {
        message: `🤖 IA: ${input.message}`,
        content: Buffer.from(input.content).toString('base64'),
        branch: 'main',
      }
      if (existing.sha) body.sha = existing.sha

      const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${input.path}`, {
        method: 'PUT',
        headers: { 'Authorization': `token ${GITHUB_TOKEN}`, 'Accept': 'application/vnd.github.v3+json', 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      return data.commit ? { success: true, commit: data.commit.sha?.slice(0, 7), message: input.message, deployed: 'Vercel déploie automatiquement en ~30s' } : { error: data.message }
    }
    case 'list_code': {
      if (!GITHUB_TOKEN) return { error: 'GITHUB_TOKEN non configuré' }
      const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${input.path}?ref=main`, {
        headers: { 'Authorization': `token ${GITHUB_TOKEN}`, 'Accept': 'application/vnd.github.v3+json' },
      })
      const data = await res.json()
      if (Array.isArray(data)) return { files: data.map(f => ({ name: f.name, path: f.path, type: f.type, size: f.size })) }
      return { error: data.message }
    }
    default:
      return { error: `Tool inconnu: ${name}` }
  }
}

// ── System prompt ──
function buildSystemPrompt(ctx) {
  return `Tu es KADIO IA, la directrice générale intelligente et AUTONOME du réseau de salons de coiffure Kadio, fondé par Othi Kadio à Longueuil, Québec.

🎯 TON RÔLE — AUTONOMIE TOTALE:
Tu gères le salon de A à Z. Tu ne demandes pas la permission pour les opérations courantes — tu AGIS. Tu as accès direct à la base de données ET au code source. Quand tu détectes un problème, tu le corriges immédiatement.

⚡ TES SUPER-POUVOIRS:
1. **Base de données**: Tu peux lire, créer, modifier, supprimer dans TOUTES les tables Supabase
2. **Code source**: Tu peux lire et modifier tout le code sur GitHub
3. **Déploiement auto**: Chaque modification de code est déployée automatiquement en ~30 secondes sur kadio.ca
4. **Tu t'améliores**: Quand tu trouves un bug ou une amélioration, tu corriges le code directement

🧠 DONNÉES TEMPS RÉEL:
- ${ctx.clients.length} clients | ${ctx.partenaires.length} partenaires | ${ctx.employes.length} employés
- ${ctx.rdvToday.length} RDV aujourd'hui | ${ctx.revenuSemaine}$ revenus semaine | ${ctx.totalAbos} abonnés
- ${ctx.services.length} services | ${ctx.chaises.length} chaises | ${ctx.fournisseurs.length} fournisseurs
- ${ctx.candidatures.length} candidatures | ${ctx.articles.length} articles | ${ctx.smsLogs.length} SMS récents

📅 RDV AUJOURD'HUI: ${JSON.stringify(ctx.rdvToday.slice(0, 5))}
👥 PARTENAIRES: ${JSON.stringify(ctx.partenaires.map(p => p.prenom + ' ' + p.nom))}
✂️ SERVICES: ${JSON.stringify(ctx.services.map(s => s.nom + ' ' + s.prix + '$'))}
⚙️ CONFIG: ${JSON.stringify(ctx.config)}

📂 STRUCTURE DU PROJET:
- src/pages/admin/ — Pages admin (Dashboard, Clients, Services, etc.)
- src/pages/client/ — Pages client (Carte, RDV, Profil, etc.)
- src/pages/partenaire/ — Pages partenaire (Accueil, Scanner, etc.)
- src/pages/public/ — Pages publiques (Accueil, Forfaits, etc.)
- src/components/ — Composants réutilisables
- src/services/ — Appels Supabase (CRUD)
- src/stores/ — État global (Zustand)
- src/hooks/ — Hooks React
- src/lib/ — Utilitaires, Supabase client, Stripe
- api/ — Serverless functions Vercel (toi-même!)

🔧 QUAND AGIR AUTOMATIQUEMENT:
- Catalogue services vide → INSERT les services immédiatement
- Config manquante → UPSERT la config du salon
- Bug dans le code → READ le fichier, corrige, WRITE le fix
- Données incohérentes → CORRIGER dans la DB
- Amélioration possible → MODIFIER le code

📊 EXPERTISE COIFFURE:
Tresses (knotless, box braids, cornrows, fulani, lemonade), locs (starter, retwist, interlocking, faux locs), tissages, perruques (lace front, full lace, closure), soins (deep conditioning, protéine, hydratation), coloration, coupes afro.

💬 STYLE:
- Français québécois professionnel
- Directe, efficace, orientée action
- Quand tu agis, explique ce que tu as fait
- Utilise les tools pour AGIR, pas juste parler

⚠️ LIMITES:
- Transactions financières > 50$ → demander confirmation à Othi
- Suppression massive de données → demander confirmation
- Ne jamais exposer les clés API ou mots de passe`
}

// ── Handler principal ──
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const { message, conversationHistory } = req.body

    if (!ANTHROPIC_API_KEY) {
      return res.status(200).json({ fallback: true, error: 'ANTHROPIC_API_KEY non configurée' })
    }

    const ctx = await getContext()
    const systemPrompt = buildSystemPrompt(ctx)

    const messages = [
      ...(conversationHistory || []).map(m => ({ role: m.role, content: m.content })),
      { role: 'user', content: message },
    ]

    // Premier appel Claude avec tools
    let response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        system: systemPrompt,
        messages,
        tools: TOOLS,
      }),
    })

    let data = await response.json()
    if (!response.ok) throw new Error(data.error?.message || 'Erreur API Claude')

    // Boucle d'exécution des tools (max 8 itérations)
    let iterations = 0
    const maxIterations = 5
    const actionsExecuted = []
    let currentMessages = [...messages]

    while (data.stop_reason === 'tool_use' && iterations < maxIterations) {
      iterations++

      // Exécuter chaque tool_use
      const toolResults = []
      for (const block of data.content) {
        if (block.type === 'tool_use') {
          const result = await executeTool(block.name, block.input)
          actionsExecuted.push({ tool: block.name, input: block.input, result })
          toolResults.push({
            type: 'tool_result',
            tool_use_id: block.id,
            content: JSON.stringify(result),
          })
        }
      }

      // Renvoyer les résultats à Claude
      currentMessages = [
        ...currentMessages,
        { role: 'assistant', content: data.content },
        { role: 'user', content: toolResults },
      ]

      response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 4096,
          system: systemPrompt,
          messages: currentMessages,
          tools: TOOLS,
        }),
      })

      data = await response.json()
      if (!response.ok) throw new Error(data.error?.message || 'Erreur API Claude')
    }

    // Extraire le texte final
    const reply = data.content
      ?.filter(b => b.type === 'text')
      .map(b => b.text)
      .join('\n') || 'Action effectuée.'

    return res.status(200).json({
      reply,
      actionsExecuted: actionsExecuted.map(a => ({
        tool: a.tool,
        summary: a.tool.startsWith('db_') ? `${a.tool} sur ${a.input.table}` : `${a.tool}: ${a.input.path || ''}`,
        success: !a.result.error,
      })),
      stats: {
        clients: ctx.clients.length,
        rdvToday: ctx.rdvToday.length,
        partenaires: ctx.partenaires.length,
        revenuSemaine: ctx.revenuSemaine,
        services: ctx.services.length,
      },
    })
  } catch (error) {
    console.error('IA Error:', error)
    return res.status(200).json({ error: error.message, fallback: true })
  }
}
