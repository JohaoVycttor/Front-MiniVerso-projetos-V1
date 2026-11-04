import { LuCompass } from "react-icons/lu";
import { ButtonLink } from "@/components/ui/button";
import { ADMIN_HOME } from "@/lib/routes";
import styles from "./status-page.module.css";

export default function NotFound() {
  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <span className={styles.icon} aria-hidden="true">
          <LuCompass />
        </span>
        <h1 className={styles.title}>Página não encontrada</h1>
        <p className={styles.text}>O endereço pode estar errado ou a página foi removida.</p>
        <ButtonLink href={ADMIN_HOME}>Ir para o painel</ButtonLink>
      </div>
    </main>
  );
}
