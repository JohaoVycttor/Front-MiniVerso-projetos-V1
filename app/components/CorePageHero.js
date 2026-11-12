import Link from 'next/link';
import {ArrowDown,ArrowUpRight} from 'lucide-react';
import HomeScene from './HomeScene';
import HomeMarquee from './HomeMarquee';
import './core-page.css';

export default function CorePageHero({title,heading,highlight,description,image,imagePosition='center',imageAlt='',eyebrow='Miniverso / Experiências imersivas',actionHref='/contato',actionLabel='Vamos conversar',scrollHref='#conteudo',scrollLabel='Explore as possibilidades',specialties=[]}){
 return <section className="core-opening" style={{'--core-hero-position':imagePosition}}>
  <div className="core-container">
   <div className="core-masthead"><span aria-hidden="true">+</span><h1>{title}</h1><span aria-hidden="true">+</span></div>
   <div className="core-hero-stage">
    <HomeScene image={image} alt={imageAlt}/>
    <div className="core-hero-meta"><span><small>MINIVERSO</small>Tecnologia com propósito</span><span><small>ORIGEM</small>São Luís, Brasil</span><span><small>EXPERIÊNCIAS</small>VR / AR / MR / 360°</span></div>
    <div className="core-hero-copy"><span className="core-label">[ {eyebrow} ]</span><h2>{heading} <em>{highlight}</em></h2><div className="core-hero-actions"><Link className="button primary" href={actionHref}>{actionLabel}<ArrowUpRight size={16}/></Link><a className="core-text-link" href={scrollHref}>{scrollLabel}<ArrowDown size={15}/></a></div></div>
    <p className="core-hero-note">{description}</p><a className="core-scroll" href={scrollHref}><ArrowDown size={16}/><span>Continue explorando</span></a>
    <div className="core-pixel-edge" aria-hidden="true">{Array.from({length:48},(_,i)=><span key={i} style={{height:`${[14,32,8,24,40,12,28,5,20][i%9]}px`}}/>)}</div>
   </div>
   {specialties.length>0&&<HomeMarquee text={specialties.join('\n')}/>}
  </div>
 </section>;
}
