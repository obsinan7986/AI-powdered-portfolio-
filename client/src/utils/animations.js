/**
 * Shared Framer Motion animation variants.
 * Import these into any component to keep animations consistent.
 */

export const fadeUp = {
  hidden:  { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};

export const fadeIn = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
};

export const staggerContainer = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.1 } },
};

export const staggerItem = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

export const scaleIn = {
  hidden:  { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: 'easeOut' } },
};

/** Viewport settings — trigger animation when 10% of element is visible */
export const viewport = { once: true, amount: 0.1 };
