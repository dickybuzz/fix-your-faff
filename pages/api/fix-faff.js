// This file should go in your GitHub repo under `/pages/api/fix-faff.js`

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { faff, industry } = req.body;

  const prompt = `Act as an expert process strategist specialising in integrating AI and low-cost software into processes that waste time and money. Use non-techie plain UK English and an upbeat tone to create a practical and pragmatic solution that integrates AI prompts to solve: ${faff}. Industry: ${industry}. Use your process insights to create an integrated new process to save time, effort and money for your client. Research low-cost available software to consider and integrate into the solution to create a quick win. Include an MVP to test the solution out as quickly as possible, with a future development pathway if it proves successful. Detail the AI prompts that will be needed at each stage. Use plain UK English suitable for a non-techie audience to explain the steps.`;

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

