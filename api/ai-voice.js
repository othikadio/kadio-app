// KADIO AI — Voice Synthesis (OpenAI TTS)
// Returns base64 audio for reliable binary transfer on Vercel

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
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch(e) { body = {}; }
    }
    if (!body || typeof body !== 'object') body = {};

    const text = body.text;
    const voice = body.voice;
    const speed = body.speed;

    if (!text || text.length === 0) {
      return res.status(400).json({ error: 'text requis' });
    }

    const inputText = text.substring(0, 4096);
    const selectedVoice = voice || 'onyx';
    const selectedSpeed = speed || 1.0;

    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + apiKey,
      },
      body: JSON.stringify({
        model: 'tts-1-hd',
        input: inputText,
        voice: selectedVoice,
        speed: selectedSpeed,
        response_format: 'mp3',
      }),
    });

    if (!response.ok) {
      const errText = await response.text().catch(function() { return ''; });
      let errMsg = 'Erreur OpenAI TTS';
      try {
        const errJson = JSON.parse(errText);
        errMsg = (errJson.error && errJson.error.message) || errMsg;
      } catch(e) {}
      return res.status(response.status).json({ error: errMsg });
    }

    // Base64 encode for reliable Vercel binary transfer
    const arrayBuf = await response.arrayBuffer();
    const base64Audio = Buffer.from(arrayBuf).toString('base64');

    return res.status(200).json({
      audio: base64Audio,
      format: 'mp3',
      size: arrayBuf.byteLength
    });
  } catch (error) {
    console.error('AI Voice error:', error.message);
    return res.status(500).json({
      error: 'Erreur interne',
      detail: error.message
    });
  }
}
