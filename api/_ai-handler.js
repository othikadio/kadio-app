import { getSupabase, TOOLS, executeTool } from './_ai-tools.js';

// KADIO AI - Multi-Agent Orchestrator Handler

async function loadAIContext(supabase) {
  try {
    const [memoriesRes, stylesRes, recentConvsRes] = await Promise.all([
      supabase.from('ai_memory').select('category, key, value').eq('active', true).order('importance', { ascending: false }).limit(30),
      supabase.from('ai_style_examples').select('context, good_response, category').eq('active', true).limit(20),
      supabase.from('ai_conversations').select('summary, started_at, channel').not('summary', 'is', null).order('started_at', { ascending: false }).limit(5),
    ]);
    return { memories: memoriesRes.data || [], styles: stylesRes.data || [], recentConversations: recentConvsRes.data || [] };
  } catch (err) { return { memories: [], styles: [], recentConversations: [] }; }
}

function buildSystemPrompt(context) {
  let prompt = 'Tu es Kadio, le Chef IA de Kadio Coiffure. Un assistant ultra-intelligent qui gere un salon de coiffure afro premium a Longueuil, Quebec.\n\nTu es le CHEF d\'une equipe d\'agents IA. Quand le proprietaire (Othi) te donne une directive, tu EXECUTES en utilisant tes outils.\n\nCapacites: book_appointment, check_schedule, get_client_info, send_sms, get_business_stats, manage_employee, create_transaction, manage_inventory\n\nSalon: Kadio Coiffure, Longueuil QC. Fondateur: Othi Kadio. Services: Tresses 150$+, Cornrows 80$+, Locs, Barbier, Kids, Soins, Coloration. Horaires: Lun-Ven 10h-19h, Sam 10h-18h, Dim ferme.\n\nStyle: francais quebecois naturel, chaleureux, professionnel. Reponses COURTES (2-3 phrases). Tutois. Pas de markdown.\n\nRegles: Client veut RDV -> book_appointment. Stats -> get_business_stats. Dispos -> check_schedule. NE DIS JAMAIS je suis une IA.';
  if (context.memories.length > 0) { prompt += '\n\nConnaissances:'; context.memories.forEach(m => { prompt += '\n- ' + m.key + ': ' + m.value; }); }
  if (context.styles.length > 0) { prompt += '\n\nExemples:'; context.styles.forEach(s => { prompt += '\n"' + s.context + '" -> "' + s.good_response + '"'; }); }
  return prompt;
}

async function callClaude(systemPrompt, messages, tools) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 1024, system: systemPrompt, messages, tools }),
  });
  if (!response.ok) { console.error('Claude error:', response.status); return null; }
  return response.json();
}

async function callOpenAI(systemPrompt, messages) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  const msgs = [{ role: 'system', content: systemPrompt }, ...messages.map(m => ({ role: m.role, content: typeof m.content === 'string' ? m.content : m.content.map(c => c.text || '').join('') }))];
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + apiKey },
    body: JSON.stringify({ model: 'gpt-4o', messages: msgs, temperature: 0.7, max_tokens: 500 }),
  });
  if (!response.ok) return null;
  return (await response.json()).choices?.[0]?.message?.content;
}

async function callMistral(systemPrompt, messages) {
  const apiKey = process.env.MISTRAL_API_KEY;
  if (!apiKey) return null;
  const msgs = [{ role: 'system', content: systemPrompt }, ...messages.map(m => ({ role: m.role, content: typeof m.content === 'string' ? m.content : m.content.map(c => c.text || '').join('') }))];
  const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + apiKey },
    body: JSON.stringify({ model: 'mistral-small-latest', messages: msgs, temperature: 0.7, max_tokens: 300 }),
  });
  if (!response.ok) return null;
  return (await response.json()).choices?.[0]?.message?.content;
}

async function saveConversation(supabase, convId, userMsg, aiReply, channel) {
  try {
    if (!convId) { const { data } = await supabase.from('ai_conversations').insert({ channel: channel || 'dashboard' }).select('id').single(); convId = data?.id; }
    if (!convId) return null;
    await supabase.from('ai_messages').insert([{ conversation_id: convId, role: 'user', content: userMsg }, { conversation_id: convId, role: 'assistant', content: aiReply }]);
    return convId;
  } catch (err) { return convId; }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { messages, conversation_id, channel } = req.body;
    if (!messages || !Array.isArray(messages) || messages.length === 0) return res.status(400).json({ error: 'messages array requis' });

    const supabase = getSupabase();
    let systemPrompt = '';
    let convId = conversation_id || null;

    if (supabase) {
      const ctx = await loadAIContext(supabase);
      systemPrompt = buildSystemPrompt(ctx);
      if (convId) {
        const { data: hist } = await supabase.from('ai_messages').select('role, content').eq('conversation_id', convId).order('created_at', { ascending: true }).limit(20);
        if (hist && hist.length > 0) { const last = messages[messages.length - 1]; messages.length = 0; messages.push(...hist.map(m => ({ role: m.role, content: m.content })), last); }
      }
    }

    const startTime = Date.now();
    let reply = null, model_used = 'none', tool_calls = [];

    if (process.env.ANTHROPIC_API_KEY) {
      const cMsgs = messages.map(m => ({ role: m.role, content: m.content }));
      let cRes = await callClaude(systemPrompt, cMsgs, TOOLS);
      if (cRes) {
        model_used = 'claude';
        let iter = 5;
        while (cRes && cRes.stop_reason === 'tool_use' && iter > 0) {
          const tbs = cRes.content.filter(b => b.type === 'tool_use');
          const results = [];
          for (const tb of tbs) {
            const result = await executeTool(tb.name, tb.input, supabase);
            tool_calls.push({ tool: tb.name, input: tb.input, result });
            results.push({ type: 'tool_result', tool_use_id: tb.id, content: JSON.stringify(result) });
          }
          cMsgs.push({ role: 'assistant', content: cRes.content });
          cMsgs.push({ role: 'user', content: results });
          cRes = await callClaude(systemPrompt, cMsgs, TOOLS);
          iter--;
        }
        if (cRes && cRes.content) reply = cRes.content.filter(b => b.type === 'text').map(b => b.text).join('');
      }
    }

    if (!reply && process.env.OPENAI_API_KEY) { reply = await callOpenAI(systemPrompt, messages); if (reply) model_used = 'gpt-4o'; }
    if (!reply && process.env.MISTRAL_API_KEY) { reply = await callMistral(systemPrompt, messages); if (reply) model_used = 'mistral'; }
    if (!reply) return res.status(500).json({ error: 'Aucune cle API configuree' });

    const responseTime = Date.now() - startTime;
    if (supabase) {
      const uMsg = messages[messages.length - 1]?.content || '';
      convId = await saveConversation(supabase, convId, typeof uMsg === 'string' ? uMsg : 'tool_result', reply, channel);
    }

    return res.status(200).json({ success: true, reply, conversation_id: convId, model: model_used, tools_used: tool_calls.map(t => t.tool), response_time: responseTime });
  } catch (error) {
    console.error('AI Orchestrator error:', error.message);
    return res.status(500).json({ error: 'Erreur interne du serveur' });
  }
}
