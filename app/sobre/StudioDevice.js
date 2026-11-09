import './studio-device.css';

export default function StudioDevice({title,format,image}){
 return <div className="studio-device-showcase" aria-hidden="true">
  <div className="studio-device-halo"/>
  <div className="studio-device-phone">
   <div className="studio-device-screen">
    <div className="studio-device-island"/>
    <div className="studio-device-brand"><img src="/logo-symbol.png" alt=""/><span>miniverso</span></div>
    <div className="studio-device-eyebrow">EXPLORE NOVAS REALIDADES</div>
    <div className="studio-device-title">{title}</div>
    {image?<div className="studio-device-photo"><img src={image} alt="" loading="lazy"/><span>{format}</span></div>:<div className="studio-device-orbit"><i/><i/><span>{format}</span></div>}
    <div className="studio-device-row"><span>CONTEÚDO</span><span>INTERAÇÃO</span></div>
    <div className="studio-device-grid"><span>Educação</span><span>Experiências</span><span>Pessoas</span><span>Possibilidades</span></div>
    <div className="studio-device-action">Uma ideia. Muitos universos. <span>↗</span></div>
    <div className="studio-device-home"/>
   </div>
  </div>
  <div className="studio-device-plinth"><svg viewBox="0 0 340 100" fill="none"><path d="M4 22 197 4 336 28 331 87 141 98 9 76Z" fill="#101217" stroke="#5a606c" strokeWidth=".7"/><path d="m4 22 137 20 199-14M137 42l4 56M197 4l-60 38L9 76m328-48L141 98M4 22l82 65 51-45 105 51-45-89m45 89 94-65" stroke="#6b7180" strokeOpacity=".5" strokeWidth=".7"/></svg></div>
  <div className="studio-device-shadow"/>
  <span className="studio-device-caption">MINIVERSO / {format}</span>
 </div>;
}
