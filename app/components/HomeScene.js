"use client";

import {useEffect,useRef,useSyncExternalStore} from 'react';

const motionQuery='(prefers-reduced-motion: reduce)';
function subscribeReducedMotion(onChange){
 const preference=window.matchMedia(motionQuery);
 preference.addEventListener('change',onChange);
 return()=>preference.removeEventListener('change',onChange);
}
function getReducedMotion(){return window.matchMedia(motionQuery).matches}
function getReducedMotionServerSnapshot(){return true}

export default function HomeScene({image,mobileImage,video,poster,alt}) {
 const scene=useRef(null);
 const reducedMotion=useSyncExternalStore(subscribeReducedMotion,getReducedMotion,getReducedMotionServerSnapshot);
 useEffect(()=>{
  const element=scene.current;
  const preference=matchMedia(motionQuery);
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
  {video?<video src={video} poster={poster||image||undefined} autoPlay={!reducedMotion} muted loop playsInline preload="metadata" aria-hidden="true"/>:<picture>{mobileImage&&<source media="(max-width:620px)" srcSet={mobileImage}/>}<img src={image||'/hero-vr.jpg'} alt={alt} fetchPriority="high"/></picture>}
  <div className="vr-scene-grid" aria-hidden="true"/>
  <div className="vr-scene-orbit" aria-hidden="true"><span/><span/><i/></div>
  <span className="vr-scene-coordinate" aria-hidden="true">MV / IMMERSIVE WORLD — 360°</span>
 </div>;
}
