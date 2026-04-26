// Vercel Serverless — Meta Webhook Handler (Messenger + Instagram + WhatsApp)
// Reçoit les messages et événements de Facebook Messenger, Instagram DM et WhatsApp
import { createClient } from '@supabase/supabase-js'

const VERIFY_TOKEN = process.env.META_WEBHOOK_VERIFY_TOKEN || 'kadio_webhook_2024'
const PAGE_ACCESS_TOKEN = process.env.META_PAGE_ACCESS_TOKEN
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

// ── Générer une réponse automatique IA ──
async function generateAutoReply(message, senderName, platform) {
  // Réponses automatiques de base — l'IA du salon peut prendre le relais
  const greetings = ['salut', 'bonjour', 'hello', 'hi', 'hey', 'allo', 'bonsoir']
  const prixKeywords = ['prix', 'tarif', 'combien', 'coute', 'coût', 'cost']
  const rdvKeywords = ['rendez-vous', 'rdv', 'réserver', 'booking', 'dispo', 'disponible']
  const horaireKeywords = ['horaire', 'heure', 'ouvert', 'fermé', 'ouvre']

  const msg = message.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

  if (greetings.some(g => msg.includes(g))) {
    return `Bonjour${senderName ? ' ' + senderName : ''} ! Bienvenue chez Kadio Coiffure. Comment puis-je vous aider ? Vous pouvez me demander nos services, tarifs ou prendre un rendez-vous.`
  }

  if (prixKeywords.some(k => msg.includes(k))) {
    // Récupérer les services depuis la DB
    const { data: services } = await supabase
      .from('services')
      .select('nom, prix, duree, categorie')
      .eq('actif', true)
      .order('categorie')
      .limit(10)

    if (services?.length) {
      const list = services.map(s => `- ${s.nom}: ${s.prix}$ (${s.duree} min)`).join('\n')
      return `Voici nos services populaires :\n\n${list}\n\nPour réserver, visitez kadio.ca ou répondez avec le service qui vous intéresse !`
    }
    return `Pour consulter nos tarifs, visitez kadio.ca/services. N'hésitez pas à nous demander un devis personnalisé !`
  }

  if (rdvKeywords.some(k => msg.includes(k))) {
    return `Pour prendre rendez-vous chez Kadio Coiffure :\n\n1. Visitez kadio.ca\n2. Choisissez votre service\n3. Sélectionnez votre coiffeuse\n4. Choisissez la date et l'heure\n\nOu dites-moi quel service vous intéresse et je vous aide à réserver !`
  }

  if (horaireKeywords.some(k => msg.includes(k))) {
    return `Kadio Coiffure est ouvert :\n\nLundi - Vendredi : 9h à 19h\nSamedi : 9h à 17h\nDimanche : Fermé\n\nAdresse : Longueuil, QC\n\nPrenez rendez-vous sur kadio.ca !`
  }

  // Réponse par défaut
  return `Merci pour votre message ! Un membre de l'équipe Kadio Coiffure vous répondra bientôt.\n\nEn attendant, visitez kadio.ca pour découvrir nos services et prendre rendez-vous.`
}

// ── Logger le message dans Supabase ──
async function logMessage(data) {
  try {
    await supabase.from('messages_sociaux').insert({
      platform: data.platform,
      sender_id: data.senderId,
      sender_name: data.senderName || null,
      message: data.message,
      direction: data.direction, // 'entrant' ou 'sortant'
      reply: data.reply || null,
      raw_data: data.raw || null,
      created_at: new Date().toISOString(),
    })
  } catch (e) {
    // Table n'existe peut-être pas encore, on continue
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

        // Générer une réponse
        const reply = await generateAutoReply(text, null, 'messenger')

        // Envoyer la réponse
        await sendMessage(senderId, reply, 'messenger')

        // Logger
        await logMessage({
          platform: 'messenger',
          senderId,
          message: text,
          direction: 'entrant',
          reply,
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

        const reply = await generateAutoReply(text, null, 'instagram')
        await sendMessage(senderId, reply, 'messenger') // Instagram utilise la même API

        await logMessage({
          platform: 'instagram',
          senderId,
          message: text,
          direction: 'entrant',
          reply,
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

            const reply = await generateAutoReply(text, senderName, 'whatsapp')
            await sendMessage(senderId, reply, 'whatsapp')

            await logMessage({
              platform: 'whatsapp',
              senderId,
              senderName,
              message: text,
              direction: 'entrant',
              reply,
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
  // CORS
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
        // Messages Messenger
        await handleMessenger(body.entry || [])
      } else if (body.object === 'instagram') {
        // Messages Instagram DM
        await handleInstagram(body.entry || [])
      } else if (body.object === 'whatsapp_business_account') {
        // Messages WhatsApp
        await handleWhatsApp(body.entry || [])
      }

      // Meta attend un 200 rapide
      return res.status(200).json({ status: 'ok' })
    } catch (error) {
      console.error('Webhook error:', error)
      return res.status(200).json({ status: 'error', message: error.message })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
