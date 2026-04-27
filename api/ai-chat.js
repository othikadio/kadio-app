import { createClient } from '@supabase/supabase-js';

// ─── Supabase client (server-side with service role) ───
function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

// ─── System prompt de base ───
const BASE_PROMPT = `Tu es Kadio, l'assistant vocal intelligent de Kadio Coiffure. Tu reponds TOUJOURS de facon courte et naturelle, comme si tu parlais au telephone. Maximum 2-3 phrases par reponse.

## Le salon
- Kadio Coiffure : salon premium coiffure afro a Longueuil, Quebec
- Fondateur : Othi Kadio
- Services : Tresses, Locs, Barbier, Kids, Soins capillaires, Coloration
- Horaires : Lun-Ven 10h-19h, Sam 10h-18h, Dim ferme
- Reservation en ligne sur kadio.ca ou par telephone

## Ton style
- Tu parles en francais quebecois naturel, chaleureux et professionnel
- Tu es comme un(e) receptionniste expert(e) qui connait tout sur les cheveux afro
- Tes reponses sont COURTES (tu parles, pas tu ecris un roman)
- Tu tutois le client naturellement
- Tu peux aider avec : RDV, prix, conseils capillaires, infos salon
- Pour Othi (le proprio), tu aides aussi avec la gestion business

## Regles
- Jamais de listes a puces dans tes reponses (c'est vocal!)
- Pas de formatage markdown
- Reponds comme si tu parlais au telephone
- Sois direct et utile`;

// ─── Charger la memoire et le style depuis Supabase ───
async function loadAIContext(supabase) {
  try {
    const [memoriesRes, stylesRes, recentConvsRes] = await Promise.all([
      supabase
        .from('ai_memory')
        .select('category, key, value')
        .eq('active', true)
        .order('importance', { ascending: false })
        .limit(30),
      supabase
        .from('ai_style_examples')
        .select('context, good_response, category')
        .eq('active', true)
        .limit(20),
      supabase
        .from('ai_conversations')
        .select('summary, started_at, channel')
        .not('summary', 'is', null)
        .order('started_at', { ascending: false })
        .limit(5),
    ]);

    return {
      memories: memoriesRes.data || [],
      styles: stylesRes.data || [],
      recentConversations: recentConvsRes.data || [],
    };
  } catch (err) {
    console.error('Error loading AI context:', err.message);
    return { memories: [], styles: [], recentConversations: [] };
  }
}

// ─── Construire le prompt enrichi avec la memoire ───
function buildEnrichedPrompt(context) {
  let prompt = BASE_PROMPT;

  if (context.memories.length > 0) {
    prompt += '\n\n## Connaissances memorisees (utilise-les naturellement)';
    const grouped = {};
    context.memories.forEach(m => {
      if (!grouped[m.category]) grouped[m.category] = [];
      grouped[m.category].push(`${m.key}: ${m.value}`);
    });
    Object.entries(grouped).forEach(([cat, items]) => {
      prompt += `\n### ${cat}`;
      items.forEach(item => { prompt += `\n- ${item}`; });
    });
  }

  if (context.styles.length > 0) {
    prompt += '\n\n## Exemples de comment tu dois parler (apprends de ces exemples)';
    context.styles.forEach(s => {
      prompt += `\nSituation: "${s.context}" → Bonne reponse: "${s.good_response}"`;
    });
  }

  if (context.recentConversations.length > 0) {
    prompt += '\n\n## Conversations recentes (pour contexte)';
    context.recentConversations.forEach(c => {
      const date = new Date(c.started_at).toLocaleDateString('fr-CA');
      prompt += `\n- ${date} (${c.channel}): ${c.summary}`;
    });
  }

  return prompt;
}

// ─── Sauvegarder la conversation ───
async function saveConversation(supabase, conversationId, userMessage, aiReply, channel) {
  try {
    let convId = conversationId;

    if (!convId) {
      const { data } = await supabase
        .from('ai_conversations')
        .insert({ channel: channel || 'dashboard' })
        .select('id')
        .single();
      convId = data?.id;
    }

    if (!convId) return null;

    await supabase.from('ai_messages').insert([
      { conversation_id: convId, role: 'user', content: userMessage },
      { conversation_id: convId, role: 'assistant', content: aiReply },
    ]);

    return convId;
  } catch (err) {
    console.error('Error saving conversation:', err.message);
    return conversationId;
  }
}

// ─── Generer un resume de conversation (apres 6+ messages) ───
async function maybeUpdateSummary(supabase, conversationId, mistralKey) {
  try {
    const { data: messages } = await supabase
      .from('ai_messages')
      .select('role, content')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (!messages || messages.length < 6) return;

    const { data: conv } = await supabase
      .from('ai_conversations')
      .select('summary')
      .eq('id', conversationId)
      .single();

    if (conv?.summary) return;

    const convoText = messages.map(m => `${m.role}: ${m.content}`).join('\n');
    const summaryRes = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${mistralKey}`,
      },
      body: JSON.stringify({
        model: 'mistral-small-latest',
        messages: [
          { role: 'system', content: 'Resume cette conversation en 1-2 phrases courtes en francais. Juste les faits importants.' },
          { role: 'user', content: convoText },
        ],
        temperature: 0.3,
        max_tokens: 100,
      }),
    });

    if (summaryRes.ok) {
      const summaryData = await summaryRes.json();
      const summary = summaryData.choices?.[0]?.message?.content;
      if (summary) {
        await supabase
          .from('ai_conversations')
          .update({ summary, ended_at: new Date().toISOString() })
          .eq('id', conversationId);
      }
    }
  } catch (err) {
    console.error('Error updating summary:', err.message);
  }
}

// ─── Apprendre des feedbacks (amelioration continue) ───
async function learnFromFeedback(supabase) {
  try {
    const { data: goodFeedbacks } = await supabase
      .from('ai_messages')
      .select('content, conversation_id')
      .eq('role', 'assistant')
      .eq('feedback', 'good')
      .order('created_at', { ascending: false })
      .limit(5);

    if (!goodFeedbacks || goodFeedbacks.length === 0) return;

    for (const fb of goodFeedbacks) {
      const { data: prevMsg } = await supabase
        .from('ai_messages')
        .select('content')
        .eq('conversation_id', fb.conversation_id)
        .eq('role', 'user')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (prevMsg) {
        await supabase
          .from('ai_style_examples')
          .upsert({
            context: prevMsg.content.substring(0, 200),
            good_response: fb.content.substring(0, 500),
            category: 'learned',
            source: 'feedback',
          }, { onConflict: 'context' })
          .select();
      }
    }
  } catch (err) {
    console.error('Error learning from feedback:', err.message);
  }
}

// ═════════════════════════════════════════════════════
// HANDLER PRINCIPAL
// ═════════════════════════════════════════════════════
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const mistralKey = process.env.MISTRAL_API_KEY;
  if (!mistralKey) return res.status(500).json({ error: 'MISTRAL_API_KEY non configuree' });

  try {
    const { messages, conversation_id, channel } = req.body;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'messages array requis' });
    }

    const supabase = getSupabase();
    let systemPrompt = BASE_PROMPT;
    let convId = conversation_id || null;

    // ── Charger le contexte IA depuis Supabase ──
    if (supabase) {
      const context = await loadAIContext(supabase);
      systemPrompt = buildEnrichedPrompt(context);

      if (convId) {
        const { data: historyMsgs } = await supabase
          .from('ai_messages')
          .select('role, content')
          .eq('conversation_id', convId)
          .order('created_at', { ascending: true })
          .limit(20);

        if (historyMsgs && historyMsgs.length > 0) {
          const history = historyMsgs.map(m => ({ role: m.role, content: m.content }));
          const lastUserMsg = messages[messages.length - 1];
          messages.length = 0;
          messages.push(...history, lastUserMsg);
        }
      }

      learnFromFeedback(supabase).catch(() => {});
    }

    // ── Appel Mistral ──
    const startTime = Date.now();
    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${mistralKey}`,
      },
      body: JSON.stringify({
        model: 'mistral-small-latest',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      console.error('Mistral error:', JSON.stringify(errData));
      return res.status(response.status).json({ error: errData.message || 'Erreur Mistral' });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content;
    const responseTime = Date.now() - startTime;

    // ── Sauvegarder la conversation ──
    if (supabase) {
      const userMsg = messages[messages.length - 1]?.content || '';
      convId = await saveConversation(supabase, convId, userMsg, reply, channel);

      if (convId) {
        maybeUpdateSummary(supabase, convId, mistralKey).catch(() => {});
      }
    }

    return res.status(200).json({
      success: true,
      reply: reply || "Desole, je n'ai pas compris. Peux-tu reformuler?",
      conversation_id: convId,
      usage: data.usage,
      response_time: responseTime,
    });
  } catch (error) {
    console.error('AI Chat error:', error.message);
    return res.status(500).json({ error: 'Erreur interne du serveur' });
  }
}
