import { getContent } from '@/lib/db';
import { defaultSolutions } from '@/lib/solutions-content';
import SolutionsPage from './SolutionsPage';
import './solutions.css';
export const dynamic = 'force-dynamic';
export const metadata = {title:'Soluções'};
export default async function ServicesPage(){
 const data=await getContent();
 return <SolutionsPage content={data.solutions||defaultSolutions}/>;
}
