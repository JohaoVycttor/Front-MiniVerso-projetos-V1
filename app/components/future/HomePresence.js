
import Link from 'next/link';
import SiteShowcase from '../SiteShowcase';
import SocialPhone from '../SocialPhone';
import styles from './home-presence.module.css';
export default function HomePresence({section,settings,digital}){
 return <section id={section.id} className={'future-section future-shell '+styles.section} aria-labelledby={section.id+'-title'}>
  <div className="future-section-heading" data-reveal><span className="future-eyebrow">{section.eyebrow}</span><div><h2 id={section.id+'-title'}>{section.title}</h2>{section.description&&<p>{section.description}</p>}</div></div>
  <div className={styles.grid}><div className={styles.panel}><header className={styles.heading} data-reveal><span>{digital.siteEyebrow}</span><h3>{digital.siteTitle}</h3><p>{digital.siteDescription}</p></header><SiteShowcase bare embedded devices={digital.devices}/></div><div className={styles.panel}><header className={styles.heading} data-reveal><span>{digital.socialEyebrow}</span><h3>{digital.socialTitle}</h3><p>{digital.socialDescription}</p></header><SocialPhone embedded settings={settings} config={digital.social} mobile={digital.devices.find(device=>device.id==='celular')}/></div></div>
  {section.buttonLabel&&<Link className="future-text-link" href={section.buttonHref||'/contato'}>{section.buttonLabel} ↗</Link>}
 </section>;
}
