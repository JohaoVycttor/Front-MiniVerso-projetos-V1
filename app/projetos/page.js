import {getContent} from '@/lib/portfolio-content';
import {PageShell} from './components/page-shell';
import {SectionRenderer} from './components/sections';
export const dynamic='force-dynamic';
export async function generateMetadata(){const content=await getContent();return {title:'Projetos',description:content.metadata.description}}
export default async function ProjectsPage(){const content=await getContent();return <PageShell content={content}><SectionRenderer content={content}/></PageShell>}
