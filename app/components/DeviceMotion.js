"use client";

import { useEffect, useRef } from "react";

export default function DeviceMotion({ as: Element = "div", children, ...props }) {
  const scene = useRef(null);

  useEffect(() => {
    const element = scene.current;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let observer;

    const prepare = rect => {
      element.dataset.deviceDirection = rect.bottom <= 0 ? "up" : "down";
      element.dataset.deviceMotion = "ready";
    };
    const setup = () => {
      observer?.disconnect();
      element.dataset.deviceMotion = "static";
      if (preference.matches || !window.IntersectionObserver) return;

      // Re-arm only after the entire scene leaves the viewport. The observer
      // tracks the stationary container, so moving devices cannot retrigger it.
      prepare(element.getBoundingClientRect());
      observer = new IntersectionObserver(entries => {
        for (const entry of entries) {
          if (element.contains(document.activeElement)) {
            element.dataset.deviceMotion = "static";
          } else if (!entry.isIntersecting) {
            prepare(entry.boundingClientRect);
          } else if (entry.intersectionRatio >= 0.18) {
            element.dataset.deviceMotion = "entered";
          }
        }
      }, { threshold: [0, 0.18] });
      observer.observe(element);
    };

    // Keyboard navigation should never have to wait for an entrance animation.
    const stop = () => { element.dataset.deviceMotion = "static"; };
    setup();
    element.addEventListener("focusin", stop);
    preference.addEventListener("change", setup);
    return () => {
      observer?.disconnect();
      element.removeEventListener("focusin", stop);
      preference.removeEventListener("change", setup);
    };
  }, []);

  return <Element ref={scene} {...props}>{children}</Element>;
}
