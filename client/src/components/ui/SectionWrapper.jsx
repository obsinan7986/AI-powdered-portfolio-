/**
 * SectionWrapper
 * Provides the scroll-margin-top offset, semantic <section> tag,
 * and the standard container width. All sections use this.
 */
export default function SectionWrapper({ id, alt = false, children, className = '', ariaLabel }) {
  return (
    <section
      id={id}
      className={`section scroll-mt-nav${alt ? ' section-alt' : ''} ${className}`}
      aria-label={ariaLabel}
    >
      <div className="container">
        {children}
      </div>
    </section>
  );
}
