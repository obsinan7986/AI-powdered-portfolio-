/**
 * AI Chat Widget — "Ask Obsa's AI"
 * Floating button → slide-up panel → chat with Gemini/Claude
 * backed by POST /api/chat (API key never leaves the server).
 */
import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';

const STARTERS = [
  "What projects has Obsa built?",
  "What are Obsa's main skills?",
  "Tell me about his internship experience.",
  "Is Obsa available for work?",
  "What services does Obsa offer?",
];

function Message({ msg }) {
  const isUser = msg.role === 'user';
  return (
    <div className={`flex gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
        style={{
          background: isUser ? 'var(--color-primary)' : 'var(--color-bg-secondary)',
          color:      isUser ? '#fff' : 'var(--color-text)',
          border:     isUser ? 'none' : '1px solid var(--color-border)',
        }}
        aria-hidden="true"
      >
        {isUser ? 'You' : 'AI'}
      </div>
      {/* Bubble */}
      <div
        className="max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed"
        style={{
          background:   isUser ? 'var(--color-primary)' : 'var(--color-bg-secondary)',
          color:        isUser ? '#fff' : 'var(--color-text)',
          borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
        }}
      >
        {msg.content}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-2">
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
        style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
        aria-hidden="true"
      >AI</div>
      <div
        className="px-4 py-3 rounded-2xl flex gap-1 items-center"
        style={{ background: 'var(--color-bg-secondary)', borderRadius: '18px 18px 18px 4px' }}
        role="status"
        aria-label="AI is typing"
      >
        {[0, 1, 2].map(i => (
          <motion.span
            key={i}
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: 'var(--color-text-muted)' }}
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
            aria-hidden="true"
          />
        ))}
      </div>
    </div>
  );
}

export default function ChatWidget() {
  const [open, setOpen]         = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I'm Obsa's AI assistant. Ask me anything about his skills, projects, or experience." }
  ]);
  const [input, setInput]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const bottomRef               = useRef(null);
  const inputRef                = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Focus input when panel opens
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  const sendMessage = useCallback(async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;

    setInput('');
    setError('');

    const userMsg = { role: 'user', content: msg };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      // Send history (excluding the greeting) so server has context
      const history = messages.filter(m => m.role !== 'assistant' || messages.indexOf(m) > 0);
      const res = await api.post('/chat', { message: msg, history: history.slice(-6) });
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.reply }]);
    } catch (err) {
      const code      = err.response?.data?.code;
      const serverMsg = err.response?.data?.error;

      let errMsg;
      if (!err.response) {
        errMsg = 'Cannot reach the server. Make sure the backend is running.';
      } else if (code === 'MISSING_KEY' || code === 'INVALID_KEY' || code === 'AUTH_FAILED') {
        errMsg = 'AI is not configured yet. Contact Obsa via the contact form below.';
      } else if (code === 'RATE_LIMITED') {
        errMsg = 'Too many messages. Please wait a moment and try again.';
      } else if (code === 'MODEL_NOT_FOUND') {
        errMsg = 'AI model unavailable. The owner has been notified.';
      } else {
        errMsg = serverMsg || 'Unable to reach the AI. Please use the contact form.';
      }

      setError(errMsg);
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleClear = () => {
    setMessages([{ role: 'assistant', content: "Hi! I'm Obsa's AI assistant. Ask me anything about his skills, projects, or experience." }]);
    setError('');
  };

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={() => setOpen(v => !v)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-xl flex items-center justify-center text-white"
        style={{ background: 'var(--color-primary)' }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label={open ? 'Close AI chat' : 'Open AI chat — Ask about Obsa'}
        aria-expanded={open}
        aria-controls="chat-panel"
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <CloseIcon />
            </motion.span>
          ) : (
            <motion.span key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <ChatIcon />
            </motion.span>
          )}
        </AnimatePresence>
        {/* Pulse ring */}
        {!open && (
          <span className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ background: 'var(--color-primary)' }} aria-hidden="true" />
        )}
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="chat-panel"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-[350px] max-w-[calc(100vw-3rem)] rounded-2xl flex flex-col overflow-hidden"
            style={{
              background:  'var(--color-bg-card)',
              border:      '1px solid var(--color-border)',
              boxShadow:   'var(--shadow-glass)',
              maxHeight:   '520px',
            }}
            role="dialog"
            aria-modal="false"
            aria-label="AI chat with Obsa's assistant"
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3 flex-shrink-0"
              style={{ background: 'var(--color-primary)', color: '#fff' }}
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold" aria-hidden="true">AI</div>
                <div>
                  <p className="font-semibold text-sm leading-tight">Ask Obsa's AI</p>
                  <p className="text-xs opacity-80">Powered by Gemini</p>
                </div>
              </div>
              <button
                onClick={handleClear}
                className="text-white/70 hover:text-white text-xs px-2 py-1 rounded transition-colors"
                aria-label="Clear chat history"
              >
                Clear
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0" style={{ maxHeight: '300px' }}>
              {messages.map((msg, i) => (
                <Message key={i} msg={msg} />
              ))}
              {loading && <TypingIndicator />}
              {error && (
                <div className="text-xs text-center px-3 py-2 rounded-lg" style={{ background: '#fee2e2', color: '#dc2626' }} role="alert">
                  {error}
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Starter questions (only shown before first user message) */}
            {messages.length === 1 && (
              <div className="px-4 pb-2 flex-shrink-0">
                <p className="text-xs mb-2 font-medium" style={{ color: 'var(--color-text-muted)' }}>Suggested questions:</p>
                <div className="flex flex-col gap-1">
                  {STARTERS.map(q => (
                    <button
                      key={q}
                      onClick={() => sendMessage(q)}
                      className="text-left text-xs px-3 py-1.5 rounded-lg transition-all hover:opacity-80"
                      style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)' }}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-3 flex-shrink-0" style={{ borderTop: '1px solid var(--color-border)' }}>
              <div className="flex gap-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about skills, projects..."
                  className="flex-1 input resize-none text-sm"
                  rows={1}
                  maxLength={500}
                  aria-label="Type your message"
                  disabled={loading}
                  style={{ minHeight: '38px', maxHeight: '80px', padding: '0.5rem 0.75rem' }}
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || loading}
                  className="w-10 h-10 rounded-lg flex items-center justify-center transition-all disabled:opacity-40 flex-shrink-0"
                  style={{ background: 'var(--color-primary)', color: '#fff' }}
                  aria-label="Send message"
                >
                  <SendIcon />
                </button>
              </div>
              <p className="text-right text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>{input.length}/500</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function ChatIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>;
}
function CloseIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
}
function SendIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>;
}
