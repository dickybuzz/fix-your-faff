// This file should go in your GitHub repo under `/pages/api/fix-faff.js`

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { faff, industry } = req.body;

  const prompt = `You are a practical process strategist who saves people time and money by combining simple software and AI.

Task: Help the user solve this problem: ${faff}. 
Industry: ${industry}.

1. Recommend low-cost, easy-to-use software to help with this task. Keep it simple and list the top 2-3 options.

2. Provide specific AI prompts that the user can copy and paste into ChatGPT or similar tools. These prompts must deliver real value, be practical, and help automate or simplify the task. Format them clearly like this:

Example AI Prompt: "Analyse my past timesheets and predict how much time I'm likely to spend on [Insert task or project]."

3. Suggest how the user can combine the software and AI prompts into a simple MVP (minimum viable process) they can try right away.

4. Optional: Suggest one idea to improve or expand the solution if the MVP works well.

Keep your answer short, plain, and practical - in UK English. No jargon. No theoretical waffle. Just useful tools, clear AI prompts, and a simple way to take action.`;

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

