import { useState, useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import SectionWrapper from '../ui/SectionWrapper';
import SectionHeader from '../ui/SectionHeader';
import { SkeletonGrid } from '../ui/SkeletonCard';
import { fetchSkills } from '../../services/portfolioService';
import { staggerContainer, staggerItem, viewport, fadeUp } from '../../utils/animations';

const CATEGORY_META = {
  frontend: { label: 'Frontend',  emoji: '🎨', color: '#3b82f6' },
  backend:  { label: 'Backend',   emoji: '⚙️',  color: '#10b981' },
  database: { label: 'Database',  emoji: '🗄️',  color: '#8b5cf6' },
  design:   { label: 'Design',    emoji: '✏️',  color: '#f97316' },
  tools:    { label: 'Tools',     emoji: '🛠️',  color: '#f59e0b' },
};

/** Animated progress bar — uses useInView so it fires reliably regardless of parent motion state */
function SkillBar({ level }) {
  const ref      = useRef(null);
  const inView   = useInView(ref, { once: true, amount: 0.5 });
  const controls = useAnimation();

  useEffect(() => {
    if (inView) {
      controls.start({ width: `${level}%`, transition: { duration: 1, ease: 'easeOut', delay: 0.15 } });
    }
  }, [inView, level, controls]);

  return (
    <div
      ref={ref}
      className="w-20 h-1.5 rounded-full overflow-hidden flex-shrink-0"
      style={{ background: 'var(--color-border)' }}
      role="progressbar"
      aria-valuenow={level}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <motion.div
        className="h-full rounded-full"
        style={{ background: 'var(--color-primary)', width: 0 }}
        animate={controls}
      />
    </div>
  );
}

function SkillTag({ skill }) {
  return (
    <motion.div
      variants={staggerItem}
      className="flex items-center justify-between gap-3 p-3 rounded-lg"
      style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
    >
      <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
        {skill.name}
      </span>
      {skill.level != null && (
        <div className="flex items-center gap-2 flex-shrink-0">
          <SkillBar level={skill.level} />
          <span className="text-xs w-8 text-right" style={{ color: 'var(--color-text-muted)' }}>
            {skill.level}%
          </span>
        </div>
      )}
    </motion.div>
  );
}

function CategoryCard({ category, skills }) {
  const meta = CATEGORY_META[category] || { label: category, emoji: '💡', color: 'var(--color-primary)' };

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      className="card p-6"
    >
      {/* Category header */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
          style={{ background: `${meta.color}20` }}
          aria-hidden="true"
        >
          {meta.emoji}
        </div>
        <h3
          className="font-heading font-semibold text-base"
          style={{ color: 'var(--color-text)' }}
        >
          {meta.label}
        </h3>
        <span className="ml-auto badge" style={{ color: meta.color }}>
          {skills.length}
        </span>
      </div>

      <motion.div
        className="space-y-2"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
      >
        {skills.map((skill) => (
          <SkillTag key={skill._id || skill.name} skill={skill} />
        ))}
      </motion.div>
    </motion.div>
  );
}

export default function Skills() {
  const [skillsByCategory, setSkillsByCategory] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSkills().then(({ data }) => {
      // Group by category
      const grouped = (data || []).reduce((acc, skill) => {
        if (!acc[skill.category]) acc[skill.category] = [];
        acc[skill.category].push(skill);
        return acc;
      }, {});
      setSkillsByCategory(grouped);
      setLoading(false);
    });
  }, []);

  const categoryOrder = ['frontend', 'backend', 'database', 'design', 'tools'];
  const orderedCategories = categoryOrder.filter((c) => skillsByCategory[c]?.length > 0);

  return (
    <SectionWrapper id="skills" alt ariaLabel="Skills">
      <SectionHeader
        label="What I Work With"
        title="Skills & Technologies"
        subtitle="A snapshot of the tools, languages, and frameworks I use to build things."
      />

      {loading ? (
        <SkeletonGrid count={5} cols={3} lines={4} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orderedCategories.map((cat) => (
            <CategoryCard
              key={cat}
              category={cat}
              skills={skillsByCategory[cat]}
            />
          ))}
        </div>
      )}
    </SectionWrapper>
  );
}
