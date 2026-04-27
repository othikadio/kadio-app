const KADIO_SYSTEM_PROMPT = `Tu es Kadio, l'assistant vocal intelligent de Kadio Coiffure. Tu reponds TOUJOURS de facon courte et naturelle, comme si tu parlais au telephone. Maximum 2-3 phrases par reponse.

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

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.MISTRAL_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'MISTRAL_API_KEY non configuree' });

  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'messages array requis' });
    }

    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'mistral-small-latest',
        messages: [
          { role: 'system', content: KADIO_SYSTEM_PROMPT },
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

    return res.status(200).json({
      success: true,
      reply: reply || "Desole, je n'ai pas compris. Peux-tu reformuler?",
      usage: data.usage,
    });
  } catch (error) {
    console.error('AI Chat error:', error.message);
    return res.status(500).json({ error: 'Erreur interne du serveur' });
  }
}
