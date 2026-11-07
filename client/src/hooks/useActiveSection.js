/**
 * useActiveSection
 * Uses IntersectionObserver to track which section is currently
 * most visible in the viewport. Returns the active section id.
 */

import { useState, useEffect, useRef } from 'react';

export function useActiveSection(sectionIds, options = {}) {
  const [activeSection, setActiveSection] = useState('');
  const observerRef = useRef(null);

  useEffect(() => {
    const { threshold = 0.35, rootMargin = '-10% 0px -60% 0px' } = options;

    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (elements.length === 0) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        // Find the entry that is intersecting and has the highest ratio
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible.length > 0) {
          setActiveSection(visible[0].target.id);
        }
      },
      { threshold, rootMargin }
    );

    elements.forEach((el) => observerRef.current.observe(el));

    return () => observerRef.current?.disconnect();
  }, [sectionIds.join(',')]); // eslint-disable-line react-hooks/exhaustive-deps

  return activeSection;
}
