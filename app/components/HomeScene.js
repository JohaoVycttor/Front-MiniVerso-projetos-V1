"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

export default function HomeScene({image = "/home-vr-background.jpg", alt = "Experiência com óculos de realidade virtual"}) {
 const scene = useRef(null);
 const source = typeof image === "string" && ((image.startsWith("/") && !image.startsWith("//") && !image.includes("\\")) || /^https?:\/\//i.test(image)) ? image : "/home-vr-background.jpg";
 useEffect(() => {
  const element = scene.current;
  const stage = element.parentElement;
  const preference = matchMedia("(prefers-reduced-motion: reduce)");
  let frame, visible = true;
  const update = () => {
   frame = null;
   const bounds = stage.getBoundingClientRect();
   const progress = Math.max(0, Math.min(1, -bounds.top / bounds.height));
   element.style.setProperty("--scene-drift", `${progress * 32}px`);
  };
  const schedule = () => {
   if (preference.matches || !visible || frame != null) return;
   frame = requestAnimationFrame(update);
  };
  const reset = () => {
   cancelAnimationFrame(frame); frame = null;
   element.style.removeProperty("--scene-drift"); schedule();
  };
  const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) schedule(); });
  observer.observe(stage);
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
  preference.addEventListener("change", reset);
  schedule();
  return () => {
   cancelAnimationFrame(frame); observer.disconnect();
   window.removeEventListener("scroll", schedule);
   window.removeEventListener("resize", schedule);
   preference.removeEventListener("change", reset);
  };
 }, []);
 return <div ref={scene} className="vr-scene">
  <Image className="vr-scene-photo" src={source} alt={alt} fill preload sizes="(max-width: 760px) 100vw, 90vw" unoptimized={!source.startsWith("/")}/>
  <div className="vr-scene-grid" aria-hidden="true"/>
  <div className="vr-scene-orbit" aria-hidden="true"><span/><span/><i/></div>
  <span className="vr-scene-coordinate" aria-hidden="true">MV / IMMERSIVE WORLD — 360°</span>
 </div>;
}
