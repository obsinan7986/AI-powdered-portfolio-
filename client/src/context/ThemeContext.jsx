/**
 * ThemeContext
 * Manages dark/light mode and accent color.
 * Values are persisted to localStorage and applied as
 * data-theme and data-accent attributes on <html>.
 * The initial values are set by the inline script in index.html
 * (no flash of wrong theme).
 */

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const THEME_KEY   = 'portfolio-theme';
const ACCENT_KEY  = 'portfolio-accent';

export const THEMES  = ['light', 'dark'];
export const ACCENTS = ['blue', 'green', 'purple', 'orange'];

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  // Read what the inline script already applied — avoids a second paint
  const [theme, setThemeState] = useState(
    () => document.documentElement.getAttribute('data-theme') || 'dark'
  );
  const [accent, setAccentState] = useState(
    () => document.documentElement.getAttribute('data-accent') || 'blue'
  );

  // Apply theme change to DOM + localStorage
  const setTheme = useCallback((newTheme) => {
    if (!THEMES.includes(newTheme)) return;
    document.documentElement.setAttribute('data-theme', newTheme);
    // Keep Tailwind's `dark:` utilities in sync
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem(THEME_KEY, newTheme);
    setThemeState(newTheme);
  }, []);

  // Apply accent change to DOM + localStorage
  const setAccent = useCallback((newAccent) => {
    if (!ACCENTS.includes(newAccent)) return;
    document.documentElement.setAttribute('data-accent', newAccent);
    localStorage.setItem(ACCENT_KEY, newAccent);
    setAccentState(newAccent);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setTheme]);

  // Respect OS-level preference changes in real time (only if user hasn't saved a manual choice)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e) => {
      if (!localStorage.getItem(THEME_KEY)) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [setTheme]);

  return (
    <ThemeContext.Provider
      value={{ theme, accent, setTheme, setAccent, toggleTheme, THEMES, ACCENTS }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

/** Convenience hook */
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
