import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, BatteryFull, Signal, Wifi } from "lucide-react";
import ImmersiveSequence from "./ImmersiveSequence";
import DeviceMotion from "./DeviceMotion";
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

export function HomePhones({ devicesOnly = false }) {
  const phones =
    <div className={styles.phoneRow}>
      <PhoneFrame href="/sobre" label="Conheça a história e as pessoas da Miniverso">
        <div className={styles.fieldPhoto}><Image src="/home-team-v2.webp" alt="" fill sizes="(max-width: 760px) 28vw, 270px"/></div>
        <div className={styles.fieldCopy}><span>MINIVERSO / PESSOAS</span><strong>APRENDER<br/>É VIVER A<br/>EXPERIÊNCIA.</strong><span className={styles.phoneAction}>Nossa história <ArrowUpRight/></span></div>
      </PhoneFrame>
      <PhoneFrame href="/servicos" label="Explore as soluções imersivas da Miniverso" dark>
        <div className={styles.manifesto}><span className={styles.wordmark}>miniverso</span><strong>A curiosidade<br/>é o nosso<br/>ponto de<br/><em>partida.</em></strong><p>Criatividade e tecnologia para aproximar pessoas do conhecimento.</p></div>
      </PhoneFrame>
      <PhoneFrame href="/projetos" label="Descubra as experiências em realidade virtual da Miniverso">
        <div className={styles.exploreCopy}><strong>OUTRAS<br/>FORMAS DE<br/>DESCOBRIR.</strong><span className={styles.phoneAction}>Explore os projetos <ArrowUpRight/></span></div>
        <div className={styles.explorePhoto}><Image src="/home-vr-people-v2.webp" alt="" fill sizes="(max-width: 760px) 28vw, 270px"/></div>
      </PhoneFrame>
    </div>;
  if (devicesOnly) return <DeviceMotion as="figure" className={`${styles.phoneStage} ${styles.bare}`} data-devices-only="phones" aria-label="Explore a Miniverso em três smartphones"><div data-immersive-view="phones">{phones}</div></DeviceMotion>;
  return <ImmersiveSequence frameClassName={styles.phoneStage}>{phones}</ImmersiveSequence>;
}
