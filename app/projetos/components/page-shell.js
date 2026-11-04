import '../portfolio.css';
import '@/app/components/core-page.css';
import '../portfolio-core.css';
export function PageShell({content,children,continuousBackground=false}){
 const scene=`url(${JSON.stringify(content.brand.background)})`;
 return <div className={`portfolio-module core-page portfolio-core${continuousBackground?' portfolio-continuous':''}`} style={{'--core-image':scene}}><div className="project-world" style={{'--scene-image':scene}}><div className="world-backdrop" aria-hidden="true"/>{children}</div></div>;
}
