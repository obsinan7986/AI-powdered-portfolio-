import { motion } from 'framer-motion';
import SectionWrapper from '../ui/SectionWrapper';
import SectionHeader from '../ui/SectionHeader';
import { staggerContainer, staggerItem, viewport } from '../../utils/animations';

const TESTIMONIALS = [
  {
    id: 1,
    name: 'OICT Supervisor',
    role: 'Technical Lead',
    company: 'OICT Training & Consultancy Solutions PLC',
    text: 'Obsa demonstrated exceptional technical ability during his internship. He picked up our existing codebase quickly, contributed meaningful features, and delivered the TechStore API ahead of schedule. A reliable and driven developer.',
    avatar: '/images/testimonials/supervisor.jpg',
    placeholder: true,
  },
];

function StarRating({ count = 5 }) {
  return (
    <div className="flex gap-0.5" role="img" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="var(--color-primary)" aria-hidden="true">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

function TestimonialCard({ item }) {
  return (
    <motion.div
      variants={staggerItem}
      className="card p-6 flex flex-col"
    >
      {/* Quote icon */}
      <svg
        className="w-8 h-8 mb-4 opacity-20"
        style={{ color: 'var(--color-primary)' }}
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
      </svg>

      <StarRating />

      <blockquote className="flex-1 mt-3 mb-5">
        <p
          className="text-sm leading-relaxed italic"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          &ldquo;{item.text}&rdquo;
        </p>
      </blockquote>

      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0"
          style={{ background: 'var(--color-primary-light)' }}
        >
          {item.placeholder ? (
            <div
              className="w-full h-full flex items-center justify-center font-bold text-sm"
              style={{ color: 'var(--color-primary)' }}
              aria-hidden="true"
            >
              {item.name.charAt(0)}
            </div>
          ) : (
            <img
              src={item.avatar}
              alt={item.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          )}
        </div>
        <div>
          <p className="font-semibold text-sm" style={{ color: 'var(--color-text)' }}>
            {item.name}
          </p>
          <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
            {item.role} &mdash; {item.company}
          </p>
        </div>
      </div>

      {item.placeholder && (
        <p
          className="text-xs mt-3 italic"
          style={{ color: 'var(--color-text-muted)' }}
        >
          * Full recommendation to be added once received.
        </p>
      )}
    </motion.div>
  );
}

export default function Testimonials() {
  return (
    <SectionWrapper id="testimonials" ariaLabel="Testimonials">
      <SectionHeader
        label="What People Say"
        title="Testimonials"
        subtitle="Feedback from people I have worked with."
      />

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
      >
        {TESTIMONIALS.map((item) => (
          <TestimonialCard key={item.id} item={item} />
        ))}

        {/* Placeholder — request more testimonials */}
        <motion.div
          variants={staggerItem}
          className="card p-6 flex flex-col items-center justify-center text-center"
          style={{ border: '2px dashed var(--color-border)' }}
        >
          <span className="text-3xl mb-3" aria-hidden="true">💬</span>
          <p className="text-sm font-medium mb-1" style={{ color: 'var(--color-text)' }}>
            More coming soon
          </p>
          <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
            I am actively collecting recommendations from collaborators and supervisors.
          </p>
        </motion.div>
      </motion.div>
    </SectionWrapper>
  );
}
