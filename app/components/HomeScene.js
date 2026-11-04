"use client";

import {useEffect,useRef} from 'react';

export default function HomeScene({image,mobileImage,alt}) {
 const scene=useRef(null);
 useEffect(()=>{
  const element=scene.current;
  const preference=matchMedia('(prefers-reduced-motion: reduce)');
  let frame;
  const reset=()=>{element.style.setProperty('--scene-x','0px');element.style.setProperty('--scene-y','0px')};
  const move=event=>{
   if(preference.matches||event.pointerType==='touch')return;
   const bounds=element.getBoundingClientRect();
   cancelAnimationFrame(frame);
   frame=requestAnimationFrame(()=>{
    element.style.setProperty('--scene-x',`${((event.clientX-bounds.left)/bounds.width-.5)*-18}px`);
    element.style.setProperty('--scene-y',`${((event.clientY-bounds.top)/bounds.height-.5)*-12}px`);
   });
  };
  element.addEventListener('pointermove',move);
  element.addEventListener('pointerleave',reset);
  preference.addEventListener('change',reset);
  return()=>{cancelAnimationFrame(frame);element.removeEventListener('pointermove',move);element.removeEventListener('pointerleave',reset);preference.removeEventListener('change',reset)};
 },[]);
 return <div className="vr-scene" ref={scene}>
  <picture>{mobileImage&&<source media="(max-width:620px)" srcSet={mobileImage}/>}<img src={image||'/hero-vr.jpg'} alt={alt} fetchPriority="high"/></picture>
  <div className="vr-scene-grid" aria-hidden="true"/>
  <div className="vr-scene-orbit" aria-hidden="true"><span/><span/><i/></div>
  <span className="vr-scene-coordinate" aria-hidden="true">MV / IMMERSIVE WORLD — 360°</span>
 </div>;
}
