import Image from 'next/image';
import Link from 'next/link';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import styles from './experience-hero.module.css';

export default function ExperienceHero({
  title = 'miniverso', heading, highlight, description,
  image = '/images/vr-headset-editorial.webp',
  imagePosition,
  imageAlt = 'Headset de realidade virtual branco com sensores ópticos e alça de tecido',
  eyebrow = 'Estúdio de experiências imersivas', actionHref = '/projetos',
  actionLabel = 'Explore as experiências', scrollHref = '/sobre',
  scrollLabel = 'Conheça nosso universo', home = false,
}) {
  return <section className={`${styles.hero} ${home ? styles.home : ''}`} aria-label={home ? 'Miniverso — experiências imersivas' : title}>
    <div className={styles.art}>
      <Image src={image} alt={imageAlt} fill preload sizes="100vw" unoptimized={!image.startsWith('/')} className={styles.image} style={imagePosition ? {objectPosition:imagePosition} : undefined}/>
    </div>
    <div className={styles.topline}><span><i/> {eyebrow}</span><span>São Luís, Brasil · Ideias sem fronteiras</span></div>
    <div className={styles.copy}>
      <span className={styles.index}>{home ? 'REALIDADES QUE CONECTAM' : `MINIVERSO / ${title.toLocaleUpperCase('pt-BR')}`}</span>
      <h1>{heading}<br/><em>{highlight}</em><span className={styles.registered}>®</span></h1>
      <p>{description}</p>
      <Link href={actionHref} className={styles.action}>{actionLabel}<span><ArrowUpRight size={19}/></span></Link>
    </div>
    <div className={styles.bottom}>
      <a href={scrollHref} className={styles.scroll}><span><ArrowDown size={17}/></span>{scrollLabel}</a>
      <div className={styles.disciplines}><span>Realidade virtual</span><span>Realidade aumentada</span><span>Experiências 360°</span></div>
      <span className={styles.edition}>MV® / {home ? 'EST. BRASIL' : title.toLocaleUpperCase('pt-BR')}</span>
    </div>
    {home && <div className={styles.wordmark} aria-hidden="true">miniverso<span>®</span></div>}
  </section>;
}
