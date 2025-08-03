// This file should go in your GitHub repo under `/pages/index.js`

import { useState } from 'react';

export default function Home() {
  const [faff, setFaff] = useState('');
  const [industry, setIndustry] = useState('');
  const [score, setScore] = useState(null);
  const [aiResponse, setAiResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [followUpEmail, setFollowUpEmail] = useState('');
  const [consent, setConsent] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setScore(Math.floor(Math.random() * 11) + 15);
    setLoading(true);
    setSubmitted(true);

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

  const formatResponse = (text) => {
    return text.split(/\n|\r/).filter(p => p.trim() !== '').map((p, idx) => <p key={idx}>{p}</p>);
  };

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '20px', background: '#F2E5CF', textAlign: 'center' }}>
      <img src="https://i.ibb.co/M5N2YVjh/Chat-GPT-Image-Aug-3-2025-09-37-53-PM.png" alt="Fix Your Faff Logo" style={{ maxWidth: '200px', marginBottom: '20px' }} />
      <form onSubmit={handleSubmit} style={{ background: 'white', padding: '20px', borderRadius: '8px', maxWidth: '500px', margin: 'auto', boxShadow: '0 0 10px rgba(0,0,0,0.1)', textAlign: 'left' }}>
        <label>What's the faff?</label>
        <textarea value={faff} onChange={(e) => setFaff(e.target.value)} required style={{ width: '100%', padding: '8px 12px', margin: '5px 0 10px 0' }} />

        <label>Your industry</label>
        <input type="text" value={industry} onChange={(e) => setIndustry(e.target.value)} required style={{ width: '100%', padding: '8px 12px', margin: '5px 0 10px 0' }} />

        <button type="submit" style={{ marginTop: '15px', padding: '10px 20px', background: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'block', marginLeft: 'auto', marginRight: 'auto' }}>Fix my faff</button>
      </form>

      {score && (
        <div style={{ marginTop: '20px', background: '#e0ffe0', padding: '10px', borderRadius: '6px', maxWidth: '700px', margin: '20px auto', textAlign: 'left' }}>
          <p><strong>Faff Score:</strong> {score}/25</p>
          {loading ? (
            <p><em>The Faff Doctor is Preparing Your Prescription...</em></p>
          ) : (
            <>
              <p><strong>Your Faff Free Prescription:</strong></p>
              <div>{formatResponse(aiResponse)}</div>

              <form style={{ marginTop: '20px' }}>
                <label>Would you like your Fix Faff Prescription Implemented for Free? Include your email here to be considered.</label>
                <input type="email" value={followUpEmail} onChange={(e) => setFollowUpEmail(e.target.value)} placeholder="Enter your email" style={{ width: '100%', padding: '8px 12px', marginTop: '5px' }} />

                <label style={{ display: 'block', marginTop: '10px' }}>
                  <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} /> Please keep me posted on Fix Faff insights and advice
                </label>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
}
