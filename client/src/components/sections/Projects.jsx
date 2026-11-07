import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionWrapper from '../ui/SectionWrapper';
import SectionHeader from '../ui/SectionHeader';
import { SkeletonGrid } from '../ui/SkeletonCard';
import { fetchProjects } from '../../services/portfolioService';
import { staggerContainer, staggerItem, viewport } from '../../utils/animations';

const PLACEHOLDER = '/images/placeholder.svg';

const FILTERS = [
  { key: 'all',       label: 'All'        },
  { key: 'fullstack', label: 'Full-Stack' },
  { key: 'frontend',  label: 'Frontend'   },
  { key: 'design',    label: 'Design'     },
];

/* ---- Project Card ---- */
function ProjectCard({ project, onOpen }) {
  const hasTags    = Array.isArray(project.techStack) && project.techStack.length > 0;
  const visibleTags = hasTags ? project.techStack.slice(0, 4) : [];
  const extraTags   = hasTags ? project.techStack.length - 4 : 0;

  // Only render Live/GitHub if the URL is a real link (not empty / "#")
  const liveUrl   = project.liveUrl   && project.liveUrl   !== '#' ? project.liveUrl   : null;
  const githubUrl = project.githubUrl && project.githubUrl !== '#' ? project.githubUrl : null;

  return (
    <motion.article
      variants={staggerItem}
      className="card flex flex-col overflow-hidden group"
      aria-label={`Project: ${project.title}`}
    >
      {/* Image — fixed 16/9 aspect ratio */}
      <div
        className="relative w-full overflow-hidden bg-[var(--color-bg-secondary)]"
        style={{ aspectRatio: '16/9' }}
      >
        <img
          src={project.image || PLACEHOLDER}
          alt={project.image ? `Screenshot of ${project.title}` : `No screenshot available for ${project.title}`}
          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          width="800"
          height="450"
          onError={(e) => {
            if (e.currentTarget.src !== window.location.origin + PLACEHOLDER) {
              e.currentTarget.src = PLACEHOLDER;
            }
          }}
        />

        {/* Badges — always top layer, no overlap */}
        <div className="absolute top-2 left-2 right-2 flex items-center justify-between gap-1 pointer-events-none">
          <span
            className="badge text-xs capitalize"
            style={{
              background: 'rgba(0,0,0,0.6)',
              color: '#fff',
              borderColor: 'transparent',
              backdropFilter: 'blur(4px)',
            }}
          >
            {project.category}
          </span>
          {project.featured && (
            <span
              className="badge text-xs text-white"
              style={{ background: 'var(--color-primary)', borderColor: 'transparent' }}
            >
              Featured
            </span>
          )}
        </div>
      </div>

      {/* Body — flex column, grows to fill, buttons pinned to bottom */}
      <div className="flex flex-col flex-1 p-5">
        <h3
          className="font-heading font-bold text-base mb-2 leading-snug"
          style={{ color: 'var(--color-text)' }}
        >
          {project.title}
        </h3>

        {/* Description — 3-line clamp, never breaks layout */}
        <p
          className="text-sm mb-3"
          style={{
            color: 'var(--color-text-muted)',
            lineHeight: 1.6,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            flexGrow: 1,
          }}
        >
          {project.description}
        </p>

        {/* Tech tags — wraps cleanly, max 4 + overflow chip */}
        {hasTags && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {visibleTags.map((tech) => (
              <span key={tech} className="badge badge-primary text-xs">
                {tech}
              </span>
            ))}
            {extraTags > 0 && (
              <span className="badge text-xs">+{extraTags}</span>
            )}
          </div>
        )}

        {/* Action buttons — always at bottom */}
        <div className="flex gap-2 mt-auto pt-1">
          <button
            onClick={() => onOpen(project)}
            className="btn btn-ghost btn-sm flex-1"
            aria-label={`View details for ${project.title}`}
          >
            Details
          </button>
          {liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-sm flex-1"
              aria-label={`Live demo of ${project.title} (opens in new tab)`}
            >
              <ExternalIcon /> Live
            </a>
          )}
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn-sm"
              aria-label={`GitHub repository for ${project.title} (opens in new tab)`}
            >
              <GithubIcon />
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}

/* ---- Detail Modal ---- */
function ProjectModal({ project, onClose }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!project) return null;

  const liveUrl   = project.liveUrl   && project.liveUrl   !== '#' ? project.liveUrl   : null;
  const githubUrl = project.githubUrl && project.githubUrl !== '#' ? project.githubUrl : null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
          aria-hidden="true"
        />
        {/* Panel */}
        <motion.div
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl"
          style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.92, opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* Image */}
          <div
            className="w-full overflow-hidden rounded-t-2xl bg-[var(--color-bg-secondary)]"
            style={{ aspectRatio: '16/9' }}
          >
            <img
              src={project.image || PLACEHOLDER}
              alt={project.image ? `Screenshot of ${project.title}` : `No screenshot for ${project.title}`}
              className="w-full h-full object-cover object-top"
              loading="lazy"
              onError={(e) => {
                if (e.currentTarget.src !== window.location.origin + PLACEHOLDER) {
                  e.currentTarget.src = PLACEHOLDER;
                }
              }}
            />
          </div>

          {/* Content */}
          <div className="p-6">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center transition-colors"
              style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text-muted)' }}
              aria-label="Close modal"
            >
              <CloseIcon />
            </button>

            <h2
              id="modal-title"
              className="font-heading font-bold text-2xl mb-1"
              style={{ color: 'var(--color-text)' }}
            >
              {project.title}
            </h2>
            <span className="badge capitalize mb-4 inline-block">{project.category}</span>

            <p
              className="text-base leading-relaxed mb-5"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {project.description}
            </p>

            {Array.isArray(project.techStack) && project.techStack.length > 0 && (
              <div className="mb-5">
                <p
                  className="text-xs font-semibold uppercase tracking-wide mb-2"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  Tech Stack
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech) => (
                    <span key={tech} className="badge badge-primary">{tech}</span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              {liveUrl && (
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  aria-label={`Live demo of ${project.title} (opens in new tab)`}
                >
                  <ExternalIcon /> Live Demo
                </a>
              )}
              {githubUrl && (
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline"
                  aria-label={`View source code for ${project.title} on GitHub (opens in new tab)`}
                >
                  <GithubIcon /> View Code
                </a>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ---- Main Section ---- */
export default function Projects() {
  const [projects, setProjects]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [activeFilter, setFilter] = useState('all');
  const [selected, setSelected]   = useState(null);

  useEffect(() => {
    fetchProjects().then(({ data }) => {
      setProjects(data || []);
      setLoading(false);
    });
  }, []);

  const filtered =
    activeFilter === 'all'
      ? projects
      : projects.filter((p) => p.category === activeFilter);

  const handleOpen  = useCallback((p) => setSelected(p), []);
  const handleClose = useCallback(() => setSelected(null), []);

  return (
    <SectionWrapper id="projects" ariaLabel="Projects">
      <SectionHeader
        label="What I Have Built"
        title="Projects"
        subtitle="A selection of applications I've built — from full-stack platforms to graphic design work."
      />

      {/* Filter tabs */}
      <div
        className="flex flex-wrap justify-center gap-2 mb-10"
        role="tablist"
        aria-label="Filter projects by category"
      >
        {FILTERS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            role="tab"
            aria-selected={activeFilter === key}
            className="btn btn-sm transition-all"
            style={{
              background:   activeFilter === key ? 'var(--color-primary)' : 'var(--color-bg-card)',
              color:        activeFilter === key ? '#fff' : 'var(--color-text-secondary)',
              border:       `1.5px solid ${activeFilter === key ? 'var(--color-primary)' : 'var(--color-border)'}`,
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <SkeletonGrid count={6} cols={3} lines={3} />
      ) : (
        <motion.div
          key={activeFilter}
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filtered.length > 0 ? (
            filtered.map((project) => (
              <ProjectCard
                key={project._id || project.slug}
                project={project}
                onOpen={handleOpen}
              />
            ))
          ) : (
            <p
              className="col-span-3 text-center py-16"
              style={{ color: 'var(--color-text-muted)' }}
            >
              No projects found in this category.
            </p>
          )}
        </motion.div>
      )}

      {selected && <ProjectModal project={selected} onClose={handleClose} />}
    </SectionWrapper>
  );
}

/* ---- Icons ---- */
function ExternalIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}
function GithubIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}
function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
