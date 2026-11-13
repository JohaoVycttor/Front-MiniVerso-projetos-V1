import {notFound} from 'next/navigation';
import {getSiteContent,visibleSiteProjects} from '@/lib/site-content';
import {FutureProject} from '@/app/components/future/Pages';
export const dynamic='force-dynamic';
export async function generateMetadata({params}){const {slug}=await params;const site=await getSiteContent();const project=visibleSiteProjects(site).find(project=>project.slug===slug);return project?{title:project.title,description:project.description}:{}}
export default async function Page({params}){const {slug}=await params;const site=await getSiteContent();const project=visibleSiteProjects(site).find(project=>project.slug===slug);if(!project)notFound();return <FutureProject site={site} project={project}/>}