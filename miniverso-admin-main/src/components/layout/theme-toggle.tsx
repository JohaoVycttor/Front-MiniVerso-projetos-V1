"use client";

import { LuMoon, LuSun } from "react-icons/lu";
import { nextTheme, parseTheme, resolveTheme, themeCookie } from "@/lib/theme";
import styles from "./theme-toggle.module.css";

/**
 * Botão do cabeçalho que alterna entre modo claro e escuro.
 * O CSS mostra o texto e o ícone certos, porque já sabe o tema (escolha salva ou sistema).
 * Assim o servidor e o navegador desenham o mesmo botão, e o nome lido pelo leitor de tela
 * é sempre o texto visível: "Modo escuro" no tema claro e "Modo claro" no escuro.
 * Ícone e texto juntos: o estado não depende só da cor (RNF39).
 */
export function ThemeToggle() {
  function handleClick() {
    const root = document.documentElement;
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const next = nextTheme(resolveTheme(parseTheme(root.dataset.theme), systemPrefersDark));
    root.dataset.theme = next;
    document.cookie = themeCookie(next, window.location.protocol === "https:");
  }

  return (
    <button type="button" className={styles.toggle} onClick={handleClick}>
      <span className={styles.toDark} title="Modo escuro">
        <LuMoon aria-hidden="true" />
        <span className={styles.label}>Modo escuro</span>
      </span>
      <span className={styles.toLight} title="Modo claro">
        <LuSun aria-hidden="true" />
        <span className={styles.label}>Modo claro</span>
      </span>
    </button>
  );
}
