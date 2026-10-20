import {pageMetadata} from "@/lib/page-metadata";
import {ScrollReveal} from './components/scroll-reveal';
﻿import {getContent} from '@/lib/portfolio-content';
import {PageShell} from './components/page-shell';
import {SectionRenderer} from './components/sections';
export const dynamic='force-dynamic';
export async function generateMetadata(){return pageMetadata("portfolio")}
export default async function ProjectsPage(){const content=await getContent();return <PageShell content={content} background={content.brand.background}><ScrollReveal><SectionRenderer content={content}/></ScrollReveal></PageShell>}
