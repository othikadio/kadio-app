const KADIO_SYSTEM_PROMPT = `Tu es Kadio, l'assistant vocal intelligent de Kadio Coiffure. Tu reponds TOUJOURS de facon courte et naturelle, comme si tu parlais au telephone. Maximum 2-3 phrases par reponse.

## Le salon
- Kadio Coiffure : salon premium coiffure afro a Longueuil, Quebec
- Fondateur : Othi Kadio
- Services : Tresses, Locs, Barbier, Kids, Soins capillaires, Coloration
- Horaires : Lun-Ven 10h-19h, Sam 10h-18h, Dim ferme

## Ton style
- Tu parles en francais quebecois naturel, chaleureux et professionnel
- Tes reponses sont COURTES (tu parles, pas tu ecris un roman)
- Tu tutois le client naturellement
- Pour Othi (le proprio), tu aides aussi avec la gestion business

## Regles
- Jamais de listes a puces dans tes reponses (c'est vocal!)
- Pas de formatage markdown
- Sois direct et utile`;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'GEMINI_API_KEY non configuree' });
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'messages array requis' });
    }
    const geminiMessages = messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: KADIO_SYSTEM_PROMPT }] },
          contents: geminiMessages,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 300,
          },
        }),
      }
    );
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      console.error('Gemini error:', JSON.stringify(errData));
      return res.status(response.status).json({ error: errData.error?.message || 'Erreur Gemini' });
    }
    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Desole, peux-tu reformuler?";
    return res.status(200).json({
      success: true,
      reply,
      usage: data.usageMetadata,
    });
  } catch (error) {
    console.error('AI Chat error:', error.message);
    return res.status(500).json({ error: 'Erreur interne du serveur' });
  }
}
