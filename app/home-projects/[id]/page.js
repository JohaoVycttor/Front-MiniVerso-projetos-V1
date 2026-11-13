
import {notFound,redirect} from 'next/navigation';
import {getSiteContent,visibleSiteProjects} from '@/lib/site-content';
export const dynamic='force-dynamic';
export default async function LegacyProject({params}){
 const {id}=await params;const site=await getSiteContent();
 const project=visibleSiteProjects(site).find(project=>project.id===id);
 if(!project)notFound();
 redirect('/projetos/'+project.slug);
}
