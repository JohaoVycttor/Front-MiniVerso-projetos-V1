"use client";

import Image from "next/image";
import {DIGITAL_DEFAULTS} from "@/shared/site-content.mjs";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { Pause, Play, Signal, Wifi, BatteryFull } from "lucide-react";
import DeviceMotion from "./DeviceMotion";
import styles from "./site-showcase.module.css";

const defaultDevices = DIGITAL_DEFAULTS.devices;

export default function SiteShowcase({ bare = false, embedded = false, devices = defaultDevices }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);
  const [hidden, setHidden] = useState(false);
  const [focused, setFocused] = useState(false);
  const canvas = useRef(null);
  const id = useId();
  const index=Math.min(active,devices.length-1);
  const device = devices[index];

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

  return <DeviceMotion as="figure" className={`${styles.showcase}${bare ? ' ' + styles.bare : ''}${embedded ? ' ' + styles.embedded : ''}`} data-device-presentation={bare ? 'bare' : 'framed'} aria-label="O novo site da Miniverso em qualquer tela"
    onFocusCapture={() => setFocused(true)}
    onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}>
    {!embedded && <header className={styles.intro} data-site-reveal>
      <span>MINIVERSO / EM QUALQUER DISPOSITIVO</span>
      <h2>Explore a Miniverso em qualquer tela.</h2>
      <p>Conheça nossos projetos pelo celular, tablet ou notebook.</p>
    </header>}
    <div className={styles.canvas} ref={canvas} id={id} data-device={device.id}>
      <Link href={device.href||'/projetos'} className={styles.hardware} aria-label={`Explore o novo site da Miniverso — visualização em ${device.title.toLowerCase()}`}>
        <div className={styles.bezel}>
          <div className={styles.screen} aria-hidden="true">
            <div className={styles.systemBar}><span>9:41</span><span><Signal/><Wifi/><BatteryFull/></span></div>
            <div className={styles.viewport}>{devices.map((item, imageIndex) => item.image&&<Image key={item.id} className={styles.preview} data-active={imageIndex === index} src={item.image} unoptimized={!item.image.startsWith('/')} alt={item.imageAlt} fill sizes={item.id === "celular" ? "(max-width: 760px) 45vw, 300px" : "(max-width: 760px) 95vw, 950px"} draggable={false}/>)}</div>
          </div>
          <span className={styles.camera} aria-hidden="true"/>
          <span className={styles.sideKeys} aria-hidden="true"/><span className={styles.powerKey} aria-hidden="true"/><span className={styles.homeIndicator} aria-hidden="true"/>
        </div>
        <div className={styles.hinge} aria-hidden="true"/>
        <div className={styles.foot} aria-hidden="true"/>
      </Link>
      {!bare && <span className={styles.ground} aria-hidden="true"/>}
    </div>
    <figcaption className={styles.caption}>
      {device.caption&&<span>{device.caption}</span>}
      <div className={styles.controls} role="group" aria-label="Escolha o aparelho da apresentação">
        {devices.map((item, index) => <button key={item.id} type="button" aria-pressed={index === active} aria-controls={id} onClick={() => choose(index)}>{item.title}</button>)}
        <button className={styles.pause} type="button" disabled={reducedMotion} aria-controls={id} aria-label={paused ? "Reproduzir alternância dos aparelhos" : "Pausar alternância dos aparelhos"} title={reducedMotion ? "Alternância automática desativada pela preferência de movimento reduzido" : undefined} onClick={() => { setPaused(value => !value); setFocused(false); }}>{paused ? <Play size={13} aria-hidden="true"/> : <Pause size={13} aria-hidden="true"/>}</button>
      </div>
    </figcaption>
  </DeviceMotion>;
}
