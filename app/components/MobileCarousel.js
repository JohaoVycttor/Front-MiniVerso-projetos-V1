"use client";

import { Children, useEffect, useId, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import "./mobile-content.css";

export default function MobileCarousel({ children, className = "", style, label, resetKey }) {
  const track = useRef(null);
  const meter = useRef(null);
  const selected = useRef(0);
  const refresh = useRef(() => {});
  const id = useId();
  const count = Children.count(children);
  const [status, setStatus] = useState({ mobile: false, overflow: false, index: 0, previous: false, next: false });

  useEffect(() => {
    const element = track.current;
    const breakpoint = matchMedia("(max-width: 760px)");
    let frame;
    const measure = () => {
      const max = Math.max(0, element.scrollWidth - element.clientWidth);
      const left = Math.max(0, Math.min(max, element.scrollLeft));
      const cards = [...element.children];
      const origin = cards[0]?.offsetLeft || 0;
      const index = cards.reduce((closest, card, i) =>
        Math.abs(card.offsetLeft - origin - left) < Math.abs(cards[closest].offsetLeft - origin - left) ? i : closest, 0);
      selected.current = index;
      const fraction = Math.min(1, Math.max(.12, element.clientWidth / Math.max(1, element.scrollWidth)));
      meter.current?.style.setProperty("--carousel-thumb-width", `${fraction * 100}%`);
      meter.current?.style.setProperty("--carousel-thumb-offset", `${max ? (left / max) * (1 - fraction) / fraction * 100 : 0}%`);
      const next = { mobile: breakpoint.matches, overflow: count > 1 && max > 2, index, previous: left > 2, next: left < max - 2 };
      setStatus(current => Object.keys(next).every(key => current[key] === next[key]) ? current : next);
    };
    const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(measure); };
    refresh.current = schedule;
    const observer = new ResizeObserver(schedule);
    observer.observe(element);
    for (const child of element.children) observer.observe(child);
    element.addEventListener("scroll", schedule, { passive: true });
    breakpoint.addEventListener("change", schedule);
    schedule();
    return () => { cancelAnimationFrame(frame); observer.disconnect(); element.removeEventListener("scroll", schedule); breakpoint.removeEventListener("change", schedule); };
  }, [children, count]);

  useEffect(() => { track.current.scrollLeft = 0; refresh.current(); }, [resetKey]);

  function goTo(index) {
    const element = track.current;
    const cards = element.children;
    const card = cards[Math.max(0, Math.min(cards.length - 1, index))];
    if (!card) return;
    element.scrollTo({ left: card.offsetLeft - cards[0].offsetLeft, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }

  function onKeyDown(event) {
    if (!status.mobile || event.target !== event.currentTarget) return;
    const destinations = { ArrowLeft: selected.current - 1, ArrowRight: selected.current + 1, Home: 0, End: count - 1 };
    if (!(event.key in destinations)) return;
    event.preventDefault();
    goTo(destinations[event.key]);
  }

  return <div className="mobile-carousel" data-overflow={status.overflow || undefined}>
    <div ref={track} id={id} className={`${className} mobile-carousel-track`} style={style} role={status.mobile && status.overflow ? "region" : undefined} aria-roledescription={status.mobile && status.overflow ? "carrossel" : undefined} aria-label={status.mobile && status.overflow ? label : undefined} tabIndex={status.mobile && status.overflow ? 0 : undefined} onKeyDown={onKeyDown}>{children}</div>
    <div className="mobile-carousel-controls" hidden={!status.mobile || !status.overflow}>
      <div className="mobile-carousel-meter" ref={meter} aria-hidden="true"><span/></div>
      <div className="mobile-carousel-navigation"><span className="mobile-carousel-hint">Deslize para explorar</span><div>
        <button type="button" aria-label={`Anterior: ${label}`} aria-controls={id} disabled={!status.previous} onClick={() => goTo(selected.current - 1)}><ArrowLeft size={16}/></button>
        <span className="mobile-carousel-count" role="status" aria-live="polite" aria-atomic="true"><span className="carousel-sr-only">Item </span>{String(status.index + 1).padStart(2, "0")}<span aria-hidden="true"> / </span><span className="carousel-sr-only"> de </span>{String(count).padStart(2, "0")}</span>
        <button type="button" aria-label={`Próximo: ${label}`} aria-controls={id} disabled={!status.next} onClick={() => goTo(selected.current + 1)}><ArrowRight size={16}/></button>
      </div></div>
    </div>
  </div>;
}
