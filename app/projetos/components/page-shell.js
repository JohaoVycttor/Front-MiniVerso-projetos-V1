import '../portfolio.css';
export function PageShell({content,children}){
 return <div className="portfolio-module"><div className="project-world" style={{'--scene-image':`url("${content.brand.background}")`}}><div className="world-backdrop" aria-hidden="true"/>{children}</div></div>;
}
