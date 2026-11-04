import type { ReactNode } from "react";
import { LuCircleAlert, LuCircleCheck, LuInfo, LuTriangleAlert } from "react-icons/lu";
import { cx } from "@/lib/cx";
import styles from "./alert.module.css";

type Tone = "info" | "success" | "warning" | "error";

const ICONS = {
  info: LuInfo,
  success: LuCircleCheck,
  warning: LuTriangleAlert,
  error: LuCircleAlert,
} as const;

type AlertProps = {
  tone?: Tone;
  title?: string;
  children: ReactNode;
  action?: ReactNode;
  className?: string;
};

/** Aviso com ícone e texto: o status nunca depende só da cor (RNF39). */
export function Alert({ tone = "info", title, children, action, className }: AlertProps) {
  const Icon = ICONS[tone];
  return (
    <div className={cx(styles.alert, styles[tone], className)} role={tone === "error" ? "alert" : "status"}>
      <Icon aria-hidden="true" className={styles.icon} />
      <div className={styles.body}>
        {title && <p className={styles.title}>{title}</p>}
        <div>{children}</div>
      </div>
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
}
