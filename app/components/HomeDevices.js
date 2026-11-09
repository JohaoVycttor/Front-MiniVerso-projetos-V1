import Link from "next/link";
import { ArrowUpRight, BatteryFull, Signal, Wifi } from "lucide-react";
import ImmersiveSequence from "./ImmersiveSequence";
import styles from "./home-devices.module.css";

export { default } from "./SiteShowcase";

function PhoneFrame({ href, label, dark = false, children }) {
  return <Link href={href} aria-label={label} className={styles.phone + (dark ? " " + styles.darkPhone : "")}>
    <div className={styles.phoneScreen} aria-hidden="true">
      <div className={styles.statusBar}><span>9:41</span><span className={styles.signal}><Signal/><Wifi/><BatteryFull/></span></div>
      <span className={styles.camera}/>
      {children}
      <span className={styles.homeIndicator}/>
    </div>
  </Link>;
}

export function HomePhones() {
  return <ImmersiveSequence frameClassName={styles.phoneStage}>
    <div className={styles.phoneRow}>
      <PhoneFrame href="/sobre" label="Conheça a história e as pessoas da Miniverso">
        <div className={styles.fieldCopy}><span>MINIVERSO / PESSOAS</span><strong>APRENDER<br/>É VIVER A<br/>EXPERIÊNCIA.</strong><span className={styles.phoneAction}>Nossa história <ArrowUpRight/></span></div>
      </PhoneFrame>
      <PhoneFrame href="/servicos" label="Explore as soluções imersivas da Miniverso" dark>
        <div className={styles.manifesto}><span className={styles.wordmark}>miniverso</span><strong>A curiosidade<br/>é o nosso<br/>ponto de<br/><em>partida.</em></strong><p>Criatividade e tecnologia para aproximar pessoas do conhecimento.</p></div>
      </PhoneFrame>
      <PhoneFrame href="/projetos" label="Descubra as experiências em realidade virtual da Miniverso">
        <div className={styles.exploreCopy}><strong>OUTRAS<br/>FORMAS DE<br/>DESCOBRIR.</strong><span className={styles.phoneAction}>Explore os projetos <ArrowUpRight/></span></div>
      </PhoneFrame>
    </div>
  </ImmersiveSequence>;
}
