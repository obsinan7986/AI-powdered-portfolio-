/**
 * Layout
 * Wraps all pages with Navbar + Footer + skip-to-content link.
 */

import Navbar from './Navbar';
import Footer from './Footer';
import ChatWidget from '../ui/ChatWidget';

export default function Layout({ children }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] btn btn-primary btn-sm"
        style={{ padding: '0.5rem 1rem' }}
      >
        Skip to main content
      </a>

      <Navbar />

      <main id="main-content" style={{ flex: 1 }} tabIndex="-1">
        {children}
      </main>

      <Footer />
      <ChatWidget />
    </div>
  );
}
