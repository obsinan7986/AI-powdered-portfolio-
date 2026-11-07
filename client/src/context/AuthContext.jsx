/**
 * AuthContext — manages admin JWT.
 * Token is stored in localStorage under 'portfolio-admin-token'.
 * Automatically logs out on expiry by checking the JWT exp claim.
 */
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

function parseJwtExpiry(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp ? payload.exp * 1000 : null;
  } catch { return null; }
}

export function AuthProvider({ children }) {
  const [admin, setAdmin]   = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, restore session from localStorage
  useEffect(() => {
    const token = localStorage.getItem('portfolio-admin-token');
    if (token) {
      const expiry = parseJwtExpiry(token);
      if (expiry && Date.now() >= expiry) {
        localStorage.removeItem('portfolio-admin-token');
      } else {
        // Verify token is still valid with a /me call
        api.get('/auth/me')
          .then(res => setAdmin(res.data.data))
          .catch(() => localStorage.removeItem('portfolio-admin-token'))
          .finally(() => setLoading(false));
        return;
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('portfolio-admin-token', res.data.token);
    setAdmin(res.data.admin);
    return res.data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('portfolio-admin-token');
    setAdmin(null);
  }, []);

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout, isAuthenticated: !!admin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
