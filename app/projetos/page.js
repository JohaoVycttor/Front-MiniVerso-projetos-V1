import {getContent} from '@/lib/portfolio-content';
import {PageShell} from './components/page-shell';
import {SectionRenderer} from './components/sections';
import CorePageHero from '@/app/components/CorePageHero';
export const dynamic='force-dynamic';
export async function generateMetadata(){const content=await getContent();const title=content.pageTitle;return {title:title?title.charAt(0).toLocaleUpperCase('pt-BR')+title.slice(1):'Projetos',description:content.metadata.description}}
export default async function ProjectsPage(){
 const content=await getContent();
 const hero=content.sections.find(section=>section.type==='hero'&&section.visible);
 const gallery=content.sections.find(section=>section.type==='projects'&&section.visible);
 const body={...content,sections:content.sections.filter(section=>section.type!=='hero')};
 return <PageShell content={content} continuousBackground>{hero&&<CorePageHero title={content.pageTitle} heading={hero.heading.text} highlight={hero.heading.accent} description={hero.description} image={content.brand.background} video={content.brand.video} poster={content.brand.poster} imagePosition={hero.imagePosition} imageAlt={hero.imageAlt} eyebrow={hero.eyebrow} actionHref={hero.actionHref} actionLabel={hero.actionLabel} scrollHref={gallery?`#${gallery.id}`:hero.scrollHref} scrollLabel={hero.scrollLabel} scrollCueLabel={hero.scrollCueLabel} specialties={hero.specialties} meta={[{label:content.heroMeta.label,value:content.heroMeta.value},{label:content.heroMeta.originLabel,value:content.heroMeta.originValue},{label:content.heroMeta.experiencesLabel,value:content.heroMeta.experiencesValue}]}/>}<SectionRenderer content={body}/></PageShell>;
}
