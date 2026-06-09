import { useState, useRef, useEffect } from 'react';
import { recallMemory } from '../api';

const PATIENT_ID = 'P042';
const TRIAL_ID = 'TRIAL-001';

export default function Chat() {
  const [messages, setMessages] = useState([
    { role: 'agent', content: "Hello — I'm the CTMC memory agent for Trial TRIAL-001, Patient P042. I have access to all recorded sessions. Ask me about adverse events, lab results, protocol deviations, or anything from the session history.", sources: [] }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef();

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);

  async function send() {
    if (!input.trim() || loading) return;
    const query = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: query }]);
    setLoading(true);
    try {
      const { data } = await recallMemory({ query, patientId: PATIENT_ID, trialId: TRIAL_ID });
      setMessages(prev => [...prev, { role: 'agent', content: data.answer, sources: data.sources }]);
    } catch {
      setMessages(prev => [...prev, { role: 'agent', content: 'Unable to reach the memory service. Check that the backend is running.', sources: [] }]);
    }
    setLoading(false);
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="chat-header-avatar">🧠</div>
        <div>
          <div className="chat-header-title">Memory Agent — Patient P042</div>
          <div className="chat-header-sub"><span className="status-dot"/>Online · TRIAL-001</div>
        </div>
      </div>

      <div className="chat-messages">
        {messages.map((m, i) => (
          <div key={i} className={`message ${m.role}`}>
            <div className="msg-avatar">{m.role === 'agent' ? '🧠' : '👤'}</div>
            <div>
              <div className="message-bubble">{m.content}</div>
              {m.sources?.length > 0 && (
                <div className="sources">
                  {m.sources.map((s, j) => (
                    <span key={j} className="source-tag">{s.date} · {s.type} · {s.score}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="message agent">
            <div className="msg-avatar">🧠</div>
            <div className="typing"><span/><span/><span/></div>
          </div>
        )}
        <div ref={bottomRef}/>
      </div>

      <div className="chat-footer">
        <div className="chat-input-row">
          <input
            className="chat-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="Ask about P042 — e.g. 'What adverse events have been recorded?'"
          />
          <button className="btn btn-primary" onClick={send} disabled={loading}>
            {loading ? '...' : 'Send'}
          </button>
        </div>
        <div className="chat-hint">Memory grounded in session data · Sources cited with each response</div>
      </div>
    </div>
  );
}
