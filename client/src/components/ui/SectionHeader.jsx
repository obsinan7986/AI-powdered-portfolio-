import { motion } from 'framer-motion';
import { fadeUp, viewport } from '../../utils/animations';

export default function SectionHeader({ label, title, subtitle, align = 'center' }) {
  const alignClass = align === 'left' ? 'text-left' : 'text-center';
  const dividerClass = align === 'left' ? 'divider divider-left' : 'divider';

  return (
    <motion.div
      className={`section-header ${alignClass}`}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
    >
      <span className="section-label">{label}</span>
      <h2 className="section-title">{title}</h2>
      <div className={dividerClass} aria-hidden="true" />
      {subtitle && <p className="section-subtitle">{subtitle}</p>}
    </motion.div>
  );
}
