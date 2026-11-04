"use client";

import {useState} from 'react';
import {Asterisk, Pause, Play} from 'lucide-react';

export default function HomeMarquee({text}) {
 const [paused,setPaused]=useState(false);
 const labels=text.split('\n').map(label=>label.trim()).filter(Boolean);
 if(!labels.length)return null;
 return <div className="discipline-strip home-marquee" data-paused={paused}>
  <div className="home-marquee-window">
   <div className="home-marquee-track">
    {[0,1].map(copy=><div className="home-marquee-group" key={copy} aria-hidden={copy===1?true:undefined}>
     {labels.map((label,i)=><span className="home-discipline" key={i}>{label}<Asterisk aria-hidden="true"/></span>)}
    </div>)}
   </div>
  </div>
  <button type="button" className="home-marquee-toggle" onClick={()=>setPaused(value=>!value)} aria-label={paused?'Retomar faixa animada':'Pausar faixa animada'} aria-pressed={paused}>
   {paused?<Play size={14}/>:<Pause size={14}/>}<span className="home-marquee-control-label">{paused?'Retomar':'Pausar'}</span>
  </button>
 </div>;
}
