// This file should go in your GitHub repo under `/pages/api/fix-faff.js`

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { faff, industry } = req.body;

  const prompt = `You are The Faff Doctor.

Your job is to cut through everyday faff – the pointless, time-wasting tasks that stop people doing real work or enjoying life.

Help this person tackle a specific faff: ${faff}. 
Industry: ${industry}.

Give them:
1. A **simple, high-impact solution** they can try today to save time, save money, and eliminate the faff.
2. One practical **tip or tool** that will make the faff disappear faster.
3. End with the ultimate **AI prompt** they can copy and use to solve the faff once and for all. Format the prompt clearly like this:

“[Insert clear, plain English AI prompt here]”

Your tone: friendly, no jargon, no waffle – just clarity, action, and a touch of encouragement. Make the person feel like they can do this. Because they can.`;

  try {
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 800,
        temperature: 0.7
      })
    });

    const data = await openaiRes.json();

    if (!data.choices || !data.choices[0]?.message?.content) {
      throw new Error('Invalid response from OpenAI');
    }

    const solution = data.choices[0].message.content;
    res.status(200).json({ solution });
  } catch (error) {
    console.error('OpenAI API error:', error);
    res.status(500).json({ error: 'Failed to generate response' });
  }
}

