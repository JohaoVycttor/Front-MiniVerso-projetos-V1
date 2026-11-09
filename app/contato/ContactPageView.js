import {Mail,MapPin,Clock3,ShieldCheck,MessageCircle} from 'lucide-react';
import ContactForm from './ContactForm';
import CorePageHero from '@/app/components/CorePageHero';
import SiteMedia from '@/app/components/SiteMedia';
import {brief} from '@/lib/display-text';
import styles from '@/app/components/visual-content.module.css';
import './contact-core.css';

const icons={mail:Mail,location:MapPin,clock:Clock3,phone:MessageCircle};
export default function ContactPageView({content,initialSubject='',initialProject='',preview=false}) {
 const sections=content.sections.filter(s=>s.enabled&&s.type==='contact');
 const intro=sections[0];
 const formId=intro?'contact-form-'+intro.id:'conteudo';
 return <div className="contact-page core-page contact-core" style={{'--contact-accent':content.accent,'--contact-background':content.background,'--core-image':content.image?'url('+JSON.stringify(content.image)+')':'none'}}>
  {intro&&<CorePageHero title="contato" heading={intro.title} highlight={intro.highlight} description={brief(intro.description)} image={content.image} imagePosition={content.imagePosition||'center 30%'} imageAlt="Pessoa explorando uma experiência imersiva" eyebrow="O próximo passo é uma conversa" actionHref={'#'+formId} actionLabel="Conte sua ideia" scrollHref={'#'+formId} scrollLabel="Canais e formulário"/>}
  <div className="contact-container">{sections.map(s=><section className="contact-composition" id={'contact-form-'+s.id} key={s.id}><header className="contact-form-intro"><span className="contact-kicker">[ {s.label} / Vamos criar juntos ]</span><span>{s.locationNote}</span></header><div className={'contact-columns '+s.layout}><ContactForm config={s.form} subjects={s.subjects} initialSubject={initialSubject} initialProject={initialProject} preview={preview}/><aside className="contact-aside"><SiteMedia className={styles.contactPhoto} src="/home-team-v2.webp" alt="Equipe da Miniverso em visita ao Casarão da Indústria SESI-MA" caption="Quem cria também faz parte da experiência."/><section className="contact-glass"><span className="contact-kicker">[ {s.channelsLabel} ]</span><div className="contact-channels">{s.channels.map((channel,i)=>{const Icon=icons[channel.icon]||Mail;return <div key={i}><Icon size={17}/><div><small>{channel.title}</small>{channel.href?<a href={channel.href}>{channel.value}</a>:<span>{channel.value}</span>}</div></div>})}</div></section><section className="contact-glass"><span className="contact-kicker">[ {s.nextLabel} ]</span><ol>{s.steps.map((step,i)=><li key={i}><span>{String(i+1).padStart(2,'0')}</span><div><h3>{step.title}</h3><p>{brief(step.description)}</p></div></li>)}</ol></section><p className={styles.dataNote}><ShieldCheck size={16}/>{s.dataNote}</p></aside></div></section>)}</div>
 </div>;
}