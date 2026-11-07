import { motion } from 'framer-motion';
import SectionWrapper from '../ui/SectionWrapper';
import SectionHeader from '../ui/SectionHeader';
import { staggerContainer, staggerItem, viewport } from '../../utils/animations';

const SERVICES = [
  {
    icon: '💻',
    title: 'Web Development',
    description: 'Full-stack web applications built with React, Node.js, Express, and MongoDB. From REST APIs to complete MERN solutions — clean, fast, and scalable.',
    tags: ['React', 'Node.js', 'MongoDB', 'REST API'],
  },
  {
    icon: '🎨',
    title: 'Front-End Design',
    description: 'Clean, responsive, and accessible UIs with React and Tailwind CSS. Pixel-perfect implementations with smooth animations and great UX.',
    tags: ['React', 'Tailwind CSS', 'Responsive', 'Accessibility'],
  },
  {
    icon: '✏️',
    title: 'Graphic Design',
    description: 'Brand identity, logos, posters, and digital illustrations using Adobe Photoshop and Illustrator. Creative work grounded in visual principles.',
    tags: ['Photoshop', 'Illustrator', 'Branding', 'Print'],
  },
  {
    icon: '📐',
    title: 'UI Layout Design',
    description: 'Wireframes, mockups, and UI component systems that are both visually compelling and developer-friendly. From concept to clickable prototype.',
    tags: ['Wireframing', 'Mockups', 'UI Systems', 'Prototyping'],
  },
  {
    icon: '🔧',
    title: 'Technical Consulting',
    description: 'Architecture advice, code reviews, tech stack selection, and debugging support for your web projects. Practical guidance that moves things forward.',
    tags: ['Code Review', 'Architecture', 'Debugging', 'Stack Advice'],
  },
];

export default function Services() {
  return (
    <SectionWrapper id="services" alt ariaLabel="Services">
      <SectionHeader
        label="What I Offer"
        title="Services"
        subtitle="Ways I can help — whether you need a full application, a clean UI, or a second pair of eyes on your code."
      />

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
      >
        {SERVICES.map((service, i) => (
          <motion.div
            key={service.title}
            variants={staggerItem}
            className="card p-6 flex flex-col group"
            aria-label={service.title}
          >
            {/* Icon */}
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 transition-transform group-hover:scale-110"
              style={{ background: 'var(--color-primary-light)' }}
              aria-hidden="true"
            >
              {service.icon}
            </div>

            <h3
              className="font-heading font-semibold text-lg mb-2"
              style={{ color: 'var(--color-text)' }}
            >
              {service.title}
            </h3>
            <p
              className="text-sm leading-relaxed mb-4 flex-1"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {service.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mt-auto">
              {service.tags.map((tag) => (
                <span key={tag} className="badge text-xs">{tag}</span>
              ))}
            </div>

            {/* Subtle bottom accent */}
            <div
              className="h-0.5 mt-5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ background: 'linear-gradient(90deg, var(--color-primary), transparent)' }}
              aria-hidden="true"
            />
          </motion.div>
        ))}

        {/* CTA card */}
        <motion.div
          variants={staggerItem}
          className="card p-6 flex flex-col items-center justify-center text-center"
          style={{ border: '2px dashed var(--color-border)' }}
        >
          <span className="text-3xl mb-3" aria-hidden="true">🤝</span>
          <h3 className="font-heading font-semibold text-base mb-2" style={{ color: 'var(--color-text)' }}>
            Have a project in mind?
          </h3>
          <p className="text-sm mb-4" style={{ color: 'var(--color-text-muted)' }}>
            Let&apos;s talk about what you need and how I can help.
          </p>
          <button
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn btn-primary btn-sm"
            aria-label="Go to contact section"
          >
            Get in Touch
          </button>
        </motion.div>
      </motion.div>
    </SectionWrapper>
  );
}
