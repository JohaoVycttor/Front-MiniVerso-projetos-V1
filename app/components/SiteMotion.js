"use client";
import {useEffect} from 'react';
import {usePathname} from 'next/navigation';

export default function SiteMotion(){
 const pathname=usePathname();
 useEffect(()=>{
  if(pathname.startsWith('/admin'))return;
  const preference=window.matchMedia('(prefers-reduced-motion: reduce)');
  const main=document.getElementById('conteudo');
  const header=document.querySelector('.site-header');
  const animations=new Set();let observer;let frame;
  const updateHeader=()=>header?.toggleAttribute('data-scrolled',window.scrollY>24);
  updateHeader();window.addEventListener('scroll',updateHeader,{passive:true});
  function stop(){observer?.disconnect();animations.forEach(animation=>animation.cancel());animations.clear();}
  function animate(element,frames,options){const animation=element.animate(frames,options);animations.add(animation);animation.finished.then(()=>animations.delete(animation)).catch(()=>{});}
  function setup(){stop();if(preference.matches||!main)return;
   animate(main,[{opacity:.65},{opacity:1}],{duration:260,easing:'ease-out'});
   observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(!entry.isIntersecting)return;animate(entry.target,[{opacity:0,transform:'translateY(18px)'},{opacity:1,transform:'translateY(0)'}],{duration:560,easing:'cubic-bezier(.22,1,.36,1)'});observer.unobserve(entry.target)}),{threshold:.08});
   main.querySelectorAll('.editorial-section>.shell,.contact-states-heading,.contact-state-cards,.portfolio-module .section-topline,.portfolio-module .featured-project,.portfolio-module .project-story>section').forEach(element=>{if(element.getBoundingClientRect().top>window.innerHeight)observer.observe(element)});
  }
  frame=requestAnimationFrame(setup);preference.addEventListener('change',setup);
  return()=>{cancelAnimationFrame(frame);stop();preference.removeEventListener('change',setup);window.removeEventListener('scroll',updateHeader)};
 },[pathname]);
 return null;
}
