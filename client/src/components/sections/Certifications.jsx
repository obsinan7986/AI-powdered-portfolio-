import { motion } from 'framer-motion';
import SectionWrapper from '../ui/SectionWrapper';
import SectionHeader from '../ui/SectionHeader';
import { staggerContainer, staggerItem, viewport } from '../../utils/animations';

const CERTS = [
  {
    id: 1,
    title: 'Competitive Programming using Python',
    subtitle: '15-Day Online Course',
    issuer: 'HUCISA',
    org: 'Haramaya University — College of Computing and Informatics',
    date: 'April 26, 2025',
    emoji: '🏆',
    color: '#8b5cf6',
    verifyUrl: null,
  },
  {
    id: 2,
    title: 'Data Analysis Fundamentals',
    subtitle: 'Nanodegree Program Completion',
    issuer: 'Udacity',
    org: 'Part of Accenture',
    date: 'August 22, 2025',
    emoji: '📊',
    color: '#3b82f6',
    verifyUrl: 'https://www.udacity.com/certificate/e/a7a2f5c4-7ed5-11f0-bde2-23cc3de06561',
  },
  {
    id: 3,
    title: 'CE102: SS5 — How to Evaluate Resources',
    subtitle: 'Verified Certificate of Achievement',
    issuer: 'e-SHE',
    org: 'Ministry of Education, Ethiopia',
    date: '2025',
    emoji: '🎓',
    color: '#10b981',
    verifyUrl: null,
  },
  {
    id: 4,
    title: 'Internship Completion Certificate',
    subtitle: 'Full-Stack Developer Intern',
    issuer: 'OICT',
    org: 'OICT Training & Consultancy Solutions PLC',
    date: 'August 2026',
    emoji: '💼',
    color: '#f97316',
    verifyUrl: null,
  },
];

function CertCard({ cert }) {
  return (
    <motion.div
      variants={staggerItem}
      className="card p-5 flex gap-4 group"
    >
      {/* Icon */}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0 transition-transform group-hover:scale-110"
        style={{ background: `${cert.color}20` }}
        aria-hidden="true"
      >
        {cert.emoji}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <div>
            <h3
              className="font-heading font-semibold text-sm leading-tight"
              style={{ color: 'var(--color-text)' }}
            >
              {cert.title}
            </h3>
            <p className="text-xs mt-0.5" style={{ color: cert.color, fontWeight: 600 }}>
              {cert.issuer} &nbsp;·&nbsp; {cert.subtitle}
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
              {cert.org}
            </p>
          </div>
          <span className="badge text-xs flex-shrink-0">{cert.date}</span>
        </div>

        {/* Verify link */}
        {cert.verifyUrl && (
          <a
            href={cert.verifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs mt-2 font-medium transition-colors hover:underline"
            style={{ color: cert.color }}
            aria-label={`Verify ${cert.title} certificate`}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
            Verify Certificate
          </a>
        )}
      </div>

      {/* Accent line on hover */}
      <div
        className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-xl opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background: cert.color }}
        aria-hidden="true"
      />
    </motion.div>
  );
}

export default function Certifications() {
  return (
    <SectionWrapper id="certifications" alt ariaLabel="Certifications and Achievements">
      <SectionHeader
        label="Verified Achievements"
        title="Certifications"
        subtitle="Courses, programs, and certificates I have completed and earned."
      />

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
      >
        {CERTS.map((cert) => (
          <CertCard key={cert.id} cert={cert} />
        ))}
      </motion.div>
    </SectionWrapper>
  );
}
