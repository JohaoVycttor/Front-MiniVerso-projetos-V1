import type { CSSProperties } from "react";
import { cx } from "@/lib/cx";
import styles from "./skeleton.module.css";

type SkeletonProps = {
  width?: CSSProperties["width"];
  height?: CSSProperties["height"];
  radius?: CSSProperties["borderRadius"];
  className?: string;
};

/** Bloco de carregamento. Fica oculto para leitores de tela; quem o usa anuncia "Carregando". */
export function Skeleton({ width = "100%", height = 16, radius, className }: SkeletonProps) {
  return <span aria-hidden="true" className={cx(styles.skeleton, className)} style={{ width, height, borderRadius: radius }} />;
}
