// ═══════════════════════════════════════════════════════
// KADIO AI — Voice Synthesis (OpenAI TTS)
// Voix naturelle en francais pour l'assistant
// ═══════════════════════════════════════════════════════

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'OPENAI_API_KEY non configuree' });
  }

  try {
    const { text, voice, speed } = req.body;

    if (!text || text.length === 0) {
      return res.status(400).json({ error: 'text requis' });
    }

    // Voix disponibles OpenAI TTS:
    // alloy (neutre), echo (grave), fable (expressif), onyx (grave pro),
    // nova (feminin doux), shimmer (feminin clair)
    const selectedVoice = voice || 'onyx';
    const selectedSpeed = speed || 1.0;

    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'tts-1-hd',
        input: text,
        voice: selectedVoice,
        speed: selectedSpeed,
        response_format: 'mp3',
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return res.status(response.status).json({ error: error.message || 'Erreur OpenAI TTS' });
    }

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'no-cache');

    const buffer = await response.arrayBuffer();
    res.send(Buffer.from(buffer));
  } catch (error) {
    console.error('AI Voice error:', error.message);
    return res.status(500).json({ error: 'Erreur interne' });
  }
}
