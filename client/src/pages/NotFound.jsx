/**
 * 404 Not Found Page
 * Custom, branded 404 with a return-home button.
 */

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';

export default function NotFound() {
  return (
    <>
      <Helmet>
        <title>404 — Page Not Found | Obsa Tesfaye</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <main
        className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
        style={{ background: 'var(--color-bg)' }}
        aria-labelledby="not-found-heading"
      >
        {/* Animated 404 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p
            className="font-heading font-extrabold leading-none mb-2"
            style={{
              fontSize: 'clamp(6rem, 20vw, 10rem)',
              color: 'var(--color-primary)',
              opacity: 0.15,
              lineHeight: 1,
            }}
            aria-hidden="true"
          >
            404
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="-mt-8"
        >
          <h1
            id="not-found-heading"
            className="font-heading font-bold text-3xl md:text-4xl mb-4"
            style={{ color: 'var(--color-text)' }}
          >
            Page Not Found
          </h1>
          <p
            className="text-base md:text-lg mb-10 max-w-md mx-auto"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Looks like this page took a wrong turn. Let&apos;s get you back to
            the portfolio.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/" className="btn btn-primary btn-lg">
              <HomeIcon />
              Back to Home
            </Link>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                window.location.href = '/#contact';
              }}
              className="btn btn-outline btn-lg"
            >
              Contact Me
            </a>
          </div>
        </motion.div>

        {/* Decorative blobs */}
        <div
          className="fixed top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none -z-10"
          style={{ background: 'var(--color-primary-glow)' }}
          aria-hidden="true"
        />
        <div
          className="fixed bottom-1/4 right-1/4 w-64 h-64 rounded-full blur-3xl pointer-events-none -z-10"
          style={{ background: 'var(--color-primary-glow)', opacity: 0.5 }}
          aria-hidden="true"
        />
      </main>
    </>
  );
}

function HomeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}
