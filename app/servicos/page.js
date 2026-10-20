import {pageMetadata} from "@/lib/page-metadata";
﻿import { getContent } from '@/lib/db';
import { defaultSolutions } from '@/lib/solutions-content';
import SolutionsPage from './SolutionsPage';
import './solutions.css';
export const dynamic = 'force-dynamic';

export default async function ServicesPage(){
 const data=await getContent();
 return <SolutionsPage content={data.solutions||defaultSolutions}/>;
}

export async function generateMetadata(){return pageMetadata("solutions")}
