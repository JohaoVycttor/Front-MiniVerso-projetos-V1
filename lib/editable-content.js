import {homeContent,siteContent} from './site-content';
import {defaultStudio,normalizeStudio} from './studio-content';
import {defaultSolutions} from './solutions-content';
import {defaultContact} from './contact-content';
import defaultPortfolio from '@/data/portfolio-default.json';
import {projectDetail} from './project-detail';
export function editableContent(data){
 const portfolio=structuredClone(data.portfolio||defaultPortfolio);
 portfolio.projects=portfolio.projects.map(project=>({...project,detail:projectDetail(project)}));
 return {...data,site:siteContent(data),home:homeContent(data),studio:normalizeStudio(data.studio||defaultStudio),solutions:data.solutions||structuredClone(defaultSolutions),contactPage:data.contactPage||structuredClone(defaultContact),portfolio};
}
