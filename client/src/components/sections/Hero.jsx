import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { fadeUp, staggerContainer, staggerItem, viewport } from '../../utils/animations';
import { trackCvDownload } from '../../services/portfolioService';

const ROLES = [
  'Full-Stack Developer',
  'MERN Stack Engineer',
  'Backend Developer',
  'React Developer',
  'CS Student @ Haramaya University',
];

const SOCIALS = [
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
    href: 'https://t.me/Obsa_dev',
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

/** Typing animation hook */
function useTypingAnimation(words) {
  const [displayText, setDisplayText] = useState('');
  const [wordIndex, setWordIndex]     = useState(0);
  const [charIndex, setCharIndex]     = useState(0);
  const [isDeleting, setIsDeleting]   = useState(false);

  useEffect(() => {
    const current = words[wordIndex];
    const speed = isDeleting ? 50 : 80;
    const pause = 2000;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        setDisplayText(current.slice(0, charIndex + 1));
        if (charIndex + 1 === current.length) {
          setTimeout(() => setIsDeleting(true), pause);
        } else {
          setCharIndex((c) => c + 1);
        }
      } else {
        setDisplayText(current.slice(0, charIndex - 1));
        if (charIndex - 1 === 0) {
          setIsDeleting(false);
          setWordIndex((w) => (w + 1) % words.length);
          setCharIndex(0);
        } else {
          setCharIndex((c) => c - 1);
        }
      }
    }, speed);

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, wordIndex, words]);

  return displayText;
}

export default function Hero() {
  const typedText = useTypingAnimation(ROLES);

  const handleCvClick = useCallback(() => {
    trackCvDownload();
  }, []);

  const scrollTo = useCallback((id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center scroll-mt-nav overflow-hidden"
      aria-label="Hero — Introduction"
    >
      {/* Background gradient blobs */}
      <div
        className="absolute top-1/4 right-0 w-[600px] h-[600px] rounded-full blur-3xl pointer-events-none opacity-30"
        style={{ background: 'var(--color-primary-glow)' }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-0 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-20"
        style={{ background: 'var(--color-primary-glow)' }}
        aria-hidden="true"
      />

      <div className="container relative z-10 pt-24 pb-16">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

          {/* ---- Left: Text content ---- */}
          <motion.div
            className="flex-1 max-w-2xl"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.p variants={staggerItem} className="section-label mb-3">
              Welcome — I&apos;m glad you&apos;re here
            </motion.p>

            <motion.h1
              variants={staggerItem}
              className="font-heading font-extrabold mb-4"
              style={{ fontSize: 'clamp(2.2rem, 6vw, 4rem)', lineHeight: 1.1, color: 'var(--color-text)' }}
            >
              Hi, I&apos;m{' '}
              <span className="gradient-text">Obsa Tesfaye</span>
            </motion.h1>

            {/* Typing animation */}
            <motion.div
              variants={staggerItem}
              className="flex items-center gap-2 mb-5 h-8"
              aria-live="polite"
              aria-label={`Currently showing: ${typedText}`}
            >
              <span
                className="text-xl font-semibold font-heading"
                style={{ color: 'var(--color-primary)' }}
              >
                {typedText}
              </span>
              <span
                className="w-0.5 h-6 animate-[blink_1s_step-end_infinite]"
                style={{ background: 'var(--color-primary)' }}
                aria-hidden="true"
              />
            </motion.div>

            <motion.p
              variants={staggerItem}
              className="text-base md:text-lg mb-8 leading-relaxed max-w-xl"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Full-Stack Developer (MERN) and 4th-year Computer Science student at
              Haramaya University. I build clean, scalable web applications — from
              REST APIs to polished user interfaces.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={staggerItem} className="flex flex-wrap gap-3 mb-8">
              <button
                onClick={() => scrollTo('projects')}
                className="btn btn-primary btn-lg"
                aria-label="View my projects"
              >
                <EyeIcon />
                View My Work
              </button>
              <a
                href="/Obsa_Tesfaye_CV.pdf"
                download="Obsa_Tesfaye_CV.pdf"
                className="btn btn-outline btn-lg"
                onClick={handleCvClick}
                aria-label="Download CV PDF"
              >
                <DownloadIcon />
                Download CV
              </a>
            </motion.div>

            {/* Social icons */}
            <motion.div
              variants={staggerItem}
              className="flex items-center gap-3"
              role="list"
              aria-label="Social media links"
            >
              {SOCIALS.map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('mailto:') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
                  style={{
                    background: 'var(--color-bg-card)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text-muted)',
                  }}
                  aria-label={label}
                  role="listitem"
                >
                  {icon}
                </a>
              ))}
            </motion.div>
          </motion.div>

          {/* ---- Right: Profile photo ---- */}
          <motion.div
            className="flex-shrink-0"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
          >
            <div className="relative">
              {/* Outer glow ring */}
              <div
                className="absolute inset-0 rounded-full blur-xl opacity-40 scale-110"
                style={{ background: 'var(--color-primary-glow)' }}
                aria-hidden="true"
              />
              {/* Border ring */}
              <div
                className="relative w-56 h-56 md:w-72 md:h-72 rounded-full p-1"
                style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-hover))' }}
              >
                {/* Overflow wrapper — hover scale applied here, not on img */}
                <div
                  className="w-full h-full rounded-full overflow-hidden bg-[var(--color-bg-secondary)] profile-photo-wrapper"
                >
                  <img
                    src="/images/profile.png"
                    alt="Obsa Tesfaye Demesa — Full-Stack Developer"
                    className="w-full h-full object-cover object-top profile-photo-img"
                    loading="eager"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const fb = document.getElementById('profile-fallback');
                      if (fb) fb.style.display = 'flex';
                    }}
                  />
                  {/* Fallback initials — hidden until image fails */}
                  <div
                    id="profile-fallback"
                    className="w-full h-full items-center justify-center font-heading font-bold text-4xl text-white"
                    style={{ background: 'var(--color-primary)', display: 'none' }}
                    aria-hidden="true"
                  >
                    OT
                  </div>
                </div>
              </div>

              {/* Floating badge — Available for work */}
              <motion.div
                className="absolute -bottom-2 -right-2 px-3 py-1.5 rounded-full text-xs font-semibold text-white flex items-center gap-1.5 shadow-lg"
                style={{ background: 'var(--color-primary)' }}
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" aria-hidden="true" />
                Open to Work
              </motion.div>
            </div>
          </motion.div>

        </div>

        {/* Scroll indicator */}
        <motion.button
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-60 hover:opacity-100 transition-opacity"
          style={{ color: 'var(--color-text-muted)' }}
          onClick={() => scrollTo('about')}
          aria-label="Scroll to About section"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span className="text-xs">Scroll</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </motion.button>
      </div>

      {/* Blinking cursor keyframes (injected inline) */}
      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
      `}</style>
    </section>
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
function EyeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
