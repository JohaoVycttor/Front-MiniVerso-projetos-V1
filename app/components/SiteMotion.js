"use client";
import {useEffect} from 'react';
import {usePathname} from 'next/navigation';

// Animate content, never the sections that carry the fixed backgrounds.
const revealSelector = [
 '.core-masthead h1', '.core-hero-meta', '.core-hero-copy', '.core-hero-note', '.contact-form-intro', '.reference-home .vr-masthead h1', '.reference-home .vr-hero-meta', '.reference-home .vr-hero-copy', '.reference-home .vr-hero-note', '.managed-home .hero-topline', '.managed-home .hero-content>h1', '.managed-home .hero-bottom',
 '.managed-home .home-history-heading', '.managed-home .home-history-story', '.managed-home .section-heading', '.managed-home .commercial-copy', '.managed-home .commercial-art',
 '.managed-home .project-card', '.managed-home .home-solution-card', '.managed-home .home-grid>article',
 '.reference-home .vr-audience-heading', '.reference-home .vr-audience-list>article', '.reference-home .vr-brand-statement', '.managed-home .contact-band>.shell',
 '.studio-core-masthead h1', '.studio-core-stage-note', '.studio-core-project', '.studio-projects-copy', '.studio-project-deck', '.studio-hero-meta', '.studio-format-console', '.studio-hero-copy', '.studio-story>div', '.studio-section-heading', '.studio-cards>article', '.studio-cta>.studio-container',
 '.solutions-intro', '.solution-tile', '.solutions-section-heading', '.solutions-table-wrap',
 '.solutions-section>h2', '.solutions-section>.solutions-label', '.solutions-process>article', '.solutions-banner>.solutions-container',
 '.portfolio-module .hero-section>*', '.portfolio-module .section-topline', '.portfolio-module .featured-project',
 '.portfolio-module .project-card', '.portfolio-module .contact-inner', '.portfolio-module .detail-title',
 '.portfolio-module .detail-intro', '.portfolio-module .detail-presentation', '.portfolio-module .project-story section',
 '.portfolio-module .detail-information>aside',
 '.contact-intro', '.contact-glass-form', '.contact-aside .contact-glass', '.contact-data-note', '.contact-states-heading',
 '.contact-state-cards>article', '.contact-validation', '.page-hero>.shell',
 '#conteudo>.editorial-section>.shell'
].join(',');

export default function SiteMotion(){
 const pathname=usePathname();
 useEffect(()=>{
  if(pathname.startsWith('/admin'))return;
  const main=document.getElementById('conteudo');
  const header=document.querySelector('.site-header');
  const preference=window.matchMedia('(prefers-reduced-motion: reduce)');
  const compact=window.matchMedia('(max-width:760px)');
  const tracked=new Map();
  let observer, rearmObserver, mutations, frame;
  const updateHeader=()=>header?.toggleAttribute('data-scrolled',window.scrollY>12);
  updateHeader();
  window.addEventListener('scroll',updateHeader,{passive:true});

  function stop(){
   observer?.disconnect();
   rearmObserver?.disconnect();
   mutations?.disconnect();
   tracked.forEach(state=>state.animation?.cancel());
   tracked.clear();
  }
  function setup(){
   stop();
   if(preference.matches||!main||!window.IntersectionObserver)return;
   observer=new IntersectionObserver(entries=>{
    let stagger=0;
    entries.forEach(entry=>{
     const state=tracked.get(entry.target);
     if(!state)return;
     if(!entry.isIntersecting)return;
     if(state.visible)return;
     state.visible=true;
     if(entry.target.contains(document.activeElement))return;
     state.animation?.cancel();
     // Individual translate leaves existing hover transforms intact.
     state.animation=entry.target.animate([
      {opacity:0,translate:state.horizontal?`${state.offset}px 0`:`0 ${state.offset}px`,scale:state.card&&!state.horizontal?'0.94':'1'},
      {opacity:1,translate:'0 0',scale:'1'}
     ],{duration:state.horizontal?600:state.card?1150:900,delay:state.horizontal?0:Math.min(stagger++,3)*100,easing:'cubic-bezier(.16,1,.3,1)',fill:'backwards'});
     state.animation.id='site-scroll-reveal';
    });
   },{threshold:0.12,rootMargin:'0px'});
   // Reset only beyond a safe margin so the animated offset cannot retrigger itself.
   rearmObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
    const state=tracked.get(entry.target);
    if(!state||entry.isIntersecting)return;
    state.visible=false;
    state.offset=((state.horizontal?entry.boundingClientRect.left:entry.boundingClientRect.top)<0?-1:1)*state.distance;
    state.animation?.cancel();
   }),{threshold:0,rootMargin:'160px 0px'});
   function register(){
    tracked.forEach((state,element)=>{
     if(!main.contains(element)){state.animation?.cancel();observer.unobserve(element);rearmObserver.unobserve(element);tracked.delete(element)}
    });
    const candidates=[...main.querySelectorAll(revealSelector)];
    // Avoid animating a block and its children at the same time.
    const elements=candidates.filter(element=>!candidates.some(parent=>parent!==element&&parent.contains(element)));
    elements.forEach(element=>{
     if(tracked.has(element))return;
     const card=element.matches('article,.solution-tile,.project-card,.contact-glass,.contact-glass-form,.commercial-art,.detail-presentation');
     const horizontal=compact.matches&&Boolean(element.closest('.mobile-carousel-track'));
     const distance=horizontal?24:card?96:40;
     tracked.set(element,{visible:false,card,horizontal,distance,offset:((horizontal?element.getBoundingClientRect().left:element.getBoundingClientRect().top)<0?-1:1)*distance});
     observer.observe(element);
     rearmObserver.observe(element);
    });
   }
   register();
   mutations=new MutationObserver(register);
   mutations.observe(main,{childList:true,subtree:true});
  }
  const showFocused=event=>tracked.forEach((state,element)=>{
   if(element.contains(event.target))state.animation?.cancel();
  });
  main?.addEventListener('focusin',showFocused);
  frame=requestAnimationFrame(setup);
  preference.addEventListener('change',setup);
  compact.addEventListener('change',setup);
  return()=>{
   cancelAnimationFrame(frame);stop();
   preference.removeEventListener('change',setup);
   compact.removeEventListener('change',setup);
   main?.removeEventListener('focusin',showFocused);
   window.removeEventListener('scroll',updateHeader);
  };
 },[pathname]);
 return null;
}
