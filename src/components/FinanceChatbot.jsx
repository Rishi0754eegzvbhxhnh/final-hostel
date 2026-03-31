import React, { useState, useEffect, useRef } from 'react';

const BACKEND = 'http://127.0.0.1:5000';

const QUICK_PROMPTS = [
  { label: '📊 Overview', q: 'Give me a finance summary overview' },
  { label: '⚠️ Pending Dues', q: 'Show me all pending dues' },
  { label: '💰 Today\'s Collections', q: 'Who paid today?' },
  { label: '📅 Monthly Total', q: 'How much did we collect this month?' },
  { label: '🍽️ Mess Fee Status', q: 'What is the mess fee collection status?' },
  { label: '📈 Revenue Forecast', q: 'Forecast next month revenue' },
  { label: '👥 Students with Dues', q: 'Which students have dues?' },
  { label: '🏠 Rent Status', q: 'Show hostel rent payment status' },
];

const fmt = (n) => `₹${Number(n).toLocaleString('en-IN')}`;

// Animated bar chart component
const MiniBarChart = ({ data }) => {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data.map(d => d.total)) || 1;
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '70px', padding: '8px 0' }}>
      {data.map((d, i) => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, gap: '4px' }}>
          <div style={{
            width: '100%', borderRadius: '4px 4px 0 0',
            height: `${Math.max(4, (d.total / max) * 60)}px`,
            background: `linear-gradient(to top, #1d4ed8, #3b82f6)`,
            transition: 'height 0.6s ease',
          }} />
          <span style={{ fontSize: '9px', color: '#94a3b8', fontWeight: 700 }}>{d.label}</span>
        </div>
      ))}
    </div>
  );
};

// Summary metric card
const MetricCard = ({ icon, label, value, sub, color, bg }) => (
  <div style={{
    background: bg, borderRadius: '16px', padding: '16px',
    display: 'flex', gap: '12px', alignItems: 'flex-start',
    border: `1px solid ${color}33`,
  }}>
    <div style={{
      width: '40px', height: '40px', borderRadius: '12px',
      background: color + '22', display: 'flex', alignItems: 'center',
      justifyContent: 'center', fontSize: '20px', flexShrink: 0,
    }}>{icon}</div>
    <div>
      <div style={{ fontSize: '20px', fontWeight: 900, color, lineHeight: 1.1 }}>{value}</div>
      <div style={{ fontSize: '11px', fontWeight: 700, color: '#475569', marginTop: '2px' }}>{label}</div>
      {sub && <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '2px' }}>{sub}</div>}
    </div>
  </div>
);

// Message bubble
const MsgBubble = ({ msg }) => {
  const isUser = msg.role === 'user';
  return (
    <div style={{
      display: 'flex', flexDirection: isUser ? 'row-reverse' : 'row',
      gap: '10px', marginBottom: '16px', alignItems: 'flex-start',
    }}>
      {/* Avatar */}
      <div style={{
        width: '34px', height: '34px', borderRadius: '12px', flexShrink: 0,
        background: isUser ? '#1d4ed8' : 'linear-gradient(135deg, #7c3aed, #1d4ed8)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      }}>
        {isUser ? '👤' : '🤖'}
      </div>

      <div style={{ maxWidth: '78%', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {/* Bubble */}
        <div style={{
          padding: '12px 16px', borderRadius: isUser ? '18px 4px 18px 18px' : '4px 18px 18px 18px',
          background: isUser
            ? 'linear-gradient(135deg, #1d4ed8, #3730a3)'
            : '#f8fafc',
          color: isUser ? 'white' : '#1e293b',
          fontSize: '13px', lineHeight: '1.6',
          boxShadow: isUser ? '0 4px 12px rgba(29,78,216,0.3)' : '0 2px 8px rgba(0,0,0,0.06)',
          border: isUser ? 'none' : '1px solid #e2e8f0',
          whiteSpace: 'pre-wrap',
        }}>
          {msg.content}
        </div>

        {/* Table data if any */}
        {msg.data && msg.data.length > 0 && (
          <div style={{
            background: 'white', borderRadius: '12px', overflow: 'hidden',
            border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
              <thead>
                <tr style={{ background: '#f1f5f9' }}>
                  {Object.keys(msg.data[0]).map(k => (
                    <th key={k} style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 700, color: '#475569', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      {k}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {msg.data.map((row, i) => (
                  <tr key={i} style={{ borderTop: '1px solid #f1f5f9' }}>
                    {Object.values(row).map((v, j) => (
                      <td key={j} style={{ padding: '8px 12px', color: '#1e293b' }}>{v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <span style={{ fontSize: '10px', color: '#94a3b8', alignSelf: isUser ? 'flex-end' : 'flex-start' }}>
          {new Date(msg.time).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
};

const FinanceChatbot = () => {
  const [messages, setMessages] = useState([{
    role: 'ai', content: `👋 Hi! I'm your **Finance AI Assistant**.\n\nI can help you monitor:\n• 💰 Collections & payments\n• ⚠️ Pending dues per room/student\n• 📅 Daily, weekly & monthly summaries\n• 📈 Revenue forecasts\n\nTry asking: *"Show all pending dues"* or use the quick prompts below.`,
    time: new Date(), data: null,
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const chatEndRef = useRef(null);

  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    setSummaryLoading(true);
    try {
      const res = await fetch(`${BACKEND}/api/finance/summary`);
      const data = await res.json();
      if (data.success) setSummary(data.summary);
    } catch { }
    setSummaryLoading(false);
  };

  const simulatePayment = async () => {
    setIsSimulating(true);
    try {
      const res = await fetch(`${BACKEND}/api/finance/random-payment`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setMessages(prev => [...prev, {
          role: 'ai',
          content: `✅ **Simulated Payment Added!**\n\n${data.message}\n\nthe dashboards have refreshed. Ask me "What is the net profit this month?" to see the update!`,
          data: null, time: new Date()
        }]);
        fetchSummary();
      }
    } catch { }
    setIsSimulating(false);
  };

  const sendMessage = async (text) => {
    const msg = text || input;
    if (!msg.trim() || loading) return;
    setInput('');

    const userMsg = { role: 'user', content: msg, time: new Date(), data: null };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch(`${BACKEND}/api/finance/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: msg }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, {
        role: 'ai',
        content: data.answer || 'Sorry, I could not process that query.',
        data: data.data || null,
        time: new Date(),
      }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'ai',
        content: '❌ Connection error. Please check that the backend server is running.',
        data: null,
        time: new Date(),
      }]);
    }
    setLoading(false);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '24px', height: 'calc(100vh - 120px)', minHeight: '600px' }}>

      {/* ── LEFT: Chat ── */}
      <div style={{ display: 'flex', flexDirection: 'column', background: '#f8fafc', borderRadius: '24px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        {/* Chat header */}
        <div style={{
          padding: '16px 20px', background: 'linear-gradient(135deg, #1e3a8a, #3730a3)',
          color: 'white', display: 'flex', alignItems: 'center', gap: '12px',
        }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '14px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>
            🤖
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '15px' }}>Finance AI Assistant</div>
            <div style={{ fontSize: '11px', opacity: 0.7, display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '6px', height: '6px', background: '#22c55e', borderRadius: '50%', display: 'inline-block', animation: 'pulse 1.5s infinite' }} />
              Connected to live MongoDB data
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
            <button
              onClick={simulatePayment}
              disabled={isSimulating || loading}
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                border: 'none', borderRadius: '10px', padding: '7px 12px',
                color: 'white', cursor: (isSimulating || loading) ? 'not-allowed' : 'pointer',
                fontSize: '12px', fontWeight: 700, opacity: (isSimulating || loading) ? 0.7 : 1,
                boxShadow: '0 2px 6px rgba(16, 185, 129, 0.4)'
              }}
            >
              {isSimulating ? '⏳ Adding...' : '💰 Sim Random Payment'}
            </button>
            <button onClick={fetchSummary}
              style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '10px', padding: '7px 12px', color: 'white', cursor: 'pointer', fontSize: '12px', fontWeight: 700 }}>
              🔄 Refresh
            </button>
          </div>
        </div>

        {/* Quick prompts */}
        <div style={{ padding: '12px 16px', borderBottom: '1px solid #e2e8f0', display: 'flex', gap: '6px', overflowX: 'auto', background: 'white', flexShrink: 0 }}>
          {QUICK_PROMPTS.map((p, i) => (
            <button key={i} onClick={() => sendMessage(p.q)}
              style={{
                padding: '5px 12px', borderRadius: '20px', border: '1px solid #e2e8f0',
                background: '#f8fafc', cursor: 'pointer', fontSize: '11px', fontWeight: 700,
                whiteSpace: 'nowrap', color: '#475569', transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.target.style.background = '#1d4ed8'; e.target.style.color = 'white'; e.target.style.borderColor = '#1d4ed8'; }}
              onMouseLeave={e => { e.target.style.background = '#f8fafc'; e.target.style.color = '#475569'; e.target.style.borderColor = '#e2e8f0'; }}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          {messages.map((m, i) => <MsgBubble key={i} msg={m} />)}

          {loading && (
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <div style={{ width: '34px', height: '34px', borderRadius: '12px', background: 'linear-gradient(135deg, #7c3aed, #1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>🤖</div>
              <div style={{ padding: '12px 16px', background: '#f8fafc', borderRadius: '4px 18px 18px 18px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#1d4ed8', animation: `bounce 1.2s ${i * 0.2}s infinite` }} />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div style={{ padding: '14px 16px', background: 'white', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '10px' }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            placeholder='Ask: "Show Room 201 dues" or "How much collected this month?"'
            style={{
              flex: 1, padding: '10px 16px', borderRadius: '16px',
              border: '1.5px solid #e2e8f0', outline: 'none', fontSize: '13px',
              background: '#f8fafc', color: '#1e293b',
            }}
          />
          <button onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            style={{
              width: '42px', height: '42px', borderRadius: '14px', border: 'none',
              background: input.trim() ? 'linear-gradient(135deg, #1d4ed8, #3730a3)' : '#e2e8f0',
              color: input.trim() ? 'white' : '#94a3b8', cursor: input.trim() ? 'pointer' : 'default',
              fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s',
            }}>
            ➤
          </button>
        </div>
      </div>

      {/* ── RIGHT: Finance Dashboard ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}>
        <div style={{ fontSize: '13px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          📊 Live Finance Dashboard
        </div>

        {summaryLoading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>Loading analytics...</div>
        ) : summary ? (
          <>
            <MetricCard icon="💰" label="Total Collected" value={fmt(summary.totalCollected)} sub={`${summary.paidCount} transactions`} color="#16a34a" bg="#f0fdf4" />
            <MetricCard icon="⚠️" label="Pending Dues" value={fmt(summary.totalPending)} sub={`${summary.pendingCount} unpaid transactions`} color="#dc2626" bg="#fef2f2" />
            <MetricCard icon="📅" label="This Month" value={fmt(summary.monthCollection)} sub="Collected so far" color="#1d4ed8" bg="#eff6ff" />
            <MetricCard icon="☀️" label="Today" value={fmt(summary.todayCollection)} sub="Payments today" color="#9333ea" bg="#faf5ff" />

            {/* Collection rate ring */}
            <div style={{ background: 'white', borderRadius: '16px', padding: '16px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>Collection Rate</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ flex: 1, height: '10px', background: '#f1f5f9', borderRadius: '5px', overflow: 'hidden' }}>
                  {(() => {
                    const total = summary.totalCollected + summary.totalPending;
                    const pct = total > 0 ? (summary.totalCollected / total) * 100 : 0;
                    return (
                      <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, #16a34a, #22c55e)', borderRadius: '5px', transition: 'width 1s' }} />
                    );
                  })()}
                </div>
                <span style={{ fontSize: '14px', fontWeight: 900, color: '#16a34a' }}>
                  {(() => { const t = summary.totalCollected + summary.totalPending; return t > 0 ? ((summary.totalCollected / t) * 100).toFixed(1) : 0; })()}%
                </span>
              </div>
            </div>

            {/* Monthly trend */}
            {summary.monthlyTrend?.length > 0 && (
              <div style={{ background: 'white', borderRadius: '16px', padding: '16px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>6-Month Trend</div>
                <MiniBarChart data={summary.monthlyTrend} />
              </div>
            )}

            {/* Top due rooms */}
            {summary.topDueRooms?.length > 0 && (
              <div style={{ background: 'white', borderRadius: '16px', padding: '16px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#dc2626', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>🚨 Top Due Rooms</div>
                {summary.topDueRooms.map((r, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: i < summary.topDueRooms.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                    <span style={{ fontWeight: 700, fontSize: '13px', color: '#1e293b' }}>Room {r.room}</span>
                    <span style={{ fontWeight: 800, fontSize: '13px', color: '#dc2626' }}>{fmt(r.due)}</span>
                  </div>
                ))}
              </div>
            )}

            {/* By payment type */}
            {summary.byType && Object.keys(summary.byType).length > 0 && (
              <div style={{ background: 'white', borderRadius: '16px', padding: '16px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>By Payment Type</div>
                {Object.entries(summary.byType).map(([type, amount], i) => {
                  const labels = { residential: '🏠 Rent', meal_plan: '🍽️ Mess', tuition: '📚 Tuition', other: '⚡ Other' };
                  const colors = { residential: '#1d4ed8', meal_plan: '#16a34a', tuition: '#9333ea', other: '#f59e0b' };
                  const maxAmt = Math.max(...Object.values(summary.byType));
                  return (
                    <div key={i} style={{ marginBottom: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: '#475569' }}>{labels[type] || type}</span>
                        <span style={{ fontSize: '11px', fontWeight: 800, color: colors[type] || '#475569' }}>{fmt(amount)}</span>
                      </div>
                      <div style={{ height: '5px', background: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${(amount / maxAmt) * 100}%`, background: colors[type] || '#94a3b8', borderRadius: '3px', transition: 'width 0.8s' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          <div style={{ background: '#fef2f2', borderRadius: '16px', padding: '16px', border: '1px solid #fca5a5', color: '#dc2626', fontSize: '13px', fontWeight: 600, textAlign: 'center' }}>
            ⚠️ Could not load finance data.<br />Make sure the backend is running.
          </div>
        )}

        <style>{`
          @keyframes bounce {
            0%, 100% { transform: translateY(0); opacity: 0.5; }
            50% { transform: translateY(-6px); opacity: 1; }
          }
        `}</style>
      </div>
    </div>
  );
};

export default FinanceChatbot;
