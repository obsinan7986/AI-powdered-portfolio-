import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../../context/AuthContext';

export default function AdminLogin() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const { login }               = useAuth();
  const navigate                = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin Login | Obsa Portfolio</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--color-bg)' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm"
        >
          <div className="card p-8">
            {/* Logo */}
            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl font-heading mx-auto mb-3" style={{ background: 'var(--color-primary)' }}>OT</div>
              <h1 className="font-heading font-bold text-xl" style={{ color: 'var(--color-text)' }}>Admin Dashboard</h1>
              <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>Sign in to manage your portfolio</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" aria-label="Admin login form">
              <div className="flex flex-col gap-1">
                <label htmlFor="email" className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>Email</label>
                <input
                  id="email" type="email" value={email} onChange={e => setEmail(e.target.value)}
                  className="input" placeholder="admin@example.com"
                  autoComplete="email" required aria-required="true"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="password" className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>Password</label>
                <input
                  id="password" type="password" value={password} onChange={e => setPassword(e.target.value)}
                  className="input" placeholder="••••••••"
                  autoComplete="current-password" required aria-required="true"
                />
              </div>

              {error && (
                <div className="text-sm p-3 rounded-lg" style={{ background: '#fee2e2', color: '#dc2626' }} role="alert">{error}</div>
              )}

              <button type="submit" disabled={loading} className="btn btn-primary w-full" aria-busy={loading}>
                {loading ? (
                  <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" /> Signing in...</>
                ) : 'Sign In'}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </>
  );
}
