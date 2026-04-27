import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const supabase = getSupabase();
  if (!supabase) return res.status(500).json({ error: 'Supabase non configure' });

  try {
    const { message_id, conversation_id, feedback, note, message_content, user_question } = req.body;

    if (!feedback || !['good', 'bad'].includes(feedback)) {
      return res.status(400).json({ error: 'feedback doit etre "good" ou "bad"' });
    }

    // ── Option 1: Feedback par message_id ──
    if (message_id) {
      await supabase
        .from('ai_messages')
        .update({ feedback, feedback_note: note || null })
        .eq('id', message_id);
    }

    // ── Option 2: Feedback par contenu (quand on n'a pas le message_id) ──
    if (!message_id && conversation_id && message_content) {
      const { data: msgs } = await supabase
        .from('ai_messages')
        .select('id')
        .eq('conversation_id', conversation_id)
        .eq('role', 'assistant')
        .eq('content', message_content)
        .order('created_at', { ascending: false })
        .limit(1);

      if (msgs && msgs.length > 0) {
        await supabase
          .from('ai_messages')
          .update({ feedback, feedback_note: note || null })
          .eq('id', msgs[0].id);
      }
    }

    // ── Si bon feedback → sauvegarder comme exemple de style ──
    if (feedback === 'good' && message_content && user_question) {
      await supabase
        .from('ai_style_examples')
        .insert({
          context: user_question.substring(0, 200),
          good_response: message_content.substring(0, 500),
          category: 'learned',
          source: 'feedback',
        })
        .select();
    }

    // ── Si mauvais feedback → sauvegarder le mauvais exemple ──
    if (feedback === 'bad' && message_content && user_question) {
      const existing = await supabase
        .from('ai_style_examples')
        .select('id')
        .eq('context', user_question.substring(0, 200))
        .eq('source', 'negative_feedback')
        .limit(1);

      if (!existing.data?.length) {
        await supabase
          .from('ai_style_examples')
          .insert({
            context: user_question.substring(0, 200),
            bad_response: message_content.substring(0, 500),
            good_response: note || 'A ameliorer - voir le contexte',
            category: 'correction',
            source: 'negative_feedback',
          })
          .select();
      }
    }

    // ── Mettre a jour une memoire si le feedback contient une note ──
    if (note && note.length > 10) {
      await supabase
        .from('ai_memory')
        .upsert({
          category: 'feedback',
          key: `feedback_${Date.now()}`,
          value: note,
          importance: feedback === 'bad' ? 8 : 6,
          source: 'user_feedback',
        })
        .select();
    }

    return res.status(200).json({ success: true, message: 'Feedback enregistre, merci!' });
  } catch (error) {
    console.error('AI Feedback error:', error.message);
    return res.status(500).json({ error: 'Erreur interne' });
  }
}
