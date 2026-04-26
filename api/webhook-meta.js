// Vercel Serverless — Meta Webhook Handler (Messenger + Instagram + WhatsApp)
// IA intelligente avec Claude, historique des conversations, escalade propriétaire
import { createClient } from '@supabase/supabase-js'

const VERIFY_TOKEN = process.env.META_WEBHOOK_VERIFY_TOKEN || 'kadio_webhook_2024'
const PAGE_ACCESS_TOKEN = process.env.META_PAGE_ACCESS_TOKEN
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY
const OWNER_PHONE = process.env.OWNER_PHONE || '5149195970'
const OWNER_NOTIFICATION_ID = process.env.OWNER_MESSENGER_ID || null

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// ── Envoyer un message via Messenger/Instagram ──
async function sendMessage(recipientId, text, platform = 'messenger') {
  const url = platform === 'whatsapp'
    ? `https://graph.facebook.com/v19.0/${process.env.WHATSAPP_PHONE_ID}/messages`
    : `https://graph.facebook.com/v19.0/me/messages`

  const body = platform === 'whatsapp'
    ? {
        messaging_product: 'whatsapp',
        to: recipientId,
        type: 'text',
        text: { body: text }
      }
    : {
        recipient: { id: recipientId },
        message: { text },
        messaging_type: 'RESPONSE'
      }

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${PAGE_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
  return res.json()
}

// ── Récupérer l'historique des conversations avec ce client ──
async function getConversationHistory(senderId, platform, limit = 15) {
  try {
    const { data } = await supabase
      .from('messages_sociaux')
      .select('message, reply, direction, created_at, escalade')
      .eq('sender_id', senderId)
      .eq('platform', platform)
      .order('created_at', { ascending: false })
      .limit(limit)

    // Inverser pour avoir l'ordre chronologique
    return (data || []).reverse()
  } catch (e) {
    console.log('History fetch error:', e.message)
    return []
  }
}

// ── Récupérer le contexte salon (services, horaires, infos) ──
async function getSalonContext() {
  try {
    const [services, config, partenaires] = await Promise.all([
      supabase.from('services').select('nom, prix, duree_min, categorie, description').eq('actif', true).order('categorie').limit(30),
      supabase.from('salon_config').select('cle, valeur'),
      supabase.from('partenaires').select('prenom, nom, specialites, disponible').eq('statut', 'actif'),
    ])

    const configMap = Object.fromEntries((config.data || []).map(c => [c.cle, c.valeur]))

    return {
      services: services.data || [],
      config: configMap,
      partenaires: (partenaires.data || []).filter(p => p.disponible),
    }
  } catch (e) {
    console.log('Context fetch error:', e.message)
    return { services: [], config: {}, partenaires: [] }
  }
}

// ── Détecter si le client veut parler au propriétaire ──
function wantsEscalation(message) {
  const msg = message.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  const escalationKeywords = [
    'proprietaire', 'patron', 'boss', 'manager', 'gerant',
    'parler a quelqu', 'parler a une vraie', 'parler a un humain',
    'personne reelle', 'vrai humain', 'pas un robot', 'pas un bot',
    'responsable', 'direction', 'othi', 'plainte', 'probleme grave',
    'rembours', 'insatisf', 'mecontent', 'fache', 'inacceptable',
    'parler au proprio', 'je veux parler', 'transferer', 'transfere-moi',
  ]
  return escalationKeywords.some(k => msg.includes(k))
}

// ── Notifier le propriétaire d'une escalade ──
async function notifyOwner(senderId, senderName, message, platform) {
  try {
    // Logger l'escalade dans la DB
    await supabase.from('messages_sociaux').insert({
      platform,
      sender_id: 'SYSTEM',
      sender_name: 'Kadio IA',
      message: `🚨 ESCALADE: ${senderName || senderId} sur ${platform} demande à parler au propriétaire.\n\nMessage: "${message}"`,
      direction: 'systeme',
      escalade: true,
      escalade_sender_id: senderId,
      escalade_sender_name: senderName,
      created_at: new Date().toISOString(),
    })

    // Si on a l'ID Messenger du propriétaire, lui envoyer un message
    if (OWNER_NOTIFICATION_ID) {
      await sendMessage(
        OWNER_NOTIFICATION_ID,
        `🚨 Un client demande à te parler !\n\n👤 ${senderName || 'Client'}\n📱 ${platform}\n💬 "${message.slice(0, 200)}"\n\nRéponds-lui directement sur ${platform}.`,
        'messenger'
      )
    }
  } catch (e) {
    console.log('Owner notification error:', e.message)
  }
}

// ── Générer une réponse IA avec Claude ──
async function generateAIReply(message, senderName, platform, senderId) {
  // Vérifier l'escalade d'abord
  if (wantsEscalation(message)) {
    await notifyOwner(senderId, senderName, message, platform)
    return `Je comprends que vous souhaitez parler directement au propriétaire, Othi. Je lui transmets votre message immédiatement ! 🙏\n\nIl vous répondra personnellement très bientôt sur ${platform === 'whatsapp' ? 'WhatsApp' : platform === 'instagram' ? 'Instagram' : 'Messenger'}.\n\nEn attendant, n'hésitez pas à me poser d'autres questions, je suis là pour vous aider !`
  }

  // Si pas de clé API, fallback aux réponses basiques
  if (!ANTHROPIC_API_KEY) {
    return generateBasicReply(message, senderName)
  }

  try {
    // Récupérer l'historique et le contexte en parallèle
    const [history, salon] = await Promise.all([
      getConversationHistory(senderId, platform),
      getSalonContext(),
    ])

    // Construire l'historique pour Claude
    const conversationMessages = []
    for (const h of history) {
      if (h.direction === 'entrant' && h.message) {
        conversationMessages.push({ role: 'user', content: h.message })
      }
      if (h.reply) {
        conversationMessages.push({ role: 'assistant', content: h.reply })
      }
    }
    // Ajouter le message actuel
    conversationMessages.push({ role: 'user', content: message })

    // Construire les infos services
    const servicesList = salon.services.map(s =>
      `- ${s.nom}: ${s.prix}$ (${s.duree_min || '?'} min) — ${s.categorie || ''}${s.description ? ' | ' + s.description : ''}`
    ).join('\n')

    const coiffeuses = salon.partenaires.map(p =>
      `- ${p.prenom} ${p.nom}${p.specialites ? ' — Spécialités: ' + p.specialites : ''}`
    ).join('\n')

    const systemPrompt = `Tu es l'assistante IA de Kadio Coiffure, un salon de coiffure afro haut de gamme à Longueuil, Québec, fondé par Othi Kadio.

🎯 TON RÔLE:
Tu es la première ligne de contact avec les clients sur ${platform}. Tu réponds de façon chaleureuse, professionnelle et humaine. Tu connais TOUT sur le salon — services, prix, disponibilités, et tu parles comme une vraie réceptionniste du salon qui connaît bien ses clients.

💇 NOS SERVICES:
${servicesList || 'Contactez-nous pour découvrir nos services !'}

👩‍🦱 NOS COIFFEUSES DISPONIBLES:
${coiffeuses || 'Nos coiffeuses sont prêtes à vous accueillir !'}

📍 INFOS PRATIQUES:
- Adresse: Longueuil, QC
- Horaires: ${salon.config.horaires || 'Lundi-Vendredi 9h-19h, Samedi 9h-17h, Dimanche fermé'}
- Site web: kadio.ca
- Réservation en ligne: kadio.ca
- Téléphone: ${salon.config.telephone || '(514) 919-5970'}

🧠 COMMENT TU FONCTIONNES:
1. Tu consultes l'historique de la conversation pour ne pas reposer des questions déjà répondues
2. Tu adaptes ton ton au client — plus familier si c'est un client régulier, plus formel pour un nouveau
3. Tu donnes des infos précises sur les prix et services
4. Tu guides vers la réservation en ligne sur kadio.ca
5. Tu proposes TOUJOURS l'option "Parler au propriétaire Othi" si le client semble insatisfait ou a une demande complexe
6. Tu utilises un français québécois naturel (pas trop soutenu, chaleureux)

⚠️ RÈGLES IMPORTANTES:
- Ne jamais inventer des prix ou services qui ne sont pas dans la liste
- Si tu ne connais pas la réponse, dis-le honnêtement et propose de transférer au propriétaire
- Si le client est mécontent ou a un problème sérieux → propose immédiatement de parler à Othi
- Garde tes réponses concises (max 3-4 phrases) sauf si le client demande des détails
- À la fin de chaque conversation, rappelle que le client peut toujours demander à "Parler au propriétaire" s'il le souhaite
- Ne dis JAMAIS que tu es une IA ou un bot — tu es l'assistante de Kadio Coiffure
- Si on te demande si tu es un robot/bot/IA, réponds que tu es l'assistante du salon et que le propriétaire Othi est toujours disponible si le client préfère parler à lui directement

💬 TON STYLE:
- Chaleureuse et accueillante comme au salon
- Utilise des émojis avec modération (1-2 max par message)
- Tutoie si le client tutoie, vouvoie sinon
- Appelle le client par son prénom si tu le connais`

    // Appel Claude Haiku pour rapidité et coût
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 500,
        system: systemPrompt,
        messages: conversationMessages.slice(-20), // Garder les 20 derniers messages max
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Claude API error:', data)
      return generateBasicReply(message, senderName)
    }

    const reply = data.content
      ?.filter(b => b.type === 'text')
      .map(b => b.text)
      .join('\n') || generateBasicReply(message, senderName)

    return reply
  } catch (e) {
    console.error('AI reply error:', e.message)
    return generateBasicReply(message, senderName)
  }
}

// ── Réponse basique (fallback sans IA) ──
function generateBasicReply(message, senderName) {
  const msg = message.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  const greetings = ['salut', 'bonjour', 'hello', 'hi', 'hey', 'allo', 'bonsoir']

  if (greetings.some(g => msg.includes(g))) {
    return `Bonjour${senderName ? ' ' + senderName : ''} ! Bienvenue chez Kadio Coiffure ✂️\n\nComment puis-je vous aider ? Vous pouvez me demander nos services, tarifs ou prendre un rendez-vous.\n\nSi vous préférez, tapez "Parler au propriétaire" pour joindre Othi directement.`
  }

  return `Merci pour votre message ! Notre équipe vous répondra très bientôt.\n\nEn attendant, visitez kadio.ca pour découvrir nos services et réserver.\n\nTapez "Parler au propriétaire" si vous souhaitez joindre Othi directement. 🙏`
}

// ── Logger le message dans Supabase ──
async function logMessage(data) {
  try {
    await supabase.from('messages_sociaux').insert({
      platform: data.platform,
      sender_id: data.senderId,
      sender_name: data.senderName || null,
      message: data.message,
      direction: data.direction,
      reply: data.reply || null,
      escalade: data.escalade || false,
      raw_data: data.raw || null,
      created_at: new Date().toISOString(),
    })
  } catch (e) {
    console.log('Log message error:', e.message)
  }
}

// ── Traiter les messages Messenger ──
async function handleMessenger(entry) {
  for (const event of entry) {
    const messaging = event.messaging || []
    for (const msg of messaging) {
      if (msg.message && msg.message.text) {
        const senderId = msg.sender.id
        const text = msg.message.text

        const reply = await generateAIReply(text, null, 'messenger', senderId)
        await sendMessage(senderId, reply, 'messenger')

        await logMessage({
          platform: 'messenger',
          senderId,
          message: text,
          direction: 'entrant',
          reply,
          escalade: wantsEscalation(text),
          raw: msg,
        })
      }
    }
  }
}

// ── Traiter les messages Instagram ──
async function handleInstagram(entry) {
  for (const event of entry) {
    const messaging = event.messaging || []
    for (const msg of messaging) {
      if (msg.message && msg.message.text) {
        const senderId = msg.sender.id
        const text = msg.message.text

        const reply = await generateAIReply(text, null, 'instagram', senderId)
        await sendMessage(senderId, reply, 'messenger')

        await logMessage({
          platform: 'instagram',
          senderId,
          message: text,
          direction: 'entrant',
          reply,
          escalade: wantsEscalation(text),
          raw: msg,
        })
      }
    }
  }
}

// ── Traiter les messages WhatsApp ──
async function handleWhatsApp(entry) {
  for (const event of entry) {
    const changes = event.changes || []
    for (const change of changes) {
      if (change.field === 'messages' && change.value?.messages) {
        for (const msg of change.value.messages) {
          if (msg.type === 'text') {
            const senderId = msg.from
            const text = msg.text.body
            const senderName = change.value.contacts?.[0]?.profile?.name || null

            const reply = await generateAIReply(text, senderName, 'whatsapp', senderId)
            await sendMessage(senderId, reply, 'whatsapp')

            await logMessage({
              platform: 'whatsapp',
              senderId,
              senderName,
              message: text,
              direction: 'entrant',
              reply,
              escalade: wantsEscalation(text),
              raw: msg,
            })
          }
        }
      }
    }
  }
}

// ── Handler principal ──
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()

  // ── GET: Vérification du webhook par Meta ──
  if (req.method === 'GET') {
    const mode = req.query['hub.mode']
    const token = req.query['hub.verify_token']
    const challenge = req.query['hub.challenge']

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('Webhook verified!')
      return res.status(200).send(challenge)
    }
    return res.status(403).json({ error: 'Verification failed' })
  }

  // ── POST: Événements entrants ──
  if (req.method === 'POST') {
    const body = req.body

    try {
      if (body.object === 'page') {
        await handleMessenger(body.entry || [])
      } else if (body.object === 'instagram') {
        await handleInstagram(body.entry || [])
      } else if (body.object === 'whatsapp_business_account') {
        await handleWhatsApp(body.entry || [])
      }

      return res.status(200).json({ status: 'ok' })
    } catch (error) {
      console.error('Webhook error:', error)
      return res.status(200).json({ status: 'error', message: error.message })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
