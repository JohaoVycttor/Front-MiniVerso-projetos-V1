import {getContent} from '@/lib/portfolio-content';
import {PageShell} from './components/page-shell';
import {SectionRenderer} from './components/sections';
import CorePageHero from '@/app/components/CorePageHero';
import {brief} from '@/lib/display-text';
export const dynamic='force-dynamic';
export async function generateMetadata(){const content=await getContent();return {title:'Projetos',description:content.metadata.description}}
export default async function ProjectsPage(){
 const content=await getContent();
 const hero=content.sections.find(section=>section.type==='hero'&&section.visible);
 const gallery=content.sections.find(section=>section.type==='projects'&&section.visible);
 const body={...content,sections:content.sections.filter(section=>section.type!=='hero')};
 return <PageShell content={content} continuousBackground>{hero&&<CorePageHero title="projetos" heading={hero.heading.text.charAt(0)+hero.heading.text.slice(1).toLocaleLowerCase('pt-BR')} highlight={hero.heading.accent.toLocaleLowerCase('pt-BR')} description={brief(hero.description)} image={content.brand.background} imagePosition="center 65%" imageAlt="Cena de realidade virtual da Miniverso" eyebrow="Ideias, experiências e conexões" actionHref={gallery?`#${gallery.id}`:'/contato'} actionLabel="Explore o portfólio" scrollHref="/contato" scrollLabel="Vamos criar o próximo" specialties={['Educação','Realidade virtual','Realidade aumentada','Vídeos 360°']}/>}<SectionRenderer content={body}/></PageShell>;
}
