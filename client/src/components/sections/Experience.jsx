import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SectionWrapper from '../ui/SectionWrapper';
import SectionHeader from '../ui/SectionHeader';
import { SkeletonGrid } from '../ui/SkeletonCard';
import { fetchExperience } from '../../services/portfolioService';
import { staggerContainer, staggerItem, viewport } from '../../utils/animations';

// Static education entry (not from API — always shown)
const EDUCATION = {
  title: 'BSc Computer Science',
  company: 'Haramaya University',
  location: 'College of Computing and Informatics, Ethiopia',
  startDate: 'September 2024',
  endDate: '2027 (Expected)',
  type: 'Education',
  highlights: [
    'Currently in 4th year of a 4-year BSc program in Computer Science.',
    'Actively engaged in practical projects beyond the curriculum including web development and IoT.',
    'Developed strong foundations in algorithms, data structures, databases, and software engineering.',
    'Languages spoken: Afaan Oromo (Native), Amharic (Fluent), English (Intermediate).',
  ],
};

const TYPE_COLORS = {
  Internship: '#3b82f6',
  Education:  '#8b5cf6',
  'Full-time': '#10b981',
  Freelance:  '#f97316',
  'Part-time': '#f59e0b',
};

function TimelineItem({ item, index, isLast }) {
  const color = TYPE_COLORS[item.type] || 'var(--color-primary)';

  return (
    <motion.div
      variants={staggerItem}
      className="relative flex gap-6"
    >
      {/* Timeline line */}
      {!isLast && (
        <div
          className="absolute left-5 top-12 bottom-0 w-0.5"
          style={{ background: 'var(--color-border)' }}
          aria-hidden="true"
        />
      )}

      {/* Timeline dot */}
      <div className="flex-shrink-0 mt-1">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md z-10 relative"
          style={{ background: color }}
          aria-hidden="true"
        >
          {item.type === 'Education' ? '🎓' : '💼'}
        </div>
      </div>

      {/* Content card */}
      <div className="flex-1 card p-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
          <div>
            <h3 className="font-heading font-bold text-lg" style={{ color: 'var(--color-text)' }}>
              {item.title}
            </h3>
            <p className="font-medium" style={{ color: color }}>
              {item.company}
            </p>
            {item.location && (
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                📍 {item.location}
              </p>
            )}
            {item.focus && (
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                Focus: {item.focus}
              </p>
            )}
          </div>
          <div className="flex flex-col items-start sm:items-end gap-1 flex-shrink-0">
            <span
              className="badge"
              style={{ background: `${color}20`, color, borderColor: `${color}40` }}
            >
              {item.type}
            </span>
            <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              {item.startDate} — {item.endDate}
            </span>
          </div>
        </div>

        {item.highlights?.length > 0 && (
          <ul className="space-y-2 mt-3" role="list">
            {item.highlights.map((h, i) => (
              <li key={i} className="flex gap-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                <span style={{ color, marginTop: '4px', flexShrink: 0 }} aria-hidden="true">▸</span>
                {h}
              </li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
  );
}

export default function Experience() {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExperience().then(({ data }) => {
      setItems(data || []);
      setLoading(false);
    });
  }, []);

  const allItems = [
    ...items,
    { ...EDUCATION, _id: 'edu-static', order: 99 },
  ];

  return (
    <SectionWrapper id="experience" ariaLabel="Experience and Education">
      <SectionHeader
        label="My Journey"
        title="Experience & Education"
        subtitle="Where I have worked and studied."
      />

      {loading ? (
        <SkeletonGrid count={2} cols={1} lines={4} />
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="max-w-3xl mx-auto"
          role="list"
          aria-label="Experience timeline"
        >
          {allItems.map((item, i) => (
            <TimelineItem
              key={item._id}
              item={item}
              index={i}
              isLast={i === allItems.length - 1}
            />
          ))}
        </motion.div>
      )}
    </SectionWrapper>
  );
}
