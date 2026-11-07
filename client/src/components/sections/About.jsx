import { motion } from 'framer-motion';
import SectionWrapper from '../ui/SectionWrapper';
import SectionHeader from '../ui/SectionHeader';
import { fadeUp, staggerContainer, staggerItem, viewport } from '../../utils/animations';

const STATS = [
  { value: '4th',  label: 'Year Student'          },
  { value: '2+',   label: 'Projects Completed'    },
  { value: '1',    label: 'Internship'             },
  { value: '2027', label: 'Expected Graduation'    },
];

const LANGUAGES = [
  { name: 'Afaan Oromo', level: 'Native'       },
  { name: 'Amharic',     level: 'Fluent'        },
  { name: 'English',     level: 'Intermediate'  },
];

export default function About() {
  return (
    <SectionWrapper id="about" alt ariaLabel="About Obsa Tesfaye">
      <SectionHeader
        label="Get to Know Me"
        title="About Me"
        subtitle="A passionate developer who loves turning ideas into real, impactful software."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

        {/* ---- Left: Bio ---- */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="space-y-5"
        >
          <motion.p variants={staggerItem} className="text-base leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
            I&apos;m <strong style={{ color: 'var(--color-text)' }}>Obsa Tesfaye Demesa</strong>, a
            motivated and patient Full-Stack Developer and 4th-year Computer Science student
            at <strong style={{ color: 'var(--color-primary)' }}>Haramaya University</strong>, College of Computing and Informatics.
          </motion.p>
          <motion.p variants={staggerItem} className="text-base leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
            I have practical experience in web development, graphic design, and software projects.
            I specialize in building robust, scalable applications using the
            <strong style={{ color: 'var(--color-text)' }}> MERN stack</strong> — MongoDB, Express, React, and Node.js.
          </motion.p>
          <motion.p variants={staggerItem} className="text-base leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
            I&apos;m passionate about solving real problems with clean code, continuously learning
            new technologies, and creating digital solutions that make a difference. Currently
            seeking opportunities to apply and grow my skills professionally.
          </motion.p>

          {/* Education card */}
          <motion.div
            variants={staggerItem}
            className="card p-5 mt-4"
            style={{ borderLeft: '3px solid var(--color-primary)' }}
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'var(--color-primary-light)' }}>
                <GradCapIcon />
              </div>
              <div>
                <p className="font-heading font-semibold text-sm" style={{ color: 'var(--color-text)' }}>
                  BSc Computer Science
                </p>
                <p className="text-sm" style={{ color: 'var(--color-primary)' }}>
                  Haramaya University — College of Computing &amp; Informatics
                </p>
                <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
                  4th Year &nbsp;·&nbsp; Expected Graduation: 2027 &nbsp;·&nbsp; In Progress
                </p>
              </div>
            </div>
          </motion.div>

          {/* Languages */}
          <motion.div variants={staggerItem} className="mt-4">
            <p className="text-sm font-semibold mb-3" style={{ color: 'var(--color-text-muted)' }}>Languages</p>
            <div className="flex flex-wrap gap-2">
              {LANGUAGES.map(({ name, level }) => (
                <span key={name} className="badge">
                  {name} <span style={{ color: 'var(--color-primary)', marginLeft: '4px' }}>· {level}</span>
                </span>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div variants={staggerItem} className="flex gap-3 pt-2">
            <a
              href="/Obsa_Tesfaye_CV.pdf"
              download="Obsa_Tesfaye_CV.pdf"
              className="btn btn-primary"
            >
              <DownloadIcon /> Download CV
            </a>
            <button
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn btn-ghost"
            >
              Contact Me
            </button>
          </motion.div>
        </motion.div>

        {/* ---- Right: Stats grid ---- */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          <div className="grid grid-cols-2 gap-4 mb-8">
            {STATS.map(({ value, label }) => (
              <motion.div
                key={label}
                variants={staggerItem}
                className="card p-6 text-center"
              >
                <p
                  className="font-heading font-extrabold text-3xl mb-1"
                  style={{ color: 'var(--color-primary)' }}
                >
                  {value}
                </p>
                <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  {label}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Availability badge */}
          <motion.div
            variants={fadeUp}
            className="card p-5 flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'var(--color-primary-light)' }}>
              <span className="text-xl" role="img" aria-label="Location">📍</span>
            </div>
            <div>
              <p className="font-semibold text-sm" style={{ color: 'var(--color-text)' }}>Based in Ethiopia</p>
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                Haramaya University &nbsp;·&nbsp; Open to remote opportunities
              </p>
            </div>
          </motion.div>
        </motion.div>

      </div>
    </SectionWrapper>
  );
}

function GradCapIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  );
}
function DownloadIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}
