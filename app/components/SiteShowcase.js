"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import DeviceMotion from "./DeviceMotion";
import styles from "./site-showcase.module.css";

const devices = [
  { id: "monitor", label: "Studio Display" },
  { id: "notebook", label: "MacBook" },
  { id: "celular", label: "Celular" },
  { id: "tablet", label: "Tablet" },
];

export default function SiteShowcase() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);
  const [hidden, setHidden] = useState(false);
  const [focused, setFocused] = useState(false);
  const canvas = useRef(null);
  const id = useId();
  const device = devices[active];

  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const onPreferenceChange = () => setReducedMotion(preference.matches);
    const onVisibilityChange = () => setHidden(document.hidden);
    onPreferenceChange();
    onVisibilityChange();
    let observer;
    if (window.IntersectionObserver) {
      observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting && entry.intersectionRatio >= 0.18), { threshold: [0, 0.18] });
      observer.observe(canvas.current);
    } else {
      setVisible(true);
    }
    preference.addEventListener("change", onPreferenceChange);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      observer?.disconnect();
      preference.removeEventListener("change", onPreferenceChange);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (!visible || hidden || paused || reducedMotion || focused) return;
    const timer = setTimeout(() => setActive(index => (index + 1) % devices.length), 4500);
    return () => clearTimeout(timer);
  }, [active, visible, hidden, paused, reducedMotion, focused]);

  function choose(index) {
    setActive(index);
    setPaused(true);
  }

  return <DeviceMotion as="figure" className={styles.showcase} aria-label="O novo site da Miniverso em qualquer tela"
    onFocusCapture={() => setFocused(true)}
    onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}>
    <div className={styles.canvas} ref={canvas} id={id} data-device={device.id}>
      <Link href="/#projetos" className={styles.hardware} aria-label={`Explore o novo site da Miniverso — visualização em ${device.label.toLowerCase()}`}>
        <div className={styles.bezel}>
          <div className={styles.screen} aria-hidden="true">
            <div className={styles.viewport}>{devices.map((item, index) => <Image key={item.id} className={styles.preview} data-active={index === active} src={`/site-preview-${item.id}.jpg`} alt="" fill sizes={item.id === "celular" ? "(max-width: 760px) 45vw, 300px" : "(max-width: 760px) 95vw, 950px"} draggable={false}/>)}</div>
          </div>
          <span className={styles.camera} aria-hidden="true"/>
          <span className={styles.deviceLabel} aria-hidden="true">{device.id === "notebook" ? "MacBook Pro" : ""}</span>
        </div>
        <div className={styles.stand} aria-hidden="true"/>
        <div className={styles.foot} aria-hidden="true"/>
      </Link>
      <span className={styles.ground} aria-hidden="true"/>
    </div>
    <figcaption className={styles.caption}>
      <span>Nosso universo, em qualquer tela.</span>
      <div className={styles.controls} role="group" aria-label="Escolha o aparelho da apresentação">
        {devices.map((item, index) => <button key={item.id} type="button" aria-pressed={index === active} aria-controls={id} onClick={() => choose(index)}>{item.label}</button>)}
        <button className={styles.pause} type="button" disabled={reducedMotion} aria-controls={id} aria-label={paused ? "Reproduzir alternância dos aparelhos" : "Pausar alternância dos aparelhos"} title={reducedMotion ? "Alternância automática desativada pela preferência de movimento reduzido" : undefined} onClick={() => { setPaused(value => !value); setFocused(false); }}>{paused ? <Play size={13} aria-hidden="true"/> : <Pause size={13} aria-hidden="true"/>}</button>
      </div>
    </figcaption>
  </DeviceMotion>;
}
