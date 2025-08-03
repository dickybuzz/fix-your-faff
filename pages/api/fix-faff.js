// This file should go in your GitHub repo under `/pages/api/fix-faff.js`

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { faff, industry } = req.body;

  const prompt = `Act as a practical process strategist who specialises in saving time and money by blending simple software with integrated AI. Your job is to help the user solve this problem: ${faff}. Industry: ${industry}. 

You must:
1. Recommend straightforward, low-cost tools anyone can use.
2. Suggest specific, ready-to-use AI prompts that can slot into the process to do the heavy lifting.
3. Show how these can be combined into a quick and easy MVP (minimum viable process) the user can test straight away.
4. Outline a sensible development path if it works - keep it grounded.

Use plain UK English with a friendly, can-do tone that reassures the user this is achievable - no jargon, no fluff. Your answer should give them the confidence and clarity to take action now, without needing a tech degree or a massive budget.`;


  try {
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 500,
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

