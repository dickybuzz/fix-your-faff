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
  const [aiPrompt, setAiPrompt] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const generatedScore = Math.floor(Math.random() * 11) + 15;
    setScore(generatedScore);
    setLoading(true);
    setSubmitted(true);

    try {
      const response = await fetch('/api/fix-faff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ faff, industry, score: generatedScore })
      });
      const data = await response.json();
      setAiResponse(data.solution);
      setAiPrompt(data.solution);

      // Log initial submission
      logToSheet(data.solution, '', 'initial');
    } catch (error) {
      console.error('API error:', error);
      setAiResponse('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const logToSheet = (solution, emailToLog, type) => {
    const sheetLogURL = 'https://script.google.com/macros/s/AKfycbxlvKGKMxB613Nfqa1rtq5eZ0za4-OVHbSxarbDj5eR-q14pIDUyY9_m6T3anc-xPok/exec';
    const params = new URLSearchParams({
      faff,
      industry,
      email: emailToLog || '',
      prompt: solution,
      score,
      type
    });

    fetch(`${sheetLogURL}?${params.toString()}`)
      .then(res => console.log('Logged to sheet:', type))
      .catch(err => console.warn('Logging error:', err));
  };

  const handleEmailSubmit = () => {
    if (followUpEmail.trim()) {
      logToSheet(aiPrompt, followUpEmail, 'email');
      setEmailSubmitted(true);
    }
  };

  const handleReset = () => {
    setFaff('');
    setIndustry('');
    setScore(null);
    setAiResponse('');
    setLoading(false);
    setSubmitted(false);
    setFollowUpEmail('');
    setConsent(true);
    setAiPrompt('');
    setEmailSubmitted(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(aiResponse).then(() => {
      alert('Fix Faff says: Prescription copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy:', err);
    });
  };

  const formatResponse = (text) => {
    const boldText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    return boldText.split(/\n|\r/).filter(p => p.trim() !== '').map((p, idx) => <p key={idx} dangerouslySetInnerHTML={{ __html: p }} />);
  };

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '20px', background: '#D6DEC1', textAlign: 'center', minHeight: '100vh' }}>
      <img src="https://i.ibb.co/8gfJyCsW/Chat-GPT-Image-Aug-4-2025-08-52-28-AM.png" alt="Fix Faff Logo" style={{ maxWidth: '200px', marginBottom: '20px' }} />
      {!submitted && (
        <form onSubmit={handleSubmit} style={{ background: 'white', padding: '20px', borderRadius: '8px', maxWidth: '500px', margin: 'auto', boxShadow: '0 0 10px rgba(0,0,0,0.1)', textAlign: 'left' }}>
          <label>What's the faff?</label>
          <textarea value={faff} onChange={(e) => setFaff(e.target.value)} required style={{ width: '100%', padding: '8px 12px', margin: '5px 0 10px 0', boxSizing: 'border-box', minHeight: '100px' }} />

          <label>Your industry</label>
          <input type="text" value={industry} onChange={(e) => setIndustry(e.target.value)} required style={{ width: '100%', padding: '8px 12px', margin: '5px 0 10px 0', boxSizing: 'border-box' }} />

          <button type="submit" style={{ marginTop: '15px', padding: '10px 20px', background: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'block', marginLeft: 'auto', marginRight: 'auto' }}>Fix Your Faff</button>
        </form>
      )}

      {score && (
        <div style={{ marginTop: '20px', background: '#e0ffe0', padding: '10px', borderRadius: '6px', maxWidth: '700px', margin: '20px auto', textAlign: 'left' }}>
          <p><strong>Faff Score:</strong> {score}/25</p>
          {loading ? (
            <p><em>The Faff Doctor is Writing Your Prescription<span className="dots">...</span></em></p>
          ) : (
            <>
              <p><strong>Your Faff Free Prescription:</strong></p>
              <div>{formatResponse(aiResponse)}</div>

              {!emailSubmitted ? (
                <form style={{ marginTop: '20px' }} onSubmit={(e) => { e.preventDefault(); handleEmailSubmit(); }}>
                  <label>Would you like your Fix Faff Prescription Implemented for Free? Include your email here to be considered.</label>
                  <input type="email" value={followUpEmail} onChange={(e) => setFollowUpEmail(e.target.value)} placeholder="Enter your email" style={{ width: '100%', padding: '8px 12px', marginTop: '5px', boxSizing: 'border-box' }} />

                  <label style={{ display: 'block', marginTop: '10px' }}>
                    <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} /> Please keep me posted on Fix Faff insights and advice
                  </label>

                  <button type="submit" style={{ marginTop: '10px', padding: '10px 20px', background: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Submit Your Email for Free Implementation</button>
                </form>
              ) : (
                <p style={{ marginTop: '10px', color: '#3c763d' }}>Thanks! You’ll be considered for free implementation.</p>
              )}

              <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <button onClick={handleReset} style={{ margin: '10px', padding: '10px 20px', background: '#f39c12', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Fix Another Faff</button>
                <button onClick={copyToClipboard} style={{ margin: '10px', padding: '10px 20px', background: '#2ecc71', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Copy Your Faff Free Prescription</button>
              </div>
            </>
          )}
        </div>
      )}

      <style jsx>{`
        .dots::after {
          content: ' .';
          animation: dots 1.5s steps(3, end) infinite;
        }

        @keyframes dots {
          0%, 20% {
            content: ' .';
          }
          40% {
            content: ' ..';
          }
          60% {
            content: ' ...';
          }
          100% {
            content: ' .';
          }
        }
      `}</style>
    </div>
  );
}
