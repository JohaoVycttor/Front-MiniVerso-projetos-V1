import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "@/lib/cx";
import styles from "./card.module.css";

type CardProps = HTMLAttributes<HTMLElement> & {
  as?: "section" | "div" | "article" | "aside";
  padded?: boolean;
};

export function Card({ as: Tag = "section", padded = false, className, children, ...rest }: CardProps) {
  return (
    <Tag className={cx(styles.card, padded && styles.padded, className)} {...rest}>
      {children}
    </Tag>
  );
}

type CardHeaderProps = {
  title: string;
  titleId?: string;
  description?: string;
  action?: ReactNode;
};

export function CardHeader({ title, titleId, description, action }: CardHeaderProps) {
  return (
    <div className={styles.header}>
      <div className={styles.headerText}>
        <h2 id={titleId} className={styles.title}>
          {title}
        </h2>
        {description && <p className={styles.description}>{description}</p>}
      </div>
      {action}
    </div>
  );
}
