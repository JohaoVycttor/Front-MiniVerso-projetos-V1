import {Mail,MapPin,Clock3,ShieldCheck,MessageCircle} from 'lucide-react';
import ContactForm from './ContactForm';
import CorePageHero from '@/app/components/CorePageHero';
import {brief} from '@/lib/display-text';
import './contact-core.css';

const icons={mail:Mail,location:MapPin,clock:Clock3,phone:MessageCircle};
export default function ContactPageView({content,initialSubject='',initialProject='',preview=false}) {
 const sections=content.sections.filter(s=>s.enabled&&s.type==='contact');
 const intro=sections[0];
 const formId=intro?'contact-form-'+intro.id:'conteudo';
 return <div className="contact-page core-page contact-core" style={{'--contact-accent':content.accent,'--contact-background':content.background,'--core-image':content.image?'url('+JSON.stringify(content.image)+')':'none'}}>
  {intro&&<CorePageHero title="contato" heading={intro.title} highlight={intro.highlight} description={brief(intro.description)} image={content.image} imagePosition={content.imagePosition||'center 30%'} imageAlt="Pessoa explorando uma experiência imersiva" eyebrow="O próximo passo é uma conversa" actionHref={'#'+formId} actionLabel="Conte sua ideia" scrollHref={'#'+formId} scrollLabel="Canais e formulário" specialties={['Realidade virtual','Realidade aumentada','Realidade mista','Vídeos 360°','Educação imersiva']}/>}
  <div className="contact-container contact-editorial">{sections.map(s=><section className="contact-composition" id={'contact-form-'+s.id} key={s.id}>
   <header className="contact-editorial-intro"><span>{s.label} / Vamos criar juntos</span><span>{s.locationNote}</span></header>
   <div className="contact-editorial-grid"><aside className="contact-editorial-aside"><section><h2>{s.channelsLabel}</h2><div className="contact-editorial-channels">{s.channels.map((channel,index)=>{const Icon=icons[channel.icon]||Mail;return <div className="contact-editorial-channel" key={index}><Icon size={16}/><div><small>{channel.title}</small>{channel.href?<a href={channel.href}>{channel.value}</a>:<span>{channel.value}</span>}</div></div>})}</div></section>
    <section><h2>{s.nextLabel}</h2><ol className="contact-editorial-steps">{s.steps.map((step,index)=><li key={step.title}><span>{String(index+1).padStart(2,'0')}</span><div><h3>{step.title}</h3><p>{step.description}</p></div></li>)}</ol></section><p className="contact-editorial-note"><ShieldCheck size={16}/>{s.dataNote}</p>
   </aside><div className="contact-editorial-form"><ContactForm config={s.form} subjects={s.subjects} initialSubject={initialSubject} initialProject={initialProject} preview={preview}/></div></div>
  </section>)}</div>
 </div>;
}
