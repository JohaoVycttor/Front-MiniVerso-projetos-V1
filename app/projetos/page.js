import {getContent} from '@/lib/portfolio-content';
import {PageShell} from './components/page-shell';
import {SectionRenderer} from './components/sections';
import CorePageHero from '@/app/components/CorePageHero';
export const dynamic='force-dynamic';
export async function generateMetadata(){const content=await getContent();return {title:'Projetos',description:content.metadata.description}}
export default async function ProjectsPage(){
 const content=await getContent();
 const hero=content.sections.find(section=>section.type==='hero'&&section.visible);
 const gallery=content.sections.find(section=>section.type==='projects'&&section.visible);
 const body={...content,sections:content.sections.filter(section=>section.type!=='hero')};
 return <PageShell content={content} continuousBackground>{hero&&<CorePageHero title="projetos" heading={hero.heading.text} highlight={hero.heading.accent} description={hero.description} image={content.brand.background} imagePosition="center 65%" imageAlt="Cena de realidade virtual da Miniverso" eyebrow="Ideias, experiências e conexões" actionHref="/contato" actionLabel="Vamos criar o próximo" scrollHref={gallery?`#${gallery.id}`:'#conteudo'} scrollLabel="Explore o portfólio" specialties={['Educação','Realidade virtual','Realidade aumentada','Vídeos 360°']}/>}<SectionRenderer content={body}/></PageShell>;
}
