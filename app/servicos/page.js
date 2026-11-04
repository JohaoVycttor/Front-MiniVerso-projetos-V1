import { getContent } from '@/lib/db';
import { defaultSolutions } from '@/lib/solutions-content';
import { mergeContentDefaults } from '@/lib/content-defaults.js';
import SolutionsPage from './SolutionsPage';
import './solutions.css';
export const dynamic = 'force-dynamic';
export async function generateMetadata(){
 const data=await getContent();
 const title=mergeContentDefaults(data.solutions,defaultSolutions).pageTitle;
 return {title:title?title.charAt(0).toLocaleUpperCase('pt-BR')+title.slice(1):'Soluções'};
}
export default async function ServicesPage(){
 const data=await getContent();
 return <SolutionsPage content={mergeContentDefaults(data.solutions,defaultSolutions)}/>;
}
