/**
 * ThemeSwitcher
 * Renders:
 *   - A sun/moon toggle for dark/light
 *   - 4 accent color dots (blue, green, purple, orange)
 * When compact=true only the sun/moon icon is shown (used in mobile header).
 */

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme, ACCENTS } from '../../context/ThemeContext';

const ACCENT_COLORS = {
  blue:   '#3b82f6',
  green:  '#10b981',
  purple: '#8b5cf6',
  orange: '#f97316',
};

const ACCENT_LABELS = {
  blue:   'Blue accent',
  green:  'Green accent',
  purple: 'Purple accent',
  orange: 'Orange accent',
};

export default function ThemeSwitcher({ compact = false }) {
  const { theme, accent, toggleTheme, setAccent } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (compact) {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        className="p-2 rounded-lg transition-colors hover:bg-[var(--color-bg-secondary)]"
        style={{ color: 'var(--color-text)' }}
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      >
        {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
      </button>
    );
  }

  return (
    <div ref={ref} className="relative">
      {/* Toggle button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all text-sm font-medium"
        style={{
          borderColor: 'var(--color-border)',
          color: 'var(--color-text-secondary)',
          backgroundColor: 'var(--color-bg-secondary)',
        }}
        aria-label="Open theme switcher"
        aria-expanded={open}
        aria-haspopup="true"
      >
        {/* Current accent dot */}
        <span
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: ACCENT_COLORS[accent] }}
          aria-hidden="true"
        />
        {theme === 'dark' ? <MoonIcon size={14} /> : <SunIcon size={14} />}
        <ChevronIcon />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 p-4 rounded-xl shadow-xl w-56 z-50"
            style={{
              background: 'var(--color-bg-card)',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-glass)',
            }}
            role="menu"
            aria-label="Theme options"
          >
            {/* Dark / Light toggle */}
            <p
              className="text-xs font-semibold uppercase tracking-wider mb-2"
              style={{ color: 'var(--color-text-muted)' }}
            >
              Mode
            </p>
            <div
              className="flex rounded-lg overflow-hidden border mb-4"
              style={{ borderColor: 'var(--color-border)' }}
            >
              {['light', 'dark'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    // Import setTheme from context
                    if (t !== theme) toggleTheme();
                  }}
                  className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium capitalize transition-all"
                  style={{
                    background: theme === t ? 'var(--color-primary)' : 'transparent',
                    color: theme === t ? '#fff' : 'var(--color-text-muted)',
                  }}
                  aria-pressed={theme === t}
                  role="menuitemradio"
                  aria-checked={theme === t}
                >
                  {t === 'light' ? <SunIcon size={14} /> : <MoonIcon size={14} />}
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>

            {/* Accent colors */}
            <p
              className="text-xs font-semibold uppercase tracking-wider mb-2"
              style={{ color: 'var(--color-text-muted)' }}
            >
              Accent
            </p>
            <div className="flex gap-2" role="group" aria-label="Choose accent color">
              {ACCENTS.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => setAccent(a)}
                  className="w-8 h-8 rounded-full transition-all flex items-center justify-center"
                  style={{
                    backgroundColor: ACCENT_COLORS[a],
                    outline: accent === a ? `3px solid ${ACCENT_COLORS[a]}` : 'none',
                    outlineOffset: '2px',
                    boxShadow: accent === a ? `0 0 0 2px var(--color-bg-card)` : 'none',
                    transform: accent === a ? 'scale(1.15)' : 'scale(1)',
                  }}
                  aria-label={ACCENT_LABELS[a]}
                  aria-pressed={accent === a}
                  role="menuitemradio"
                  aria-checked={accent === a}
                >
                  {accent === a && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---- Icon helpers ---- */
function SunIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function MoonIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}
