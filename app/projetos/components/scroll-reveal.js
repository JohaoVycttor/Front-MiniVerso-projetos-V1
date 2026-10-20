'use client';

import {useEffect, useRef} from 'react';

export function ScrollReveal({children}) {
  const root = useRef(null);

  useEffect(() => {
    const container = root.current;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!container || !('IntersectionObserver' in window)) return;

    const seen = new WeakSet();
    const animations = new Map();
    const selector = '.hero-section > *, .featured-project, .section-topline, .category-filters, .project-card, .contact-inner > *, [data-case-reveal]';
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const animation = animations.get(entry.target);
        if (animation) {
          animation.play();
          animation.finished.then(() => {
            animation.cancel();
            animations.delete(entry.target);
          }).catch(() => {});
        }
        observer.unobserve(entry.target);
      }
    }, {threshold: 0, rootMargin: '0px 0px -32px 0px'});

    function register() {
      if (preference.matches) return;
      container.querySelectorAll(selector).forEach(element => {
        if (seen.has(element)) return;
        if (document.body.dataset.cardEntrance === "false" && (element.matches(".project-card,.featured-project") || element.querySelector(".case-benefit,.case-gallery"))) return;
        seen.add(element);
        const bounds = element.getBoundingClientRect();
        if (bounds.bottom <= 0) return;
        const index = element.matches('.project-card')
          ? Array.from(element.parentElement.children).indexOf(element) % 3 : 0;
        const animation = element.animate([
          {opacity: 0, translate: '0 28px'},
          {opacity: 1, translate: '0 0'}
        ], {duration: 750, delay: index * 85, easing: 'cubic-bezier(.22, 1, .36, 1)', fill: 'both'});
        animation.pause();
        animations.set(element, animation);
        observer.observe(element);
      });
      for (const [element, animation] of animations) {
        if (!container.contains(element)) {
          animation.cancel();
          observer.unobserve(element);
          animations.delete(element);
        }
      }
    }
    function updatePreference() {
      if (preference.matches) {
        observer.disconnect();
        for (const animation of animations.values()) animation.cancel();
        animations.clear();
      } else register();
    }
    register();
    const mutations = new MutationObserver(register);
    mutations.observe(container, {childList: true, subtree: true});
    preference.addEventListener('change', updatePreference);
    return () => {
      mutations.disconnect();
      observer.disconnect();
      preference.removeEventListener('change', updatePreference);
      for (const animation of animations.values()) animation.cancel();
    };
  }, []);

  return <div ref={root} className="projects-scroll-reveal">{children}</div>;
}
