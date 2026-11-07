import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import SectionWrapper from '../ui/SectionWrapper';
import SectionHeader from '../ui/SectionHeader';
import { submitContact } from '../../services/portfolioService';
import { staggerContainer, staggerItem, viewport } from '../../utils/animations';

const CONTACT_INFO = [
  {
    icon: '📧',
    label: 'Email',
    value: 'obsatesfaye6370@gmail.com',
    href: 'mailto:obsatesfaye6370@gmail.com',
  },
  {
    icon: '📱',
    label: 'Phone',
    value: '+251 931 597 986',
    href: 'tel:+251931597986',
  },
  {
    icon: '🐙',
    label: 'GitHub',
    value: 'github.com/obsinan7986',
    href: 'https://github.com/obsinan7986',
  },
  {
    icon: '💼',
    label: 'LinkedIn',
    value: 'obsa-tesfaye-demesa',
    href: 'https://www.linkedin.com/in/obsa-tesfaye-demesa-67a41a363',
  },
  {
    icon: '✈️',
    label: 'Telegram',
    value: '@Obsa_dev',
    href: 'https://t.me/Obsa_dev',
  },
];

function Field({ label, error, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
        {label}
      </label>
      {children}
      {error && (
        <p className="text-xs" style={{ color: '#ef4444' }} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

function validate(values) {
  const errors = {};
  if (!values.name.trim())                           errors.name    = 'Name is required.';
  if (!values.email.trim())                          errors.email   = 'Email is required.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = 'Enter a valid email.';
  if (!values.message.trim())                        errors.message = 'Message is required.';
  else if (values.message.trim().length < 10)        errors.message = 'Message must be at least 10 characters.';
  return errors;
}

export default function Contact() {
  const [values, setValues] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [serverMsg, setServerMsg] = useState('');

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: '' }));
  }, [errors]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate(values);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setStatus('loading');
    setErrors({});

    try {
      const res = await submitContact(values);
      setServerMsg(res.data.message);
      setStatus('success');
      setValues({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      const msg = err.response?.data?.error || 'Something went wrong. Please try again.';
      setServerMsg(msg);
      setStatus('error');
    }
  };

  return (
    <SectionWrapper id="contact" alt ariaLabel="Contact">
      <SectionHeader
        label="Get in Touch"
        title="Contact Me"
        subtitle="Have a project, question, or just want to say hi? My inbox is open."
      />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">

        {/* ---- Left: Contact info ---- */}
        <motion.div
          className="lg:col-span-2 space-y-4"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          <motion.p variants={staggerItem} className="text-sm leading-relaxed mb-6" style={{ color: 'var(--color-text-secondary)' }}>
            I&apos;m currently open to internship and junior developer opportunities.
            Whether you want to discuss a project or just connect — feel free to reach out.
          </motion.p>

          {CONTACT_INFO.map(({ icon, label, value, href }) => (
            <motion.a
              key={label}
              href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              variants={staggerItem}
              className="flex items-center gap-4 p-4 rounded-xl transition-all group"
              style={{
                background: 'var(--color-bg-card)',
                border: '1px solid var(--color-border)',
              }}
              aria-label={`${label}: ${value}`}
            >
              <span
                className="w-10 h-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0 transition-transform group-hover:scale-110"
                style={{ background: 'var(--color-primary-light)' }}
                aria-hidden="true"
              >
                {icon}
              </span>
              <div className="min-w-0">
                <p className="text-xs font-medium mb-0.5" style={{ color: 'var(--color-text-muted)' }}>{label}</p>
                <p className="text-sm font-medium truncate" style={{ color: 'var(--color-text)' }}>{value}</p>
              </div>
            </motion.a>
          ))}
        </motion.div>

        {/* ---- Right: Form ---- */}
        <motion.div
          className="lg:col-span-3"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.55 }}
        >
          <div className="card p-8">
            {status === 'success' ? (
              <div className="text-center py-8">
                <span className="text-5xl" aria-hidden="true">🎉</span>
                <h3 className="font-heading font-bold text-xl mt-4 mb-2" style={{ color: 'var(--color-text)' }}>
                  Message Sent!
                </h3>
                <p className="text-sm mb-6" style={{ color: 'var(--color-text-muted)' }}>
                  {serverMsg}
                </p>
                <button
                  onClick={() => { setStatus('idle'); setServerMsg(''); }}
                  className="btn btn-outline btn-sm"
                >
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate aria-label="Contact form">
                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Field label="Name *" error={errors.name}>
                      <input
                        type="text"
                        name="name"
                        value={values.name}
                        onChange={handleChange}
                        className="input"
                        placeholder="Obsa Tesfaye"
                        autoComplete="name"
                        aria-required="true"
                        aria-invalid={!!errors.name}
                        aria-describedby={errors.name ? 'name-error' : undefined}
                        maxLength={100}
                      />
                    </Field>

                    <Field label="Email *" error={errors.email}>
                      <input
                        type="email"
                        name="email"
                        value={values.email}
                        onChange={handleChange}
                        className="input"
                        placeholder="you@example.com"
                        autoComplete="email"
                        aria-required="true"
                        aria-invalid={!!errors.email}
                        maxLength={200}
                      />
                    </Field>
                  </div>

                  <Field label="Subject" error={errors.subject}>
                    <input
                      type="text"
                      name="subject"
                      value={values.subject}
                      onChange={handleChange}
                      className="input"
                      placeholder="Project inquiry, collaboration..."
                      maxLength={200}
                    />
                  </Field>

                  <Field label="Message *" error={errors.message}>
                    <textarea
                      name="message"
                      value={values.message}
                      onChange={handleChange}
                      className="input resize-none"
                      rows={5}
                      placeholder="Tell me about your project or just say hi..."
                      aria-required="true"
                      aria-invalid={!!errors.message}
                      maxLength={2000}
                      style={{ lineHeight: '1.6' }}
                    />
                    <span className="text-xs self-end" style={{ color: 'var(--color-text-muted)' }}>
                      {values.message.length}/2000
                    </span>
                  </Field>

                  {status === 'error' && (
                    <div
                      className="p-3 rounded-lg text-sm"
                      style={{ background: '#fee2e2', color: '#dc2626' }}
                      role="alert"
                    >
                      {serverMsg}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="btn btn-primary w-full"
                    disabled={status === 'loading'}
                    aria-busy={status === 'loading'}
                  >
                    {status === 'loading' ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <SendIcon />
                        Send Message
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}

function SendIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}
