import { useState } from 'react';
import api from '../api/axios';

// Ye existing n8n chatbot route (/pf-chat) se connect hota hai
export default function AssistantCard() {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  async function handleSend() {
    if (!message.trim()) return;
    setSending(true);
    try {
      await api.post('/pf-chat', { chatInput: message });
      // Response ko chat window me dikhana - baad me full chat UI banayenge
      setMessage('');
    } catch (err) {
      console.error('Chat request failed:', err.message);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="rounded-3xl bg-white/85 dark:bg-white/[0.06] backdrop-blur-xl shadow-[0_8px_30px_rgba(124,111,240,0.12)] border border-white/60 dark:border-white/10 p-5 flex flex-col gap-4">
      <div className="h-14 w-14 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white text-xl shadow-lg shadow-primary/30">
        🫁
      </div>
      <div>
        <p className="text-ink dark:text-white font-semibold">
          Hi! I'm the <span className="text-primary">PneumoFusion</span> Assistant
        </p>
        <p className="text-sm text-muted mt-0.5">How can I help you today?</p>
      </div>
      <div className="flex items-center gap-2 rounded-full bg-black/[0.03] dark:bg-white/5 border border-black/5 dark:border-white/10 px-4 py-2.5">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type your question..."
          className="flex-1 bg-transparent text-sm text-ink dark:text-white outline-none placeholder:text-muted"
        />
        <button
          onClick={handleSend}
          disabled={sending}
          className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary-dark transition-colors disabled:opacity-50"
        >
          →
        </button>
      </div>
    </div>
  );
}