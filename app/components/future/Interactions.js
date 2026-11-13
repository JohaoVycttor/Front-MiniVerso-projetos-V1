"use client";
import {useEffect} from 'react';
import {usePathname} from 'next/navigation';

const revealSelector = [
 '[data-reveal]', '[data-site-reveal]',
 '.future-hero-masthead p', '.hero-metadata', '.future-hero-content', '.future-hero-bottom',
 '.future-format-explorer', '.future-format-grid article', '.future-featured',
 '.future-values article', '.future-particles', '.future-inquiry',
 '.future-project-main-image', '.future-project-no-media', '.future-video-panel',
 '.future-project-story section', '.future-gallery', '.future-project-next',
 '.footer-topline', '.footer-invitation', '.footer-links', '.future-footer-wordmark',
].join(',');

export default function FutureInteractions(){
 const pathname=usePathname();
 useEffect(()=>{
  if(pathname.startsWith('/admin'))return;
  const main=document.getElementById('conteudo');
  const media=matchMedia('(prefers-reduced-motion: reduce)');
  const compact=matchMedia('(max-width:760px)');
  const states=new Map();
  let observer,rearmObserver,mutations,frame,registerFrame;
  const header=document.querySelector('.future-header');
  const updateHeader=()=>header?.toggleAttribute('data-scrolled',scrollY>24);
  updateHeader();
  addEventListener('scroll',updateHeader,{passive:true});

  function stop(){
   observer?.disconnect();rearmObserver?.disconnect();mutations?.disconnect();
   cancelAnimationFrame(registerFrame);
   states.forEach(state=>state.animation?.cancel());states.clear();
  }
  function setup(){
   stop();
   if(media.matches||!main||!window.IntersectionObserver||!Element.prototype.animate)return;

   function prepare(element,state){
    state.animation?.cancel();
    const distance=compact.matches?20:32;
    const direction=element.getBoundingClientRect().bottom<0?-1:1;
    const animation=element.animate([
     {opacity:0,translate:`0 ${distance*direction}px`},
     {opacity:1,translate:'0 0'},
    ],{duration:compact.matches?650:850,easing:'cubic-bezier(.16,1,.3,1)',fill:'both'});
    animation.pause();
    animation.id='miniverso-scroll-reveal';
    state.animation=animation;
    state.visible=false;
    animation.onfinish=()=>{
     if(state.animation!==animation)return;
     animation.cancel();state.animation=null;
    };
   }

   observer=new IntersectionObserver(entries=>{
    let order=0;
    entries.forEach(entry=>{
     const state=states.get(entry.target);
     if(!entry.isIntersecting||!state||state.visible)return;
     state.visible=true;
     if(entry.target.contains(document.activeElement)){
      state.animation?.cancel();state.animation=null;return;
     }
     if(state.animation){
      state.animation.effect.updateTiming({delay:Math.min(order++,3)*60});
      state.animation.play();
     }
    });
   },{threshold:0,rootMargin:'0px 0px -40px 0px'});

   // Re-arm outside a generous margin, avoiding flicker at the viewport edge.
   rearmObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
    const state=states.get(entry.target);
    if(!state||entry.isIntersecting||!state.visible||entry.target.contains(document.activeElement))return;
    prepare(entry.target,state);
   }),{threshold:0,rootMargin:'220px 0px'});

   function register(){
    registerFrame=null;
    states.forEach((state,element)=>{
     if(element.isConnected)return;
     state.animation?.cancel();observer.unobserve(element);rearmObserver.unobserve(element);states.delete(element);
    });
    const candidates=[...document.querySelectorAll(revealSelector)];
    const candidateSet=new Set(candidates);
    candidates.forEach(element=>{
     if(states.has(element)||element.getBoundingClientRect().height===0)return;
     // A parent and its contents must not move at the same time.
     for(let parent=element.parentElement;parent;parent=parent.parentElement){if(candidateSet.has(parent))return;}
     const state={animation:null,visible:false};
     states.set(element,state);prepare(element,state);
     observer.observe(element);rearmObserver.observe(element);
    });
   }
   register();
   mutations=new MutationObserver(()=>{if(registerFrame==null)registerFrame=requestAnimationFrame(register)});
   mutations.observe(main,{childList:true,subtree:true});
  }
  const focus=event=>states.forEach((state,element)=>{
   if(!element.contains(event.target))return;
   state.animation?.cancel();state.animation=null;state.visible=true;
  });
  frame=requestAnimationFrame(setup);
  media.addEventListener('change',setup);compact.addEventListener('change',setup);
  document.addEventListener('focusin',focus);
  return()=>{
   cancelAnimationFrame(frame);stop();
   media.removeEventListener('change',setup);compact.removeEventListener('change',setup);
   removeEventListener('scroll',updateHeader);document.removeEventListener('focusin',focus);
  };
 },[pathname]);
 return null;
}