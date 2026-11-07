/**
 * Footer
 * - Dynamic current year
 * - Social links
 * - Quick nav links
 * - "Built with" tech stack note
 */

import { motion } from 'framer-motion';

const SOCIAL_LINKS = [
  {
    label: 'GitHub',
    href: 'https://github.com/obsinan7986',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/obsa-tesfaye-demesa-67a41a363',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: 'Telegram',
    href: 'https://t.me/@Obsa_dev',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    ),
  },
  {
    label: 'Email',
    href: 'mailto:obsatesfaye6370@gmail.com',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
  },
];

const QUICK_LINKS = [
  { label: 'About',      href: '#about'      },
  { label: 'Projects',   href: '#projects'   },
  { label: 'Skills',     href: '#skills'     },
  { label: 'Contact',    href: '#contact'    },
];

export default function Footer() {
  const year = new Date().getFullYear();

  const handleScroll = (e, href) => {
    e.preventDefault();
    const el = document.getElementById(href.replace('#', ''));
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer
      role="contentinfo"
      className="relative pt-16 pb-8"
      style={{
        background: 'var(--color-bg-secondary)',
        borderTop: '1px solid var(--color-border)',
      }}
    >
      {/* Top glow line */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px"
        style={{ background: 'var(--color-primary)', opacity: 0.4 }}
        aria-hidden="true"
      />

      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span
                className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-sm font-bold font-heading"
                style={{ background: 'var(--color-primary)' }}
                aria-hidden="true"
              >
                OT
              </span>
              <span className="font-heading font-bold text-xl" style={{ color: 'var(--color-text)' }}>
                Obsa Tesfaye
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--color-text-muted)' }}>
              Full-Stack Developer (MERN) &amp; Computer Science student building
              clean, scalable web applications.
            </p>
            {/* Social links */}
            <div className="flex gap-3" role="list" aria-label="Social media links">
              {SOCIAL_LINKS.map(({ label, href, icon }) => (
                <motion.a
                  key={label}
                  href={href}
                  target={href.startsWith('mailto:') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.2 }}
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-all"
                  style={{
                    background: 'var(--color-bg-card)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text-muted)',
                  }}
                  aria-label={label}
                  role="listitem"
                >
                  {icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3
              className="font-heading font-semibold text-sm uppercase tracking-wider mb-4"
              style={{ color: 'var(--color-text)' }}
            >
              Quick Links
            </h3>
            <ul className="space-y-2" role="list">
              {QUICK_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <a
                    href={href}
                    onClick={(e) => handleScroll(e, href)}
                    className="text-sm transition-colors hover:underline"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact snippet */}
          <div>
            <h3
              className="font-heading font-semibold text-sm uppercase tracking-wider mb-4"
              style={{ color: 'var(--color-text)' }}
            >
              Get in Touch
            </h3>
            <ul className="space-y-3 text-sm" style={{ color: 'var(--color-text-muted)' }}>
              <li>
                <a href="mailto:obsatesfaye6370@gmail.com" className="hover:underline" style={{ color: 'var(--color-text-muted)' }}>
                  obsatesfaye6370@gmail.com
                </a>
              </li>
              <li>+251 931 597 986</li>
              <li>Haramaya University, Ethiopia</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8"
          style={{ borderTop: '1px solid var(--color-border)' }}
        >
          <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
            &copy; {year} Obsa Tesfaye Demesa. All rights reserved.
          </p>
          <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
            Built with{' '}
            <span style={{ color: 'var(--color-primary)' }}>React</span>,{' '}
            <span style={{ color: 'var(--color-primary)' }}>Node.js</span> &amp;{' '}
            <span style={{ color: 'var(--color-primary)' }}>MongoDB</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
