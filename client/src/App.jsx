import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Suspense, lazy } from 'react';
import { ThemeProvider }  from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';

// Eager-load Home (above the fold)
import Home from './pages/Home';

// Lazy-load heavy routes
const NotFound       = lazy(() => import('./pages/NotFound'));
const AdminLogin     = lazy(() => import('./pages/admin/Login'));
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-bg)' }}>
      <span className="w-8 h-8 border-2 border-t-[var(--color-primary)] rounded-full animate-spin" aria-label="Loading page" />
    </div>
  );
}

function RequireAuth({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <PageLoader />;
  return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
}

export default function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Layout><Home /></Layout>} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={
                  <RequireAuth>
                    <Layout><AdminDashboard /></Layout>
                  </RequireAuth>
                } />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}
