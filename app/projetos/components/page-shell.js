import '../portfolio.css';
export function PageShell({content,children,background,scenePosition}){
 return <div className="portfolio-module"><div className={`project-world${background ? " projects-photo-background" : ""}`} style={{'--case-position':scenePosition,'--scene-image':`url("${background || content.brand.background}")`}}><div className="world-backdrop" aria-hidden="true"/>{children}</div></div>;
}
