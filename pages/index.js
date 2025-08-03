// This file should go in your GitHub repo under `/pages/index.js`

import { useState } from 'react';

export default function Home() {
  const [faff, setFaff] = useState('');
  const [industry, setIndustry] = useState('');
  const [email, setEmail] = useState('');
  const [score, setScore] = useState(null);
  const [aiResponse, setAiResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setScore(Math.floor(Math.random() * 11) + 15);
    setLoading(true);

    try {
      const response = await fetch('/api/fix-faff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ faff, industry })
      });
      const data = await response.json();
      setAiResponse(data.solution);
    } catch (error) {
      console.error('API error:', error);
      setAiResponse('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '20px', background: '#F2E5CF', textAlign: 'center' }}>
      <img src="https://i.ibb.co/0jh8s01G/Chat-GPT-Image-Aug-3-2025-02-22-03-PM.png" alt="Fix Your Faff Logo" style={{ maxWidth: '200px', marginBottom: '20px' }} />
      <form onSubmit={handleSubmit} style={{ background: 'white', padding: '20px', borderRadius: '8px', maxWidth: '500px', margin: 'auto', boxShadow: '0 0 10px rgba(0,0,0,0.1)', textAlign: 'left' }}>
        <label>What's the faff?</label>
        <textarea value={faff} onChange={(e) => setFaff(e.target.value)} required style={{ width: '100%', padding: '8px', marginTop: '5px' }} />

        <label>Your industry</label>
        <input type="text" value={industry} onChange={(e) => setIndustry(e.target.value)} required style={{ width: '100%', padding: '8px', marginTop: '5px' }} />

        <label>Your email (optional)</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '8px', marginTop: '5px' }} />

        <button type="submit" style={{ marginTop: '15px', padding: '10px 20px', background: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'block', marginLeft: 'auto', marginRight: 'auto' }}>Fix my faff</button>
      </form>

      {score && (
        <div style={{ marginTop: '20px', background: '#e0ffe0', padding: '10px', borderRadius: '6px', maxWidth: '700px', margin: '20px auto', textAlign: 'left' }}>
          <p><strong>Faff Score:</strong> {score}/25</p>
          {loading ? <p><em>AI is fixing your faff...</em></p> : <p><strong>Your AI-powered solution:</strong> {aiResponse}</p>}
        </div>
      )}
    </div>
  );
}
