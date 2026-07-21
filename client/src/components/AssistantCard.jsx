import { useState, useRef, useEffect } from 'react';
import api from '../api/axios';

// Unique session ID - taake n8n workflow ek hi conversation thread yaad rakhe
function generateSessionId() {
  return `pf_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

// Send icon - overall design ke sath match karta arrow (emoji ki jagah)
const SendIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function AssistantCard({ userName }) {
  const [sessionId] = useState(generateSessionId);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, sending]);

  async function handleSend() {
    const text = input.trim();
    if (!text || sending) return;

    setMessages((prev) => [...prev, { role: 'user', text }]);
    setInput('');
    setSending(true);

    try {
      const res = await api.post('/pf-chat', { chatInput: text, sessionId });

      const reply =
        res.data?.output ||
        res.data?.text ||
        res.data?.message ||
        (typeof res.data === 'string' ? res.data : 'Sorry, I could not process that.');

      setMessages((prev) => [...prev, { role: 'assistant', text: reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: 'Something went wrong. Please try again.', error: true },
      ]);
    } finally {
      setSending(false);
    }
  }

  const isEmpty = messages.length === 0;

  return (
    <div className="glass-card tint-purple rounded-3xl p-5 flex flex-col flex-1 min-h-[380px]">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-3 shrink-0">
        <span className="h-14 w-14 flex items-center justify-center shrink-0">
          <img src="/chat_icon2.png" alt="PneumoFusion Assistant" className="w-full h-full object-contain" />
        </span>
        <div>
          <p className="text-sm font-semibold text-ink dark:text-white leading-tight">
            PneumoFusion Assistant
          </p>
          <p className="text-[10px] text-muted">Powered by n8n</p>
        </div>
      </div>

      {/* Body: empty state OR message list */}
      {isEmpty ? (
        <div className="flex-1 flex items-center justify-center">
          <span className="h-36 w-36 flex items-center justify-center">
            <img src="/chat_icon2.png" alt="PneumoFusion Assistant" className="w-full h-full object-contain" />
          </span>
        </div>
      ) : (
        <div ref={scrollRef} className="flex-1 overflow-y-auto flex flex-col gap-3 pr-1 mb-2">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'self-end bg-primary text-white rounded-br-md'
                  : msg.error
                  ? 'self-start bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-bl-md'
                  : 'self-start bg-black/[0.04] dark:bg-white/5 text-ink dark:text-white rounded-bl-md'
              }`}
            >
              {msg.text}
            </div>
          ))}
          {sending && (
            <div className="self-start bg-black/[0.04] dark:bg-white/5 rounded-2xl rounded-bl-md px-4 py-3 flex gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-primary/60 animate-bounce [animation-delay:-0.3s]" />
              <span className="h-1.5 w-1.5 rounded-full bg-primary/60 animate-bounce [animation-delay:-0.15s]" />
              <span className="h-1.5 w-1.5 rounded-full bg-primary/60 animate-bounce" />
            </div>
          )}
        </div>
      )}

      {/* Input row - sirf input + send button */}
      <div className="flex items-center gap-2 rounded-full bg-black/[0.03] dark:bg-white/5 border border-black/5 dark:border-white/10 pl-4 pr-1.5 py-1.5 shrink-0">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type your question..."
          className="flex-1 bg-transparent text-sm text-ink dark:text-white outline-none placeholder:text-muted min-w-0 py-1.5"
        />
        <button
          onClick={handleSend}
          disabled={sending || !input.trim()}
          className="h-9 w-9 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary-dark transition-colors disabled:opacity-40 shrink-0"
          aria-label="Send"
        >
          <SendIcon />
        </button>
      </div>
    </div>
  );
}