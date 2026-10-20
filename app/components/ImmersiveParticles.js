"use client";

import { useEffect, useRef } from "react";
import { createHeadsetCloud } from "@/lib/immersive-cloud.mjs";

import { characterRig, characterMotion, poseCharacter } from "@/lib/character-motion.mjs";

const SIZE = 520;
const smooth = (a, b, t) => {
  const v = Math.max(0, Math.min(1, (t - a) / (b - a)));
  return v * v * v * (v * (v * 6 - 15) + 10);
};

function characterTargets(image, count) {
  const buffer = document.createElement("canvas");
  buffer.width = buffer.height = SIZE;
  const ctx = buffer.getContext("2d", { willReadFrequently: true });
  if (!ctx) return [];
  ctx.drawImage(image, 16, 8, 488, 488);
  const pixels = ctx.getImageData(0, 0, SIZE, SIZE).data;
  const points = [];
  for (let gy = 12; gy < 498; gy += 2.8) for (let gx = 16; gx < 504; gx += 2.8) {
    const seed = Math.sin(gx * 12.9898 + gy * 78.233) * 43758.5453;
    const jitter = seed - Math.floor(seed);
    const x = Math.floor(gx + jitter * 1.5), y = Math.floor(gy + (1 - jitter) * 1.5);
    const i = (y * SIZE + x) * 4;
    const light = Math.max(pixels[i], pixels[i + 1] * .95, pixels[i + 2] * .6) / 255;
    if (light > .24) points.push({ x: x + jitter * .3, y, light: Math.min(1, light + .1) });
  }
  if (!points.length) return [];
  return Array.from({ length: count }, (_, i) => characterRig(points[Math.floor(i * points.length / count)]));
}

export default function ImmersiveParticles({animate=true}) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const count = 6800;
    const headset = createHeadsetCloud(count);
    const character = new Image();
    let targets = [], frame = 0, visible = false, elapsed = 0, previous = null, disposed = false;
    let pointerX = 0, pointerY = 0, easedX = 0, easedY = 0;
    function draw(time) {
      if (disposed) return;
      const delta = previous === null ? 0 : Math.min(time - previous, 50);
      elapsed += delta;
      previous = time;
      const follow = 1 - Math.exp(-delta / 150);
      easedX += (pointerX - easedX) * follow;
      easedY += (pointerY - easedY) * follow;
      const phase = (elapsed / 1000) % 22;
      const morph = !targets.length ? 0 : (motion.matches || !animate) ? 1 : smooth(4, 7.5, phase) * (1 - smooth(17, 21, phase));
      const drift = (motion.matches || !animate) ? 0 : Math.sin(elapsed * .00065) * 1.5;
      const shiftX = easedX * 5, shiftY = drift + easedY * 3;
      const yaw = .58 + ((motion.matches || !animate) ? 0 : Math.sin(elapsed * .00045) * .16 + easedX * .2);
      const pitch = .32 + easedY * .1;
      const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
      const travel = Math.sin(morph * Math.PI);
      const pose = characterMotion(elapsed, (motion.matches || !animate));
      ctx.clearRect(0, 0, SIZE, SIZE);
      // The character stays a sparse cloud of distinct particles throughout the cycle.
      for (let i = 0; i < count; i++) {
        const source = headset[i];
        const rx = source.x * cy + source.z * sy;
        const depth = -source.x * sy + source.z * cy;
        const ry = source.y * cp - depth * sp;
        const rz = source.y * sp + depth * cp;
        const perspective = 760 / (760 - rz);
        const ax = 260 + rx * perspective * 1.18;
        const ay = 284 + ry * perspective * 1.18;
        const target = targets[i];
        const animated = target ? poseCharacter(target, pose) : null;
        const x = ax + ((animated?.x ?? ax) + shiftX - ax) * morph + Math.sin(i * 2.39996) * travel * 12;
        const y = ay + ((animated?.y ?? ay) - ay) * morph + shiftY + Math.cos(i * 1.618) * travel * 8;
        const light = source.light + ((target?.light ?? source.light) - source.light) * morph;
        ctx.globalAlpha = source.alpha * (.8 + Math.max(-100, Math.min(100, rz)) / 500) * (1 - morph) + (.8 + light * .2) * morph;
        ctx.fillStyle = light > .9 ? "#c0dcff" : "#8dbcff";
        const dot = 1.1 + light * .4;
        ctx.fillRect(x, y, dot, dot);
      }
      ctx.globalAlpha = 1;
      ctx.textAlign = "center";
      ctx.font = "10px Consolas, monospace";
      ctx.fillStyle = "#a5b6d2";
      ctx.fillText(morph > .5 ? "VIVA UMA NOVA REALIDADE" : "A EXPERIÊNCIA COMEÇA AQUI", 260, 514);
      if (visible && !(motion.matches || !animate) && !document.hidden) frame = requestAnimationFrame(draw);
    }
    function refresh() {
      cancelAnimationFrame(frame); previous = null;
      if (visible && !document.hidden) draw(performance.now());
    }
    function resize() {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const size = Math.max(1, canvas.getBoundingClientRect().width);
      canvas.width = canvas.height = Math.round(size * ratio);
      ctx.setTransform(canvas.width / SIZE, 0, 0, canvas.height / SIZE, 0, 0);
      refresh();
    }
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; refresh(); });
    const resizeObserver = new ResizeObserver(resize);
    observer.observe(canvas); resizeObserver.observe(canvas);
    motion.addEventListener("change", refresh);
    document.addEventListener("visibilitychange", refresh);
    const move = (event) => {
      if ((motion.matches || !animate) || event.pointerType === "touch") return;
      const rect = canvas.getBoundingClientRect();
      pointerX = (event.clientX - rect.left) / rect.width - .5;
      pointerY = (event.clientY - rect.top) / rect.height - .5;
    };
    const leave = () => { pointerX = 0; pointerY = 0; };
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerleave", leave);
    character.onload = () => {
      if (disposed) return;
      targets = characterTargets(character, count);
      elapsed = 0;
      refresh();
    };
    character.src = "/vr-character-particles.png";
    resize();
    return () => {
      disposed = true; character.onload = null;
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerleave", leave);
      cancelAnimationFrame(frame); observer.disconnect(); resizeObserver.disconnect();
      motion.removeEventListener("change", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [animate]);
  return <div className="immersive-particle-stage">
    <canvas ref={canvasRef} className="immersive-particles" width="520" height="520" role="img" aria-label="Óculos de realidade virtual se transformam no personagem da referência, com as mãos levantadas, em pontilhismo azul luminoso." />
  </div>;
}
