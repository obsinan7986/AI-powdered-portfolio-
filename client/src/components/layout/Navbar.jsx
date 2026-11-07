/**
 * Navbar
 * - Sticky, glass-blur navbar
 * - Active section highlight via IntersectionObserver
 * - Smooth scroll to sections
 * - Mobile hamburger menu
 * - Theme (dark/light) toggle + 4 accent color pickers
 * - Download CV button
 */

import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useActiveSection } from '../../hooks/useActiveSection';
import { useScrollLock } from '../../hooks/useScrollLock';
import ThemeSwitcher from '../ui/ThemeSwitcher';
import { trackCvDownload } from '../../services/portfolioService';

const NAV_LINKS = [
  { label: 'Home',            href: '#hero'             },
  { label: 'About',           href: '#about'            },
  { label: 'Experience',      href: '#experience'       },
  { label: 'Certifications',  href: '#certifications'   },
  { label: 'Skills',          href: '#skills'           },
  { label: 'Projects',        href: '#projects'         },
  { label: 'Services',        href: '#services'         },
  { label: 'Contact',         href: '#contact'          },
];

const SECTION_IDS = NAV_LINKS.map((l) => l.href.replace('#', ''));

export default function Navbar() {
  const [isOpen, setIsOpen]         = useState(false);
  const [scrolled, setScrolled]     = useState(false);
  const activeSection               = useActiveSection(SECTION_IDS);
  const location                    = useLocation();
  const isHomePage                  = location.pathname === '/';

  useScrollLock(isOpen);

  // Add shadow when page is scrolled
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handler = () => { if (window.innerWidth >= 768) setIsOpen(false); };
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const handleNavClick = useCallback((e, href) => {
    e.preventDefault();
    setIsOpen(false);
    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const isActive = (href) => {
    const id = href.replace('#', '');
    return isHomePage && activeSection === id;
  };

  return (
    <>
      <header
        role="banner"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'shadow-[var(--shadow-nav)] backdrop-blur-md'
            : ''
        }`}
        style={{ backgroundColor: 'var(--color-bg-nav)' }}
      >
        <nav
          className="container flex items-center justify-between h-16"
          aria-label="Main navigation"
        >
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 font-heading font-bold text-xl focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] rounded"
            aria-label="Obsa Tesfaye — Home"
          >
            <span
              className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-sm font-bold"
              style={{ background: 'var(--color-primary)' }}
              aria-hidden="true"
            >
              OT
            </span>
            <span style={{ color: 'var(--color-text)' }}>
              Obsa<span style={{ color: 'var(--color-primary)' }}>.</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <ul className="hidden md:flex items-center gap-1" role="list">
            {NAV_LINKS.map(({ label, href }) => (
              <li key={href}>
                <a
                  href={href}
                  onClick={(e) => handleNavClick(e, href)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    isActive(href)
                      ? 'font-semibold'
                      : ''
                  }`}
                  style={{
                    color: isActive(href)
                      ? 'var(--color-primary)'
                      : 'var(--color-text-secondary)',
                    backgroundColor: isActive(href)
                      ? 'var(--color-primary-light)'
                      : 'transparent',
                  }}
                  aria-current={isActive(href) ? 'page' : undefined}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>

          {/* Desktop right side: Theme switcher + CV button */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeSwitcher />
            <a
              href="/Obsa_Tesfaye_CV.pdf"
              download="Obsa_Tesfaye_CV.pdf"
              className="btn btn-primary btn-sm"
              aria-label="Download Obsa Tesfaye's CV"
              onClick={() => trackCvDownload()}
            >
              <DownloadIcon />
              Download CV
            </a>
          </div>

          {/* Mobile: Theme toggle + Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeSwitcher compact />
            <button
              type="button"
              onClick={() => setIsOpen((v) => !v)}
              className="p-2 rounded-lg transition-colors"
              style={{ color: 'var(--color-text)' }}
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                {isOpen ? (
                  <motion.span
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <CloseIcon />
                  </motion.span>
                ) : (
                  <motion.span
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <MenuIcon />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </nav>

        {/* Active-section indicator bar */}
        {scrolled && (
          <div
            className="h-[2px] transition-all duration-500"
            style={{ background: 'var(--color-primary)', opacity: 0.6 }}
          />
        )}
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />

            {/* Drawer */}
            <motion.div
              id="mobile-menu"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-72 md:hidden flex flex-col"
              style={{ background: 'var(--color-bg-card)' }}
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation menu"
            >
              {/* Drawer header */}
              <div
                className="flex items-center justify-between px-6 h-16 border-b"
                style={{ borderColor: 'var(--color-border)' }}
              >
                <span className="font-heading font-bold" style={{ color: 'var(--color-text)' }}>
                  Menu
                </span>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg"
                  style={{ color: 'var(--color-text-muted)' }}
                  aria-label="Close menu"
                >
                  <CloseIcon />
                </button>
              </div>

              {/* Nav links */}
              <nav className="flex-1 overflow-y-auto px-4 py-6">
                <ul className="space-y-1" role="list">
                  {NAV_LINKS.map(({ label, href }, i) => (
                    <motion.li
                      key={href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <a
                        href={href}
                        onClick={(e) => handleNavClick(e, href)}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-all"
                        style={{
                          color: isActive(href)
                            ? 'var(--color-primary)'
                            : 'var(--color-text-secondary)',
                          backgroundColor: isActive(href)
                            ? 'var(--color-primary-light)'
                            : 'transparent',
                        }}
                      >
                        {label}
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </nav>

              {/* Drawer footer */}
              <div
                className="px-6 pb-8 pt-4 border-t"
                style={{ borderColor: 'var(--color-border)' }}
              >
                <a
                  href="/Obsa_Tesfaye_CV.pdf"
                  download="Obsa_Tesfaye_CV.pdf"
                  className="btn btn-primary w-full justify-center mb-4"
                >
                  <DownloadIcon />
                  Download CV
                </a>
                <p
                  className="text-xs text-center"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  obsatesfaye6370@gmail.com
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

/* ---- Icon helpers ---- */
function MenuIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}
