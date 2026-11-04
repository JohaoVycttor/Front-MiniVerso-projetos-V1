"use client";

import { useEffect, useEffectEvent } from "react";

const ACTIVITY_EVENTS = ["pointerdown", "keydown", "scroll", "touchstart", "mousemove"] as const;
const STORAGE_KEY = "miniverso-admin:ultima-atividade";
const STORAGE_THROTTLE_MS = 15_000;

function readSharedActivity(): number {
  try {
    return Number(window.localStorage.getItem(STORAGE_KEY)) || 0;
  } catch {
    return 0;
  }
}

function writeSharedActivity(timestamp: number) {
  try {
    window.localStorage.setItem(STORAGE_KEY, String(timestamp));
  } catch {
    // Navegação privada pode bloquear o localStorage: o contador local continua valendo.
  }
}

/**
 * Encerra a sessão depois de um período sem uso (RNF14).
 * A última atividade é compartilhada entre abas, para uma aba parada não
 * derrubar a sessão de quem está usando outra.
 */
export function useIdleLogout(minutes: number, onIdle: () => void) {
  const handleIdle = useEffectEvent(onIdle);

  useEffect(() => {
    if (!(minutes > 0)) return;
    const limit = minutes * 60_000;
    let lastActivity = Date.now();
    let lastShared = 0;
    let timer: number | undefined;
    let finished = false;

    const check = () => {
      window.clearTimeout(timer);
      if (finished) return;
      const idleFor = Date.now() - Math.max(lastActivity, readSharedActivity());
      if (idleFor >= limit) {
        finished = true;
        handleIdle();
        return;
      }
      timer = window.setTimeout(check, limit - idleFor);
    };

    const registerActivity = () => {
      lastActivity = Date.now();
      if (lastActivity - lastShared > STORAGE_THROTTLE_MS) {
        lastShared = lastActivity;
        writeSharedActivity(lastActivity);
      }
    };

    // Timers atrasam em abas em segundo plano: confere de novo ao voltar para a aba.
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") check();
    };

    ACTIVITY_EVENTS.forEach((name) => window.addEventListener(name, registerActivity, { passive: true }));
    document.addEventListener("visibilitychange", onVisibilityChange);
    writeSharedActivity(lastActivity);
    timer = window.setTimeout(check, limit);

    return () => {
      window.clearTimeout(timer);
      ACTIVITY_EVENTS.forEach((name) => window.removeEventListener(name, registerActivity));
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [minutes]);
}
