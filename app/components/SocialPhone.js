"use client";
import Image from 'next/image';
import {DIGITAL_DEFAULTS} from '@/shared/site-content.mjs';
import {useEffect,useRef,useState} from 'react';
import {ArrowUpRight,Instagram,MessageCircle,Globe,Pause,Play,CheckCheck,ChevronLeft,Phone,MoreVertical,Grid3X3,Clapperboard,Contact,Orbit,Rocket,Sparkles,HeartHandshake,Video,Plus,Camera,Mic,Sticker,LockKeyhole,Signal,Wifi,BatteryFull} from 'lucide-react';
import DeviceMotion from './DeviceMotion';
import styles from './social-phone.module.css';


export default function SocialPhone({embedded=false,settings,config=DIGITAL_DEFAULTS.social,mobile=DIGITAL_DEFAULTS.devices[1]}){
 const channels=[{name:config.whatsappLabel,icon:MessageCircle},{name:config.instagramLabel,icon:Instagram},{name:config.siteLabel,icon:Globe}];
 const root=useRef(null);
 const messages=useRef(null);
 const [tick,setTick]=useState(0),[paused,setPaused]=useState(false),[running,setRunning]=useState(false),[focused,setFocused]=useState(false);
 const messageSteps=config.messages.length;const scene=tick<messageSteps?0:tick<messageSteps+3?1:2;
 useEffect(()=>{if(messages.current)messages.current.scrollTop=messages.current.scrollHeight},[tick]);
 useEffect(()=>{
  const media=matchMedia('(prefers-reduced-motion: reduce)');
  let visible=false;
  const update=()=>setRunning(visible&&!media.matches&&!document.hidden);
  const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;update()},{threshold:.2});
  observer.observe(root.current);media.addEventListener('change',update);document.addEventListener('visibilitychange',update);
  return()=>{observer.disconnect();media.removeEventListener('change',update);document.removeEventListener('visibilitychange',update)};
 },[]);
 useEffect(()=>{if(!running||paused||focused)return;const timer=setInterval(()=>setTick(t=>(t+1)%(messageSteps+7)),2200);return()=>clearInterval(timer)},[running,paused,focused,messageSteps]);
 return <DeviceMotion as="section" className={`${styles.promo}${embedded?' '+styles.embedded:''}`} aria-label="Miniverso nas suas telas">
  <div className={styles.layout} ref={root} onFocusCapture={()=>setFocused(true)} onBlurCapture={e=>{if(!e.currentTarget.contains(e.relatedTarget))setFocused(false)}}>
   <div className={styles.stage}>
    <div className={styles.phone} aria-label={`Prévia de ${channels[scene].name}`}>
     <div className={styles.screen} data-channel={scene===0?'whatsapp':scene===1?'instagram':'site'}>
      <div className={styles.status}><span>9:41</span><span className={styles.statusIcons}><Signal size={11}/><Wifi size={11}/><BatteryFull size={15}/></span></div><span className={styles.island}/>
      {scene===0?<div className={styles.chat} key="chat">
       <div className={styles.chatHeader}><ChevronLeft size={23}/><span className={styles.avatar}><Image src={settings?.logo||'/logo-symbol.png'} unoptimized width={24} height={16} alt=""/></span><div><strong>{settings?.brand||'Miniverso'}</strong><small>{tick<4?'digitando…':'online'}</small></div><Video size={20}/><Phone size={18}/></div>
       <div className={styles.chatBody} ref={messages}>
       <span className={styles.today}>Hoje</span>
       <p className={styles.encryption}><LockKeyhole size={9}/> As mensagens e ligações são protegidas com a criptografia de ponta a ponta. Somente as pessoas que fazem parte da conversa podem ler, ouvir e compartilhar esse conteúdo.</p>
       <div className={styles.messages}>{config.messages.slice(0,tick+1).map((message,index)=><p key={message.id} className={message.direction==='sent'?styles.sent:styles.received}>{message.text}<small>9:{String(41+index).padStart(2,'0')}{message.direction==='sent'&&<CheckCheck size={12}/>}</small></p>)}{tick<messageSteps-1&&<span className={styles.typing} aria-label="Digitando"><i/><i/><i/></span>}</div></div><div className={styles.composer}><Plus size={22}/><span className={styles.inputField}><span/><Sticker size={17}/></span><Camera size={21}/><Mic size={20}/></div>
      </div>:scene===1?<div className={styles.instagram} key="instagram">
       <header><span className={styles.instagramBrand}>Instagram</span><span className={styles.igAccountActions}><span className={styles.loginBadge}>Entrar</span><span>Cadastre-se</span></span></header>
       <div className={styles.igIdentity}><span className={styles.igAvatar}><Image src={settings?.logo||'/logo-symbol.png'} unoptimized width={36} height={24} alt=""/><span>{settings?.brand||'Miniverso'}</span></span><strong>{settings?.instagram||'meuminiverso'}</strong></div>
       <div className={styles.igBio}><strong>{settings?.brand||'Miniverso'}</strong><p>{config.bio}<br/><span>{config.profileLink}</span></p></div>
       <div className={styles.highlights}>{config.highlights.map((label,index)=><div key={index}><span><Sparkles size={19}/></span><small>{label}</small></div>)}</div>
       <div className={styles.igCounts}><span><strong>{config.followers}</strong> seguidores</span><span><strong>{config.following}</strong> seguindo</span></div>
       <div className={styles.igTabs} aria-hidden="true"><Grid3X3 size={17}/><Clapperboard size={17}/><Contact size={17}/></div>
       <div className={styles.igGrid}>{config.posts.filter(post=>post.src).map((post,i)=><div key={i}><Image src={post.src} alt={post.alt} title={post.caption} unoptimized={!post.src.startsWith('/')} fill sizes="85px"/></div>)}</div>
      </div>:<div className={styles.site} key="site">{mobile.image&&<Image src={mobile.image} alt={mobile.imageAlt} unoptimized={!mobile.image.startsWith('/')} width={390} height={844} sizes="270px"/>}<span>{mobile.caption||config.siteLabel}</span></div>}
      <span className={styles.homeBar}/>
     </div>
    </div>

   </div>
   <div className={styles.copy} data-site-reveal><span className={styles.eyebrow}>MINIVERSO / SEMPRE POR PERTO</span><h2>Nosso universo.<br/><em>Na sua mão.</em></h2><p>Acompanhe projetos e bastidores no Instagram. Converse com a gente pelo WhatsApp. Ou descubra novas possibilidades aqui no site.</p>
    <div className={styles.channels} role="group" aria-label="Escolher prévia">{channels.map(({name,icon:Icon},index)=><button key={name} type="button" aria-pressed={scene===index} onClick={()=>{setTick([0,messageSteps,messageSteps+3][index]);setPaused(true)}}><Icon size={17}/>{name}</button>)}<button type="button" aria-label={paused?'Reproduzir apresentação':'Pausar apresentação'} onClick={()=>setPaused(p=>!p)}>{paused?<Play size={16}/>:<Pause size={16}/>}</button></div>
    <div className={styles.links}><a className={styles.action} href={'https://wa.me/'+(settings?.whatsapp||'5598988118091')} target="_blank" rel="noopener noreferrer">{config.whatsappAction} <ArrowUpRight size={18}/></a><a className={styles.action} href={'https://www.instagram.com/'+(settings?.instagram||'meuminiverso')+'/'} target="_blank" rel="noopener noreferrer">@{settings?.instagram||'meuminiverso'} <Instagram size={17}/></a></div>
   </div>
  </div>
 </DeviceMotion>;
}