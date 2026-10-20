"use client";
import {useEffect} from "react";
import {usePathname} from "next/navigation";
export default function SiteMotion(){
 const pathname=usePathname();
 useEffect(()=>{
  if(pathname.startsWith("/admin"))return;
  const preference=window.matchMedia("(prefers-reduced-motion: reduce)");
  const main=document.getElementById("conteudo");
  const header=document.querySelector(".site-header");
  const animations=new Set();let observer;let frame;
  const updateHeader=()=>header?.toggleAttribute("data-scrolled",window.scrollY>Number(header?.dataset.scrollThreshold??24));
  updateHeader();window.addEventListener("scroll",updateHeader,{passive:true});
  function stop(){observer?.disconnect();animations.forEach(a=>a.cancel());animations.clear();}
  function animate(element,frames,options){const a=element.animate(frames,options);animations.add(a);a.finished.then(()=>animations.delete(a)).catch(()=>{});}
  function setup(){stop();if(preference.matches||!main||main.querySelector('[data-motion="off"]'))return;
   animate(main,[{opacity:.65},{opacity:1}],{duration:260,easing:"ease-out"});
   observer=new IntersectionObserver(entries=>{let stagger=0;entries.forEach(entry=>{
    if(!entry.isIntersecting)return;
    if(document.body.dataset.cardEntrance==="false"&&entry.target.matches("[data-interactive-card]")){observer.unobserve(entry.target);return;}
    animate(entry.target,[{opacity:0,transform:"translateY(28px)"},{opacity:1,transform:"translateY(0)"}],{duration:850,delay:Math.min(stagger++*85,255),fill:"backwards",easing:"cubic-bezier(.22,1,.36,1)"});
    observer.unobserve(entry.target);
   })},{threshold:.08});
   main.querySelectorAll(".editorial-section>.shell,[data-home-reveal],.home-service,.contact-states-heading,.contact-state-cards,.portfolio-module .section-topline,.portfolio-module .featured-project,.portfolio-module .project-story>section").forEach(element=>{
    if(element.matches(".home-lower .editorial-section>.shell"))return;
    if(element.getBoundingClientRect().top>window.innerHeight)observer.observe(element);
   });
  }
  frame=requestAnimationFrame(setup);preference.addEventListener("change",setup);
  return()=>{cancelAnimationFrame(frame);stop();preference.removeEventListener("change",setup);window.removeEventListener("scroll",updateHeader)};
 },[pathname]);
 return null;
}
