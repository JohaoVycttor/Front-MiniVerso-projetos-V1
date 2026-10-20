import {notFound} from 'next/navigation';
import {getContent} from '@/lib/portfolio-content';
import {ProjectDetailView} from '../components/project-detail-view';
export const dynamic='force-dynamic';
export async function generateMetadata({params}) {
 const {slug}=await params;
 const content=await getContent();
 const project=content.projects.find(p=>p.visible&&p.slug===slug);
 return project?{title:project.title,description:project.description}:{};
}
export default async function ProjectDetail({params}) {
 const {slug}=await params;
 const content=await getContent();
 const project=content.projects.find(p=>p.visible&&p.slug===slug);
 if(!project)notFound();
 return <ProjectDetailView project={project} content={content}/>;
}
