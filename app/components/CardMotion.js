'use client';
import {useEffect} from 'react';
import {usePathname} from 'next/navigation';
import './card-motion.css';
const cards='.info-blocks>article,.solution-tile,.solutions-process>article,.studio-cards>article,.home-project,.home-steps>article,.commercial-benefits>article,.cms-cards>article,.home-service,.service-card,.project-card,.featured-project,.case-benefit,.case-story,.case-gallery figure,.contact-state-card,.contact-state-cards>article';
export default function CardMotion(){
 const pathname=usePathname();
 useEffect(()=>{
  if(pathname.startsWith('/admin'))return;
  const root=document.getElementById('conteudo');if(!root)return;
  const preference=matchMedia('(prefers-reduced-motion: reduce)');
  const fine=matchMedia('(hover: hover) and (pointer: fine)');
  const registered=new Set();const pending=new WeakSet();const animations=new Set();
  let pointerFrame=0;let latestPointer;let scanFrame=0;
  const observer=new IntersectionObserver(entries=>{let stagger=0;for(const entry of entries){if(!entry.isIntersecting)continue;observer.unobserve(entry.target);if(preference.matches||document.body.dataset.cardEntrance==='false'||entry.target.closest('[data-motion="off"]'))continue;const animation=entry.target.animate([{opacity:.15,translate:'0 22px'},{opacity:1,translate:'0 0'}],{duration:650,delay:Math.min(stagger++*65,195),easing:'cubic-bezier(.22,1,.36,1)',fill:'backwards'});animations.add(animation);animation.finished.then(()=>{animation.cancel();animations.delete(animation)}).catch(()=>{});}}, {threshold:0.06});
  function scan(){
   scanFrame=0;
   for(const element of root.querySelectorAll(cards)){
    if(registered.has(element))continue;registered.add(element);element.setAttribute('data-interactive-card','');
    const links=[...element.querySelectorAll('a[href]')];
    if(links.length&&new Set(links.map(a=>a.getAttribute('href'))).size===1&&!element.querySelector('button,input,select,textarea,details,video')&&!element.matches('details')){
     element.setAttribute('data-card-link','');links.at(-1).setAttribute('data-card-primary','');
    }
    const ownReveal=element.closest('[data-case-reveal],[data-solutions-reveal],[data-home-reveal],.projects-scroll-reveal,[data-motion="off"]');
    if(!ownReveal&&!element.matches('.home-service')&&!pending.has(element)){
     pending.add(element);if(element.getBoundingClientRect().top>innerHeight)observer.observe(element);
    }
   }
   for(const element of registered)if(!root.contains(element)){observer.unobserve(element);registered.delete(element)}
  }
  function pointerMove(event){
   if(preference.matches||document.body.dataset.cardHover==='false'||!fine.matches||event.pointerType==='touch')return;
   const card=event.target.closest('[data-interactive-card]');if(!card||!root.contains(card)||card.closest('[data-motion="off"]'))return;
   latestPointer={card,x:event.clientX,y:event.clientY};
   if(pointerFrame)return;
   pointerFrame=requestAnimationFrame(()=>{pointerFrame=0;const {card,x,y}=latestPointer;const bounds=card.getBoundingClientRect();card.style.setProperty('--card-x',((x-bounds.left)/bounds.width*100)+'%');card.style.setProperty('--card-y',((y-bounds.top)/bounds.height*100)+'%');});
  }
  function reduce(){if(preference.matches){for(const animation of animations)animation.cancel();animations.clear()}}
  scan();const mutations=new MutationObserver(()=>{if(!scanFrame)scanFrame=requestAnimationFrame(scan)});mutations.observe(root,{childList:true,subtree:true});root.addEventListener('pointermove',pointerMove,{passive:true});preference.addEventListener('change',reduce);
  return()=>{observer.disconnect();mutations.disconnect();cancelAnimationFrame(pointerFrame);cancelAnimationFrame(scanFrame);root.removeEventListener('pointermove',pointerMove);preference.removeEventListener('change',reduce);for(const animation of animations)animation.cancel();for(const element of registered){element.removeAttribute('data-interactive-card');element.removeAttribute('data-card-link');element.querySelectorAll('[data-card-primary]').forEach(a=>a.removeAttribute('data-card-primary'));element.style.removeProperty('--card-x');element.style.removeProperty('--card-y')}};
 },[pathname]);
 return null;
}
