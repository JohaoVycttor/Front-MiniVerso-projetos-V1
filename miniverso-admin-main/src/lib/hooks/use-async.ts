"use client";

import { useCallback, useEffect, useEffectEvent, useState } from "react";

export type AsyncStatus = "loading" | "success" | "error";

export type AsyncState<T> = {
  status: AsyncStatus;
  /** Último dado carregado com sucesso. Continua disponível enquanto uma nova busca acontece. */
  data: T | undefined;
  error: unknown;
  /** true quando há dado antigo na tela e uma nova busca em andamento. */
  isRefreshing: boolean;
  reload: () => void;
};

type Settled<T> = { key: string; data: T | undefined; error: unknown; ok: boolean };

/**
 * Carrega dados assíncronos e expõe os estados de carregamento, sucesso e erro (RNF29).
 * A busca roda de novo sempre que `key` muda (ex.: filtros) ou quando `reload()` é chamado.
 * Buscas antigas são canceladas para não sobrescrever a mais recente.
 */
export function useAsync<T>(load: (signal: AbortSignal) => Promise<T>, key: string): AsyncState<T> {
  const [version, setVersion] = useState(0);
  const [settled, setSettled] = useState<Settled<T> | null>(null);
  const requestKey = `${key}#${version}`;
  const runLoad = useEffectEvent((signal: AbortSignal) => load(signal));

  useEffect(() => {
    const controller = new AbortController();
    runLoad(controller.signal).then(
      (data) => {
        if (!controller.signal.aborted) setSettled({ key: requestKey, data, error: undefined, ok: true });
      },
      (error: unknown) => {
        if (!controller.signal.aborted) {
          setSettled((previous) => ({ key: requestKey, data: previous?.data, error, ok: false }));
        }
      },
    );
    return () => controller.abort();
  }, [requestKey]);

  const reload = useCallback(() => setVersion((current) => current + 1), []);

  // Resultado da busca atual. Se ainda não chegou, a tela está carregando.
  const current = settled !== null && settled.key === requestKey ? settled : null;
  const status: AsyncStatus = current === null ? "loading" : current.ok ? "success" : "error";

  return {
    status,
    data: settled?.data,
    error: current?.error,
    isRefreshing: status === "loading" && settled?.data !== undefined,
    reload,
  };
}
