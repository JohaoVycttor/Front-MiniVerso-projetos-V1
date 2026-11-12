"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { ArrowUpRight, Pause, Play } from "lucide-react";
import DeviceMotion from "./DeviceMotion";
import styles from "./immersive-sequence.module.css";

const scenes = [
  { id: "phones", label: "Celulares", title: "Novas formas de descobrir.", text: "Pessoas e conhecimento, cada vez mais próximos.", duration: 6500 },
  { id: "headset", label: "Óculos VR", title: "Uma nova perspectiva.", text: "Outras realidades começam com a curiosidade.", duration: 8500 },
  { id: "integration", label: "Integração", title: "Do notebook à imersão.", text: "Experiências em VR pensadas para cada projeto e dispositivo.", duration: 6500 },
];

export default function ImmersiveSequence({ children, frameClassName }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [reduced, setReduced] = useState(true);
  const [hidden, setHidden] = useState(false);
  const [focused, setFocused] = useState(false);
  const canvas = useRef(null);
  const id = useId();
  const noteId = useId();
  const scene = scenes[active];

  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReduced(preference.matches);
    const updateVisibility = () => setHidden(document.hidden);
    updatePreference();
    updateVisibility();
    let observer;
    if (window.IntersectionObserver) {
      observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting && entry.intersectionRatio >= .18), { threshold: [0, .18] });
      observer.observe(canvas.current);
    } else setVisible(true);
    preference.addEventListener("change", updatePreference);
    document.addEventListener("visibilitychange", updateVisibility);
    return () => {
      observer?.disconnect();
      preference.removeEventListener("change", updatePreference);
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, []);

  useEffect(() => {
    if (!visible || reduced || hidden || paused || focused) return;
    const timer = setTimeout(() => setActive(index => (index + 1) % scenes.length), scene.duration);
    return () => clearTimeout(timer);
  }, [active, visible, reduced, hidden, paused, focused, scene.duration]);

  return <DeviceMotion as="figure" className={`${frameClassName} ${styles.sequence}`} aria-label="Dos celulares à realidade virtual"
    onFocusCapture={() => setFocused(true)}
    onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}>
    <div className={styles.visuals} ref={canvas} id={id} data-immersive-view={scene.id}>
      <div className={styles.phones} data-active={active === 0} aria-hidden={active !== 0} inert={active !== 0 ? true : undefined}>{children}</div>
      <div className={styles.vrScene} data-active={active > 0} aria-hidden={active === 0} inert={active === 0 ? true : undefined}>
        <div className={styles.headset} role="img" aria-label="Óculos de realidade virtual em vista lateral" aria-describedby={active === 1 ? noteId : undefined}>
          <Image src="/vr-headset-side-v2.png" alt="" fill sizes="(max-width: 600px) 50vw, 550px"/>
        </div>
        <svg className={styles.annotation} data-vr-annotation viewBox="0 0 1000 600" preserveAspectRatio="none" aria-hidden="true">
          <g className={styles.annotationWide}><path className={styles.annotationLine} pathLength="1" d="M 440 250 L 440 375 L 35 375 L 35 398"/><circle cx="440" cy="250" r="4"/></g>
          <g className={styles.annotationNarrow}><path className={styles.annotationLine} pathLength="1" d="M 430 190 L 430 325 L 40 325 L 40 370"/><circle cx="430" cy="190" r="4"/></g>
        </svg>
        <div className={styles.headsetNote} id={noteId} aria-hidden={active !== 1}>
          <h3>Óculos de realidade virtual</h3>
          <p>Exibem ambientes digitais e acompanham os movimentos da cabeça. Assim, é possível aprender, explorar e treinar de forma imersiva.</p>
        </div>
        <svg className={styles.connection} data-vr-connection viewBox="0 0 1000 600" preserveAspectRatio="none" aria-hidden="true">
          <g className={styles.connectionWide}><path className={styles.connectionTrack} d="M 390 276 L 510 276"/><path className={styles.connectionFlow} d="M 390 276 L 510 276"/><circle cx="390" cy="276" r="3"/><circle cx="510" cy="276" r="3"/></g>
          <g className={styles.connectionNarrow}><path className={styles.connectionTrack} d="M 430 250 C 430 275 500 275 500 300"/><path className={styles.connectionFlow} d="M 430 250 C 430 275 500 275 500 300"/><circle cx="430" cy="250" r="3"/><circle cx="500" cy="300" r="3"/></g>
        </svg>
        <Link href="/servicos" className={styles.notebook} tabIndex={active === 2 ? 0 : -1} aria-hidden={active !== 2} aria-label="Explore as experiências de realidade virtual da Miniverso">
          <div className={styles.notebookBezel}>
            <div className={styles.notebookScreen} aria-hidden="true">
              <span className={styles.screenBrand}>miniverso <span>EXPERIÊNCIAS / VR</span></span>
              <div className={styles.screenCopy}><span>EDUCAÇÃO IMERSIVA</span><strong>Conhecimento<br/>em outra dimensão.</strong><ArrowUpRight/></div>
            </div>
            <span className={styles.notebookCamera} aria-hidden="true"/>
          </div>
          <div className={styles.notebookBase} aria-hidden="true"/>
        </Link>
      </div>
    </div>
    <figcaption className={styles.footer}>
      <div className={styles.copy}><strong>{scene.title}</strong><span>{scene.text}</span></div>
      <div className={styles.controls} role="group" aria-label="Escolha uma etapa da experiência">
        {scenes.map((item, index) => <button key={item.id} type="button" aria-controls={id} aria-pressed={active === index} onClick={() => { setActive(index); setPaused(true); }}>{item.label}</button>)}
        <button className={styles.pause} type="button" disabled={reduced} aria-controls={id} aria-label={paused ? "Reproduzir sequência de realidade virtual" : "Pausar sequência de realidade virtual"} title={reduced ? "Alternância automática desativada pela preferência de movimento reduzido" : undefined} onClick={() => { setPaused(value => !value); setFocused(false); }}>{paused ? <Play size={13} aria-hidden="true"/> : <Pause size={13} aria-hidden="true"/>}</button>
      </div>
    </figcaption>
  </DeviceMotion>;
}
